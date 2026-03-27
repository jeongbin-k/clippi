import { useState } from "react";
import { supabase } from "../lib/supabase";

interface AuthModalProps {
  onClose: () => void;
}

function AuthModal({ onClose }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState(
    () => localStorage.getItem("savedEmail") ?? "",
  );
  const [remember, setRemember] = useState(
    () => !!localStorage.getItem("savedEmail"),
  );
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  async function handleSubmit() {
    setError("");

    if (mode === "signup" && password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (password.length < 6) {
      setError("비밀번호는 6자 이상이어야 합니다.");
      return;
    }

    setLoading(true);

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError("이메일 또는 비밀번호가 틀렸습니다.");
      } else {
        if (remember) localStorage.setItem("savedEmail", email);
        else localStorage.removeItem("savedEmail");
        onClose();
      }
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setError("회원가입에 실패했어요. 다시 시도해주세요.");
      else setEmailSent(true);
    }

    setLoading(false);
  }

  function handleModeChange(newMode: "login" | "signup") {
    setMode(newMode);
    setError("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setEmailSent(false);
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-10 w-full max-w-sm mx-4 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 이메일 인증 안내 화면 */}
        {emailSent ? (
          <div className="text-center py-4">
            <div className="text-5xl mb-4">📧</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              이메일을 확인해주세요!
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed mb-2">
              <span className="font-medium text-purple-600">{email}</span>
              <br />
              으로 인증 메일을 보내드렸어요.
            </p>
            <p className="text-sm text-gray-400 mb-8">
              메일의 링크를 클릭하면 가입이 완료돼요!
            </p>
            <button
              onClick={async () => {
                await supabase.auth.resend({ type: "signup", email });
                alert("메일을 다시 보냈어요!");
              }}
              className="w-full py-3 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition mb-3 cursor-pointer"
            >
              메일 다시 보내기
            </button>
            <button
              onClick={onClose}
              className="w-full py-3 bg-purple-600 text-white text-sm font-medium rounded-xl hover:bg-purple-700 transition cursor-pointer"
            >
              닫기
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-purple-600 text-center mb-8">
              Clippi
            </h2>

            <div className="flex bg-gray-100 rounded-xl p-1 mb-8">
              <button
                onClick={() => handleModeChange("login")}
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition cursor-pointer ${
                  mode === "login"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500"
                }`}
              >
                로그인
              </button>
              <button
                onClick={() => handleModeChange("signup")}
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition cursor-pointer ${
                  mode === "signup"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500"
                }`}
              >
                회원가입
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-500">
                  이메일
                </label>
                <input
                  type="email"
                  placeholder="Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-purple-400 transition"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-500">
                  비밀번호
                </label>
                <input
                  type="password"
                  placeholder="6자 이상 입력해주세요"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && mode === "login" && handleSubmit()
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-purple-400 transition"
                />
              </div>

              {mode === "signup" && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-gray-500">
                    비밀번호 확인
                  </label>
                  <input
                    type="password"
                    placeholder="비밀번호를 다시 입력해주세요"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-purple-400 transition"
                  />
                </div>
              )}
            </div>

            {error && (
              <p className="text-red-500 text-xs mt-4 text-center">{error}</p>
            )}

            {mode === "login" && (
              <div className="flex items-center gap-2 mt-4">
                <input
                  type="checkbox"
                  id="remember"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 accent-purple-600 cursor-pointer"
                />
                <label
                  htmlFor="remember"
                  className="text-xs text-gray-500 cursor-pointer"
                >
                  아이디 저장
                </label>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full mt-6 py-3.5 bg-purple-600 text-white text-sm font-medium rounded-xl hover:bg-purple-700 transition disabled:opacity-50 cursor-pointer"
            >
              {loading
                ? "로그인 중..."
                : mode === "login"
                  ? "로그인"
                  : "회원가입"}
            </button>

            <p className="text-center text-xs text-gray-400 mt-5">
              {mode === "login" ? (
                <>
                  회원이 아니신가요?{" "}
                  <button
                    onClick={() => handleModeChange("signup")}
                    className="text-purple-500 font-medium hover:underline cursor-pointer"
                  >
                    회원가입
                  </button>
                </>
              ) : (
                <>
                  이미 계정이 있으신가요?{" "}
                  <button
                    onClick={() => handleModeChange("login")}
                    className="text-purple-500 font-medium hover:underline cursor-pointer"
                  >
                    로그인
                  </button>
                </>
              )}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default AuthModal;
