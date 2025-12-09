import React, { useState } from 'react';

function FilterContainer({ onFilterChange }) {
  const [filters, setFilters] = useState({
    job: [],
    region: [],
    pass: [],
    office: []
  });

  const handleCheckboxChange = (e, category) => {
    const { value, checked } = e.target;
    setFilters(prevFilters => {
      const newFilters = {
        ...prevFilters,
        [category]: checked 
          ? [...prevFilters[category], value]
          : prevFilters[category].filter(item => item !== value)
      };
      return newFilters;
    });
  };

  const handleSearch = () => {
    onFilterChange(filters); // 필터가 변경되면 상위 컴포넌트에 알림
  };

  return (
    <div className="filter-container">
      <h2 style={{ textAlign: 'center', marginBottom: '20px', color: 'black' }}>후기 검색</h2>

      {/* 직무 필터 */}
      <div className="filter-section">
        <h3 className="filter-title">직무:</h3>
        <div className="checkbox-group">
          {['개발자', '디자이너', '회계', '총무/법무/사무', '영업', '고객상담', '물류', '기획',
            '운송', '서비스', '생산', '건설', '의료', '연구', '교육', '스포츠', '보험', '복지'].map(job => (
              <label key={job}>
                <input 
                  type="checkbox" 
                  name="job" 
                  value={job}
                  onChange={(e) => handleCheckboxChange(e, 'job')}
                />
                {job}
              </label>
            ))}
        </div>
      </div>

      {/* 지역 필터 */}
      <div className="filter-section">
        <h3 className="filter-title">지역:</h3>
        <div className="checkbox-group">
          {['서울', '부산', '경기', '인천', '대전', '광주', '강원', '세종', '충북', '충남', '경북', '경남', '전북', '전남', '제주'].map(region => (
            <label key={region}>
              <input 
                type="checkbox" 
                name="region" 
                value={region}
                onChange={(e) => handleCheckboxChange(e, 'region')}
              />
              {region}
            </label>
          ))}
        </div>
      </div>

      {/* 합격여부 필터 */}
      <div className="filter-section">
        <h3 className="filter-title">합격여부:</h3>
        <div className="checkbox-group">
          {['합격', '불합격', '대기중'].map(pass => (
            <label key={pass}>
              <input 
                type="checkbox" 
                name="pass" 
                value={pass}
                onChange={(e) => handleCheckboxChange(e, 'pass')}
              />
              {pass}
            </label>
          ))}
        </div>
      </div>

      {/* 고용형태 필터 */}
      <div className="filter-section">
        <h3 className="filter-title">고용형태:</h3>
        <div className="checkbox-group">
          {['경력직', '신입'].map(office => (
            <label key={office}>
              <input 
                type="checkbox" 
                name="office" 
                value={office}
                onChange={(e) => handleCheckboxChange(e, 'office')}
              />
              {office}
            </label>
          ))}
        </div>
      </div>

      <button className="search-button" onClick={handleSearch}>검색</button>
    </div>
  );
}

export default FilterContainer;