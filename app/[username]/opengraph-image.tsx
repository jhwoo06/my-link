import { ImageResponse } from 'next/og';
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

// Route segment config
// 기본 Node.js 런타임을 사용하도록 edge 설정을 제거합니다. (Firebase 호환성 문제)

// Image metadata
export const alt = 'My Link Profile';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const decodedUsername = decodeURIComponent(username).replace('@', '');

  // 유저 정보 가져오기
  const q = query(collection(db, "users"), where("username", "==", decodedUsername));
  const querySnapshot = await getDocs(q);

  let displayName = decodedUsername;
  let bio = '나만의 링크 모음, 마이링크에서 확인하세요.';
  let photoURL = null;

  if (!querySnapshot.empty) {
    const userData = querySnapshot.docs[0].data();
    if (userData.displayName) displayName = userData.displayName;
    if (userData.bio) bio = userData.bio;
    if (userData.photoURL) photoURL = userData.photoURL;
  }

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #f0fdf4 0%, #e0f2fe 50%, #ede9fe 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '40px',
            padding: '60px 80px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.05)',
            border: '1px solid rgba(226, 232, 240, 0.5)',
            width: '100%',
            height: '100%',
            gap: '32px',
          }}
        >
          {/* 아바타 영역 */}
          <div
            style={{
              width: '180px',
              height: '180px',
              borderRadius: '90px',
              backgroundColor: '#f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '8px solid white',
              boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
              overflow: 'hidden',
            }}
          >
            {photoURL ? (
              <img
                src={photoURL}
                alt={displayName}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <span style={{ fontSize: '80px', fontWeight: 'bold', color: '#94a3b8' }}>
                {displayName.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          
          {/* 프로필 정보 영역 */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
            }}
          >
            <h1
              style={{
                fontSize: '64px',
                fontWeight: 900,
                color: '#0f172a',
                letterSpacing: '-0.02em',
                margin: 0,
                textAlign: 'center',
              }}
            >
              {displayName}
            </h1>
            <p
              style={{
                fontSize: '32px',
                color: '#64748b',
                fontWeight: 600,
                margin: 0,
              }}
            >
              @{decodedUsername}
            </p>
          </div>
          
          {/* Bio 영역 */}
          <p
            style={{
              fontSize: '28px',
              color: '#334155',
              textAlign: 'center',
              fontWeight: 500,
              margin: '16px 0 0 0',
              maxWidth: '700px',
              lineHeight: 1.4,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {bio}
          </p>

          {/* 푸터 워터마크 */}
          <div
            style={{
              position: 'absolute',
              bottom: '40px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              opacity: 0.6,
            }}
          >
            <div
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '6px',
                background: 'linear-gradient(135deg, #2563eb, #4f46e5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '12px',
                fontWeight: 'bold',
              }}
            >
              M
            </div>
            <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#64748b' }}>
              MyLink
            </span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
