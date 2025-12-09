
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import './ss.css';

const QnaDetail = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [post, setPost] = useState({
    title: '',
    job: '',
    author: '',
    date: '',
    views: '',
    likes: '',
    content: '',
  });
  const [comments, setComments] = useState([
    {
      user: 'dusg****',
      content: '시간 관애없이 학습할 수 있어 좋습니다.',
      date: '2015.08.01 10:16',
      likes: 1,
      dislikes: 2,
    },
  ]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    // Retrieve post data from location state
    const fetchedPost = location.state?.post || {
      title: '제목 없음',
      job: '직무 없음',
      author: '작성자 없음',
      date: '날짜 없음',
      views: '0',
      likes: '0',
      content: '내용 없음',
    };

    setPost(fetchedPost);
  }, [location.state]);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim() !== '') {
      setComments([
        ...comments,
        {
          user: '사용자****',
          content: newComment,
          date: new Date().toLocaleString(),
          likes: 0,
          dislikes: 0,
        },
      ]);
      setNewComment('');
    }
  };

  const handleLikeDislike = (index, type) => {
    const updatedComments = comments.map((comment, i) => {
      if (i === index) {
        return {
          ...comment,
          [type]: comment[type] + 1,
        };
      }
      return comment;
    });
    setComments(updatedComments);
  };

  return (
    <div className="containers">
      <div className="post-name">
        <h1>직군 Q&A 게시판</h1>
        <p>
          같은 직군 사람들에게 다양한 질의응답을 받아보세요
          <br />
          면접, 이직, 퇴사 등 다양한 주제로 소통하세요
        </p>
        <br />
        <div className="back">
          <a onClick={() => navigate('/community')}>목록으로 돌아가기</a>
        </div>
      </div>
      <div className="sub-post">
        <p>1. 모든 게시글과 답변은 개인정보 보호법을 준수하며, 사용자의 동의 없이 개인정보를 공개하거나 사용해서는 안 됩니다.</p>
        <p>2. 게시판의 내용은 저작권법을 준수해야 하며, 타인의 저작물을 무단으로 사용할 경우 법적 책임이 따를 수 있습니다.</p>
        <p>3. 사용자 간의 소통은 차별 금지 및 평등한 대우의 원칙을 준수해야 하며, 혐오 발언이나 차별적 언어 사용을 금지해야 합니다.</p>
        <p>4. 법적 분쟁이 발생할 가능성이 있는 내용에 대해서는 적절한 법률 자문을 구하고, 필요시 게시물을 삭제하거나 수정해야 합니다.</p>
      </div>
     
     <br/>
        <div className="headers">
          제목: <span id="postTitle">{post.title}</span>
        </div>
        <table>
          <tbody>
            <tr>
              <th>등록자명</th>
              <td><span id="postAuthor">{post.author}</span></td>
              <th>직무</th>
              <td><span id="postJob">{post.job}</span></td>
              <th>등록일</th>
              <td><span id="postDate">{post.date}</span></td>
            </tr>
            <tr>
              <th>조회수</th>
              <td colspan="1"><span id="postViews">{post.views}</span></td>
              <th>추천수</th>
              <td colspan="3"><span id="postLikes">{post.likes}</span></td>
            </tr>
          </tbody>
        </table>
       
     
      <div className="post-content">
          <span id="postContent">{post.content}</span>
        </div>
      <div className="comments-section">
        <h2>댓글</h2>
        <form id="comment-form" onSubmit={handleCommentSubmit}>
          <textarea
            id="comment-input"
            placeholder="댓글을 입력하세요..."
            required
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          ></textarea>
          <button type="submit">댓글 달기</button>
        </form>
        <ul id="comments-list">
          {comments.map((comment, index) => (
            <li key={index} className="comment-item">
              <div className="comment-user">{comment.user}</div>
              <div className="comment-content">{comment.content}</div>
              <div className="comment-footer">
                <span className="comment-date">{comment.date}</span>
                <button
                  className="like-button"
                  onClick={() => handleLikeDislike(index, 'likes')}
                >
                  좋아요
                </button>
                <span className="likes-count">{comment.likes}</span>
                <button
                  className="dislike-button"
                  onClick={() => handleLikeDislike(index, 'dislikes')}
                >
                  싫어요
                </button>
                <span className="dislikes-count">{comment.dislikes}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default QnaDetail;
