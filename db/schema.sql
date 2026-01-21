-- Vibe Grade Database Schema
-- PostgreSQL 14+
-- Neon Serverless PostgreSQL compatible

-- Enable UUID extension (optional, for future use)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. Students Table
-- ============================================
CREATE TABLE IF NOT EXISTS students (
  id SERIAL PRIMARY KEY,
  student_id VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  github_url TEXT,
  deployed_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for students
CREATE INDEX IF NOT EXISTS idx_students_student_id ON students(student_id);
CREATE INDEX IF NOT EXISTS idx_students_name ON students(name);
CREATE INDEX IF NOT EXISTS idx_students_created_at ON students(created_at DESC);

-- Comments
COMMENT ON TABLE students IS 'Student information table';
COMMENT ON COLUMN students.student_id IS 'Unique student ID (e.g., 20251001)';
COMMENT ON COLUMN students.github_url IS 'GitHub repository URL';
COMMENT ON COLUMN students.deployed_url IS 'Deployed website URL';

-- ============================================
-- 2. Grades Table
-- ============================================
CREATE TABLE IF NOT EXISTS grades (
  id SERIAL PRIMARY KEY,
  student_id INTEGER UNIQUE NOT NULL REFERENCES students(id) ON DELETE CASCADE,

  -- Checklist (stored as JSONB)
  checklist JSONB DEFAULT '{}',
  website_score INTEGER DEFAULT 0 CHECK (website_score >= 0 AND website_score <= 40),
  website_grade VARCHAR(2),

  -- Other evaluation items (0-100 scale)
  mini_project1 INTEGER DEFAULT 0 CHECK (mini_project1 >= 0 AND mini_project1 <= 100),
  mini_project2 INTEGER DEFAULT 0 CHECK (mini_project2 >= 0 AND mini_project2 <= 100),
  presentation INTEGER DEFAULT 0 CHECK (presentation >= 0 AND presentation <= 100),
  weekly_progress INTEGER DEFAULT 0 CHECK (weekly_progress >= 0 AND weekly_progress <= 100),
  attendance INTEGER DEFAULT 0 CHECK (attendance >= 0 AND attendance <= 100),

  -- Comment
  comment TEXT,

  -- Auto-analysis result (stored as JSONB)
  auto_analysis JSONB,
  last_analyzed_at TIMESTAMP,

  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for grades
CREATE INDEX IF NOT EXISTS idx_grades_student_id ON grades(student_id);
CREATE INDEX IF NOT EXISTS idx_grades_website_score ON grades(website_score DESC);
CREATE INDEX IF NOT EXISTS idx_grades_checklist ON grades USING GIN (checklist);
CREATE INDEX IF NOT EXISTS idx_grades_auto_analysis ON grades USING GIN (auto_analysis);

-- Comments
COMMENT ON TABLE grades IS 'Student grades and evaluation data';
COMMENT ON COLUMN grades.checklist IS 'Checklist items as JSON: {"page1": 6, "github": 3, ...}';
COMMENT ON COLUMN grades.auto_analysis IS 'GitHub auto-analysis result as JSON';

-- ============================================
-- 3. Announcements Table
-- ============================================
CREATE TABLE IF NOT EXISTS announcements (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('urgent', 'normal', 'info')),
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for announcements
CREATE INDEX IF NOT EXISTS idx_announcements_published ON announcements(published, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_announcements_priority ON announcements(priority, created_at DESC);

-- Comments
COMMENT ON TABLE announcements IS 'Announcements for students';
COMMENT ON COLUMN announcements.priority IS 'Priority: urgent, normal, info';

-- ============================================
-- 4. Analysis Cache Table
-- ============================================
CREATE TABLE IF NOT EXISTS analysis_cache (
  id SERIAL PRIMARY KEY,
  github_url TEXT UNIQUE NOT NULL,
  analysis_result JSONB NOT NULL,
  analyzed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL '24 hours')
);

-- Indexes for analysis_cache
CREATE INDEX IF NOT EXISTS idx_cache_github_url ON analysis_cache(github_url);
CREATE INDEX IF NOT EXISTS idx_cache_expires_at ON analysis_cache(expires_at);

-- Comments
COMMENT ON TABLE analysis_cache IS 'Cache for GitHub analysis results (24h TTL)';

-- ============================================
-- 5. Admin Users Table
-- ============================================
CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'admin' CHECK (role IN ('admin', 'instructor')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for admin_users
CREATE INDEX IF NOT EXISTS idx_admin_username ON admin_users(username);

-- Comments
COMMENT ON TABLE admin_users IS 'Admin and instructor accounts';
COMMENT ON COLUMN admin_users.password_hash IS 'Hashed password (bcrypt or SHA-256)';

-- ============================================
-- Triggers for updated_at
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for students table
DROP TRIGGER IF EXISTS update_students_updated_at ON students;
CREATE TRIGGER update_students_updated_at
  BEFORE UPDATE ON students
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for grades table
DROP TRIGGER IF EXISTS update_grades_updated_at ON grades;
CREATE TRIGGER update_grades_updated_at
  BEFORE UPDATE ON grades
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for announcements table
DROP TRIGGER IF EXISTS update_announcements_updated_at ON announcements;
CREATE TRIGGER update_announcements_updated_at
  BEFORE UPDATE ON announcements
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Clean up expired cache (run periodically)
-- ============================================

-- Function to delete expired cache entries
CREATE OR REPLACE FUNCTION cleanup_expired_cache()
RETURNS void AS $$
BEGIN
  DELETE FROM analysis_cache WHERE expires_at < CURRENT_TIMESTAMP;
END;
$$ LANGUAGE plpgsql;

-- Note: Run this manually or set up a cron job
-- Example: SELECT cleanup_expired_cache();

-- ============================================
-- Sample Data (for testing)
-- ============================================

-- Insert default admin user
-- Password: "admin123" (you should change this!)
-- Hash generated with: echo -n "admin123" | sha256sum
INSERT INTO admin_users (username, password_hash, role)
VALUES ('admin', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'admin')
ON CONFLICT (username) DO NOTHING;

-- Insert sample announcement
INSERT INTO announcements (title, content, priority, published)
VALUES
  ('시스템 오픈', '바이브 그레이드 시스템이 오픈되었습니다. GitHub URL을 제출해주세요.', 'urgent', true),
  ('과제 안내', '최종 웹사이트 프로젝트 제출 마감일은 2025년 6월 15일입니다.', 'normal', true)
ON CONFLICT DO NOTHING;

-- ============================================
-- Views (optional, for convenience)
-- ============================================

-- View: Student grades with final score
CREATE OR REPLACE VIEW v_student_grades AS
SELECT
  s.id,
  s.student_id,
  s.name,
  s.github_url,
  s.deployed_url,
  g.website_score,
  g.website_grade,
  g.mini_project1,
  g.mini_project2,
  g.presentation,
  g.weekly_progress,
  g.attendance,
  -- Calculate final score
  (
    (g.mini_project1 * 0.1) +
    (g.mini_project2 * 0.15) +
    ((g.website_score::FLOAT / 40 * 100) * 0.4) +
    (g.presentation * 0.15) +
    (g.weekly_progress * 0.1) +
    (g.attendance * 0.1)
  ) AS final_score,
  g.comment,
  g.last_analyzed_at,
  s.created_at
FROM students s
LEFT JOIN grades g ON s.id = g.student_id
ORDER BY s.student_id;

-- ============================================
-- Grants (if needed for specific users)
-- ============================================

-- Grant permissions (adjust as needed)
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO your_user;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO your_user;

-- ============================================
-- Schema Version
-- ============================================

-- Track schema version
CREATE TABLE IF NOT EXISTS schema_version (
  version VARCHAR(10) PRIMARY KEY,
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO schema_version (version) VALUES ('1.0.0')
ON CONFLICT (version) DO NOTHING;

-- ============================================
-- End of Schema
-- ============================================

-- Verify tables created
SELECT
  schemaname,
  tablename,
  tableowner
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- Show table sizes
SELECT
  relname AS table_name,
  pg_size_pretty(pg_total_relation_size(relid)) AS total_size
FROM pg_catalog.pg_statio_user_tables
ORDER BY pg_total_relation_size(relid) DESC;
