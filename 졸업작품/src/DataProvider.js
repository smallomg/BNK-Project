import React, { createContext, useState, useContext } from 'react';

// Context 생성
const DataContext = createContext(null);

// Context Provider 컴포넌트
export const DataProvider = ({ children }) => {
  // 초기 데이터 상태 설정 (필요에 따라 초기값을 설정)
  const [data, setData] = useState(null);

  // 데이터 업데이트 함수
  const updateData = (newData) => {
    setData(newData);
  };

  return (
    <DataContext.Provider value={{ data, updateData }}>
      {children}
    </DataContext.Provider>
  );
};

// Context 사용하기
export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
