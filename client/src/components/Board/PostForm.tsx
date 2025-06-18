import React, { useState } from 'react';
import { useCreatePost } from '../../hooks/usePosts';
import { CreatePostDto } from '../../api/types';

interface PostFormProps {
  onCancel: () => void;
  onSuccess?: () => void;
}

const PostForm: React.FC<PostFormProps> = ({ onCancel, onSuccess }) => {
  const [formData, setFormData] = useState<CreatePostDto>({
    title: '',
    content: '',
    author: '',
    imageUrl: ''
  });

  // React Query mutation 훅 사용
  const createPostMutation = useCreatePost();
  const isPending = createPostMutation.isPending;
  const error = createPostMutation.error;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // API 호출을 통한 게시글 생성
    createPostMutation.mutate(formData, {
      onSuccess: () => {
        // 폼 초기화
        setFormData({
          title: '',
          content: '',
          author: '',
          imageUrl: ''
        });
        
        // 성공 콜백 호출
        if (onSuccess) {
          onSuccess();
        } else {
          onCancel(); // 기본적으로 취소 함수 호출
        }
      }
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="post-form-container">
      <form className="post-form" onSubmit={handleSubmit}>
        <h3>새 글 작성</h3>
        
        {error && (
          <div className="error-message">
            게시글 작성 중 오류가 발생했습니다. 다시 시도해주세요.
          </div>
        )}
        
        <div className="form-group">
          <label>
            작성자:
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              placeholder="이름을 입력하세요"
              required
              disabled={isPending}
            />
          </label>
        </div>

        <div className="form-group">
          <label>
            제목:
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="제목을 입력하세요"
              required
              disabled={isPending}
            />
          </label>
        </div>

        <div className="form-group">
          <label>
            내용:
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="내용을 입력하세요"
              rows={6}
              required
              disabled={isPending}
            />
          </label>
        </div>

        <div className="form-group">
          <label>
            이미지 URL (선택사항):
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl || ''}
              onChange={handleChange}
              placeholder="이미지 URL을 입력하세요"
              disabled={isPending}
            />
          </label>
        </div>

        <div className="form-buttons">
          <button 
            type="submit" 
            className="submit-btn"
            disabled={isPending}
          >
            {isPending ? '작성 중...' : '작성 완료'}
          </button>
          <button 
            type="button" 
            className="cancel-btn" 
            onClick={onCancel}
            disabled={isPending}
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostForm;