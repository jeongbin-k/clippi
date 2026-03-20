import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import AuthModal from "./AuthModal";
import type { User } from "@supabase/supabase-js";

function Header() {
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // 현재 로그인 상태 확인
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // 로그인/로그아웃 감지
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
          <h1 className="text-xl font-bold text-purple-600">Clippi</h1>
          {user ? (
            // 로그인 상태
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">{user.email}</span>
              <button
                className="text-sm text-gray-600 hover:text-purple-600 px-3 py-1.5 rounded-lg transition cursor-pointer"
                onClick={handleLogout}
              >
                로그아웃
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowModal(true)}
              className="text-sm text-gray-600 hover:text-purple-600 px-3 py-1.5 rounded-lg transition cursor-pointer "
            >
              로그인
            </button>
          )}
        </div>
      </header>
      {showModal && <AuthModal onClose={() => setShowModal(false)} />}
    </>
  );
}

export default Header;
