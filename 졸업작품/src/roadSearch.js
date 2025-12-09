import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './roadSearch.css';

const RoadSearch = () => {
  const [userID, setUserID] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        setUserID(parsedData.UserID);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  // 필터 상태
  const [filters, setFilters] = useState({
    education: '',
    position: '',
    document: ''
  });

  // posts 상태 관리
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 게시글 목록 조회
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const queryParams = new URLSearchParams();
        if (selectedType) queryParams.append('type', selectedType);
        if (filters.education) queryParams.append('education', filters.education);
        if (filters.position) queryParams.append('position', filters.position);
        if (filters.document) queryParams.append('document', filters.document);

        const response = await axios.get(`/api/roads?${queryParams}`);
        setPosts(response.data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [selectedType, filters]);


  // 폼 데이터 상태
  const [postForm, setPostForm] = useState({
    type: '',
    subtitle: '',
    author: '',
    position: '',
    education: '',
    files: {
      resume: null,
      coverLetter: null,
      portfolio: null
    }
  });

   const handleTypeSelection = (type) => {
    setSelectedType(type === selectedType ? null : type);
  };

  const handlePostClick = (postId) => {
    navigate(`/other/share/${postId}`); 
  };

  const handleCreatePost = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setPostForm({
      type: '',
      subtitle: '',
      author: '',
      position: '',
      education: '',
      files: {
        resume: null,
        coverLetter: null,
        portfolio: null
      }
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPostForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        alert('PDF 파일만 업로드 가능합니다.');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        alert('파일 크기는 10MB를 초과할 수 없습니다.');
        return;
      }
      setPostForm(prev => ({
        ...prev,
        files: {
          ...prev.files,
          [fileType]: file
        }
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const formData = new FormData();
  
      // 필수 필드 검증
      if (!postForm.type || !postForm.subtitle || !postForm.author || 
          !postForm.position || !postForm.education) {
        alert('모든 필수 항목을 입력해주세요.');
        return;
      }
  
      // 폼 데이터 추가
      formData.append('userID', userID);
      formData.append('type', postForm.type);
      formData.append('subtitle', postForm.subtitle);
      formData.append('author', postForm.author);
      formData.append('position', postForm.position);
      formData.append('education', postForm.education);
      
      // 파일 추가
      if (postForm.files.resume) {
        formData.append('resume', postForm.files.resume);
      }
      if (postForm.files.coverLetter) {
        formData.append('coverLetter', postForm.files.coverLetter);
      }
      if (postForm.files.portfolio) {
        formData.append('portfolio', postForm.files.portfolio);
      }
  
      const response = await axios.post('/api/roads', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
  
      if (response.data) {
        setPosts(prevPosts => [...prevPosts, response.data]);
        handleCloseModal();
      }
    } catch (err) {
      console.error('Error creating post:', err);
      alert(err.response?.data?.error || '게시글 작성에 실패했습니다.');
    }
  };

  const careerTypes = [
    "기획.전략", "법무.사무.총무", "인사.HR", "회계.사무", "마케팅.광고",
    "개발.데이터", "보안 관리", "디자이너", "물류.무역", "운전.배송",
    "영업", "고객상담", "금융.보험", "식.음료", "엔지니어",
    "제조.생산", "교육", "건축.시설", "의료", "미디어.문화",
    "스포츠", "서비스", "연구.R&D", "구매.자재"
  ];

  if (loading) return <div className="loading">로딩 중...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <>
       <div className="rstags">
        <h4>career hub</h4>
        <h1>로드 공유</h1>
        <p>합격한 커리어를 확인해 보세요</p>
        <div className="buttons">
          {careerTypes.map((type, index) => (
            <button 
              key={index} 
              onClick={() => handleTypeSelection(type)}
              className={selectedType === type ? 'active' : ''}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className='post-non'>
        <div className="filtersRs">
          <select 
            className='filtersRs-select'
            name="education"
            value={filters.education}
            onChange={handleFilterChange}
          >
            <option value="">학력</option>
            <option value="고등 졸업">고등 졸업</option>
            <option value="대학2년제">대학 2년제</option>
            <option value="대학4년제">대학 4년제</option>
          </select>
          <select 
            className='filtersRs-select'
            name="position"
            value={filters.position}
            onChange={handleFilterChange}
          >
            <option value="">경력/신입</option>
            <option value="경력직">경력직</option>
            <option value="신입">신입</option>
          </select>
          <select 
            className='filtersRs-select'
            name="document"
            value={filters.document}
            onChange={handleFilterChange}
          >
            <option value="">문서</option>
            <option value="이력서">이력서</option>
            <option value="포트폴리오">포트폴리오</option>
            <option value="자기소개서">자기소개서</option>
          </select>
        </div>

        <div className="postRs-grid">
  {posts.map((post) => (
    <div
      key={post.PostID}
      className="postRs"
      onClick={() => handlePostClick(post.PostID)}
    >
      <h3 className="postRs-title">{post.Title}</h3>
      <p className="postRs-subtitle">{post.Subtitle}</p>
      <p className="postRs-author">작성자: {post.Author}</p>
      <div className="postRs-tags">
        {/* Tags가 문자열인 경우와 JSON인 경우 모두 처리 */}
        {(typeof post.Tags === 'string' ? post.Tags.split(',') : 
          (Array.isArray(post.Tags) ? post.Tags : 
            JSON.parse(post.Tags))).map((tag, index) => (
          <span key={index} className="postRs-tag">{tag}</span>
        ))}
      </div>
    </div>
  ))}
</div>

        <button 
          className="create-post-btn"
          onClick={handleCreatePost}
        >
          게시글 작성
        </button>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>게시글 작성</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>직무 분야</label>
                <select 
                  name="type" 
                  value={postForm.type}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">선택하세요</option>
                  {careerTypes.map((type, index) => (
                    <option key={index} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>회사/부서명</label>
                <input
                  type="text"
                  name="subtitle"
                  value={postForm.subtitle}
                  onChange={handleInputChange}
                  placeholder="예: 삼성 전략 부서"
                  required
                />
              </div>

              <div className="form-group">
                <label>작성자명</label>
                <input
                  type="text"
                  name="author"
                  value={postForm.author}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>포지션</label>
                <select
                  name="position"
                  value={postForm.position}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">선택하세요</option>
                  <option value="신입">신입사원</option>
                  <option value="경력직">경력직</option>
                </select>
              </div>

              <div className="form-group">
                <label>학력</label>
                <select
                  name="education"
                  value={postForm.education}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">선택하세요</option>
                  <option value="고등 졸업">고등 졸업</option>
                  <option value="대학2년제">대학(2,3년)</option>
                  <option value="대학4년제">대학4년제</option>
                </select>
              </div>

              <div className="form-group">
                <label>이력서 PDF</label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleFileChange(e, 'resume')}
                  className="file-input"
                />
              </div>

              <div className="form-group">
                <label>자기소개서 PDF</label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleFileChange(e, 'coverLetter')}
                  className="file-input"
                />
              </div>

              <div className="form-group">
                <label>포트폴리오 PDF</label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleFileChange(e, 'portfolio')}
                  className="file-input"
                />
                <p className="file-notice">* 각 파일은 최대 10MB까지 업로드 가능합니다.</p>
              </div>

              <div className="modal-buttons">
                <button type="submit" className="submit-btn">작성 완료</button>
                <button type="button" className="cancel-btn" onClick={handleCloseModal}>취소</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default RoadSearch;