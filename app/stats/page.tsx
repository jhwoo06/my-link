"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useLinks } from "@/hooks/useLinks";
import { Loader2, ArrowLeft, TrendingUp, MousePointerClick } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

export default function StatsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // 인증 체크 로직
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push("/");
      }
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  // 해당 유저의 링크 데이터 가져오기
  const { links, isLoading: isLinksLoading } = useLinks(user?.uid);

  // 총 누적 클릭수 계산
  const totalClicks = useMemo(() => {
    if (!links) return 0;
    return links.reduce((sum, link) => sum + (link.clicks || 0), 0);
  }, [links]);

  // 차트 데이터 가공 (클릭수가 0보다 큰 링크만 필터링)
  const chartData = useMemo(() => {
    if (!links) return [];
    return links
      .filter(link => (link.clicks || 0) > 0)
      .map(link => ({
        name: link.title,
        clicks: link.clicks || 0
      }));
  }, [links]);

  // 로딩 상태 처리
  if (isAuthLoading || (user && isLinksLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  // 비로그인 시 렌더링 방지
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col items-center py-12 px-4 font-sans selection:bg-primary selection:text-white">
      <div className="w-full max-w-3xl flex flex-col gap-8">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => router.push("/")} 
            className="text-gray-500 hover:text-gray-900 px-0 hover:bg-transparent transition-colors group"
          >
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            대시보드로 돌아가기
          </Button>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            통계 분석
          </h1>
        </div>

        {/* Total Clicks Card */}
        <Card className="border-gray-100 shadow-sm hover:shadow-md transition-shadow rounded-2xl overflow-hidden group">
          <CardHeader className="bg-white pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              총 누적 클릭수
            </CardTitle>
            <div className="p-2.5 bg-primary/10 rounded-full text-primary group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
              <MousePointerClick className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="bg-white">
            <div className="text-6xl font-black tracking-tighter bg-gradient-to-br from-gray-900 via-gray-800 to-gray-500 bg-clip-text text-transparent pb-1">
              {totalClicks.toLocaleString()}
            </div>
            <p className="text-sm text-gray-400 mt-3 font-medium">모든 링크에서 발생한 방문자 클릭 합산입니다.</p>
          </CardContent>
        </Card>

        {/* Chart Card */}
        <Card className="border-gray-100 shadow-sm hover:shadow-md transition-shadow rounded-2xl overflow-hidden">
          <CardHeader className="bg-white pb-6 border-b border-gray-50">
            <CardTitle className="text-lg font-bold text-gray-900">링크별 성과 차트</CardTitle>
            <CardDescription className="text-sm text-gray-500 mt-1">클릭이 한 번 이상 발생한 링크만 시각화됩니다.</CardDescription>
          </CardHeader>
          <CardContent className="bg-white pt-8">
            {chartData.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-gray-400 gap-3">
                <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
                </div>
                <p className="font-medium text-sm">아직 클릭 데이터가 충분하지 않습니다.</p>
              </div>
            ) : (
              <div className="h-80 w-full">
                <ChartContainer config={{
                  clicks: {
                    label: "클릭수",
                    color: "hsl(var(--primary))",
                  }
                }}>
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <XAxis 
                      dataKey="name" 
                      tickLine={false}
                      axisLine={false}
                      fontSize={12}
                      fontWeight={500}
                      tickMargin={12}
                      angle={-25}
                      textAnchor="end"
                      fill="#6b7280"
                    />
                    <YAxis 
                      tickLine={false}
                      axisLine={false}
                      fontSize={12}
                      fontWeight={500}
                      tickFormatter={(value) => `${value}`}
                      fill="#6b7280"
                    />
                    <ChartTooltip 
                      cursor={{ fill: 'rgba(0, 0, 0, 0.04)' }} 
                      content={<ChartTooltipContent />} 
                    />
                    <Bar 
                      dataKey="clicks" 
                      fill="var(--color-clicks)" 
                      radius={[6, 6, 0, 0]} 
                      maxBarSize={50} 
                      className="hover:opacity-80 transition-opacity cursor-pointer"
                    />
                  </BarChart>
                </ChartContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
