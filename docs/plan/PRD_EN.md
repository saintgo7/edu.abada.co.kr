# PRD (Product Requirements Document)
# Product Requirements Document

**Project Name**: Vibe Grade - Student Grading Management System
**Version**: 1.0
**Date**: 2025-01-22
**Status**: Draft

---

## 1. Executive Summary

### 1.1 Project Background
A web-based grading management system is needed to efficiently evaluate and manage GitHub projects for students taking Vibe Coding and Website Development courses. This system improves the inefficiency of manual grading and provides fair and consistent evaluation through automatic GitHub repository analysis.

### 1.2 Project Goals
- Automatic analysis and grading of student projects with just a GitHub URL
- Transparent evaluation system based on checklists
- Student performance statistics and visualization
- Student announcement management and feedback provision
- Deployment and operation with completely free infrastructure

### 1.3 Success Metrics
- 70% reduction in grading time (average 10min → 3min per student)
- 85%+ accuracy in automatic analysis
- System response time under 3 seconds
- Support for 100+ students
- Maintain $0 monthly operating cost

---

## 2. Product Vision

### 2.1 Problem Statement
**Current Problems**:
- Time-consuming manual grading (10-15 minutes per student)
- Inconsistency due to subjective evaluation
- Difficulty in reviewing GitHub code
- Hard to track students' real-time progress
- Inefficient grade data management and statistics generation

**Target Users**:
1. **Professors/Instructors** (Primary User)
   - Student grade management and grading
   - Automatic GitHub project analysis
   - Statistics and report generation

2. **Students** (Secondary User)
   - View personal grades
   - Check feedback
   - Monitor assignment submission status

3. **Academic Administrator** (Tertiary User)
   - View overall grade data
   - CSV/JSON export

### 2.2 Solution Overview
Through automatic project analysis system using GitHub API:
- Auto-count HTML files → Evaluate page count
- Code structure analysis → Detect navigation, responsive design, etc.
- Commit activity analysis → Track project progress
- Automatic checklist suggestion → Apply consistent evaluation criteria

---

## 3. User Stories

### 3.1 Professors/Instructors

#### US-001: Student Registration
**As a** professor
**I want to** register student information individually or in bulk via CSV
**So that** I can quickly input the roster into the system

**Acceptance Criteria**:
- [ ] Can input student ID, name, GitHub URL, deployed URL
- [ ] Bulk registration possible via CSV file upload
- [ ] Validates duplicate student IDs
- [ ] Immediately reflected in the list after registration

**Priority**: P0 (Must Have)

---

#### US-002: GitHub Auto Analysis
**As a** professor
**I want to** click the "Auto Analyze" button after entering a GitHub URL
**So that** the project is automatically analyzed and checklist is suggested

**Acceptance Criteria**:
- [ ] Parses GitHub public repository URL
- [ ] Counts HTML files to determine page count
- [ ] Detects key features like `<nav>`, `<form>`, `@media`
- [ ] Displays commit count and latest commit date
- [ ] Automatically selects checklist items based on analysis results
- [ ] Shows clear error messages on analysis failure

**Priority**: P0 (Must Have)

---

#### US-003: Checklist Grading
**As a** professor
**I want to** check/uncheck checklist items
**So that** I can evaluate students with transparent and consistent criteria

**Acceptance Criteria**:
- [ ] Organized into 6 categories (Basic, Structure, Functionality, Extended, Completion, Excellence)
- [ ] Each item has explicit points
- [ ] Total score calculated in real-time when checked
- [ ] Grade (A+~F) automatically calculated based on 40-point scale

**Priority**: P0 (Must Have)

---

#### US-004: Comprehensive Grade Management
**As a** professor
**I want to** input mini project, presentation, and attendance scores
**So that** the final grade (100 points) can be automatically calculated

**Acceptance Criteria**:
- [ ] Can input Mini Project 1 (10%), 2 (15%)
- [ ] Final website automatically reflected from checklist (40%)
- [ ] Can input Presentation (15%), Weekly Progress (10%), Attendance (10%)
- [ ] Weighted final score calculated in real-time
- [ ] Final grade (A+~F) automatically displayed

**Priority**: P0 (Must Have)

---

