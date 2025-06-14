import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function MyPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [stories, setStories] = useState<any[]>([]);
  const [editing, setEditing] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    if (session) {
      fetch("/api/me")
        .then((res) => res.json())
        .then((data) => setUserInfo(data));

      fetch(`/api/my-stories?page=${page}&limit=${itemsPerPage}`)
        .then((res) => res.json())
        .then((data) => {
          setStories(data.stories);
          setTotalPages(data.totalPages);
        });
    }
  }, [session, page]);

  const handleUpdate = async () => {
    await fetch("/api/update-profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userInfo),
    });
    alert("정보가 수정되었습니다.");
    setEditing(false);
  };

  const handleDelete = async (id: string) => {
    const confirmed = confirm("정말 이 동화를 삭제하시겠습니까?");
    if (!confirmed) return;

    const res = await fetch("/api/delete-story", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      alert("동화가 삭제되었습니다.");
      setStories(stories.filter((s) => s.id !== id));
    } else {
      alert("삭제에 실패했습니다.");
    }
  };

  if (status === "loading") return <p>로딩 중...</p>;
  if (!session) {
    if (typeof window !== "undefined") router.push("/login");
    return null;
  }

  return (
    <div style={{ padding: "40px", maxWidth: "700px", margin: "0 auto" }}>
      <h1>마이페이지</h1>
      <p>
        안녕하세요, <strong>{session.user?.name || session.user?.email}</strong> 님!
      </p>

      {/* 사용자 정보 */}
      {userInfo && (
        <div style={{ marginTop: "20px" }}>
          <h3>📄 내 정보</h3>
          {editing ? (
            <ul style={{ listStyle: "none", padding: 0 }}>
              <li>
                이름:{" "}
                <input
                  type="text"
                  value={userInfo.name}
                  onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                />
              </li>
              <li>
                생년월일:{" "}
                <input
                  type="date"
                  value={userInfo.birthdate.slice(0, 10)}
                  onChange={(e) => setUserInfo({ ...userInfo, birthdate: e.target.value })}
                />
              </li>
              <li>
                성별:{" "}
                <input
                  type="text"
                  value={userInfo.gender}
                  onChange={(e) => setUserInfo({ ...userInfo, gender: e.target.value })}
                />
              </li>
              <li>
                전화번호:{" "}
                <input
                  type="text"
                  value={userInfo.phone}
                  onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                />
              </li>
            </ul>
          ) : (
            <ul>
              <li>이메일: {userInfo.email}</li>
              <li>생년월일: {new Date(userInfo.birthdate).toLocaleDateString("ko-KR")}</li>
              <li>성별: {userInfo.gender}</li>
              <li>전화번호: {userInfo.phone}</li>
            </ul>
          )}
          <div style={{ marginTop: "10px" }}>
            {editing ? (
              <>
                <button onClick={handleUpdate} style={{ marginRight: "10px" }}>
                  저장
                </button>
                <button onClick={() => setEditing(false)}>취소</button>
              </>
            ) : (
              <button onClick={() => setEditing(true)}>정보 수정</button>
            )}
          </div>
        </div>
      )}

      {/* 동화 목록 */}
      <div style={{ marginTop: "40px" }}>
        <h3>📚 내가 만든 동화 목록</h3>
        {stories.length > 0 ? (
          <>
            <ul>
              {stories.map((story, idx) => (
                <li
                  key={story.id}
                  style={{
                    marginBottom: "20px",
                    borderBottom: "1px solid #ccc",
                    paddingBottom: "10px",
                  }}
                >
                  <a href={`/story/${story.id}`} style={{ textDecoration: "none", color: "#333" }}>
                    <strong>{(page - 1) * itemsPerPage + idx + 1}.</strong> [{story.category}]
                    <br />
                    <strong>제목:</strong> {story.title}
                    <br />
                    <small>{new Date(story.createdAt).toLocaleString("ko-KR")}</small>
                  </a>
                  <br />
                  <button
                    onClick={() => handleDelete(story.id)}
                    style={{
                      marginTop: "5px",
                      color: "white",
                      backgroundColor: "red",
                      padding: "5px 10px",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    삭제
                  </button>
                </li>
              ))}
            </ul>

            {/* 페이지네이션 */}
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <button
                onClick={() => setPage(1)}
                disabled={page === 1}
                style={{
                  margin: "0 4px",
                  padding: "6px 10px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  backgroundColor: page === 1 ? "#eee" : "#fff",
                  cursor: page === 1 ? "not-allowed" : "pointer",
                }}
              >
                ⏮ 첫 페이지
              </button>

              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                style={{
                  margin: "0 4px",
                  padding: "6px 10px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  backgroundColor: page === 1 ? "#eee" : "#fff",
                  cursor: page === 1 ? "not-allowed" : "pointer",
                }}
              >
                ◀ 이전
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  style={{
                    margin: "0 4px",
                    padding: "6px 12px",
                    backgroundColor: p === page ? "#d1d5db" : "#fff",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  {p}
                </button>
              ))}

              <button
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
                style={{
                  margin: "0 4px",
                  padding: "6px 10px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  backgroundColor: page === totalPages ? "#eee" : "#fff",
                  cursor: page === totalPages ? "not-allowed" : "pointer",
                }}
              >
                다음 ▶
              </button>

              <button
                onClick={() => setPage(totalPages)}
                disabled={page === totalPages}
                style={{
                  margin: "0 4px",
                  padding: "6px 10px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  backgroundColor: page === totalPages ? "#eee" : "#fff",
                  cursor: page === totalPages ? "not-allowed" : "pointer",
                }}
              >
                마지막 ⏭
              </button>
            </div>
          </>
        ) : (
          <p>아직 생성한 동화가 없습니다.</p>
        )}
      </div>

      {/* 로그아웃 */}
      <button
        onClick={() => signOut()}
        style={{
          marginTop: "40px",
          padding: "10px 20px",
          backgroundColor: "#ef4444",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        로그아웃
      </button>
    </div>
  );
}
