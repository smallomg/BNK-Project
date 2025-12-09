import React, { useEffect, useState } from 'react';

function BannerContainer() {
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIndex((prevIndex) => (prevIndex + 1) % 3); // 슬라이드 수에 맞게 % 연산 수정
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="banner-container">
      <div className="slide-banner">
        {[1, 2, 3].map((num, index) => (
          <div key={index} className={`slides fade ${index === slideIndex ? 'active' : ''}`}>
            <img 
              src={`/${num === 1 ? 'images/qq.png' : num === 2 ? 'images/33.png' : 'logo192.png'}`} // 3개의 이미지 파일을 참조
              style={{ width: '80%', height: '130px' }} 
              alt={`Slide ${num}`} 
            />
          </div>
        ))}
      </div>
      <div className="ad-banner">
        <img 
          src="images/qq.png" // 퍼블릭 폴더에 직접 저장된 광고 이미지 경로
          style={{ width: '80%' }} 
          alt="Ad 1" 
        />
      </div>
      <div className="ad-banner">
        <img 
          src="images/33.png" // 퍼블릭 폴더에 직접 저장된 광고 이미지 경로
          style={{ width: '80%' }} 
          alt="Ad 2" 
        />
      </div>
    </div>
  );
}

export default BannerContainer;