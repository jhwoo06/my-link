"use client";

import { useState } from "react";
import { toast } from "sonner";
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
import { useLinks } from "@/hooks/useLinks";

interface LinkCardProps {
  link: LinkItem;
  uid: string;
}

export function LinkCard({ link, uid }: LinkCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const { updateLink, deleteLink, isUpdating, isDeleting } = useLinks(uid);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LinkFormValues>({
    resolver: zodResolver(linkSchema),
    defaultValues: {
      title: link.title,
      url: link.url,
    },
  });

  const onEditSubmit = async (data: LinkFormValues) => {
    try {
      await updateLink({ linkId: link.id, title: data.title, url: data.url });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating link: ", error);
      toast.error("링크 수정 중 오류가 발생했습니다.");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteLink(link.id);
      setIsDeleteDialogOpen(false);
      toast.success("링크가 삭제되었습니다.");
    } catch (error) {
      console.error("Error deleting link: ", error);
      toast.error("링크 삭제 중 오류가 발생했습니다.");
    }
  };

  const cancelEditing = () => {
    reset({ title: link.title, url: link.url }); // 원래 값으로 되돌리기
    setIsEditing(false);
  };

  // 수정(인라인 편집) 모드 렌더링
  if (isEditing) {
    return (
      <form onSubmit={handleSubmit(onEditSubmit)} className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col gap-4">
        <div className="grid gap-2">
          <Label htmlFor={`edit-title-${link.id}`} className="font-semibold text-gray-700 text-sm">링크 제목</Label>
          <Input 
            id={`edit-title-${link.id}`}
            placeholder="예: 내 인스타그램" 
            className={`rounded-md border-gray-200 h-11 focus-visible:ring-1 focus-visible:ring-primary shadow-sm ${errors.title ? "border-red-500 text-red-500" : ""}`}
            {...register("title")}
          />
          {errors.title && <span className="text-red-500 font-medium text-xs">{errors.title.message}</span>}
        </div>
        <div className="grid gap-2">
          <Label htmlFor={`edit-url-${link.id}`} className="font-semibold text-gray-700 text-sm">URL (웹 주소)</Label>
          <Input 
            id={`edit-url-${link.id}`}
            placeholder="https://example.com" 
            className={`rounded-md border-gray-200 h-11 focus-visible:ring-1 focus-visible:ring-primary shadow-sm ${errors.url ? "border-red-500 text-red-500" : ""}`}
            {...register("url")}
          />
          {errors.url && <span className="text-red-500 font-medium text-xs">{errors.url.message}</span>}
        </div>
        <div className="flex gap-2 justify-end mt-2">
          <Button type="button" variant="outline" className="rounded-md h-10 border-gray-200 text-gray-600 hover:bg-gray-50 font-medium" onClick={cancelEditing}>
            취소
          </Button>
          <Button disabled={isUpdating} type="submit" className="rounded-md h-10 bg-primary text-white hover:bg-primary/90 font-medium">
            {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            저장
          </Button>
        </div>
      </form>
    );
  }

  // 기본 렌더링 (보기 모드)
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md hover:-translate-y-0.5 p-3 md:p-4 flex items-center gap-3 md:gap-4 w-full relative group">
      
      {/* Link Clickable Area (좌측 영역 넓게) */}
      <a 
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 flex items-center gap-3 md:gap-4 no-underline min-w-0"
      >
        {/* Favicon */}
        {link.icon ? (
          <div className="h-12 w-12 rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-100 shrink-0">
            <img src={link.icon} alt={`${link.title} icon`} className="h-6 w-6 object-contain" />
          </div>
        ) : (
          <div className="h-12 w-12 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100 shrink-0 text-gray-400">
            <LinkIcon className="h-5 w-5" />
          </div>
        )}
        
        {/* Link Title */}
        <span className="text-lg font-bold text-gray-900 truncate">{link.title}</span>
      </a>
      
      {/* Action Buttons (직사각형 내부에 배치) */}
      <div className="flex gap-2 shrink-0">
        <Button 
          onClick={(e) => {
            e.preventDefault();
            setIsEditing(true);
          }}
          variant="ghost" 
          className="h-10 w-10 p-0 rounded-md text-gray-400 hover:text-primary hover:bg-primary/5 transition-all"
          title="수정"
        >
          <Pencil className="h-4 w-4" />
          <span className="sr-only">수정</span>
        </Button>

        <Button 
          onClick={(e) => {
            e.preventDefault();
            setIsDeleteDialogOpen(true);
          }}
          variant="ghost" 
          className="h-10 w-10 p-0 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
          title="삭제"
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">삭제</span>
        </Button>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-white rounded-xl shadow-xl border border-gray-100 sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold tracking-tight text-gray-900">링크 삭제</DialogTitle>
          </DialogHeader>
          <div className="py-4 flex flex-col gap-4">
            <div className="bg-gray-50 border border-gray-100 p-3 rounded-md text-base font-medium text-gray-700 truncate">
              {link.title}
            </div>
            <p className="text-gray-500 text-sm">
              이 작업은 되돌릴 수 없으며 링크가 영구적으로 삭제됩니다. 계속하시겠습니까?
            </p>
          </div>
          <DialogFooter className="mt-2">
            <Button type="button" variant="outline" className="rounded-md text-sm font-medium h-10 border-gray-200 text-gray-600 hover:bg-gray-50" onClick={() => setIsDeleteDialogOpen(false)}>
              취소
            </Button>
            <Button disabled={isDeleting} type="button" variant="destructive" className="rounded-md text-sm font-medium h-10 bg-red-600 text-white hover:bg-red-700" onClick={handleDelete}>
              {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
              삭제하기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
