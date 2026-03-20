import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

// 1. 인터페이스 정의 (수정된 테이블 컬럼에 맞춤)
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

  const categories = ["전체", "개발", "IT뉴스", "비즈니스"];

  useEffect(() => {
    async function fetchArticles() {
      setLoading(true); // 카테고리 바뀔 때 로딩 표시

      // 2. 쿼리 빌드 방식 수정
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
        console.error("Error fetching articles:", error);
      } else if (data) {
        setArticles(data as Article[]);
      }
      setLoading(false);
    }

    fetchArticles();
  }, [category]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-400">데이터를 가져오는 중...</p>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-purple-600 mb-8">Clippi</h1>

      {/* 카테고리 탭 */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
              category === cat
                ? "bg-purple-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 아티클 카드 목록 */}
      <div className="flex flex-col gap-4">
        {articles.length === 0 ? (
          <p className="text-center text-gray-400 py-10">
            등록된 기사가 없습니다.
          </p>
        ) : (
          articles.map((article) => (
            <a
              key={article.id}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition flex gap-4 group"
            >
              {article.thumbnail && (
                <img
                  src={article.thumbnail}
                  alt={article.title}
                  className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              )}
              <div className="flex flex-col justify-between flex-1 min-w-0">
                <div>
                  <span className="text-xs text-purple-500 font-bold">
                    {article.source}
                  </span>
                  <h2 className="text-base font-semibold text-gray-900 mt-1 line-clamp-2 group-hover:text-purple-600 transition-colors">
                    {article.title}
                  </h2>
                  {article.description && (
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {article.description}
                    </p>
                  )}
                </div>
                <span className="text-xs text-gray-400 mt-2">
                  {article.published_at
                    ? new Date(article.published_at).toLocaleDateString("ko-KR")
                    : "날짜 정보 없음"}
                </span>
              </div>
            </a>
          ))
        )}
      </div>
    </div>
  );
}

export default HomePage;
