"use client";

import Link from "next/link";

export function BoardHeader() {
  return (
    <header className="w-full border-b border-black/10 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
        <Link href="/board" className="font-semibold tracking-tight">
          게시판
        </Link>
        <nav className="flex items-center gap-3">
          <Link
            href="/board/write"
            className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white hover:bg-black/90"
          >
            글쓰기
          </Link>
        </nav>
      </div>
    </header>
  );
}

