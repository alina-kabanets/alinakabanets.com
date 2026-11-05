import type { PostStatus } from "@/lib/blog";

// Where a post is in its life, like a digital garden: a seedling is an early
// idea that will still change; evergreen is settled.
const label: Record<PostStatus, string> = {
  seedling: "Seedling",
  growing: "Growing",
  evergreen: "Evergreen",
};

const sprout: Record<PostStatus, string> = {
  seedling: "M12 21v-8 M12 13C12 9 9 7 5 7c0 4 3 6 7 6Z M12 15c0-3 2-5 5-5 0 3-2 5-5 5Z",
  growing: "M12 21V9 M12 14c0-3 -2.5-5 -6-5 0 3 2.5 5 6 5Z M12 10c0-3 2.5-5 6-5 0 3-2.5 5-6 5Z",
  evergreen: "M12 21v-4 M12 3 5 13h4l-3 4h12l-3-4h4Z",
};

export function PostStatusTag({ status, draft = false }: { status: PostStatus; draft?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm">
      <span className="inline-flex h-[1.9em] items-center gap-1.5 rounded-full border border-ink/50 px-2.5">
        <svg aria-hidden viewBox="0 0 24 24" className="size-[1.05em]" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d={sprout[status]} />
        </svg>
        {label[status]}
      </span>
      {draft && <span className="rounded-full bg-ink px-2.5 py-0.5 text-paper">Draft</span>}
    </span>
  );
}
