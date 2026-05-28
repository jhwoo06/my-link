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
import { Share, Pencil, Plus, Loader2, Save, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { db, auth } from "@/lib/firebase";
import { collection, onSnapshot, addDoc, query, orderBy, serverTimestamp, getDoc, setDoc, updateDoc, doc } from "firebase/firestore";
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut, User } from "firebase/auth";
import { linkSchema, LinkFormValues } from "@/lib/schemas";
import { LinkCard } from "@/components/link-card";

export default function MyLinkProfile() {
  // 인증 상태
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // 프로필 상태
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [isProfileLoading, setIsProfileLoading] = useState(true);

  // 프로필 편집 상태
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [editUsernameText, setEditUsernameText] = useState("");
  const [isSavingUsername, setIsSavingUsername] = useState(false);

  const [isEditingBio, setIsEditingBio] = useState(false);
  const [editBioText, setEditBioText] = useState("");
  const [isSavingBio, setIsSavingBio] = useState(false);
  
  // 링크 상태
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // 모달 상태 관리
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // 인증 상태 리스너
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 로그인 핸들러
  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed:", error);
      alert("로그인 중 오류가 발생했습니다.");
    }
  };

  // 로그아웃 핸들러
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Firestore 데이터베이스 연동 (Profile Read - 단회성 갱신형)
  useEffect(() => {
    if (!user) {
      setUsername("");
      setBio("");
      setLinks([]);
      return;
    }

    const fetchProfile = async () => {
      setIsProfileLoading(true);
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setUsername(data.username || user.displayName || "이름 없음");
          setBio(data.bio || "환영합니다! 소개글을 입력해 보세요.");
        } else {
          // 문서가 없으면 초기값 세팅
          await setDoc(docRef, {
            username: user.displayName || "이름 없음",
            bio: "환영합니다! 소개글을 입력해 보세요."
          });
          setUsername(user.displayName || "이름 없음");
          setBio("환영합니다! 소개글을 입력해 보세요.");
        }
      } catch (error) {
        console.error("Error fetching profile: ", error);
        setUsername(user.displayName || "이름 없음");
        setBio("환영합니다! 소개글을 입력해 보세요.");
      } finally {
        setIsProfileLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  // Firestore 실시간 데이터베이스 연동 (Links Read)
  useEffect(() => {
    if (!user) return;

    setIsLoading(true);
    const q = query(
      collection(db, "users", user.uid, "links"), 
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const linksData: LinkItem[] = [];
      snapshot.forEach((doc) => {
        linksData.push({ id: doc.id, ...doc.data() } as LinkItem);
      });
      setLinks(linksData);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching links: ", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

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
    if (!user) return;
    const urlObj = new URL(data.url.startsWith('http') ? data.url : `https://${data.url}`);
    const domain = urlObj.hostname;
    const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    
    try {
      await addDoc(collection(db, "users", user.uid, "links"), {
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

  // 프로필 수정 로직 (Update - Firestore)
  const handleSaveUsername = async () => {
    if (!editUsernameText.trim() || !user) return;
    setIsSavingUsername(true);
    try {
      await updateDoc(doc(db, "users", user.uid), {
        username: editUsernameText
      });
      setUsername(editUsernameText);
      setIsEditingUsername(false);
    } catch (error) {
      console.error("Error updating username: ", error);
      alert("이름 수정 중 오류가 발생했습니다.");
    } finally {
      setIsSavingUsername(false);
    }
  };

  const handleSaveBio = async () => {
    if (!editBioText.trim() || !user) return;
    setIsSavingBio(true);
    try {
      await updateDoc(doc(db, "users", user.uid), {
        bio: editBioText
      });
      setBio(editBioText);
      setIsEditingBio(false);
    } catch (error) {
      console.error("Error updating bio: ", error);
      alert("소개글 수정 중 오류가 발생했습니다.");
    } finally {
      setIsSavingBio(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-foreground pb-20">
      
      {/* Header Area */}
      <header className="w-full flex justify-between items-center bg-card brutal-border-b border-b-4 border-foreground px-4 md:px-8 py-3 sticky top-0 z-50">
        <div className="font-black text-2xl tracking-tighter cursor-pointer" onClick={() => window.scrollTo(0,0)}>
          MY LINK
        </div>
        <div className="flex items-center gap-4">
          {isAuthLoading ? (
            <Loader2 className="animate-spin h-6 w-6" />
          ) : user ? (
            <>
              <span className="font-bold hidden md:inline-block bg-primary text-primary-foreground brutal-border px-3 py-1 mr-2">{user.displayName || "유저"}님</span>
              <Button onClick={handleLogout} variant="outline" className="brutal-border brutal-shadow rounded-none font-bold bg-background hover:bg-secondary">
                로그아웃
              </Button>
            </>
          ) : (
            <Button onClick={handleLogin} className="brutal-border brutal-shadow rounded-none font-bold bg-primary text-primary-foreground hover:bg-primary/90">
              Google로 로그인
            </Button>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-2xl mx-auto px-4 py-8 flex flex-col items-center gap-10">
        
        {isAuthLoading ? (
          <div className="w-full flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="h-10 w-10 animate-spin" />
            <p className="font-black text-lg">인증 정보 확인 중...</p>
          </div>
        ) : !user ? (
          // Landing View (Logged Out)
          <section className="w-full flex flex-col items-center gap-6 text-center py-20 brutal-border bg-card p-6 md:p-10 brutal-shadow mt-4 md:mt-10">
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-4 leading-tight">
              나만의 <span className="bg-primary px-2">멀티링크</span>를<br/>만들어보세요!
            </h1>
            <p className="text-lg md:text-xl font-bold mb-8">
              모든 링크를 하나의 페이지로 모아<br className="md:hidden" /> 쉽게 공유할 수 있습니다.
            </p>
            <Button onClick={handleLogin} className="brutal-border brutal-shadow h-16 px-8 text-xl md:text-2xl font-black bg-primary text-primary-foreground hover:bg-primary/90 rounded-none w-full md:w-auto">
              지금 시작하기 (Google 연동)
            </Button>
          </section>
        ) : (
          // My Page View (Logged In)
          <>
            {/* Share Button (My Page only) */}
            <div className="w-full flex justify-end">
              <Button variant="outline" className="brutal-border brutal-shadow bg-card hover:bg-primary/50 rounded-none h-12 w-12 p-0">
                <Share className="h-5 w-5" />
                <span className="sr-only">공유하기</span>
              </Button>
            </div>

            {/* Profile Section */}
            <section className="flex flex-col items-center gap-6 text-center w-full -mt-6">
              {/* Username (Editable) */}
              {isEditingUsername ? (
                <div className="flex gap-2 items-center w-full max-w-sm mt-2">
                  <Input 
                    value={editUsernameText}
                    onChange={(e) => setEditUsernameText(e.target.value)}
                    className="brutal-border rounded-none h-14 text-2xl font-black text-center focus-visible:ring-0 focus-visible:border-primary"
                    placeholder="이름 입력"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveUsername();
                      if (e.key === 'Escape') setIsEditingUsername(false);
                    }}
                  />
                  <Button disabled={isSavingUsername} onClick={handleSaveUsername} className="brutal-border brutal-shadow rounded-none h-14 w-14 bg-primary text-primary-foreground p-0 shrink-0 hover:bg-primary/90">
                    {isSavingUsername ? <Loader2 className="h-6 w-6 animate-spin" /> : <Save className="h-6 w-6" />}
                  </Button>
                  <Button disabled={isSavingUsername} onClick={() => setIsEditingUsername(false)} variant="outline" className="brutal-border brutal-shadow rounded-none h-14 w-14 p-0 shrink-0 bg-card hover:bg-secondary">
                    <X className="h-6 w-6" />
                  </Button>
                </div>
              ) : (
                <div 
                  onClick={() => {
                    if(isProfileLoading) return;
                    setEditUsernameText(username);
                    setIsEditingUsername(true);
                  }}
                  className="group relative cursor-pointer border-b-4 border-transparent hover:border-foreground border-dashed pb-1 transition-all mt-2"
                >
                  {isProfileLoading ? (
                    <div className="h-12 w-48 bg-muted animate-pulse"></div>
                  ) : (
                    <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight">{username}</h1>
                  )}
                  <Pencil className="absolute -right-8 top-1 md:top-2 h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity text-foreground" />
                </div>
              )}

              {/* Bio (Editable) */}
              {isEditingBio ? (
                <div className="flex flex-col gap-2 w-full max-w-md mt-2">
                  <textarea 
                    value={editBioText}
                    onChange={(e) => setEditBioText(e.target.value)}
                    className="flex min-h-[100px] w-full px-4 py-3 text-lg font-medium brutal-border focus-visible:outline-none focus-visible:border-primary resize-none"
                    placeholder="간단한 소개글을 입력하세요"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') setIsEditingBio(false);
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSaveBio();
                      }
                    }}
                  />
                  <div className="flex justify-end gap-2">
                    <Button disabled={isSavingBio} onClick={() => setIsEditingBio(false)} variant="outline" className="brutal-border brutal-shadow rounded-none font-bold bg-card hover:bg-secondary">
                      <X className="h-4 w-4 mr-2" /> 취소
                    </Button>
                    <Button disabled={isSavingBio} onClick={handleSaveBio} className="brutal-border brutal-shadow rounded-none font-bold bg-primary text-primary-foreground hover:bg-primary/90">
                      {isSavingBio ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                      저장
                    </Button>
                  </div>
                </div>
              ) : (
                <div 
                  onClick={() => {
                    if(isProfileLoading) return;
                    setEditBioText(bio);
                    setIsEditingBio(true);
                  }}
                  className="group relative cursor-pointer border-2 border-transparent hover:border-foreground border-dashed p-4 w-full max-w-md transition-all mt-2"
                >
                  {isProfileLoading ? (
                    <div className="h-8 w-full bg-muted animate-pulse"></div>
                  ) : (
                    <p className="text-lg md:text-xl font-medium whitespace-pre-wrap">{bio}</p>
                  )}
                  <Pencil className="absolute -right-4 -top-4 h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity bg-primary text-foreground brutal-border p-1" />
                </div>
              )}
            </section>

            {/* Links Section */}
            <section className="w-full flex flex-col gap-6 mt-8">
              
              {/* Add Link Button */}
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
                
                {/* Dialog Content */}
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
                        {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Plus className="mr-2 h-5 w-5" />}
                        추가하기
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
                  <LinkCard key={link.id} link={link} uid={user.uid} />
                ))
              )}
            </section>
          </>
        )}

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
