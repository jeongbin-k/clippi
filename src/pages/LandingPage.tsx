import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import AuthModal from "../components/AuthModal";
import ClipCharacter from "../components/ClipCharacter";
import type { User } from "@supabase/supabase-js";

function LandingPage() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
      <header className="border-b border-gray-100 sticky top-0 bg-white z-100">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-purple-600">Clippi</h1>
          {/* 이미지 모달 */}
          {selectedImage && (
            <div
              className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
              onClick={() => setSelectedImage(null)}
            >
              <div
                className="relative max-w-5xl w-full"
                onClick={(e) => e.stopPropagation()}
              >
                {/* 닫기 버튼 */}
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute -top-10 right-0 text-white text-sm hover:text-gray-300 transition cursor-pointer"
                >
                  닫기 ✕
                </button>
                {/* 브라우저 프레임 */}
                <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-700">
                  <div className="bg-gray-800 px-4 py-3 flex items-center gap-2 border-b border-gray-700">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <div className="w-3 h-3 rounded-full bg-yellow-400" />
                      <div className="w-3 h-3 rounded-full bg-green-400" />
                    </div>
                    <div className="flex-1 mx-3">
                      <div className="bg-gray-700 rounded-md px-3 py-1 text-xs text-gray-400 text-center">
                        clippi.com
                      </div>
                    </div>
                  </div>
                  <img
                    src={selectedImage}
                    alt="스크린샷 크게 보기"
                    className="w-full object-cover"
                  />
                </div>
              </div>
            </div>
          )}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/feed")}
              className="text-sm text-gray-500 hover:text-purple-600 transition cursor-pointer"
            >
              뉴스 피드
            </button>
            {user ? (
              <button
                onClick={() => navigate("/dashboard")}
                className="text-sm bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition cursor-pointer"
              >
                내 북마크 →
              </button>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="text-sm bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition cursor-pointer"
              >
                시작하기
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 히어로 섹션 */}
      <section
        className="relative overflow-hidden py-24"
        style={{
          background:
            "linear-gradient(135deg, #faf5ff 0%, #ede9fe 50%, #f0fdf4 100%)",
        }}
      >
        <ClipCharacter position="bottom-center" size={64} color="#7c3aed" />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <span className="inline-block bg-white text-purple-600 text-xs font-medium px-3 py-1 rounded-full mb-6 border border-purple-100 shadow-sm">
            무료로 시작하세요
          </span>
          <h2 className="text-4xl font-bold text-gray-900 leading-tight mb-6">
            즐겨찾기는 이제 그만,
            <br />
            <span className="text-purple-600">스마트하게 저장하고</span>
            <br />
            어디서든 꺼내 쓰세요
          </h2>
          <p className="text-base text-gray-500 mb-10 leading-relaxed">
            크롬 즐겨찾기에 쌓인 링크들, 찾기 힘드셨죠?
            <br />
            Clippi에서 카테고리별로 정리하고 매일 업데이트되는 테크 뉴스도 함께
            즐기세요.
          </p>
          <div className="flex items-center justify-center gap-4">
            {user ? (
              <button
                onClick={() => navigate("/dashboard")}
                className="bg-purple-600 text-white px-8 py-3.5 rounded-xl font-medium hover:bg-purple-700 transition shadow-sm cursor-pointer"
              >
                내 북마크 보러가기 →
              </button>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="bg-purple-600 text-white px-8 py-3.5 rounded-xl font-medium hover:bg-purple-700 transition shadow-sm cursor-pointer"
              >
                무료로 시작하기
              </button>
            )}
            <button
              onClick={() => navigate("/feed")}
              className="text-gray-600 px-8 py-3.5 rounded-xl font-medium border border-gray-200 bg-white hover:border-purple-300 hover:text-purple-600 transition cursor-pointer"
            >
              뉴스 피드 보기
            </button>
          </div>
        </div>
      </section>

      {/* 왜 만들었나요 */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-4">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-4">
            왜 만들었나요?
          </h3>
          <p className="text-center text-gray-500 mb-12 leading-relaxed">
            직장을 다니면서 관리해야 할 사이트가 점점 늘어났어요.
            <br />
            크롬 즐겨찾기에 저장했지만 쌓이다 보니 찾기가 너무 힘들었죠.
            <br />
            그래서 직접 만들었어요.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="text-2xl mb-3">😤</div>
              <h4 className="font-semibold text-gray-900 mb-2">Before</h4>
              <p className="text-sm text-gray-500 leading-relaxed">
                크롬 즐겨찾기에 수십 개의 링크가 쌓여있고, 찾으려면 스크롤을
                한참 내려야 했어요. 다른 컴퓨터에서는 아예 접근이 안 되기도
                했고요.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-100">
              <div className="text-2xl mb-3">😊</div>
              <h4 className="font-semibold text-purple-600 mb-2">
                After — Clippi
              </h4>
              <p className="text-sm text-gray-500 leading-relaxed">
                카테고리별로 정리하고, 어느 컴퓨터에서든 로그인만 하면 바로 꺼내
                쓸 수 있어요. 매일 업데이트되는 테크 뉴스도 함께요.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 주요 기능 */}
      <section className="py-20 relative overflow-hidden">
        <ClipCharacter position="bottom-left" size={48} color="#6d28d9" />
        <div className="max-w-4xl mx-auto px-4">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-12">
            주요 기능
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
                🔖
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">
                스마트 북마크
              </h4>
              <p className="text-sm text-gray-500 leading-relaxed">
                URL만 붙여넣으면 제목과 썸네일이 자동으로 채워져요. 카테고리로
                깔끔하게 정리하세요.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
                📰
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">
                매일 업데이트 뉴스
              </h4>
              <p className="text-sm text-gray-500 leading-relaxed">
                카카오, 토스, 라인 등 국내 주요 기술 블로그와 IT 뉴스를 매일
                자동으로 모아드려요.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
                🌐
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">
                어디서든 접근
              </h4>
              <p className="text-sm text-gray-500 leading-relaxed">
                회사 컴퓨터, 집 컴퓨터, 어디서든 로그인만 하면 내 북마크를 바로
                꺼내 쓸 수 있어요.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 스크린샷 섹션 */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-4">
            실제 사용 화면
          </h3>
          <p className="text-center text-gray-500 mb-14">
            직접 써보세요. 이렇게 생겼어요.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-3">
              <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-200">
                <div className="bg-gray-100 px-4 py-3 flex items-center gap-2 border-b border-gray-200">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="flex-1 mx-3">
                    <div className="bg-white rounded-md px-3 py-1 text-xs text-gray-400 text-center">
                      clippi.com/dashboard
                    </div>
                  </div>
                </div>
                <img
                  src="/images/screenshot-dashboard.png"
                  alt="내 북마크 페이지"
                  className="w-full object-cover cursor-zoom-in hover:scale-105 transition-transform duration-300"
                  onClick={() =>
                    setSelectedImage("/images/screenshot-dashboard.png")
                  }
                />
              </div>
              <p className="text-sm text-center text-gray-500">
                카테고리별로 북마크를 깔끔하게 정리해요
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-200">
                <div className="bg-gray-100 px-4 py-3 flex items-center gap-2 border-b border-gray-200">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="flex-1 mx-3">
                    <div className="bg-white rounded-md px-3 py-1 text-xs text-gray-400 text-center">
                      clippi.com/dashboard
                    </div>
                  </div>
                </div>
                <img
                  src="/images/screenshot-bookmark.png"
                  alt="북마크 저장"
                  className="w-full object-cover cursor-zoom-in hover:scale-105 transition-transform duration-300"
                  onClick={() =>
                    setSelectedImage("/images/screenshot-bookmark.png")
                  }
                />
              </div>
              <p className="text-sm text-center text-gray-500">
                URL만 붙여넣으면 자동으로 정보가 채워져요
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-purple-600 py-20">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            지금 바로 시작해보세요
          </h3>
          <p className="text-purple-200 mb-8">
            무료로 가입하고 스마트한 북마크 생활을 시작하세요.
          </p>
          <button
            onClick={() =>
              user ? navigate("/dashboard") : setShowAuthModal(true)
            }
            className="bg-white text-purple-600 px-8 py-3.5 rounded-xl font-medium hover:bg-purple-50 transition cursor-pointer"
          >
            {user ? "내 북마크 보러가기 →" : "무료로 시작하기"}
          </button>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-400">© 2026 Clippi. Made by JB</p>
        </div>
      </footer>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </div>
  );
}

export default LandingPage;
