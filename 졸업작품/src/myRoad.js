import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './myRoad.css';

const Myloads = () => {
  const [activeTab, setActiveTab] = useState('resume');
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [coverLetterInput, setCoverLetterInput] = useState('');
  const [keywordInput, setKeywordInput] = useState('');
  const [keywords, setKeywords] = useState([]);
  const [generatedCoverLetter, setGeneratedCoverLetter] = useState('');
  const [showResume, setShowResume] = useState(false);
  const [createdResumes, setCreatedResumes] = useState([]);
  const [viewingResumeId, setViewingResumeId] = useState(null);
  const [resumeData, setResumeData] = useState({
    Name: '',
    ProfilePicture: null,
    BirthDate: '',
    Email: '',
    PhoneNumber: '',
    Address: '',
    PersonalWebsite: '',
    Skills: [{ name: '', level: 0 }],
    WorkExperience: [{ company: '', period: '', position: '' }],
    Education: [{ period: '', school: '', major: '', degree: '', gpa: '', location: '' }],
    Certifications: [''],
    ExternalActivities: [{ name: '', award: '' }]
  });

  const templates = [
    {
      id: 1,
      name: '기본 템플릿',
      image: '/images/tem1.png',
      html: `
        <div class="resume">
          <p>{ProfilePicture}</p>
          <h1>{Name}</h1>
          <p>이메일: {Email} | 전화번호: {PhoneNumber} | 주소: {Address}</p>
          <p>{PersonalWebsite}</p>
          <h2>스킬</h2>
          <ul>{Skills}</ul>
          <h2>경력 사항</h2>
          {WorkExperience}
          <h2>학력 사항</h2>
          {Education}
          <h2>자격증</h2>
          <ul>{Certifications}</ul>
          <h2>대외 활동</h2>
          {ExternalActivities}
        </div>
      `
    },
    {
      id: 2,
      name: '현대적 템플릿',
      image: '/images/tem2.png',
      html: `
         <div class="resume">
          <p>{ProfilePicture}</p>
          <h1>{Name}</h1>
          <p>이메일: {Email} | 전화번호: {PhoneNumber} | 주소: {Address}</p>
          <p>{PersonalWebsite}</p>
          <h2>스킬</h2>
          <ul>{Skills}</ul>
          <h2>경력 사항</h2>
          {WorkExperience}
          <h2>학력 사항</h2>
          {Education}
          <h2>자격증</h2>
          <ul>{Certifications}</ul>
          <h2>대외 활동</h2>
          {ExternalActivities}
        </div>
      `
    },
    {
      id: 3,
      name: '크리에이티브 템플릿',
      image: '/images/tem3.png',
      html: `
        <div class="resume">
          <p>{ProfilePicture}</p>
          <h1>{Name}</h1>
          <p>이메일: {Email} | 전화번호: {PhoneNumber} | 주소: {Address}</p>
          <p>{PersonalWebsite}</p>
          <h2>스킬</h2>
          <ul>{Skills}</ul>
          <h2>경력 사항</h2>
          {WorkExperience}
          <h2>학력 사항</h2>
          {Education}
          <h2>자격증</h2>
          <ul>{Certifications}</ul>
          <h2>대외 활동</h2>
          {ExternalActivities}
        </div>
      `
    }
  ];

  useEffect(() => {
    fetchResumes();
  }, []);

  const getProfilePictureUrl = (profilePicture) => {
    if (!profilePicture) return null;
    if (typeof profilePicture === 'string') return profilePicture;
    if (profilePicture instanceof File || profilePicture instanceof Blob) {
      return URL.createObjectURL(profilePicture);
    }
    return null;
  };

  const fetchResumes = async () => {
    try {
      const response = await axios.get('http://localhost:3001/resumes');
      setCreatedResumes(response.data);
    } catch (error) {
      console.error('이력서 목록 조회 중 오류 발생:', error);
      alert('이력서 목록을 불러오는 중 오류가 발생했습니다.');
    }
  };

  const openTab = (tabId) => {
    setActiveTab(tabId);
  };

  const selectTemplate = (templateId) => {
    setSelectedTemplateId(templateId);
  };

  const handleInputChange = (e, section, index, field) => {
    const { name, value } = e.target;
    if (section) {
      setResumeData(prevData => {
        const newData = { ...prevData };
        if (field) {
          newData[section][index][field] = value;
        } else {
          newData[section][index] = value;
        }
        return newData;
      });
    } else {
      setResumeData(prevData => ({
        ...prevData,
        [name]: value
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResumeData(prevData => ({
        ...prevData,
        ProfilePicture: file
      }));
    }
  };

  const addItem = (section) => {
    setResumeData(prevData => {
      const newData = { ...prevData };
      if (section === 'Skills') {
        newData[section] = [...newData[section], { name: '', level: 0 }];
      } else if (section === 'WorkExperience') {
        newData[section] = [...newData[section], { company: '', period: '', position: '' }];
      } else if (section === 'Education') {
        newData[section] = [...newData[section], { period: '', school: '', major: '', degree: '', gpa: '', location: '' }];
      } else if (section === 'Certifications') {
        newData[section] = [...newData[section], ''];
      } else if (section === 'ExternalActivities') {
        newData[section] = [...newData[section], { name: '', award: '' }];
      }
      return newData;
    });
  };

  const createResume = async () => {
    if (!resumeData.Name || !resumeData.Email) {
      alert('이름과 이메일은 필수 입력 항목입니다.');
      return;
    }
  
    if (selectedTemplateId) {
      try {
        const formData = new FormData();
        for (const key in resumeData) {
          if (key === 'ProfilePicture' && resumeData[key] instanceof File) {
            formData.append(key, resumeData[key]);
          } else if (typeof resumeData[key] === 'object') {
            formData.append(key, JSON.stringify(resumeData[key]));
          } else {
            formData.append(key, resumeData[key]);
          }
        }
        formData.append('TemplateID', selectedTemplateId);
  
        const response = await axios.post('http://localhost:3001/saveResume', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log('이력서가 생성되었습니다:', response.data);
        alert(response.data.message);
        fetchResumes();
        setViewingResumeId(response.data.ResumeID);
        setShowResume(true);
      } catch (error) {
        console.error('이력서 생성 중 오류 발생:', error);
        alert('이력서 생성 중 오류가 발생했습니다: ' + (error.response?.data?.error || error.message));
      }
    } else {
      alert('이력서 템플릿을 선택해주세요.');
    }
  };

  const saveResume = async () => {
    try {
      const formData = new FormData();
      for (const key in resumeData) {
        if (key === 'ProfilePicture' && resumeData[key] instanceof File) {
          formData.append(key, resumeData[key]);
        } else if (typeof resumeData[key] === 'object') {
          formData.append(key, JSON.stringify(resumeData[key]));
        } else {
          formData.append(key, resumeData[key]);
        }
      }
      formData.append('ResumeID', viewingResumeId);
      formData.append('TemplateID', selectedTemplateId);

      const response = await axios.post('http://localhost:3001/saveResume', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert(response.data.message);
      fetchResumes();
    } catch (error) {
      console.error('이력서 저장 중 오류 발생:', error);
      alert('이력서 저장 중 오류가 발생했습니다.');
    }
  };

  const viewResume = async (resumeId) => {
    try {
      const response = await axios.get(`http://localhost:3001/resumes/${resumeId}`);
      console.log('Server response:', response.data);

       // 서버에서 받은 데이터를 그대로 사용
    const rawData = response.data;

    // 각 필드를 개별적으로 파싱
    const data = {
      ...rawData,
      Skills: parseJsonField(rawData.Skills),
      WorkExperience: parseJsonField(rawData.WorkExperience),
      Education: parseJsonField(rawData.Education),
      Certifications: parseJsonField(rawData.Certifications),
      ExternalActivities: parseJsonField(rawData.ExternalActivities),
      ProfilePicture: rawData.ProfilePicture || null
    };

    console.log('Parsed data:', data);
    setResumeData(data);
    setSelectedTemplateId(data.TemplateID);
    setViewingResumeId(resumeId);
    setShowResume(true);
  } catch (error) {
    console.error('이력서 조회 중 오류 발생:', error);
    alert('이력서 조회 중 오류가 발생했습니다: ' + error.message);
  }
};


const parseJsonField = (field) => {
  if (typeof field === 'string') {
    try {
      return JSON.parse(field);
    } catch (e) {
      console.error('JSON 파싱 오류:', e);
      return [];
    }
  }
  return field || [];
};

  const deleteResume = async (resumeId) => {
    try {
      const response = await axios.delete(`http://localhost:3001/resumes/${resumeId}`);
      console.log('Delete response:', response.data);

      if (response.data.success) {
        setCreatedResumes(prevResumes => prevResumes.filter(resume => resume.ResumeID !== resumeId));
        if (viewingResumeId === resumeId) {
          setShowResume(false);
          setViewingResumeId(null);
        }
        alert('이력서가 성공적으로 삭제되었습니다.');
      } else {
        throw new Error(response.data.message || '삭제 실패');
      }
    } catch (error) {
      console.error('이력서 삭제 중 오류 발생:', error);
      alert('이력서 삭제 중 오류가 발생했습니다: ' + (error.response?.data?.message || error.message));
    }
  };

  const addKeyword = () => {
    if (keywordInput.trim() !== '') {
      setKeywords([...keywords, keywordInput.trim()]);
      setKeywordInput('');
    }
  };

  const generateCoverLetter = async () => {
    try {
      const response = await axios.post('http://localhost:3001/coverletters', {
        UserID: 1, // 임시 사용자 ID
        OriginalContent: coverLetterInput,
        Keywords: keywords.join(', ')
      });
      setGeneratedCoverLetter(response.data.generatedContent);
    } catch (error) {
      console.error('자기소개서 생성 중 오류 발생:', error);
      alert('자기소개서 생성 중 오류가 발생했습니다.');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCoverLetter).then(() => {
      alert("자기소개서가 복사되었습니다.");
    });
  };

  const downloadTemplate = (templateName) => {
    console.log(`Downloading template: ${templateName}`);
    alert(`${templateName} 템플릿 다운로드를 시작합니다.`);
  };

  const ResumeView = ({ template, data }) => {
    const createMarkup = () => {
      let html = template.html;
      for (const [key, value] of Object.entries(data)) {
        if (key === 'Skills') {
          html = html.replace(`{${key}}`, Array.isArray(value) ? value.map(skill => `<li>${skill.name} - ${skill.level}%</li>`).join('') : '');
        } else if (key === 'WorkExperience') {
          html = html.replace(`{${key}}`, Array.isArray(value) ? value.map(exp => `<div><h3>${exp.company}</h3><p>${exp.period} - ${exp.position}</p></div>`).join('') : '');
        } else if (key === 'Education') {
          html = html.replace(`{${key}}`, Array.isArray(value) ? value.map(edu => `<div><h3>${edu.school}</h3><p>${edu.period} - ${edu.degree} in ${edu.major}</p><p>GPA: ${edu.gpa}, Location: ${edu.location}</p></div>`).join('') : '');
        } else if (key === 'Certifications') {
          html = html.replace(`{${key}}`, Array.isArray(value) ? value.map(cert => `<li>${cert}</li>`).join('') : '');
        } else if (key === 'ExternalActivities') {
          html = html.replace(`{${key}}`, Array.isArray(value) ? value.map(activity => `<div><h3>${activity.name}</h3><p>${activity.award}</p></div>`).join('') : '');
        } else if (key === 'ProfilePicture') {
          const imgUrl = getProfilePictureUrl(value);
          html = html.replace(`{${key}}`, imgUrl ? `<img src="${imgUrl}" alt="Profile Picture" style="width:100px;height:100px;object-fit:cover;">` : '');
        } else {
          html = html.replace(`{${key}}`, value || '');
        }
      }
      return {__html: html};
    };

    return (
      <div className="resume-view">
        <div dangerouslySetInnerHTML={createMarkup()} />
      </div>
    );
  };


  const returnToResumeList = async () => {
    try {
      setShowResume(false);
      setViewingResumeId(null);
      setResumeData({
        Name: '',
        ProfilePicture: null,
        BirthDate: '',
        Email: '',
        PhoneNumber: '',
        Address: '',
        PersonalWebsite: '',
        Skills: [{ name: '', level: 0 }],
        WorkExperience: [{ company: '', period: '', position: '' }],
        Education: [{ period: '', school: '', major: '', degree: '', gpa: '', location: '' }],
        Certifications: [''],
        ExternalActivities: [{ name: '', award: '' }]
      });
      setSelectedTemplateId(null);
      await fetchResumes();
    } catch (error) {
      console.error('이력서 목록 조회 중 오류 발생:', error);
      alert('이력서 목록을 불러오는 중 오류가 발생했습니다.');
    }
  };

  const ResumeList = ({ resumes, onView, onDelete }) => (
    <div className="resume-list">
      <h2>생성된 이력서 목록</h2>
      {resumes.map(resume => (
        <div key={resume.ResumeID} className="resume-item">
          <span>{resume.Name} - Template {resume.TemplateID}</span>
          <button onClick={() => onView(resume.ResumeID)}>보기</button>
          <button onClick={() => onDelete(resume.ResumeID)}>삭제</button>
        </div>
      ))}
    </div>
  );

  return (
    <div>
      <div className="container">
        <div className="headers" style={{ flex: 1 }}>
          <video autoPlay muted loop>
            <source src="/videos/myload111.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="photo-gallery creative-layout" style={{ flex: 1 }}>
          <div className="photo" data-central="/images/main-1.png">
            <img src="/images/MY1.png" alt="사진 1" />
            <div className="description"></div>
          </div>
          <div className="photo" data-central="/images/main-2.png">
            <img src="/images/MY2.png" alt="사진 2" />
            <div className="description"></div>
          </div>
          <div className="photo" data-central="/images/main-3.png">
            <img src="/images/MY3.png" alt="사진 3" />
            <div className="description"></div>
          </div>
        </div>
        <div className="central-photo">
          <img src="" alt="중앙 사진" />
        </div>
      </div>

      <ul className="tabs">
        <li className={activeTab === 'resume' ? 'active' : ''} onClick={() => openTab('resume')}>이력서</li>
        <li className={activeTab === 'cover-letter' ? 'active' : ''} onClick={() => openTab('cover-letter')}>자기소개서</li>
        <li className={activeTab === 'portfolio' ? 'active' : ''} onClick={() => openTab('portfolio')}>포트폴리오</li>
      </ul>

      {activeTab === 'resume' && (
        <div className="tab-content" id="resume">
          {showResume ? (
            <>
              <ResumeView 
                template={templates.find(t => t.id === selectedTemplateId)} 
                data={resumeData} 
              />
              <button onClick={returnToResumeList}>이력서 목록으로 돌아가기</button>
            </>
          ) : (
            <>
              <ResumeList 
                resumes={createdResumes}
                onView={viewResume}
                onDelete={deleteResume}
              />
              <div className="resumes-container">
                <div className="resumes">
                  <div className="left-column">
                    <div className="profile-pic">
                      <input type="file" onChange={handleFileChange} accept="image/*" />
                      {resumeData.ProfilePicture && (
                        <img 
                          src={getProfilePictureUrl(resumeData.ProfilePicture)} 
                          alt="Profile" 
                          onError={(e) => {
                            console.error("Error loading image:", e);
                            e.target.src = "/images/fallback-image.jpg";
                          }}
                        />
                      )}
                    </div>
                    <div className="contact-info">
                      <p><i className="fa fa-birthday-cake"></i><input type="date" name="BirthDate" value={resumeData.BirthDate} onChange={handleInputChange} /></p>
                      <p><i className="fa fa-envelope"></i><input type="email" name="Email" value={resumeData.Email} onChange={handleInputChange} /></p>
                      <p><i className="fa fa-phone"></i><input type="tel" name="PhoneNumber" value={resumeData.PhoneNumber} onChange={handleInputChange} /></p>
                      <p><i className="fa fa-map-marker-alt"></i><input type="text" name="Address" value={resumeData.Address} onChange={handleInputChange} /></p>
                      <p><i className="fa fa-globe"></i><input type="url" name="PersonalWebsite" value={resumeData.PersonalWebsite} onChange={handleInputChange} /></p>
                    </div>
                    <div className="skills">
                      <h3>작업 스킬</h3>
                      <div className="skill-grid">
                        {resumeData.Skills.map((skill, index) => (
                          <div className="skill" key={index}>
                            <input
                              type="text"
                              value={skill.name}
                              onChange={(e) => handleInputChange(e, 'Skills', index, 'name')}
                              placeholder={`스킬 ${index + 1}`}
                            />
                            <div className="bar">
                              <input
                                type="range"
                                min="0"
                                max="100"
                                value={skill.level}
                                onChange={(e) => handleInputChange(e, 'Skills', index, 'level')}
                              />
                              <div className="level" style={{ width: `${skill.level}%` }}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <button type="button" onClick={() => addItem('Skills')}>스킬 추가</button>
                    </div>
                  </div>
                  <div className="right-column">
                    <div className="section">
                      <h2>나의 이력서</h2>
                      <input type="text" name="Name" value={resumeData.Name} onChange={handleInputChange} placeholder="이름" style={{ fontSize: '20px' }} />
                    </div>
                    <div className="section">
                      <h2>경력 사항</h2>
                      {resumeData.WorkExperience.map((job, index) => (
                        <div className="job" key={index}>
                          <i className="fa-solid fa-calendar-days"></i>
                          <div className="job-details">
                            <input type="text" value={job.company} onChange={(e) => handleInputChange(e, 'WorkExperience', index, 'company')} placeholder="회사명" />
                            <input type="text" value={job.period} onChange={(e) => handleInputChange(e, 'WorkExperience', index, 'period')} placeholder="근무 기간" />
                            <input type="text" value={job.position} onChange={(e) => handleInputChange(e, 'WorkExperience', index, 'position')} placeholder="직책" />
                          </div>
                        </div>
                      ))}
                      <button type="button" onClick={() => addItem('WorkExperience')}>경력 추가</button>
                    </div>
                    <div className="section">
                      <h2>학력 사항</h2>
                      <table>
                        <thead>
                          <tr>
                            <th>재학 기간</th>
                            <th>학교명</th>
                            <th>전공</th>
                            <th>졸업 구분</th>
                            <th>학점</th>
                            <th>지역</th>
                          </tr>
                        </thead>
                        <tbody>
                          {resumeData.Education.map((edu, index) => (
                            <tr key={index}>
                              <td><input type="text" value={edu.period} onChange={(e) => handleInputChange(e, 'Education', index, 'period')} /></td>
                              <td><input type="text" value={edu.school} onChange={(e) => handleInputChange(e, 'Education', index, 'school')} /></td>
                              <td><input type="text" value={edu.major} onChange={(e) => handleInputChange(e, 'Education', index, 'major')} /></td>
                              <td><input type="text" value={edu.degree} onChange={(e) => handleInputChange(e, 'Education', index, 'degree')} /></td>
                              <td><input type="text" value={edu.gpa} onChange={(e) => handleInputChange(e, 'Education', index, 'gpa')} /></td>
                              <td><input type="text" value={edu.location} onChange={(e) => handleInputChange(e, 'Education', index, 'location')} /></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <button type="button" onClick={() => addItem('Education')}>학력 추가</button>
                    </div>
                    <div className="section certifications">
                      <h2>자격증</h2>
                      <ul>
                        {resumeData.Certifications.map((cert, index) => (
                          <li key={index}>
                            <input 
                              type="text" 
                              value={cert} 
                              onChange={(e) => handleInputChange(e, 'Certifications', index)} 
                              placeholder={`자격증 ${index + 1}`}
                            />
                          </li>
                        ))}
                      </ul>
                      <button type="button" onClick={() => addItem('Certifications')}>자격증 추가</button>
                    </div>
                    <div className="section">
                      <h2>대외 활동</h2>
                      {resumeData.ExternalActivities.map((activity, index) => (
                        <div className="activity-card" key={index}>
                          <input 
                            type="text" 
                            value={activity.name} 
                            onChange={(e) => handleInputChange(e, 'ExternalActivities', index, 'name')} 
                            placeholder="활동명"
                          />
                          <input 
                            type="text" 
                            value={activity.award} 
                            onChange={(e) => handleInputChange(e, 'ExternalActivities', index, 'award')} 
                            placeholder="수상 내역"
                          />
                        </div>
                      ))}
                      <button type="button" onClick={() => addItem('ExternalActivities')}>대외 활동 추가</button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="resume-templates-container">
                <div className="template-grid">
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      className={`resume-template ${selectedTemplateId === template.id ? 'selected' : ''}`}
                      id={`template-${template.id}`}
                      onClick={() => selectTemplate(template.id)}
                    >
                      <img src={template.image} alt={`템플릿 ${template.id}`} />
                    </div>
                  ))}
                </div>
                <div className="template-actions">
                  <button className="btn create" onClick={createResume}>생성</button>
                  <button className="btn save" onClick={saveResume}>저장</button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {activeTab === 'cover-letter' && (
        <div className="tab-content" id="cover-letter">
          <div className="cover-letter-container">
            <div className="input-area">
              <textarea
                id="coverLetterInput"
                placeholder="자기소개서 내용을 입력하세요..."
                value={coverLetterInput}
                onChange={(e) => setCoverLetterInput(e.target.value)}
              />
              <div className="keywords">
                <input
                  type="text"
                  id="keywordInput"
                  placeholder="키워드 추가 (예: 리더십, 협업)"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                />
                <button onClick={addKeyword}>적용</button>
              </div>
              <button className="btn create" onClick={generateCoverLetter}>자기소개서 생성</button>
            </div>
            <div className="output-area">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0 }}>생성된 자기소개서</h2>
                <button className="btn copy" onClick={copyToClipboard} style={{ backgroundColor: '#e0e0e0', color: '#555' }}>복사</button>
              </div>
              <div id="generatedCoverLetter" className="generated-content">{generatedCoverLetter}</div>
            </div>
          </div>
          <div className="cover-letter-tips" style={{ backgroundColor: '#f9f9f9', color: '#555', margin: '20px', padding: '20px', borderRadius: '5px', marginTop: '20px' }}>
            <h2>자기소개서 작성 시 주의사항</h2>
            <ul>
              <li>솔직하게 자신의 경험을 작성하세요. 거짓된 내용은 면접 시 불리할 수 있습니다.</li>
              <li>회사의 요구사항과 직무에 맞는 역량을 강조하세요.</li>
              <li>장점과 단점을 균형 있게 서술하되, 단점을 어떻게 보완해 왔는지 설명하세요.</li>
              <li>가능하면 구체적인 예시를 들어 자신의 역량을 뒷받침하세요.</li>
              <li>너무 길지 않게, 핵심 내용을 간결하게 작성하는 것이 좋습니다.</li>
              <li>작성 후에는 반드시 맞춤법과 문법을 확인하세요.</li>
            </ul>
          </div>
        </div>
      )}

{activeTab === 'portfolio' && (
        <div className="tab-content" id="portfolio">
          <div className="portfolio-download-section">
            <h2 style={{ marginLeft: '20px' }}>포트폴리오 템플릿 다운로드</h2>
            <p style={{ marginLeft: '20px' }}>커리어허브에서 제공하는 무료 템플릿을 받아 보세요</p>
            <div className="template-grid">
              {[...Array(14)].map((_, i) => (
                <div className="portfolio-template" id={`template-${i + 1}`} key={i}>
                  <img src={`/images/tem${i + 1}.png`} alt={`포트폴리오 템플릿 ${i + 1}`} />
                  <button className="btn download" onClick={() => downloadTemplate(`template${i + 1}.zip`)}>다운로드</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Myloads;