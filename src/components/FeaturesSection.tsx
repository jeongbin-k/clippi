import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// 목업 데이터
const TABS = [
  { num: "01", ko: "스마트 북마크" },
  { num: "02", ko: "매일 업데이트 뉴스" },
  { num: "03", ko: "어디서든 접근" },
];

const PANELS = [
  {
    en: "Smart Bookmark",
    title: "URL 하나면 끝,\n자동으로 채워집니다.",
    // desc: "주소만 붙여넣으면 제목·설명·썸네일이 자동으로 채워지고, 카테고리별로 깔끔하게 정리돼요.",
    features: [
      {
        name: "URL 자동 미리보기",
        sub: "제목·설명·파비콘을 자동으로 불러와요",
      },
      {
        name: "카테고리 정리",
        sub: "직접 분류하거나 자동 태그를 선택할 수 있어요",
      },
      {
        name: "즐겨찾기 완전 대체",
        sub: "브라우저 북마크보다 훨씬 보기 편해요",
      },
    ],
  },
  {
    en: "News Feed",
    title: "테크 트렌드,\n놓치지 마세요.",
    // desc: "카카오·토스·라인 등 주요 기술 블로그와 IT 뉴스를 매일 자동으로 모아 한눈에 보여드려요.",
    features: [
      { name: "기술 블로그 피드", sub: "카카오·토스·라인·네이버 등 자동 수집" },
      { name: "매일 자동 업데이트", sub: "별도 설정 없이 최신 글이 쌓여요" },
      { name: "카테고리 필터", sub: "회사별·주제별로 골라서 볼 수 있어요" },
    ],
  },
  {
    en: "Anywhere Access",
    title: "어디서든,\n바로 꺼내 쓰세요.",
    // desc: "회사든 집이든, 로그인 하나로 내 모든 북마크를 즉시 꺼내 쓸 수 있어요.",
    features: [
      { name: "멀티 디바이스", sub: "PC·모바일 어디서나 동일한 환경" },
      {
        name: "클라우드 실시간 동기화",
        sub: "저장하는 순간 모든 기기에 반영돼요",
      },
      { name: "Supabase 보안 저장", sub: "내 북마크는 나만 볼 수 있어요" },
    ],
  },
];

const AUTO_MS = 5000;

// 체크 아이콘
function CheckIcon() {
  return (
    <svg viewBox="0 0 10 10" fill="none" className="w-[10px] h-[10px]">
      <path
        d="M2 5l2 2 4-4"
        stroke="#7c3aed"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// 메인 컴포넌트
export default function FeaturesSection() {
  const [current, setCurrent] = useState(0);
  const [progressKey, setProgressKey] = useState(0);
  const autoTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startAuto = () => {
    if (autoTimer.current) clearInterval(autoTimer.current);
    autoTimer.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % TABS.length);
      setProgressKey((k) => k + 1);
    }, AUTO_MS);
  };

  useEffect(() => {
    startAuto();
    return () => {
      if (autoTimer.current) clearInterval(autoTimer.current);
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
    };
  }, []);

  const handleTabClick = (idx: number) => {
    setCurrent(idx);
    setProgressKey((k) => k + 1);
    if (autoTimer.current) clearInterval(autoTimer.current);
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(startAuto, 8000);
  };

  return (
    <section className="bg-[#faf5ff] py-[100px] px-8">
      {/* 헤더 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-[72px]"
      >
        <p className="text-[12px] font-bold text-[#a78bfa] tracking-[0.12em] uppercase mb-3">
          Why Clippi
        </p>
        <h2 className="text-[clamp(28px,4vw,38px)] font-extrabold text-[#1e1b4b] tracking-[-0.03em] leading-[1.2]">
          딱 필요한 것만 담았어요
        </h2>
      </motion.div>

      {/* 바디 */}
      <div className="max-w-[960px] mx-auto grid grid-cols-1 md:grid-cols-[260px_1fr] gap-0">
        {/* 좌: 탭 목록 */}
        <div className="flex flex-col gap-[2px] md:sticky md:top-8 self-start">
          {TABS.map((tab, idx) => (
            <button
              key={idx}
              onClick={() => handleTabClick(idx)}
              className={`relative flex items-center gap-4 px-5 py-[18px] rounded-[14px] text-left overflow-hidden transition-colors duration-200 cursor-pointer
                ${
                  current === idx
                    ? "bg-purple-600/8"
                    : "bg-transparent hover:bg-purple-600/5"
                }`}
            >
              {/* 왼쪽 액센트 바 */}
              <motion.span
                className="absolute left-0 top-0 bottom-0 w-[3px] rounded-[0_3px_3px_0] bg-purple-600"
                initial={false}
                animate={{ scaleY: current === idx ? 1 : 0 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                style={{ transformOrigin: "center" }}
              />

              <span
                className={`text-[11px] font-bold min-w-[20px] transition-colors duration-200
                  ${current === idx ? "text-purple-600" : "text-[#c4b5fd]"}`}
              >
                {tab.num}
              </span>

              <span
                className={`text-[15px] font-bold transition-colors duration-200
                  ${current === idx ? "text-[#1e1b4b]" : "text-[#9d8dbb]"}`}
              >
                {tab.ko}
              </span>

              {/* 진행 바 */}
              {current === idx && (
                <motion.span
                  key={progressKey}
                  className="absolute bottom-0 left-0 h-[2px] bg-purple-600 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: AUTO_MS / 1000, ease: "linear" }}
                />
              )}
            </button>
          ))}
        </div>

        {/* 우: 패널 */}
        <div className="relative pl-0 md:pl-14 md:border-l md:border-purple-600/12 mt-8 md:mt-0 min-h-[480px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* 영문 뱃지 */}
              <div className="flex items-center gap-[6px] text-[11px] font-bold tracking-[0.12em] uppercase text-[#a78bfa] mb-3">
                <span className="w-[5px] h-[5px] rounded-full bg-[#a78bfa] animate-pulse" />
                {PANELS[current].en}
              </div>

              {/* 제목 */}
              <h3 className="text-[clamp(22px,3vw,28px)] font-extrabold text-[#1e1b4b] tracking-[-0.03em] leading-[1.25] mb-[34px] whitespace-pre-line">
                {PANELS[current].title}
              </h3>

              {/* 설명 */}
              {/* <p className="text-[15px] text-[#6d5f99] leading-[1.75] mb-8 max-w-[460px]">
                {PANELS[current].desc}
              </p> */}

              {/* 기능 리스트 */}
              <div className="flex flex-col gap-[14px]">
                {PANELS[current].features.map((feat, i) => (
                  <motion.div
                    key={feat.name}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08, duration: 0.35 }}
                    whileHover={{ x: 4 }}
                    className="flex items-start gap-[14px] px-5 py-4 rounded-[14px] border border-purple-600/10 bg-white cursor-default transition-shadow hover:border-purple-600/25 hover:shadow-[0_4px_20px_rgba(124,58,237,0.07)]"
                  >
                    <span className="w-5 h-5 rounded-full bg-purple-600/10 flex items-center justify-center flex-shrink-0 mt-[1px]">
                      <CheckIcon />
                    </span>
                    <div>
                      <div className="text-[14px] font-bold text-[#1e1b4b] mb-[2px]">
                        {feat.name}
                      </div>
                      <div className="text-[12px] text-[#9d8dbb] leading-[1.5]">
                        {feat.sub}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
