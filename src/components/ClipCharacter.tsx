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
  const positionStyles: Record<string, string> = {
    "bottom-left": "absolute bottom-0 left-50 animate-peek",
    "bottom-right": "absolute bottom-0 right-8 animate-peek",
    "bottom-center": "absolute bottom-0 left-1/2 -translate-x-1/2 animate-peek",
  };

  const eyeColor = "white";
  const pupilColor = color;

  return (
    <div className={positionStyles[position]} style={{ zIndex: 10 }}>
      <svg width={size} height={size * 0.7} viewBox="0 0 52 36" fill="none">
        <rect x="2" y="10" width="48" height="26" rx="13" fill={color} />
        {/* 눈 왼쪽 */}
        <circle cx="18" cy="22" r="7" fill={eyeColor} />
        <circle cx="20" cy="21" r="3.5" fill={pupilColor} />
        <circle cx="21.5" cy="19.5" r="1.2" fill={eyeColor} opacity=".8" />
        {/* 눈 오른쪽 */}
        <circle cx="34" cy="22" r="7" fill={eyeColor} />
        <circle cx="36" cy="21" r="3.5" fill={pupilColor} />
        <circle cx="37.5" cy="19.5" r="1.2" fill={eyeColor} opacity=".8" />
        {/* 클립 고리 */}
        <path
          d="M22 10V5C22 3.3 23.3 2 25 2H27C28.7 2 30 3.3 30 5V10"
          stroke={color}
          stroke-width="2.5"
          stroke-linecap="round"
          fill="none"
        />
      </svg>
    </div>
  );
}

export default ClipCharacter;
