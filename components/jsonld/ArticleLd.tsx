import { postImageUrl, type BlogPostMeta } from "@/lib/posts";
import { SITE_URL, OG_DEFAULT } from "@/lib/seo";

export default function ArticleLd({ meta }: { meta: BlogPostMeta }) {
  const url = `${SITE_URL}/blog/${meta.slug}`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: meta.title,
    description: meta.description,
    datePublished: meta.publishedAt,
    dateModified: meta.updatedAt ?? meta.publishedAt,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    image: postImageUrl(meta.image.src, "og"),
    author: { "@type": "Organization", name: "약꼭" },
    publisher: {
      "@type": "Organization",
      name: "약꼭",
      logo: { "@type": "ImageObject", url: OG_DEFAULT },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
