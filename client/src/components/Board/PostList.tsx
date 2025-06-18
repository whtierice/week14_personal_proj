import React from 'react';
import { Post } from '../../types';

interface PostListProps {
  posts: Post[];
  onSelectPost: (post: Post) => void;
}

const PostList: React.FC<PostListProps> = ({ posts, onSelectPost }) => {
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

  if (posts.length === 0) {
    return (
      <div className="empty-state">
        <p>아직 작성된 글이 없습니다.</p>
        <p>첫 번째 글을 작성해보세요! ✍️</p>
      </div>
    );
  }

  return (
    <div className="post-list">
      <h3>게시글 목록 ({posts.length}개)</h3>
      
      <div className="posts-grid">
        {posts.map(post => (
          <div 
            key={post.id} 
            className="post-card"
            onClick={() => onSelectPost(post)}
          >
            {post.imageUrl ? (
              <div className="post-image">
                <img src={post.imageUrl} alt={post.title} />
              </div>
            ) : (
              <div className="post-no-image">
                <span className="post-title-preview">{post.title}</span>
              </div>
            )}
            
            <div className="post-info">
              <h4>{post.title}</h4>
              <span className="post-meta">
                {post.author} · {formatDate(post.createdAt)}
              </span>
              <span className="comment-count">
                💬 {post.comments.length}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostList;