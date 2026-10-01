import Image, { type StaticImageData } from "next/image";

// Building blocks for case study write-ups. Every section follows the site
// grid: a small label on the left, text from column 5, and figures that can
// break out to the full width.

export function CaseSection({
  id,
  label,
  title,
  children,
}: {
  id?: string;
  label: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mt-28 grid grid-cols-12 gap-x-5 gap-y-10 border-t border-line pt-5 md:mt-40">
      <p className="col-span-12 text-sm md:col-span-4">{label}</p>
      <h2 className="col-span-12 -mt-6 text-2xl leading-[1.15] tracking-[-0.02em] text-balance md:col-span-8 md:mt-0 md:text-[2.5rem]">
        {title}
      </h2>
      {children}
    </section>
  );
}

export function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="col-span-12 max-w-[38rem] space-y-5 text-base leading-relaxed md:col-span-8 md:col-start-5 md:text-lg [&_strong]:font-medium [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
      {children}
    </div>
  );
}

export function Subheading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="col-span-12 mt-6 -mb-6 text-lg font-medium tracking-[-0.01em] md:col-span-8 md:col-start-5 md:text-xl">
      {children}
    </h3>
  );
}

type Shot = { src: StaticImageData; alt: string };

// "Шоб шо?": every figure carries a caption saying why it's there.
export function Figure({
  image,
  caption,
  wide = false,
  frame = true,
}: {
  image: Shot;
  caption?: React.ReactNode;
  wide?: boolean;
  frame?: boolean;
}) {
  return (
    <figure className={`col-span-12 ${wide ? "" : "md:col-span-8 md:col-start-5"}`}>
      <Image
        src={image.src}
        alt={image.alt}
        placeholder="blur"
        sizes={wide ? "(min-width: 1680px) 1600px, 100vw" : "(min-width: 768px) 66vw, 100vw"}
        className={`h-auto w-full ${frame ? "rounded-lg border border-ink/15" : ""}`}
      />
      {caption && <figcaption className="mt-3 max-w-[38rem] text-sm leading-relaxed text-muted">{caption}</figcaption>}
    </figure>
  );
}

// Several images side by side, sharing one caption.
export function FigureGrid({
  images,
  caption,
  columns = 2,
  wide = true,
}: {
  images: Shot[];
  caption?: React.ReactNode;
  columns?: 2 | 3 | 4;
  wide?: boolean;
}) {
  // UI screenshots stack on phones to stay readable; four-up (sketches) stays two-up.
  const cols = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-4",
  }[columns];
  return (
    <figure className={`col-span-12 ${wide ? "" : "md:col-span-8 md:col-start-5"}`}>
      <div className={`grid items-start gap-3 md:gap-5 ${cols}`}>
        {images.map((image) => (
          <Image
            key={image.alt}
            src={image.src}
            alt={image.alt}
            placeholder="blur"
            sizes={`(min-width: 768px) ${Math.round(100 / columns)}vw, ${columns === 4 ? 50 : 100}vw`}
            className="h-auto w-full rounded-lg border border-ink/15"
          />
        ))}
      </div>
      {caption && <figcaption className="mt-3 max-w-[38rem] text-sm leading-relaxed text-muted">{caption}</figcaption>}
    </figure>
  );
}

// Text that exists only for screen readers is marked `select-none`, so it
// doesn't end up in what a visitor copies from the page.
export function Stats({ items }: { items: { value: string; label: string }[] }) {
  return (
    <dl
      className={`col-span-12 grid gap-x-5 gap-y-10 md:col-span-8 md:col-start-5 ${
        items.length === 3 ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-2"
      }`}
    >
      {items.map((item) => (
        <div key={item.label} className="border-t border-line pt-4">
          <dt className="sr-only select-none">{item.label}</dt>
          <dd className="text-5xl tracking-[-0.04em] md:text-6xl">{item.value}</dd>
          <dd className="mt-2 text-sm leading-relaxed text-muted">{item.label}</dd>
        </div>
      ))}
    </dl>
  );
}

// Roles on a project, with the author's own row highlighted.
export function TeamMap({ members }: { members: { role: string; note: string; me?: boolean }[] }) {
  return (
    <ul className="col-span-12 grid gap-3 sm:grid-cols-2 md:col-span-8 md:col-start-5">
      {members.map((member) => (
        <li
          key={member.role}
          className={`rounded-lg border px-4 py-3 ${member.me ? "border-ink bg-ink text-paper" : "border-ink/15"}`}
        >
          <p className="text-sm font-medium">{member.role}</p>
          <p className={`mt-1 text-sm ${member.me ? "text-paper/70" : "text-muted"}`}>{member.note}</p>
        </li>
      ))}
    </ul>
  );
}

