"use client";

import { useState } from "react";
import { dummyLinks, LinkItem } from "../data/links";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Share, Pencil, Trash2, Plus, Link as LinkIcon } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Zod 유효성 검사 스키마 정의
const linkSchema = z.object({
  title: z.string().min(1, { message: "링크 제목을 입력해주세요." }),
  url: z.string().min(1, { message: "웹 주소(URL)를 입력해주세요." }).refine(val => {
    try {
      const urlObj = new URL(val.startsWith('http') ? val : `https://${val}`);
      return urlObj.hostname.includes('.');
    } catch {
      return false;
    }
  }, { message: "올바른 웹 주소 형식이 아닙니다. (예: example.com)" })
});

type LinkFormValues = z.infer<typeof linkSchema>;

export default function MyLinkProfile() {
  const [username, setUsername] = useState("우지헌");
  const [bio, setBio] = useState("안녕하세요! 프론트엔드 개발자입니다.");
  const [links, setLinks] = useState<LinkItem[]>(dummyLinks);
  
  // 모달 상태 관리
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // React Hook Form 설정
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LinkFormValues>({
    resolver: zodResolver(linkSchema),
    defaultValues: {
      title: "",
      url: "",
    },
  });

  const onSubmit = (data: LinkFormValues) => {
    // 폼 제출 시 실행되는 로직
    const urlObj = new URL(data.url.startsWith('http') ? data.url : `https://${data.url}`);
    const domain = urlObj.hostname;
    const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    
    const newLink: LinkItem = {
      id: Date.now().toString(),
      title: data.title,
      url: urlObj.toString(),
      icon: faviconUrl
    };

    setLinks([newLink, ...links]);
    
    // 모달 닫기 및 폼 초기화
    reset();
    setIsDialogOpen(false);
  };

  const handleOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      reset(); // 모달이 닫힐 때 폼 입력값 초기화
    }
  };

  const handleDeleteLink = (id: string) => {
    setLinks(links.filter(link => link.id !== id));
  };

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
          
          {/* Add Link Button (Top & Redesigned) */}
          <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger render={
              <Button 
                className="w-full h-20 brutal-border brutal-shadow bg-primary hover:bg-primary/90 text-primary-foreground text-2xl font-black rounded-none border-dashed hover:border-solid transition-all relative overflow-hidden group mb-4"
              />
            }>
                <div className="absolute inset-0 bg-background/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                <Plus className="mr-3 h-8 w-8 relative z-10" strokeWidth={4} />
                <span className="relative z-10">새로운 링크 추가하기</span>
            </DialogTrigger>
            
            {/* Dialog Content (Neobrutalism Style) */}
            <DialogContent className="brutal-border brutal-shadow bg-card rounded-none sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-3xl font-black uppercase tracking-tight">새 링크 추가</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title" className="text-lg font-bold">링크 제목</Label>
                  <Input 
                    id="title" 
                    placeholder="예: 내 인스타그램" 
                    className={`brutal-border rounded-none h-12 text-lg focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-primary ${errors.title ? "border-destructive text-destructive" : ""}`}
                    {...register("title")}
                  />
                  {errors.title && <span className="text-destructive font-bold text-sm">{errors.title.message}</span>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="url" className="text-lg font-bold">URL (웹 주소)</Label>
                  <Input 
                    id="url" 
                    placeholder="https://example.com" 
                    className={`brutal-border rounded-none h-12 text-lg focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-primary ${errors.url ? "border-destructive text-destructive" : ""}`}
                    {...register("url")}
                  />
                  {errors.url && <span className="text-destructive font-bold text-sm">{errors.url.message}</span>}
                </div>
                <DialogFooter className="mt-4">
                  <Button type="button" variant="outline" className="brutal-border brutal-shadow rounded-none text-lg font-bold h-12 bg-card hover:bg-secondary" onClick={() => handleOpenChange(false)}>
                    취소
                  </Button>
                  <Button type="submit" className="brutal-border brutal-shadow bg-primary text-primary-foreground rounded-none text-lg font-bold h-12">
                    추가하기
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* Links List */}
          {links.map((link) => (
            <div key={link.id} className="flex gap-3 items-center group relative w-full">
              <a 
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 brutal-border brutal-shadow bg-card hover:bg-secondary transition-all p-4 md:p-5 flex items-center gap-4 text-left no-underline"
              >
                {/* Favicon */}
                {link.icon ? (
                  <div className="h-10 w-10 bg-background brutal-border shrink-0 flex items-center justify-center overflow-hidden">
                    <img src={link.icon} alt={`${link.title} icon`} className="h-6 w-6 object-contain" />
                  </div>
                ) : (
                  <div className="h-10 w-10 bg-background brutal-border shrink-0 flex items-center justify-center">
                    <LinkIcon className="h-5 w-5" />
                  </div>
                )}
                
                {/* Link Title */}
                <span className="text-xl md:text-2xl font-bold flex-1 truncate">{link.title}</span>
                
                {/* Edit Hint Icon */}
                <Pencil className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity text-foreground" />
              </a>
              
              {/* Delete Button */}
              <Button 
                onClick={() => handleDeleteLink(link.id)}
                variant="destructive" 
                className="brutal-border brutal-shadow h-[72px] w-[72px] p-0 rounded-none shrink-0 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex"
              >
                <Trash2 className="h-7 w-7" />
                <span className="sr-only">삭제</span>
              </Button>
            </div>
          ))}
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
