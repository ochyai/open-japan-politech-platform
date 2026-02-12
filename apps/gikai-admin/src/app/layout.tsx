import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OpenGikai Admin - 管理画面",
  description: "OpenGikai管理画面 - 法案データ・議論の管理",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-gray-100 text-gray-900 antialiased">
        <div className="flex">
          <aside className="w-64 min-h-screen border-r bg-white p-6">
            <h1 className="mb-8 text-lg font-bold">
              <span className="text-purple-600">Open</span>Gikai
              <span className="ml-2 text-xs text-gray-400">Admin</span>
            </h1>
            <nav className="space-y-2 text-sm">
              <a href="/" className="block rounded px-3 py-2 hover:bg-gray-100">ダッシュボード</a>
              <a href="/bills" className="block rounded px-3 py-2 hover:bg-gray-100">法案管理</a>
              <a href="/sessions" className="block rounded px-3 py-2 hover:bg-gray-100">会期管理</a>
              <a href="/discussions" className="block rounded px-3 py-2 hover:bg-gray-100">議論管理</a>
              <a href="/settings" className="block rounded px-3 py-2 hover:bg-gray-100">設定</a>
            </nav>
          </aside>
          <main className="flex-1 p-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
