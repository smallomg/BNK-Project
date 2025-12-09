import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import './PostContainer.css';

const PostContainer = ({ filters }) => {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false); // 면접 후기 작성 모달 상태
  const [isViewModalOpen, setIsViewModalOpen] = useState(false); // 게시글 보기 모달 상태
  const [selectedReview, setSelectedReview] = useState(null); // 선택된 리뷰 상태
  const postsPerPage = 12;
  const postColorRef = useRef(null);
  const formRef = useRef(null);
  const [userID, setUserID] = useState(null);

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

  useEffect(() => {
    const createLines = () => {
      const postColor = postColorRef.current;
      const numberOfLines = 10;

      for (let i = 0; i < numberOfLines; i++) {
        let line = document.createElement('div');
        line.classList.add('line');
        line.style.top = `${i * 20}px`;
        if (i % 2 === 0) {
          line.style.left = '0';
          line.style.width = '45%';
        } else {
          line.style.right = '0';
          line.style.width = '45%';
        }
        line.style.animationDelay = `${i * 0.2}s`;
        postColor.appendChild(line);
      }
    };

    createLines();
  }, []);

  useEffect(() => {
    fetchReviews();
  }, []);

  
  const fetchReviews = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/interview-reviews');
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const applyFilters = useCallback(() => {
    let result = [...reviews];
    if (filters.job.length) {
      result = result.filter(review => filters.job.includes(review.Position));
    }
    if (filters.region.length) {
      result = result.filter(review => filters.region.includes(review.Region));
    }
    if (filters.pass.length) {
      result = result.filter(review => filters.pass.includes(review.PassStatus));
    }
    if (filters.office.length) {
      result = result.filter(review => filters.office.includes(review.EmploymentType));
    }
    setFilteredReviews(result);
    setCurrentPage(1);
  }, [filters, reviews]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredReviews.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredReviews.length / postsPerPage);

  const handlePageChange = (direction) => {
    setCurrentPage(prevPage => {
      const newPage = direction === 'next'
        ? Math.min(prevPage + 1, totalPages)
        : Math.max(prevPage - 1, 1);
      return newPage;
    });
  };

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const formObject = Object.fromEntries(formData.entries());
  
    if (userID) {
      formObject.UserID = userID;  // 사용자 ID를 formObject에 추가
    }
  
    try {
      await axios.post('http://localhost:3001/api/interview-reviews', formObject);
      fetchReviews();
      setIsWriteModalOpen(false);
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const resetForm = () => {
    if (formRef.current) {
      formRef.current.reset();
    }
  };

  useEffect(() => {
    if (isWriteModalOpen) {
      resetForm();
    }
  }, [isWriteModalOpen]);

  const closeModal = () => {
    setIsViewModalOpen(false);
    setSelectedReview(null);
  };

  const closeWriteModal = () => {
    setIsWriteModalOpen(false);
    resetForm();
  };

  const handlePostClick = (review) => {
    setSelectedReview(review);
    setIsViewModalOpen(true);
  };
  

  return (
    <div className="post-color" ref={postColorRef}>
      <div className="post-title">
        <h2>다른 사람은 면접을 어떻게 봤을까?<br /> 생생한 면접 후기를 확인해보세요!</h2>
      </div>
      <div className="dropdown">
        <select onChange={(e) => console.log(e.target.value)}>
          <option value="most_viewed">조회수</option>
          <option value="newest">최근 글</option>
          <option value="oldest">오래된 글</option>
        </select>
      </div>
      <div className="post-container">
        {currentPosts.length > 0 ? (
          currentPosts.map(review => (
            <div key={review.ReviewID} className="post" onClick={() => handlePostClick(review)}>
              <h3>{review.CompanyName}</h3>
              <h4>직무: {review.Position}</h4>
              <div className="tags">
                <span className="tag">#{review.Position}</span>
                <span className="tag">#{review.CompanyAtmosphere}</span>
                <span className="tag">#{review.InterviewerAttitude}</span>
              </div>
              <span className="arrow"><i className="fas fa-arrow-right"></i></span>
            </div>
          ))
        ) : (
          <p>검색 결과가 없습니다.</p>
        )}
      </div>
      <div id="pagination">
        <button onClick={() => handlePageChange('previous')} disabled={currentPage === 1}>이전</button>
        {pageNumbers.map(number => (
          <button
            key={number}
            onClick={() => setCurrentPage(number)}
            className={number === currentPage ? 'active' : ''}
          >
            {number}
          </button>
        ))}
        <button onClick={() => handlePageChange('next')} disabled={currentPage === totalPages}>다음</button>
      </div>
      <button className="post-button" onClick={() => setIsWriteModalOpen(true)}>
        면접 후기 작성하기
      </button>
      <div id="writeReviewModal" className={`modal ${isWriteModalOpen ? 'show' : ''}`}>
        <div className="modal-content">
          <span className="close" onClick={() => setIsWriteModalOpen(false)}>&times;</span>
          <h1>면접 후기 작성</h1>
          <form id="interviewForm" ref={formRef} onSubmit={handleSubmit}>
            <h2>기본 정보</h2>
            <label>직무:
              <select name="Position" required>
                <option value="">선택하세요</option>
                <option value="개발자">개발자</option>
                <option value="디자이너">디자이너</option>
                <option value="총무/법무/사무">총무/법무/사무</option>
                <option value="영업">영업</option>
                <option value="마케팅">마케팅</option>
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
            </label><br />
            <label>지역:
              <select name="Region" required>
                <option value="">선택하세요</option>
                <option value="서울">서울</option>
                <option value="부산">부산</option>
                <option value="경기">경기</option>
                <option value="인천">인천</option>
                <option value="대전">대전</option>
                <option value="광주">광주</option>
                <option value="강원">강원</option>
                <option value="세종">세종</option>
                <option value="충북">충북</option>
                <option value="충남">충남</option>
                <option value="경북">경북</option>
                <option value="경남">경남</option>
                <option value="전북">전북</option>
                <option value="전남">전남</option>
                <option value="제주">제주</option>
              </select>
            </label><br />
            <label>합격 여부:
              <select name="PassStatus" required>
                <option value="">선택하세요</option>
                <option value="합격">합격</option>
                <option value="불합격">불합격</option>
                <option value="대기중">대기중</option>
              </select>
            </label><br />
            <label>고용 형태:
              <select name="EmploymentType" required>
                <option value="">선택하세요</option>
                <option value="신입">신입</option>
                <option value="경력직">경력직</option>
              </select>
            </label><br />
            <label>기업 이름:
              <input type="text" name="CompanyName" required />
            </label><br />
            <label>면접 날짜:
              <input type="date" name="ReviewDate" required />
            </label><br />
            <label>난이도:
              <input type="number" name="Difficulty" min="1" max="5" required />
            </label><br />

            <h2>면접 내용</h2>
            <label>면접관 및 지원자 수:
              <textarea name="InterviewerCount" required />
            </label><br />
            <label>면접 형태:
              <textarea name="InterviewType" required />
            </label><br />
            <label>면접 질문:
              <textarea name="InterviewQuestion" required />
            </label><br />
            <label>면접관 반응:
              <textarea name="InterviewerResponse" required />
            </label><br />
            <label>면접 분위기:
              <textarea name="InterviewAtmosphere" required />
            </label><br />
            <label>면접 후 아쉬웠던 점:
              <textarea name="InterviewRegrets" required />
            </label><br />

            <h2>면접 평가</h2>
            <label>면접관 태도:
              <select name="InterviewerAttitude" required>
                <option value="좋음">좋음</option>
                <option value="보통">보통</option>
                <option value="나쁨">나쁨</option>
              </select>
            </label><br />
            <label>회사 분위기:
              <select name="CompanyAtmosphere" required>
                <option value="너무 쉬움">너무 쉬움</option>
                <option value="쉬움">쉬움</option>
                <option value="보통">보통</option>
                <option value="어려움">어려움</option>
                <option value="매우 어려움">매우 어려움</option>
              </select>
            </label><br />

            <button type="submit">게시글 작성</button>
          </form>
        </div>
      </div>
      <div id="viewReviewModal" className={`modal ${isViewModalOpen ? 'show' : ''}`}>
        <div className="modal-content">
          <span className="close" onClick={closeModal}>&times;</span>
          {selectedReview ? (
            <>
              <h1>{selectedReview.CompanyName}</h1>
              <p><strong>직무:</strong> {selectedReview.Position}</p>
              <p><strong>지역:</strong> {selectedReview.Region}</p>
              <p><strong>합격 여부:</strong> {selectedReview.PassStatus}</p>
              <p><strong>고용 형태:</strong> {selectedReview.EmploymentType}</p>
              <p><strong>면접 날짜:</strong> {new Date(selectedReview.ReviewDate).toLocaleDateString()}</p>
              <p><strong>난이도:</strong> {selectedReview.Difficulty}</p>
              <h2>면접 내용</h2>
              <p><strong>면접관 및 지원자 수:</strong> {selectedReview.InterviewerCount}</p>
              <p><strong>면접 형태:</strong> {selectedReview.InterviewType}</p>
              <p><strong>면접 질문:</strong> {selectedReview.InterviewQuestion}</p>
              <p><strong>면접관 반응:</strong> {selectedReview.InterviewerResponse}</p>
              <p><strong>면접 분위기:</strong> {selectedReview.InterviewAtmosphere}</p>
              <p><strong>면접 후 아쉬웠던 점:</strong> {selectedReview.InterviewRegrets}</p>
              <h2>면접 평가</h2>
              <p><strong>면접관 태도:</strong> {selectedReview.InterviewerAttitude}</p>
              <p><strong>회사 분위기:</strong> {selectedReview.CompanyAtmosphere}</p>
            </>
          ) : (
            <p>선택된 게시글이 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default PostContainer;