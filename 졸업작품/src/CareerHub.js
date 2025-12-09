import React, { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CareerHub.css';

const CareerHub = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
 
  const CID = '900186805415-led7aa4g1cij8dqnb1162q56pju5epih.apps.googleusercontent.com';
  const responseMessage = async (response) => {
    console.log(response);
    
    try {
      // Google에서 받은 id_token을 백엔드로 전송
      const backendResponse = await axios.post('http://localhost:3001/api/auth/google', {
        token: response.credential
      }, {
        withCredentials: true
      });

      // 백엔드 응답 처리
      if (backendResponse.data.success) {
        // 백엔드에서 받은 사용자 정보를 로컬 스토리지에 저장
        localStorage.setItem('user', JSON.stringify(backendResponse.data.user));
        // 대시보드 페이지로 리다이렉트
        navigate('/home');
        window.location.reload();
      } else {
        console.error('백엔드 인증 실패:', backendResponse.data.message);
      }
    } catch (error) {
      console.error('백엔드 통신 중 오류 발생:', error);
    }
  };

  const errorMessage = (error) => {
    console.log(error);
  };

   return (
    <GoogleOAuthProvider clientId={CID}>
      <div className="career-hub">
        <div className="login-container">
          <h1>커리어 허브에서<br />당신의 이력을 성장해보세요.</h1>
          <input
            type="email"
            placeholder="이메일을 입력해 주세요."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input type="password" placeholder="비밀번호를 입력해 주세요." /><br />
          <button disabled={!email}>커리어 허브 시작하기</button>

          <div className="auto-login">
            <input type="checkbox" id="autoLogin" />
            <label htmlFor="autoLogin">자동 로그인</label>
          </div>

          <div className="sns-login">
            <p>간편 sns 로그인</p>
            <div className="sns-icons">
              <GoogleLogin
                onSuccess={responseMessage}
                onError={errorMessage}
              />
              <a href="http://localhost:3001/auth/naver" className="oauth-button naver">네이버 로그인</a>
              <a href="http://localhost:3001/auth/kakao" className="oauth-button kakao">카카오 로그인</a>
            </div>
          </div>

          <a href="#" className="bottom-link">처음이신가요?/회원가입</a>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default CareerHub;
