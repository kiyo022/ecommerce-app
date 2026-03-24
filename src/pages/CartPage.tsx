import { type FC } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useCartStore } from "../store/cartStore";

const CartPage: FC = () => {
  const navigate = useNavigate();
  // カート内の商品情報を取得
  const cartItems = useCartStore((state) => state.items);
  // カートから商品を削除する関数
  const removeItem = useCartStore((state) => state.removeItem);
  // カート内の商品数量を更新する関数
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  // カート内の合計金額を取得する関数
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);

  // 商品検索のための関数
  const handleSearch = (term: string) => {
    navigate(`/?search=${term}`);
  };

  // カート内の合計金額を取得
  const totalPrice = getTotalPrice();
  const taxPrice = Math.round(totalPrice * 0.1); // 消費税10%
  const finalPrice = totalPrice + taxPrice; // 税込価格

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ナビゲーションバー */}
      <Navbar onSearch={handleSearch} />

      {/* メインコンテンツ */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">ショッピングカート</h1>
        {cartItems.length === 0 ? (
          // カートが空の場合の表示
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-2xl text-gray-600 mb-6">カートは空です</p>
            <button
              onClick={() => navigate("/")}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-bold text-lg"
            >
              ショッピングを続ける
            </button>
          </div>
        ) : (
          // カート内容
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* テーブルヘッダー */}
                <div className="hidden md:grid grid-cols-12 gap-4 p-6 bg-gray-100 font-bold border-b-2 border-gray-300">
                  <div className="col-span-4">商品</div>
                  <div className="col-span-2 text-center">価格</div>
                  <div className="col-span-2 text-center">数量</div>
                  <div className="col-span-2 text-center">小計</div>
                  <div className="col-span-2 text-center">削除</div>
                </div>
                {/* カートアイテム */}
                <div className="divide-y divide-gray-200">
                  {cartItems.map((item) => (
                    <div
                      key={item.product_id}
                      className="grid grid-cols-1 md:grid-cols-12 gap-4 p-6 items-center hover:bg-gray-50 transition"
                    >
                      {/* 商品名 */}
                      <div className="md:col-span-4">
                        <p className="font-semibold text-lg">{item.name}</p>
                      </div>
                      {/* 価格 */}
                      <div className="md:col-span-2 text-center">
                        <p className="font-semibold">
                          {item.price.toLocaleString()}
                        </p>
                      </div>
                      {/* 数量 */}
                      <div className="md:col-span-2 text-center">
                        <button
                          onClick={() =>
                            updateQuantity(item.product_id, item.quantity - 1)
                          }
                          className="px-3 py-1 hover:bg-gray-100"
                        >
                          ー
                        </button>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            updateQuantity(
                              item.product_id,
                              Math.max(1, parseInt(e.target.value) || 1),
                            )
                          }
                          className="w-12 text-center border-l border-r border-gray-300 py-1"
                        />
                        <button
                          onClick={() =>
                            updateQuantity(item.product_id, item.quantity + 1)
                          }
                          className="px-3 py-1 hover:bg-gray-100"
                        >
                          ＋
                        </button>
                      </div>
                      {/* 小計 */}
                      <div className="md:col-span-2 text-center font-bold text-lg">
                        ￥{(item.price * item.quantity).toLocaleString()}
                      </div>
                      {/* 削除ボタン */}
                      <div className="md:col-span-2 text-center">
                        <button
                          onClick={() => removeItem(item.product_id)}
                          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:text-red-600 transition font-semibold"
                        >
                          削除
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ショッピング続行ボタン */}
              <button
                onClick={() => navigate("/")}
                className="mt-6 w-full border-2 border-gray-300 text-gray-700 py-3 rounded-lg hover:border-gray-400 transition font-semibold text-lg"
              >
                ←ショッピングを続ける
              </button>
            </div>

            {/* 注文サマリー */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
                <h2 className="text-2xl font-bold mb-6">注文サマリー</h2>

                {/* 商品合計 */}
                <div className="flex justify-between mb-4 pb-4 border-b border-gray-200">
                  <span className="text-gray-700">商品合計</span>
                  <span className="font-semibold">
                    ¥{totalPrice.toLocaleString()}
                  </span>
                </div>

                {/* 税金 */}
                <div className="flex justify-between mb-6 pb-6 border-b-2 border-gray-300">
                  <span className="text-gray-700">税金</span>
                  <span className="font-semibold">
                    ¥{taxPrice.toLocaleString()}
                  </span>
                </div>

                {/* 配送料（固定） */}
                <div className="flex justify-between mb-6 pb-6 border-b-2 border-gray-300">
                  <span className="text-gray-700">配送料</span>
                  <span className="font-semibold">¥0</span>
                </div>

                {/* 合計金額 */}
                <div className="flex justify-between mb-8">
                  <span className="text-xl font-bold">合計</span>
                  <span className="text-3xl font-bold text-blue-600">
                    ¥{finalPrice.toLocaleString()}
                  </span>
                </div>

                {/* チェックアウトボタン */}
                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transition font-bold text-lg"
                >
                  チェックアウトへ進む
                </button>

                {/* 商品数 */}
                <p className="text-center text-gray-500 text-sm mt-4">
                  商品数:{" "}
                  {cartItems.reduce((sum, item) => sum + item.quantity, 0)}個
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
