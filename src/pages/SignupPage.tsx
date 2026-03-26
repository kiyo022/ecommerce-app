import { useState, type FC } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { signUp } from "../lib/auth";

const SignupPage: FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      // パスワード確認
      if (password !== confirmPassword) {
        setError("パスワードが一致しません");
        return;
      }

      // パスワード長チェック
      if (password.length < 6) {
        setError("パスワードは6文字以上である必要があります");
        return;
      }

      await signUp(email, password);

      // 登録成功時
      alert("登録が完了しました！ログインしてください。");
      navigate("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "登録に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term: string) => {
    navigate(`/?search=${term}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 ">
      <Navbar onSearch={handleSearch} />

      <div className="container mx-auto px-4 py-12 flex justify-center  ">
        <div className="max-w-md mx-auto">
          {/* ヘッダー */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">アカウント作成</h1>
            <p className="text-gray-600">
              新しいアカウントを作成して買い物を始める
            </p>
          </div>

          {/* エラーメッセージ */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
              {error}
            </div>
          )}

          {/* 登録フォーム */}
          <form
            onSubmit={handleSignup}
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
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@example.com"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
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
              <p className="text-sm text-gray-600 mt-2">
                6文字以上のパスワードを設定してください
              </p>
            </div>

            {/* パスワード確認 */}
            <div>
              <label className="block text-lg font-semibold mb-2">
                パスワード（確認）
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* 登録ボタン */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition font-semibold text-lg"
            >
              {loading ? "登録中..." : "アカウント作成"}
            </button>
          </form>

          {/* ログインリンク */}
          <div className="text-center mt-6">
            <p className="text-gray-600">
              既にアカウントをお持ちの方は
              <button
                onClick={() => navigate("/login")}
                className="text-blue-600 hover:underline font-semibold"
              >
                ログイン
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
