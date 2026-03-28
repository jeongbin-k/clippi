import { useEffect } from "react";

interface Notice {
  id: string;
  title: string;
  content: string;
  tag: string;
  created_at: string;
}

const TAG_STYLE: Record<string, string> = {
  "새 기능": "bg-purple-50 text-purple-600",
  "버그 수정": "bg-red-50 text-red-500",
  공지: "bg-gray-100 text-gray-500",
};

interface Props {
  notice: Notice;
  onClose: () => void;
}

function NoticeModal({ notice, onClose }: Props) {
  // ESC 키로 닫기
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      onClick={onClose}
    >
      {/* 백드롭 */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

      {/* 모달 본체 */}
      <div
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all cursor-pointer"
        >
          ✕
        </button>

        {/* 태그 + 날짜 */}
        <div className="flex items-center gap-2 mb-3">
          <span
            className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
              TAG_STYLE[notice.tag] ?? "bg-gray-100 text-gray-500"
            }`}
          >
            {notice.tag}
          </span>
          <span className="text-xs text-gray-400">
            {new Date(notice.created_at).toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>

        {/* 제목 */}
        <h2 className="text-base font-semibold text-gray-900 mb-4">
          {notice.title}
        </h2>

        {/* 구분선 */}
        <div className="h-px bg-gray-100 mb-4" />

        {/* 내용 */}
        <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
          {notice.content}
        </p>
      </div>
    </div>
  );
}

export default NoticeModal;
