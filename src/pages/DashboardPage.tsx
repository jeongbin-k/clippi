import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

interface Bookmark {
  id: string;
  url: string;
  title: string;
  description: string | null;
  thumbnail: string | null;
  category: string;
  created_at: string;
}

function DashboardPage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  async function fetchBookmarks() {
    setLoading(true);
    const { data, error } = await supabase
      .from("bookmarks")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setBookmarks(data as Bookmark[]);
      // 카테고리 목록 추출 (중복 제거)
      const unique = [...new Set(data.map((b) => b.category))];
      setCategories(unique);
    }
    setLoading(false);
  }

  useEffect(() => {
    // 로그인 여부 확인
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        navigate("/");
        return;
      }
      fetchBookmarks();
    };

    checkUser();

    // 북마크 저장 이벤트 감지
    window.addEventListener("bookmark-saved", fetchBookmarks);
    return () => window.removeEventListener("bookmark-saved", fetchBookmarks);
  }, [navigate]);

  async function handleDelete(e: React.MouseEvent, id: string) {
    // 이벤트 전파 중단: 부모 <a> 태그의 링크 이동을 막음
    e.preventDefault();
    e.stopPropagation();

    if (!confirm("북마크를 삭제할까요?")) return;

    const { error } = await supabase.from("bookmarks").delete().eq("id", id);
    if (!error) {
      fetchBookmarks();
    } else {
      alert("삭제에 실패했습니다.");
    }
  }

  const filtered =
    selectedCategory === "전체"
      ? bookmarks
      : bookmarks.filter((b) => b.category === selectedCategory);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400 text-sm">불러오는 중...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 타이틀 영역 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">내 북마크</h1>
            <p className="text-sm text-gray-500 mt-1">
              저장된 링크들을 관리하세요.
            </p>
          </div>
          <span className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-500 shadow-sm">
            총 {bookmarks.length}개
          </span>
        </div>

        {/* 카테고리 탭 */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setSelectedCategory("전체")}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === "전체"
                ? "bg-purple-600 text-white shadow-md shadow-purple-100"
                : "bg-white text-gray-600 border border-gray-200 hover:border-purple-300 hover:text-purple-600"
            }`}
          >
            전체 {bookmarks.length}
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-purple-600 text-white shadow-md shadow-purple-100"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-purple-300 hover:text-purple-600"
              }`}
            >
              {cat} {bookmarks.filter((b) => b.category === cat).length}
            </button>
          ))}
        </div>

        {/* 북마크 목록 */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border-2 border-dashed border-gray-100">
            <p className="text-5xl mb-4">🔖</p>
            <p className="text-gray-500 font-medium">저장된 북마크가 없어요.</p>
            <p className="text-sm text-gray-400 mt-1">
              새로운 영감을 북마크에 추가해보세요!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((bookmark) => (
              <div
                key={bookmark.id}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100"
              >
                {/* 삭제 버튼 (우상단 플로팅) */}
                <button
                  onClick={(e) => handleDelete(e, bookmark.id)}
                  className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur shadow-sm hover:bg-red-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 text-gray-400 hover:text-red-500 z-20 border border-gray-100 cursor-pointer"
                  title="삭제하기"
                >
                  <span className="text-xs">✕</span>
                </button>

                <a
                  href={bookmark.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  {/* 썸네일 영역 */}
                  <div className="relative h-44 overflow-hidden bg-gray-50">
                    {bookmark.thumbnail ? (
                      <img
                        src={bookmark.thumbnail}
                        alt={bookmark.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center">
                        <span className="text-4xl font-bold text-purple-200 uppercase">
                          {bookmark.title?.[0] || "C"}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                  </div>

                  {/* 텍스트 컨텐츠 */}
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-purple-600 bg-purple-50 px-2.5 py-1 rounded-md">
                        {bookmark.category}
                      </span>
                    </div>
                    <h2 className="text-base font-bold text-gray-900 line-clamp-2 leading-snug group-hover:text-purple-600 transition-colors">
                      {bookmark.title}
                    </h2>
                    {bookmark.description && (
                      <p className="text-sm text-gray-500 mt-2 line-clamp-2 leading-relaxed">
                        {bookmark.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-50">
                      <span className="text-[11px] text-gray-400 font-medium">
                        {new Date(bookmark.created_at).toLocaleDateString(
                          "ko-KR",
                        )}
                      </span>
                      <span className="text-[11px] text-purple-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                        방문하기 →
                      </span>
                    </div>
                  </div>
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;
