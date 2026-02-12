import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PolicyDiff - 全政党の政策を、差分で比較する",
  description: "全政党のマニフェスト・政策をバージョン管理。AIエージェントが変更を追跡し、誰もが政策の違いと変遷を即座に把握できる。",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        <header className="border-b bg-white">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <a href="/" className="text-xl font-bold">
              <span className="text-green-600">Policy</span>Diff
            </a>
            <nav className="flex gap-6 text-sm">
              <a href="/" className="hover:text-green-600">ダッシュボード</a>
              <a href="/category/教育" className="hover:text-green-600">カテゴリ別</a>
              <a href="/compare" className="hover:text-green-600">政党比較</a>
              <a href="/proposals" className="hover:text-green-600">提案</a>
              <a href="/api-docs" className="hover:text-green-600">API</a>
              <a href="/about" className="hover:text-green-600">About</a>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="border-t bg-white py-8 text-center text-sm text-gray-500">
          <p>AIエージェント時代の政策比較 — あなたのエージェントが全政党の政策を常時分析する</p>
          <p className="mt-1">政党にも企業にもよらない、完全オープンな政治テクノロジー基盤</p>
          <p className="mt-1">Open Japan PoliTech Platform | AGPL-3.0</p>
        </footer>
      </body>
    </html>
  );
}
