import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import AuthModal from "../components/AuthModal";
import ClipCharacter from "../components/ClipCharacter";
import Header from "../components/Header";
import type { User } from "@supabase/supabase-js";
import { motion, AnimatePresence } from "framer-motion";

// 슬라이드 데이터 정의
const slides = [
  {
    badge: "스마트 북마크 관리",
    heading: "링크 저장,\n이제 다르게.",
    sub: "URL만 붙여넣으면 제목·썸네일이 자동으로 채워지고 카테고리별로 깔끔하게 정리돼요.",
    tags: ["URL 자동 미리보기", "카테고리 정리", "즐겨찾기 대체"],
    image: "/images/screenshot-dashboard.png",
    bg: "linear-gradient(150deg, #f5f3ff 0%, #ede9fe 40%, #faf5ff 100%)",
  },
  {
    badge: "원클릭 저장",
    heading: "붙여넣기 한 번,\n다 채워져요.",
    sub: "주소만 넣으면 사이트 이름·설명·아이콘이 자동으로 불러와집니다. 귀찮은 타이핑은 그만.",
    tags: ["제목 자동입력", "썸네일 자동", "카테고리 선택"],
    image: "/images/screenshot-bookmark.png",
    bg: "linear-gradient(150deg, #f5f3ff 0%, #ede9fe 40%, #faf5ff 100%)",
  },
  {
    badge: "매일 업데이트 뉴스 피드",
    heading: "테크 트렌드,\n놓치지 마세요.",
    sub: "카카오·토스·라인 등 주요 기술 블로그와 IT 뉴스를 매일 자동으로 모아 한눈에 보여드려요.",
    tags: ["기술블로그 피드", "IT 뉴스", "자동 업데이트"],
    image: "/images/screenshot-feed.png",
    bg: "linear-gradient(150deg, #f5f3ff 0%, #ede9fe 40%, #faf5ff 100%)",
  },
];

