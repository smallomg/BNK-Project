import React, { useState, useEffect } from 'react';
import './Main.css';
import mainlogoImage from './main logo.png';
import vvvImage from './vvv.png'; // 이미지 파일 가져오기
import main33Image from './main33.png'; // 이미지 파일 가져오기
import main55Image from './main55.png'; // 이미지 파일 가져오기
import tem1Image from './tem1.png'; // 템플릿 이미지
import tem2Image from './tem2.png';
import tem3Image from './tem3.png';
import tem4Image from './tem4.png';
import tem5Image from './tem5.png';
import tem6Image from './tem6.png';
import tem7Image from './tem7.png';
import tem8Image from './tem8.png';
import tem9Image from './tem9.png';


function Main() {
  const [headerVisible, setHeaderVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setHeaderVisible(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    document.querySelector('.side-menu').classList.toggle('open');
  };

  const [slideIndex, setSlideIndex] = useState(0);
  const slides = [tem1Image, tem2Image, tem3Image, tem4Image, tem5Image, tem6Image, tem7Image ,tem8Image, tem9Image];

  useEffect(() => {
    const interval = setInterval(() => {
      setSlideIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 2000);

    return () => clearInterval(interval); // 컴포넌트가 언마운트될 때 인터벌을 클리어
  }, [slides.length]);

  return (
    <div className="App">
      <div className="main-banner">
        <div className="overlay-content">
          <div className="logo1">Career Hub</div>
          <nav className="nav1">
            <ul>
              <li><a href="#">마이 로드</a></li>
              <li><a href="#">로드 평가</a></li>
              <li><a href="#">면접 후기</a></li>
              <li><a href="#">로드 공유</a></li>
              <li><a href="#">커뮤니티</a></li>
              <li><a href="#">로그인</a></li>
            </ul>
          </nav>
        </div>
        <div className="banner-text">
          <h1>커리어 허브에 오신 것을 환영합니다!<br />
            커리어 허브는 여러분의 직업적 성장과<br />
            개발을 지원하는 포괄적인 온라인 플랫폼입니다<br />
            이력서 작성부터 자기소개서, 포트폴리오 관리까지 <br />
            모든 커리어 관련 서비스를 이용가능합니다</h1>
          <p>당신의 이력을 관리하세요</p>
          <div className="button-container">
            <a href="manage-career.html" className="manage-career-button">커리어 관리</a>
          </div>
        </div>
      </div>

      <div className="main1">
        <img src={mainlogoImage} alt="메인 첫 사진" />
        <h1>커리어 허브에서, 자신의 커리어를 돋보이게</h1>
        <p>이력서, 자기소개서, 포트폴리오 3가지를 한번에 관리하여 자신의 스펙을 빛내보세요<br />
          자동 커리어 작성, 다른이의 스펙 공유, 면접후기, 실무자가 자신의 스펵을 평가, 취향저격 템플릿<br />
          다양한 서비스를 이용하여 자신의 스펙을 개선해보세요</p>
      </div>
      <div className="link">
        <a href="resume.html" className="button">이력서 &#10132;</a>
        <a href="coverletter.html" className="button">자기소개서 &#10132;</a>
        <a href="portfolio.html" className="button">포트폴리오 &#10132;</a>
      </div>

      <div className="main2">
        <div className="main2-text">
          <h5>career hub</h5>
          <h2>커리어 공유,<br />
            같은 직군 취준생들은 어떤 스펙일까?</h2>
          <p>커리어의 숲에서 길을 찾아가세요. '커리어 공유'는 여러분의 나침반입니다.</p>
          <p>동료들의 이야기로부터 영감을 받고, 자신만의 길을 발견하세요.</p>
          <p>함께, 우리는 더 밝은 미래를 그려갑니다.</p>
          <button className="button-style">더 알아보기</button>
        </div>
        <img src={vvvImage} alt="이미지 설명" />
      </div>

      <div className="main3">
        <div className="main3-text">
          <h5>career hub</h5>
          <h2>로드 평가,<br />
            실무자 or 전문가에게 평가 받아보세요</h2>
          <p>자신의 이력서, 자기소개서, 포트폴리오 등등<br />
            평가받기 원하는 항목을 업로드 해보세요<br />
            여러 전문가 및 실무자분들에게 평가를 받아<br />
            피드백을 받아 성장해 보세요</p>
          <button className="button-style">커리어 업로드</button>
          <button className="button-style">평가 확인</button>
        </div>
        <img src={main33Image} alt="이미지 설명" />
      </div>

      <div className="main4">
        <div className="main4-text">
          <h5>career hub</h5>
          <h2>면접 후기,<br />
            다양한 기업의 면접 후기<br />
            원하는 기업의 정보를 확인하세요</h2>
          <div className="interview-tips">
            <div className="tip">
              <span className="arrow">&#10148;</span>
              <p>다양한 직군별 면접 후기를 골라보세요</p>
            </div>
            <div className="tip">
              <span className="arrow">&#10148;</span>
              <p>희망 지역별 면접후기도 고를수 있어요</p>
            </div>
            <div className="tip">
              <span className="arrow">&#10148;</span>
              <p>직접 댓글을 통한 세부적인 Q&A를 진행해 보세요</p>
            </div>
            <button className="button-style">더 알아보기</button>
          </div>
        </div>
        <img src={main55Image} alt="이미지 설명" />
      </div>

      <div className="main5">
        <div className="main5-text">
          <h5>Career Hub</h5>
          <h2>직군 Q&A,<br />직군 선배들에게 묻고 답해보세요</h2>
          <p>궁금한 점을 해결하고, 선배들의 생생한 경험을 통해 직군에 대한 이해를 높이세요.<br />
            커리어를 더욱 빛나게 할 수 있는 조언을 받아보세요.</p>
          <button className="button-style">질문하러 가기</button>
          <button className="button-style">답변 확인하기</button>
        </div>
        <img src={vvvImage} alt="직군 Q&A 이미지 설명" />
      </div>

      <div className="main6">
        <h5>career hub</h5>
        <h2>템플릿</h2>
        <p>저희의 맞춤형 템플릿으로 단 몇 분 안에 전문적인 디자인을 완성하세요.<br />
          간편하면서도 아름다운 템플릿들이 여러분의 모든 프로젝트를 빛내줄 것입니다.<br />
          창의력을 발휘하고, 시간을 절약하며, 눈부신 결과물을 만들어 보세요</p>
          <button className="button-style" style={{ marginBottom: '40px' }}>사용하기</button>
        <div className="template-slider">
          {slides.map((slide, index) => (
            <div key={index} className={`template-slide ${index === slideIndex ? 'active' : ''}`}>
              <img src={slide} alt={`템플릿 ${index + 1}`} />
            </div>
          ))}
        </div>
      </div>

      <div className="main7">
        <h5>career hub</h5>
        <div className="main7-header">
          <h2>최신 채용 공고</h2>
          <a href="#" className="more-info-button">더 알아보기</a>
        </div>
        <h4>자신에게 맞는 최적의 채용공고를 추천하여 제공합니다<br />
          직군과 지역에 맞는 채용 공고를 확인하고 지원해보세요</h4>
        <div className="job-section">
          <div className="job-card">
            <h3>기획.전략</h3>
          </div>
          <div className="job-card">
            <h3>마케팅.홍보</h3>
          </div>
          <div className="job-card">
            <h3>회계.사무</h3>
          </div>
          <div className="job-card">
            <h3>인사.노무</h3>
          </div>
          <div className="job-card">
            <h3>총무.법무</h3>
          </div>
        </div>
        <div className="job-section">
          <div className="job-card">
            <h3>IT 개발</h3>
          </div>
          <div className="job-card">
            <h3>데이터 관리</h3>
          </div>
          <div className="job-card">
            <h3>보안 관리</h3>
          </div>
          <div className="job-card">
            <h3>디자이너</h3>
          </div>
          <div className="job-card">
            <h3>영업.판매</h3>
          </div>
        </div>
        <div className="job-section">
          <div className="job-card">
            <h3>국.내외 수출</h3>
          </div>
          <div className="job-card">
            <h3>고객 상담</h3>
          </div>
          <div className="job-card">
            <h3>구매.자재.물류</h3>
          </div>
          <div className="job-card">
            <h3>상품 기획</h3>
          </div>
          <div className="job-card">
            <h3>운송.배송</h3>
          </div>
        </div>
        <div className="job-section">
          <div className="job-card">
            <h3>서비스</h3>
          </div>
          <div className="job-card">
            <h3>생산.제조</h3>
          </div>
          <div className="job-card">
            <h3>건설.건축</h3>
          </div>
          <div className="job-card">
            <h3>의료</h3>
          </div>
          <div className="job-card">
            <h3>연구.R&D</h3>
          </div>
        </div>
        <div className="job-section">
          <div className="job-card">
            <h3>문화.스포츠</h3>
          </div>
          <div className="job-card">
            <h3>금융.보험</h3>
          </div>
          <div className="job-card">
            <h3>공공.복지</h3>
          </div>
          <div className="job-card">
            <h3>식.음료</h3>
          </div>
          <div className="job-card">
            <h3>엔지니어</h3>
          </div>
        </div>
      </div>

      <footer>
        <h3>@커리어 허브</h3>
        <p>동명대학교 컴퓨터 공학과 팀: 뉴비코더(송찬혁, 오윤호, 이대영)</p>
        <p>email: sbc3785@gmail.com | tel: 01055812314</p>
      </footer>
    </div>
  );
}

export default Main;
