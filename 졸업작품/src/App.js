import logo from './logo.svg';
import './App.css';
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import create from 'zustand';
import { BrowserRouter, Link, Route, Routes, Outlet } from 'react-router-dom';
import { pdfjs } from 'react-pdf';
import { AiOutlineClose } from "react-icons/ai";
import RoadSearch from './roadSearch';
import RoadShare from './roadshare';
import axios from 'axios';
import Logins from './CareerHub'
import { useStore } from './store';
import { useAuth } from './backend/auth/AuthContext';
import BannerContainer from './BannerContainer';
import FilterContainer from './FilterContainer';
import PostContainer from './PostContainer';
import MainContent from './MainContent';
import Roads from './Road';
import MyRoad from './myRoad';
import Mains from './main';
import GoogleCallback from'./GoogleCallback';
import QnADetail from './jobQnADetail';
import { useData } from './DataProvider';


function App() {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const { count } = useStore();//전역변수 사용법
  const [user, setUser] = useState(null);
  const [userID, setUserID] = useState(null);
  const [redirect, setRedirect] = useState(false);
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
  }, [redirect]);

  const toggleSideMenu = () => {
    setIsSideMenuOpen(!isSideMenuOpen);
    console.log("세션에 저장된 정보:", userID);
  };
  const auth = useAuth();

  const logout =() =>{
    setUserID(0);
    localStorage.removeItem('user');
    setRedirect(!redirect);
  };
  return (
    <BrowserRouter>

      <div className="App">
        <div className="header">
          <div onClick={toggleSideMenu} className="menu-toggle" style={{ color: 'black', marginTop: '10px' }}>&#9776;</div>
          <div className="logo"><Link to="/Home" style={{ textDecoration: "none", color:"black"}}>career hub</Link></div>
          <div className="nav">
            <ul>
              <li><Link to="/Myroad">마이 로드</Link></li>
              <li><Link to="/Road">로드 평가</Link></li>
              <li><Link to="/Interview">면접 후기</Link></li>
              <li><Link to="/other">로드 공유</Link></li>
              <li><Link to="/JobQnA">직군QnA</Link></li>
              {userID ? (
                <li><Link onClick={logout}>로그아웃</Link></li>
              ):(
                <li><Link to="/login">로그인</Link></li>
              )}

            </ul>
          </div>

          <div className={`side-menu ${isSideMenuOpen ? 'open' : ''}`}>
            <ul>
              <li><a href="#">마이 페이지</a></li>
              <li><a href="#">설정</a></li>
              <li><a href="#">로그아웃</a></li>
            </ul>
          </div>
        </div>

        <Routes>
          <Route path='/Home' element={<Main userID={userID} setUserID={setUserID}/>}/>
          <Route path='/Myroad' element={<Myroad userID={userID} setUserID={setUserID}/>} />
          <Route path='/Interview' element={<Interview userID={userID} setUserID={setUserID}/>} />
          <Route path='/other' element={<Other />}>
            <Route index element={<RoadSearch />} />
            <Route path="share/:id" element={<RoadShare />} />
          </Route>
          <Route path='/Road' element={<Road userID={userID} setUserID={setUserID}/>} />
          <Route path='/JobQnA' element={<JobQnA userID={userID} setUserID={setUserID}/>} />
          <Route path='/login' element={<Login userID={userID} setUserID={setUserID}/>} />
          <Route path='/auth/google/callback' element={<GoogleCallback userID={userID} setUserID={setUserID}/>} />
          <Route path="/qna/:id" element={<QnADetail />} />
        </Routes>
      </div>

    </BrowserRouter>
  );
}


function Main() {//메인 홈페이지
  return(
    <>
      <Mains/>
    </>
  );
}

function Myroad() {//메인 홈페이지
  return(
    <>
      <MyRoad/>
    </>
  );
}

function Interview() {
  const [filters, setFilters] = useState({
    job: [],
    region: [],
    pass: [],
    office: []
  });

  // 필터 상태를 업데이트하는 함수
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="content-area">
      <div className="main-container">
        <BannerContainer />
        <FilterContainer onFilterChange={handleFilterChange} />
      </div>
      <PostContainer filters={filters} />

    </div>
  );
}
const Other = ({ }) => { // 로드 공유 페이지
  return (
    <Outlet />)
}

function Road() { //로드 평가 페이지
  
  return (
    <div>
      <Roads/>
    </div>
  );

}

function JobQnA() {
  return (
    <>
    <MainContent/>
    </>
  );
}

function Login() {//로그인부분
  return (
    <Logins />
  );
};


export default App;
