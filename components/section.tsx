import { Container } from "./container";

// The reference layout: a thin rule, a small label on the left, and content
// starting at the middle of a 12-column grid.
export function Section({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
}) {
  const headingId = `${id}-heading`;
  return (
    <section id={id} aria-labelledby={headingId} className="mt-28 md:mt-44">
      <Container>
        <div className="grid grid-cols-12 gap-x-5 border-t border-line pt-4 md:pt-5">
          <h2 id={headingId} className="col-span-12 mb-8 text-sm md:col-span-6 md:mb-0">
            {label}
          </h2>
          <div className="col-span-12 md:col-span-6">{children}</div>
        </div>
      </Container>
    </section>
  );
}
