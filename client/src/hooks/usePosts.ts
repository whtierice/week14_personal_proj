import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { postApi } from '../api';
import { Post, Comment } from '../types';
import { CreatePostDto, UpdatePostDto, CreateCommentDto, PaginatedResponse } from '../api/types';

// 게시글 목록 조회 훅
export const usePosts = (page: number = 1, limit: number = 12) => {
  return useQuery<PaginatedResponse<Post>, Error>({
    queryKey: ['posts', page, limit],
    queryFn: () => postApi.getAll(page, limit),
    placeholderData: (previousData) => previousData, // 페이지 전환 시 이전 데이터 유지
  });
};

// 무한 스크롤용 게시글 목록 조회 훅
export const useInfinitePosts = (limit: number = 12) => {
  return useInfiniteQuery<PaginatedResponse<Post>, Error>({
    queryKey: ['posts', 'infinite'],
    queryFn: ({ pageParam }) => postApi.getAll(pageParam as number, limit),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
  });
};

// 특정 게시글 조회 훅
export const usePost = (id: string) => {
  return useQuery<Post, Error>({
    queryKey: ['posts', id],
    queryFn: () => postApi.getById(id),
    enabled: !!id, // id가 있을 때만 쿼리 실행
  });
};

// 게시글 생성 훅
export const useCreatePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation<Post, Error, CreatePostDto>({
    mutationFn: (data) => postApi.create(data),
    onSuccess: () => {
      // 성공 시 게시글 목록 갱신
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};

// 게시글 업데이트 훅
export const useUpdatePost = (id: string) => {
  const queryClient = useQueryClient();
  
  return useMutation<Post, Error, UpdatePostDto>({
    mutationFn: (data) => postApi.update(id, data),
    onSuccess: (updatedPost) => {
      // 성공 시 해당 게시글 및 게시글 목록 갱신
      queryClient.invalidateQueries({ queryKey: ['posts', id] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};

// 게시글 삭제 훅
export const useDeletePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, string>({
    mutationFn: (id) => postApi.delete(id),
    onSuccess: (_, id) => {
      // 성공 시 게시글 목록 갱신 및 캐시에서 삭제
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.removeQueries({ queryKey: ['posts', id] });
    },
  });
};

// 게시글 좋아요 훅
export const useLikePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation<Post, Error, string>({
    mutationFn: (postId) => postApi.likePost(postId),
    onSuccess: (updatedPost) => {
      // 성공 시 해당 게시글 캐시 업데이트
      queryClient.setQueryData(['posts', updatedPost.id], updatedPost);
      
      // 목록에서도 좋아요 상태 업데이트
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};

// 댓글 목록 조회 훅
export const useComments = (postId: string, page: number = 1, limit: number = 10) => {
  return useQuery<Comment[], Error>({
    queryKey: ['posts', postId, 'comments', page, limit],
    queryFn: () => postApi.getComments(postId, page, limit),
    enabled: !!postId, // postId가 있을 때만 쿼리 실행
  });
};

// 댓글 생성 훅
export const useCreateComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation<Comment, Error, CreateCommentDto>({
    mutationFn: (data) => postApi.createComment(data),
    onSuccess: (_, variables) => {
      // 성공 시 해당 게시글의 댓글 목록 갱신
      queryClient.invalidateQueries({ queryKey: ['posts', variables.postId, 'comments'] });
      queryClient.invalidateQueries({ queryKey: ['posts', variables.postId] });
    },
  });
};

// 댓글 삭제 훅
export const useDeleteComment = (postId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, string>({
    mutationFn: (commentId) => postApi.deleteComment(commentId),
    onSuccess: () => {
      // 성공 시 해당 게시글의 댓글 목록 갱신
      queryClient.invalidateQueries({ queryKey: ['posts', postId, 'comments'] });
      queryClient.invalidateQueries({ queryKey: ['posts', postId] });
    },
  });
};