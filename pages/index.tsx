import { useRouter } from "next/router";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

const categories = [
  "🐻 동물", "🗺️ 모험", "🤝 우정", "📚 교훈", "👨‍👩‍👧 가족", "🧚 판타지",
  "🦁 용기", "🌿 환경", "🧪 과학", "🪄 마법", "💖 사랑", "⏳ 시간 여행"
];

export default function Home() {
  const router = useRouter();
  const { data: session } = useSession();

  // ✅ 이모지를 제거하고 category만 전달
  const handleCategoryClick = (category: string) => {
    const pureCategory = category.replace(/^[^\s]+\s/, ""); // 이모지 제거
    router.push(`/story?category=${encodeURIComponent(pureCategory)}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff1e6] via-[#fffbea] to-[#fde2ff] text-gray-800 font-gowun px-6 py-10">
      <div className="flex justify-end gap-4 mb-6 text-sm">
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

      <h1 className="text-4xl font-bold text-center mb-10 text-pink-700">동화 카테고리를 선택하세요</h1>

      <div className="flex flex-wrap justify-center gap-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryClick(cat)}
            className="px-6 py-3 bg-gradient-to-r from-yellow-100 to-pink-100 text-lg rounded-3xl shadow-lg hover:scale-110 transition-all duration-300 border border-yellow-300"
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
