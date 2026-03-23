import { useEffect, useState, type FC } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { supabase } from "../lib/supabase";
import { useCartStore } from "../store/cartStore";

interface Product {
  product_id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  description: string;
}

interface review {
  review_id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
}

const ProductDetailPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);

  // 商品とレビューの状態管理
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<review[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  //商品データとレビューの取得
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const { data: productData, error: productError } = await supabase
          .from("products")
          .select("*")
          .eq("product_id", id)
          .single();

        if (productError) throw productError;
        setProduct(productData);

        // レビューの取得
        const { data: reviewData, error: reviewError } = await supabase
          .from("product_reviews")
          .select("*")
          .eq("product_id", id)
          .order("created_at", { ascending: false });

        if (reviewError) throw reviewError;
        setReviews(reviewData);
      } catch (error) {
        console.error("データの取得に失敗:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  // カートに追加する関数
  const handleAddToCart = () => {
    if (!product) return;

    addItem({
      product_id: product.product_id,
      name: product.name,
      price: product.price,
      quantity,
    });
    alert(`${quantity}点をカートに追加しました！`);
    setQuantity(1);
  };

  // 検索機能
  const handleSearch = (term: string) => {
    navigate(`/?search=${term}`);
  };

  // ローディング中の表示
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar onSearch={handleSearch} />
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">読み込み中...</p>
        </div>
      </div>
    );
  }
  // 商品が見つからない場合の表示
  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar onSearch={handleSearch} />
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">商品が見つかりません</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            ホームに戻る
          </button>
        </div>
      </div>
    );
  }

  //平均評価の計算
  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : "0";

  //★を表示する関数
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={i <= rating ? "text-yellow-400" : "text-gray-300"}
        >
          ★
        </span>,
      );
    }
    return stars;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/**ナビバー */}
      <Navbar onSearch={handleSearch} />

      {/**メインコンテンツ */}
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate("/")}
          className="mb-6 text-blue-600 hover:text-blue-700 font-semibold"
        >
          ← ホームに戻る
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 左：画像エリア */}
          <div>
            {/* メイン画像 */}
            <div
              className="w-full bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center mb-4"
              style={{ height: "400px" }}
            >
              <span className="text-8xl">📦</span>
            </div>
            {/* サムネイル */}
            <div className="flex gap-2">
              {[0, 1, 2].map((index) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`w-20 h-20 rounded-lg flex items-center justify-center text-3xl transition ${
                    activeImageIndex === index
                      ? "border-4 border-blue-600 bg-blue-100"
                      : "border-2 border-gray-300 bg-gray-100 hover:border-blue-400"
                  }`}
                >
                  📦
                </button>
              ))}
            </div>
          </div>
        </div>
        {/* 右：商品情報エリア */}
        <div>
          {/* 商品名 */}
          <h1 className="text-4xl font-bold mb-4">{product.name}</h1>

          {/* 価格 */}
          <div className="flex items-baseline gap-4 mb-4">
            <span className="text-4xl font-bold text-blue-600">
              ¥{product.price.toLocaleString()}
            </span>
            <span className="text-gray-500 text-lg">(税込)</span>
          </div>

          {/* 星評価 */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex">
              {renderStars(Math.round(parseFloat(averageRating as string)))}
            </div>
            <span className="text-gray-600">
              {averageRating} ({reviews.length}件のレビュー)
            </span>
          </div>

          {/* 在庫情報 */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-lg font-semibold">
              在庫:{" "}
              <span
                className={
                  product.stock > 0 ? "text-green-600" : "text-red-600"
                }
              >
                {product.stock > 0 ? `${product.stock}個` : "在庫なし"}
              </span>
            </p>
          </div>

          {/* 説明 */}
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-2">商品説明</h2>
            <p className="text-gray-700 leading-relaxed">
              {product.description}
            </p>
          </div>
          {/* 数量選択 */}
          <div className="mb-6">
            <label className="block text-lg font-semibold mb-2">数量</label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                −
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                }
                className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center"
              />
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>
          {/* カートに追加ボタン */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-bold text-xl mb-4"
          >
            {product.stock > 0 ? "カートに追加" : "在庫なし"}
          </button>
          {/* 戻るボタン */}
          <button
            onClick={() => navigate("/")}
            className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-lg hover:border-gray-400 transition font-semibold"
          >
            ホームに戻る
          </button>
        </div>
      </div>
      {/* レビューセクション */}
      <div className="mt-16 border-t-2 border-gray-200 pt-8">
        <h2 className="text-3xl font-bold mb-6">カスタマーレビュー</h2>

        {reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div
                key={review.review_id}
                className="bg-white p-6 rounded-lg shadow-sm"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex gap-1">{renderStars(review.rating)}</div>
                  <span className="text-sm text-gray-500">
                    {new Date(review.created_at).toLocaleDateString("ja-JP")}
                  </span>
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">レビューはまだありません</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
