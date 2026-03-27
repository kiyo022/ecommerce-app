import { useEffect, useState, type FC } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../lib/supabase";

interface Order {
  order_id: string;
  total_amount: number;
  shipping_address: string;
  shipping_city: string;
  payment_method: "credit_card" | "bank_transfer" | "convenience_store";
  status: "pending" | "shipped" | "completed";
  created_at: string;
  user_id?: string;
}

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  recentOrders: Order[];
}

const AdminDashboard: FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    recentOrders: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // 注文総数
        const { count: ordersCount } = await supabase
          .from("orders")
          .select("*", { count: "exact", head: true });

        // 売上合計
        const { data: revenueData } = await supabase
          .from("orders")
          .select("total_amount");

        const totalRevenue =
          revenueData?.reduce(
            (sum, order) => sum + (order.total_amount || 0),
            0,
          ) || 0;

        // 顧客数（重複なし）
        const { data: customersData } = await supabase
          .from("orders")
          .select("user_id")
          .not("user_id", "is", null);

        const uniqueCustomers = new Set(
          customersData?.map((order) => order.user_id) || [],
        ).size;

        // 最新注文
        const { data: recentOrders } = await supabase
          .from("orders")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(10);

        setStats({
          totalOrders: ordersCount || 0,
          totalRevenue,
          totalCustomers: uniqueCustomers,
          recentOrders: recentOrders || [],
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "統計情報の取得に失敗しました",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onSearch={handleSearch} />

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">管理ダッシュボード</h1>
          <div className="text-sm text-gray-600">ログイン: {user?.email}</div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* 統計カード */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* 総注文数 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">総注文数</p>
                <p className="text-4xl font-bold text-blue-600 mt-2">
                  {stats.totalOrders}
                </p>
              </div>
              <div className="text-5xl">📦</div>
            </div>
          </div>

          {/* 売上合計 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">売上合計</p>
                <p className="text-4xl font-bold text-green-600 mt-2">
                  ¥{stats.totalRevenue.toLocaleString()}
                </p>
              </div>
              <div className="text-5xl">💰</div>
            </div>
          </div>

          {/* 顧客数 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">顧客数</p>
                <p className="text-4xl font-bold text-purple-600 mt-2">
                  {stats.totalCustomers}
                </p>
              </div>
              <div className="text-5xl">👥</div>
            </div>
          </div>
        </div>

        {/* 最新注文 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6">最新注文</h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    注文番号
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    金額
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    配送先
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    支払い方法
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    ステータス
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    注文日時
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.length > 0 ? (
                  stats.recentOrders.map((order) => (
                    <tr
                      key={order.order_id}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 text-sm font-mono font-semibold">
                        {order.order_id.substring(0, 8)}...
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold">
                        ¥{order.total_amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {order.shipping_address} {order.shipping_city}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {order.payment_method === "credit_card" &&
                          "💳 クレジットカード"}
                        {order.payment_method === "bank_transfer" &&
                          "🏦 銀行振込"}
                        {order.payment_method === "convenience_store" &&
                          "🏪 コンビニ払い"}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            order.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : order.status === "shipped"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {order.status === "completed" && "完了"}
                          {order.status === "shipped" && "発送済み"}
                          {order.status === "pending" && "確認待ち"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {new Date(order.created_at).toLocaleDateString(
                          "ja-JP",
                          {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() =>
                            navigate(`/admin/order/${order.order_id}`)
                          }
                          className="text-blue-600 hover:underline font-semibold"
                        >
                          詳細
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-4 text-center text-gray-600"
                    >
                      注文がありません
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
