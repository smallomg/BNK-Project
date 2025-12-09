import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './inn.css';

const WriteForm = ({ onSubmit, onClose }) => {
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

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    JobCategory: '개발자',
    Title: '',
    Content: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async () => {
    console.log(userID);
    try {
      // UserID를 임시로 1로 설정. 실제 구현에서는 로그인한 사용자의 ID를 사용해야 합니다.
      const newPost = {
        ...formData,
        userID
      };

      const response = await axios.post('http://localhost:3001/api/qnaposts', newPost);
      
      // 서버로부터 받은 응답 데이터를 onSubmit 함수에 전달
      onSubmit(response.data);

      // 커뮤니티 페이지로 이동
      navigate('/JobQnA');
      onClose();
    } catch (error) {
      console.error('Error submitting post:', error);
      // 여기에 에러 처리 로직을 추가할 수 있습니다.
      // 예: 사용자에게 에러 메시지 표시
    }
  };

  return (
    <>
      <div className="overlay" onClick={onClose}></div>
      <div className="write-form">
        <h1>글 작성하기</h1>
        <form id="postForm">
          <label>직무 선택:</label>
          <select id="JobCategory" value={formData.JobCategory} onChange={handleChange}>
            <option value="개발자">개발자</option>
            <option value="디자이너">디자이너</option>
            <option value="회계">회계</option>
            <option value="법무.총무.사무">법무.총무.사무</option>
            <option value="영업">영업</option>
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
          <label>제목:</label>
          <input type="text" id="Title" required value={formData.Title} onChange={handleChange} />
          <label>본문:</label>
          <textarea id="Content" required value={formData.Content} onChange={handleChange}></textarea>
          <button type="button" onClick={handleSubmit}>작성 완료</button>
        </form>
      </div>
    </>
  );
};

export default WriteForm;