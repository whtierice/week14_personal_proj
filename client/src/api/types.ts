import { Routine, Exercise, Post, Comment } from '../types';

// API 응답 기본 형태
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

// 페이지네이션 응답 형태
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// 인증 관련 타입
export interface MagicLinkRequestDto {
  email: string;
  rememberMe?: boolean;
}

export interface AuthResponse {
  token: string;
  expiresAt: string;
  user: {
    id: string;
    email: string;
    name?: string;
  };
}

// 루틴 관련 DTO
export interface CreateRoutineDto {
  name: string;
  exercises: CreateExerciseDto[];
}

export interface UpdateRoutineDto {
  name?: string;
  exercises?: CreateExerciseDto[];
}

// 운동 관련 DTO
export interface CreateExerciseDto {
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  notes?: string;
}

export interface UpdateExerciseDto {
  name?: string;
  sets?: number;
  reps?: number;
  weight?: number;
  notes?: string;
}

// 게시판 관련 DTO
export interface CreatePostDto {
  title: string;
  content: string;
  author: string;
  imageUrl?: string;
}

export interface UpdatePostDto {
  title?: string;
  content?: string;
  imageUrl?: string;
}

// 댓글 관련 DTO
export interface CreateCommentDto {
  postId: string;
  author: string;
  content: string;
}

export interface UpdateCommentDto {
  content: string;
}