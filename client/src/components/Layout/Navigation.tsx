import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation: React.FC = () => {
  const location = useLocation();
  
  // 현재 경로 확인
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bottom-navigation">
      <Link 
        to="/" 
        className={`nav-item ${isActive('/') ? 'active' : ''}`}
      >
        <span className="nav-icon">🏠</span>
        <span className="nav-label">홈</span>
      </Link>
      
      <Link 
        to="/records" 
        className={`nav-item ${isActive('/records') ? 'active' : ''}`}
      >
        <span className="nav-icon">📊</span>
        <span className="nav-label">기록</span>
      </Link>
      
      <Link 
        to="/board" 
        className={`nav-item ${isActive('/board') ? 'active' : ''}`}
      >
        <span className="nav-icon">💬</span>
        <span className="nav-label">게시판</span>
      </Link>
    </nav>
  );
};

export default Navigation;