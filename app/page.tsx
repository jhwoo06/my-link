"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { Share, Plus, Loader2, ExternalLink, Copy, LogOut, BarChart2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { db, auth } from "@/lib/firebase";
import { collection, query, getDocs, where } from "firebase/firestore";
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut, User } from "firebase/auth";
import { linkSchema, LinkFormValues } from "@/lib/schemas";
import { LinkCard } from "@/components/link-card";
import { useProfile } from "@/hooks/useProfile";
import { useLinks } from "@/hooks/useLinks";

export default function MyLinkProfile() {
  const router = useRouter();
  
  // 인증 상태
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // TanStack Query 훅 사용
  const { profile, isLoading: isProfileLoading, updateProfile, isUpdating: isSavingProfile } = useProfile(
    user?.uid, 
    user?.email, 
    user?.displayName
  );
  const { links, isLoading: isLinksLoading, addLink, isAdding: isAddingLink } = useLinks(user?.uid);

  // 프로필 편집 모달 상태
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [editDisplayName, setEditDisplayName] = useState("");
  const [editUsername, setEditUsername] = useState("");
  const [editBio, setEditBio] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  
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
      toast.error("로그인 중 오류가 발생했습니다.");
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

  // 링크 추가 로직 (TanStack Query Mutation)
  const onSubmit = async (data: LinkFormValues) => {
    if (!user) return;
    try {
      await addLink({ title: data.title, url: data.url });
      
      // 모달 닫기 및 폼 초기화
      reset();
      setIsDialogOpen(false);
      toast.success("링크가 추가되었습니다.");
    } catch (error) {
      console.error("Error adding link: ", error);
      toast.error("링크 추가 중 오류가 발생했습니다.");
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      reset(); // 모달이 닫힐 때 폼 입력값 초기화
    }
  };

  // 프로필 수정 모달 핸들러
  const handleOpenProfileDialog = () => {
    setEditDisplayName(profile?.displayName || "");
    setEditUsername(profile?.username || "");
    setEditBio(profile?.bio || "");
    setUsernameAvailable(null); // 중복 확인 초기화
    setIsProfileDialogOpen(true);
  };

  const handleCheckUsername = async () => {
    if (!editUsername.trim() || !user) return;
    
    // 기존 아이디와 동일하면 바로 통과
    if (editUsername === profile?.username) {
      setUsernameAvailable(true);
      toast.success("기존과 동일한 ID입니다.");
      return;
    }
    
    // 영문/숫자/언더바/하이픈 정규식 확인
    const isValid = /^[a-zA-Z0-9_-]+$/.test(editUsername);
    if (!isValid) {
      toast.error("고유 ID는 영문, 숫자, 하이픈(-), 언더바(_)만 사용 가능합니다.");
      setUsernameAvailable(false);
      return;
    }

    setIsCheckingUsername(true);
    try {
      const q = query(collection(db, "users"), where("username", "==", editUsername));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        setUsernameAvailable(false);
        toast.error("이미 사용 중인 ID입니다.");
      } else {
        setUsernameAvailable(true);
        toast.success("사용 가능한 ID입니다!");
      }
    } catch (error) {
      console.error("Error checking username: ", error);
      toast.error("중복 확인 중 오류가 발생했습니다.");
    } finally {
      setIsCheckingUsername(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!editDisplayName.trim() || !editUsername.trim() || !user) {
      toast.error("이름과 고유 ID는 필수입니다.");
      return;
    }
    
    if (editUsername !== profile?.username && usernameAvailable !== true) {
      toast.error("고유 ID 중복 확인을 진행해주세요.");
      return;
    }
    if (editDisplayName === profile?.displayName && editUsername === profile?.username && editBio === profile?.bio) {
      setIsProfileDialogOpen(false);
      return;
    }
    
    try {
      await updateProfile({
        displayName: editDisplayName,
        username: editUsername,
        bio: editBio
      });
      setIsProfileDialogOpen(false);
      toast.success("프로필이 성공적으로 저장되었습니다.");
    } catch (error) {
      console.error("Error updating profile: ", error);
      toast.error("프로필 저장 중 오류가 발생했습니다.");
    }
  };

  // 링크 복사 핸들러
  const handleCopyLink = () => {
    if (!profile?.username) return;
    const url = `${window.location.origin}/@${profile.username}`;
    navigator.clipboard.writeText(url).then(() => {
      toast.success("내 페이지 링크가 클립보드에 복사되었습니다.");
    }).catch((err) => {
      console.error("Failed to copy URL: ", err);
      toast.error("링크 복사에 실패했습니다.");
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-white pb-20">
      
      {/* Header Area */}
      <header className="w-full flex justify-between items-center bg-white px-6 md:px-10 py-4 sticky top-0 z-50">
        <Link href="/" className="font-bold text-xl tracking-tight cursor-pointer text-primary hover:opacity-80 transition-opacity">
          MyLink
        </Link>
        <div className="flex items-center gap-4">
          {isAuthLoading ? (
            <Loader2 className="animate-spin h-5 w-5 text-gray-400" />
          ) : user ? (
            <>
              {profile?.username && (
                <Button 
                  className="hidden sm:flex items-center gap-2 h-9 px-4 rounded-full text-sm font-medium shadow-sm hover:opacity-90 transition-opacity"
                  onClick={() => window.open(`/@${profile.username}`, '_blank')}
                >
                  <ExternalLink className="h-4 w-4" />
                  내 페이지
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 cursor-pointer hover:opacity-80 transition-opacity">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="profile" className="w-9 h-9 rounded-full border border-gray-100 shadow-sm" />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                      {profile?.displayName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-white rounded-xl shadow-lg border border-gray-100 p-1">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="flex flex-col gap-1 p-2">
                      <span className="text-sm font-bold text-gray-900 truncate">{profile?.displayName || "사용자"}</span>
                      <span className="text-xs font-medium text-gray-500 truncate">{user.email}</span>
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator className="bg-gray-100" />
                  <DropdownMenuItem className="cursor-pointer font-medium text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus:bg-gray-50 focus:text-gray-900 p-2 rounded-md transition-colors" onClick={() => router.push('/stats')}>
                    <BarChart2 className="mr-2 h-4 w-4" />
                    <span>통계 보기</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer font-medium text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus:bg-gray-50 focus:text-gray-900 p-2 rounded-md transition-colors" onClick={handleCopyLink}>
                    <Copy className="mr-2 h-4 w-4" />
                    <span>내 링크 복사</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-100" />
                  <DropdownMenuItem className="cursor-pointer font-medium text-sm text-red-600 hover:bg-red-50 hover:text-red-700 focus:bg-red-50 focus:text-red-700 p-2 rounded-md transition-colors" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>로그아웃</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
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
                  <span className="text-gray-400 text-3xl font-bold">{profile?.displayName?.charAt(0)?.toUpperCase() || 'U'}</span>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex flex-col items-center mt-2">
                <div className="flex items-center gap-2">
                  {isProfileLoading ? (
                    <div className="h-8 w-32 bg-gray-100 animate-pulse rounded-md"></div>
                  ) : (
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">{profile?.displayName}</h1>
                  )}
                </div>
                {/* Handle (@username) */}
                {!isProfileLoading && profile?.username && (
                  <p className="text-sm font-medium text-gray-400 mt-1">@{profile?.username}</p>
                )}
              </div>

              {/* Bio */}
              <div className="px-4 w-full max-w-sm mt-2 flex justify-center">
                {isProfileLoading ? (
                  <div className="h-4 w-48 bg-gray-100 animate-pulse rounded-md"></div>
                ) : (
                  <p className="text-sm font-medium text-gray-500 whitespace-pre-wrap">{profile?.bio}</p>
                )}
              </div>

              {/* Edit Profile Button & Dialog */}
              {!isProfileLoading && (
                <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
                  <Button variant="outline" className="mt-3 rounded-full px-5 h-9 shadow-sm border-gray-200 font-medium text-xs text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors" onClick={handleOpenProfileDialog}>
                    프로필 편집
                  </Button>
                  <DialogContent className="bg-white rounded-xl shadow-xl border border-gray-100 sm:max-w-[420px]">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-bold tracking-tight text-center text-gray-900">프로필 수정</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-5 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="editDisplayName" className="text-sm font-bold text-gray-700">표시 이름 (Display Name)</Label>
                        <Input 
                          id="editDisplayName" 
                          value={editDisplayName}
                          onChange={(e) => setEditDisplayName(e.target.value)}
                          placeholder="화면에 표시될 이름을 입력하세요" 
                          className="rounded-md h-12 text-base border-gray-200 focus-visible:ring-1 focus-visible:ring-primary shadow-sm"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="editUsername" className="text-sm font-bold text-gray-700">고유 ID (Username)</Label>
                        <div className="flex gap-2">
                          <Input 
                            id="editUsername" 
                            value={editUsername}
                            onChange={(e) => {
                              setEditUsername(e.target.value.toLowerCase());
                              setUsernameAvailable(null); // 수정 시 다시 확인 필요
                            }}
                            placeholder="영문 소문자, 숫자, 하이픈, 언더바" 
                            className="rounded-md h-12 text-base border-gray-200 focus-visible:ring-1 focus-visible:ring-primary shadow-sm flex-1"
                          />
                          <Button 
                            type="button" 
                            variant="secondary" 
                            onClick={handleCheckUsername} 
                            disabled={isCheckingUsername || editUsername.trim() === ""}
                            className="h-12 px-4 rounded-md font-bold text-sm shrink-0 bg-gray-100 text-gray-700 hover:bg-gray-200"
                          >
                            {isCheckingUsername ? <Loader2 className="h-4 w-4 animate-spin" /> : "중복 확인"}
                          </Button>
                        </div>
                        {usernameAvailable === true && <p className="text-xs text-green-600 font-medium ml-1">사용 가능한 ID입니다.</p>}
                        {usernameAvailable === false && <p className="text-xs text-red-500 font-medium ml-1">이미 사용 중이거나 규칙에 어긋난 ID입니다.</p>}
                        <p className="text-xs text-gray-400 ml-1">내 페이지 접속 주소로 사용됩니다. (예: /@{editUsername || 'id'})</p>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="editBio" className="text-sm font-bold text-gray-700">소개글</Label>
                        <textarea 
                          id="editBio" 
                          value={editBio}
                          onChange={(e) => setEditBio(e.target.value)}
                          className="flex min-h-[80px] w-full px-4 py-3 text-base font-medium rounded-md border border-gray-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary resize-none shadow-sm"
                          placeholder="자신을 소개하는 짧은 문장을 적어보세요."
                        />
                      </div>
                    </div>
                    <DialogFooter className="mt-2 flex-col sm:flex-row gap-2 sm:space-x-2">
                      <Button type="button" variant="outline" className="rounded-md text-base font-semibold h-12 border-gray-200 text-gray-600 hover:bg-gray-50 flex-1" onClick={() => setIsProfileDialogOpen(false)}>
                        취소
                      </Button>
                      <Button onClick={handleSaveProfile} disabled={isSavingProfile} className="bg-primary text-white rounded-md text-base font-semibold h-12 hover:bg-primary/90 flex-1 m-0">
                        {isSavingProfile ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
                        저장하기
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </section>

            {/* Links Section */}
            <section className="w-full flex flex-col gap-4 mt-8 px-2">
              
              {/* Add Link Button */}
              <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
                <Button 
                  onClick={() => setIsDialogOpen(true)}
                  className="w-full h-14 bg-primary hover:bg-primary/90 text-white text-base font-semibold rounded-lg shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 mb-2"
                >
                  <Plus className="mr-2 h-5 w-5" strokeWidth={2.5} />
                  새로운 링크 추가하기
                </Button>
                
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
                    <DialogFooter className="mt-2 flex-col sm:flex-row gap-2 sm:space-x-2">
                      <Button type="button" variant="outline" className="rounded-md text-base font-semibold h-12 border-gray-200 text-gray-600 hover:bg-gray-50 flex-1" onClick={() => handleOpenChange(false)}>
                        취소
                      </Button>
                      <Button disabled={isAddingLink} type="submit" className="bg-primary text-white rounded-md text-base font-semibold h-12 hover:bg-primary/90 flex-1 m-0">
                        {isAddingLink ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
                        추가하기
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

              {/* Links List */}
              {isLinksLoading ? (
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
