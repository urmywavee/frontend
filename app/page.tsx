import Link from "next/link";

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-zinc-50 via-white to-zinc-100">
      {/* 은은한 배경 효과 */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-zinc-200/30 blur-3xl" />

      <section className="relative mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-6 text-center">
        {/* 작은 문구 */}
        <p className="text-xs tracking-widest text-zinc-400">
          SIMPLE COMMUNITY
        </p>

        {/* 메인 타이틀 */}
        <h1 className="mt-4 text-4xl font-semibold leading-tight text-zinc-900 sm:text-5xl">
          생각을 기록하고,
          <br />
          조용히 나누는 공간
        </h1>

        {/* 서브 텍스트 */}
        <p className="mt-6 max-w-xl text-sm leading-6 text-zinc-500 sm:text-base">
          글을 남기고 댓글을 작성할 수 있는
          <br />
          복잡하지 않은 작은 게시판입니다.
        </p>

        {/* 버튼 */}
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
         <Link
            href="/board"
            className="inline-flex min-w-[300px] h-14 items-center justify-center rounded-full bg-black px-8 text-lg font-semibold text-white shadow-md transition hover:scale-105 hover:opacity-90"
            >
            게시판 들어가기
          </Link>
        </div>
      </section>
    </main>
  );
}