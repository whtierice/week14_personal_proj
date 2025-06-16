import React, { useState } from 'react';
import { Post } from '../../types';

interface PostFormProps {
  onAddPost: (post: Post) => void;
  onCancel: () => void;
}

const PostForm: React.FC<PostFormProps> = ({ onAddPost, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newPost: Post = {
      id: Date.now().toString(),
      title: formData.title,
      content: formData.content,
      author: formData.author,
      createdAt: new Date().toISOString(),
      comments: [] // 빈 댓글 배열로 시작
    };

    onAddPost(newPost);
    
    // 폼 초기화
    setFormData({
      title: '',
      content: '',
      author: ''
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
            />
          </label>
        </div>

        <div className="form-buttons">
          <button type="submit" className="submit-btn">
            작성 완료
          </button>
          <button type="button" className="cancel-btn" onClick={onCancel}>
            취소
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostForm;