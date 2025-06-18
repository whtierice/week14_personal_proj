import React, { useState } from 'react';
import { Post } from '../../types';
import { useComments } from '../../hooks/usePosts';
import CommentForm from './CommentForm';
import CommentList from './CommentList';

interface PostDetailModalProps {
  post: Post;
  onClose: () => void;
  onLike: (postId: string) => void;
}

const PostDetailModal: React.FC<PostDetailModalProps> = ({ post, onClose, onLike }) => {
  const [commentPage, setCommentPage] = useState(1);
  const commentsPerPage = 5;
  
  // 댓글 데이터 가져오기
  const { 
    data: comments = post.comments,
    isLoading: isLoadingComments,
    refetch: refetchComments
  } = useComments(post.id);
  
  // 날짜 포맷 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // 댓글 페이지네이션
  const totalPages = Math.ceil(comments.length / commentsPerPage);
  const paginatedComments = comments.slice(
    (commentPage - 1) * commentsPerPage,
    commentPage * commentsPerPage
  );
  
  // 댓글 페이지 변경
  const handlePageChange = (page: number) => {
    setCommentPage(page);
  };
  
  // 댓글 작성 성공
  const handleCommentSuccess = () => {
    refetchComments();
  };
  
  // 좋아요 처리
  const handleLike = () => {
    onLike(post.id);
  };
  
  // 모달 외부 클릭 시 닫기
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="post-modal">
        <button className="close-modal" onClick={onClose}>×</button>
        
        <div className="post-modal-content">
          {/* 왼쪽: 이미지 */}
          <div className="post-modal-image">
            {post.imageUrl ? (
              <img src={post.imageUrl} alt={post.title} />
            ) : (
              <div className="no-image">
                <h3>{post.title}</h3>
                <p>이미지가 없는 게시물입니다</p>
              </div>
            )}
          </div>
          
          {/* 오른쪽: 게시물 정보 및 댓글 */}
          <div className="post-modal-details">
            {/* 게시물 헤더 */}
            <div className="post-modal-header">
              <h3>{post.title}</h3>
              <div className="post-meta">
                <span className="post-author">{post.author}</span>
                <span className="post-date">{formatDate(post.createdAt)}</span>
              </div>
            </div>
            
            {/* 게시물 내용 */}
            <div className="post-modal-body">
              {post.content.split('\n').map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
            
            {/* 좋아요 버튼 */}
            <div className="post-actions">
              <button 
                className={`like-button ${post.liked ? 'liked' : ''}`}
                onClick={handleLike}
              >
                {post.liked ? '❤️' : '🤍'} 좋아요 {post.likes || 0}
              </button>
            </div>
            
            {/* 구분선 */}
            <hr className="divider" />
            
            {/* 댓글 섹션 */}
            <div className="post-modal-comments">
              {/* 댓글 목록 */}
              {isLoadingComments ? (
                <div className="loading-comments">댓글을 불러오는 중...</div>
              ) : (
                <CommentList 
                  comments={paginatedComments}
                  postId={post.id}
                  currentPage={commentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
              
              {/* 댓글 작성 폼 */}
              <CommentForm 
                postId={post.id}
                onSuccess={handleCommentSuccess}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetailModal;