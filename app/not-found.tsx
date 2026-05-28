import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="text-center flex flex-col items-center max-w-md">
        <h1 className="text-8xl font-black text-gray-200 mb-6 tracking-tighter">404</h1>
        <h2 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">페이지를 찾을 수 없습니다.</h2>
        <p className="text-gray-500 font-medium mb-8">
          요청하신 주소의 프로필이 존재하지 않거나 잘못된 경로입니다.
        </p>
        <Link 
          href="/" 
          className="h-12 px-8 flex items-center justify-center bg-primary text-white font-bold rounded-full hover:bg-primary/90 transition-colors shadow-sm hover:shadow-md"
        >
          MyLink 홈으로 가기
        </Link>
      </div>
    </div>
  );
}
