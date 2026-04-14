import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import AuthModal from "../components/AuthModal";
import WhyClippi from "../components/WhyClippi";
import FeaturesSection from "../components/FeaturesSection";
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

  // 이미지 프리로드
  useEffect(() => {
    slides.forEach((s) => {
      const img = new Image();
      img.src = s.image;
    });
  }, []);

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

  function useCountUp(target: number, duration: number, trigger: boolean) {
    const [count, setCount] = useState(0);

    useEffect(() => {
      if (!trigger) return;
      let start = 0;
      const steps = 40;
      const increment = target / steps;
      const interval = duration / steps;
      const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
          setCount(target);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, interval);
      return () => clearInterval(timer);
    }, [trigger]);

    return count;
  }

  function StatItem({
    num,
    label,
    index,
  }: {
    num: string;
    label: string;
    index: number;
  }) {
    const ref = useRef<HTMLDivElement>(null);
    const [triggered, setTriggered] = useState(false);

    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => setTriggered(true), index * 150);
            observer.disconnect();
          }
        },
        { threshold: 0.5 },
      );
      if (ref.current) observer.observe(ref.current);
      return () => observer.disconnect();
    }, []);

    // "3초" → target=3, suffix="초"
    // "무료" → 텍스트 타이핑
    // "∞"   → 숫자 올라가다 ∞ 로 터짐
    const isSeconds = num === "3초";
    const isFree = num === "무료";
    const isInfinity = num === "∞";

    const countedSeconds = useCountUp(3, 1000, isSeconds && triggered);
    const countedInfinity = useCountUp(100, 1200, isInfinity && triggered);

    const [typedText, setTypedText] = useState("");
    useEffect(() => {
      if (!isFree || !triggered) return;
      const text = "무료";
      let i = 0;
      const timer = setInterval(() => {
        i++;
        setTypedText(text.slice(0, i));
        if (i >= text.length) clearInterval(timer);
      }, 180);
      return () => clearInterval(timer);
    }, [triggered]);

    const displayValue = isSeconds
      ? `${countedSeconds}초`
      : isFree
        ? typedText || "\u00A0"
        : countedInfinity >= 100
          ? "∞"
          : countedInfinity;

    return (
      <motion.div
        ref={ref}
        key={index}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.15, duration: 0.6 }}
      >
        <p
          className={`text-[48px] font-extrabold tracking-tighter leading-none mb-3 transition-all duration-300 ${
            isInfinity && countedInfinity >= 100
              ? "text-white scale-110"
              : "text-[#c4b5fd]"
          }`}
        >
          {displayValue}
        </p>
        <p className="text-[14px] text-[#a78bfa]">{label}</p>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden">
      <Header />
      <section
        className="relative min-h-[92vh] flex items-center pt-20 pb-12 transition-colors duration-1000"
        style={{ background: slide.bg }}
      >
        <div className="max-w-6xl mx-auto px-6 w-full flex flex-col md:flex-row gap-16 items-center">
          {/* 좌측: 스크린샷 이미지 애니메이션 */}
          <div className="flex-[1.8] relative order-2 md:order-1 flex justify-center items-center min-h-[320px] sm:min-h-[400px] md:min-h-[520px] lg:min-h-[600px] w-full">
            {" "}
            <AnimatePresence mode="popLayout" custom={dir}>
              <motion.div
                key={current}
                custom={dir}
                initial={{ opacity: 0, x: dir > 0 ? 50 : -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: dir > 0 ? -50 : 50 }}
                transition={{
                  duration: 0.8,
                  ease: [0.4, 0, 0.2, 1],
                }}
                className="w-full h-full absolute inset-0 flex justify-center items-center p-4"
              >
                <img
                  src={slide.image}
                  alt={slide.badge}
                  className="w-[110%] max-w-none md:max-w-[640px] h-auto object-contain transform md:scale-100 scale-110"
                />
              </motion.div>
            </AnimatePresence>
          </div>
          {/* 우측: 텍스트 콘텐츠 (초기 폰트 크기 복구) */}
          <div className="flex-1 order-1 md:order-2">
            <AnimatePresence mode="popLayout" custom={dir}>
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
                    {user ? "내 북마크 보기 →" : "시작하기"}
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
      </section>

      {/* 왜 만들었나요 (Why Clippi) */}
      <WhyClippi />
      {/* 🚀 ── 주요 기능 ── */}
      <FeaturesSection />
      {/* 통계 */}
      <section className="bg-[#1e1b4b] py-[70px] px-8">
        <div className="max-w-[860px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
            {[
              { num: "3초", label: "북마크 저장 평균 시간" },
              { num: "무료", label: "가입 & 사용 비용" },
              { num: "∞", label: "저장 가능한 북마크 수" },
            ].map((s, i) => (
              <StatItem key={i} num={s.num} label={s.label} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-8 bg-white">
        <div className="max-w-6xl mx-auto relative overflow-hidden bg-[#1e1b4b] rounded-[40px] py-20 px-10 text-center">
          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-purple-200 text-sm font-medium mb-6 backdrop-blur-md border border-white/10">
                Ready to Clip?
              </span>
              <h2 className="text-2xl md:text-5xl font-black text-white mb-6 tracking-tight leading-tight">
                흩어진 링크를 한 곳에,
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                  당신의 지식을 자산으로.
                </span>
              </h2>
              <p className="text-gray-400 text-sm md:text-lg mb-10 max-w-xl mx-auto font-light">
                복잡한 북마크바는 이제 안녕. 3초 만에 저장하고,
                <br className="hidden md:block" />
                어디서나 꺼내 쓰는 스마트한 경험을 시작하세요.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() =>
                    user ? navigate("/dashboard") : setShowAuthModal(true)
                  }
                  className="group relative bg-white text-[#1e1b4b] px-8 py-3 rounded-xl text-base md:px-10 md:py-4 md:rounded-2xl md:text-lg font-bold transition-all hover:scale-105 active:scale-95 shadow-xl hover:shadow-white/10"
                >
                  {user ? "내 대시보드로 이동" : "지금 무료로 시작하기"}
                  <div className="absolute inset-0 rounded-xl md:rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 group-hover:opacity-10 transition-opacity" />
                </button>
              </div>

              <p className="mt-8 text-gray-500 text-[10px] md:text-sm flex items-center justify-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Supabase 기반 보안 저장 · 내 북마크는 나만 볼 수 있어요.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </div>
  );
}

export default LandingPage;
