import type { Metadata } from "next";
import "@fontsource/barlow-condensed/latin-700.css";
import "@fontsource-variable/inter/wght.css";
import { SiteHeader } from "@/components/layout/site-header";
import { site } from "@/config/site";
import "./globals.css";

export const metadata: Metadata = {
  title: site.name,
  description: site.description,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
