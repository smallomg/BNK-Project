import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Road.css';

const Road = () => {
  const [activeSection, setActiveSection] = useState(null);
  const [resumeFolders, setResumeFolders] = useState([
    { name: "Resume Files", rating: "★★★☆☆", count: 10 },
    { name: "Resume Files", rating: "★★★★☆", count: 22 },
    { name: "Resume Files", rating: "★★★★☆", count: 15 }
  ]);
  const [coverLetterFolders, setCoverLetterFolders] = useState([
    { name: "Cover Letter Files", rating: "★★★☆☆", count: 10 },
    { name: "Cover Letter Files", rating: "★★★★☆", count: 22 },
    { name: "Cover Letter Files", rating: "★★★★☆", count: 15 }
  ]);
  const [portfolioFolders, setPortfolioFolders] = useState([
    { name: "Portfolio Files", rating: "★★★☆☆", count: 10 },
    { name: "Portfolio Files", rating: "★★★★☆", count: 22 },
    { name: "Portfolio Files", rating: "★★★★☆", count: 15 }
  ]);
  const [recentFiles, setRecentFiles] = useState([
    { name: "Project Discussion", shared: "Private", date: "Just Now", size: "2.56GB" },
    { name: "Client Interview", shared: "2 People", date: "Today, 7:00 PM", size: "2.56GB" },
    { name: "Project Files", shared: "Public Shared", date: "Jan 27, 2019", size: "2.56GB" },
    { name: "Developer Handover", shared: "7 People", date: "Jan 25, 2019", size: "2.56GB" },
    { name: "Preview Image", shared: "3 People", date: "Jan 24, 2019", size: "2.56GB" }
  ]);

  const [evaluationForm, setEvaluationForm] = useState({
    education: '',
    gpa: '',
    certifications: '',
    language: '',
    languageScore: '',
    additionalLanguages: '',
    schoolAwards: '',
    externalAwards: '',
    leadership: '',
    volunteer: '',
    activities: '',
    global: '',
    portfolio: '',
    communication: '',
    problemSolving: '',
    timeManagement: '',
    networking: '',
    selfDevelopment: '',
    entrepreneurship: ''
  });
  const [evaluationResult, setEvaluationResult] = useState(null);

  const [documents, setDocuments] = useState([]);
  const [completedEvaluations, setCompletedEvaluations] = useState([]);
  const [editingEvaluation, setEditingEvaluation] = useState(null);

  useEffect(() => {
    const video = document.getElementById('background-video');
    if (video) {
      video.addEventListener('ended', function() {
        this.currentTime = 0;
        this.play();
      }, false);
    }
    return () => {
      if (video) {
        video.removeEventListener('ended', null);
      }
    };
  }, []);

  useEffect(() => {
    if (activeSection === 'load-list-section' || activeSection === 'completed-evaluation-section') {
      fetchDocumentsToEvaluate();
      fetchCompletedEvaluations();
    }
  }, [activeSection]);

  const displayUploadSection = (sectionId) => {
    setActiveSection(sectionId);
    hideVideo();
  };

  const hideVideo = () => {
    const videoElement = document.getElementById('background-video');
    if (videoElement) {
      videoElement.style.display = 'none';
    }
  };

  const toggleSubMenu = (event) => {
    const subMenu = event.target.nextElementSibling;
    if (subMenu) {
      subMenu.style.display = subMenu.style.display === "block" ? "none" : "block";
    }
  };

  const cancelUpload = () => {
    setActiveSection(null);
  };

  const previewFile = (input, previewId) => {
    const file = input.files[0];
    const preview = document.getElementById(previewId);

    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        if (file.type.startsWith('image/')) {
          preview.innerHTML = `<img src="${e.target.result}" style="max-width: 100%; max-height: 300px;" />`;
        } else if (file.type === 'application/pdf') {
          preview.innerHTML = `<iframe src="${e.target.result}" style="width: 100%; height: 500px;"></iframe>`;
        } else {
          preview.textContent = '미리보기를 지원하지 않는 파일 형식입니다.';
        }
      };
      reader.onerror = function() {
        preview.textContent = '파일을 불러오는데 실패했습니다.';
      };
      reader.readAsDataURL(file);
    } else {
      preview.textContent = '파일을 선택해 주세요.';
    }
  };

  const uploadDocument = async (inputId, sectionId, sectionName) => {
    const fileInput = document.getElementById(inputId);
    if (fileInput && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type_id', sectionName === '이력서' ? '1' : sectionName === '자기소개서' ? '2' : '3');
      formData.append('job_role', document.querySelector(`#${sectionId} select[name="job-role"]`).value);
  
      try {
        const response = await axios.post('http://localhost:3001/api/documents', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log('Upload response:', response.data);
        alert(`${sectionName} 업로드가 완료되었습니다.`);
        fetchDocumentsToEvaluate();
      } catch (error) {
        console.error('Upload error:', error.response ? error.response.data : error);
        alert(`업로드 중 오류가 발생했습니다: ${error.response ? error.response.data.error : error.message}`);
      }
    }
  };

  const handleEvaluationInputChange = (e) => {
    const { id, value } = e.target;
    setEvaluationForm(prev => ({ ...prev, [id]: value }));
  };

  const evaluateProfile = () => {
    let totalScore = 0;
    let detailedScores = {};

    // Education
    if (evaluationForm.education) totalScore += 10;
    const gpa = parseFloat(evaluationForm.gpa);
    if (!isNaN(gpa)) totalScore += Math.min(gpa * 10, 10);
    detailedScores['학력'] = totalScore;

    // Certifications
    const certifications = parseInt(evaluationForm.certifications, 10);
    if (!isNaN(certifications)) totalScore += Math.min(certifications * 5, 15);
    detailedScores['자격증'] = Math.min(certifications * 5, 15);

    // Language
    const languageScore = parseInt(evaluationForm.languageScore, 10);
    if (!isNaN(languageScore)) totalScore += Math.min(languageScore / 100 * 10, 10);
    detailedScores['언어 능력'] = Math.min(languageScore / 100 * 10, 10);

    // Other fields
    const otherFields = ['schoolAwards', 'externalAwards', 'leadership', 'volunteer', 'activities', 'global', 'portfolio', 'communication', 'problemSolving', 'timeManagement', 'networking', 'selfDevelopment', 'entrepreneurship'];
    otherFields.forEach(field => {
      if (evaluationForm[field]) {
        totalScore += 5;
        detailedScores[field] = 5;
      } else {
        detailedScores[field] = 0;
      }
    });

    setEvaluationResult({ totalScore, detailedScores });
  };

  const fetchDocumentsToEvaluate = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/documents-to-evaluate');
      console.log('Fetched documents:', response.data);
      setDocuments(response.data);
    } catch (error) {
      console.error('Fetch error:', error);
      alert('평가할 문서 목록을 불러오는 중 오류가 발생했습니다.');
    }
  };

  const fetchCompletedEvaluations = async () => {
    try {
      console.log('Fetching completed evaluations...');
      const response = await axios.get('http://localhost:3001/api/completed-evaluations');
      console.log('Completed evaluations response:', response);
      setCompletedEvaluations(response.data);
    } catch (error) {
      console.error('Fetch completed evaluations error:', error);
      if (error.response) {
        console.error('Error data:', error.response.data);
        console.error('Error status:', error.response.status);
        console.error('Error headers:', error.response.headers);
      } else if (error.request) {
        console.error('Error request:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
      alert(`완료된 평가 목록을 불러오는 중 오류가 발생했습니다: ${error.message}`);
    }
  };

  const handleEvaluate = async (documentId) => {
    const rating = prompt('평가 점수를 입력하세요 (0-5):');
    const comment = prompt('평가 코멘트를 입력하세요:');

    if (rating !== null && comment !== null) {
      try {
        await axios.post('http://localhost:3001/api/evaluations', {
          document_id: documentId,
          evaluator_id: 1, // 임시로 evaluator_id를 1로 설정. 실제로는 로그인한 평가자의 ID를 사용해야 합니다.
          rating: parseFloat(rating),
          comment
        });
        alert('평가가 완료되었습니다.');
        fetchDocumentsToEvaluate();
        fetchCompletedEvaluations(); // 평가 완료 목록도 즉시 업데이트
      } catch (error) {
        console.error('Evaluation error:', error);
        alert('평가 중 오류가 발생했습니다.');
      }
    }
  };

  const handleDelete = async (evaluationId) => {
    if (window.confirm('정말로 이 평가를 삭제하시겠습니까?')) {
      try {
        await axios.delete(`http://localhost:3001/api/evaluations/${evaluationId}`);
        alert('평가가 성공적으로 삭제되었습니다.');
        fetchCompletedEvaluations();
      } catch (error) {
        console.error('Delete error:', error);
        alert('평가 삭제 중 오류가 발생했습니다.');
      }
    }
  };

  const handleEdit = (evaluation) => {
    setEditingEvaluation(evaluation);
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:3001/api/evaluations/${editingEvaluation.evaluation_id}`, {
        rating: editingEvaluation.rating,
        comment: editingEvaluation.comment
      });
      alert('평가가 성공적으로 수정되었습니다.');
      setEditingEvaluation(null);
      fetchCompletedEvaluations();
    } catch (error) {
      console.error('Update error:', error);
      alert('평가 수정 중 오류가 발생했습니다.');
    }
  };

  return (
    <div>
      <div className="left-side-menu">
        <div className="menu-header">
          <h1>🌟 나의 로드</h1>
        </div>
        <button className="menu-item" onClick={toggleSubMenu}>로드 업로드</button>
        <div className="sub-menu">
          <a href="#" id="upload-resume-link" onClick={() => displayUploadSection('resume-upload-section')}>이력서</a>
          <a href="#" id="upload-cover-letter-link" onClick={() => displayUploadSection('cover-letter-upload-section')}>자기소개서</a>
          <a href="#" id="upload-portfolio-link" onClick={() => displayUploadSection('portfolio-upload-section')}>포트폴리오</a>
        </div>
        <button className="menu-item" onClick={toggleSubMenu}>평가 확인</button>
        <div className="sub-menu">
          <a href="#" id="manage-docs-link" onClick={() => displayUploadSection('document-management')}>평가 확인</a>
          <a href="#" id="badge-evaluation-link" onClick={() => displayUploadSection('badge-evaluation-section')}>ai 평가</a>
        </div>
      </div>

      <div className="left-side-menu evaluator">
        <div className="menu-header">
          <h1>&#128081; 오픈 뱃지</h1>
        </div>
        <button className="menu-item" onClick={toggleSubMenu}>평가 하기</button>
        <div className="sub-menu">
          <a href="#" id="load-list-link" onClick={() => displayUploadSection('load-list-section')}>로드 목록</a>
        </div>
        <button className="menu-item" onClick={toggleSubMenu}>평가 완료</button>
        <div className="sub-menu">
          <a href="#" id="completed-evaluation-link" onClick={() => displayUploadSection('completed-evaluation-section')}>평가한 목록</a>
        </div>
      </div>

      <video autoPlay muted loop id="background-video">
        <source src="Neutral.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {activeSection === 'resume-upload-section' && (
        <div className="upload-section" id="resume-upload-section">
          <h2>이력서 업로드</h2>
          <input type="file" id="resume-upload" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif" onChange={(e) => previewFile(e.target, 'resume-preview')} />
          <div id="resume-preview"></div>
          <select name="job-role">
            <option value="">직무 선택...</option>
            <option value="개발자">개발자</option>
            <option value="디자이너">디자이너</option>
            <option value="회계">회계</option>
            <option value="총무">총무</option>
            <option value="법무">법무</option>
            <option value="사무">사무</option>
            <option value="영업">영업</option>
            <option value="고객상담">고객상담</option>
            <option value="물류">물류</option>
            <option value="기획">기획</option>
            <option value="운송">운송</option>
            <option value="서비스">서비스</option>
            <option value="생산">생산</option>
            <option value="건설">건설</option>
            <option value="의료">의료</option>
            <option value="연구">연구</option>
            <option value="교육">교육</option>
            <option value="스포츠">스포츠</option>
            <option value="보험">보험</option>
            <option value="복지">복지</option>
          </select>
          <button type="button" onClick={() => uploadDocument('resume-upload', 'resume-upload-section', '이력서')}>업로드</button>
          <button type="button" onClick={() => cancelUpload('resume-upload-section')}>취소</button>
          <div className="upload-guidelines">
            <h3>업로드 시 주의사항</h3>
            <ul>
              <li>관련된 파일만 업로드 하세요: 업로드하는 파일이 로드 평가와 직접적으로 관련이 있는지 확인하세요. 불필요하거나 관련 없는 파일은 업로드를 자제해 주세요.</li>
              <li>자신의 로드만 업로드하세요: 본인이 직접 측정하거나 생성한 로드 데이터만 업로드하고, 다른 사람의 데이터는 업로드하지 마세요. 저작권 및 데이터의 신뢰성 문제를 피할 수 있습니다.</li>
              <li>데이터의 정확성을 검증하세요: 데이터를 업로드하기 전에, 모든 정보가 정확하고 최신의 상태인지 다시 한 번 확인하세요. 오류가 있는 데이터는 추후 문제의 원인이 될 수 있습니다.</li>
              <li>파일 형식을 확인하세요: 업로드하는 파일의 형식이 지정된 요구사항을 충족하는지 확인하세요. 지원하지 않는 파일 형식은 업로드 과정에서 오류를 일으킬 수 있습니다.</li>
              <li>개인 정보 보호에 주의하세요: 업로드하는 데이터에 개인 정보가 포함되어 있지 않은지 확인하세요. 필요한 경우, 개인 정보를 익명화하거나 삭제하여 개인의 프라이버시를 보호하세요.</li>
              <li>업로드 파일의 크기를 확인하세요: 파일의 크기가 너무 크면 업로드 시간이 길어지거나 실패할 수 있습니다. 가능하다면, 파일 크기를 줄이거나, 지정된 크기 이내로 조정하세요.</li>
            </ul>
          </div>
        </div>
      )}

      {activeSection === 'cover-letter-upload-section' && (
        <div className="upload-section" id="cover-letter-upload-section">
          <h2>자기소개서 업로드</h2>
          <input type="file" id="cover-letter-upload" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif" onChange={(e) => previewFile(e.target, 'cover-letter-preview')} />
          <div id="cover-letter-preview"></div>
          <select name="job-role">
            <option value="">직무 선택...</option>
            <option value="개발자">개발자</option>
            <option value="디자이너">디자이너</option>
            <option value="회계">회계</option>
            <option value="총무">총무</option>
            <option value="법무">법무</option>
            <option value="사무">사무</option>
            <option value="영업">영업</option>
            <option value="고객상담">고객상담</option>
            <option value="물류">물류</option>
            <option value="기획">기획</option>
            <option value="운송">운송</option>
            <option value="서비스">서비스</option>
            <option value="생산">생산</option>
            <option value="건설">건설</option>
            <option value="의료">의료</option>
            <option value="연구">연구</option>
            <option value="교육">교육</option>
            <option value="스포츠">스포츠</option>
            <option value="보험">보험</option>
            <option value="복지">복지</option>
          </select>
          <button type="button" onClick={() => uploadDocument('cover-letter-upload', 'cover-letter-upload-section', '자기소개서')}>업로드</button>
          <button type="button" onClick={() => cancelUpload('cover-letter-upload-section')}>취소</button>
          <div className="upload-guidelines">
            <h3>업로드 시 주의사항</h3>
            <ul>
              <li>관련된 파일만 업로드 하세요: 업로드하는 파일이 로드 평가와 직접적으로 관련이 있는지 확인하세요. 불필요하거나 관련 없는 파일은 업로드를 자제해 주세요.</li>
              <li>자신의 로드만 업로드하세요: 본인이 직접 측정하거나 생성한 로드 데이터만 업로드하고, 다른 사람의 데이터는 업로드하지 마세요. 저작권 및 데이터의 신뢰성 문제를 피할 수 있습니다.</li>
              <li>데이터의 정확성을 검증하세요: 데이터를 업로드하기 전에, 모든 정보가 정확하고 최신의 상태인지 다시 한 번 확인하세요. 오류가 있는 데이터는 추후 문제의 원인이 될 수 있습니다.</li>
              <li>파일 형식을 확인하세요: 업로드하는 파일의 형식이 지정된 요구사항을 충족하는지 확인하세요. 지원하지 않는 파일 형식은 업로드 과정에서 오류를 일으킬 수 있습니다.</li>
              <li>개인 정보 보호에 주의하세요: 업로드하는 데이터에 개인 정보가 포함되어 있지 않은지 확인하세요. 필요한 경우, 개인 정보를 익명화하거나 삭제하여 개인의 프라이버시를 보호하세요.</li>
              <li>업로드 파일의 크기를 확인하세요: 파일의 크기가 너무 크면 업로드 시간이 길어지거나 실패할 수 있습니다. 가능하다면, 파일 크기를 줄이거나, 지정된 크기 이내로 조정하세요.</li>
            </ul>
          </div>
        </div>
      )}

      {activeSection === 'portfolio-upload-section' && (
        <div className="upload-section" id="portfolio-upload-section">
          <h2>포트폴리오 업로드</h2>
          <input type="file" id="portfolio-upload" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif" onChange={(e) => previewFile(e.target, 'portfolio-preview')} />
          <div id="portfolio-preview"></div>
          <select name="job-role">
            <option value="">직무 선택...</option>
            <option value="개발자">개발자</option>
            <option value="디자이너">디자이너</option>
            <option value="회계">회계</option>
            <option value="총무">총무</option>
            <option value="법무">법무</option>
            <option value="사무">사무</option>
            <option value="영업">영업</option>
            <option value="고객상담">고객상담</option>
            <option value="물류">물류</option>
            <option value="기획">기획</option>
            <option value="운송">운송</option>
            <option value="서비스">서비스</option>
            <option value="생산">생산</option>
            <option value="건설">건설</option>
            <option value="의료">의료</option>
            <option value="연구">연구</option>
            <option value="교육">교육</option>
            <option value="스포츠">스포츠</option>
            <option value="보험">보험</option>
            <option value="복지">복지</option>
          </select>
          <button type="button" onClick={() => uploadDocument('portfolio-upload', 'portfolio-upload-section', '포트폴리오')}>업로드</button>
          <button type="button" onClick={() => cancelUpload('portfolio-upload-section')}>취소</button>
          <div className="upload-guidelines">
            <h3>업로드 시 주의사항</h3>
            <ul>
              <li>관련된 파일만 업로드 하세요: 업로드하는 파일이 로드 평가와 직접적으로 관련이 있는지 확인하세요. 불필요하거나 관련 없는 파일은 업로드를 자제해 주세요.</li>
              <li>자신의 로드만 업로드하세요: 본인이 직접 측정하거나 생성한 로드 데이터만 업로드하고, 다른 사람의 데이터는 업로드하지 마세요. 저작권 및 데이터의 신뢰성 문제를 피할 수 있습니다.</li>
              <li>데이터의 정확성을 검증하세요: 데이터를 업로드하기 전에, 모든 정보가 정확하고 최신의 상태인지 다시 한 번 확인하세요. 오류가 있는 데이터는 추후 문제의 원인이 될 수 있습니다.</li>
              <li>파일 형식을 확인하세요: 업로드하는 파일의 형식이 지정된 요구사항을 충족하는지 확인하세요. 지원하지 않는 파일 형식은 업로드 과정에서 오류를 일으킬 수 있습니다.</li>
              <li>개인 정보 보호에 주의하세요: 업로드하는 데이터에 개인 정보가 포함되어 있지 않은지 확인하세요. 필요한 경우, 개인 정보를 익명화하거나 삭제하여 개인의 프라이버시를 보호하세요.</li>
              <li>업로드 파일의 크기를 확인하세요: 파일의 크기가 너무 크면 업로드 시간이 길어지거나 실패할 수 있습니다. 가능하다면, 파일 크기를 줄이거나, 지정된 크기 이내로 조정하세요.</li>
            </ul>
          </div>
        </div>
      )}

      {activeSection === 'document-management' && (
        <div className="document-management" id="document-management">
          <h2>평가 확인</h2>
          <div id="resume-management">
            <h3>이력서</h3>
            <div className="folder-section" id="resume-folder-section">
              {resumeFolders.map((folder, index) => (
                <div key={index} className="folder folder1">
                  <p className="name">{folder.name}</p>
                  <p className="details">평가: {folder.rating} | 평가 수: {folder.count}</p>
                </div>
              ))}
            </div>
          </div>
          <div id="cover-letter-management">
            <h3>자기소개서</h3>
            <div className="folder-section" id="cover-letter-folder-section">
              {coverLetterFolders.map((folder, index) => (
                <div key={index} className="folder folder2">
                  <p className="name">{folder.name}</p>
                  <p className="details">평가: {folder.rating} | 글 수: {folder.count}</p>
                </div>
              ))}
            </div>
          </div>
          <div id="portfolio-management">
            <h3>포트폴리오</h3>
            <div className="folder-section" id="portfolio-folder-section">
              {portfolioFolders.map((folder, index) => (
                <div key={index} className="folder folder3">
                  <p className="name">{folder.name}</p>
                  <p className="details">평가: {folder.rating} | 글 수: {folder.count}</p>
                </div>
              ))}
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>이름</th>
                <th>공유</th>
                <th>날짜</th>
                <th>파일 크기</th>
              </tr>
            </thead>
            <tbody>
              {recentFiles.map((file, index) => (
                <tr key={index}>
                  <td className="name">{file.name}</td>
                  <td className="shared">{file.shared}</td>
                  <td className="date">{file.date}</td>
                  <td className="size">{file.size}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeSection === 'badge-evaluation-section' && (
        <div id="badge-evaluation-section" className="evaluation-section">
           <h2>AI 이력 평가</h2>
          <div className="form-container">
            <form id="evaluation-form">
              <div className="form-group">
                <label htmlFor="education">학력 (Education)</label>
                <input 
                  type="text" 
                  id="education" 
                  value={evaluationForm.education}
                  onChange={handleEvaluationInputChange}
                  placeholder="예: 서울대학교" 
                />
                <input 
                  type="number" 
                  id="gpa" 
                  value={evaluationForm.gpa}
                  onChange={handleEvaluationInputChange}
                  placeholder="학점(GPA)" 
                  step="0.01" 
                  min="0" 
                  max="4.5" 
                />
              </div>
              <div className="form-group">
                <label htmlFor="certifications">자격증 및 인증 (Certifications)</label>
                <input 
                  type="number" 
                  id="certifications"
                  value={evaluationForm.certifications}
                  onChange={handleEvaluationInputChange} 
                  placeholder="자격증 개수" 
                  min="0" 
                />
              </div>
              <div className="form-group">
                <label htmlFor="language">언어 능력 (Language Proficiency)</label>
                <input 
                  type="text" 
                  id="language" 
                  value={evaluationForm.language}
                  onChange={handleEvaluationInputChange}
                  placeholder="언어 예: TOEIC, TOEFL" 
                />
                <input 
                  type="number" 
                  id="languageScore"  
                  value={evaluationForm.languageScore}
                  onChange={handleEvaluationInputChange}
                  placeholder="점수" 
                  min="0" 
                  max="990" 
                />
                <input 
                  type="text" 
                  id="additionalLanguages"  
                  value={evaluationForm.additionalLanguages}
                  onChange={handleEvaluationInputChange}
                  placeholder="추가 언어 예: JLPT N1, HSK 5급" 
                />
              </div>
              <div className="form-group">
                <label htmlFor="awards">수상 경력 (Awards & Honors)</label>
                <input 
                  type="text" 
                  id="schoolAwards"  
                  value={evaluationForm.schoolAwards}
                  onChange={handleEvaluationInputChange}
                  placeholder="교내 수상 경력" 
                />
                <input 
                  type="text" 
                  id="externalAwards"  
                  value={evaluationForm.externalAwards}
                  onChange={handleEvaluationInputChange}
                  placeholder="교외 수상 경력" 
                />
              </div>
              <div className="form-group">
                <label htmlFor="leadership">리더십 경험 (Leadership Experience)</label>
                <input 
                  type="text" 
                  id="leadership" 
                  value={evaluationForm.leadership}
                  onChange={handleEvaluationInputChange} 
                  placeholder="리더십 경험" 
                />
              </div>
              <div className="form-group">
                <label htmlFor="volunteer">봉사활동 (Volunteer Experience)</label>
                <input 
                  type="text" 
                  id="volunteer"  
                  value={evaluationForm.volunteer}
                  onChange={handleEvaluationInputChange}
                  placeholder="봉사활동 경험" 
                />
              </div>
              <div className="form-group">
                <label htmlFor="activities">대외 활동 (Extracurricular Activities)</label>
                <input 
                  type="text" 
                  id="activities"  
                  value={evaluationForm.activities}
                  onChange={handleEvaluationInputChange}
                  placeholder="클럽/동아리, 공모전 경험" 
                />
              </div>
              <div className="form-group">
                <label htmlFor="global">글로벌 경험 (Global Experience)</label>
                <input 
                  type="text" 
                  id="global"  
                  value={evaluationForm.global}
                  onChange={handleEvaluationInputChange}
                  placeholder="해외 연수/교환학생 경험" 
                />
              </div>
              <div className="form-group">
                <label htmlFor="portfolio">포트폴리오 (Portfolio)</label>
                <input 
                  type="text" 
                  id="portfolio"  
                  value={evaluationForm.portfolio}
                  onChange={handleEvaluationInputChange}
                  placeholder="포트폴리오 링크" 
                />
              </div>
              <div className="form-group">
                <label htmlFor="communication">커뮤니케이션 능력 (Communication Skills)</label>
                <input 
                  type="text" 
                  id="communication" 
                  value={evaluationForm.communication}
                  onChange={handleEvaluationInputChange} 
                  placeholder="프레젠테이션, 서면 커뮤니케이션 경험" 
                />
              </div>
              <div className="form-group">
                <label htmlFor="problemSolving">문제 해결 능력 (Problem-Solving Skills)</label>
                <input 
                  type="text" 
                  id="problemSolving"  
                  value={evaluationForm.problemSolving}
                  onChange={handleEvaluationInputChange}
                  placeholder="문제 해결 경험" 
                />
              </div>
              <div className="form-group">
                <label htmlFor="timeManagement">시간 관리 (Time Management)</label>
                <input 
                  type="text" 
                  id="timeManagement"  
                  value={evaluationForm.timeManagement}
                  onChange={handleEvaluationInputChange}
                  placeholder="시간 관리 경험" 
                />
              </div>
              <div className="form-group">
                <label htmlFor="networking">네트워킹 능력 (Networking Skills)</label>
                <input 
                  type="text" 
                  id="networking"  
                  value={evaluationForm.networking}
                  onChange={handleEvaluationInputChange}
                  placeholder="산업 네트워크, 협업 경험" 
                />
              </div>
              <div className="form-group">
                <label htmlFor="selfDevelopment">자기 계발 (Self-Development)</label>
                <input 
                  type="text" 
                  id="selfDevelopment"  
                  value={evaluationForm.selfDevelopment}
                  onChange={handleEvaluationInputChange}
                  placeholder="추가 학습, 독서 및 연구" 
                />
              </div>
              <div className="form-group">
                <label htmlFor="entrepreneurship">창업 경험 (Entrepreneurship)</label>
                <input 
                  type="text" 
                  id="entrepreneurship" 
                  value={evaluationForm.entrepreneurship}
                  onChange={handleEvaluationInputChange} 
                  placeholder="창업 경험" 
                />
              </div>
              <button type="button" onClick={evaluateProfile}>평가하기</button>
            </form>
            {evaluationResult && (
              <div id="evaluation-result" className="result-container">
                <h3>평가 결과</h3>
                <p>총점: <span id="total-score">{evaluationResult.totalScore}</span>/100</p>
                <ul id="detailed-scores">
                  {Object.entries(evaluationResult.detailedScores).map(([key, value]) => (
                    <li key={key}>{key}: {value}점</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {activeSection === 'load-list-section' && (
        <div id="load-list-section" className="load-list-section">
          <h2>평가할 로드 목록</h2>
          <table>
            <thead>
              <tr>
                <th>문서 유형</th>
                <th>제목</th>
                <th>직무</th>
                <th>액션</th>
              </tr>
            </thead>
            <tbody>
              {documents.map(doc => (
                <tr key={doc.id}>
                  <td>{doc.type}</td>
                  <td>{doc.title}</td>
                  <td>{doc.job_role}</td>
                  <td>
                    <button onClick={() => handleEvaluate(doc.id)}>평가하기</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeSection === 'completed-evaluation-section' && (
        <div id="completed-evaluation-section" className="completed-evaluation-section">
          <h2>평가 완료 목록</h2>
          <table>
            <thead>
              <tr>
                <th>문서 유형</th>
                <th>제목</th>
                <th>직무</th>
                <th>평가 점수</th>
                <th>커멘트</th>
                <th>평가 날짜</th>
                <th>액션</th>
              </tr>
            </thead>
            <tbody>
              {completedEvaluations.map(evaluation => (
                <tr key={evaluation.evaluation_id}>
                  <td>{evaluation.type}</td>
                  <td>{evaluation.title}</td>
                  <td>{evaluation.job_role}</td>
                  <td>
                    {editingEvaluation && editingEvaluation.evaluation_id === evaluation.evaluation_id ? (
                      <input
                        type="number"
                        value={editingEvaluation.rating}
                        onChange={(e) => setEditingEvaluation({...editingEvaluation, rating: e.target.value})}
                      />
                    ) : (
                      evaluation.rating
                    )}
                  </td>
                  <td>
                    {editingEvaluation && editingEvaluation.evaluation_id === evaluation.evaluation_id ? (
                      <input
                        type="text"
                        value={editingEvaluation.comment}
                        onChange={(e) => setEditingEvaluation({...editingEvaluation, comment: e.target.value})}
                      />
                    ) : (
                      evaluation.comment
                    )}
                  </td>
                  <td>{new Date(evaluation.evaluation_date).toLocaleDateString()}</td>
                  <td>
                    {editingEvaluation && editingEvaluation.evaluation_id === evaluation.evaluation_id ? (
                      <>
                        <button onClick={handleUpdate}>저장</button>
                        <button onClick={() => setEditingEvaluation(null)}>취소</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleEdit(evaluation)}>수정</button>
                        <button onClick={() => handleDelete(evaluation.evaluation_id)}>삭제</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Road;