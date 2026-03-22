import { useState } from "react";
import emailjs from "@emailjs/browser";

interface FeedbackModalProps {
  onClose: () => void;
}

function FeedbackModal({ onClose }: FeedbackModalProps) {
  const [fromName, setFromName] = useState("");
  const [fromEmail, setFromEmail] = useState("");
  const [subject, setSubject] = useState("피드백");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    if (!message) {
      setError("메시지를 입력해주세요.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          from_name: fromName || "익명",
          from_email: fromEmail || "미입력",
          subject,
          message,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
      );
      setSent(true);
    } catch {
      setError("전송에 실패했어요. 다시 시도해주세요.");
    }

    setLoading(false);
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-8 w-full max-w-md mx-4 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {sent ? (
          // 전송 완료 화면
          <div className="text-center py-4">
            {/* <div className="text-5xl mb-4">💌</div> */}
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              메일을 보냈어요!
            </h3>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              소중한 피드백 감사해요.
              <br />
              빠르게 확인하고 반영할게요 😊
            </p>
            <button
              onClick={onClose}
              className="w-full py-3 bg-purple-600 text-white text-sm font-medium rounded-xl hover:bg-purple-700 transition"
            >
              닫기
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-lg font-bold text-gray-900 mb-2">
              💬 피드백 보내기
            </h2>
            <p className="text-sm text-gray-400 mb-6">
              불편한 점이나 버그를 알려주세요. 빠르게 확인할게요!
            </p>

            <div className="flex flex-col gap-4">
              {/* 유형 선택 */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-500">
                  유형
                </label>
                <div className="flex gap-2">
                  {["피드백", "버그 신고", "기능 제안"].map((type) => (
                    <button
                      key={type}
                      onClick={() => setSubject(type)}
                      className={`flex-1 py-2 text-xs font-medium rounded-xl border transition ${
                        subject === type
                          ? "bg-purple-600 text-white border-purple-600"
                          : "bg-white text-gray-500 border-gray-200 hover:border-purple-300"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* 이름 */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-500">
                  이름 <span className="text-gray-300">(선택)</span>
                </label>
                <input
                  type="text"
                  placeholder="익명으로 보내도 돼요"
                  value={fromName}
                  onChange={(e) => setFromName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-purple-400 transition"
                />
              </div>

              {/* 이메일 */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-500">
                  이메일{" "}
                  <span className="text-gray-300">(답장 원하시면 입력)</span>
                </label>
                <input
                  type="email"
                  placeholder="Your Mail"
                  value={fromEmail}
                  onChange={(e) => setFromEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-purple-400 transition"
                />
              </div>

              {/* 메시지 */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-500">
                  메시지
                </label>
                <textarea
                  placeholder="어떤 점이 불편하셨나요? 자유롭게 적어주세요."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-purple-400 transition resize-none"
                />
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-xs mt-3 text-center">{error}</p>
            )}

            <div className="flex gap-3 mt-6">
              <button
                onClick={onClose}
                className="flex-1 py-3 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition"
              >
                취소
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 py-3 bg-purple-600 text-white text-sm font-medium rounded-xl hover:bg-purple-700 transition disabled:opacity-50"
              >
                {loading ? "전송 중..." : "보내기"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default FeedbackModal;
