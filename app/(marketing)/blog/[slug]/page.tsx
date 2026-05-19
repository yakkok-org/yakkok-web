import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BlogPostLayout from "@/components/BlogPostLayout";
import ArticleLd from "@/components/jsonld/ArticleLd";
import FaqLd from "@/components/jsonld/FaqLd";
import { BLOG_POSTS, findPostBySlug, postImageUrl } from "@/lib/posts";
import { SITE_URL } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = findPostBySlug(slug);
  if (!post) {
    return {
      title: { absolute: "글을 찾을 수 없습니다 | 약꼭 블로그" },
      robots: { index: false, follow: false },
    };
  }
  const url = `${SITE_URL}/blog/${post.slug}`;
  const ogImage = postImageUrl(post.image.src, "og");
  return {
    title: { absolute: `${post.title} | 약꼭 블로그` },
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description: post.description,
      images: [ogImage],
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [ogImage],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = findPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const Body = post.Body;

  return (
    <>
      <ArticleLd meta={post} />
      {post.faqs && post.faqs.length > 0 ? <FaqLd items={post.faqs} /> : null}
      <BlogPostLayout meta={post}>
        <Body />
      </BlogPostLayout>
    </>
  );
}
