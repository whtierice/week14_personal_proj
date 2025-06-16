import React, { useState } from 'react';
import { Exercise } from '../types';
import ExerciseForm from '../components/Exercise/ExerciseForm';
import ExerciseList from '../components/Exercise/ExerciseList';

const ExercisePage: React.FC = () => {
  // 운동 목록을 저장할 state
  const [exercises, setExercises] = useState<Exercise[]>([]);

  // 새 운동 추가 함수
  const handleAddExercise = (newExercise: Exercise) => {
    setExercises(prevExercises => [...prevExercises, newExercise]);
  };

  // 운동 삭제 함수
  const handleDeleteExercise = (id: string) => {
    setExercises(prevExercises => 
      prevExercises.filter(exercise => exercise.id !== id)
    );
  };

  return (
    <div className="exercise-page">
      <h2>운동 기록</h2>
      <p>오늘의 운동을 기록해보세요!</p>
      
      <ExerciseForm onAddExercise={handleAddExercise} />
      
      <ExerciseList 
        exercises={exercises} 
        onDeleteExercise={handleDeleteExercise}
      />
    </div>
  );
};

export default ExercisePage;