"use client";

import { useState } from "react";
import { LinkItem } from "@/data/links";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Pencil, Trash2, Link as LinkIcon, Save, X, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { linkSchema, LinkFormValues } from "@/lib/schemas";
import { db } from "@/lib/firebase";
import { doc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";

interface LinkCardProps {
  link: LinkItem;
  uid: string;
}

export function LinkCard({ link, uid }: LinkCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LinkFormValues>({
    resolver: zodResolver(linkSchema),
    defaultValues: {
      title: link.title,
      url: link.url,
    },
  });

  const onEditSubmit = async (data: LinkFormValues) => {
    const urlObj = new URL(data.url.startsWith('http') ? data.url : `https://${data.url}`);
    const domain = urlObj.hostname;
    const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    
    try {
      await updateDoc(doc(db, "users", uid, "links", link.id), {
        title: data.title,
        url: urlObj.toString(),
        icon: faviconUrl,
        updatedAt: serverTimestamp(),
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating document: ", error);
      alert("링크 수정 중 오류가 발생했습니다.");
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, "users", uid, "links", link.id));
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting document: ", error);
      alert("링크 삭제 중 오류가 발생했습니다.");
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelEditing = () => {
    reset({ title: link.title, url: link.url }); // 원래 값으로 되돌리기
    setIsEditing(false);
  };

  // 수정(인라인 편집) 모드 렌더링
  if (isEditing) {
    return (
      <form onSubmit={handleSubmit(onEditSubmit)} className="w-full brutal-border brutal-shadow bg-card p-4 md:p-5 flex flex-col gap-4">
        <div className="grid gap-2">
          <Label htmlFor={`edit-title-${link.id}`} className="font-bold">링크 제목</Label>
          <Input 
            id={`edit-title-${link.id}`}
            placeholder="예: 내 인스타그램" 
            className={`brutal-border rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-primary ${errors.title ? "border-destructive text-destructive" : ""}`}
            {...register("title")}
          />
          {errors.title && <span className="text-destructive font-bold text-sm">{errors.title.message}</span>}
        </div>
        <div className="grid gap-2">
          <Label htmlFor={`edit-url-${link.id}`} className="font-bold">URL (웹 주소)</Label>
          <Input 
            id={`edit-url-${link.id}`}
            placeholder="https://example.com" 
            className={`brutal-border rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-primary ${errors.url ? "border-destructive text-destructive" : ""}`}
            {...register("url")}
          />
          {errors.url && <span className="text-destructive font-bold text-sm">{errors.url.message}</span>}
        </div>
        <div className="flex gap-2 justify-end mt-2">
          <Button type="button" variant="outline" className="brutal-border rounded-none hover:bg-secondary font-bold" onClick={cancelEditing}>
            <X className="mr-2 h-4 w-4" /> 취소
          </Button>
          <Button disabled={isSubmitting} type="submit" className="brutal-border bg-primary text-primary-foreground rounded-none font-bold">
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            저장
          </Button>
        </div>
      </form>
    );
  }

  // 기본 렌더링 (보기 모드)
  return (
    <div className="brutal-border brutal-shadow bg-card transition-all p-3 md:p-4 flex items-center gap-3 md:gap-4 w-full relative group">
      
      {/* Link Clickable Area (좌측 영역 넓게) */}
      <a 
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 flex items-center gap-3 md:gap-4 no-underline min-w-0"
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
        <span className="text-xl md:text-2xl font-bold truncate">{link.title}</span>
      </a>
      
      {/* Action Buttons (직사각형 내부에 배치) */}
      <div className="flex gap-2 shrink-0">
        <Button 
          onClick={(e) => {
            e.preventDefault();
            setIsEditing(true);
          }}
          variant="outline" 
          className="brutal-border brutal-shadow h-10 w-10 p-0 rounded-none bg-background hover:bg-secondary hover:text-secondary-foreground transition-all"
          title="수정"
        >
          <Pencil className="h-5 w-5" />
          <span className="sr-only">수정</span>
        </Button>

        <Button 
          onClick={(e) => {
            e.preventDefault();
            setIsDeleteDialogOpen(true);
          }}
          variant="outline" 
          className="brutal-border brutal-shadow h-10 w-10 p-0 rounded-none bg-background hover:bg-destructive hover:text-destructive-foreground transition-all"
          title="삭제"
        >
          <Trash2 className="h-5 w-5" />
          <span className="sr-only">삭제</span>
        </Button>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="brutal-border brutal-shadow bg-card rounded-none sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black uppercase tracking-tight">정말 삭제하시겠습니까?</DialogTitle>
          </DialogHeader>
          <div className="py-4 flex flex-col gap-4">
            <div className="brutal-border bg-secondary p-3 text-lg font-bold truncate">
              {link.title}
            </div>
            <p className="text-destructive font-black text-lg animate-pulse">
              이 작업은 되돌릴 수 없습니다.
            </p>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" className="brutal-border brutal-shadow rounded-none text-lg font-bold h-12 bg-card hover:bg-secondary" onClick={() => setIsDeleteDialogOpen(false)}>
              취소
            </Button>
            <Button disabled={isDeleting} type="button" variant="destructive" className="brutal-border brutal-shadow rounded-none text-lg font-bold h-12 bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={handleDelete}>
              {isDeleting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Trash2 className="mr-2 h-5 w-5" />}
              삭제하기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
