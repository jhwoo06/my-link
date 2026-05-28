import { Metadata } from "next";
import ClientPage from "./page.client";

export const metadata: Metadata = {
  title: "개발자를 위한 멀티링크 프로필",
  description: "GitHub, 블로그, 포트폴리오까지. 개발자를 위한 모든 링크를 한 페이지에 담아보세요.",
};

export default function Page() {
  return <ClientPage />;
}
