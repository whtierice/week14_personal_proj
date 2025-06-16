import React, { useState } from 'react';
import { Exercise } from '../../types';

// Props 타입 정의
interface ExerciseFormProps {
  onAddExercise: (exercise: Exercise) => void;
}

const ExerciseForm: React.FC<ExerciseFormProps> = ({ onAddExercise }) => {
  // 폼 데이터를 관리할 state
  const [formData, setFormData] = useState({
    name: '',
    sets: '',
    reps: '',
    weight: ''
  });

  // 폼 제출 처리
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // 페이지 새로고침 방지
    
    // 새 운동 객체 생성
    const newExercise: Exercise = {
      id: Date.now().toString(), // 임시 ID (현재 시간)
      name: formData.name,
      sets: parseInt(formData.sets),
      reps: parseInt(formData.reps),
      weight: formData.weight ? parseInt(formData.weight) : undefined,
      date: new Date().toISOString().split('T')[0] // YYYY-MM-DD 형식
    };

    // 부모 컴포넌트로 데이터 전달
    onAddExercise(newExercise);
    
    // 폼 초기화
    setFormData({
      name: '',
      sets: '',
      reps: '',
      weight: ''
    });
  };

  // 입력값 변경 처리
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form className="exercise-form" onSubmit={handleSubmit}>
      <h3>운동 기록 추가</h3>
      
      <div className="form-group">
        <label>
          운동 이름:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="예: 벤치프레스"
            required
          />
        </label>
      </div>

      <div className="form-group">
        <label>
          세트 수:
          <input
            type="number"
            name="sets"
            value={formData.sets}
            onChange={handleChange}
            min="1"
            required
          />
        </label>
      </div>

      <div className="form-group">
        <label>
          반복 횟수:
          <input
            type="number"
            name="reps"
            value={formData.reps}
            onChange={handleChange}
            min="1"
            required
          />
        </label>
      </div>

      <div className="form-group">
        <label>
          무게 (kg):
          <input
            type="number"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            min="0"
            placeholder="선택사항"
          />
        </label>
      </div>

      <button type="submit" className="submit-btn">
        운동 추가
      </button>
    </form>
  );
};

export default ExerciseForm;