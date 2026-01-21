import React, { useState, useMemo, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';

// 체크리스트 항목 정의 (40점 만점)
const CHECKLIST_ITEMS = {
  basic: {
    title: '기본',
    items: [
      { id: 'page1', label: '1페이지 완성', points: 6 },
      { id: 'github', label: 'GitHub 업로드', points: 3 },
      { id: 'basicStyle', label: '기본 스타일 적용', points: 3 },
    ]
  },
  structure: {
    title: '구조',
    items: [
      { id: 'page2', label: '2페이지 이상', points: 2 },
      { id: 'navigation', label: '네비게이션 메뉴', points: 1 },
      { id: 'responsive', label: '반응형 디자인', points: 2 },
      { id: 'deployed', label: 'URL 배포 완료', points: 1 },
    ]
  },
  functionality: {
    title: '기능',
    items: [
      { id: 'page3', label: '3페이지 이상', points: 2 },
      { id: 'contactForm', label: '연락처 폼 작동', points: 2 },
      { id: 'hoverAnimation', label: '호버/애니메이션', points: 1 },
      { id: 'unifiedDesign', label: '통일된 디자인', points: 1 },
    ]
  },
  extended: {
    title: '확장',
    items: [
      { id: 'page4', label: '4페이지 이상', points: 2 },
      { id: 'darkMode', label: '다크모드/테마 변경', points: 2 },
      { id: 'scrollAnimation', label: '스크롤 애니메이션', points: 1 },
      { id: 'externalService', label: '외부 서비스 연동', points: 1 },
    ]
  },
  completion: {
    title: '완성도',
    items: [
      { id: 'page5', label: '5페이지 이상', points: 1 },
      { id: 'projectGallery', label: '프로젝트 갤러리', points: 2 },
      { id: 'sliderModal', label: '이미지 슬라이더/모달', points: 1 },
      { id: 'loadingTransition', label: '로딩/전환 효과', points: 1 },
      { id: 'designQuality', label: '디자인 완성도', points: 1 },
    ]
  },
  excellence: {
    title: '탁월함',
    items: [
      { id: 'page6', label: '6페이지 이상', points: 1 },
      { id: 'advancedFeatures', label: '고급 기능 2개 이상', points: 2 },
      { id: 'originality', label: '독창성/차별화', points: 1 },
    ]
  }
};

// 등급 변환 함수
const getGradeFromScore = (score) => {
  if (score >= 38) return { grade: 'A+', color: '#10b981' };
  if (score >= 34) return { grade: 'A', color: '#22c55e' };
  if (score >= 28) return { grade: 'B+', color: '#84cc16' };
  if (score >= 22) return { grade: 'B', color: '#eab308' };
  if (score >= 16) return { grade: 'C', color: '#f97316' };
  if (score >= 12) return { grade: 'D', color: '#ef4444' };
  return { grade: 'F', color: '#dc2626' };
};

// 최종 성적 계산 (100점 만점)
const calculateFinalGrade = (student) => {
  const mp1 = (student.miniProject1 || 0) * 0.1;
  const mp2 = (student.miniProject2 || 0) * 0.15;
  const finalWeb = ((student.websiteScore || 0) / 40 * 100) * 0.4;
  const presentation = (student.presentation || 0) * 0.15;
  const weekly = (student.weeklyProgress || 0) * 0.1;
  const attendance = (student.attendance || 0) * 0.1;
  
  return mp1 + mp2 + finalWeb + presentation + weekly + attendance;
};

const getFinalGrade = (score) => {
  if (score >= 95) return { grade: 'A+', color: '#10b981' };
  if (score >= 90) return { grade: 'A', color: '#22c55e' };
  if (score >= 85) return { grade: 'B+', color: '#84cc16' };
  if (score >= 80) return { grade: 'B', color: '#eab308' };
  if (score >= 75) return { grade: 'C+', color: '#f59e0b' };
  if (score >= 70) return { grade: 'C', color: '#f97316' };
  if (score >= 65) return { grade: 'D+', color: '#ef4444' };
  if (score >= 60) return { grade: 'D', color: '#dc2626' };
  return { grade: 'F', color: '#991b1b' };
};

export default function VibeGrade() {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [activeTab, setActiveTab] = useState('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [newStudent, setNewStudent] = useState({ name: '', studentId: '', githubUrl: '', deployedUrl: '' });

  // 학생 추가
  const addStudent = useCallback(() => {
    if (!newStudent.name || !newStudent.studentId) return;
    
    const student = {
      id: Date.now(),
      ...newStudent,
      checklist: {},
      websiteScore: 0,
      websiteGrade: 'F',
      miniProject1: 0,
      miniProject2: 0,
      presentation: 0,
      weeklyProgress: 0,
      attendance: 0,
      comment: ''
    };
    
    setStudents(prev => [...prev, student]);
    setNewStudent({ name: '', studentId: '', githubUrl: '', deployedUrl: '' });
  }, [newStudent]);

  // CSV 파싱 및 업로드
  const handleCSVUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const lines = text.split('\n').filter(line => line.trim());
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      
      const newStudents = lines.slice(1).map((line, idx) => {
        const values = line.split(',').map(v => v.trim());
        const student = {
          id: Date.now() + idx,
          name: values[headers.indexOf('name')] || values[0] || '',
          studentId: values[headers.indexOf('studentid')] || values[headers.indexOf('id')] || values[1] || '',
          githubUrl: values[headers.indexOf('github')] || values[headers.indexOf('githuburl')] || '',
          deployedUrl: values[headers.indexOf('url')] || values[headers.indexOf('deployedurl')] || '',
          checklist: {},
          websiteScore: 0,
          websiteGrade: 'F',
          miniProject1: 0,
          miniProject2: 0,
          presentation: 0,
          weeklyProgress: 0,
          attendance: 0,
          comment: ''
        };
        return student;
      }).filter(s => s.name);
      
      setStudents(prev => [...prev, ...newStudents]);
    };
    reader.readAsText(file);
    e.target.value = '';
  }, []);

  // 체크리스트 토글
  const toggleChecklist = useCallback((studentId, itemId, points) => {
    setStudents(prev => prev.map(student => {
      if (student.id !== studentId) return student;
      
      const newChecklist = { ...student.checklist };
      if (newChecklist[itemId]) {
        delete newChecklist[itemId];
      } else {
        newChecklist[itemId] = points;
      }
      
      const websiteScore = Object.values(newChecklist).reduce((sum, p) => sum + p, 0);
      const { grade } = getGradeFromScore(websiteScore);
      
      return {
        ...student,
        checklist: newChecklist,
        websiteScore,
        websiteGrade: grade
      };
    }));
  }, []);

  // 점수 업데이트
  const updateScore = useCallback((studentId, field, value) => {
    setStudents(prev => prev.map(student => {
      if (student.id !== studentId) return student;
      return { ...student, [field]: Math.min(100, Math.max(0, Number(value) || 0)) };
    }));
  }, []);

  // 코멘트 업데이트
  const updateComment = useCallback((studentId, comment) => {
    setStudents(prev => prev.map(student => {
      if (student.id !== studentId) return student;
      return { ...student, comment };
    }));
  }, []);

  // 학생 삭제
  const deleteStudent = useCallback((studentId) => {
    if (window.confirm('정말 이 학생을 삭제하시겠습니까?')) {
      setStudents(prev => prev.filter(s => s.id !== studentId));
      if (selectedStudent?.id === studentId) {
        setSelectedStudent(null);
      }
    }
  }, [selectedStudent]);

  // CSV 내보내기
  const exportCSV = useCallback(() => {
    const headers = ['학번', '이름', 'GitHub URL', '배포 URL', '미니프로젝트1(10%)', '미니프로젝트2(15%)', '웹사이트점수(40점)', '웹사이트등급', '발표(15%)', '주차별진행(10%)', '출석(10%)', '최종점수', '최종등급', '코멘트'];
    const rows = students.map(s => {
      const finalScore = calculateFinalGrade(s);
      const { grade } = getFinalGrade(finalScore);
      return [
        s.studentId,
        s.name,
        s.githubUrl,
        s.deployedUrl,
        s.miniProject1,
        s.miniProject2,
        s.websiteScore,
        s.websiteGrade,
        s.presentation,
        s.weeklyProgress,
        s.attendance,
        finalScore.toFixed(2),
        grade,
        `"${(s.comment || '').replace(/"/g, '""')}"`
      ].join(',');
    });
    
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vibe-grade-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [students]);

  // JSON 내보내기
  const exportJSON = useCallback(() => {
    const data = students.map(s => {
      const finalScore = calculateFinalGrade(s);
      const { grade } = getFinalGrade(finalScore);
      return {
        ...s,
        finalScore: finalScore.toFixed(2),
        finalGrade: grade
      };
    });
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vibe-grade-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [students]);

  // 필터링된 학생 목록
  const filteredStudents = useMemo(() => {
    if (!searchTerm) return students;
    const term = searchTerm.toLowerCase();
    return students.filter(s => 
      s.name.toLowerCase().includes(term) || 
      s.studentId.toLowerCase().includes(term)
    );
  }, [students, searchTerm]);

  // 등급 분포 데이터
  const gradeDistribution = useMemo(() => {
    const distribution = { 'A+': 0, 'A': 0, 'B+': 0, 'B': 0, 'C+': 0, 'C': 0, 'D+': 0, 'D': 0, 'F': 0 };
    students.forEach(s => {
      const finalScore = calculateFinalGrade(s);
      const { grade } = getFinalGrade(finalScore);
      distribution[grade]++;
    });
    return Object.entries(distribution).map(([grade, count]) => ({ grade, count }));
  }, [students]);

  // 웹사이트 등급 분포
  const websiteGradeDistribution = useMemo(() => {
    const distribution = { 'A+': 0, 'A': 0, 'B+': 0, 'B': 0, 'C': 0, 'D': 0, 'F': 0 };
    students.forEach(s => {
      const { grade } = getGradeFromScore(s.websiteScore);
      distribution[grade]++;
    });
    return Object.entries(distribution).map(([grade, count]) => ({ grade, count }));
  }, [students]);

  const COLORS = ['#10b981', '#22c55e', '#84cc16', '#eab308', '#f59e0b', '#f97316', '#ef4444', '#dc2626', '#991b1b'];

  return (
    <div style={styles.container}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Noto+Sans+KR:wght@400;500;600;700&display=swap');
        
        * {
          box-sizing: border-box;
        }
        
        input:focus, textarea:focus, select:focus {
          outline: none;
          border-color: #06b6d4 !important;
          box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.2);
        }
        
        button:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }
        
        button:active {
          transform: translateY(0);
        }
        
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: #1e293b;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #475569;
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #64748b;
        }
        
        .checkbox-item {
          transition: all 0.2s ease;
        }
        
        .checkbox-item:hover {
          background: #334155 !important;
        }
        
        .student-row:hover {
          background: #1e293b !important;
        }
        
        .tab-button {
          transition: all 0.2s ease;
        }
      `}</style>
      
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logo}>
            <span style={styles.logoIcon}>&#9632;</span>
            <h1 style={styles.title}>Vibe Grade</h1>
          </div>
          <p style={styles.subtitle}>바이브코딩과 웹사이트 제작 | 성적 관리 시스템</p>
        </div>
        <div style={styles.headerStats}>
          <div style={styles.statBox}>
            <span style={styles.statNumber}>{students.length}</span>
            <span style={styles.statLabel}>총 학생 수</span>
          </div>
          <div style={styles.statBox}>
            <span style={styles.statNumber}>{students.filter(s => s.websiteScore > 0).length}</span>
            <span style={styles.statLabel}>채점 완료</span>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav style={styles.nav}>
        {[
          { id: 'list', label: '&#9654; 학생 목록' },
          { id: 'grade', label: '&#9733; 채점하기' },
          { id: 'stats', label: '&#9632; 통계' },
          { id: 'export', label: '&#9660; 내보내기' }
        ].map(tab => (
          <button
            key={tab.id}
            className="tab-button"
            onClick={() => setActiveTab(tab.id)}
            style={{
              ...styles.tabButton,
              ...(activeTab === tab.id ? styles.tabButtonActive : {})
            }}
            dangerouslySetInnerHTML={{ __html: tab.label }}
          />
        ))}
      </nav>

      <main style={styles.main}>
        {/* 학생 목록 탭 */}
        {activeTab === 'list' && (
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>학생 관리</h2>
              <div style={styles.actions}>
                <input
                  type="text"
                  placeholder="검색 (이름/학번)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={styles.searchInput}
                />
                <label style={styles.uploadButton}>
                  CSV 업로드
                  <input type="file" accept=".csv" onChange={handleCSVUpload} style={{ display: 'none' }} />
                </label>
              </div>
            </div>

            {/* 학생 추가 폼 */}
            <div style={styles.addForm}>
              <input
                type="text"
                placeholder="학번"
                value={newStudent.studentId}
                onChange={(e) => setNewStudent(prev => ({ ...prev, studentId: e.target.value }))}
                style={styles.input}
              />
              <input
                type="text"
                placeholder="이름"
                value={newStudent.name}
                onChange={(e) => setNewStudent(prev => ({ ...prev, name: e.target.value }))}
                style={styles.input}
              />
              <input
                type="text"
                placeholder="GitHub URL"
                value={newStudent.githubUrl}
                onChange={(e) => setNewStudent(prev => ({ ...prev, githubUrl: e.target.value }))}
                style={styles.input}
              />
              <input
                type="text"
                placeholder="배포 URL"
                value={newStudent.deployedUrl}
                onChange={(e) => setNewStudent(prev => ({ ...prev, deployedUrl: e.target.value }))}
                style={styles.input}
              />
              <button onClick={addStudent} style={styles.addButton}>+ 추가</button>
            </div>

            {/* 학생 테이블 */}
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>학번</th>
                    <th style={styles.th}>이름</th>
                    <th style={styles.th}>GitHub</th>
                    <th style={styles.th}>배포 URL</th>
                    <th style={styles.th}>웹사이트 점수</th>
                    <th style={styles.th}>최종 점수</th>
                    <th style={styles.th}>최종 등급</th>
                    <th style={styles.th}>작업</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map(student => {
                    const finalScore = calculateFinalGrade(student);
                    const { grade, color } = getFinalGrade(finalScore);
                    return (
                      <tr key={student.id} className="student-row" style={styles.tr}>
                        <td style={styles.td}>{student.studentId}</td>
                        <td style={styles.td}><strong>{student.name}</strong></td>
                        <td style={styles.td}>
                          {student.githubUrl && (
                            <a href={student.githubUrl} target="_blank" rel="noopener noreferrer" style={styles.link}>
                              GitHub &#8599;
                            </a>
                          )}
                        </td>
                        <td style={styles.td}>
                          {student.deployedUrl && (
                            <a href={student.deployedUrl} target="_blank" rel="noopener noreferrer" style={styles.link}>
                              배포 사이트 &#8599;
                            </a>
                          )}
                        </td>
                        <td style={styles.td}>
                          <span style={{ ...styles.score, backgroundColor: getGradeFromScore(student.websiteScore).color }}>
                            {student.websiteScore}/40
                          </span>
                        </td>
                        <td style={styles.td}>{finalScore.toFixed(1)}</td>
                        <td style={styles.td}>
                          <span style={{ ...styles.grade, backgroundColor: color }}>{grade}</span>
                        </td>
                        <td style={styles.td}>
                          <button 
                            onClick={() => { setSelectedStudent(student); setActiveTab('grade'); }}
                            style={styles.actionButton}
                          >
                            채점
                          </button>
                          <button 
                            onClick={() => deleteStudent(student.id)}
                            style={styles.deleteButton}
                          >
                            삭제
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filteredStudents.length === 0 && (
                <div style={styles.emptyState}>
                  <p>&#9675; 등록된 학생이 없습니다</p>
                  <p style={{ fontSize: '14px', opacity: 0.7 }}>위 폼에서 학생을 추가하거나 CSV 파일을 업로드하세요</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 채점 탭 */}
        {activeTab === 'grade' && (
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>채점하기</h2>
              {students.length > 0 && (
                <select 
                  value={selectedStudent?.id || ''}
                  onChange={(e) => setSelectedStudent(students.find(s => s.id === Number(e.target.value)))}
                  style={styles.select}
                >
                  <option value="">학생 선택</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.studentId} - {s.name}</option>
                  ))}
                </select>
              )}
            </div>

            {selectedStudent ? (
              <div style={styles.gradingArea}>
                {/* 학생 정보 카드 */}
                <div style={styles.studentCard}>
                  <div style={styles.studentInfo}>
                    <h3 style={styles.studentName}>{selectedStudent.name}</h3>
                    <p style={styles.studentId}>{selectedStudent.studentId}</p>
                  </div>
                  <div style={styles.studentLinks}>
                    {selectedStudent.githubUrl && (
                      <a href={selectedStudent.githubUrl} target="_blank" rel="noopener noreferrer" style={styles.linkButton}>
                        GitHub &#8599;
                      </a>
                    )}
                    {selectedStudent.deployedUrl && (
                      <a href={selectedStudent.deployedUrl} target="_blank" rel="noopener noreferrer" style={styles.linkButton}>
                        배포 사이트 &#8599;
                      </a>
                    )}
                  </div>
                  <div style={styles.scoreDisplay}>
                    <div style={styles.scoreBig}>
                      <span style={styles.scoreValue}>{selectedStudent.websiteScore}</span>
                      <span style={styles.scoreMax}>/40</span>
                    </div>
                    <span style={{ 
                      ...styles.gradeBig, 
                      backgroundColor: getGradeFromScore(selectedStudent.websiteScore).color 
                    }}>
                      {selectedStudent.websiteGrade}
                    </span>
                  </div>
                </div>

                {/* 기타 평가 항목 */}
                <div style={styles.otherScores}>
                  <h4 style={styles.otherScoresTitle}>&#9632; 평가 항목</h4>
                  <div style={styles.scoreGrid}>
                    <div style={styles.scoreItem}>
                      <label style={styles.scoreLabel}>미니 프로젝트 1 (10%)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={selectedStudent.miniProject1}
                        onChange={(e) => updateScore(selectedStudent.id, 'miniProject1', e.target.value)}
                        style={styles.scoreInput}
                      />
                    </div>
                    <div style={styles.scoreItem}>
                      <label style={styles.scoreLabel}>미니 프로젝트 2 (15%)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={selectedStudent.miniProject2}
                        onChange={(e) => updateScore(selectedStudent.id, 'miniProject2', e.target.value)}
                        style={styles.scoreInput}
                      />
                    </div>
                    <div style={styles.scoreItem}>
                      <label style={styles.scoreLabel}>최종 발표 (15%)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={selectedStudent.presentation}
                        onChange={(e) => updateScore(selectedStudent.id, 'presentation', e.target.value)}
                        style={styles.scoreInput}
                      />
                    </div>
                    <div style={styles.scoreItem}>
                      <label style={styles.scoreLabel}>주차별 진행 (10%)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={selectedStudent.weeklyProgress}
                        onChange={(e) => updateScore(selectedStudent.id, 'weeklyProgress', e.target.value)}
                        style={styles.scoreInput}
                      />
                    </div>
                    <div style={styles.scoreItem}>
                      <label style={styles.scoreLabel}>출석 (10%)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={selectedStudent.attendance}
                        onChange={(e) => updateScore(selectedStudent.id, 'attendance', e.target.value)}
                        style={styles.scoreInput}
                      />
                    </div>
                    <div style={styles.scoreItem}>
                      <label style={styles.scoreLabel}>최종 웹사이트 (40%)</label>
                      <div style={styles.websiteScoreDisplay}>
                        {selectedStudent.websiteScore}/40 = {((selectedStudent.websiteScore / 40) * 100).toFixed(1)}점
                      </div>
                    </div>
                  </div>
                  
                  {/* 최종 점수 표시 */}
                  <div style={styles.finalScoreBox}>
                    <span style={styles.finalScoreLabel}>최종 점수</span>
                    <span style={styles.finalScoreValue}>
                      {calculateFinalGrade(selectedStudent).toFixed(2)}점
                    </span>
                    <span style={{ 
                      ...styles.finalGrade,
                      backgroundColor: getFinalGrade(calculateFinalGrade(selectedStudent)).color
                    }}>
                      {getFinalGrade(calculateFinalGrade(selectedStudent)).grade}
                    </span>
                  </div>
                </div>

                {/* 체크리스트 */}
                <div style={styles.checklistContainer}>
                  <h4 style={styles.checklistTitle}>&#9633; 최종 웹사이트 체크리스트 (40점)</h4>
                  <div style={styles.checklistGrid}>
                    {Object.entries(CHECKLIST_ITEMS).map(([category, { title, items }]) => (
                      <div key={category} style={styles.checklistCategory}>
                        <h5 style={styles.categoryTitle}>{title}</h5>
                        {items.map(item => (
                          <label 
                            key={item.id} 
                            className="checkbox-item"
                            style={{
                              ...styles.checkboxLabel,
                              backgroundColor: selectedStudent.checklist[item.id] ? '#0f766e' : '#1e293b'
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={!!selectedStudent.checklist[item.id]}
                              onChange={() => toggleChecklist(selectedStudent.id, item.id, item.points)}
                              style={styles.checkbox}
                            />
                            <span style={styles.checkboxText}>{item.label}</span>
                            <span style={styles.points}>+{item.points}</span>
                          </label>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 코멘트 */}
                <div style={styles.commentSection}>
                  <h4 style={styles.commentTitle}>&#9998; 코멘트</h4>
                  <textarea
                    value={selectedStudent.comment}
                    onChange={(e) => updateComment(selectedStudent.id, e.target.value)}
                    placeholder="채점 코멘트를 입력하세요..."
                    style={styles.textarea}
                  />
                </div>
              </div>
            ) : (
              <div style={styles.emptyState}>
                <p>&#9675; 채점할 학생을 선택하세요</p>
                {students.length === 0 && (
                  <p style={{ fontSize: '14px', opacity: 0.7 }}>먼저 학생 목록에서 학생을 추가하세요</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* 통계 탭 */}
        {activeTab === 'stats' && (
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>성적 통계</h2>
            </div>

            {students.length > 0 ? (
              <div style={styles.statsContainer}>
                <div style={styles.chartBox}>
                  <h4 style={styles.chartTitle}>&#9632; 최종 등급 분포</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={gradeDistribution}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="grade" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" allowDecimals={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                        labelStyle={{ color: '#f1f5f9' }}
                      />
                      <Bar dataKey="count" fill="#06b6d4" radius={[4, 4, 0, 0]}>
                        {gradeDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div style={styles.chartBox}>
                  <h4 style={styles.chartTitle}>&#9675; 웹사이트 등급 분포</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={websiteGradeDistribution.filter(d => d.count > 0)}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="count"
                        label={({ grade, count }) => `${grade}: ${count}명`}
                      >
                        {websiteGradeDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div style={styles.summaryBox}>
                  <h4 style={styles.chartTitle}>&#9733; 요약 통계</h4>
                  <div style={styles.summaryGrid}>
                    <div style={styles.summaryItem}>
                      <span style={styles.summaryLabel}>평균 최종 점수</span>
                      <span style={styles.summaryValue}>
                        {(students.reduce((sum, s) => sum + calculateFinalGrade(s), 0) / students.length).toFixed(2)}점
                      </span>
                    </div>
                    <div style={styles.summaryItem}>
                      <span style={styles.summaryLabel}>평균 웹사이트 점수</span>
                      <span style={styles.summaryValue}>
                        {(students.reduce((sum, s) => sum + s.websiteScore, 0) / students.length).toFixed(2)}/40
                      </span>
                    </div>
                    <div style={styles.summaryItem}>
                      <span style={styles.summaryLabel}>최고 점수</span>
                      <span style={styles.summaryValue}>
                        {Math.max(...students.map(s => calculateFinalGrade(s))).toFixed(2)}점
                      </span>
                    </div>
                    <div style={styles.summaryItem}>
                      <span style={styles.summaryLabel}>최저 점수</span>
                      <span style={styles.summaryValue}>
                        {Math.min(...students.map(s => calculateFinalGrade(s))).toFixed(2)}점
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div style={styles.emptyState}>
                <p>&#9675; 통계를 표시할 데이터가 없습니다</p>
                <p style={{ fontSize: '14px', opacity: 0.7 }}>학생을 추가하고 채점을 시작하세요</p>
              </div>
            )}
          </div>
        )}

        {/* 내보내기 탭 */}
        {activeTab === 'export' && (
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>성적표 내보내기</h2>
            </div>

            <div style={styles.exportContainer}>
              <div style={styles.exportCard}>
                <div style={styles.exportIcon}>CSV</div>
                <h4 style={styles.exportTitle}>CSV 파일</h4>
                <p style={styles.exportDesc}>Excel, 스프레드시트에서 열 수 있는 형식</p>
                <button onClick={exportCSV} style={styles.exportButton} disabled={students.length === 0}>
                  &#9660; CSV 다운로드
                </button>
              </div>

              <div style={styles.exportCard}>
                <div style={styles.exportIcon}>JSON</div>
                <h4 style={styles.exportTitle}>JSON 파일</h4>
                <p style={styles.exportDesc}>프로그래밍 및 데이터 처리용 형식</p>
                <button onClick={exportJSON} style={styles.exportButton} disabled={students.length === 0}>
                  &#9660; JSON 다운로드
                </button>
              </div>

              <div style={styles.exportPreview}>
                <h4 style={styles.previewTitle}>&#9632; 내보내기 미리보기</h4>
                <div style={styles.previewTable}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.th}>학번</th>
                        <th style={styles.th}>이름</th>
                        <th style={styles.th}>웹사이트</th>
                        <th style={styles.th}>최종점수</th>
                        <th style={styles.th}>최종등급</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.slice(0, 5).map(student => {
                        const finalScore = calculateFinalGrade(student);
                        const { grade, color } = getFinalGrade(finalScore);
                        return (
                          <tr key={student.id} style={styles.tr}>
                            <td style={styles.td}>{student.studentId}</td>
                            <td style={styles.td}>{student.name}</td>
                            <td style={styles.td}>{student.websiteScore}/40</td>
                            <td style={styles.td}>{finalScore.toFixed(2)}</td>
                            <td style={styles.td}>
                              <span style={{ ...styles.grade, backgroundColor: color }}>{grade}</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {students.length > 5 && (
                    <p style={styles.moreText}>... 외 {students.length - 5}명</p>
                  )}
                  {students.length === 0 && (
                    <div style={styles.emptyState}>
                      <p>&#9675; 내보낼 데이터가 없습니다</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <p>&#9632; Vibe Grade | 바이브코딩과 웹사이트 제작 성적 관리 시스템</p>
        <p style={{ opacity: 0.6, marginTop: '4px' }}>2025 Computer Software Engineering</p>
      </footer>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0f172a',
    color: '#f1f5f9',
    fontFamily: '"Noto Sans KR", "JetBrains Mono", sans-serif',
  },
  header: {
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
    borderBottom: '1px solid #334155',
    padding: '24px 32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerContent: {},
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  logoIcon: {
    fontSize: '32px',
    color: '#06b6d4',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    margin: 0,
    background: 'linear-gradient(135deg, #06b6d4, #10b981)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontFamily: '"JetBrains Mono", monospace',
  },
  subtitle: {
    marginTop: '8px',
    fontSize: '14px',
    color: '#94a3b8',
  },
  headerStats: {
    display: 'flex',
    gap: '24px',
  },
  statBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '12px 24px',
    backgroundColor: '#1e293b',
    borderRadius: '8px',
    border: '1px solid #334155',
  },
  statNumber: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#06b6d4',
    fontFamily: '"JetBrains Mono", monospace',
  },
  statLabel: {
    fontSize: '12px',
    color: '#94a3b8',
    marginTop: '4px',
  },
  nav: {
    display: 'flex',
    gap: '4px',
    padding: '12px 32px',
    backgroundColor: '#1e293b',
    borderBottom: '1px solid #334155',
  },
  tabButton: {
    padding: '12px 24px',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#94a3b8',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    borderRadius: '6px',
    fontFamily: '"Noto Sans KR", sans-serif',
  },
  tabButtonActive: {
    backgroundColor: '#06b6d4',
    color: '#0f172a',
  },
  main: {
    padding: '24px 32px',
    minHeight: 'calc(100vh - 200px)',
  },
  section: {
    backgroundColor: '#1e293b',
    borderRadius: '12px',
    border: '1px solid #334155',
    padding: '24px',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    flexWrap: 'wrap',
    gap: '16px',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '600',
    margin: 0,
  },
  actions: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  },
  searchInput: {
    padding: '10px 16px',
    backgroundColor: '#0f172a',
    border: '1px solid #334155',
    borderRadius: '6px',
    color: '#f1f5f9',
    fontSize: '14px',
    width: '200px',
  },
  uploadButton: {
    padding: '10px 20px',
    backgroundColor: '#334155',
    border: 'none',
    borderRadius: '6px',
    color: '#f1f5f9',
    fontSize: '14px',
    cursor: 'pointer',
    fontWeight: '500',
  },
  addForm: {
    display: 'flex',
    gap: '12px',
    marginBottom: '24px',
    flexWrap: 'wrap',
  },
  input: {
    padding: '10px 16px',
    backgroundColor: '#0f172a',
    border: '1px solid #334155',
    borderRadius: '6px',
    color: '#f1f5f9',
    fontSize: '14px',
    flex: '1',
    minWidth: '150px',
  },
  addButton: {
    padding: '10px 24px',
    backgroundColor: '#06b6d4',
    border: 'none',
    borderRadius: '6px',
    color: '#0f172a',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  tableContainer: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    padding: '12px 16px',
    textAlign: 'left',
    backgroundColor: '#0f172a',
    color: '#94a3b8',
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    borderBottom: '1px solid #334155',
  },
  tr: {
    borderBottom: '1px solid #334155',
    transition: 'background-color 0.2s',
  },
  td: {
    padding: '12px 16px',
    fontSize: '14px',
  },
  link: {
    color: '#06b6d4',
    textDecoration: 'none',
    fontSize: '13px',
  },
  score: {
    padding: '4px 12px',
    borderRadius: '4px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#0f172a',
  },
  grade: {
    padding: '4px 12px',
    borderRadius: '4px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#fff',
  },
  actionButton: {
    padding: '6px 12px',
    backgroundColor: '#06b6d4',
    border: 'none',
    borderRadius: '4px',
    color: '#0f172a',
    fontSize: '12px',
    fontWeight: '500',
    cursor: 'pointer',
    marginRight: '8px',
  },
  deleteButton: {
    padding: '6px 12px',
    backgroundColor: '#ef4444',
    border: 'none',
    borderRadius: '4px',
    color: '#fff',
    fontSize: '12px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  emptyState: {
    textAlign: 'center',
    padding: '48px',
    color: '#64748b',
    fontSize: '16px',
  },
  select: {
    padding: '10px 16px',
    backgroundColor: '#0f172a',
    border: '1px solid #334155',
    borderRadius: '6px',
    color: '#f1f5f9',
    fontSize: '14px',
    minWidth: '250px',
  },
  gradingArea: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  studentCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 24px',
    backgroundColor: '#0f172a',
    borderRadius: '8px',
    border: '1px solid #334155',
    flexWrap: 'wrap',
    gap: '16px',
  },
  studentInfo: {},
  studentName: {
    fontSize: '24px',
    fontWeight: '600',
    margin: 0,
  },
  studentId: {
    color: '#94a3b8',
    marginTop: '4px',
    fontFamily: '"JetBrains Mono", monospace',
  },
  studentLinks: {
    display: 'flex',
    gap: '12px',
  },
  linkButton: {
    padding: '8px 16px',
    backgroundColor: '#334155',
    borderRadius: '6px',
    color: '#f1f5f9',
    textDecoration: 'none',
    fontSize: '13px',
  },
  scoreDisplay: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  scoreBig: {
    fontFamily: '"JetBrains Mono", monospace',
  },
  scoreValue: {
    fontSize: '48px',
    fontWeight: '700',
    color: '#06b6d4',
  },
  scoreMax: {
    fontSize: '24px',
    color: '#64748b',
  },
  gradeBig: {
    padding: '8px 20px',
    borderRadius: '8px',
    fontSize: '24px',
    fontWeight: '700',
    color: '#fff',
  },
  otherScores: {
    padding: '20px 24px',
    backgroundColor: '#0f172a',
    borderRadius: '8px',
    border: '1px solid #334155',
  },
  otherScoresTitle: {
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '16px',
  },
  scoreGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
  },
  scoreItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  scoreLabel: {
    fontSize: '13px',
    color: '#94a3b8',
  },
  scoreInput: {
    padding: '10px 16px',
    backgroundColor: '#1e293b',
    border: '1px solid #334155',
    borderRadius: '6px',
    color: '#f1f5f9',
    fontSize: '16px',
    fontFamily: '"JetBrains Mono", monospace',
  },
  websiteScoreDisplay: {
    padding: '10px 16px',
    backgroundColor: '#1e293b',
    border: '1px solid #334155',
    borderRadius: '6px',
    color: '#06b6d4',
    fontSize: '16px',
    fontFamily: '"JetBrains Mono", monospace',
  },
  finalScoreBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginTop: '20px',
    padding: '16px 24px',
    backgroundColor: '#1e293b',
    borderRadius: '8px',
    border: '2px solid #06b6d4',
  },
  finalScoreLabel: {
    fontSize: '14px',
    color: '#94a3b8',
  },
  finalScoreValue: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#f1f5f9',
    fontFamily: '"JetBrains Mono", monospace',
  },
  finalGrade: {
    padding: '6px 16px',
    borderRadius: '6px',
    fontSize: '18px',
    fontWeight: '700',
    color: '#fff',
    marginLeft: 'auto',
  },
  checklistContainer: {
    padding: '20px 24px',
    backgroundColor: '#0f172a',
    borderRadius: '8px',
    border: '1px solid #334155',
  },
  checklistTitle: {
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '16px',
  },
  checklistGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
  },
  checklistCategory: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  categoryTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#06b6d4',
    marginBottom: '4px',
    paddingBottom: '8px',
    borderBottom: '1px solid #334155',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    border: '1px solid #334155',
  },
  checkbox: {
    width: '18px',
    height: '18px',
    accentColor: '#06b6d4',
  },
  checkboxText: {
    flex: 1,
    fontSize: '14px',
  },
  points: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#06b6d4',
    fontFamily: '"JetBrains Mono", monospace',
  },
  commentSection: {
    padding: '20px 24px',
    backgroundColor: '#0f172a',
    borderRadius: '8px',
    border: '1px solid #334155',
  },
  commentTitle: {
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '12px',
  },
  textarea: {
    width: '100%',
    minHeight: '100px',
    padding: '12px 16px',
    backgroundColor: '#1e293b',
    border: '1px solid #334155',
    borderRadius: '6px',
    color: '#f1f5f9',
    fontSize: '14px',
    resize: 'vertical',
    fontFamily: '"Noto Sans KR", sans-serif',
  },
  statsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '24px',
  },
  chartBox: {
    padding: '20px',
    backgroundColor: '#0f172a',
    borderRadius: '8px',
    border: '1px solid #334155',
  },
  chartTitle: {
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '16px',
  },
  summaryBox: {
    gridColumn: '1 / -1',
    padding: '20px',
    backgroundColor: '#0f172a',
    borderRadius: '8px',
    border: '1px solid #334155',
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
  },
  summaryItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    padding: '16px',
    backgroundColor: '#1e293b',
    borderRadius: '8px',
  },
  summaryLabel: {
    fontSize: '13px',
    color: '#94a3b8',
  },
  summaryValue: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#06b6d4',
    fontFamily: '"JetBrains Mono", monospace',
  },
  exportContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '24px',
  },
  exportCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '32px',
    backgroundColor: '#0f172a',
    borderRadius: '8px',
    border: '1px solid #334155',
    textAlign: 'center',
  },
  exportIcon: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#06b6d4',
    marginBottom: '16px',
    fontFamily: '"JetBrains Mono", monospace',
    padding: '16px 24px',
    backgroundColor: '#1e293b',
    borderRadius: '8px',
  },
  exportTitle: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '8px',
  },
  exportDesc: {
    fontSize: '14px',
    color: '#94a3b8',
    marginBottom: '20px',
  },
  exportButton: {
    padding: '12px 24px',
    backgroundColor: '#06b6d4',
    border: 'none',
    borderRadius: '6px',
    color: '#0f172a',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    width: '100%',
  },
  exportPreview: {
    gridColumn: '1 / -1',
    padding: '20px',
    backgroundColor: '#0f172a',
    borderRadius: '8px',
    border: '1px solid #334155',
  },
  previewTitle: {
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '16px',
  },
  previewTable: {
    overflowX: 'auto',
  },
  moreText: {
    textAlign: 'center',
    color: '#64748b',
    fontSize: '14px',
    marginTop: '16px',
  },
  footer: {
    textAlign: 'center',
    padding: '24px',
    borderTop: '1px solid #334155',
    color: '#64748b',
    fontSize: '13px',
  },
};
