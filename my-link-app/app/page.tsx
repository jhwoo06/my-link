"use client";

import { useState } from "react";
import { dummyLinks } from "../data/links";
import { Button } from "@/components/ui/button";
import { Share, Pencil, Trash2, Plus } from "lucide-react";

export default function MyLinkProfile() {
  const [username, setUsername] = useState("우지헌");
  const [bio, setBio] = useState("안녕하세요! 프론트엔드 개발자입니다.");

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-foreground pb-20">
      {/* Main Container */}
      <main className="max-w-2xl mx-auto px-4 py-12 flex flex-col items-center gap-10">
        
        {/* Header & Share */}
        <div className="w-full flex justify-end">
          <Button variant="outline" className="brutal-border brutal-shadow bg-card hover:bg-primary/50 rounded-none h-12 w-12 p-0">
            <Share className="h-5 w-5" />
            <span className="sr-only">공유하기</span>
          </Button>
        </div>

        {/* Profile Section */}
        <section className="flex flex-col items-center gap-6 text-center w-full">
          {/* DisplayName Badge (URL Slug) */}
          <div className="brutal-border brutal-shadow bg-secondary text-secondary-foreground px-6 py-2 rounded-none font-bold text-lg tracking-wider">
            @jhwoo06
          </div>
          
          {/* Username (Editable) */}
          <div className="group relative cursor-pointer border-b-4 border-transparent hover:border-foreground border-dashed pb-1 transition-all">
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight">{username}</h1>
            <Pencil className="absolute -right-8 top-1 md:top-2 h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity text-foreground" />
          </div>

          {/* Bio (Editable) */}
          <div className="group relative cursor-pointer border-2 border-transparent hover:border-foreground border-dashed p-4 w-full max-w-md transition-all">
            <p className="text-lg md:text-xl font-medium">{bio}</p>
            <Pencil className="absolute -right-4 -top-4 h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity bg-primary text-foreground brutal-border p-1" />
          </div>
        </section>

        {/* Links Section */}
        <section className="w-full flex flex-col gap-6 mt-8">
          {dummyLinks.map((link) => (
            <div key={link.id} className="flex gap-3 items-center group relative w-full">
              <a 
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 brutal-border brutal-shadow bg-card hover:bg-primary transition-all p-4 md:p-5 flex items-center gap-4 text-left no-underline"
              >
                {/* Favicon */}
                {link.icon && (
                  <div className="h-10 w-10 bg-background brutal-border shrink-0 flex items-center justify-center overflow-hidden">
                    <img src={link.icon} alt={`${link.title} icon`} className="h-6 w-6 object-contain" />
                  </div>
                )}
                
                {/* Link Title */}
                <span className="text-xl md:text-2xl font-bold flex-1 truncate">{link.title}</span>
                
                {/* Edit Hint Icon */}
                <Pencil className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity text-foreground" />
              </a>
              
              {/* Delete Button (Owner Only - Hidden on mobile for simplicity, but flex on md) */}
              <Button 
                variant="destructive" 
                className="brutal-border brutal-shadow h-[72px] w-[72px] p-0 rounded-none shrink-0 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex"
              >
                <Trash2 className="h-7 w-7" />
                <span className="sr-only">삭제</span>
              </Button>
            </div>
          ))}

          {/* Add Link Button */}
          <Button 
            className="w-full mt-6 h-[72px] brutal-border brutal-shadow bg-accent hover:bg-accent/90 text-accent-foreground text-2xl font-black rounded-none"
          >
            <Plus className="mr-2 h-8 w-8" strokeWidth={3} />
            새 링크 추가하기
          </Button>
        </section>

        {/* Footer */}
        <footer className="mt-16 text-sm font-bold tracking-widest uppercase opacity-80 flex items-center gap-2">
          powered by 
          <span className="bg-foreground text-background px-3 py-1 brutal-border shadow-[3px_3px_0_0_oklch(0.75_0.15_85)]">
            My Link
          </span>
        </footer>
        
      </main>
    </div>
  );
}