#### US-005: Comment Writing
**As a** professor
**I want to** write evaluation comments for each student
**So that** I can provide specific feedback

**Acceptance Criteria**:
- [ ] Can freely input comments in text area
- [ ] Comments are auto-saved
- [ ] Students can only see their own comments

**Priority**: P1 (Should Have)

---

#### US-006: Statistics View
**As a** professor
**I want to** visualize overall student grade distribution and statistics
**So that** I can understand the overall class level and find improvements

**Acceptance Criteria**:
- [ ] Display final grade distribution in bar chart
- [ ] Display website grade distribution in pie chart
- [ ] Provide summary statistics for average, highest, lowest scores
- [ ] Display grading completion rate

**Priority**: P1 (Should Have)

---

#### US-007: Grade Export
**As a** professor
**I want to** export grade data as CSV or JSON
**So that** I can use it in other systems or create reports

**Acceptance Criteria**:
- [ ] Export as CSV file (Excel compatible)
- [ ] Export as JSON file
- [ ] Include student ID, name, each evaluation item score, final score, grade, comments
- [ ] Auto-include date in filename

**Priority**: P1 (Should Have)

---

#### US-008: Announcement Writing
**As a** professor
**I want to** write announcements for students
**So that** I can communicate assignment instructions, deadlines, evaluation criteria

**Acceptance Criteria**:
- [ ] Can input title, content, priority (urgent/normal/info)
- [ ] Manage announcement list (create/edit/delete)
- [ ] Toggle published/unpublished status
- [ ] Display in latest-first order

**Priority**: P1 (Should Have)

---

#### US-009: Bulk Auto Analysis
**As a** professor
**I want to** analyze all students' GitHub projects at once
**So that** I can save significant time

**Acceptance Criteria**:
- [ ] Provide "Bulk Auto Analyze" button
- [ ] Display progress (e.g., 25/100 students completed)
- [ ] Separately display failed items
- [ ] Sequential processing considering GitHub API rate limit

**Priority**: P2 (Nice to Have)

---

### 3.2 Students

#### US-101: Grade Inquiry
**As a** student
**I want to** login with my student ID and view my grades
**So that** I can check my current score and grade

**Acceptance Criteria**:
- [ ] Simple authentication with student ID input
- [ ] Display personal checklist achievement status
- [ ] Show score for each evaluation item
- [ ] Can view professor comments

**Priority**: P1 (Should Have)

---

#### US-102: Announcement Check
**As a** student
**I want to** check announcements written by the professor
**So that** I don't miss assignment requirements and deadlines

**Acceptance Criteria**:
- [ ] Display only published announcements
- [ ] Highlight urgent announcements
- [ ] Sort in latest-first order

**Priority**: P1 (Should Have)

---

#### US-103: Submission Status Check
**As a** student
**I want to** see items I need to submit and current achievement status
**So that** I can know what needs additional improvement

**Acceptance Criteria**:
- [ ] Display unachieved checklist items
- [ ] Guide required points to reach target grade from current score

**Priority**: P2 (Nice to Have)

---

## 4. Functional Requirements

### 4.1 Student Management

#### FR-001: Add Student
- Input student ID (required), name (required), GitHub URL (optional), deployed URL (optional)
- Validate duplicate student ID
- Validation checks (student ID format, URL format)

#### FR-002: CSV Bulk Upload
- CSV file format: `name,studentId,github,url`
- Auto-detect headers (case-insensitive)
- Skip error rows and provide result report

#### FR-003: Student Search
- Real-time search by name or student ID
- Case-insensitive partial match search

#### FR-004: Edit Student Info
- Can edit individual fields
- Track edit history (optional)

#### FR-005: Delete Student
- Deletion confirmation dialog
- CASCADE delete related grade data

---

### 4.2 GitHub Auto Analysis

#### FR-101: Repository Structure Analysis
- Query file tree via GitHub API
- Count `.html` extension files
- Check existence of `README.md`, `.css`, `.js` files

#### FR-102: HTML Content Analysis
- Download and parse main HTML files
- Detect `<nav>` tag → Navigation menu
- Detect `<form>` tag → Contact form
- Detect `<meta name="viewport">` → Responsive
- Detect `@media` queries in CSS → Responsive

