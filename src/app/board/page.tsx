"use client";

import Link from "next/link";
import { useBoardStore } from "./_lib/useBoardStore";

export default function BoardPage() {
  const { isReady, posts, toggleLike, isLiked } = useBoardStore();

  if (!isReady) {
    return (
      <main className="w-full px-6 py-10">
        <p className="text-sm text-zinc-600">로딩 중...</p>
      </main>
    );
  }

  return (
    <main className="w-full px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">게시판</h1>

        <Link
          href="/board/write"
          className="rounded-full bg-black px-5 py-2 text-sm font-medium text-white hover:bg-black/90"
        >
          글쓰기
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="rounded-xl border border-black/10 p-6 text-sm text-zinc-600">
          아직 작성된 글이 없습니다.
        </div>
      ) : (
        <ul className="flex flex-col gap-4">
          {posts.map((post) => (
            <li
              key={post.id}
              className="w-full rounded-xl border border-black/10 bg-white p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-lg font-semibold truncate">
                    {post.title}
                  </div>

                  <div className="mt-1 text-xs text-zinc-500">
                    {new Date(post.createdAt).toLocaleString()}
                  </div>
                </div>

                <div className="flex shrink-0 flex-col items-end gap-2">
                  <button
                    type="button"
                    onClick={() => toggleLike(post.id)}
                    className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-zinc-50 px-3 py-1 text-xs font-medium hover:bg-zinc-100"
                  >
                    <span>{isLiked(post.id) ? "♥" : "♡"}</span>
                    {post.likes}
                  </button>

                  <Link
                    href={`/board/${post.id}`}
                    className="text-xs font-medium text-zinc-700 hover:text-black"
                  >
                    보기 →
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}