import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function StoryPage() {
  const router = useRouter();
  const { category } = router.query;
  const { data: session } = useSession();

  const [story, setStory] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (typeof category === "string" && category.length > 0) {
      setLoading(true);
      setError("");

      fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            setError(data.error);
            setStory("");
            setTitle("");
          } else {
            setTitle(data.title || "제목 없음");
            setStory(data.story || "동화 생성 실패");
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error("GPT API 호출 중 에러:", err);
          setError("동화 생성 중 오류 발생");
          setStory("");
          setTitle("");
          setLoading(false);
        });
    }
  }, [category]);

  const handleSave = async () => {
    if (!session) {
      alert("로그인이 필요합니다.");
      router.push("/login");
      return;
    }

    if (!title.trim() || !story.trim()) {
      alert("제목과 내용이 필요합니다.");
      return;
    }

    const res = await fetch("/api/save-story", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        category,
        content: story,
      }),
    });

    if (res.ok) {
      alert("동화가 저장되었습니다!");
    } else {
        alert("저장 실패");
    }
  };

  return (
    <div className="min-h-screen bg-yellow-50 text-gray-800 font-gowun flex flex-col">
      {/* 헤더 */}
      <header className="flex justify-between items-center py-4 px-6 bg-white shadow font-gowun">
        <h1 className="text-2xl font-bold text-pink-600 cursor-pointer" onClick={() => router.push("/")}>
          📖 동화나라
        </h1>
        <div className="text-sm flex gap-4">
          {session ? (
            <>
              <span>{session.user?.name || session.user?.email} 님</span>
              <Link href="/mypage" className="text-blue-700 font-semibold">마이페이지</Link>
              <button onClick={() => signOut()} className="text-red-500 font-semibold">로그아웃</button>
            </>
          ) : (
            <>
              <button onClick={() => router.push("/login")} className="text-blue-700 underline">로그인</button>
              <button onClick={() => router.push("/signup")} className="text-green-700 underline">회원가입</button>
            </>
          )}
        </div>
      </header>

      {/* 본문 */}
      <main className="flex-grow px-6 py-10 flex flex-col items-center text-center">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-4xl">
          <h2 className="text-2xl font-bold text-pink-700 mb-6">
            선택한 카테고리: <span className="text-black">{category}</span>
          </h2>

          {loading ? (
            <div className="text-lg text-pink-500 font-semibold animate-bounce">
              🧚‍♀️ 마법을 부리는 중입니다...
            </div>
          ) : error ? (
            <div className="text-red-500 mt-4 font-medium">{error}</div>
          ) : story && (
            <div className="flex flex-col items-center">
              {/* 제목 */}
              <input
                className="w-full max-w-3xl mb-4 p-3 border rounded text-xl font-bold text-center shadow bg-gray-100 cursor-not-allowed"
                type="text"
                value={title}
                readOnly
              />

              {/* 내용 */}
              <textarea
                className="w-full max-w-3xl mb-6 p-4 border rounded resize-none h-[500px] leading-loose text-lg shadow-inner bg-gray-50 whitespace-pre-line overflow-y-auto cursor-not-allowed"
                value={story}
                readOnly
              />

              {/* 저장 버튼 */}
              <button
                onClick={handleSave}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded shadow"
              >
                동화 저장하기
              </button>
            </div>
          )}
        </div>
      </main>

      {/* 푸터 */}
      <footer className="py-6 text-center text-sm text-gray-500 bg-white shadow-inner font-gowun">
        ⓒ 2025 동화나라. 모든 권리 보유.
      </footer>
    </div>
  );
}
