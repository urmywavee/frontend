"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { BoardHeader } from "../_components/BoardHeader";
import { useBoardStore } from "../_lib/useBoardStore";
import { useMemo, useState } from "react";

export default function WritePage() {
  const router = useRouter();
  const { isReady, createPost } = useBoardStore();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);

  const isInvalid = useMemo(() => {
    return title.trim().length === 0 || content.trim().length === 0;
  }, [content, title]);

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
          <h1 className="text-xl font-bold tracking-tight">글쓰기</h1>
          <Link href="/board" className="text-sm font-medium text-zinc-600 hover:text-black">
            ← 목록
          </Link>
        </div>

        <form
          className="rounded-xl border border-black/10 bg-white p-4"
          onSubmit={(e) => {
            e.preventDefault();
            setError(null);

            const t = title.trim();
            const c = content.trim();
            if (!t || !c) {
              setError("제목과 내용을 입력해주세요.");
              return;
            }

            const id = createPost({ title: t, content: c });
            router.push(`/board/${id}`);
          }}
        >
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-zinc-800" htmlFor="title">
              제목
            </label>
            <input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-11 rounded-lg border border-black/10 bg-white px-3 text-sm outline-none focus:border-black/30"
              placeholder="제목을 입력하세요"
            />
          </div>

          <div className="mt-4 flex flex-col gap-2">
            <label className="text-sm font-medium text-zinc-800" htmlFor="content">
              내용
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[160px] resize-y rounded-lg border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-black/30"
              placeholder="내용을 입력하세요"
            />
          </div>

          {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}

          <div className="mt-5 flex items-center gap-3">
            <button
              type="submit"
              disabled={isInvalid}
              className="h-11 rounded-lg bg-black px-4 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-zinc-400"
            >
              등록
            </button>
            <button
              type="button"
              onClick={() => {
                setTitle("");
                setContent("");
                setError(null);
              }}
              className="h-11 rounded-lg border border-black/10 bg-white px-4 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
            >
              초기화
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

