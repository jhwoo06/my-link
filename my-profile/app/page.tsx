"use client";

import { useState, useEffect } from "react";

interface GuestbookEntry {
  id: string;
  name: string;
  relation: string;
  message: string;
  timestamp: string;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<"links" | "projects" | "guestbook">("links");
  const [mounted, setMounted] = useState(false);

  // Guestbook states
  const [messages, setMessages] = useState<GuestbookEntry[]>([]);
  const [name, setName] = useState("");
  const [relation, setRelation] = useState("친구");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("jiheon_guestbook");
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse guestbook messages", e);
      }
    } else {
      // Default placeholder messages to make the page look alive
      const placeholders: GuestbookEntry[] = [
        {
          id: "1",
          name: "김민우",
          relation: "친구",
          message: "지헌아 프로필 웹사이트 대박이다! 디자인 진짜 힙하고 예쁘네 🔥 대박나자!",
          timestamp: "2026-05-27 18:30",
        },
        {
          id: "2",
          name: "박교수님",
          relation: "선후배",
          message: "바이브 코딩으로 이런 훌륭한 결과물을 만들다니 아주 흥미롭군요. 응원합니다.",
          timestamp: "2026-05-27 21:15",
        },
      ];
      setMessages(placeholders);
      localStorage.setItem("jiheon_guestbook", JSON.stringify(placeholders));
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    const newEntry: GuestbookEntry = {
      id: Date.now().toString(),
      name: name.trim(),
      relation,
      message: message.trim(),
      timestamp: formattedDate,
    };

    const updated = [newEntry, ...messages];
    setMessages(updated);
    localStorage.setItem("jiheon_guestbook", JSON.stringify(updated));

    // Reset inputs
    setName("");
    setMessage("");
  };

  const getRelationColor = (rel: string) => {
    switch (rel) {
      case "친구":
        return "bg-pink-500/10 text-pink-400 border-pink-500/20";
      case "선후배":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "동료":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      default:
        return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 md:p-8 bg-background overflow-hidden font-sans">
      {/* Dynamic Ambient Glow Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[25%] -left-[10%] w-[60%] h-[60%] rounded-full bg-glow-1/25 blur-[120px] animate-blob-slow" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[55%] h-[55%] rounded-full bg-glow-2/20 blur-[130px] animate-blob-slower" />
      </div>

      {/* Main Glass Container */}
      <main className="w-full max-w-2xl bg-card-bg backdrop-blur-xl border border-card-border rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 flex flex-col gap-8 transition-all duration-300">
        
        {/* Profile Header */}
        <section className="flex flex-col items-center text-center gap-4 border-b border-card-border pb-6">
          <div className="relative group">
            {/* Pulsing ring */}
            <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 opacity-60 blur group-hover:opacity-100 transition duration-500 animate-pulse" />
            <img
              src="/avatar.png"
              alt="우지헌 아바타"
              width={112}
              height={112}
              className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover bg-zinc-900 border-2 border-white/10 shadow-lg transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent sm:text-4xl">
              우지헌
            </h1>
            <p className="text-zinc-400 text-sm font-medium tracking-wide">
              Jiheon Woo • Web Developer & AI Learner
            </p>
          </div>

          <p className="max-w-md text-sm sm:text-base leading-relaxed text-zinc-300">
            안녕하세요! 바이브 코딩을 배우고 있는 대학생입니다. 🚀<br />
            AI 페어 프로그래밍과 모던 웹 기술에 많은 관심을 가지고 공부하고 있습니다.
          </p>

          {/* Status Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-zinc-800/80 border border-zinc-700/50 text-zinc-300">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
              배우는 중
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-zinc-800/80 border border-zinc-700/50 text-zinc-300">
              🎓 컴퓨터공학 전공
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-zinc-800/80 border border-zinc-700/50 text-zinc-300">
              💻 React & Next.js
            </span>
          </div>
        </section>

        {/* Tab Selection Navigation */}
        <nav className="flex bg-zinc-900/60 p-1.5 rounded-2xl border border-card-border">
          {(["links", "projects", "guestbook"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-300 capitalize cursor-pointer ${
                activeTab === tab
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40"
              }`}
            >
              {tab === "links" ? "링크" : tab === "projects" ? "프로젝트" : "방명록"}
            </button>
          ))}
        </nav>

        {/* Tab Content Areas */}
        <section className="min-h-[300px]">
          {/* Links Tab */}
          {activeTab === "links" && (
            <div className="flex flex-col gap-4 animate-fade-in">
              <a
                href="https://github.com/jhwoo06"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-4 rounded-2xl bg-zinc-900/40 border border-card-border hover:border-purple-500/40 hover:bg-zinc-800/30 transition-all duration-300 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                      <path d="M9 18c-4.51 2-5-2-7-2" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-zinc-100">GitHub</h3>
                    <p className="text-xs text-zinc-400">소스코드와 개발 프로젝트 둘러보기</p>
                  </div>
                </div>
                <svg className="w-5 h-5 text-zinc-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>

              <a
                href="mailto:jhwoo06@users.noreply.github.com"
                className="group flex items-center justify-between p-4 rounded-2xl bg-zinc-900/40 border border-card-border hover:border-blue-500/40 hover:bg-zinc-800/30 transition-all duration-300 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-zinc-100">Email</h3>
                    <p className="text-xs text-zinc-400">협업 문의 및 연락하기</p>
                  </div>
                </div>
                <svg className="w-5 h-5 text-zinc-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>

              <a
                href="https://github.com/jhwoo06/my-link"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-4 rounded-2xl bg-zinc-900/40 border border-card-border hover:border-pink-500/40 hover:bg-zinc-800/30 transition-all duration-300 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-pink-500/10 text-pink-400 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-zinc-100">Portfolio Repository</h3>
                    <p className="text-xs text-zinc-400">이 웹사이트의 리포지토리 구경하기</p>
                  </div>
                </div>
                <svg className="w-5 h-5 text-zinc-500 group-hover:text-pink-400 group-hover:translate-x-1 transition-all" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          )}

          {/* Projects Tab */}
          {activeTab === "projects" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
              <div className="p-5 rounded-2xl bg-zinc-900/40 border border-card-border hover:border-zinc-700/50 hover:bg-zinc-800/20 transition-all duration-300 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="px-2 py-0.5 text-[10px] font-bold tracking-wide rounded bg-purple-500/10 text-purple-400 border border-purple-500/25">
                      Personal
                    </span>
                    <a href="https://github.com/jhwoo06/my-link" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-zinc-300">
                      <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4M9 18c-4.51 2-5-2-7-2" /></svg>
                    </a>
                  </div>
                  <h3 className="font-bold text-base text-zinc-100 mb-1">My Link</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                    Next.js 16과 Tailwind CSS 4를 적극적으로 활용한 현대적인 개인 멀티링크 포트폴리오 사이트.
                  </p>
                </div>
                <div className="flex flex-wrap gap-1">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">Next.js 16</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">Tailwind v4</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">TS</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-900/40 border border-card-border hover:border-zinc-700/50 hover:bg-zinc-800/20 transition-all duration-300 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="px-2 py-0.5 text-[10px] font-bold tracking-wide rounded bg-blue-500/10 text-blue-400 border border-blue-500/25">
                      Experimental
                    </span>
                    <span className="text-zinc-600">
                      <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" /></svg>
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-zinc-100 mb-1">AI Vibe Coding Lab</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                    AI 파트너와 실시간으로 기획, 디자인, 코드 작성을 실험하며 구현 속도를 극대화하는 웹 프로젝트.
                  </p>
                </div>
                <div className="flex flex-wrap gap-1">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">React 19</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">AI Coding</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">Vite</span>
                </div>
              </div>
            </div>
          )}

          {/* Guestbook Tab */}
          {activeTab === "guestbook" && (
            <div className="space-y-6 animate-fade-in">
              {/* Form */}
              <form onSubmit={handleSubmit} className="p-4 rounded-2xl bg-zinc-950/50 border border-card-border space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-1">
                    <label htmlFor="name-input" className="block text-[11px] font-bold text-zinc-400 mb-1">작성자</label>
                    <input
                      id="name-input"
                      type="text"
                      placeholder="이름"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      maxLength={10}
                      className="w-full text-sm px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-purple-500/70"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="relation-select" className="block text-[11px] font-bold text-zinc-400 mb-1">관계</label>
                    <div className="flex gap-1">
                      {["친구", "선후배", "동료", "방문자"].map((rel) => (
                        <button
                          key={rel}
                          type="button"
                          onClick={() => setRelation(rel)}
                          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                            relation === rel
                              ? "bg-zinc-800 text-zinc-100 border-zinc-700"
                              : "bg-zinc-900/50 text-zinc-400 border-transparent hover:text-zinc-200"
                          }`}
                        >
                          {rel}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="message-input" className="block text-[11px] font-bold text-zinc-400 mb-1">응원 메시지</label>
                  <textarea
                    id="message-input"
                    rows={3}
                    placeholder="지헌이에게 응원 한마디를 남겨주세요!"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    maxLength={150}
                    className="w-full text-sm px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-purple-500/70 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-bold shadow-lg hover:from-purple-500 hover:to-blue-500 transition-all cursor-pointer"
                >
                  메시지 등록하기
                </button>
              </form>

              {/* Message List */}
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {mounted && messages.length > 0 ? (
                  messages.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl bg-zinc-900/20 border border-card-border flex flex-col gap-1.5 transition-all duration-300 hover:bg-zinc-900/30"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-zinc-100">{item.name}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full border ${getRelationColor(item.relation)}`}>
                            {item.relation}
                          </span>
                        </div>
                        <span className="text-[10px] text-zinc-500">{item.timestamp}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-light">
                        {item.message}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 text-zinc-500 text-xs">
                    아직 등록된 메시지가 없습니다. 첫 번째 발자취를 남겨보세요!
                  </div>
                )}
              </div>
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="text-center border-t border-card-border pt-4 text-[10px] sm:text-xs text-zinc-600">
          <p>© {new Date().getFullYear()} 우지헌. Powered by Next.js & Tailwind CSS 4.</p>
        </footer>
      </main>
    </div>
  );
}
