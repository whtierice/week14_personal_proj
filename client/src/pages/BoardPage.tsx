import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Post } from '../types';
import PostForm from '../components/Board/PostForm';
import PostList from '../components/Board/PostList';
import PostDetailModal from '../components/Board/PostDetailModal';
import { usePosts, usePost, useLikePost } from '../hooks/usePosts';

const BoardPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  
  // 무한 스크롤 관련 상태
  const observer = useRef<IntersectionObserver | null>(null);
  const lastPostElementRef = useCallback((node: HTMLDivElement | null) => {
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setCurrentPage(prevPage => prevPage + 1);
      }
    });
    
    if (node) observer.current.observe(node);
  }, [hasMore]);
  
  // React Query 훅 사용
  const { 
    data: postsData,
    isLoading,
    error,
    isFetching
  } = usePosts(currentPage);
  
  // 선택된 게시글 데이터 가져오기
  const { 
    data: selectedPost,
    isLoading: isLoadingPost
  } = usePost(selectedPostId || '');
  
  // 좋아요 mutation
  const likePostMutation = useLikePost();

  // 페이지가 변경될 때마다 게시글 목록 업데이트
  useEffect(() => {
    if (postsData?.items) {
      if (currentPage === 1) {
        setAllPosts(postsData.items);
      } else {
        setAllPosts(prev => [...prev, ...postsData.items]);
      }
      
      // 더 불러올 데이터가 있는지 확인
      setHasMore(currentPage < postsData.totalPages);
    }
  }, [postsData, currentPage]);

  // 글 선택 (상세보기)
  const handleSelectPost = (post: Post) => {
    setSelectedPostId(post.id);
  };

  // 모달 닫기
  const handleCloseModal = () => {
    setSelectedPostId(null);
  };
  
  // 좋아요 처리
  const handleLikePost = (postId: string) => {
    likePostMutation.mutate(postId);
  };

  // 폼 성공 처리
  const handleFormSuccess = () => {
    setShowForm(false);
    setCurrentPage(1); // 첫 페이지로 리셋
  };

  // 로딩 상태 처리 (첫 로딩 시에만)
  if (isLoading && currentPage === 1) {
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
          <button onClick={() => setCurrentPage(1)}>다시 시도</button>
        </div>
      </div>
    );
  }

  return (
    <div className="board-page">
      <h2>커뮤니티 게시판</h2>
      <p>운동 팁을 공유하고 서로 응원해요!</p>

      {/* 새 글 작성 버튼 */}
      {!showForm && (
        <button 
          className="new-post-btn"
          onClick={() => setShowForm(true)}
        >
          ✏️ 새 글 작성
        </button>
      )}

      {/* 글 작성 폼 */}
      {showForm && (
        <PostForm 
          onCancel={() => setShowForm(false)}
          onSuccess={handleFormSuccess}
        />
      )}

      {/* 게시글 그리드 */}
      {allPosts.length > 0 ? (
        <div className="posts-container">
          <PostList 
            posts={allPosts}
            onSelectPost={handleSelectPost}
          />
          
          {/* 무한 스크롤 로딩 인디케이터 */}
          {isFetching && (
            <div className="loading-more">
              <div className="loading-spinner"></div>
              <p>더 불러오는 중...</p>
            </div>
          )}
          
          {/* 마지막 요소 감지를 위한 참조 요소 */}
          <div ref={lastPostElementRef} className="scroll-sentinel"></div>
        </div>
      ) : (
        <div className="empty-state">
          <p>아직 게시글이 없습니다.</p>
          <p>첫 게시글을 작성해보세요!</p>
        </div>
      )}
      
      {/* 게시글 상세 모달 */}
      {selectedPostId && selectedPost && (
        <PostDetailModal 
          post={selectedPost}
          onClose={handleCloseModal}
          onLike={handleLikePost}
        />
      )}
    </div>
  );
};

export default BoardPage;