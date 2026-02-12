import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PoliPolicy - 全政党政策比較プラットフォーム",
  description: "全政党のマニフェスト・政策をGitで管理し、市民とAIエージェントが分析・比較できるオープンソースプラットフォーム",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        <header className="border-b bg-white">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <h1 className="text-xl font-bold">
              <span className="text-green-600">Poli</span>Policy
            </h1>
            <nav className="flex gap-6 text-sm">
              <a href="/" className="hover:text-green-600">政策一覧</a>
              <a href="/compare" className="hover:text-green-600">政党比較</a>
              <a href="/propose" className="hover:text-green-600">政策を提案する</a>
              <a href="/api" className="hover:text-green-600">API</a>
              <a href="/about" className="hover:text-green-600">このサービスについて</a>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="border-t bg-white py-8 text-center text-sm text-gray-500">
          <p>PoliPolicy は Open Japan PoliTech Platform (OJPP) の一部です。</p>
          <p className="mt-1">非党派・非企業・完全オープン・エージェントレディ | AGPL-3.0</p>
        </footer>
      </body>
    </html>
  );
}
