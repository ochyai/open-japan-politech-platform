import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OpenPolicy - オープン政策議論プラットフォーム",
  description: "Gitベースで政策を管理し、市民が提案できるオープンソースプラットフォーム",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        <header className="border-b bg-white">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <h1 className="text-xl font-bold">
              <span className="text-green-600">Open</span>Policy
            </h1>
            <nav className="flex gap-6 text-sm">
              <a href="/" className="hover:text-green-600">政策一覧</a>
              <a href="/compare" className="hover:text-green-600">政党比較</a>
              <a href="/propose" className="hover:text-green-600">政策を提案する</a>
              <a href="/about" className="hover:text-green-600">このサービスについて</a>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="border-t bg-white py-8 text-center text-sm text-gray-500">
          <p>OpenPolicy は Open Civic Platform の一部です。AGPL-3.0</p>
        </footer>
      </body>
    </html>
  );
}
