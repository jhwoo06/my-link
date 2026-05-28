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
          setUsername(data.username || (user.email ? user.email.split('@')[0] : (user.displayName || "이름 없음")));
          setBio(data.bio || "한 줄 소개를 입력해주세요.");
        } else {
          // 문서가 없으면 초기값 세팅 (최초 로그인 시 이메일 닉네임 설정)
          const initialUsername = user.email ? user.email.split('@')[0] : (user.displayName || "이름 없음");
          await setDoc(docRef, {
            username: initialUsername,
            bio: "한 줄 소개를 입력해주세요."
          });
          setUsername(initialUsername);
          setBio("한 줄 소개를 입력해주세요.");
        }
      } catch (error) {
        console.error("Error fetching profile: ", error);
        const fallbackUsername = user.email ? user.email.split('@')[0] : (user.displayName || "이름 없음");
        setUsername(fallbackUsername);
        setBio("한 줄 소개를 입력해주세요.");
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
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-white pb-20">
      
      {/* Header Area */}
      <header className="w-full flex justify-between items-center bg-white px-6 md:px-10 py-4 sticky top-0 z-50">
        <div className="font-bold text-xl tracking-tight cursor-pointer text-primary" onClick={() => window.scrollTo(0,0)}>
          MyLink
        </div>
        <div className="flex items-center gap-4">
          {isAuthLoading ? (
            <Loader2 className="animate-spin h-5 w-5 text-gray-400" />
          ) : user ? (
            <div className="flex items-center gap-3">
              <Button onClick={handleLogout} variant="ghost" className="text-sm font-medium text-gray-500 hover:text-gray-900 rounded-md">
                로그아웃
              </Button>
              {user.photoURL ? (
                <img src={user.photoURL} alt="profile" className="w-9 h-9 rounded-full border border-gray-100 shadow-sm" />
              ) : (
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                  {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
            </div>
          ) : (
            <Button onClick={handleLogin} className="rounded-md font-medium bg-primary text-white shadow-sm hover:bg-primary/90 px-6 h-10">
              로그인
            </Button>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-2xl mx-auto px-4 py-12 flex flex-col items-center gap-10">
        
        {isAuthLoading ? (
          <div className="w-full flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="font-medium text-gray-400 text-sm">로딩 중...</p>
          </div>
        ) : !user ? (
          // Landing View (Logged Out)
          <section className="w-full flex flex-col items-center gap-6 text-center py-16 md:py-24 mt-4 md:mt-6">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 leading-tight text-gray-900">
              Development in <span className="text-primary">One<br/>Link.</span>
            </h1>
            <p className="text-base md:text-lg font-medium text-gray-500 mb-8 max-w-md">
              GitHub, 블로그, 포트폴리오까지.<br/>개발자를 위한 모든 링크를 한 페이지에 담아보세요.
            </p>
            <Button onClick={handleLogin} className="h-14 px-8 text-lg font-bold bg-primary text-white hover:bg-primary/90 rounded-md w-full md:w-auto shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-3">
              <span className="font-black text-xl">G</span> Google로 시작하기
            </Button>
            
            {/* Simple Mockup UI */}
            <div className="mt-16 w-full max-w-sm bg-white p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 flex flex-col gap-4 mx-auto">
               <div className="flex items-center gap-3 mb-2">
                 <div className="w-10 h-10 rounded-full bg-gray-100"></div>
                 <div className="w-24 h-4 rounded-md bg-gray-100"></div>
               </div>
               <div className="w-full h-12 bg-blue-50/50 rounded-xl flex items-center px-4 gap-3">
                 <div className="w-6 h-6 rounded-full bg-blue-200"></div>
                 <div className="w-32 h-3 rounded-md bg-blue-100"></div>
               </div>
               <div className="w-full h-12 bg-gray-50 rounded-xl flex items-center px-4 gap-3">
                 <div className="w-6 h-6 rounded-full bg-gray-200"></div>
                 <div className="w-40 h-3 rounded-md bg-gray-200"></div>
               </div>
            </div>
          </section>
        ) : (
          // My Page View (Logged In)
          <>
            {/* Share Button (My Page only) */}
            <div className="w-full flex justify-end px-2">
              <Button variant="ghost" className="rounded-full h-10 w-10 p-0 text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors">
                <Share className="h-4 w-4" />
                <span className="sr-only">공유하기</span>
              </Button>
            </div>

            {/* Profile Section */}
            <section className="flex flex-col items-center gap-4 text-center w-full -mt-6">
              {/* Avatar */}
              <div className="w-24 h-24 rounded-full bg-gray-100 border-4 border-white shadow-sm overflow-hidden flex items-center justify-center mb-1">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-gray-400 text-3xl font-bold">{username.charAt(0).toUpperCase()}</span>
                )}
              </div>

              {/* Username (Editable) */}
              {isEditingUsername ? (
                <div className="flex gap-2 items-center w-full max-w-sm">
                  <Input 
                    value={editUsernameText}
                    onChange={(e) => setEditUsernameText(e.target.value)}
                    className="rounded-md h-12 text-xl font-bold text-center focus-visible:ring-1 focus-visible:ring-primary border-gray-200 shadow-sm"
                    placeholder="이름 입력"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveUsername();
                      if (e.key === 'Escape') setIsEditingUsername(false);
                    }}
                  />
                  <Button disabled={isSavingUsername} onClick={handleSaveUsername} className="rounded-md h-12 w-12 bg-primary text-white p-0 shrink-0 hover:bg-primary/90 shadow-sm">
                    {isSavingUsername ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                  </Button>
                  <Button disabled={isSavingUsername} onClick={() => setIsEditingUsername(false)} variant="outline" className="rounded-md h-12 w-12 p-0 shrink-0 bg-white border-gray-200 text-gray-500 hover:bg-gray-50 shadow-sm">
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div 
                    onClick={() => {
                      if(isProfileLoading) return;
                      setEditUsernameText(username);
                      setIsEditingUsername(true);
                    }}
                    className="group relative cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isProfileLoading ? (
                      <div className="h-8 w-32 bg-gray-100 animate-pulse rounded-md"></div>
                    ) : (
                      <h1 className="text-2xl font-bold tracking-tight text-gray-900">{username}</h1>
                    )}
                    <Pencil className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 ml-1" />
                  </div>
                  {/* Handle (@username) */}
                  {!isProfileLoading && user.email && (
                    <p className="text-sm font-medium text-gray-400 mt-1">@{user.email.split('@')[0]}</p>
                  )}
                </div>
              )}

              {/* Bio (Editable) */}
              {isEditingBio ? (
                <div className="flex flex-col gap-2 w-full max-w-sm mt-3">
                  <textarea 
                    value={editBioText}
                    onChange={(e) => setEditBioText(e.target.value)}
                    className="flex min-h-[80px] w-full px-4 py-3 text-sm text-center font-medium rounded-md border border-gray-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary resize-none shadow-sm"
                    placeholder="한 줄 소개를 입력해주세요."
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
                    <Button disabled={isSavingBio} onClick={() => setIsEditingBio(false)} variant="outline" className="rounded-md h-9 px-4 text-sm font-medium text-gray-600 border-gray-200 shadow-sm">
                      취소
                    </Button>
                    <Button disabled={isSavingBio} onClick={handleSaveBio} className="rounded-md h-9 px-4 text-sm font-medium bg-primary text-white shadow-sm hover:bg-primary/90">
                      {isSavingBio ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
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
                  className="group relative cursor-pointer px-4 py-1 w-full max-w-sm mt-2 flex justify-center"
                >
                  {isProfileLoading ? (
                    <div className="h-4 w-48 bg-gray-100 animate-pulse rounded-md"></div>
                  ) : (
                    <p className="text-sm font-medium text-gray-500 whitespace-pre-wrap">{bio}</p>
                  )}
                  <Pencil className="absolute -right-1 top-1 h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400" />
                </div>
              )}
            </section>

            {/* Links Section */}
            <section className="w-full flex flex-col gap-4 mt-8 px-2">
              
              {/* Add Link Button */}
              <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
                <DialogTrigger render={
                  <Button 
                    className="w-full h-14 bg-primary hover:bg-primary/90 text-white text-base font-semibold rounded-lg shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 mb-2"
                  />
                }>
                    <Plus className="mr-2 h-5 w-5" strokeWidth={2.5} />
                    새로운 링크 추가하기
                </DialogTrigger>
                
                {/* Dialog Content */}
                <DialogContent className="bg-white rounded-xl shadow-xl border border-gray-100 sm:max-w-[400px]">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold tracking-tight text-center text-gray-900">새 링크 추가</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="title" className="text-sm font-bold text-gray-700">링크 제목</Label>
                      <Input 
                        id="title" 
                        placeholder="예: 내 인스타그램" 
                        className={`rounded-md h-12 text-base border-gray-200 focus-visible:ring-1 focus-visible:ring-primary shadow-sm ${errors.title ? "border-red-500 text-red-500 focus-visible:ring-red-500" : ""}`}
                        {...register("title")}
                      />
                      {errors.title && <span className="text-red-500 font-medium text-xs">{errors.title.message}</span>}
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="url" className="text-sm font-bold text-gray-700">URL (웹 주소)</Label>
                      <Input 
                        id="url" 
                        placeholder="https://example.com" 
                        className={`rounded-md h-12 text-base border-gray-200 focus-visible:ring-1 focus-visible:ring-primary shadow-sm ${errors.url ? "border-red-500 text-red-500 focus-visible:ring-red-500" : ""}`}
                        {...register("url")}
                      />
                      {errors.url && <span className="text-red-500 font-medium text-xs">{errors.url.message}</span>}
                    </div>
                    <DialogFooter className="mt-2">
                      <Button type="button" variant="outline" className="rounded-md text-base font-semibold h-12 border-gray-200 text-gray-600 hover:bg-gray-50 w-full" onClick={() => handleOpenChange(false)}>
                        취소
                      </Button>
                      <Button disabled={isSubmitting} type="submit" className="bg-primary text-white rounded-md text-base font-semibold h-12 hover:bg-primary/90 w-full mt-2 sm:mt-0">
                        {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
                        추가하기
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

              {/* Links List */}
              {isLoading ? (
                <div className="w-full flex flex-col items-center justify-center py-10 gap-3 text-gray-400">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <p className="font-medium text-sm">링크를 불러오는 중...</p>
                </div>
              ) : links.length === 0 ? (
                <div className="text-center py-12 text-gray-400 font-medium text-sm bg-gray-50/50 rounded-xl border border-gray-100 border-dashed">
                  등록된 링크가 없습니다.<br/>위 버튼을 눌러 첫 링크를 추가해 보세요!
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {links.map((link) => (
                    <LinkCard key={link.id} link={link} uid={user.uid} />
                  ))}
                </div>
              )}
            </section>
          </>
        )}

        {/* Footer */}
        <footer className="mt-12 text-xs font-medium text-gray-400 flex flex-col items-center gap-1 pb-10">
          <p>© 2026 MyLink. All rights reserved.</p>
        </footer>
        
      </main>
    </div>
  );
}
