import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold">
          <span className="text-2xl" aria-hidden>
            💊
          </span>
          <span className="text-brand">약꼭</span>
        </Link>
        <nav className="flex items-center gap-4 sm:gap-6">
          <Link
            href="/blog"
            className="text-sm font-medium text-gray-600 hover:text-brand transition-colors"
          >
            블로그
          </Link>
          <Link
            href="/faq"
            className="text-sm font-medium text-gray-600 hover:text-brand transition-colors"
          >
            FAQ
          </Link>
          <button
            type="button"
            disabled
            className="rounded-full border border-gray-200 px-4 py-2 text-sm text-gray-500 cursor-not-allowed"
          >
            다운로드 (출시 예정)
          </button>
        </nav>
      </div>
    </header>
  );
}
