import type { Metadata } from "next";
import { Noto_Sans_KR, Space_Grotesk } from "next/font/google";
import "./globals.scss";

const bodyFont = Noto_Sans_KR({
  variable: "--font-body",
  weight: ["400", "500", "700", "900"],
  subsets: ["latin"],
});

const displayFont = Space_Grotesk({
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TubeInsight - 튜브인사이트",
  description: "지금 바로 좋아하는 유튜버의 영상 대시보드를 살펴보세요.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${bodyFont.variable} ${displayFont.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
