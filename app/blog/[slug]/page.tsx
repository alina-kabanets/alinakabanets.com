import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AuthorCard } from "@/components/author-card";
import { Container } from "@/components/container";
import { DraftComments } from "@/components/draft-comments";
import { PostImageZoom } from "@/components/post-image-zoom";
import { PostStatusTag } from "@/components/post-status";
import { PostVideos } from "@/components/post-videos";
import { profile } from "@/content/profile";
import { formatDate, getPost, getPosts } from "@/lib/blog";

export const dynamicParams = false;

export function generateStaticParams() {
  return getPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      url: `/blog/${post.slug}`,
      siteName: profile.name,
      locale: "en_GB",
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      authors: [profile.name],
    },
    robots: post.draft ? { index: false, follow: false } : undefined,
  };
}

export default async function BlogPost({ params }: PageProps<"/blog/[slug]">) {
  const post = getPost((await params).slug);
  if (!post) notFound();

  return (
    <article>
      <Container className="pt-10 md:pt-16">
        <Link href="/blog" className="link text-sm">
          ← All posts
        </Link>

        {/* Like a case study: the label column on the left, the reading column from the middle. */}
        <div className="mt-10 grid grid-cols-12 gap-x-5 gap-y-8 md:mt-16">
          <header className="col-span-12 md:col-span-8 md:col-start-5">
            <p className="text-sm text-muted">
              {formatDate(post.date)} · {post.minutes} min read
            </p>
            <h1 className="mt-4 text-[clamp(2.25rem,5vw,4.5rem)] leading-[0.98] font-medium tracking-[-0.04em] text-balance">
              {post.title}
            </h1>
            <p className="mt-5 max-w-[38rem] text-xl leading-snug text-ink/80 text-balance md:text-2xl">{post.description}</p>
            <div className="mt-6">
              <PostStatusTag status={post.status} draft={post.draft} />
            </div>
          </header>

          <div
            className="post-body col-span-12 max-w-[38rem] md:col-span-8 md:col-start-5"
            dangerouslySetInnerHTML={{ __html: post.html }}
          />

          {/* No comment box yet: on a new blog the conversation happens by email and on LinkedIn. */}
          <p className="col-span-12 max-w-[38rem] text-lg leading-relaxed md:col-span-8 md:col-start-5">
            Thoughts? I’d love to hear them.{" "}
            <a href={`mailto:${profile.email}?subject=${encodeURIComponent(post.title)}`} className="link" data-umami-event="blog-reply" data-umami-event-via="email">
              Email me
            </a>{" "}
            or{" "}
            <a href={profile.links.linkedin} target="_blank" rel="noopener" className="link" data-umami-event="blog-reply" data-umami-event-via="linkedin">
              reply on LinkedIn
            </a>
            .
          </p>

          <div className="col-span-12 mt-4 max-w-[38rem] md:col-span-8 md:col-start-5">
            <AuthorCard />
          </div>
        </div>
      </Container>
      <PostImageZoom />
      <PostVideos />
      {/* Reviewing drafts locally: highlight, comment, saved for Claude. */}
      {process.env.NODE_ENV === "development" && <DraftComments slug={post.slug} />}
    </article>
  );
}
