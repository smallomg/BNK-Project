import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './jobQnADetail.css';

const QnADetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [likes, setLikes] = useState(0);
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

  useEffect(() => {
    fetchPostDetails();
    fetchComments();
  }, [id]);

  const fetchPostDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/qnaposts/${id}`);
      setPost(response.data);
      setLikes(response.data.Likes || 0);
    } catch (error) {
      console.error('Error fetching post details:', error);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/qnaposts/${id}/comments`);
      setComments(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleLike = async () => {
    try {
      await axios.post(`http://localhost:3001/api/qnaposts/${id}/like`);
      setLikes(likes + 1);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:3001/api/qnaposts/${id}/comments`, {
        content : newComment,
        userID, // 실제 구현시 로그인된 사용자 ID로 대체
      });
      setComments([...comments, response.data]);
      setNewComment('');
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  if (!post) return <div>Loading...</div>;

  return (
    <div className="qna-detail">
      <button onClick={() => navigate('/qna')}>목록으로 돌아가기</button>
      <h1>{post.Title}</h1>
      <div className="post-info">
        <span>작성자: {post.UserID}</span>
        <span>작성일: {new Date(post.PostDate).toLocaleDateString()}</span>
        <span>조회수: {post.Views}</span>
        <span>추천수: {likes}</span>
      </div>
      <div className="post-content">{post.Content}</div>
      <button onClick={handleLike}>추천</button>
      <div className="comments-section">
        <h2>댓글</h2>
        {comments.map((comment, index) => (
          <div key={index} className="comment">
            <p>{comment.Content}</p>
            <span>{comment.UserID} - {new Date(comment.CreatedAt).toLocaleDateString()}</span>
          </div>
        ))}
        <form onSubmit={handleCommentSubmit}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="댓글을 입력하세요"
          />
          <button type="submit">댓글 작성</button>
        </form>
      </div>
    </div>
  );
};

export default QnADetail;