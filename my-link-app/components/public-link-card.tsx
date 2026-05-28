"use client";

import { db } from "@/lib/firebase";
import { doc, updateDoc, increment } from "firebase/firestore";
import { LinkItem } from "@/data/links";

interface PublicLinkCardProps {
  link: LinkItem;
  userId: string;
}

export function PublicLinkCard({ link, userId }: PublicLinkCardProps) {
  const handleClick = () => {
    // 조회수 비동기 업데이트 (성공 여부를 기다리지 않고 백그라운드로 처리)
    try {
      const linkRef = doc(db, "users", userId, "links", link.id);
      updateDoc(linkRef, { clicks: increment(1) }).catch((err) => console.error("Failed to increment clicks:", err));
    } catch (error) {
      console.error("Error updating clicks:", error);
    }
  };

  return (
    <a 
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="group relative w-full h-16 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 border border-gray-100 flex items-center px-4 gap-4 overflow-hidden"
    >
      {/* 돋보이게 하는 애니메이션 배경 */}
      <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/[0.02] transition-colors duration-300" />
      
      {link.icon ? (
        <div className="h-10 w-10 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100 shrink-0 z-10 overflow-hidden">
          <img src={link.icon} alt="icon" className="h-5 w-5 object-contain" />
        </div>
      ) : (
        <div className="h-10 w-10 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100 shrink-0 z-10">
          <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
        </div>
      )}
      
      <span className="font-bold text-gray-800 text-base truncate z-10 group-hover:text-primary transition-colors">
        {link.title}
      </span>
      
      <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity z-10 text-gray-300">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
      </div>
    </a>
  );
}
