import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function StoryDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [story, setStory] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (typeof id === "string") {
      fetch(`/api/story/${id}`)
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            setError(data.error);
          } else {
            setStory(data);
          }
        })
        .catch(() => setError("동화 로딩 중 오류가 발생했습니다."));
    }
  }, [id]);

  if (error) {
    return <p className="text-red-500 text-center mt-10">{error}</p>;
  }

  if (!story) {
    return <p className="text-center mt-10 text-pink-600 font-semibold animate-bounce">동화를 불러오는 중입니다...</p>;
  }

  return (
    <div className="min-h-screen bg-pink-50 p-10 font-gowun text-gray-800">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-4">{story.title}</h1>
        <p className="text-sm text-center text-gray-500 mb-6">
          카테고리: {story.category} | 작성일: {new Date(story.createdAt).toLocaleDateString()}
        </p>
        <div className="whitespace-pre-line leading-loose text-lg">{story.content}</div>
      </div>
    </div>
  );
}
