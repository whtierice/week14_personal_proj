import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Routine } from '../types';
import RoutineList from '../components/Routine/RoutineList';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  
  // 샘플 루틴 데이터 (나중에 실제 데이터로 교체)
  const [routines, setRoutines] = useState<Routine[]>([
    {
      id: '1',
      name: '상체 집중 루틴',
      exercises: [],
      lastCompleted: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2시간 전
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      name: '전신 스트레칭',
      exercises: [],
      lastCompleted: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(), // 25시간 전
      createdAt: new Date().toISOString()
    },
    {
      id: '3',
      name: '하체 운동',
      exercises: [],
      lastCompleted: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3일 전
      createdAt: new Date().toISOString()
    },
    {
      id: '4',
      name: '아침 루틴',
      exercises: [],
      createdAt: new Date().toISOString()
      // lastCompleted 없음 - 아직 시작하지 않음
    }
  ]);

  const handleSelectRoutine = (routine: Routine) => {
    // 루틴 상세 페이지로 이동
    navigate(`/routine/${routine.id}`);
  };

  return (
    <div className="home-page">
      <div className="home-header">
        <h2>내 루틴</h2>
        <button className="add-routine-btn">
          + 새 루틴
        </button>
      </div>
      
      <RoutineList 
        routines={routines}
        onSelectRoutine={handleSelectRoutine}
      />
    </div>
  );
};

export default HomePage;