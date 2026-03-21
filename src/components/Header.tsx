import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import AuthModal from "./AuthModal";
import BookmarkModal from "./BookmarkModal";
import type { User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";

function Header() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showBookmarkModal, setShowBookmarkModal] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

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

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1
            onClick={() => navigate("/")}
            className="text-xl font-bold text-purple-600 cursor-pointer"
          >
            Clippi
          </h1>

          {user ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowBookmarkModal(true)}
                className="text-sm bg-purple-600 text-white px-3 py-1.5 rounded-lg hover:bg-purple-700 transition cursor-pointer"
              >
                + 북마크 저장
              </button>
              <button
                onClick={() => navigate("/dashboard")}
                className="text-sm text-gray-600 hover:text-purple-600 px-3 py-1.5 rounded-lg transition cursor-pointer"
              >
                내 북마크
              </button>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-400 hover:text-red-400 px-3 py-1.5 rounded-lg transition cursor-pointer"
              >
                로그아웃
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="text-sm text-gray-600 hover:text-purple-600 px-3 py-1.5 rounded-lg transition cursor-pointer"
            >
              로그인
            </button>
          )}
        </div>
      </header>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
      {showBookmarkModal && (
        <BookmarkModal onClose={() => setShowBookmarkModal(false)} />
      )}
    </>
  );
}

export default Header;
