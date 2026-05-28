/**
 * 마이링크 프로필에 표시될 개별 링크 아이템의 데이터 구조입니다.
 */
export interface LinkItem {
  id: string;      // 링크의 고유 식별자
  title: string;   // 화면에 표시될 링크 제목
  url: string;     // 클릭 시 이동할 목적지 주소
  icon?: string;   // 링크 좌측에 표시할 아이콘 이미지 주소 (파비콘)
  clicks?: number; // 링크 클릭 수
}

/**
 * 화면 UI 개발을 위해 임시로 사용하는 5개의 더미 데이터 목록입니다.
 */
export const dummyLinks: LinkItem[] = [
  {
    id: "1",
    title: "인스타그램",
    url: "https://instagram.com/myprofile",
    icon: "https://www.google.com/s2/favicons?domain=instagram.com&sz=64",
  },
  {
    id: "2",
    title: "유튜브",
    url: "https://youtube.com/c/mychannel",
    icon: "https://www.google.com/s2/favicons?domain=youtube.com&sz=64",
  },
  {
    id: "3",
    title: "블로그",
    url: "https://velog.io/@myblog",
    icon: "https://www.google.com/s2/favicons?domain=velog.io&sz=64",
  },
  {
    id: "4",
    title: "GitHub",
    url: "https://github.com/myusername",
    icon: "https://www.google.com/s2/favicons?domain=github.com&sz=64",
  },
  {
    id: "5",
    title: "포트폴리오",
    url: "https://my-portfolio-website.com",
    icon: "https://www.google.com/s2/favicons?domain=my-portfolio-website.com&sz=64",
  }
];
