import Image from "next/image";
import poster from "@/public/images/work/deaku/kpi/growth-analytics-poster.jpg";

// The live demo of the Growth Analytics dashboard: a separate app rebuilt from
// scratch on invented data, embedded in a browser frame. On small screens a
// picture and a link stand in, because the dashboard needs a wide window.
export function DashboardDemo({ href }: { href: string }) {
  return (
    <figure className="col-span-12">
      <div className="overflow-hidden rounded-lg border border-ink/15 bg-white">
        <div className="flex items-center gap-1 border-b border-ink/10 px-2.5 py-2">
          <span aria-hidden className="size-1.5 rounded-full bg-ink/20" />
          <span aria-hidden className="size-1.5 rounded-full bg-ink/20" />
          <span aria-hidden className="size-1.5 rounded-full bg-ink/20" />
          <span className="ml-3 text-xs text-muted">Illustrative data</span>
          <a
            href={href}
            target="_blank"
            rel="noopener"
            className="ml-auto text-xs underline decoration-ink/30 underline-offset-2 hover:decoration-ink"
            data-umami-event="dashboard-demo-open"
          >
            Open full screen <span aria-hidden>↗</span>
          </a>
        </div>
        <iframe
          src={href}
          title="Growth Analytics dashboard, Overview tab: a live demo with invented data"
          loading="lazy"
          className="hidden h-[760px] w-full md:block"
        />
        <a href={href} target="_blank" rel="noopener" className="block md:hidden" data-umami-event="dashboard-demo-open">
          <Image
            src={poster}
            alt="The Growth Analytics dashboard: four outcome tiles for revenue, sign-ups, paying customers and collaborating workspaces, each with a target and a status. Invented data."
            sizes="100vw"
          />
        </a>
      </div>
      <figcaption className="mt-3 max-w-[38rem] text-sm leading-relaxed text-muted">
        The Overview tab, rebuilt from scratch from my designs on invented data: not Deaku’s figures or code. Switch
        between weeks and months, step back through periods, hover the staircase, pick a metric in Trends or copy the
        update.
      </figcaption>
    </figure>
  );
}
