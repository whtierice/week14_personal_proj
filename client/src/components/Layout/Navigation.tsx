import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navigation: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated, logout, user } = useAuth();
  
  // 현재 경로 확인
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // 로그아웃 처리
  const handleLogout = () => {
    logout();
  };

  return (
    <>
      {isAuthenticated && (
        <div className="user-bar">
          <span className="user-email">{user?.email}</span>
          <button onClick={handleLogout} className="logout-button">로그아웃</button>
        </div>
      )}
      
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
    </>
  );
};

export default Navigation;