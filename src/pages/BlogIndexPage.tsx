import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CTA from "../components/CTA";
import { BLOG_POSTS, postImageUrl } from "../blog/posts";

const TITLE = "약꼭 블로그 - 복약·건강 정보 매거진 | 약꼭";
const DESCRIPTION =
  "약꼭이 정리한 복약 관리, 영양제 조합, 만성질환, 시니어·반려동물 케어 정보. 매일의 복약을 더 안전하게 챙기는 가이드를 만나보세요.";
const CANONICAL = "https://yakkok.netlify.app/blog";
const OG_IMAGE = "https://yakkok.netlify.app/og-default.png";

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

export default function BlogIndexPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Helmet>
        <title>{TITLE}</title>
        <meta name="description" content={DESCRIPTION} />
        <link rel="canonical" href={CANONICAL} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={CANONICAL} />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESCRIPTION} />
        <meta property="og:image" content={OG_IMAGE} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={TITLE} />
        <meta name="twitter:description" content={DESCRIPTION} />
        <meta name="twitter:image" content={OG_IMAGE} />
      </Helmet>
      <Header />
      <main className="flex-1">
        <section
          className="max-w-5xl mx-auto px-6 py-16"
          aria-labelledby="blog-heading"
        >
          <div className="text-center">
            <p className="text-brand font-semibold">매거진</p>
            <h1
              id="blog-heading"
              className="mt-2 text-3xl md:text-4xl font-bold tracking-tight"
            >
              약꼭 블로그
            </h1>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto leading-relaxed">
              복약 관리, 영양제 조합, 만성질환·시니어·반려동물 케어까지. 약꼭이
              정리한 실용 가이드를 만나보세요.
            </p>
          </div>

          <ul className="mt-12 grid gap-6 md:grid-cols-2">
            {BLOG_POSTS.map((post) => (
              <li key={post.slug}>
                <Link
                  to={`/blog/${post.slug}`}
                  className="group block h-full overflow-hidden rounded-card border border-gray-200 bg-white transition hover:border-brand hover:shadow-md"
                >
                  <div className="aspect-[16/9] overflow-hidden bg-gray-100">
                    <img
                      src={postImageUrl(post.image.src, "card")}
                      alt={post.image.alt}
                      loading="lazy"
                      decoding="async"
                      width={800}
                      height={450}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <p className="text-brand text-xs font-semibold uppercase tracking-wide">
                      {post.categoryLabel}
                    </p>
                    <h2 className="mt-2 text-xl font-bold text-gray-900 leading-snug group-hover:text-brand-dark">
                      {post.title}
                    </h2>
                    <p className="mt-3 text-sm text-gray-600 leading-relaxed line-clamp-3">
                      {post.description}
                    </p>
                    <div className="mt-5 text-xs text-gray-500">
                      <time dateTime={post.publishedAt}>
                        {formatDate(post.publishedAt)}
                      </time>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
