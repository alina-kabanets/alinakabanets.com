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

export function Stats({ items }: { items: { value: string; label: string }[] }) {
  return (
    <dl
      className={`col-span-12 grid gap-x-5 gap-y-10 md:col-span-8 md:col-start-5 ${
        items.length === 3 ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-2"
      }`}
    >
      {items.map((item) => (
        <div key={item.label} className="border-t border-line pt-4">
          <dt className="sr-only">{item.label}</dt>
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
