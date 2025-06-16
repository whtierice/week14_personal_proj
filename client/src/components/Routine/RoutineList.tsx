import React from 'react';
import { Routine } from '../../types';

interface RoutineListProps {
  routines: Routine[];
  onSelectRoutine: (routine: Routine) => void;
}

const RoutineList: React.FC<RoutineListProps> = ({ routines, onSelectRoutine }) => {
  // 마지막 완료 시간 기준으로 정렬 (최근 순)
  const sortedRoutines = [...routines].sort((a, b) => {
    if (!a.lastCompleted && !b.lastCompleted) return 0;
    if (!a.lastCompleted) return 1;
    if (!b.lastCompleted) return -1;
    return new Date(b.lastCompleted).getTime() - new Date(a.lastCompleted).getTime();
  });

  // 시간 포맷 함수
  const formatLastCompleted = (dateString?: string) => {
    if (!dateString) return '아직 시작하지 않음';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      return `${diffInMinutes}분 전`;
    } else if (diffInHours < 24) {
      return `${diffInHours}시간 전`;
    } else if (diffInDays < 7) {
      return `${diffInDays}일 전`;
    } else {
      return date.toLocaleDateString('ko-KR', {
        month: 'long',
        day: 'numeric'
      });
    }
  };

  if (routines.length === 0) {
    return (
      <div className="empty-routine">
        <p>아직 생성된 루틴이 없습니다</p>
        <p>첫 루틴을 만들어보세요!</p>
      </div>
    );
  }

  return (
    <div className="routine-list">
      {sortedRoutines.map(routine => (
        <div 
          key={routine.id} 
          className="routine-item"
          onClick={() => onSelectRoutine(routine)}
        >
          <div className="routine-content">
            <h3 className="routine-name">{routine.name}</h3>
            <p className="routine-last-completed">
              {formatLastCompleted(routine.lastCompleted)}
            </p>
          </div>
          <div className="routine-arrow">
            →
          </div>
        </div>
      ))}
    </div>
  );
};

export default RoutineList;