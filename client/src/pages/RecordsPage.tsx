import React, { useState } from 'react';

interface WorkoutRecord {
  id: string;
  routineId: string;
  routineName: string;
  date: string;
  duration: number;
  completedExercises: string[];
  totalExercises: number;
}

const RecordsPage: React.FC = () => {
  // 임시 기록 데이터
  const [records] = useState<WorkoutRecord[]>([
    {
      id: '1',
      routineId: '1',
      routineName: '상체 집중 루틴',
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      duration: 3245, // 54분 5초
      completedExercises: ['1', '2', '3', '4'],
      totalExercises: 4
    },
    {
      id: '2',
      routineId: '2',
      routineName: '전신 스트레칭',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      duration: 1800, // 30분
      completedExercises: ['1', '2', '3'],
      totalExercises: 5
    },
    {
      id: '3',
      routineId: '3',
      routineName: '하체 운동',
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      duration: 4200, // 70분
      completedExercises: ['1', '2', '3', '4', '5'],
      totalExercises: 5
    }
  ]);

  // 날짜별로 그룹화
  const groupedRecords = records.reduce((groups, record) => {
    const date = new Date(record.date).toLocaleDateString('ko-KR');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(record);
    return groups;
  }, {} as Record<string, WorkoutRecord[]>);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}분 ${secs}초`;
  };

  const getCompletionRate = (completed: number, total: number) => {
    return Math.round((completed / total) * 100);
  };

  return (
    <div className="records-page">
      <h2>운동 기록</h2>
      
      {Object.keys(groupedRecords).length === 0 ? (
        <div className="empty-state">
          <p>아직 운동 기록이 없습니다</p>
          <p>루틴을 시작해보세요!</p>
        </div>
      ) : (
        <div className="records-list">
          {Object.entries(groupedRecords).map(([date, dayRecords]) => (
            <div key={date} className="record-group">
              <h3 className="record-date">{date}</h3>
              {dayRecords.map(record => (
                <div key={record.id} className="record-item">
                  <div className="record-header">
                    <h4>{record.routineName}</h4>
                    <span className="record-duration">{formatDuration(record.duration)}</span>
                  </div>
                  <div className="record-progress">
                    <div className="progress-bar-small">
                      <div 
                        className="progress-fill-small" 
                        style={{ 
                          width: `${getCompletionRate(record.completedExercises.length, record.totalExercises)}%` 
                        }}
                      />
                    </div>
                    <span className="completion-text">
                      {record.completedExercises.length}/{record.totalExercises} 완료 
                      ({getCompletionRate(record.completedExercises.length, record.totalExercises)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecordsPage;