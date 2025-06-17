import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Routine, Exercise } from '../types';

const RoutineDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // 임시 루틴 데이터 (실제로는 props나 context로 받아야 함)
  const [routine] = useState<Routine>({
    id: id || '1',
    name: '상체 집중 루틴',
    exercises: [
      { id: '1', name: '벤치프레스', sets: 4, reps: 10, weight: 60, date: '', routineId: id },
      { id: '2', name: '덤벨 플라이', sets: 3, reps: 12, weight: 15, date: '', routineId: id },
      { id: '3', name: '숄더프레스', sets: 4, reps: 10, weight: 40, date: '', routineId: id },
      { id: '4', name: '사이드 레터럴 레이즈', sets: 3, reps: 15, weight: 10, date: '', routineId: id },
    ],
    createdAt: new Date().toISOString()
  });

  const [isWorkoutStarted, setIsWorkoutStarted] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set());
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);

  // 타이머
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isWorkoutStarted && startTime) {
      interval = setInterval(() => {
        const now = new Date();
        const diff = Math.floor((now.getTime() - startTime.getTime()) / 1000);
        setElapsedTime(diff);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isWorkoutStarted, startTime]);

  // 시간 포맷
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 운동 시작
  const handleStartWorkout = () => {
    setIsWorkoutStarted(true);
    setStartTime(new Date());
  };

  // 운동 완료 토글
  const toggleExerciseComplete = (exerciseId: string) => {
    const newCompleted = new Set(completedExercises);
    if (newCompleted.has(exerciseId)) {
      newCompleted.delete(exerciseId);
    } else {
      newCompleted.add(exerciseId);
    }
    setCompletedExercises(newCompleted);
  };

  // 운동 종료 및 저장
  const handleFinishWorkout = () => {
    // TODO: 여기서 운동 기록을 저장
    const workoutRecord = {
      routineId: routine.id,
      routineName: routine.name,
      date: new Date().toISOString(),
      duration: elapsedTime,
      completedExercises: Array.from(completedExercises),
      totalExercises: routine.exercises.length
    };
    
    console.log('운동 기록 저장:', workoutRecord);
    
    // 루틴의 lastCompleted 업데이트
    // TODO: 실제로는 context나 state management로 처리
    
    alert('운동이 기록되었습니다!');
    navigate('/records');
  };

  if (!isWorkoutStarted) {
    return (
      <div className="routine-detail-page">
        <div className="routine-header">
          <button className="back-btn" onClick={() => navigate('/')}>
            ← 뒤로
          </button>
          <h2>{routine.name}</h2>
        </div>

        <div className="routine-exercises">
          <h3>운동 목록 ({routine.exercises.length}개)</h3>
          {routine.exercises.map((exercise, index) => (
            <div key={exercise.id} className="exercise-preview">
              <span className="exercise-number">{index + 1}</span>
              <div className="exercise-info">
                <h4>{exercise.name}</h4>
                <p>{exercise.sets}세트 × {exercise.reps}회 {exercise.weight && `@ ${exercise.weight}kg`}</p>
              </div>
            </div>
          ))}
        </div>

        <button className="start-workout-btn" onClick={handleStartWorkout}>
          운동 시작
        </button>
      </div>
    );
  }

  // 운동 진행 중 화면
  return (
    <div className="workout-in-progress">
      <div className="workout-header">
        <h2>{routine.name}</h2>
        <div className="workout-timer">{formatTime(elapsedTime)}</div>
      </div>

      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${(completedExercises.size / routine.exercises.length) * 100}%` }}
        />
      </div>
      <p className="progress-text">
        {completedExercises.size} / {routine.exercises.length} 완료
      </p>

      <div className="exercise-list-workout">
        {routine.exercises.map((exercise, index) => (
          <div 
            key={exercise.id} 
            className={`exercise-item-workout ${completedExercises.has(exercise.id) ? 'completed' : ''}`}
            onClick={() => toggleExerciseComplete(exercise.id)}
          >
            <div className="exercise-check">
              {completedExercises.has(exercise.id) ? '✓' : '○'}
            </div>
            <div className="exercise-content">
              <h4>{exercise.name}</h4>
              <p>{exercise.sets}세트 × {exercise.reps}회 {exercise.weight && `@ ${exercise.weight}kg`}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="workout-actions">
        <button 
          className="finish-workout-btn" 
          onClick={handleFinishWorkout}
          disabled={completedExercises.size === 0}
        >
          운동 종료
        </button>
        <button 
          className="cancel-workout-btn" 
          onClick={() => {
            if (window.confirm('운동을 취소하시겠습니까? 기록이 저장되지 않습니다.')) {
              navigate('/');
            }
          }}
        >
          취소
        </button>
      </div>
    </div>
  );
};

export default RoutineDetailPage;