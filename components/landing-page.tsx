"use client";

import { motion, Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MonitorSmartphone, Share2, TrendingUp, Paintbrush, ArrowRight } from "lucide-react";

interface LandingPageProps {
  handleLogin: () => void;
}

export function LandingPage({ handleLogin }: LandingPageProps) {
  // 애니메이션 변수 설정
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="w-full flex flex-col items-center text-center py-16 md:py-24 mt-4 md:mt-6 overflow-hidden relative">
        {/* Background Decor */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-primary/10 via-primary/5 to-transparent rounded-full blur-[80px] -z-10 opacity-70" />
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center z-10 px-4"
        >
          <motion.div variants={itemVariants} className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            마이링크 베타 출시
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight text-gray-900">
            Development in <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
              One Link.
            </span>
          </motion.h1>

          <motion.p variants={itemVariants} className="text-lg md:text-xl font-medium text-gray-500 mb-10 max-w-xl leading-relaxed">
            GitHub, 블로그, 포트폴리오까지.<br />
            개발자를 위한 모든 링크를 단 하나의 페이지에 담아보세요.
          </motion.p>

          <motion.div variants={itemVariants} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={handleLogin}
              className="h-14 px-8 text-lg font-bold bg-primary text-white rounded-full w-full md:w-auto shadow-[0_8px_30px_rgb(59,130,246,0.3)] hover:shadow-[0_8px_40px_rgb(59,130,246,0.5)] transition-all flex items-center justify-center gap-3 relative overflow-hidden group"
            >
              <div className="absolute inset-0 w-full h-full bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              <span className="font-black text-xl z-10">G</span>
              <span className="z-10">Google로 시작하기</span>
            </Button>
          </motion.div>
        </motion.div>

        {/* Animated Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, type: "spring" }}
          className="mt-20 w-full max-w-[320px] md:max-w-md bg-white p-6 rounded-3xl shadow-[0_20px_60px_rgb(0,0,0,0.08)] border border-gray-100 flex flex-col gap-4 mx-auto relative z-10"
        >
          {/* Mockup Header */}
          <div className="flex flex-col items-center gap-3 mb-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-100 to-indigo-50 border-4 border-white shadow-sm flex items-center justify-center">
              <span className="text-2xl font-bold text-blue-300">U</span>
            </div>
            <div className="w-32 h-5 rounded-md bg-gray-100"></div>
            <div className="w-20 h-3 rounded-md bg-gray-50"></div>
          </div>
          
          {/* Mockup Links */}
          <motion.div 
            whileHover={{ scale: 1.02, x: 5 }}
            className="w-full h-14 bg-gray-900 rounded-xl flex items-center px-5 gap-4 cursor-pointer shadow-sm transition-colors hover:bg-gray-800"
          >
            <div className="w-6 h-6 rounded-full bg-white/20"></div>
            <div className="w-24 h-3.5 rounded-md bg-white/80"></div>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.02, x: 5 }}
            className="w-full h-14 bg-blue-50 rounded-xl flex items-center px-5 gap-4 cursor-pointer hover:bg-blue-100 transition-colors"
          >
            <div className="w-6 h-6 rounded-full bg-blue-200"></div>
            <div className="w-32 h-3.5 rounded-md bg-blue-400"></div>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.02, x: 5 }}
            className="w-full h-14 bg-gray-50 rounded-xl flex items-center px-5 gap-4 cursor-pointer hover:bg-gray-100 transition-colors"
          >
            <div className="w-6 h-6 rounded-full bg-gray-200"></div>
            <div className="w-28 h-3.5 rounded-md bg-gray-400"></div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section (Bento Grid) */}
      <section className="w-full py-20 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">왜 마이링크를 사용해야 할까요?</h2>
          <p className="text-gray-500 font-medium">단 하나의 링크로 당신의 모든 것을 표현하세요.</p>
        </motion.div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white p-8 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col gap-4"
          >
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-2">
              <Share2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">단 하나의 링크</h3>
            <p className="text-gray-500 font-medium leading-relaxed">
              여러 개의 링크를 하나로 통합하세요. 인스타그램, 트위터 프로필에 
              마이링크 하나만 걸어두면 충분합니다.
            </p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white p-8 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col gap-4 md:mt-8"
          >
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-2">
              <Paintbrush className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">쉬운 커스터마이징</h3>
            <p className="text-gray-500 font-medium leading-relaxed">
              드래그 앤 드롭으로 링크 순서를 변경하고, 클릭 몇 번으로
              나만의 프로필 페이지를 완성하세요.
            </p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white p-8 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col gap-4"
          >
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-2">
              <MonitorSmartphone className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">반응형 디자인</h3>
            <p className="text-gray-500 font-medium leading-relaxed">
              모바일, 태블릿, 데스크탑 어디서든 완벽하게 보이는
              아름다운 반응형 페이지를 제공합니다.
            </p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white p-8 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col gap-4 md:mt-8"
          >
            <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-2">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">방문자 통계 (예정)</h3>
            <p className="text-gray-500 font-medium leading-relaxed">
              누가 어떤 링크를 얼마나 클릭했는지 분석하고,
              더 나은 프로필을 위한 인사이트를 얻으세요.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="w-full py-24 px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto bg-gray-900 rounded-[2rem] p-10 md:p-16 text-center flex flex-col items-center relative overflow-hidden"
        >
          {/* Abstract background shapes */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-96 h-96 bg-primary/30 rounded-full blur-[80px]" />
          <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-64 h-64 bg-blue-500/30 rounded-full blur-[60px]" />
          
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 relative z-10">
            지금 바로 나만의 링크를 만들어보세요
          </h2>
          <p className="text-gray-400 font-medium text-lg mb-10 max-w-lg relative z-10">
            복잡한 코딩 없이 1분 만에 완성하는 나만의 프로필 페이지.
            무료로 시작하세요.
          </p>
          
          <Button
            onClick={handleLogin}
            className="h-14 px-8 text-lg font-bold bg-white text-gray-900 rounded-full shadow-xl hover:bg-gray-100 transition-all flex items-center justify-center gap-2 relative z-10 group hover:scale-105"
          >
            시작하기 <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </section>
    </div>
  );
}
