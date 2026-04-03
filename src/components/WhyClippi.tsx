import { motion, type Variants } from "framer-motion";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.12,
      duration: 0.6,
      ease: "easeOut" as const,
    },
  }),
};

function BeforeMockup() {
  const items = [
    {
      color: "#e0e7ff",
      text: "나중에 읽기 - 리액트 훅 정리",
      date: "3달 전",
      opacity: 1,
    },
    {
      color: "#fef3c7",
      text: "https://velog.io/@user/post-asd...",
      date: "5달 전",
      opacity: 0.4,
    },
    {
      color: "#dcfce7",
      text: "참고자료2 (뭔지 모름)",
      date: "7달 전",
      opacity: 1,
    },
    { color: "#fce7f3", text: "중요!! 꼭 읽기", date: "1년 전", opacity: 0.4 },
    { color: "#f3f4f6", text: "제목 없음", date: "2년 전", opacity: 0.2 },
  ];

  return (
    <div className="bg-[#fafafa] border border-[#e5e7eb] rounded-2xl p-5">
      <div className="flex items-center gap-1.5 mb-4">
        <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
        <span className="text-[11px] text-gray-400 ml-2">즐겨찾기 목록</span>
      </div>
      <div className="flex flex-col gap-1.5">
        {items.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-2 bg-white border border-[#f3f4f6] rounded-lg px-3 py-2"
            style={{ opacity: item.opacity }}
          >
            <div
              className="w-3.5 h-3.5 rounded-[3px] flex-shrink-0"
              style={{ background: item.color }}
            />
            <span className="text-[12px] text-gray-700 truncate max-w-[180px]">
              {item.text}
            </span>
            <span className="text-[11px] text-gray-300 ml-auto flex-shrink-0">
              {item.date}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AfterMockup() {
  const cards = [
    { title: "React 훅 완벽 정리", url: "velog.io" },
    { title: "Figma 오토레이아웃", url: "figma.com" },
    { title: "카카오 기술 블로그", url: "tech.kakao.com" },
    { title: "토스 SLASH 발표", url: "toss.tech" },
  ];

  return (
    <div className="bg-[#f5f3ff] border-[1.5px] border-[#ddd6fe] rounded-2xl p-5">
      <div className="flex gap-1.5 mb-4 flex-wrap">
        {["전체", "개발", "디자인", "쇼핑몰", "맛집 블로그", "기타"].map(
          (tab, i) => (
            <span
              key={tab}
              className={`text-[11px] px-2.5 py-1 rounded-full cursor-default ${
                i === 0
                  ? "bg-[#7c3aed] text-white font-semibold"
                  : "bg-white text-gray-500 border border-[#e5e7eb]"
              }`}
            >
              {tab}
            </span>
          ),
        )}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {cards.map((card, i) => (
          <div
            key={i}
            className="bg-white rounded-xl p-3 border border-[#ede9fe]"
          >
            <div className="w-full h-9 bg-[#ede9fe] rounded-md mb-2 flex items-center justify-center">
              <div className="w-4 h-4 rounded-sm bg-[#c4b5fd]" />
            </div>
            <p className="text-[12px] font-semibold text-[#1e1b4b] mb-0.5 truncate">
              {card.title}
            </p>
            <p className="text-[10px] text-[#a78bfa]">{card.url}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function WhyClippi() {
  const rows = [
    {
      badge: "Before",
      badgeClass: "bg-[#f3f4f6] text-[#6b7280]",
      title: "즐겨찾기는\n결국 쓰레기통이 돼요",
      desc: "저장할 땐 편하지만, 쌓일수록 어디 있는지 모르게 되고 다른 기기에선 아예 볼 수도 없었어요.",
      points: [
        "폴더도 없고 검색도 안 되는 링크 더미",
        "집 PC에서 저장했는데 회사에서 못 찾음",
        "제목도 없고 언제 저장했는지도 모름",
      ],
      dotClass: "bg-[#d1d5db]",
      dividerClass: "bg-[#e5e7eb]",
      mockup: <BeforeMockup />,
      reverse: false,
    },
    {
      badge: "After — Clippi",
      badgeClass: "bg-[#f5f3ff] text-[#7c3aed] border border-[#ddd6fe]",
      title: "카테고리별로 정리된\n나만의 링크 공간",
      desc: "URL 하나만 붙여넣으면 제목·썸네일이 자동으로 채워지고, 어떤 기기에서든 바로 꺼내 쓸 수 있어요.",
      points: [
        "카테고리별 깔끔한 정리",
        "로그인 하나로 어디서든 접근",
        "제목·썸네일 자동 입력",
      ],
      dotClass: "bg-[#7c3aed]",
      dividerClass: "bg-[#c4b5fd]",
      mockup: <AfterMockup />,
      reverse: true,
    },
  ];

  return (
    <section className="bg-white py-[100px] px-8">
      <div className="max-w-[960px] mx-auto">
        {/* 헤더 */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={0}
          className="text-center mb-20"
        >
          <p className="text-[12px] font-bold text-[#a78bfa] tracking-[0.12em] uppercase mb-3">
            Why Clippi
          </p>
          <h2 className="text-[34px] font-extrabold text-[#1e1b4b] tracking-tight mb-3">
            직접 겪어서 만든 서비스예요
          </h2>
          <p className="text-[15px] text-[#6b7280] leading-[1.8]">
            크롬 즐겨찾기에 수십 개 쌓인 링크, 찾을 때마다 스크롤만 했었죠.
          </p>
        </motion.div>

        {/* 행 */}
        <div className="flex flex-col gap-28">
          {rows.map((row, i) => (
            <div
              key={i}
              className={`flex flex-col md:flex-row items-center gap-16 ${
                row.reverse ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* 텍스트 */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={0}
                className="flex-1"
              >
                <span
                  className={`inline-block text-[11px] font-bold tracking-[0.08em] uppercase px-3 py-1 rounded-full mb-4 ${row.badgeClass}`}
                >
                  {row.badge}
                </span>
                <div
                  className={`w-12 h-0.5 rounded-full mb-5 ${row.dividerClass}`}
                />
                <h3 className="text-[26px] font-extrabold text-[#1e1b4b] leading-[1.3] tracking-tight mb-4 whitespace-pre-line">
                  {row.title}
                </h3>
                <p className="text-[15px] text-[#6b7280] leading-[1.85] mb-6">
                  {row.desc}
                </p>
                <ul className="flex flex-col gap-3">
                  {row.points.map((point, j) => (
                    <li
                      key={j}
                      className="flex items-start gap-2.5 text-[14px] text-[#374151]"
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full mt-[5px] flex-shrink-0 ${row.dotClass}`}
                      />
                      {point}
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* 목업 */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={1}
                className="flex-1 w-full"
              >
                {row.mockup}
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
