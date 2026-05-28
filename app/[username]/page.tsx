import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { notFound } from "next/navigation";
import { LinkItem } from "@/data/links";
import { PublicLinkCard } from "@/components/public-link-card";

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
    const data = docSnap.data();
    linksData.push({ 
      id: docSnap.id, 
      title: data.title,
      url: data.url,
      icon: data.icon,
      clicks: data.clicks || 0
    });
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
              <PublicLinkCard key={link.id} link={link} userId={userId} />
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
