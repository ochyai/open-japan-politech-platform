import { NavigationBar, SmoothScrollProvider } from "@ojpp/ui";
import type { Metadata } from "next";
import { Inter, Noto_Sans_JP } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

// プリロード: 静的テキスト110文字のみのサブセット (55KB)
const notoSansJPSubset = localFont({
  src: "./fonts/noto-sans-jp-subset.woff2",
  variable: "--font-noto-sans-jp",
  display: "swap",
  preload: true,
});

// オンデマンド: 動的コンテンツ（団体名・政党名）用フルセット
const notoSansJPFull = Noto_Sans_JP({
  subsets: ["latin"],
  display: "swap",
  preload: false,
  variable: "--font-noto-sans-jp-full",
});

export const metadata: Metadata = {
  title: "MoneyGlass - 政治資金を、ガラスのように透明に",
  description:
    "全政党・全政治団体の資金の流れを可視化。AIエージェントが24時間監視・分析し、誰もが政治資金の実態にアクセスできる。",
  openGraph: {
    title: "MoneyGlass - 政治資金を、ガラスのように透明に",
    description:
      "全政党・全政治団体の資金の流れを可視化。AIエージェントが24時間監視・分析し、誰もが政治資金の実態にアクセスできる。",
    siteName: "Open Japan PoliTech Platform",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MoneyGlass - 政治資金を、ガラスのように透明に",
    description:
      "全政党・全政治団体の資金の流れを可視化。AIエージェントが24時間監視・分析し、誰もが政治資金の実態にアクセスできる。",
  },
};

const NAV_ITEMS = [
  { href: "/", label: "ダッシュボード" },
  { href: "/organizations", label: "団体一覧" },
  { href: "/parties", label: "政党別" },
  { href: "/api-docs", label: "API" },
  { href: "/about", label: "About" },
];

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja" className={`${inter.variable} ${notoSansJPSubset.variable} ${notoSansJPFull.variable}`}>
      <body className="animated-gradient-bg min-h-screen font-sans text-[#f0f0f0] antialiased">
        <NavigationBar
          brand="MoneyGlass"
          brandColor="text-[#FF6B35]"
          items={NAV_ITEMS}
          accentColor="hover:text-[#FF6B35]"
        />
        <div className="border-b border-[rgba(255,107,53,0.2)] bg-[rgba(255,107,53,0.06)] px-6 py-2 text-center text-xs text-[#FFAD80]">
          v0.1 デモ版 —
          政治資金データは疑似乱数で生成されたサンプルデータです。実際の収支報告書とは異なります。
        </div>
        <SmoothScrollProvider>
          <main>{children}</main>
        </SmoothScrollProvider>
        <footer className="border-t border-[rgba(255,255,255,0.06)] bg-[#0d1117] px-6 py-12 text-center text-sm text-[#8b949e]">
          <div className="mx-auto max-w-7xl">
            <p className="font-medium text-[#FFAD80]">AIエージェント時代の政治資金監視 — 人間が見ていなくても、エージェントが見ている</p>
            <p className="mt-2">政党にも企業にもよらない、完全オープンな政治テクノロジー基盤</p>
            <p className="mt-1 text-[#6e7681]">Open Japan PoliTech Platform v0.1 | AGPL-3.0-or-later</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
