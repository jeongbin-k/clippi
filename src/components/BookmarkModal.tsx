import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

interface BookmarkModalProps {
  onClose: () => void;
  onSaved?: () => void;
  defaultUrl?: string;
  defaultTitle?: string;
  defaultThumbnail?: string;
  defaultDescription?: string;
}

function BookmarkModal({
  onClose,
  onSaved,
  defaultUrl = "",
  defaultTitle = "",
  defaultThumbnail = "",
  defaultDescription = "",
}: BookmarkModalProps) {
  const [url, setUrl] = useState(defaultUrl);
  const [title, setTitle] = useState(defaultTitle);
  const [description, setDescription] = useState(defaultDescription);
  const [thumbnail, setThumbnail] = useState(defaultThumbnail);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState("");

  // 기존 카테고리 불러오기
  useEffect(() => {
    async function fetchCategories() {
      const { data } = await supabase
        .from("bookmarks")
        .select("category")
        .not("category", "is", null);

      if (data) {
        const unique = [...new Set(data.map((d) => d.category))].filter(
          (c) => c !== "미분류",
        );
        setCategories(unique);
      }
    }
    fetchCategories();
  }, []);

  // URL 입력하면 og 메타데이터 자동 파싱
  async function handleUrlBlur() {
    if (!url || defaultUrl) return;
    if (!url.startsWith("http")) return;

    setFetching(true);
    try {
      const res = await fetch(
        `https://axdufnohiwjksqpodyhn.supabase.co/functions/v1/og-parser?url=${encodeURIComponent(url)}`,
        {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4ZHVmbm9oaXdqa3NxcG9keWhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5MDU5NTUsImV4cCI6MjA4OTQ4MTk1NX0.Xv9qgpsGkgcr9gf9fkHeobKOi5jVwjSo8FQ0rN10XHo`,
          },
        },
      );
      const data = await res.json();
      if (data.title) setTitle(data.title);
      if (data.description) setDescription(data.description);
      if (data.thumbnail) setThumbnail(data.thumbnail);
    } catch {
      // 파싱 실패해도 수동 입력 가능
    }
    setFetching(false);
  }

  async function handleSave() {
    if (!url) {
      setError("URL을 입력해주세요.");
      return;
    }
    if (!title) {
      setError("제목을 입력해주세요.");
      return;
    }

    setLoading(true);

    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      setError("로그인이 필요해요.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("bookmarks").insert({
      user_id: session.user.id,
      url,
      title,
      description,
      thumbnail,
      category: category || "미분류",
    });

    if (error) {
      console.error(error);
      setError("저장에 실패했어요. 다시 시도해주세요.");
    } else {
      onSaved?.();
      onClose();
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
        <h2 className="text-lg font-bold text-gray-900 mb-6">🔖 북마크 저장</h2>

        <div className="flex flex-col gap-4">
          {/* URL */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-500">URL</label>
            <input
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onBlur={handleUrlBlur}
              disabled={!!defaultUrl}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-purple-400 transition disabled:bg-gray-50"
            />
            {fetching && (
              <p className="text-xs text-purple-400">정보 불러오는 중...</p>
            )}
          </div>

          {/* 제목 */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-500">제목</label>
            <input
              type="text"
              placeholder="제목을 입력해주세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-purple-400 transition"
            />
          </div>

          {/* 카테고리 */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-500">
              카테고리
            </label>
            {/* 기존 카테고리 선택 */}
            {categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition cursor-pointer ${
                      category === cat
                        ? "bg-purple-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-purple-50 hover:text-purple-600"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
            <input
              type="text"
              placeholder="새 카테고리 입력 (예: 쇼핑몰, 디자인)"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-purple-400 transition"
            />
          </div>

          {/* 메모 */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-500">
              메모 <span className="text-gray-300">(선택)</span>
            </label>
            <textarea
              placeholder="간단한 메모를 남겨보세요"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
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
            className="flex-1 py-3 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition cursor-pointer"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 py-3 bg-purple-600 text-white text-sm font-medium rounded-xl hover:bg-purple-700 transition disabled:opacity-50 cursor-pointer"
          >
            {loading ? "저장 중..." : "저장"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookmarkModal;
