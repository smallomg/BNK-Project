import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import WriteForm from './WriteForm';
import Sidebar from './Sidebar';
import './inn.css';

const MainContent = ({ }) => {
  const [posts, setPosts] = useState([]);
  const [showWriteForm, setShowWriteForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 12;
  const navigate = useNavigate();
  const [filteredJob, setFilteredJob] = useState('모두 보기');

  // 필터링을 처리하는 함수
  const handleFilterPosts = (job) => {
    setFilteredJob(job);
    console.log('Filtered Job:', job); // 선택된 직군을 확인하기 위한 로그
  };
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/qnaposts');
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const toggleWriteForm = () => {
    setShowWriteForm(!showWriteForm);
  };

  const addNewPost = async (newPost) => {
    try {
      const response = await axios.post('http://localhost:3001/api/qnaposts', newPost);
      setPosts([response.data, ...posts]);
    } catch (error) {
      console.error('Error adding new post:', error);
    }
  };

  const filteredPosts = filteredJob === '모두 보기' ? posts : posts.filter(post => post.JobCategory === filteredJob);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePostClick = (post) => {
    navigate(`/qna/${post.QuestionID}`);
  };

  return (
    <div className="container">
      <Sidebar onFilterPosts={handleFilterPosts} />
      <div className="main-content">
        <div className="board-header">
          <div>
            <div className="board-title">직군 Q&A 게시판</div>
            <div className="board-subtitle">자신과 같은 계열의 직무 사람들과 다양한 소통을 해보세요.</div>
          </div>
          <select style={{ width: '100px', height: '40px', fontSize: '12px', border: '1px solid #ccc' }}>
            <option value="newest">최신순</option>
            <option value="views">조회순</option>
            <option value="likes">추천순</option>
          </select>
        </div>
        <table id="postsTable">
          <thead>
            <tr>
              <th>직무</th>
              <th>제목</th>
              <th>작성자</th>
              <th>작성일</th>
              <th>조회수</th>
              <th>추천수</th>
            </tr>
          </thead>
          <tbody>
            {currentPosts.map((post, index) => (
              <tr key={index} className="post" onClick={() => handlePostClick(post)}>
                <td>{post.JobCategory}</td>
                <td>{post.Title}</td>
                <td>{post.UserID}</td>
                <td>{new Date(post.PostDate).toLocaleDateString()}</td>
                <td>{post.Views || 0}</td>
                <td>{post.Likes || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
          <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
            이전
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button key={i} onClick={() => handlePageChange(i + 1)} className={currentPage === i + 1 ? 'active' : ''}>
              {i + 1}
            </button>
          ))}
          <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
            다음
          </button>
        </div>
        <div className="write-button" onClick={toggleWriteForm}>
          <i className="fas fa-pencil-alt"></i> 글 작성
        </div>
        {showWriteForm && <WriteForm onSubmit={addNewPost} onClose={toggleWriteForm} />}
      </div>
    </div>
  );
};

export default MainContent;