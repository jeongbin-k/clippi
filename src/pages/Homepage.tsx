import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import Header from "../components/Header";
import FeedbackModal from "../components/FeedbackModal";

interface Article {
  id: number;
  title: string;
  url: string;
  thumbnail: string | null;
  description: string | null;
  source: string;
  category: string;
  published_at: string;
}

function HomePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("전체");
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  const categories = ["전체", "개발", "IT뉴스", "비즈니스"];

  useEffect(() => {
    async function fetchArticles() {
      setLoading(true);
      let query = supabase
        .from("articles")
        .select("*")
        .order("published_at", { ascending: false })
        .limit(30);

      if (category !== "전체") {
        query = query.eq("category", category);
      }

      const { data, error } = await query;
      if (error) {
        console.error(error);
      } else if (data) {
        setArticles(data as Article[]);
      }
      setLoading(false);
    }
    fetchArticles();
  }, [category]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 카테고리 탭 */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition cursor-pointer ${
                category === cat
                  ? "bg-purple-600 text-white shadow-sm"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-purple-300 hover:text-purple-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 카드 그리드 */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse"
              >
                <div className="w-full h-44 bg-gray-200" />
                <div className="p-4">
                  <div className="h-3 bg-gray-200 rounded w-1/4 mb-3" />
                  <div className="h-4 bg-gray-200 rounded w-full mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-gray-400 text-lg">등록된 기사가 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <a // <-- 수정 완료!
                key={article.id}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition group"
              >
                {/* 썸네일 영역 */}
                <div className="relative h-44 overflow-hidden bg-gray-100">
                  {article.thumbnail ? (
                    <img
                      src={article.thumbnail}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.parentElement!.innerHTML = `<div class="w-full h-full bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center"><span class="text-3xl font-bold text-purple-200">${article.source[0]}</span></div>`;
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center">
                      <span className="text-3xl font-bold text-purple-200">
                        {article.source[0]}
                      </span>
                    </div>
                  )}
                </div>

                {/* 카드 내용 */}
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2 py-0.5 rounded">
                      {article.source}
                    </span>
                  </div>
                  <h2 className="text-base font-bold text-gray-900 line-clamp-2 group-hover:text-purple-600 transition-colors leading-snug h-11">
                    {article.title}
                  </h2>
                  {article.description && (
                    <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed h-8">
                      {article.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                    <span className="text-[11px] text-gray-400">
                      {article.published_at
                        ? new Date(article.published_at).toLocaleDateString(
                            "ko-KR",
                          )
                        : "방금 전"}
                    </span>
                    <span className="text-[11px] text-purple-500 font-bold opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                      READ MORE →
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
      <button
        onClick={() => setShowFeedbackModal(true)}
        className="fixed bottom-6 right-6 w-12 h-12 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition hover:scale-110 z-40 flex items-center justify-center text-xl cursor-pointer"
        title="피드백 보내기"
      >
        💬
      </button>

      {showFeedbackModal && (
        <FeedbackModal onClose={() => setShowFeedbackModal(false)} />
      )}
    </div>
  );
}

export default HomePage;
