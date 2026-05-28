import { ImageResponse } from 'next/og';

// Route segment config
// export const runtime = 'edge';

// Image metadata
export const alt = 'My Link - Development in One Link';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px',
          position: 'relative',
        }}
      >
        {/* Background Decor */}
        <div
          style={{
            position: 'absolute',
            top: '-20%',
            left: '20%',
            width: '60%',
            height: '60%',
            background: 'linear-gradient(to top right, rgba(37, 99, 235, 0.1), rgba(37, 99, 235, 0.05), transparent)',
            borderRadius: '50%',
            filter: 'blur(80px)',
          }}
        />
        
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 24px',
              borderRadius: '999px',
              backgroundColor: 'rgba(37, 99, 235, 0.1)',
              color: '#2563eb',
              fontSize: '24px',
              fontWeight: 600,
              marginBottom: '32px',
            }}
          >
            <div
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '6px',
                backgroundColor: '#2563eb',
              }}
            />
            마이링크 베타 출시
          </div>

          <h1
            style={{
              fontSize: '96px',
              fontWeight: 800,
              textAlign: 'center',
              color: '#0f172a',
              letterSpacing: '-0.02em',
              margin: 0,
              lineHeight: 1.1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <span>Development in</span>
            <span style={{ color: '#2563eb' }}>One Link.</span>
          </h1>
          
          <p
            style={{
              fontSize: '32px',
              color: '#64748b',
              textAlign: 'center',
              fontWeight: 500,
              margin: '40px 0 0 0',
              maxWidth: '800px',
              lineHeight: 1.5,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <span>GitHub, 블로그, 포트폴리오까지.</span>
            <span>개발자를 위한 모든 링크를 단 하나의 페이지에 담아보세요.</span>
          </p>

          <div
            style={{
              marginTop: '60px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #2563eb, #4f46e5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '24px',
                fontWeight: 'bold',
              }}
            >
              M
            </div>
            <span style={{ fontSize: '32px', fontWeight: 800, color: '#0f172a' }}>
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
