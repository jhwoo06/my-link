export interface LinkItem {
  linkId: string;
  title: string;
  url: string;
  faviconUrl?: string;
  createdAt: string;
}

export const dummyLinks: LinkItem[] = [
  {
    linkId: "1",
    title: "인스타그램",
    url: "https://instagram.com/myprofile",
    faviconUrl: "https://www.google.com/s2/favicons?domain=instagram.com&sz=64",
    createdAt: new Date().toISOString(),
  },
  {
    linkId: "2",
    title: "유튜브",
    url: "https://youtube.com/c/mychannel",
    faviconUrl: "https://www.google.com/s2/favicons?domain=youtube.com&sz=64",
    createdAt: new Date().toISOString(),
  },
  {
    linkId: "3",
    title: "블로그",
    url: "https://velog.io/@myblog",
    faviconUrl: "https://www.google.com/s2/favicons?domain=velog.io&sz=64",
    createdAt: new Date().toISOString(),
  },
  {
    linkId: "4",
    title: "GitHub",
    url: "https://github.com/myusername",
    faviconUrl: "https://www.google.com/s2/favicons?domain=github.com&sz=64",
    createdAt: new Date().toISOString(),
  },
  {
    linkId: "5",
    title: "포트폴리오",
    url: "https://my-portfolio-website.com",
    faviconUrl: "https://www.google.com/s2/favicons?domain=my-portfolio-website.com&sz=64",
    createdAt: new Date().toISOString(),
  }
];
