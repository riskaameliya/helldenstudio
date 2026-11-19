import { StudioLightsButton } from "./studio-lighting";
import { site } from "@/config/site";

export function SiteFooter() {
  return (
    <footer data-light-surface className="border-t border-paper/20">
      <div className="site-gutter mx-auto flex max-w-screen-2xl flex-wrap items-center justify-between gap-x-6 py-5">
        <p className="font-display text-2xl font-bold uppercase">{site.name}</p>
        <div className="flex flex-wrap items-center gap-4">
          <a
            href="#top"
            className="inline-flex min-h-11 items-center text-sm hover:text-amber"
          >
            Back to top{" "}
            <span aria-hidden="true" className="ml-2">
              ↑
            </span>
          </a>
          <StudioLightsButton />
        </div>
      </div>
    </footer>
  );
}
