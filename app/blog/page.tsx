import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";
import { PostStatusTag } from "@/components/post-status";
import { profile } from "@/content/profile";
import { formatDate, getPosts } from "@/lib/blog";

const description = "Notes on designing and building AI products around how people think. Some are seedlings that will keep growing.";

export const metadata: Metadata = {
  title: "Blog",
  description,
  alternates: { canonical: "/blog" },
  openGraph: { type: "website", url: "/blog", siteName: profile.name, locale: "en_GB", title: "Blog", description },
};

export default function Blog() {
  const posts = getPosts();
  return (
    <Container className="pt-10 md:pt-16">
      <div className="grid grid-cols-12 gap-x-5 gap-y-6 border-t border-line pt-4 md:pt-5">
        <h1 className="col-span-12 text-sm md:col-span-4">Blog</h1>
        <p className="col-span-12 max-w-[34rem] text-2xl leading-[1.15] tracking-[-0.02em] text-balance md:col-span-8 md:text-[2.25rem]">
          {description}
        </p>
      </div>

      <ol className="mt-16 md:mt-24">
        {posts.map((post) => (
          <li key={post.slug} className="border-t border-line">
            <Link
              href={`/blog/${post.slug}`}
              className="group grid grid-cols-12 gap-x-5 gap-y-3 py-8 md:py-10"
              data-umami-event="post-open"
              data-umami-event-post={post.slug}
            >
              <span className="col-span-12 text-sm text-muted md:col-span-4">
                {formatDate(post.date)} · {post.minutes} min read
              </span>
              <span className="col-span-12 md:col-span-8">
                <span className="block text-2xl leading-tight tracking-[-0.02em] decoration-1 underline-offset-4 group-hover:underline md:text-3xl">
                  {post.title}
                </span>
                <span className="mt-2 block max-w-[38rem] text-base leading-relaxed text-ink/80">{post.description}</span>
                <span className="mt-4 block">
                  <PostStatusTag status={post.status} draft={post.draft} />
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </Container>
  );
}
