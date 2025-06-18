import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRoutine, useUpdateRoutine } from '../hooks/useRoutines';
import RoutineForm from '../components/Routine/RoutineForm';
import DeleteRoutineModal from '../components/Routine/DeleteRoutineModal';

const RoutineDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // React Query 훅 사용
  const { 
    data: routine, 
    isLoading, 
    error,
    refetch 
  } = useRoutine(id || '');
  
  // 상태 관리
  const [isWorkoutStarted, setIsWorkoutStarted] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set());
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // 타이머 관리
  React.useEffect(() => {
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
    if (!routine) return;
    
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
    // TODO: 실제로는 API 호출로 처리
    
    alert('운동이 기록되었습니다!');
    navigate('/records');
  };
  
  // 수정 모드 토글
  const handleEditClick = () => {
    setIsEditing(true);
  };
  
  // 수정 취소
  const handleEditCancel = () => {
    setIsEditing(false);
  };
  
  // 수정 성공
  const handleEditSuccess = () => {
    setIsEditing(false);
    refetch(); // 데이터 다시 불러오기
  };
  
  // 삭제 모달 표시
  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };
  
  // 삭제 성공
  const handleDeleteSuccess = () => {
    navigate('/');
  };

  // 로딩 상태 처리
  if (isLoading) {
    return (
      <div className="routine-detail-page">
        <div className="loading-state">
          <p>루틴 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 에러 상태 처리
  if (error || !routine) {
    return (
      <div className="routine-detail-page">
        <div className="error-state">
          <p>루틴 정보를 불러오는데 실패했습니다.</p>
          <button onClick={() => refetch()}>다시 시도</button>
          <button onClick={() => navigate('/')}>홈으로 돌아가기</button>
        </div>
      </div>
    );
  }
  
  // 수정 모드
  if (isEditing) {
    return (
      <RoutineForm 
        editRoutine={routine}
        onCancel={handleEditCancel}
        onSuccess={handleEditSuccess}
      />
    );
  }

  // 기본 상세 보기 모드
  if (!isWorkoutStarted) {
    return (
      <div className="routine-detail-page">
        <div className="routine-header">
          <button className="back-btn" onClick={() => navigate('/')}>
            ← 뒤로
          </button>
          <h2>{routine.name}</h2>
          <div className="routine-actions">
            <button 
              className="edit-btn"
              onClick={handleEditClick}
            >
              수정
            </button>
            <button 
              className="delete-btn"
              onClick={handleDeleteClick}
            >
              삭제
            </button>
          </div>
        </div>

        <div className="routine-info">
          {routine.lastCompleted && (
            <p className="last-completed">
              마지막 운동: {new Date(routine.lastCompleted).toLocaleDateString('ko-KR')}
            </p>
          )}
        </div>

        <div className="routine-exercises">
          <h3>운동 목록 ({routine.exercises.length}개)</h3>
          {routine.exercises.length > 0 ? (
            routine.exercises.map((exercise, index) => (
              <div key={exercise.id} className="exercise-preview">
                <span className="exercise-number">{index + 1}</span>
                <div className="exercise-info">
                  <h4>{exercise.name}</h4>
                  <p>{exercise.sets}세트 × {exercise.reps}회 {exercise.weight ? `@ ${exercise.weight}kg` : ''}</p>
                  {exercise.notes && <p className="exercise-notes">{exercise.notes}</p>}
                </div>
              </div>
            ))
          ) : (
            <div className="empty-exercises">
              <p>이 루틴에는 운동이 없습니다.</p>
              <p>수정 버튼을 눌러 운동을 추가해보세요.</p>
            </div>
          )}
        </div>

        {routine.exercises.length > 0 && (
          <button className="start-workout-btn" onClick={handleStartWorkout}>
            운동 시작
          </button>
        )}
        
        {/* 삭제 확인 모달 */}
        {showDeleteModal && (
          <DeleteRoutineModal 
            routineId={routine.id}
            routineName={routine.name}
            onClose={() => setShowDeleteModal(false)}
            onSuccess={handleDeleteSuccess}
          />
        )}
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
              <p>{exercise.sets}세트 × {exercise.reps}회 {exercise.weight ? `@ ${exercise.weight}kg` : ''}</p>
              {exercise.notes && <p className="exercise-notes">{exercise.notes}</p>}
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