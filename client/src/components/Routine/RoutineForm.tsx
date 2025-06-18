import React, { useState, useEffect } from 'react';
import { Routine, Exercise } from '../../types';
import { CreateRoutineDto, CreateExerciseDto } from '../../api/types';
import { useCreateRoutine, useUpdateRoutine } from '../../hooks/useRoutines';

interface RoutineFormProps {
  onCancel: () => void;
  onSuccess?: () => void;
  editRoutine?: Routine; // 수정 모드일 경우 전달
}

const RoutineForm: React.FC<RoutineFormProps> = ({ onCancel, onSuccess, editRoutine }) => {
  // 폼 단계 (0: 루틴 이름, 1: 운동 추가)
  const [step, setStep] = useState(0);
  
  // 루틴 정보
  const [routineName, setRoutineName] = useState('');
  const [exercises, setExercises] = useState<CreateExerciseDto[]>([]);
  
  // 현재 편집 중인 운동
  const [currentExercise, setCurrentExercise] = useState<CreateExerciseDto>({
    name: '',
    sets: 3,
    reps: 10,
    weight: 0,
    notes: ''
  });
  
  // 수정 모드인지 확인
  const isEditMode = !!editRoutine;
  
  // React Query 훅
  const createRoutineMutation = useCreateRoutine();
  const updateRoutineMutation = useUpdateRoutine(editRoutine?.id || '');
  
  // 로딩 상태
  const isLoading = createRoutineMutation.isPending || updateRoutineMutation.isPending;
  
  // 수정 모드일 경우 초기값 설정
  useEffect(() => {
    if (editRoutine) {
      setRoutineName(editRoutine.name);
      
      // 기존 운동 정보를 CreateExerciseDto 형태로 변환
      const exerciseDtos = editRoutine.exercises.map(exercise => ({
        name: exercise.name,
        sets: exercise.sets,
        reps: exercise.reps,
        weight: exercise.weight || 0,
        notes: exercise.notes || ''
      }));
      
      setExercises(exerciseDtos);
    }
  }, [editRoutine]);
  
  // 다음 단계로 이동
  const handleNextStep = () => {
    if (step === 0 && !routineName.trim()) {
      alert('루틴 이름을 입력해주세요.');
      return;
    }
    
    setStep(step + 1);
  };
  
  // 이전 단계로 이동
  const handlePrevStep = () => {
    setStep(step - 1);
  };
  
  // 운동 추가
  const handleAddExercise = () => {
    // 유효성 검사
    if (!currentExercise.name.trim()) {
      alert('운동 이름을 입력해주세요.');
      return;
    }
    
    if (currentExercise.sets <= 0) {
      alert('세트 수는 1 이상이어야 합니다.');
      return;
    }
    
    if (currentExercise.reps <= 0) {
      alert('반복 횟수는 1 이상이어야 합니다.');
      return;
    }
    
    // 운동 추가
    setExercises([...exercises, { ...currentExercise }]);
    
    // 입력 폼 초기화
    setCurrentExercise({
      name: '',
      sets: 3,
      reps: 10,
      weight: 0,
      notes: ''
    });
  };
  
  // 운동 제거
  const handleRemoveExercise = (index: number) => {
    const updatedExercises = [...exercises];
    updatedExercises.splice(index, 1);
    setExercises(updatedExercises);
  };
  
  // 운동 정보 변경
  const handleExerciseChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setCurrentExercise(prev => ({
      ...prev,
      [name]: name === 'name' || name === 'notes' ? value : Number(value)
    }));
  };
  
  // 폼 제출
  const handleSubmit = () => {
    if (exercises.length === 0) {
      alert('최소 1개 이상의 운동을 추가해주세요.');
      return;
    }
    
    const routineData: CreateRoutineDto = {
      name: routineName,
      exercises: exercises
    };
    
    if (isEditMode) {
      // 루틴 수정
      updateRoutineMutation.mutate(routineData, {
        onSuccess: () => {
          if (onSuccess) onSuccess();
          else onCancel();
        }
      });
    } else {
      // 루틴 생성
      createRoutineMutation.mutate(routineData, {
        onSuccess: () => {
          if (onSuccess) onSuccess();
          else onCancel();
        }
      });
    }
  };
  
  return (
    <div className="routine-form-container">
      {step === 0 ? (
        // 1단계: 루틴 이름 입력
        <div className="routine-name-step">
          <h3>{isEditMode ? '루틴 수정' : '새 루틴 만들기'}</h3>
          
          <div className="form-group">
            <label htmlFor="routineName">루틴 이름</label>
            <input
              type="text"
              id="routineName"
              value={routineName}
              onChange={(e) => setRoutineName(e.target.value)}
              placeholder="예: 상체 운동, 아침 스트레칭"
              disabled={isLoading}
              autoFocus
            />
          </div>
          
          <div className="form-buttons">
            <button 
              type="button" 
              className="next-btn"
              onClick={handleNextStep}
              disabled={isLoading}
            >
              다음
            </button>
            <button 
              type="button" 
              className="cancel-btn"
              onClick={onCancel}
              disabled={isLoading}
            >
              취소
            </button>
          </div>
        </div>
      ) : (
        // 2단계: 운동 추가
        <div className="exercises-step">
          <h3>운동 추가</h3>
          
          {/* 운동 목록 */}
          {exercises.length > 0 ? (
            <div className="exercises-list">
              <h4>추가된 운동 ({exercises.length})</h4>
              {exercises.map((exercise, index) => (
                <div key={index} className="exercise-item">
                  <div className="exercise-info">
                    <h5>{exercise.name}</h5>
                    <p>{exercise.sets}세트 × {exercise.reps}회 {exercise.weight && exercise.weight > 0 ? `/ ${exercise.weight}kg` : ''}</p>
                    {exercise.notes && <p className="exercise-notes">{exercise.notes}</p>}
                  </div>
                  <button 
                    type="button" 
                    className="remove-btn"
                    onClick={() => handleRemoveExercise(index)}
                    disabled={isLoading}
                  >
                    삭제
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-exercises">
              <p>아직 추가된 운동이 없습니다.</p>
              <p>아래 폼을 통해 운동을 추가해주세요.</p>
            </div>
          )}
          
          {/* 운동 추가 폼 */}
          <div className="add-exercise-form">
            <h4>새 운동 추가</h4>
            
            <div className="form-group">
              <label htmlFor="exerciseName">운동 이름</label>
              <input
                type="text"
                id="exerciseName"
                name="name"
                value={currentExercise.name}
                onChange={handleExerciseChange}
                placeholder="예: 벤치프레스, 스쿼트"
                disabled={isLoading}
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="exerciseSets">세트</label>
                <input
                  type="number"
                  id="exerciseSets"
                  name="sets"
                  value={currentExercise.sets}
                  onChange={handleExerciseChange}
                  min="1"
                  disabled={isLoading}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="exerciseReps">횟수</label>
                <input
                  type="number"
                  id="exerciseReps"
                  name="reps"
                  value={currentExercise.reps}
                  onChange={handleExerciseChange}
                  min="1"
                  disabled={isLoading}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="exerciseWeight">무게 (kg)</label>
                <input
                  type="number"
                  id="exerciseWeight"
                  name="weight"
                  value={currentExercise.weight}
                  onChange={handleExerciseChange}
                  min="0"
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="exerciseNotes">메모 (선택사항)</label>
              <textarea
                id="exerciseNotes"
                name="notes"
                value={currentExercise.notes}
                onChange={handleExerciseChange}
                placeholder="운동에 대한 메모를 남겨보세요"
                disabled={isLoading}
              />
            </div>
            
            <button 
              type="button" 
              className="add-btn"
              onClick={handleAddExercise}
              disabled={isLoading}
            >
              운동 추가
            </button>
          </div>
          
          <div className="form-buttons">
            <button 
              type="button" 
              className="submit-btn"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? '처리 중...' : isEditMode ? '수정 완료' : '루틴 생성'}
            </button>
            <button 
              type="button" 
              className="back-btn"
              onClick={handlePrevStep}
              disabled={isLoading}
            >
              이전
            </button>
            <button 
              type="button" 
              className="cancel-btn"
              onClick={onCancel}
              disabled={isLoading}
            >
              취소
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoutineForm;