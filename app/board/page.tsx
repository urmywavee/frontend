"use client";

import Link from "next/link";
import { BoardHeader } from "./_components/BoardHeader";
import { useBoardStore } from "./_lib/useBoardStore";

export default function BoardPage() {
  const { isReady, posts, toggleLike, isLiked } = useBoardStore();

  if (!isReady) {
    return (
      <div className="min-h-screen bg-white">
        <BoardHeader />
        <main className="mx-auto max-w-3xl px-4 py-10">
          <p className="text-sm text-zinc-600">로딩 중...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <BoardHeader />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h1 className="text-xl font-bold tracking-tight">게시판</h1>
          <Link
            href="/board/write"
            className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white hover:bg-black/90"
          >
            글쓰기
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className="rounded-xl border border-black/10 p-6 text-sm text-zinc-600">
            아직 작성된 글이 없습니다.
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {posts.map((post) => (
              <li
                key={post.id}
                className="rounded-xl border border-black/10 bg-white p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="truncate text-base font-semibold">{post.title}</div>
                    <div className="mt-1 text-xs text-zinc-500">
                      {new Date(post.createdAt).toLocaleString()}
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <button
                      type="button"
                      onClick={() => toggleLike(post.id)}
                      className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-zinc-50 px-3 py-1 text-xs font-medium hover:bg-zinc-100"
                      aria-pressed={isLiked(post.id)}
                      title="좋아요"
                    >
                      <span aria-hidden="true">{isLiked(post.id) ? "♥" : "♡"}</span>
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
    </div>
  );
}

