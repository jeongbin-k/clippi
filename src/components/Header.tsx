import { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";
import AuthModal from "./AuthModal";
import BookmarkModal from "./BookmarkModal";
import Toast from "./Toast";
import type { User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";

function Header() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showBookmarkModal, setShowBookmarkModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      subscription.unsubscribe();
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    setShowDropdown(false);
    navigate("/");
  }

  async function handleDeleteAccount() {
    if (!confirm("정말 탈퇴하시겠어요? 모든 북마크가 삭제돼요.")) return;
    const { error } = await supabase.rpc("delete_user");
    if (error) {
      alert("탈퇴에 실패했어요. 다시 시도해주세요.");
    } else {
      await supabase.auth.signOut();
      navigate("/");
    }
  }

  function handleSaved() {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
    window.dispatchEvent(new CustomEvent("bookmark-saved"));
  }

  const navLinks = [
    { label: "서비스 소개", path: "/" },
    { label: "뉴스 피드", path: "/feed" },
    { label: "공지사항", path: "/notice" },
  ];

  return (
    <>
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* 좌측: 로고 + 네비 */}
          <div className="flex items-center gap-8">
            <h1
              onClick={() => navigate("/")}
              className="text-xl font-bold text-purple-600 cursor-pointer"
            >
              Clippi
            </h1>
            <nav className="flex items-center gap-1">
              {navLinks.map(({ label, path }) => (
                <button
                  key={path}
                  onClick={() => navigate(path)}
                  className="text-sm text-gray-500 hover:text-purple-600 px-3 py-2 rounded-lg transition-colors cursor-pointer"
                >
                  {label}
                </button>
              ))}
            </nav>
          </div>

          {/* 우측: 액션 */}
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <button
                  onClick={() => setShowBookmarkModal(true)}
                  className="text-sm bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition cursor-pointer font-medium"
                >
                  + 북마크 저장
                </button>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="text-sm text-gray-500 hover:text-purple-600 px-3 py-2 rounded-lg transition cursor-pointer"
                >
                  내 북마크
                </button>

                {/* 프로필 드롭다운 */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center hover:bg-purple-200 transition cursor-pointer ml-1"
                  >
                    <span className="text-sm font-medium text-purple-600">
                      {user.email?.[0].toUpperCase()}
                    </span>
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 top-10 w-48 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden z-20">
                      <div className="px-4 py-3 border-b border-gray-50">
                        <p className="text-xs text-gray-400 truncate">
                          {user.email}
                        </p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 transition cursor-pointer"
                      >
                        로그아웃
                      </button>
                      <button
                        onClick={handleDeleteAccount}
                        className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-50 transition cursor-pointer"
                      >
                        회원탈퇴
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="text-sm text-gray-500 hover:text-purple-600 px-3 py-2 rounded-lg transition cursor-pointer"
              >
                로그인
              </button>
            )}
          </div>
        </div>
      </header>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
      {showBookmarkModal && (
        <BookmarkModal
          onClose={() => setShowBookmarkModal(false)}
          onSaved={handleSaved}
        />
      )}
      {showToast && (
        <Toast
          message="북마크 저장됐어요!"
          subMessage="내 북마크에서 확인하세요"
          actionLabel="보러가기"
          onAction={() => {
            setShowToast(false);
            navigate("/dashboard");
          }}
          onClose={() => setShowToast(false)}
        />
      )}
    </>
  );
}

export default Header;
