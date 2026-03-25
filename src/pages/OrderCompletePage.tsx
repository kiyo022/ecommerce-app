import { FC, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { supabase } from "../lib/supabase";

interface Order {
  order_id: string;
  total_amount: number;
  created_at: string;
  shipping_address: string;
  shipping_city: string;
  payment_method: string;
}

const OrderCompletePage: FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;

      try {
        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .eq("order_id", orderId)
          .single();

        if (error) throw error;
        setOrder(data);
      } catch (err) {
        console.error("注文情報取得エラー:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const handleSearch = (term: string) => {
    navigate(`/?search=${term}`);
  };

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

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar onSearch={handleSearch} />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <p className="text-2xl text-gray-500 mb-6">
              注文情報が見つかりません
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-bold text-lg"
            >
              ホームに戻る
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ナビバー */}
      <Navbar onSearch={handleSearch} />

      {/* メインコンテンツ */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* 成功メッセージ */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-4xl font-bold mb-4">
              ご注文ありがとうございます！
            </h1>
            <p className="text-xl text-gray-600">注文が正常に完了しました。</p>
          </div>

          {/* 注文詳細 */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">注文詳細</h2>

            {/* 注文番号 */}
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">注文番号</p>
              <p className="text-lg font-mono font-bold">{order.order_id}</p>
            </div>

            {/* 注文日時 */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <p className="text-sm text-gray-600 mb-2">注文日時</p>
                <p className="font-semibold">
                  {new Date(order.created_at).toLocaleDateString("ja-JP", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">注文状態</p>
                <p className="font-semibold text-blue-600">確認待ち</p>
              </div>
            </div>

            {/* 配送先 */}
            <div className="mb-8 pb-8 border-b border-gray-200">
              <h3 className="font-bold text-lg mb-3">配送先</h3>
              <p className="text-gray-700">{order.shipping_address}</p>
              <p className="text-gray-700">{order.shipping_city}</p>
            </div>

            {/* 支払い方法 */}
            <div className="mb-8 pb-8 border-b border-gray-200">
              <h3 className="font-bold text-lg mb-3">支払い方法</h3>
              <p className="text-gray-700">
                {order.payment_method === "credit_card" &&
                  "💳 クレジットカード"}
                {order.payment_method === "bank_transfer" && "🏦 銀行振込"}
                {order.payment_method === "convenience_store" &&
                  "🏪 コンビニ払い"}
              </p>
            </div>

            {/* 金額 */}
            <div className="mb-6">
              <div className="flex justify-between mb-4 text-lg">
                <span className="font-bold">ご注文金額</span>
                <span className="text-3xl font-bold text-blue-600">
                  ¥{order.total_amount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* 次のステップ */}
          <div className="bg-blue-50 rounded-lg p-8 mb-8">
            <h3 className="font-bold text-lg mb-4">次のステップ</h3>
            <ol className="space-y-3">
              <li className="flex gap-3">
                <span className="font-bold text-blue-600">1.</span>
                <span>ご注文確認メールを送信いたします</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-blue-600">2.</span>
                <span>商品の手配・発送準備を進めます</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-blue-600">3.</span>
                <span>発送時に追跡番号をご連絡します</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-blue-600">4.</span>
                <span>ご指定の住所へ配送いたします</span>
              </li>
            </ol>
          </div>

          {/* ボタン */}
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/")}
              className="flex-1 bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transition font-bold text-lg"
            >
              ホームに戻る
            </button>
            <button
              onClick={() => navigate("/")}
              className="flex-1 border-2 border-gray-300 text-gray-700 py-4 rounded-lg hover:border-gray-400 transition font-bold text-lg"
            >
              ショッピングを続ける
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCompletePage;
