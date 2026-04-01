"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  type BoardComment,
  type BoardPost,
  createId,
  loadComments,
  loadLikedPostIds,
  loadPosts,
  saveComments,
  saveLikedPostIds,
  savePosts,
} from "./boardStorage";

export function useBoardStore() {
  const [isReady, setIsReady] = useState(false);
  const [posts, setPosts] = useState<BoardPost[]>([]);
  const [comments, setComments] = useState<BoardComment[]>([]);
  const [likedPostIds, setLikedPostIds] = useState<string[]>([]);

  useEffect(() => {
    // localStorage 값을 초기화하기 위한 동기 setState입니다.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPosts(loadPosts());
    setComments(loadComments());
    setLikedPostIds(loadLikedPostIds());
    setIsReady(true);
  }, []);

  const persist = useCallback(
    (nextPosts: BoardPost[], nextComments: BoardComment[], nextLikedIds: string[]) => {
      setPosts(nextPosts);
      setComments(nextComments);
      setLikedPostIds(nextLikedIds);
      savePosts(nextPosts);
      saveComments(nextComments);
      saveLikedPostIds(nextLikedIds);
    },
    []
  );

  const createPost = useCallback(
    (input: { title: string; content: string }) => {
      const id = createId();
      const nextPost: BoardPost = {
        id,
        title: input.title.trim(),
        content: input.content.trim(),
        createdAt: Date.now(),
        likes: 0,
      };
      const nextPosts = [nextPost, ...posts];
      // Persist posts only; keep other state unchanged.
      savePosts(nextPosts);
      setPosts(nextPosts);
      return id;
    },
    [posts]
  );

  const addComment = useCallback(
    (postId: string, input: { content: string }) => {
      const content = input.content.trim();
      if (!content) return;
      const nextComment: BoardComment = {
        id: createId(),
        postId,
        content,
        createdAt: Date.now(),
      };
      const nextComments = [...comments, nextComment];
      saveComments(nextComments);
      setComments(nextComments);
      return nextComment.id;
    },
    [comments]
  );

  const toggleLike = useCallback(
    (postId: string) => {
      const likedSet = new Set(likedPostIds);
      const alreadyLiked = likedSet.has(postId);

      const nextLikedIds = alreadyLiked
        ? likedPostIds.filter((id) => id !== postId)
        : [...likedPostIds, postId];

      const nextPosts = posts.map((p) => {
        if (p.id !== postId) return p;
        const nextLikes = alreadyLiked ? Math.max(0, p.likes - 1) : p.likes + 1;
        return { ...p, likes: nextLikes };
      });

      // Persist all at once to keep storage consistent.
      persist(nextPosts, comments, nextLikedIds);
    },
    [comments, likedPostIds, persist, posts]
  );

  const getPostById = useCallback(
    (postId: string) => posts.find((p) => p.id === postId) ?? null,
    [posts]
  );

  const getCommentsForPost = useCallback(
    (postId: string) => comments.filter((c) => c.postId === postId),
    [comments]
  );

  const isLiked = useCallback((postId: string) => likedPostIds.includes(postId), [likedPostIds]);

  const sortedPosts = useMemo(() => {
    return [...posts].sort((a, b) => b.createdAt - a.createdAt);
  }, [posts]);

  return {
    isReady,
    posts: sortedPosts,
    comments,
    createPost,
    addComment,
    toggleLike,
    getPostById,
    getCommentsForPost,
    isLiked,
    likedPostIds,
  };
}

