import Link from "next/link";
import { navigation } from "@/config/navigation";
import { site } from "@/config/site";

export function SiteHeader() {
  return (
    <header
      data-site-header
      data-light-surface="entrance"
      className="bg-entrance-ink"
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:z-10 focus:bg-ink focus:p-4"
      >
        Skip to content
      </a>
      <div className="site-gutter mx-auto flex max-w-screen-2xl flex-wrap items-start justify-between gap-x-6 sm:items-center py-3">
        <Link
          className="flex min-h-11 items-center font-display text-2xl font-bold uppercase"
          href="/"
        >
          {site.name}
        </Link>
        <nav aria-label="Main navigation">
          <ul className="flex flex-wrap gap-x-4 sm:gap-x-8">
            {navigation.map(({ label, href }) => (
              <li key={href}>
                <a
                  className="flex min-h-11 items-center text-sm underline-offset-4 hover:text-amber hover:underline focus-visible:underline"
                  href={href}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
