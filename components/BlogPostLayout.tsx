import type { ReactNode } from "react";
import Link from "next/link";
import { postImageUrl, type BlogPostMeta } from "@/lib/posts";

type Props = {
  meta: BlogPostMeta;
  children: ReactNode;
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
}

export default function BlogPostLayout({ meta, children }: Props) {
  return (
    <article className="max-w-3xl mx-auto px-6 py-16">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/blog" className="hover:text-brand">
          블로그
        </Link>
        <span className="mx-2">/</span>
        <span>{meta.categoryLabel}</span>
      </nav>

      <header className="mb-10">
        <p className="text-brand font-semibold text-sm">
          {meta.categoryLabel}
        </p>
        <h1 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight text-gray-900 leading-tight">
          {meta.title}
        </h1>
        <p className="mt-4 text-lg text-gray-600">{meta.hero.tagline}</p>
        <div className="mt-6 text-sm text-gray-500">
          <time dateTime={meta.publishedAt}>{formatDate(meta.publishedAt)}</time>
        </div>
      </header>

      <figure className="mb-12 -mx-6 md:mx-0">
        <img
          src={postImageUrl(meta.image.src, "hero")}
          alt={meta.image.alt}
          loading="eager"
          decoding="async"
          width={1600}
          height={900}
          className="w-full aspect-[16/9] object-cover md:rounded-card"
        />
        <figcaption className="mt-2 px-6 md:px-0 text-xs text-gray-400 text-right">
          Photo by{" "}
          <a
            href={meta.image.credit.link}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-600 underline-offset-2 hover:underline"
          >
            {meta.image.credit.name}
          </a>{" "}
          on{" "}
          <a
            href="https://unsplash.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-600 underline-offset-2 hover:underline"
          >
            Unsplash
          </a>
        </figcaption>
      </figure>

      <div className="prose-yakkok">
        {children}
        {meta.faqs && meta.faqs.length > 0 ? (
          <section
            aria-labelledby="faq-heading"
            className="faq-section"
          >
            <h2 id="faq-heading">자주 묻는 질문</h2>
            <dl className="faq">
              {meta.faqs.map((faq) => (
                <div key={faq.q}>
                  <dt>{faq.q}</dt>
                  <dd>{faq.a}</dd>
                </div>
              ))}
            </dl>
          </section>
        ) : null}
      </div>

      <aside className="mt-16 rounded-card bg-brand/5 border border-brand/20 p-6 md:p-8">
        <p className="text-brand font-semibold text-sm">약꼭이 도와드려요</p>
        <h2 className="mt-2 text-xl md:text-2xl font-bold text-gray-900">
          매일 챙겨야 하는 약, 약꼭이 함께 챙겨드릴게요
        </h2>
        <p className="mt-3 text-gray-600 leading-relaxed">
          복약 알림, 가족 공유, 캘린더 기록까지. App Store에서 약꼭을 받아
          매일의 복약을 안전하게 챙겨보세요.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href="https://apps.apple.com/kr/app/id6752120136"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-brand text-white font-semibold px-5 py-2.5 hover:bg-brand-dark transition-colors"
          >
            App Store에서 받기
          </a>
          <Link
            href="/faq"
            className="inline-flex items-center justify-center rounded-full border border-gray-200 text-gray-700 font-semibold px-5 py-2.5 hover:border-brand hover:text-brand transition-colors"
          >
            자주 묻는 질문
          </Link>
        </div>
      </aside>

      <section className="mt-12 rounded-card border border-gray-200 bg-gray-50 p-5 text-sm text-gray-600 leading-relaxed">
        <p>
          <strong className="text-gray-700">의료 정보 안내.</strong> 이 글의
          내용은 일반적인 건강·복약 정보를 제공할 뿐 의학적 진단이나 처방을
          대체하지 않습니다. 실제 복약·치료에 관한 결정은 반드시 담당 의사 또는
          약사와 상의하세요.
        </p>
      </section>
    </article>
  );
}
