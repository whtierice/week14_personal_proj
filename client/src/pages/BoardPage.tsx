import React, { useState } from 'react';
import { Post } from '../types';
import PostForm from '../components/Board/PostForm';
import PostList from '../components/Board/PostList';

const BoardPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  // 새 글 추가
  const handleAddPost = (newPost: Post) => {
    setPosts(prevPosts => [newPost, ...prevPosts]); // 최신글이 위로
    setShowForm(false); // 폼 닫기
  };

  // 글 선택 (상세보기)
  const handleSelectPost = (post: Post) => {
    setSelectedPost(post);
  };

  // 목록으로 돌아가기
  const handleBackToList = () => {
    setSelectedPost(null);
  };

  return (
    <div className="board-page">
      <h2>커뮤니티 게시판</h2>
      <p>운동 팁을 공유하고 서로 응원해요!</p>

      {/* 상세보기 모드 */}
      {selectedPost ? (
        <div className="post-detail">
          <button className="back-btn" onClick={handleBackToList}>
            ← 목록으로
          </button>
          
          <article className="post-content">
            <h3>{selectedPost.title}</h3>
            <div className="post-info">
              <span>작성자: {selectedPost.author}</span>
              <span>작성일: {new Date(selectedPost.createdAt).toLocaleDateString('ko-KR')}</span>
            </div>
            <div className="post-body">
              {selectedPost.content.split('\n').map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
          </article>
          
          <div className="comments-section">
            <h4>댓글 ({selectedPost.comments.length})</h4>
            <p style={{ color: '#666' }}>댓글 기능은 준비 중입니다...</p>
          </div>
        </div>
      ) : (
        /* 목록 보기 모드 */
        <>
          {!showForm && (
            <button 
              className="new-post-btn"
              onClick={() => setShowForm(true)}
            >
              ✏️ 새 글 작성
            </button>
          )}

          {showForm && (
            <PostForm 
              onAddPost={handleAddPost}
              onCancel={() => setShowForm(false)}
            />
          )}

          <PostList 
            posts={posts}
            onSelectPost={handleSelectPost}
          />
        </>
      )}
    </div>
  );
};

export default BoardPage;