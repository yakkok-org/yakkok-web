import { useEffect } from "react";
import { postImageUrl, type BlogPostMeta } from "../blog/posts";

const SITE_URL = "https://yakkok.netlify.app";
const LOGO = `${SITE_URL}/og-default.png`;

export default function ArticleStructuredData({
  meta,
}: {
  meta: BlogPostMeta;
}) {
  useEffect(() => {
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
        logo: { "@type": "ImageObject", url: LOGO },
      },
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.dataset.seo = "structured-data-article";
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, [meta]);

  return null;
}
