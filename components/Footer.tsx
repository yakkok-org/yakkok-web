export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 py-10 text-center text-sm text-gray-500">
      <p>
        <span className="font-semibold text-brand">💊 약꼭</span> · 매일의 복약을
        함께 챙겨요
      </p>
      <p className="mt-2">
        © 2026 약꼭 · 문의:{" "}
        <a
          href="mailto:yakkok.official@gmail.com"
          className="text-brand-dark hover:underline"
        >
          yakkok.official@gmail.com
        </a>
      </p>
    </footer>
  );
}
