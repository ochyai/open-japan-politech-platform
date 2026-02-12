import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PoliMoney - 全政党政治資金透明化プラットフォーム",
  description: "全ての政党・政治団体の政治資金を可視化するオープンソースダッシュボード。非党派・非企業・エージェントレディ。",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        <header className="border-b bg-white">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <h1 className="text-xl font-bold">
              <span className="text-blue-600">Poli</span>Money
            </h1>
            <nav className="flex gap-6 text-sm">
              <a href="/" className="hover:text-blue-600">ダッシュボード</a>
              <a href="/politicians" className="hover:text-blue-600">政治家一覧</a>
              <a href="/parties" className="hover:text-blue-600">政党別</a>
              <a href="/api" className="hover:text-blue-600">API</a>
              <a href="/about" className="hover:text-blue-600">このサービスについて</a>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="border-t bg-white py-8 text-center text-sm text-gray-500">
          <p>PoliMoney は Open Japan PoliTech Platform (OJPP) の一部です。</p>
          <p className="mt-1">非党派・非企業・完全オープン・エージェントレディ</p>
          <p className="mt-1">
            <a href="https://github.com/ochyai/open-japan-politech-platform" className="text-blue-600 hover:underline">
              GitHub でソースコードを見る
            </a>
            {" | "}
            ライセンス: AGPL-3.0
          </p>
        </footer>
      </body>
    </html>
  );
}