#### FR-103: Feature Detection
- `:hover`, `animation`, `transition` → Animation
- `data-theme`, `.dark-mode` → Dark mode
- Detect external API call code → External service integration

#### FR-104: Commit Analysis
- Query total commit count
- Recent commit date and activity evaluation

#### FR-105: Automatic Checklist Suggestion
- Auto-select checklist items based on analysis results
- Professor can review and modify

#### FR-106: Analysis Caching
- Use cache for re-analysis of same URL within 24 hours
- Provide manual refresh option

---

### 4.3 Grading System

#### FR-201: Checklist Grading
- 6 categories, 18 total items
- Auto-sum points when items checked
- Real-time score calculation (0-40 points)
- Auto-calculate grade (A+: 38+, A: 34+, B+: 28+, ...)

#### FR-202: Other Evaluation Input
- Mini Project 1, 2
- Final Presentation
- Weekly Progress
- Attendance
- Validate each item in 0-100 point range

#### FR-203: Final Grade Calculation
```
Final Score = Mini1×10% + Mini2×15% + Website×40% + Presentation×15% + Progress×10% + Attendance×10%
```
- Auto-apply weights
- Display to second decimal place
- Auto-assign final grade

#### FR-204: Comment Management
- Markdown support (optional)
- Auto-save
- No character limit

---

### 4.4 Statistics & Reports

#### FR-301: Grade Distribution Charts
- Bar chart: Final grade distribution (A+, A, B+, ...)
- Pie chart: Website grade distribution
- Interactive charts (Recharts)

#### FR-302: Summary Statistics
- Average score (final, website)
- Highest/lowest score
- Median (optional)
- Standard deviation (optional)

#### FR-303: CSV Export
- UTF-8 BOM encoding (Korean support)
- Headers: Student ID, Name, GitHub, URL, each evaluation item, final score, grade, comments
- Filename: `vibe-grade-YYYY-MM-DD.csv`

#### FR-304: JSON Export
- Structured full data
- Include indentation (readability)
- Filename: `vibe-grade-YYYY-MM-DD.json`

---

### 4.5 Announcements

#### FR-401: Announcement Creation
- Title (required, max 200 chars)
- Content (required, Markdown support)
- Priority: urgent, normal, info
- Published/unpublished toggle

#### FR-402: Announcement Management
- View list (latest-first)
- Edit/delete
- Toggle published status

#### FR-403: Student View
- Display only published announcements
- Pin urgent announcements to top
- Display creation date

---

### 4.6 Authentication & Authorization

#### FR-501: Admin Login
- Username/password
- Issue JWT token
- Maintain session (7 days)

#### FR-502: Student Simple Auth
- Query with student ID only (no password)
- Read-only mode

#### FR-503: Permission Management
- Admin: Access all features
- Student: View own grades only

---

## 5. Non-Functional Requirements

### 5.1 Performance

#### NFR-001: Response Time
- Page load: Within 3 seconds
- API response: Within 1 second
- GitHub auto-analysis: Within 10 seconds

#### NFR-002: Concurrent Users
- Support minimum 50 concurrent connections
- Analysis request queue management

#### NFR-003: Database Performance
- Query optimization (index usage)
- Connection pooling

---

### 5.2 Scalability

#### NFR-101: Student Count
- Support minimum 1,000 students
- Database capacity: Within 500MB (free tier)

#### NFR-102: Horizontal Scaling
- Cloudflare Workers auto-scaling
- Serverless architecture

---

### 5.3 Security

#### NFR-201: Data Protection
- Force HTTPS (SSL/TLS)
- Prevent SQL Injection (Parameterized queries)
- Prevent XSS (Input sanitization)

#### NFR-202: Authentication
- JWT token encryption
- Password hashing (bcrypt)

#### NFR-203: API Protection
- Rate limiting (IP-based)
- CORS policy configuration

---

### 5.4 Usability

#### NFR-301: Responsive Design
- Desktop (1920px+)
- Tablet (768px~1024px)
- Mobile (320px~767px)

#### NFR-302: Accessibility
- WCAG 2.1 AA level (target)
- Keyboard navigation support
- Clear error messages

#### NFR-303: Browser Compatibility
- Chrome 100+
- Firefox 100+
- Safari 15+
- Edge 100+

