import { formatDate, getPost, getPosts } from "@/lib/blog";
import { ogSize, renderOgImage } from "@/lib/og";

// The link-preview card for a post (LinkedIn, X, Slack, messages).
export const alt = "Blog post";
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return getPosts().map((post) => ({ slug: post.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const post = getPost((await params).slug);
  return renderOgImage({
    eyebrow: post ? `Blog · ${formatDate(post.date)}` : "Blog",
    title: post?.title ?? "Blog",
  });
}
