import { useEffect, useState, type FC } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { supabase } from "../lib/supabase";

interface OrderItem {
  order_item_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
}

interface Order {
  order_id: string;
  user_id?: string;
  total_amount: number;
  status: "pending" | "shipped" | "completed";
  shipping_address: string;
  shipping_city: string;
  shipping_postal_code: string;
  shipping_phone: string;
  payment_method: "credit_card" | "bank_transfer" | "convenience_store";
  created_at: string;
}

interface Product {
  product_id: string;
  name: string;
  price: number;
}

const AdminOrderDetail: FC = () => {
  const navigate = useNavigate();
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [products, setProducts] = useState<Map<string, Product>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      if (!orderId) return;

      // 注文情報を取得
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .select("*")
        .eq("order_id", orderId)
        .single();

      if (orderError) throw orderError;
      setOrder(orderData);

      // 注文アイテムを取得
      const { data: itemsData, error: itemsError } = await supabase
        .from("order_items")
        .select("*")
        .eq("order_id", orderId);

      if (itemsError) throw itemsError;
      setOrderItems(itemsData || []);

      // 商品情報を取得
      if (itemsData && itemsData.length > 0) {
        const productIds = itemsData.map((item) => item.product_id);
        const { data: productsData, error: productsError } = await supabase
          .from("products")
          .select("product_id, name, price")
          .in("product_id", productIds);

        if (productsError) throw productsError;

        const productMap = new Map<string, Product>();
        productsData?.forEach((product) => {
          productMap.set(product.product_id, product);
        });
        setProducts(productMap);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "注文情報の取得に失敗しました",
      );
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (
    newStatus: "pending" | "shipped" | "completed",
  ) => {
    try {
      setUpdating(true);
      const { error: updateError } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("order_id", orderId);

      if (updateError) throw updateError;
      await fetchOrderDetails();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "ステータスの更新に失敗しました",
      );
    } finally {
      setUpdating(false);
    }
  };

  const handleSearch = (term: string) => {
    navigate(`/?search=${term}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar onSearch={handleSearch} />
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-lg text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar onSearch={handleSearch} />
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-2xl text-gray-500 mb-6">注文が見つかりません</p>
          <button
            onClick={() => navigate("/admin")}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-semibold"
          >
            ダッシュボードに戻る
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onSearch={handleSearch} />

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">注文詳細</h1>
          <button
            onClick={() => navigate("/admin")}
            className="text-blue-600 hover:underline font-semibold"
          >
            ← ダッシュボードに戻る
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* メインコンテンツ */}
          <div className="lg:col-span-2">
            {/* 注文情報 */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-2xl font-bold mb-6">注文情報</h2>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">注文番号</p>
                    <p className="font-semibold text-lg">
                      {order.order_id.substring(0, 12)}...
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">注文日時</p>
                    <p className="font-semibold text-lg">
                      {new Date(order.created_at).toLocaleDateString("ja-JP", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ステータス管理 */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-2xl font-bold mb-6">ステータス管理</h2>

              <div className="flex gap-4">
                {(["pending", "shipped", "completed"] as const).map(
                  (status) => (
                    <button
                      key={status}
                      onClick={() => updateOrderStatus(status)}
                      disabled={updating || order.status === status}
                      className={`px-6 py-3 rounded-lg font-semibold transition ${
                        order.status === status
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      } disabled:opacity-50`}
                    >
                      {status === "pending" && "⏳ 確認待ち"}
                      {status === "shipped" && "📦 発送済み"}
                      {status === "completed" && "✅ 完了"}
                    </button>
                  ),
                )}
              </div>
            </div>

            {/* 配送先情報 */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-2xl font-bold mb-6">配送先情報</h2>

              <div className="space-y-3">
                <p>
                  <span className="text-gray-600">住所：</span>
                  <span className="font-semibold">
                    {order.shipping_address} {order.shipping_city}
                  </span>
                </p>
                <p>
                  <span className="text-gray-600">郵便番号：</span>
                  <span className="font-semibold">
                    {order.shipping_postal_code}
                  </span>
                </p>
                <p>
                  <span className="text-gray-600">電話番号：</span>
                  <span className="font-semibold">{order.shipping_phone}</span>
                </p>
              </div>
            </div>

            {/* 支払い方法 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-6">支払い情報</h2>

              <p>
                <span className="text-gray-600">支払い方法：</span>
                <span className="font-semibold ml-2">
                  {order.payment_method === "credit_card" &&
                    "💳 クレジットカード"}
                  {order.payment_method === "bank_transfer" && "🏦 銀行振込"}
                  {order.payment_method === "convenience_store" &&
                    "🏪 コンビニ払い"}
                </span>
              </p>
            </div>
          </div>

          {/* サイドバー */}
          <div className="lg:col-span-1">
            {/* 注文商品 */}
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
              <h2 className="text-2xl font-bold mb-6">注文商品</h2>

              <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                {orderItems.map((item) => {
                  const product = products.get(item.product_id);
                  return (
                    <div key={item.order_item_id}>
                      <p className="font-semibold">
                        {product?.name || "商品名不明"}
                      </p>
                      <p className="text-sm text-gray-600">
                        ¥{item.unit_price.toLocaleString()} × {item.quantity}個
                      </p>
                      <p className="font-semibold text-blue-600">
                        ¥{(item.unit_price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* 合計 */}
              <div className="space-y-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>合計金額</span>
                  <span className="text-blue-600">
                    ¥{order.total_amount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetail;
