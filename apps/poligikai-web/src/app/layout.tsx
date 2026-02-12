import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PoliGikai - 議会オープンデータ＆参加プラットフォーム",
  description: "国会・地方議会の法案を可視化し、市民とAIエージェントが参加できるオープンソースプラットフォーム",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        <header className="border-b bg-white">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <h1 className="text-xl font-bold">
              <span className="text-purple-600">Poli</span>Gikai
            </h1>
            <nav className="flex gap-6 text-sm">
              <a href="/" className="hover:text-purple-600">法案一覧</a>
              <a href="/sessions" className="hover:text-purple-600">国会会期</a>
              <a href="/discuss" className="hover:text-purple-600">議論に参加</a>
              <a href="/api" className="hover:text-purple-600">API</a>
              <a href="/about" className="hover:text-purple-600">このサービスについて</a>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="border-t bg-white py-8 text-center text-sm text-gray-500">
          <p>PoliGikai は Open Japan PoliTech Platform (OJPP) の一部です。</p>
          <p className="mt-1">非党派・非企業・完全オープン・エージェントレディ | AGPL-3.0</p>
        </footer>
      </body>
    </html>
  );
}
