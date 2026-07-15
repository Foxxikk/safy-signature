import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Šafy Signature Utility",
  description: "Tvorba jednotných emailových podpisů pro tým Šafy Production",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs" className="h-full antialiased">
      <body className="min-h-full flex flex-col text-neutral-900">
        <header className="border-b border-neutral-200 bg-white">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
            <Link href="/" className="flex items-center gap-2">
              <span className="rounded bg-[#8DC63F] px-2 py-0.5 text-lg font-extrabold text-black">
                šafy
              </span>
              <span className="text-sm font-semibold text-neutral-600">
                Signature Utility
              </span>
            </Link>
            <nav className="flex items-center gap-4 text-sm">
              <Link
                href="/"
                className="font-medium text-neutral-700 hover:text-black"
              >
                Vytvořit podpis
              </Link>
              <Link
                href="/admin"
                className="font-medium text-neutral-500 hover:text-black"
              >
                Admin
              </Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
          {children}
        </main>
        <footer className="border-t border-neutral-200 bg-white py-4 text-center text-xs text-neutral-400">
          Šafy Production · jednotné emailové podpisy
        </footer>
      </body>
    </html>
  );
}
