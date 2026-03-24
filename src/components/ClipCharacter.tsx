import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useEffect } from "react";

interface ClipCharacterProps {
  position?: "bottom-left" | "bottom-right" | "bottom-center";
  size?: number;
  color?: string;
}

function ClipCharacter({
  position = "bottom-right",
  size = 48,
  color = "#7c3aed",
}: ClipCharacterProps) {
  // 1. 마우스 좌표 값 생성
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // 2. 쫀득한 움직임을 위한 스프링 설정 (stiffness와 damping으로 감도 조절 가능)
  const springConfig = { damping: 20, stiffness: 200 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // 3. 마우스 위치(-500~500)에 따라 눈동자가 움직일 범위(-2.5~2.5) 매핑
  const eyeMoveX = useTransform(smoothX, [-500, 500], [-2.5, 2.5]);
  const eyeMoveY = useTransform(smoothY, [-500, 500], [-1.5, 1.5]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // 화면 중앙 기준 좌표 계산
      const x = e.clientX - window.innerWidth / 2;
      const y = e.clientY - window.innerHeight / 2;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const positionStyles: Record<string, string> = {
    "bottom-left": "absolute bottom-0 left-25 animate-peek",
    "bottom-right": "absolute bottom-0 right-8 animate-peek",
    "bottom-center": "absolute bottom-0 left-1/2 -translate-x-1/2 animate-peek",
  };

  const eyeColor = "white";
  const pupilColor = color;

  return (
    <div className={positionStyles[position]} style={{ zIndex: 10 }}>
      <svg width={size} height={size * 0.7} viewBox="0 0 52 36" fill="none">
        {/* 몸체 */}
        <rect x="2" y="10" width="48" height="26" rx="13" fill={color} />

        {/* 눈 왼쪽 흰자 */}
        <circle cx="18" cy="22" r="7" fill={eyeColor} />
        {/* 눈 왼쪽 눈동자 (움직임 적용) */}
        <motion.g style={{ x: eyeMoveX, y: eyeMoveY }}>
          <circle cx="18" cy="22" r="3.5" fill={pupilColor} />
          <circle cx="19.5" cy="20.5" r="1.2" fill={eyeColor} opacity=".8" />
        </motion.g>

        {/* 눈 오른쪽 흰자 */}
        <circle cx="34" cy="22" r="7" fill={eyeColor} />
        {/* 눈 오른쪽 눈동자 (움직임 적용) */}
        <motion.g style={{ x: eyeMoveX, y: eyeMoveY }}>
          <circle cx="34" cy="22" r="3.5" fill={pupilColor} />
          <circle cx="35.5" cy="20.5" r="1.2" fill={eyeColor} opacity=".8" />
        </motion.g>

        {/* 클립 고리 */}
        <path
          d="M22 10V5C22 3.3 23.3 2 25 2H27C28.7 2 30 3.3 30 5V10"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </div>
  );
}

export default ClipCharacter;
