import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const GoogleCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // URL에서 Authorization Code 추출
    const urlParams = new URLSearchParams(window.location.search);
    const authCode = urlParams.get('code');
    console.log(authCode);
    if (authCode) {
      // 서버로 Authorization Code 전달
      axios.post('http://localhost:3001/auth/google/callback', { code: authCode }, { withCredentials: true })
        .then(response => {
          console.log('로그인 성공:', response.data);
          // 성공 시 메인 페이지로 이동
          navigate('/profile');
        })
        .catch(error => {
          console.error('로그인 실패:', error);
          // 실패 시 에러 페이지 또는 로그인 페이지로 이동
          navigate('/login');
        });
    } else {
      console.error('Authorization Code가 없습니다.');
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div>
      <h1>로그인 처리 중...</h1>
    </div>
  );
};

export default GoogleCallback;
