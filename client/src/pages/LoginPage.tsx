import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { authApi } from '../api';
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { login, isAuthenticated } = useAuth();
  
  // 이미 로그인되어 있으면 홈으로 리다이렉트
  useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as any)?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);
  
  // URL에서 토큰 확인
  useEffect(() => {
    const token = searchParams.get('token');
    
    if (token) {
      const verifyToken = async () => {
        try {
          setIsSubmitting(true);
          const authData = await authApi.verifyMagicLink(token);
          
          // 로그인 처리
          login(
            authData.token,
            authData.expiresAt,
            authData.user,
            // URL에서는 rememberMe 정보를 알 수 없으므로 기본값 사용
            false
          );
          
          // 홈으로 리다이렉트
          navigate('/', { replace: true });
        } catch (err) {
          setError('유효하지 않거나 만료된 링크입니다. 다시 로그인해주세요.');
        } finally {
          setIsSubmitting(false);
        }
      };
      
      verifyToken();
    }
  }, [searchParams, login, navigate]);
  
  // 매직 링크 요청 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('이메일을 입력해주세요.');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      await authApi.requestMagicLink({
        email: email.trim(),
        rememberMe
      });
      
      setEmailSent(true);
    } catch (err) {
      setError('링크 전송에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // 이메일 전송 확인 화면
  if (emailSent) {
    return (
      <div className="login-page">
        <div className="email-sent-container">
          <h2>이메일을 확인해주세요</h2>
          <p><strong>{email}</strong>로 로그인 링크를 전송했습니다.</p>
          <p>이메일에 포함된 링크를 클릭하여 로그인을 완료해주세요.</p>
          <p>이메일을 받지 못하셨나요?</p>
          <button 
            onClick={() => setEmailSent(false)}
            className="resend-button"
          >
            다시 시도하기
          </button>
        </div>
      </div>
    );
  }
  
  // 로그인 폼
  return (
    <div className="login-page">
      <div className="login-container">
        <h2>로그인</h2>
        <p>이메일을 입력하시면 로그인 링크를 보내드립니다.</p>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">이메일</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              disabled={isSubmitting}
              required
            />
          </div>
          
          <div className="form-group checkbox">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={isSubmitting}
            />
            <label htmlFor="rememberMe">로그인 상태 유지</label>
          </div>
          
          <button 
            type="submit" 
            className="login-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? '처리 중...' : '로그인 링크 받기'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;