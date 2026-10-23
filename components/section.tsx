import { Container } from "./container";

// The reference layout: a thin rule, a small label on the left, and content
// starting at the middle of a 12-column grid. An optional `aside` sits in the
// left half, under the label, its bottom level with the content's.
export function Section({
  id,
  label,
  aside,
  children,
}: {
  id: string;
  label: string;
  aside?: React.ReactNode;
  children: React.ReactNode;
}) {
  const headingId = `${id}-heading`;
  return (
    <section id={id} aria-labelledby={headingId} className="mt-28 md:mt-44">
      <Container>
        <div className="grid grid-cols-12 gap-x-5 border-t border-line pt-4 md:pt-5">
          <div className="col-span-12 mb-8 md:col-span-6 md:mb-0 md:flex md:flex-col">
            <h2 id={headingId} className="text-sm">
              {label}
            </h2>
            {/* On wider screens the aside rests level with the content's end, and
                while the content is longer than the screen it stays pinned to the
                bottom of the view, beside whatever is being read. */}
            {aside && <div className="mt-8 md:sticky md:bottom-8 md:mt-auto md:mr-[8%] md:pt-12">{aside}</div>}
          </div>
          <div className="col-span-12 md:col-span-6">{children}</div>
        </div>
      </Container>
    </section>
  );
}
