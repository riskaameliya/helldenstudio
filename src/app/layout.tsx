import type { Metadata } from "next";
import "@fontsource/barlow-condensed/latin-700.css";
import "@fontsource-variable/inter/wght.css";
import { StudioLighting } from "@/components/layout/studio-lighting";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
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
      <body id="top">
        <StudioLighting>
          <SiteHeader />
          {children}
          <SiteFooter />
        </StudioLighting>
      </body>
    </html>
  );
}