function LandingPage() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  // 슬라이드 상태 관리
  const [current, setCurrent] = useState(0);
  const [dir, setDir] = useState(1);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 자동 슬라이드를 시작하는 함수
  const startTimer = () => {
    // 기존 타이머가 있다면 먼저 제거
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setDir(1);
      setCurrent((p) => (p + 1) % slides.length);
    }, 6000);
  };

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => setUser(session?.user ?? null));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user ?? null));

    // 초기 타이머 시작
    startTimer();

    return () => {
      subscription.unsubscribe();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // 도트(인디케이터) 클릭 핸들러
  const handleDotClick = (index: number) => {
    // 1. 방향 설정 (현재보다 크면 오른쪽, 작으면 왼쪽 애니메이션)
    setDir(index > current ? 1 : -1);

    // 2. 해당 슬라이드로 이동
    setCurrent(index);

    // 3. 기존 자동 슬라이드 타이머 제거 (수동 조작 시 멈춤)
    if (timerRef.current) clearInterval(timerRef.current);

    // 4. 30초 후에 자동 슬라이드 재시작 (사용자가 충분히 볼 시간을 확보)
    // 30000ms = 30초
    timerRef.current = setTimeout(() => {
      startTimer();
    }, 30000);
  };

  const slide = slides[current];

  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden">
      <Header />

      {/* 🚀 히어로 슬라이드 섹션 (초기 스타일 정렬 반영) */}
      <section
        className="relative min-h-[92vh] flex items-center pt-20 pb-12 transition-colors duration-1000"
        style={{ background: slide.bg }}
      >
        <div className="max-w-6xl mx-auto px-6 w-full flex flex-col md:flex-row gap-16 items-center">
          {/* 좌측: 스크린샷 이미지 애니메이션 */}
          <div className="flex-[1.3] relative order-2 md:order-1 flex justify-center">
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={current}
                custom={dir}
                initial={{ opacity: 0, x: dir > 0 ? -40 : 40, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: dir > 0 ? 40 : -40, scale: 0.95 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-w-[500px]"
              >
                <img
                  src={slide.image}
                  alt={slide.badge}
                  className="w-full object-cover"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* 우측: 텍스트 콘텐츠 (초기 폰트 크기 복구) */}
          <div className="flex-1 order-1 md:order-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={current + "-text"}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
              >
                <span className="inline-block bg-white text-purple-600 text-[12px] font-bold px-3.5 py-1 rounded-full mb-5 border border-purple-100 shadow-sm">
                  {slide.badge}
                </span>

                <h1 className="text-[42px] font-extrabold text-gray-900 leading-[1.2] mb-5 whitespace-pre-line">
                  {slide.heading}
                </h1>

                <p className="text-[16px] text-gray-500 leading-relaxed mb-8 max-w-[400px]">
                  {slide.sub}
                </p>

                <div className="flex flex-wrap gap-2 mb-10">
                  {slide.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[13px] bg-white/60 border border-purple-100 text-purple-700 px-3 py-1 rounded-lg font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() =>
                      user ? navigate("/dashboard") : setShowAuthModal(true)
                    }
                    className="bg-purple-600 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-purple-700 transition shadow-lg cursor-pointer"
                  >
                    {user ? "내 북마크 보기 →" : "무료로 시작하기"}
                  </button>
                  <button
                    onClick={() => navigate("/feed")}
                    className="bg-white text-gray-600 border border-gray-200 px-8 py-3.5 rounded-xl font-bold hover:border-purple-300 hover:text-purple-600 transition cursor-pointer"
                  >
                    뉴스 피드 보기
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex gap-2 mt-12">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => handleDotClick(i)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    current === i
                      ? "bg-purple-600 w-8"
                      : "bg-purple-200 w-2 hover:bg-purple-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-20 pointer-events-none">
          <ClipCharacter size={100} color="#7c3aed" />
        </div>
      </section>

      {/* 왜 만들었나요 (Why Clippi) */}
      <section className="bg-white py-[100px] px-8">
        <div className="max-w-[860px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-center text-[13px] font-bold text-[#a78bfa] tracking-[0.1em] mb-[12px] uppercase">
              Why Clippi
            </p>
            <h2 className="text-center text-[36px] font-extrabold text-[#1e1b4b] mb-[14px] tracking-tight">
              직접 겪어서 직접 만들었어요
            </h2>
            <p className="text-center text-[#6b7280] text-[16px] leading-[1.8] mb-[56px] break-keep">
              크롬 즐겨찾기에 수십 개 쌓인 링크, 찾을 때마다 스크롤만 했었죠.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* BEFORE 카드 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="h-full"
            >
              <div className="bg-[#fafafa] rounded-[20px] p-8 border border-[#f3f4f6] h-full flex flex-col">
                <div className="text-[28px] mb-[12px]">😤</div>
                <span className="text-[12px] font-bold text-[#9ca3af] tracking-[0.05em] uppercase">
                  BEFORE
                </span>
                <h3 className="text-[18px] font-bold text-[#374151] mt-[8px] mb-[10px]">
                  즐겨찾기의 한계
                </h3>
                <p className="text-[14px] text-[#6b7280] leading-[1.8] m-0">
                  링크가 쌓일수록 어디 있는지 모르게 됐고, 다른 컴퓨터에서는
                  아예 볼 수도 없었어요.
                </p>
              </div>
            </motion.div>

            {/* AFTER 카드 */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="h-full"
            >
              <div className="bg-[#f5f3ff] rounded-[20px] p-8 border-[1.5px] border-[#ddd6fe] h-full flex flex-col shadow-sm">
                <div className="text-[28px] mb-[12px]">✨</div>
                <span className="text-[12px] font-bold text-[#7c3aed] tracking-[0.05em] uppercase">
                  AFTER — CLIPPI
                </span>
                <h3 className="text-[18px] font-bold text-[#1e1b4b] mt-[8px] mb-[10px]">
                  정리된 나만의 공간
                </h3>
                <p className="text-[14px] text-[#6b7280] leading-[1.8] m-0">
                  카테고리로 깔끔하게 정리하고, 어느 기기에서든 로그인 하나로
                  바로 꺼내 쓸 수 있어요.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 🚀 ── 주요 기능 ── */}
      <section className="bg-[#faf5ff] py-[100px] px-8">
        <div className="max-w-[1000px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-center text-[13px] font-bold text-[#a78bfa] tracking-[0.1em] mb-[12px] uppercase">
              Features
            </p>
            <h2 className="text-center text-[36px] font-extrabold text-[#1e1b4b] mb-[56px] tracking-tight">
              딱 필요한 것만 담았어요
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                icon: "🔖",
                title: "스마트 북마크",
                desc: "URL 하나면 끝. 제목과 썸네일이 자동으로 채워지고 카테고리로 깔끔하게 정리돼요.",
                tags: ["자동 메타데이터", "카테고리 정리"],
              },
              {
                icon: "📰",
                title: "매일 업데이트 뉴스",
                desc: "카카오, 토스, 라인 등 국내 주요 기술 블로그를 매일 자동으로 모아드려요.",
                tags: ["기술 블로그", "매일 자동 수집"],
                highlight: true,
              },
              {
                icon: "🌐",
                title: "어디서든 접근",
                desc: "회사든 집이든, 로그인 하나로 내 북마크를 바로 꺼내 쓸 수 있어요.",
                tags: ["멀티 디바이스", "클라우드 동기화"],
              },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="h-full"
              >
                <div
                  className={`rounded-[20px] p-8 h-full border transition-all duration-300 ${
                    f.highlight
                      ? "bg-[#7c3aed] border-transparent shadow-xl shadow-purple-200 scale-105 z-10"
                      : "bg-white border-[#ede9fe]"
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-[14px] flex items-center justify-center text-[22px] mb-[18px] ${
                      f.highlight ? "bg-white/15" : "bg-[#f5f3ff]"
                    }`}
                  >
                    {f.icon}
                  </div>
                  <h3
                    className={`text-[17px] font-bold mb-[10px] ${
                      f.highlight ? "text-white" : "text-[#1e1b4b]"
                    }`}
                  >
                    {f.title}
                  </h3>
                  <p
                    className={`text-[14px] leading-[1.75] mb-[18px] ${
                      f.highlight ? "text-white/75" : "text-[#6b7280]"
                    }`}
                  >
                    {f.desc}
                  </p>
                  <div className="flex flex-wrap gap-[6px]">
                    {f.tags.map((t) => (
                      <span
                        key={t}
                        className={`text-[11px] px-[10px] py-[3px] rounded-[12px] font-medium ${
                          f.highlight
                            ? "bg-white/15 text-[#e9d5ff]"
                            : "bg-[#f5f3ff] text-[#7c3aed]"
                        }`}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 🚀 통계 배너 (요청하신 스타일 유지) */}
      <section className="bg-[#1e1b4b] py-[70px] px-8">
        <div className="max-w-[860px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
            {[
              { num: "3초", label: "북마크 저장 평균 시간" },
              { num: "무료", label: "가입 & 사용 비용" },
              { num: "∞", label: "저장 가능한 북마크 수" },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                <p className="text-[42px] font-extrabold text-[#c4b5fd] mb-2 tracking-tighter">
                  {s.num}
                </p>
                <p className="text-[14px] text-[#a78bfa]">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-8 bg-white">
        <div className="max-w-6xl mx-auto relative overflow-hidden bg-[#1e1b4b] rounded-[40px] py-20 px-10 text-center">
          {/* 배경 장식 원형 (선택 사항) */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-purple-600/20 blur-[100px] -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-600/20 blur-[100px] translate-x-1/2 translate-y-1/2" />

          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-purple-200 text-sm font-medium mb-6 backdrop-blur-md border border-white/10">
                Ready to Clip?
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight leading-tight">
                흩어진 링크를 한 곳에,
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                  당신의 지식을 자산으로.
                </span>
              </h2>
              <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto font-light">
                복잡한 북마크바는 이제 안녕. 3초 만에 저장하고,
                <br className="hidden md:block" />
                어디서나 꺼내 쓰는 스마트한 경험을 시작하세요.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() =>
                    user ? navigate("/dashboard") : setShowAuthModal(true)
                  }
                  className="group relative bg-white text-[#1e1b4b] px-10 py-4 rounded-2xl text-lg font-bold transition-all hover:scale-105 active:scale-95 shadow-xl hover:shadow-white/10"
                >
                  {user ? "내 대시보드로 이동" : "지금 무료로 시작하기"}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 group-hover:opacity-10 transition-opacity" />
                </button>
              </div>

              <p className="mt-8 text-gray-500 text-sm flex items-center justify-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Supabase 기반 보안 저장 · 내 북마크는 나만 볼 수 있어요.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-100 py-8 text-center">
        <p className="text-sm text-gray-400">© 2026 Clippi. Made by JB</p>
      </footer>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </div>
  );
}

export default LandingPage;
