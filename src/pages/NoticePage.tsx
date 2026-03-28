import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import Header from "../components/Header";
import NoticeModal from "../components/NoticeModal";

interface Notice {
  id: string;
  title: string;
  content: string;
  tag: string;
  created_at: string;
}

const TAG_STYLE: Record<string, string> = {
  "새 기능": "bg-purple-50 text-purple-600",
  "버그 수정": "bg-red-50 text-red-500",
  공지: "bg-gray-100 text-gray-500",
};

function groupByMonth(notices: Notice[]) {
  return notices.reduce<Record<string, Notice[]>>((acc, notice) => {
    const key = new Date(notice.created_at).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
    });
    if (!acc[key]) acc[key] = [];
    acc[key].push(notice);
    return acc;
  }, {});
}

function NoticePage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Notice | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchNotices() {
      const { data, error } = await supabase
        .from("notices")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) setNotices(data as Notice[]);
      setLoading(false);
    }
    fetchNotices();
  }, []);

  const grouped = groupByMonth(notices);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* 타이틀 */}
        <div className="flex items-center gap-3 mb-10">
          <button
            onClick={() => navigate(-1)}
            className="text-[#212121] cursor-pointer"
          >
            ←
          </button>
          <h1 className="text-[21px] font-semibold text-gray-900">공지사항</h1>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : notices.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            등록된 공지사항이 없어요.
          </div>
        ) : (
          Object.entries(grouped).map(([month, items]) => (
            <div key={month} className="mb-10">
              {/* 월 헤더 */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-gray-800">{month}</h2>
                <span className="text-xs text-gray-400">{items.length}건</span>
              </div>
              <div className="h-px bg-gray-200 mb-4" />

              {/* 카드 목록 */}
              <div className="flex flex-col gap-3">
                {items.map((notice) => (
                  <button
                    key={notice.id}
                    onClick={() => setSelected(notice)}
                    className="text-left bg-white rounded-2xl px-6 py-5 shadow-sm border border-gray-100 hover:border-purple-200 hover:shadow-md transition-all duration-200 cursor-pointer group"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-gray-400">
                        {new Date(notice.created_at).toLocaleDateString(
                          "ko-KR",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          },
                        )}
                      </span>
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                          TAG_STYLE[notice.tag] ?? "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {notice.tag}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                      {notice.title}
                    </h3>
                  </button>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {selected && (
        <NoticeModal notice={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}

export default NoticePage;
