import React, { useState } from 'react';
import { Comment } from '../../types';
import { useDeleteComment } from '../../hooks/usePosts';

interface CommentListProps {
  comments: Comment[];
  postId: string;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const CommentList: React.FC<CommentListProps> = ({ 
  comments, 
  postId, 
  currentPage, 
  totalPages, 
  onPageChange 
}) => {
  const [expandedComment, setExpandedComment] = useState<string | null>(null);
  const deleteCommentMutation = useDeleteComment(postId);
  
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
  
  // 댓글 삭제 처리
  const handleDeleteComment = (commentId: string) => {
    if (window.confirm('댓글을 삭제하시겠습니까?')) {
      deleteCommentMutation.mutate(commentId);
    }
  };
  
  // 댓글 내용 토글
  const toggleComment = (commentId: string) => {
    if (expandedComment === commentId) {
      setExpandedComment(null);
    } else {
      setExpandedComment(commentId);
    }
  };
  
  if (comments.length === 0) {
    return (
      <div className="empty-comments">
        <p>아직 댓글이 없습니다. 첫 댓글을 작성해보세요!</p>
      </div>
    );
  }
  
  return (
    <div className="comments-section">
      <h4>댓글 목록</h4>
      
      <div className="comments-list">
        {comments.map(comment => (
          <div key={comment.id} className="comment-item">
            <div className="comment-header">
              <span className="comment-author">{comment.author}</span>
              <span className="comment-date">{formatDate(comment.createdAt)}</span>
            </div>
            
            <p className={`comment-content ${expandedComment === comment.id ? 'expanded' : ''}`}>
              {comment.content}
            </p>
            
            {comment.content.length > 100 && (
              <button 
                className="toggle-comment" 
                onClick={() => toggleComment(comment.id)}
              >
                {expandedComment === comment.id ? '접기' : '더 보기'}
              </button>
            )}
            
            <div className="comment-actions">
              <button 
                className="delete-comment"
                onClick={() => handleDeleteComment(comment.id)}
              >
                삭제
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="pagination">
          <button 
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1 || deleteCommentMutation.isPending}
          >
            이전
          </button>
          
          <span className="page-info">
            {currentPage} / {totalPages}
          </span>
          
          <button 
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages || deleteCommentMutation.isPending}
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
};

export default CommentList;