// Horizontal bars for small data stories. Values are percentages (0–100);
// only ratios are shown, never raw counts.
export function Bars({
  title,
  rows,
  note,
}: {
  title: string;
  rows: { label: string; value: number; display: string; strong?: boolean }[];
  note?: string;
}) {
  return (
    <figure className="col-span-12 md:col-span-8 md:col-start-5">
      <figcaption className="text-lg font-medium tracking-[-0.01em] text-balance md:text-xl">{title}</figcaption>
      <dl className="mt-6 space-y-4">
        {rows.map((row) => (
          <div key={row.label} className="grid grid-cols-12 items-center gap-x-5 gap-y-1">
            <dt className="col-span-12 text-sm text-muted sm:col-span-4">{row.label}</dt>
            <dd className="col-span-12 flex items-center gap-3 sm:col-span-8">
              <span
                aria-hidden
                className={`h-7 shrink-0 ${row.strong ? "bg-ink" : "bg-ink/20"}`}
                style={{ width: `${Math.max(row.value, 1) * 0.8}%` }}
              />
              <span className={`text-sm ${row.strong ? "font-medium" : ""}`}>{row.display}</span>
            </dd>
          </div>
        ))}
      </dl>
      {note && <p className="mt-5 max-w-[38rem] text-sm leading-relaxed text-muted">{note}</p>}
    </figure>
  );
}

// A written artefact (a brief, a message to the team) set as a document.
export function Note({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <aside className="col-span-12 rounded-lg border border-ink/15 bg-paper p-5 md:col-span-8 md:col-start-5 md:p-8">
      <p className="text-[10px] tracking-[0.12em] text-muted uppercase">{title}</p>
      <div className="mt-4 space-y-3 text-sm leading-relaxed [&_ol]:list-decimal [&_ol]:space-y-3 [&_ol]:pl-5 [&_strong]:font-medium [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5">
        {children}
      </div>
    </aside>
  );
}

export function CodeBlock({ code, caption }: { code: string; caption?: React.ReactNode }) {
  return (
    <figure className="col-span-12 md:col-span-8 md:col-start-5">
      <pre
        tabIndex={0}
        className="overflow-x-auto rounded-lg bg-ink p-5 font-mono text-[12px] leading-relaxed text-paper/90 md:text-[13px]"
      >
        <code>{code}</code>
      </pre>
      {caption && <figcaption className="mt-3 max-w-[38rem] text-sm leading-relaxed text-muted">{caption}</figcaption>}
    </figure>
  );
}

export function DataTable({ head, rows, caption }: { head: string[]; rows: string[][]; caption?: string }) {
  return (
    <figure className="col-span-12 md:col-span-8 md:col-start-5">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[34rem] text-left text-sm">
          <thead className="text-muted">
            <tr>
              {head.map((cell) => (
                <th key={cell} scope="col" className="pr-5 pb-3 font-normal">
                  {cell}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row[0]} className="border-t border-line align-top">
                {row.map((cell, i) => (
                  <td key={i} className={`py-3 pr-5 ${i === 0 ? "font-medium" : ""}`}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {caption && <figcaption className="mt-3 max-w-[38rem] text-sm leading-relaxed text-muted">{caption}</figcaption>}
    </figure>
  );
}

// A rule or principle shown as a dark card: one large statement, then the
// supporting points as numbered columns.
export function RuleCard({
  title,
  statement,
  itemsTitle,
  items,
  footer,
}: {
  title: string;
  statement: string;
  itemsTitle: string;
  items: { name: string; body: string }[];
  footer: string;
}) {
  return (
    <aside className="col-span-12 rounded-xl bg-ink p-6 text-paper md:p-10">
      <p className="text-[11px] font-medium tracking-[0.12em] text-paper/75 uppercase">{title}</p>
      <p className="mt-4 max-w-[46rem] text-2xl leading-[1.2] tracking-[-0.02em] text-balance md:text-[2.25rem]">
        {statement}
      </p>
      <p className="mt-10 text-[11px] font-medium tracking-[0.12em] text-paper/75 uppercase">{itemsTitle}</p>
      <ol className="mt-3 grid gap-3 md:grid-cols-3">
        {items.map((item, index) => (
          <li key={item.name} className="rounded-lg border border-paper/30 bg-paper/[0.08] p-4">
            <p className="text-3xl tracking-[-0.03em] text-paper/60">{index + 1}</p>
            <p className="mt-3 text-base font-medium">{item.name}</p>
            <p className="mt-1 text-sm leading-relaxed text-paper/80">{item.body}</p>
          </li>
        ))}
      </ol>
      <p className="mt-6 max-w-[46rem] border-t border-paper/25 pt-4 text-sm leading-relaxed text-paper/80">{footer}</p>
    </aside>
  );
}

// A quote from someone the author worked with, attributed by name and role.
export function Quote({ children, name, role }: { children: React.ReactNode; name: string; role: string }) {
  return (
    <figure className="col-span-12 border-l-2 border-ink pl-5 md:col-span-8 md:col-start-5 md:pl-7">
      <blockquote className="max-w-[40rem] text-xl leading-[1.3] tracking-[-0.01em] text-balance md:text-2xl">
        {children}
      </blockquote>
      <figcaption className="mt-4 text-sm">
        {name}
        <span className="block text-muted">{role}</span>
      </figcaption>
    </figure>
  );
}
