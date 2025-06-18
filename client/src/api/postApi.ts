import apiClient from './client';
import { Post, Comment } from '../types';
import { ApiResponse, CreatePostDto, UpdatePostDto, CreateCommentDto, PaginatedResponse } from './types';

// 게시판 관련 API 함수
export const postApi = {
  // 모든 게시글 가져오기 (페이지네이션)
  getAll: async (page: number = 1, limit: number = 10): Promise<PaginatedResponse<Post>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Post>>>(`/posts?page=${page}&limit=${limit}`);
    return response.data.data;
  },
  
  // 특정 게시글 가져오기
  getById: async (id: string): Promise<Post> => {
    const response = await apiClient.get<ApiResponse<Post>>(`/posts/${id}`);
    return response.data.data;
  },
  
  // 새 게시글 생성하기
  create: async (data: CreatePostDto): Promise<Post> => {
    const response = await apiClient.post<ApiResponse<Post>>('/posts', data);
    return response.data.data;
  },
  
  // 게시글 업데이트하기
  update: async (id: string, data: UpdatePostDto): Promise<Post> => {
    const response = await apiClient.put<ApiResponse<Post>>(`/posts/${id}`, data);
    return response.data.data;
  },
  
  // 게시글 삭제하기
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/posts/${id}`);
  },
  
  // 게시글의 모든 댓글 가져오기
  getComments: async (postId: string): Promise<Comment[]> => {
    const response = await apiClient.get<ApiResponse<Comment[]>>(`/posts/${postId}/comments`);
    return response.data.data;
  },
  
  // 댓글 작성하기
  createComment: async (data: CreateCommentDto): Promise<Comment> => {
    const response = await apiClient.post<ApiResponse<Comment>>(`/posts/${data.postId}/comments`, data);
    return response.data.data;
  },
  
  // 댓글 삭제하기
  deleteComment: async (commentId: string): Promise<void> => {
    await apiClient.delete(`/comments/${commentId}`);
  }
};