import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SidebarNav, type SidebarNavGroup } from "@/components/sidebar-nav";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { Toaster } from "@/components/ui/sonner";
import { SECTIONS, SECTION_LABELS, getSection } from "@/lib/content";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BusinessOS",
  description: "Painel de gestão pessoal e estratégica do founder",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const groups: SidebarNavGroup[] = SECTIONS.map((section) => ({
    section,
    label: SECTION_LABELS[section],
    href: `/${section}`,
    items: getSection(section).map((item) => ({
      slug: item.slug,
      title: item.title,
      href: `/${section}/${item.slug}`,
    })),
  }));

  return (
    <html lang="pt-BR" className={`${inter.variable} antialiased`} suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground">
        <ThemeProvider>
          <div className="flex min-h-screen">
            <SidebarNav groups={groups} />
            <main className="flex-1 overflow-y-auto">
              <div className="relative mx-auto max-w-5xl px-8 py-10">
                <div className="absolute right-8 top-4">
                  <ThemeToggle />
                </div>
                {children}
              </div>
            </main>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
