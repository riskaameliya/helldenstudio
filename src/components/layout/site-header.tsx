import Link from "next/link";
import { navigation } from "@/config/navigation";
import { site } from "@/config/site";

export function SiteHeader() {
  return (
    <header className="border-b border-paper/20">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:z-10 focus:bg-ink focus:p-4"
      >
        Skip to content
      </a>
      <div className="site-gutter mx-auto flex max-w-screen-2xl items-center justify-between gap-4 py-3">
        <Link
          className="flex min-h-11 items-center font-display text-2xl font-bold uppercase"
          href="/"
        >
          {site.name}
        </Link>
        <nav aria-label="Main navigation">
          <ul>
            {navigation.map(({ label, href }) => (
              <li key={href}>
                <a
                  className="flex min-h-11 items-center text-sm hover:text-amber"
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
