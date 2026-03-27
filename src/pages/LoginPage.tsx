import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { login } from "../lib/auth";
import { isValidEmail } from "../utils/validation";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  const validateEmail = (value: string) => {
    if (value.trim() === "") {
      setEmailError(null);
    } else if (!isValidEmail(value)) {
      setEmailError("正しいメールアドレスを入力してください");
    } else {
      setEmailError(null);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      if (!email || !password) {
        setError("メールアドレスとパスワードを入力してください");
        return;
      }

      if (!isValidEmail(email)) {
        setError("正しいメールアドレスを入力してください");
        return;
      }

      await login(email, password);
      navigate("/");
    } catch (err) {
      const errorMessage =
        err instanceof Error &&
        err.message.includes("Invalid login credentials")
          ? "メールアドレスまたはパスワードが正しくありません"
          : err instanceof Error
            ? err.message
            : "ログインに失敗しました";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term: string) => {
    navigate(`/?search=${term}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onSearch={handleSearch} />

      <div className="container mx-auto px-4 py-12">
        {/* ヘッダー */}
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-2">ログイン</h1>
          <p className="text-gray-600">アカウントにログインして注文を続ける</p>
        </div>

        {/*  エラーメッセージ */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-1-4 border-red-500 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* ログインフォーム */}
        <form
          onSubmit={handleLogin}
          className="bg-white rounded-lg shadow-md p-8 space-y-6"
        >
          {/* メールアドレス */}
          <div>
            <label className="block text-lg font-semibold mb-2">
              メールアドレス
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                validateEmail(e.target.value);
              }}
              placeholder="example@example.com"
              required
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none ${
                emailError
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-300 focus:border-blue-500"
              }`}
            />
            {emailError && (
              <p className="text-red-500 text-sm mt-2">{emailError}</p>
            )}
          </div>
          {/* パスワード */}
          <div>
            <label className="block text-lg font-semibold mb-2">
              パスワード
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          {/* ログインボタン */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition font-semibold text-lg"
          >
            {loading ? "ログイン中..." : "ログイン"}
          </button>
        </form>
        {/* 登録リンク */}
        <div className="text-center mt-6">
          <p className="text-gray-600">
            アカウントをお持ちでない方は
            <button
              onClick={() => navigate("/signup")}
              className="text-blue-600 hover:underline font-semibold"
            >
              登録
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
