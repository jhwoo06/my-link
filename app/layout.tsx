import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import QueryProvider from "@/components/query-provider";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : "http://localhost:3000"
  ),
  title: {
    default: "MyLink - 나만의 멀티링크 프로필",
    template: "%s | MyLink",
  },
  description: "인플루언서와 크리에이터를 위한 단 하나의 멀티링크 서비스. GitHub, 블로그, 포트폴리오를 한 곳에 모아보세요.",
  keywords: ["멀티링크", "프로필", "링크트리", "개발자 포트폴리오", "MyLink"],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "MyLink",
    title: "MyLink - 단 하나의 링크로 모든 것을",
    description: "개발자, 크리에이터를 위한 완벽한 멀티링크 프로필 서비스",
  },
  twitter: {
    card: "summary_large_image",
    title: "MyLink",
    description: "인플루언서와 크리에이터를 위한 단 하나의 멀티링크 서비스",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={cn("h-full", "antialiased", "font-sans")}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <QueryProvider>
          {children}
          <Toaster position="top-center" />
        </QueryProvider>
      </body>
    </html>
  );
}
