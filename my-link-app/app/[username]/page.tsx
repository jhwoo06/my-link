import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { notFound } from "next/navigation";
import { LinkItem } from "@/data/links";

export default async function PublicProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const decodedUsername = decodeURIComponent(username).replace('@', '');

  // 1. 유저 검색
  const q = query(collection(db, "users"), where("username", "==", decodedUsername));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    notFound();
  }

  const userDoc = querySnapshot.docs[0];
  const userData = userDoc.data();
  const userId = userDoc.id;

  // 2. 링크 검색
  const linksQuery = query(
    collection(db, "users", userId, "links"),
    orderBy("createdAt", "desc")
  );
  const linksSnapshot = await getDocs(linksQuery);
  const linksData: LinkItem[] = [];
  linksSnapshot.forEach((docSnap) => {
    linksData.push({ id: docSnap.id, ...docSnap.data() } as LinkItem);
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-20 px-4 font-sans selection:bg-primary selection:text-white">
      <div className="w-full max-w-md flex flex-col items-center gap-6">
        
        {/* Profile Info */}
        <div className="flex flex-col items-center text-center gap-4 w-full">
          <div className="w-24 h-24 rounded-full bg-white border-4 border-white shadow-md overflow-hidden flex items-center justify-center">
            {userData.photoURL ? (
              <img src={userData.photoURL} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-400 text-3xl font-bold">{userData.displayName?.charAt(0)?.toUpperCase() || 'U'}</span>
            )}
          </div>
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">{userData.displayName}</h1>
            <p className="text-sm font-medium text-gray-500 mt-2 whitespace-pre-wrap px-4 text-center leading-relaxed">
              {userData.bio}
            </p>
          </div>
        </div>

        {/* Links List */}
        <div className="w-full flex flex-col gap-4 mt-4">
          {linksData.length === 0 ? (
            <div className="text-center py-10 text-gray-400 font-medium text-sm">
              아직 등록된 링크가 없습니다.
            </div>
          ) : (
            linksData.map((link) => (
              <a 
                key={link.id} 
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
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
            ))
          )}
        </div>

        {/* Branding Footer */}
        <a href="/" className="mt-12 text-sm font-bold text-gray-300 hover:text-gray-400 transition-colors">
          Powered by MyLink
        </a>
      </div>
    </div>
  );
}
