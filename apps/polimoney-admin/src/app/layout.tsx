import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PoliMoney Admin - 管理画面",
  description: "PoliMoney管理画面 - 会計データの登録・管理",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-gray-100 text-gray-900 antialiased">
        <div className="flex">
          <aside className="w-64 min-h-screen border-r bg-white p-6">
            <h1 className="mb-8 text-lg font-bold">
              <span className="text-blue-600">Poli</span>Money
              <span className="ml-2 text-xs text-gray-400">Admin</span>
            </h1>
            <nav className="space-y-2 text-sm">
              <a href="/" className="block rounded px-3 py-2 hover:bg-gray-100">ダッシュボード</a>
              <a href="/import" className="block rounded px-3 py-2 hover:bg-gray-100">データ取り込み</a>
              <a href="/transactions" className="block rounded px-3 py-2 hover:bg-gray-100">取引一覧</a>
              <a href="/reports" className="block rounded px-3 py-2 hover:bg-gray-100">報告書生成</a>
              <a href="/settings" className="block rounded px-3 py-2 hover:bg-gray-100">設定</a>
            </nav>
          </aside>
          <main className="flex-1 p-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