---

### 5.5 Reliability

#### NFR-401: Availability
- 99%+ uptime
- Utilize Cloudflare CDN

#### NFR-402: Data Backup
- Neon auto-backup (7 days)
- Recommend weekly manual backup

#### NFR-403: Error Handling
- Clear error messages
- Retry logic (on API failure)
- Fallback UI

---

### 5.6 Maintainability

#### NFR-501: Code Quality
- Follow ESLint rules
- Component reusability
- Clear function/variable names

#### NFR-502: Documentation
- API documentation (Swagger/OpenAPI)
- Code comments (complex logic only)
- README and deployment guide

---

## 6. Constraints

### 6.1 Technical Constraints
- **Use Free Infrastructure**: Cloudflare Pages, Neon PostgreSQL free tier
- **GitHub API Rate Limit**: 60 requests per hour (5,000 with authentication)
- **Cloudflare Workers**: 100,000 daily request limit
- **Neon DB**: 0.5GB storage limit

### 6.2 Schedule Constraints
- **MVP Launch**: Within 2 weeks of development start
- **Full Feature Completion**: Within 4 weeks

### 6.3 Resource Constraints
- **Development Staff**: 1-2 people
- **Budget**: $0 (completely free)

---

## 7. Assumptions & Dependencies

### 7.1 Assumptions
- All GitHub repositories set as public
- Students use standard HTML/CSS/JS (no framework restrictions)
- Domain `edu.abada.co.kr` available
- Use only in internet-connected environment

### 7.2 Dependencies
- **GitHub API**: Requires normal GitHub service operation
- **Cloudflare**: Normal operation of Pages, Workers, DNS services
- **Neon PostgreSQL**: Database service availability
- **Browser**: JavaScript must be enabled

---

## 8. Priority & Roadmap

### Phase 1: MVP (2 weeks)
**Goal**: Basic grading functionality and deployment

- [P0] Add/manage students
- [P0] Manual checklist grading
- [P0] Other evaluation input and final grade calculation
- [P0] GitHub auto-analysis (basic)
- [P1] CSV export
- [P1] Database integration
- [P1] Cloudflare Pages deployment

### Phase 2: Automation Enhancement (2 weeks)
**Goal**: Improve auto-analysis accuracy and statistics

- [P0] Advanced GitHub analysis logic
- [P1] Statistics and charts
- [P1] Announcement feature
- [P1] Bulk analysis
- [P2] Analysis caching

### Phase 3: Student Features (1 week)
**Goal**: Student dashboard

- [P1] Student login and grade inquiry
- [P1] Student announcement view
- [P2] Submission status check

### Phase 4: Optimization (1 week)
**Goal**: Performance and UX improvement

- [P2] Performance optimization
- [P2] Enhanced error handling
- [P2] Accessibility improvement
- [P2] Mobile optimization

---

## 9. Risks & Mitigation

### Risk-001: GitHub API Rate Limit Exceeded
**Probability**: High | **Impact**: High
- **Mitigation**: Use Personal Access Token (5,000 req/h)
- **Mitigation**: Analysis caching (24 hours)
- **Mitigation**: Queue management for bulk analysis

### Risk-002: HTML Parsing Errors
**Probability**: Medium | **Impact**: Medium
- **Mitigation**: Try-catch error handling
- **Mitigation**: Provide manual grading option
- **Mitigation**: Display analysis confidence

### Risk-003: Free DB Capacity Exceeded
**Probability**: Low | **Impact**: High
- **Mitigation**: Regular data cleanup
- **Mitigation**: Delete old analysis cache
- **Mitigation**: Plan for paid tier upgrade if needed

### Risk-004: Concurrent Connection Overload
**Probability**: Low | **Impact**: Medium
- **Mitigation**: Cloudflare CDN caching
- **Mitigation**: API rate limiting
- **Mitigation**: Serverless auto-scaling

---

## 10. Approval & Change Log

### Approval
| Role | Name | Signature | Date |
|------|------|-----------|------|
| Product Owner | - | - | 2025-01-22 |
| Technical Lead | - | - | 2025-01-22 |
| Project Manager | - | - | 2025-01-22 |

### Change Log
| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2025-01-22 | Initial draft | - |

---

**End of Document**
