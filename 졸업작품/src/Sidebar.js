import React, { useState } from 'react';
import './inn.css';

const Sidebar = ({ onFilterPosts }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filterJobs = (e) => {
    setSearchTerm(e.target.value.toUpperCase());
  };

  const jobs = [
    "모두 보기", "개발자", "디자이너", "회계", "법무.총무.사무", "영업", "고객상담", 
    "물류", "기획", "운송", "서비스", "생산", "건설", "의료", "연구", "교육", 
    "스포츠", "보험", "복지"
  ];

  return (
    <div className="sidebar">
      <input 
        type="text" 
        id="jobSearch" 
        placeholder="직무 검색..." 
        onChange={filterJobs} 
        value={searchTerm}
      />
      <h2>직군 선택</h2>
      
      <ul id="jobList">
        {jobs
          .filter(job => job.toUpperCase().includes(searchTerm))
          .map((job, index) => (
            <li 
              key={index} 
              onClick={() => {
                if (typeof onFilterPosts === 'function') {
                  onFilterPosts(job); // 함수로 전달되었는지 확인
                } else {
                  console.error('onFilterPosts is not a function');
                }
              }}
              style={{ cursor: 'pointer' }}
            >
              {job}
            </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
