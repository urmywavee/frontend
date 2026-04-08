"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchPost } from "../../../lib/api";
import type { PostDetail } from "../../../types/post";

interface PageProps {
  params: {
    id: string;
  };
}

export default function PostDetailPage({ params }: PageProps) {
  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPost = async () => {
      try {
        const postId = Number(params.id);
        const data = await fetchPost(postId);
        setPost(data);
      } catch (err) {
        setError("게시글을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [params.id]);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error || !post) {
    return (
      <main>
        <p>{error || "존재하지 않는 게시글입니다."}</p>
        <Link href="/community">← 목록으로</Link>
      </main>
    );
  }

  return (
    <main>
      <Link href="/community">← 목록으로</Link>

      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <p>작성자: {post.author ?? "익명"}</p>
      <p>좋아요: {post.likeCount}</p>

      <section>
        <h2>댓글</h2>
        {post.comments.length === 0 ? (
          <p>댓글이 없습니다.</p>
        ) : (
          post.comments.map((comment) => (
            <div key={comment.id}>
              <p>{comment.content}</p>
              <p>작성자: {comment.author ?? "익명"}</p>
            </div>
          ))
        )}
      </section>
    </main>
  );
}