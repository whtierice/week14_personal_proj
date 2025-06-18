import React, { useState } from 'react';
import { Post } from '../types';
import PostForm from '../components/Board/PostForm';
import PostList from '../components/Board/PostList';
import { usePosts, usePost } from '../hooks/usePosts';

const BoardPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  
  // React Query 훅 사용
  const { 
    data: postsData,
    isLoading,
    error,
    isPreviousData
  } = usePosts(currentPage);
  
  // 선택된 게시글 데이터 가져오기
  const { 
    data: selectedPost,
    isLoading: isLoadingPost
  } = usePost(selectedPostId || '');

  // 글 선택 (상세보기)
  const handleSelectPost = (post: Post) => {
    setSelectedPostId(post.id);
  };

  // 목록으로 돌아가기
  const handleBackToList = () => {
    setSelectedPostId(null);
  };

  // 페이지 변경 처리
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  // 폼 성공 처리
  const handleFormSuccess = () => {
    setShowForm(false);
  };

  // 로딩 상태 처리
  if (isLoading && !isPreviousData) {
    return (
      <div className="board-page">
        <h2>커뮤니티 게시판</h2>
        <div className="loading-state">
          <p>게시글을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 에러 상태 처리
  if (error) {
    return (
      <div className="board-page">
        <h2>커뮤니티 게시판</h2>
        <div className="error-state">
          <p>게시글을 불러오는데 실패했습니다.</p>
          <button onClick={() => window.location.reload()}>다시 시도</button>
        </div>
      </div>
    );
  }

  // 게시글 목록 데이터
  const posts = postsData?.items || [];
  const totalPages = postsData?.totalPages || 1;

  return (
    <div className="board-page">
      <h2>커뮤니티 게시판</h2>
      <p>운동 팁을 공유하고 서로 응원해요!</p>

      {/* 상세보기 모드 */}
      {selectedPostId && selectedPost ? (
        <div className="post-detail">
          <button className="back-btn" onClick={handleBackToList}>
            ← 목록으로
          </button>
          
          {isLoadingPost ? (
            <div className="loading-state">
              <p>게시글을 불러오는 중...</p>
            </div>
          ) : (
            <>
              <article className="post-content">
                <h3>{selectedPost.title}</h3>
                <div className="post-info">
                  <span>작성자: {selectedPost.author}</span>
                  <span>작성일: {new Date(selectedPost.createdAt).toLocaleDateString('ko-KR')}</span>
                </div>
                
                {selectedPost.imageUrl && (
                  <div className="post-image">
                    <img src={selectedPost.imageUrl} alt={selectedPost.title} />
                  </div>
                )}
                
                <div className="post-body">
                  {selectedPost.content.split('\n').map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}
                </div>
              </article>
              
              <div className="comments-section">
                <h4>댓글 ({selectedPost.comments.length})</h4>
                {selectedPost.comments.length > 0 ? (
                  <div className="comments-list">
                    {selectedPost.comments.map(comment => (
                      <div key={comment.id} className="comment-item">
                        <div className="comment-header">
                          <span className="comment-author">{comment.author}</span>
                          <span className="comment-date">
                            {new Date(comment.createdAt).toLocaleDateString('ko-KR')}
                          </span>
                        </div>
                        <p className="comment-content">{comment.content}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: '#666' }}>아직 댓글이 없습니다. 첫 댓글을 작성해보세요!</p>
                )}
                
                {/* 댓글 작성 폼은 추후 구현 */}
                <p style={{ color: '#666' }}>댓글 작성 기능은 준비 중입니다...</p>
              </div>
            </>
          )}
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
              onCancel={() => setShowForm(false)}
              onSuccess={handleFormSuccess}
            />
          )}

          {posts.length > 0 ? (
            <>
              <PostList 
                posts={posts}
                onSelectPost={handleSelectPost}
              />
              
              {/* 페이지네이션 */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button 
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1 || isLoading}
                  >
                    이전
                  </button>
                  
                  <span className="page-info">
                    {currentPage} / {totalPages}
                  </span>
                  
                  <button 
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || isLoading}
                  >
                    다음
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="empty-state">
              <p>아직 게시글이 없습니다.</p>
              <p>첫 게시글을 작성해보세요!</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BoardPage;