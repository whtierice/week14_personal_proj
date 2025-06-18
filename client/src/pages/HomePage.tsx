import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Routine } from '../types';
import RoutineList from '../components/Routine/RoutineList';
import { useRoutines } from '../hooks/useRoutines';
import RoutineForm from '../components/Routine/RoutineForm';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  
  // React Query 훅 사용
  const { 
    data: routines, 
    isLoading, 
    error,
    refetch 
  } = useRoutines();

  const handleSelectRoutine = (routine: Routine) => {
    // 루틴 상세 페이지로 이동
    navigate(`/routine/${routine.id}`);
  };

  // 폼 취소
  const handleFormCancel = () => {
    setShowForm(false);
  };
  
  // 폼 성공
  const handleFormSuccess = () => {
    setShowForm(false);
    refetch(); // 데이터 다시 불러오기
  };

  // 로딩 상태 처리
  if (isLoading) {
    return (
      <div className="home-page">
        <div className="loading-state">
          <p>루틴 목록을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 에러 상태 처리
  if (error) {
    return (
      <div className="home-page">
        <div className="error-state">
          <p>루틴 목록을 불러오는데 실패했습니다.</p>
          <button onClick={() => refetch()}>다시 시도</button>
        </div>
      </div>
    );
  }
  
  // 루틴 생성 폼 표시
  if (showForm) {
    return (
      <RoutineForm 
        onCancel={handleFormCancel}
        onSuccess={handleFormSuccess}
      />
    );
  }

  return (
    <div className="home-page">
      <div className="home-header">
        <h2>내 루틴</h2>
        <button 
          className="add-routine-btn"
          onClick={() => setShowForm(true)}
        >
          + 새 루틴
        </button>
      </div>
      
      {routines && routines.length > 0 ? (
        <RoutineList 
          routines={routines}
          onSelectRoutine={handleSelectRoutine}
        />
      ) : (
        <div className="empty-routine">
          <p>아직 생성된 루틴이 없습니다</p>
          <p>첫 루틴을 만들어보세요!</p>
        </div>
      )}
    </div>
  );
};

export default HomePage;