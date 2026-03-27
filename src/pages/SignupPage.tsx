import { useState, type FC } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { signUp } from "../lib/auth";
import {
  isValidEmail,
  isValidPassword,
  passwordsMatch,
} from "../utils/validation";

interface ValidationErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const SignupPage: FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {},
  );

  const validateField = (field: string, value: string) => {
    let fieldError: string | null = null;

    switch (field) {
      case "email":
        if (value.trim() === "") {
          fieldError = null;
        } else if (!isValidEmail(value)) {
          fieldError = "正しいメールアドレスを入力してください";
        }
        break;
      case "password":
        if (value.trim() === "") {
          fieldError = null;
        } else if (!isValidPassword(value)) {
          fieldError = "パスワードは6文字以上である必要があります";
        }
        break;
      case "confirmPassword":
        if (value.trim() === "" || password.trim() === "") {
          fieldError = null;
        } else if (!passwordsMatch(password, value)) {
          fieldError = "パスワードが一致しません";
        }
        break;
    }

    setValidationErrors((prev) => ({
      ...prev,
      [field]: fieldError,
    }));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      // 最終バリデーション
      const newErrors: ValidationErrors = {};

      if (!email.trim()) {
        newErrors.email = "メールアドレスを入力してください";
      } else if (!isValidEmail(email)) {
        newErrors.email = "正しいメールアドレスを入力してください";
      }

      if (!password.trim()) {
        newErrors.password = "パスワードを入力してください";
      } else if (!isValidPassword(password)) {
        newErrors.password = "パスワードは6文字以上である必要があります";
      }

      if (!confirmPassword.trim()) {
        newErrors.confirmPassword = "パスワード確認を入力してください";
      } else if (!passwordsMatch(password, confirmPassword)) {
        newErrors.confirmPassword = "パスワードが一致しません";
      }

      setValidationErrors(newErrors);

      if (Object.keys(newErrors).length > 0) {
        return;
      }

      await signUp(email, password);

      // 登録成功時
      alert("登録が完了しました！ログインしてください。");
      navigate("/login");
    } catch (err) {
      const errorMessage =
        err instanceof Error && err.message.includes("already registered")
          ? "このメールアドレスは既に登録されています"
          : err instanceof Error
            ? err.message
            : "登録に失敗しました";
      setError(errorMessage);
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
                onChange={(e) => {
                  setEmail(e.target.value);
                  validateField("email", e.target.value);
                }}
                placeholder="example@example.com"
                required
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none ${
                  validationErrors.email
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-300 focus:border-blue-500"
                }`}
              />
              {validationErrors.email && (
                <p className="text-red-500 text-sm mt-2">
                  {validationErrors.email}
                </p>
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
                onChange={(e) => {
                  setPassword(e.target.value);
                  validateField("password", e.target.value);
                  if (confirmPassword) {
                    validateField("confirmPassword", confirmPassword);
                  }
                }}
                placeholder="••••••••"
                required
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none ${
                  validationErrors.password
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-300 focus:border-blue-500"
                }`}
              />
              {validationErrors.password && (
                <p className="text-red-500 text-sm mt-2">
                  {validationErrors.password}
                </p>
              )}
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
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  validateField("confirmPassword", e.target.value);
                }}
                placeholder="••••••••"
                required
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none ${
                  validationErrors.confirmPassword
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-300 focus:border-blue-500"
                }`}
              />
              {validationErrors.confirmPassword && (
                <p className="text-red-500 text-sm mt-2">
                  {validationErrors.confirmPassword}
                </p>
              )}
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
