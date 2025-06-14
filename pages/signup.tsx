import { useState } from "react";
import { useRouter } from "next/router";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    birthdate: "",
    gender: "",
    phone: "",
  });
  const [error, setError] = useState("");

  const handleSignup = async () => {
    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      alert("회원가입 완료! 로그인 해주세요.");
      router.push("/login");
    } else {
      setError(data.message || "회원가입 실패");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <h1 className="text-2xl font-bold mb-4">회원가입</h1>

      <input
        type="text"
        placeholder="이름"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="mb-2 p-2 border rounded w-64"
      />

      <input
        type="email"
        placeholder="이메일 (아이디)"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className="mb-2 p-2 border rounded w-64"
      />

      <input
        type="password"
        placeholder="비밀번호"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        className="mb-2 p-2 border rounded w-64"
      />

      <input
        type="date"
        placeholder="생년월일"
        value={form.birthdate}
        onChange={(e) => setForm({ ...form, birthdate: e.target.value })}
        className="mb-2 p-2 border rounded w-64"
      />

      <select
        value={form.gender}
        onChange={(e) => setForm({ ...form, gender: e.target.value })}
        className="mb-2 p-2 border rounded w-64"
      >
        <option value="">성별 선택</option>
        <option value="남성">남성</option>
        <option value="여성">여성</option>
      </select>

      <input
        type="tel"
        placeholder="전화번호 (예: 010-1234-5678)"
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
        className="mb-4 p-2 border rounded w-64"
      />

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <button
        onClick={handleSignup}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        회원가입
      </button>
    </div>
  );
}
