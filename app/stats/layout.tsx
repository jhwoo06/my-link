import { Metadata } from "next";

export const metadata: Metadata = {
  title: "방문자 통계",
  description: "내 마이링크의 방문자 통계와 링크별 클릭 수를 확인하세요.",
};

export default function StatsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
