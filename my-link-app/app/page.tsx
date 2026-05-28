"use client";

import { useState, useEffect } from "react";
import { LinkItem } from "../data/links";
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
import { Share, Pencil, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, addDoc, query, orderBy, serverTimestamp } from "firebase/firestore";
import { linkSchema, LinkFormValues } from "@/lib/schemas";
import { LinkCard } from "@/components/link-card";

export default function MyLinkProfile() {
  const [username, setUsername] = useState("우지헌");
  const [bio, setBio] = useState("안녕하세요! 프론트엔드 개발자입니다.");
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // 모달 상태 관리
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Firestore 실시간 데이터베이스 연동 (Read)
  useEffect(() => {
    const q = query(
      collection(db, "users", "anonymous", "links"), 
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const linksData: LinkItem[] = [];
      snapshot.forEach((doc) => {
        linksData.push({ id: doc.id, ...doc.data() } as LinkItem);
      });
      setLinks(linksData);
      setIsLoading(false); // 데이터 수신 완료 후 로딩 해제
    }, (error) => {
      console.error("Error fetching links: ", error);
      setIsLoading(false);
    });

    // 컴포넌트 언마운트 시 구독 해제
    return () => unsubscribe();
  }, []);

  // React Hook Form 설정
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LinkFormValues>({
    resolver: zodResolver(linkSchema),
    defaultValues: {
      title: "",
      url: "",
    },
  });

  // 링크 추가 로직 (Create - Firestore)
  const onSubmit = async (data: LinkFormValues) => {
    const urlObj = new URL(data.url.startsWith('http') ? data.url : `https://${data.url}`);
    const domain = urlObj.hostname;
    const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    
    try {
      await addDoc(collection(db, "users", "anonymous", "links"), {
        title: data.title,
        url: urlObj.toString(),
        icon: faviconUrl,
        createdAt: serverTimestamp()
      });
      
      // 모달 닫기 및 폼 초기화
      reset();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("링크 추가 중 오류가 발생했습니다.");
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      reset(); // 모달이 닫힐 때 폼 입력값 초기화
    }
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
                  <Button disabled={isSubmitting} type="submit" className="brutal-border brutal-shadow bg-primary text-primary-foreground rounded-none text-lg font-bold h-12">
                    {isSubmitting ? "추가 중..." : "추가하기"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* Links List */}
          {isLoading ? (
            <div className="w-full flex flex-col items-center justify-center py-12 gap-4 brutal-border brutal-shadow bg-card">
              <div className="h-10 w-10 border-4 border-foreground border-t-primary rounded-full animate-spin"></div>
              <p className="font-black text-lg uppercase tracking-widest animate-pulse">Loading Links...</p>
            </div>
          ) : links.length === 0 ? (
            <div className="text-center py-10 opacity-50 font-bold">등록된 링크가 없습니다. 첫 링크를 추가해 보세요!</div>
          ) : (
            links.map((link) => (
              <LinkCard key={link.id} link={link} />
            ))
          )}
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
