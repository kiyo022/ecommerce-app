import { useEffect, useState, type FC } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { logOut } from "../lib/auth";
import { supabase } from "../lib/supabase";
import { useCartStore } from "../store/cartStore";

interface NavbarProps {
  onSearch: (term: string) => void;
}

const Navbar: FC<NavbarProps> = ({ onSearch }) => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminLoading, setAdminLoading] = useState(true);
  const cartItems = useCartStore((state) => state.items);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) {
        setAdminLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("users")
          .select("is_admin")
          .eq("id", user.id)
          .single();

        if (error) throw error;
        setIsAdmin(data?.is_admin || false);
      } catch {
        setIsAdmin(false);
      } finally {
        setAdminLoading(false);
      }
    };

    checkAdmin();
  }, [user]);

  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/");
    } catch (err) {
      console.error("ログアウト失敗:", err);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm);
      setSearchTerm("");
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* ロゴ */}
        <button
          onClick={() => navigate("/")}
          className="text-2xl font-bold text-blue-600 hover:text-blue-700"
        >
          🛍️ ShopHub
        </button>

        {/* 検索バー */}
        <form onSubmit={handleSearch} className="flex-1 mx-8">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="商品を検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold"
            >
              検索
            </button>
          </div>
        </form>

        {/* ナビゲーション */}
        <div className="flex items-center gap-6">
          {/* カート */}
          <button
            onClick={() => navigate("/cart")}
            className="relative text-gray-600 hover:text-blue-600 text-2xl"
          >
            🛒
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {cartItems.length}
              </span>
            )}
          </button>

          {/* ユーザーメニュー */}
          {loading || adminLoading ? (
            <span className="text-gray-600">読み込み中...</span>
          ) : user ? (
            <>
              <span className="text-sm text-gray-600">{user.email}</span>
              {isAdmin && (
                <button
                  onClick={() => navigate("/admin")}
                  className="text-gray-600 hover:text-blue-600 font-semibold"
                  title="管理画面"
                >
                  🔧 管理
                </button>
              )}
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-blue-600"
              >
                ログアウト
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                className="text-gray-600 hover:text-blue-600"
              >
                ログイン
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="text-gray-600 hover:text-blue-600"
              >
                登録
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
