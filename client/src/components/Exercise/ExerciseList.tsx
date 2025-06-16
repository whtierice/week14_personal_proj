import React from 'react';
import { Exercise } from '../../types';

interface ExerciseListProps {
  exercises: Exercise[];
  onDeleteExercise: (id: string) => void;
}

const ExerciseList: React.FC<ExerciseListProps> = ({ exercises, onDeleteExercise }) => {
  // 운동이 없을 때
  if (exercises.length === 0) {
    return (
      <div className="empty-state">
        <p>아직 기록된 운동이 없습니다.</p>
        <p>첫 운동을 기록해보세요! 💪</p>
      </div>
    );
  }

  // 날짜별로 운동 그룹화
  const groupedExercises = exercises.reduce((groups, exercise) => {
    const date = exercise.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(exercise);
    return groups;
  }, {} as Record<string, Exercise[]>);

  // 날짜 내림차순 정렬 (최신순)
  const sortedDates = Object.keys(groupedExercises).sort((a, b) => b.localeCompare(a));

  return (
    <div className="exercise-list">
      <h3>운동 기록 목록</h3>
      
      {sortedDates.map(date => (
        <div key={date} className="date-group">
          <h4 className="date-header">
            {new Date(date).toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              weekday: 'long'
            })}
          </h4>
          
          <div className="exercises-grid">
            {groupedExercises[date].map(exercise => (
              <div key={exercise.id} className="exercise-card">
                <div className="exercise-header">
                  <h5>{exercise.name}</h5>
                  <button 
                    className="delete-btn"
                    onClick={() => onDeleteExercise(exercise.id)}
                    title="삭제"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="exercise-details">
                  <span className="detail-item">
                    <strong>세트:</strong> {exercise.sets}
                  </span>
                  <span className="detail-item">
                    <strong>횟수:</strong> {exercise.reps}
                  </span>
                  {exercise.weight && (
                    <span className="detail-item">
                      <strong>무게:</strong> {exercise.weight}kg
                    </span>
                  )}
                </div>
                
                {exercise.notes && (
                  <p className="exercise-notes">{exercise.notes}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExerciseList;