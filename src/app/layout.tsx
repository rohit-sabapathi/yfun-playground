import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Sidebar } from "@/components/layout/sidebar";
import { TopNavbar } from "@/components/layout/top-navbar";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "yfun-api Testing Terminal",
  description: "Official testing playground for the yfun-api package",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="h-full antialiased"
    >
      <body className="h-full flex overflow-hidden" style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}>
        <Providers>
          <Sidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <TopNavbar />
            <main className="flex-1 overflow-auto" style={{ backgroundColor: "var(--background)" }}>
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
