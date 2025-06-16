// 루틴 관련 타입
export interface Routine {
    id: string;              // 루틴 고유 ID
    name: string;            // 루틴 이름 (예: "상체 운동", "아침 스트레칭")
    exercises: Exercise[];   // 루틴에 포함된 운동들
    lastCompleted?: string;  // 마지막 완료 시간
    createdAt: string;       // 생성 시간
  }
  
  // 운동 관련 타입
  export interface Exercise {
    id: string;              // 고유 ID
    name: string;            // 운동 이름 (예: "벤치프레스")
    sets: number;            // 세트 수
    reps: number;            // 반복 횟수
    weight?: number;         // 무게 (선택사항 - ? 는 있어도 되고 없어도 됨)
    date: string;            // 운동한 날짜
    notes?: string;          // 메모 (선택사항)
    routineId?: string;      // 어느 루틴에 속하는지
  }
  
  // 게시판 관련 타입
  export interface Post {
    id: string;              // 게시글 고유 ID
    title: string;           // 제목
    content: string;         // 내용
    author: string;          // 작성자
    createdAt: string;       // 작성 시간
    updatedAt?: string;      // 수정 시간 (선택사항)
    comments: Comment[];     // 댓글 배열
  }
  
  // 댓글 타입
  export interface Comment {
    id: string;              // 댓글 고유 ID
    postId: string;          // 어느 게시글의 댓글인지
    author: string;          // 댓글 작성자
    content: string;         // 댓글 내용
    createdAt: string;       // 작성 시간
  }