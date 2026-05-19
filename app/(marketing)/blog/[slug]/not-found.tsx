import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex-1 flex items-center justify-center px-6 py-20">
      <div className="text-center max-w-md">
        <p className="text-5xl" aria-hidden>
          🔍
        </p>
        <h1 className="mt-4 text-2xl font-bold">글을 찾을 수 없어요</h1>
        <p className="mt-3 text-gray-600">
          요청하신 글이 삭제되었거나 주소가 잘못되었어요.
        </p>
        <Link
          href="/blog"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-brand text-white font-semibold px-5 py-2.5 hover:bg-brand-dark transition-colors"
        >
          블로그 목록으로
        </Link>
      </div>
    </div>
  );
}
