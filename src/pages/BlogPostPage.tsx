import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ArticleStructuredData from "../components/ArticleStructuredData";
import BlogPostLayout from "../components/BlogPostLayout";
import { findPostBySlug, postImageUrl } from "../blog/posts";

const SITE_URL = "https://yakkok.netlify.app";

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Helmet>
        <title>글을 찾을 수 없습니다 | 약꼭 블로그</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <Header />
      <main className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="text-center max-w-md">
          <p className="text-5xl" aria-hidden>
            🔍
          </p>
          <h1 className="mt-4 text-2xl font-bold">글을 찾을 수 없어요</h1>
          <p className="mt-3 text-gray-600">
            요청하신 글이 삭제되었거나 주소가 잘못되었어요.
          </p>
          <Link
            to="/blog"
            className="mt-6 inline-flex items-center justify-center rounded-full bg-brand text-white font-semibold px-5 py-2.5 hover:bg-brand-dark transition-colors"
          >
            블로그 목록으로
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const post = findPostBySlug(slug);

  if (!post) {
    return <NotFound />;
  }

  const canonical = `${SITE_URL}/blog/${post.slug}`;
  const ogImage = postImageUrl(post.image.src, "og");
  const Body = post.Body;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Helmet>
        <title>{`${post.title} | 약꼭 블로그`}</title>
        <meta name="description" content={post.description} />
        <link rel="canonical" href={canonical} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonical} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.description} />
        <meta property="og:image" content={ogImage} />
        <meta
          property="article:published_time"
          content={post.publishedAt}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.description} />
        <meta name="twitter:image" content={ogImage} />
      </Helmet>
      <ArticleStructuredData meta={post} />
      <Header />
      <main className="flex-1">
        <BlogPostLayout meta={post}>
          <Body />
        </BlogPostLayout>
      </main>
      <Footer />
    </div>
  );
}
