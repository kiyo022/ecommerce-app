import { type FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../store/cartStore";

interface NavbarProps {
  onSearch: (term: string) => void;
}

const Navbar: FC<NavbarProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const cartItems = useCartStore((state) => state.items);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* ロゴ */}
        <div className="text-2xl font-bold text-blue-600">🛍️ ECommerce</div>

        {/* 検索バー */}
        <form onSubmit={handleSearch} className="flex-1 mx-8">
          <input
            type="text"
            placeholder="商品を検索..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchTerm(e.target.value)
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </form>

        {/* カートアイコン */}
        <div className="flex items-center gap-6">
          <button className="text-gray-600 hover:text-blue-600">
            👤 ログイン
          </button>
          <button
            onClick={() => navigate("/cart")}
            className="relative hover:opacity-80 transition"
          >
            <span className="text-2xl">🛒</span>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
