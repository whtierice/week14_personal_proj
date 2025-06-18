import React, { useState } from 'react';
import { useCreateComment } from '../../hooks/usePosts';

interface CommentFormProps {
  postId: string;
  onSuccess?: () => void;
}

const CommentForm: React.FC<CommentFormProps> = ({ postId, onSuccess }) => {
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState<{ author?: string; content?: string }>({});
  
  const createCommentMutation = useCreateComment();
  const isPending = createCommentMutation.isPending;
  
  // 실시간 유효성 검증
  const validateField = (name: string, value: string) => {
    if (name === 'author') {
      if (!value.trim()) {
        return '작성자 이름을 입력해주세요.';
      }
      if (value.length > 20) {
        return '작성자 이름은 20자 이내로 입력해주세요.';
      }
    }
    
    if (name === 'content') {
      if (!value.trim()) {
        return '댓글 내용을 입력해주세요.';
      }
      if (value.length > 500) {
        return '댓글은 500자 이내로 입력해주세요.';
      }
    }
    
    return '';
  };
  
  // 입력 필드 변경 처리
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'author') {
      setAuthor(value);
    } else if (name === 'content') {
      setContent(value);
    }
    
    // 유효성 검증
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error || undefined
    }));
  };
  
  // 폼 제출
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 모든 필드 유효성 검증
    const authorError = validateField('author', author);
    const contentError = validateField('content', content);
    
    if (authorError || contentError) {
      setErrors({
        author: authorError || undefined,
        content: contentError || undefined
      });
      return;
    }
    
    // 댓글 생성 요청
    createCommentMutation.mutate({
      postId,
      author,
      content
    }, {
      onSuccess: () => {
        // 폼 초기화
        setAuthor('');
        setContent('');
        setErrors({});
        
        // 성공 콜백 호출
        if (onSuccess) {
          onSuccess();
        }
      }
    });
  };
  
  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      <h4>댓글 작성</h4>
      
      <div className="form-group">
        <input
          type="text"
          name="author"
          value={author}
          onChange={handleChange}
          placeholder="작성자 이름"
          disabled={isPending}
        />
        {errors.author && <span className="error-text">{errors.author}</span>}
      </div>
      
      <div className="form-group">
        <textarea
          name="content"
          value={content}
          onChange={handleChange}
          placeholder="댓글을 입력하세요..."
          rows={3}
          disabled={isPending}
        />
        {errors.content && <span className="error-text">{errors.content}</span>}
      </div>
      
      <div className="form-buttons">
        <button
          type="submit"
          className="submit-btn"
          disabled={isPending || !author.trim() || !content.trim()}
        >
          {isPending ? '등록 중...' : '댓글 등록'}
        </button>
      </div>
    </form>
  );
};

export default CommentForm;