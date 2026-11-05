"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Dev-only: highlight text in a post, leave a comment, and it's saved next to
// the post for Claude to apply later. Saved comments are highlighted in the
// text and listed in a panel, where each can be jumped to or removed.

type Comment = { id: string; quote: string; text: string; at: string };
type Pending = { quote: string; top: number; left: number };

const BODY = ".post-body";

// Finds a quote in the post's text, even across bold or links.
function findRange(root: Element, quote: string) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  let text = "";
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    nodes.push(node as Text);
    text += node.textContent;
  }
  const start = text.indexOf(quote);
  if (start < 0) return null;
  const end = start + quote.length;
  const range = document.createRange();
  let pos = 0;
  for (const node of nodes) {
    const len = node.textContent?.length ?? 0;
    if (start >= pos && start <= pos + len) range.setStart(node, start - pos);
    if (end >= pos && end <= pos + len) {
      range.setEnd(node, end - pos);
      break;
    }
    pos += len;
  }
  return range;
}

export function DraftComments({ slug }: { slug: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [pending, setPending] = useState<Pending | null>(null);
  const [writing, setWriting] = useState(false);
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const field = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    fetch(`/api/draft-comments?slug=${slug}`)
      .then((response) => response.json())
      .then(setComments)
      .catch(() => {});
  }, [slug]);

  // Highlight every commented passage.
  useEffect(() => {
    const root = document.querySelector(BODY);
    if (!root || !("highlights" in CSS)) return;
    const ranges = comments.map((comment) => findRange(root, comment.quote)).filter((range): range is Range => !!range);
    CSS.highlights.set("draft-comment", new Highlight(...ranges));
  }, [comments]);

  // A selection inside the post offers the comment button.
  useEffect(() => {
    const onUp = () => {
      if (writing) return;
      const selection = window.getSelection();
      const quote = selection?.toString().trim();
      const root = document.querySelector(BODY);
      if (!selection || !quote || !root || !root.contains(selection.anchorNode)) {
        setPending(null);
        return;
      }
      const rect = selection.getRangeAt(0).getBoundingClientRect();
      setPending({ quote, top: rect.bottom + 8, left: rect.left + rect.width / 2 });
    };
    document.addEventListener("mouseup", onUp);
    document.addEventListener("keyup", onUp);
    return () => {
      document.removeEventListener("mouseup", onUp);
      document.removeEventListener("keyup", onUp);
    };
  }, [writing]);

  // The popover sits under the selection; it closes on scroll.
  useEffect(() => {
    if (!pending) return;
    const close = () => !writing && setPending(null);
    window.addEventListener("scroll", close, { passive: true });
    return () => window.removeEventListener("scroll", close);
  }, [pending, writing]);

  const save = useCallback(async () => {
    if (!pending || !text.trim()) return;
    const response = await fetch("/api/draft-comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, quote: pending.quote, text: text.trim() }),
    });
    setComments(await response.json());
    setText("");
    setWriting(false);
    setPending(null);
    window.getSelection()?.removeAllRanges();
  }, [pending, slug, text]);

  const remove = async (id: string) => {
    const response = await fetch("/api/draft-comments", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, id }),
    });
    setComments(await response.json());
  };

  const jumpTo = (quote: string) => {
    const root = document.querySelector(BODY);
    const range = root && findRange(root, quote);
    const top = range?.getBoundingClientRect().top;
    if (top !== undefined) window.scrollTo({ top: top + window.scrollY - 160, behavior: "smooth" });
  };

  return (
    <>
      {pending && (
        <div
          className="fixed z-50 -translate-x-1/2 font-sans text-sm"
          style={{ top: pending.top, left: pending.left }}
          onMouseUp={(event) => event.stopPropagation()}
        >
          {writing ? (
            <div className="w-80 rounded-lg bg-ink p-3 text-paper shadow-xl">
              <p className="line-clamp-2 text-xs text-paper/60">“{pending.quote}”</p>
              <textarea
                ref={field}
                autoFocus
                value={text}
                onChange={(event) => setText(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) save();
                  if (event.key === "Escape") {
                    setWriting(false);
                    setPending(null);
                  }
                }}
                rows={3}
                placeholder="What should change?"
                className="mt-2 w-full resize-none rounded bg-paper/10 p-2 text-paper outline-none placeholder:text-paper/40"
              />
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-paper/50">⌘↵ to save · Esc to cancel</span>
                <button type="button" onClick={save} className="rounded-full bg-paper px-3 py-1 text-ink">
                  Save
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => setWriting(true)}
              className="rounded-full bg-ink px-3 py-1.5 text-paper shadow-lg"
            >
              + Comment
            </button>
          )}
        </div>
      )}

      {/* The list of comments on this draft. */}
      <div className="fixed right-5 bottom-5 z-40 font-sans text-sm">
        {open && (
          <div className="mb-2 max-h-[60vh] w-80 overflow-y-auto rounded-lg border border-ink/15 bg-paper p-3 shadow-xl">
            <p className="text-xs text-muted">
              Saved to content/blog/{slug}.comments.json. Ask Claude to apply them.
            </p>
            {comments.length === 0 && <p className="mt-3 text-muted">Highlight text in the post to comment.</p>}
            <ol className="mt-2 space-y-2">
              {comments.map((comment) => (
                <li key={comment.id} className="rounded-md bg-tint p-2.5">
                  <button type="button" onClick={() => jumpTo(comment.quote)} className="block text-left">
                    <span className="line-clamp-2 text-xs text-muted">“{comment.quote}”</span>
                    <span className="mt-1 block">{comment.text}</span>
                  </button>
                  <button type="button" onClick={() => remove(comment.id)} className="mt-1 text-xs text-muted underline">
                    Remove
                  </button>
                </li>
              ))}
            </ol>
          </div>
        )}
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="float-right rounded-full bg-ink px-4 py-2 text-paper shadow-lg"
        >
          Comments ({comments.length})
        </button>
      </div>
    </>
  );
}
