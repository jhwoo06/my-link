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
  const [mounted, setMounted] = useState(false);

  // Guestbook states
  const [messages, setMessages] = useState<GuestbookEntry[]>([]);
  const [name, setName] = useState("");
  const [relation, setRelation] = useState("친구");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("jiheon_guestbook_neo");
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
          message: "지헌아 프로필 디자인 미쳤다! 네오브루탈리즘 감성 폼 미쳤다 🔥",
          timestamp: "2026-05-27 18:30",
        },
        {
          id: "2",
          name: "박교수님",
          relation: "선후배",
          message: "바이브 코딩으로 이런 파격적인 디자인을 구현하다니 인상적이군요. 앞으로의 성장이 기대됩니다.",
          timestamp: "2026-05-27 21:15",
        },
      ];
      setMessages(placeholders);
      localStorage.setItem("jiheon_guestbook_neo", JSON.stringify(placeholders));
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
    localStorage.setItem("jiheon_guestbook_neo", JSON.stringify(updated));

    // Reset inputs
    setName("");
    setMessage("");
  };

  const getRelationColor = (rel: string) => {
    switch (rel) {
      case "친구":
        return "bg-neo-pink";
      case "선후배":
        return "bg-neo-green";
      case "동료":
        return "bg-neo-blue";
      default:
        return "bg-white";
    }
  };

  return (
    <div className="min-h-screen w-full px-4 py-12 sm:p-12 md:p-20 font-sans selection:bg-neo-yellow selection:text-black">
      <main className="max-w-7xl mx-auto space-y-24">
        
        {/* Hero Section */}
        <section className="space-y-8 animate-fade-in">
          <div className="space-y-4">
            <h1 className="text-6xl sm:text-7xl md:text-9xl font-black uppercase tracking-tighter leading-[0.9]">
              Woo <br />
              <span className="inline-block bg-neo-yellow text-black px-4 md:px-8 border-4 md:border-8 border-black shadow-[8px_8px_0_0_#000] md:shadow-[16px_16px_0_0_#000] -rotate-2 hover:rotate-0 transition-transform duration-300">
                Jiheon
              </span>
            </h1>
          </div>
          
          <p className="text-xl sm:text-2xl md:text-4xl font-bold max-w-4xl border-l-8 border-neo-blue pl-6 leading-snug">
            WEB DEVELOPER & AI LEARNER. <br className="hidden sm:block" />
            바이브 코딩을 탐구하는 대학생입니다. 🚀
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <div className="px-5 py-3 bg-white text-black font-bold border-4 border-black shadow-[4px_4px_0_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#000] transition-all cursor-default">
              <span className="inline-block w-3 h-3 rounded-full bg-green-500 animate-pulse mr-2 border-2 border-black" />
              배우는 중
            </div>
            <div className="px-5 py-3 bg-neo-pink text-black font-bold border-4 border-black shadow-[4px_4px_0_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#000] transition-all cursor-default">
              🎓 한양대학교 의과대학 의예과
            </div>
            <div className="px-5 py-3 bg-neo-green text-black font-bold border-4 border-black shadow-[4px_4px_0_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#000] transition-all cursor-default">
              💻 React & Next.js
            </div>
          </div>
        </section>

        {/* Two Column Grid for Links & Projects */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-12">
          
          {/* Links Section */}
          <section className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight border-b-8 border-black dark:border-white pb-2 inline-block">
              Links
            </h2>
            <div className="flex flex-col gap-6">
              <a
                href="https://github.com/jhwoo06"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-6 bg-neo-purple text-black border-4 border-black shadow-[8px_8px_0_0_#000] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[4px_4px_0_0_#000] transition-all"
              >
                <div className="flex items-center gap-6">
                  <div className="p-4 bg-white border-4 border-black shadow-[4px_4px_0_0_#000] group-hover:-rotate-6 transition-transform">
                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                      <path d="M9 18c-4.51 2-5-2-7-2" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-black text-2xl uppercase">GitHub</h3>
                    <p className="font-bold text-black/70">소스코드와 개발 프로젝트</p>
                  </div>
                </div>
                <svg className="w-8 h-8 group-hover:translate-x-2 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>

              <a
                href="mailto:jhwoo06@users.noreply.github.com"
                className="group flex items-center justify-between p-6 bg-neo-blue text-black border-4 border-black shadow-[8px_8px_0_0_#000] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[4px_4px_0_0_#000] transition-all"
              >
                <div className="flex items-center gap-6">
                  <div className="p-4 bg-white border-4 border-black shadow-[4px_4px_0_0_#000] group-hover:rotate-6 transition-transform">
                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-black text-2xl uppercase">Email</h3>
                    <p className="font-bold text-black/70">협업 문의 및 연락하기</p>
                  </div>
                </div>
                <svg className="w-8 h-8 group-hover:translate-x-2 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>

              <a
                href="https://github.com/jhwoo06/my-link"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-6 bg-neo-orange text-black border-4 border-black shadow-[8px_8px_0_0_#000] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[4px_4px_0_0_#000] transition-all"
              >
                <div className="flex items-center gap-6">
                  <div className="p-4 bg-white border-4 border-black shadow-[4px_4px_0_0_#000] group-hover:-rotate-6 transition-transform">
                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-black text-2xl uppercase">Repository</h3>
                    <p className="font-bold text-black/70">이 웹사이트의 리포지토리</p>
                  </div>
                </div>
                <svg className="w-8 h-8 group-hover:translate-x-2 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </section>

          {/* Projects Section */}
          <section className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight border-b-8 border-black dark:border-white pb-2 inline-block">
              Projects
            </h2>
            <div className="flex flex-col gap-8">
              
              <div className="p-8 bg-white text-black border-4 border-black shadow-[8px_8px_0_0_#000] flex flex-col justify-between group">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <span className="px-3 py-1 font-black uppercase text-sm border-2 border-black bg-neo-yellow shadow-[2px_2px_0_0_#000]">
                      Personal
                    </span>
                    <a href="https://github.com/jhwoo06/my-link" target="_blank" rel="noopener noreferrer" className="p-2 border-2 border-black bg-white shadow-[2px_2px_0_0_#000] hover:bg-black hover:text-white transition-colors">
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4M9 18c-4.51 2-5-2-7-2" /></svg>
                    </a>
                  </div>
                  <h3 className="font-black text-3xl uppercase mb-4">My Link</h3>
                  <p className="font-bold text-lg text-black/80 leading-relaxed mb-8">
                    Next.js 16과 Tailwind CSS 4를 적극적으로 활용한 현대적인 개인 멀티링크 포트폴리오 사이트.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="font-bold px-3 py-1 border-2 border-black bg-black text-white">Next.js 16</span>
                  <span className="font-bold px-3 py-1 border-2 border-black bg-black text-white">Tailwind v4</span>
                  <span className="font-bold px-3 py-1 border-2 border-black bg-black text-white">TS</span>
                </div>
              </div>

              <div className="p-8 bg-white text-black border-4 border-black shadow-[8px_8px_0_0_#000] flex flex-col justify-between group">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <span className="px-3 py-1 font-black uppercase text-sm border-2 border-black bg-neo-green shadow-[2px_2px_0_0_#000]">
                      Experimental
                    </span>
                    <span className="p-2 border-2 border-black bg-white shadow-[2px_2px_0_0_#000]">
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" /></svg>
                    </span>
                  </div>
                  <h3 className="font-black text-3xl uppercase mb-4">AI Vibe Coding</h3>
                  <p className="font-bold text-lg text-black/80 leading-relaxed mb-8">
                    AI 파트너와 실시간으로 기획, 디자인, 코드 작성을 실험하며 구현 속도를 극대화하는 웹 프로젝트.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="font-bold px-3 py-1 border-2 border-black bg-black text-white">React 19</span>
                  <span className="font-bold px-3 py-1 border-2 border-black bg-black text-white">AI Coding</span>
                </div>
              </div>

            </div>
          </section>
        </div>

        {/* Guestbook Section */}
        <section className="space-y-8">
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight border-b-8 border-black dark:border-white pb-2 inline-block">
            Guestbook
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Form */}
            <div className="lg:col-span-5 h-fit">
              <form onSubmit={handleSubmit} className="p-8 bg-neo-yellow text-black border-4 border-black shadow-[8px_8px_0_0_#000] flex flex-col gap-6">
                <div>
                  <label htmlFor="name-input" className="block font-black uppercase mb-2 text-xl">Name</label>
                  <input
                    id="name-input"
                    type="text"
                    placeholder="이름"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={10}
                    className="w-full text-lg font-bold px-4 py-3 bg-white border-4 border-black focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[4px_4px_0_0_#000] shadow-[8px_8px_0_0_#000] transition-all"
                  />
                </div>
                
                <div>
                  <label className="block font-black uppercase mb-2 text-xl">Relation</label>
                  <div className="grid grid-cols-2 gap-3">
                    {["친구", "선후배", "동료", "방문자"].map((rel) => (
                      <button
                        key={rel}
                        type="button"
                        onClick={() => setRelation(rel)}
                        className={`py-2 px-3 font-bold border-4 border-black transition-all ${
                          relation === rel
                            ? "bg-black text-white shadow-none translate-x-[2px] translate-y-[2px]"
                            : "bg-white text-black shadow-[4px_4px_0_0_#000] hover:bg-black/5"
                        }`}
                      >
                        {rel}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="message-input" className="block font-black uppercase mb-2 text-xl">Message</label>
                  <textarea
                    id="message-input"
                    rows={4}
                    placeholder="응원의 한마디를 남겨주세요!"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    maxLength={150}
                    className="w-full text-lg font-bold px-4 py-3 bg-white border-4 border-black focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[4px_4px_0_0_#000] shadow-[8px_8px_0_0_#000] transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full mt-4 py-4 bg-black text-white text-xl font-black uppercase border-4 border-black hover:bg-white hover:text-black shadow-[8px_8px_0_0_#000] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[4px_4px_0_0_#000] transition-all"
                >
                  Submit
                </button>
              </form>
            </div>

            {/* Message List */}
            <div className="lg:col-span-7">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {mounted && messages.length > 0 ? (
                  messages.map((item) => (
                    <div
                      key={item.id}
                      className="p-6 bg-white text-black border-4 border-black shadow-[6px_6px_0_0_#000] hover:-translate-y-2 hover:shadow-[12px_12px_0_0_#000] transition-all duration-300 flex flex-col justify-between min-h-[160px]"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <span className="text-xl font-black">{item.name}</span>
                            <span className={`text-xs font-bold px-2 py-1 border-2 border-black ${getRelationColor(item.relation)}`}>
                              {item.relation}
                            </span>
                          </div>
                        </div>
                        <p className="text-base font-bold leading-relaxed whitespace-pre-wrap">
                          "{item.message}"
                        </p>
                      </div>
                      <div className="text-xs font-bold text-black/50 mt-6 text-right">
                        {item.timestamp}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-20 font-black text-2xl uppercase border-4 border-black bg-white shadow-[8px_8px_0_0_#000] text-black/40">
                    No Messages Yet!
                  </div>
                )}
              </div>
            </div>
            
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center border-t-8 border-black dark:border-white pt-12 pb-12 font-bold uppercase tracking-widest text-sm">
          <p>© {new Date().getFullYear()} WOO JIHEON. ALL RIGHTS RESERVED.</p>
          <p className="mt-2 text-xs opacity-60">POWERED BY NEXT.JS & TAILWIND CSS 4</p>
        </footer>

      </main>
    </div>
  );
}
