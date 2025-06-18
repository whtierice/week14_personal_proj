import React from 'react';
import { useDeleteRoutine } from '../../hooks/useRoutines';

interface DeleteRoutineModalProps {
  routineId: string;
  routineName: string;
  onClose: () => void;
  onSuccess?: () => void;
}

const DeleteRoutineModal: React.FC<DeleteRoutineModalProps> = ({ 
  routineId, 
  routineName, 
  onClose, 
  onSuccess 
}) => {
  const deleteRoutineMutation = useDeleteRoutine();
  const isPending = deleteRoutineMutation.isPending;
  
  const handleDelete = () => {
    deleteRoutineMutation.mutate(routineId, {
      onSuccess: () => {
        if (onSuccess) onSuccess();
        onClose();
      }
    });
  };
  
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>루틴 삭제</h3>
        
        <p>
          <strong>{routineName}</strong> 루틴을 삭제하시겠습니까?
        </p>
        <p className="warning-text">
          이 작업은 되돌릴 수 없으며, 모든 운동 기록이 함께 삭제됩니다.
        </p>
        
        <div className="modal-buttons">
          <button 
            className="delete-btn"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? '삭제 중...' : '삭제'}
          </button>
          <button 
            className="cancel-btn"
            onClick={onClose}
            disabled={isPending}
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteRoutineModal;