import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Routine } from '../types';
import RoutineList from '../components/Routine/RoutineList';
import { useRoutines, useCreateRoutine } from '../hooks/useRoutines';
import { CreateRoutineDto } from '../api/types';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [newRoutineName, setNewRoutineName] = useState('');
  
  // React Query 훅 사용
  const { data: routines, isLoading, error } = useRoutines();
  const createRoutineMutation = useCreateRoutine();

  const handleSelectRoutine = (routine: Routine) => {
    // 루틴 상세 페이지로 이동
    navigate(`/routine/${routine.id}`);
  };

  const handleCreateRoutine = () => {
    if (!newRoutineName.trim()) return;
    
    const newRoutine: CreateRoutineDto = {
      name: newRoutineName,
      exercises: []
    };
    
    createRoutineMutation.mutate(newRoutine, {
      onSuccess: () => {
        setNewRoutineName('');
        setShowForm(false);
      }
    });
  };
  
  // mutation 상태 확인
  const isPending = createRoutineMutation.isPending;

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
          <button onClick={() => window.location.reload()}>다시 시도</button>
        </div>
      </div>
    );
  }

  return (
    <div className="home-page">
      <div className="home-header">
        <h2>내 루틴</h2>
        {!showForm ? (
          <button 
            className="add-routine-btn"
            onClick={() => setShowForm(true)}
          >
            + 새 루틴
          </button>
        ) : (
          <div className="routine-form">
            <input
              type="text"
              value={newRoutineName}
              onChange={(e) => setNewRoutineName(e.target.value)}
              placeholder="루틴 이름"
              autoFocus
            />
            <div className="form-buttons">
              <button 
                onClick={handleCreateRoutine}
                disabled={isPending}
              >
                {isPending ? '생성 중...' : '생성'}
              </button>
              <button onClick={() => setShowForm(false)}>취소</button>
            </div>
          </div>
        )}
      </div>
      
      <RoutineList 
        routines={routines || []}
        onSelectRoutine={handleSelectRoutine}
      />
    </div>
  );
};

export default HomePage;