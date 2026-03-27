import { useEffect, useState, type FC } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { supabase } from "../lib/supabase";

interface Product {
  product_id: string;
  name: string;
  price: number;
  stock: number;
  image_url: string;
  created_at: string;
}

const AdminProducts: FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    image_url: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;
      setProducts(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "商品の取得に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);

      const { error: insertError } = await supabase.from("products").insert({
        name: formData.name,
        price: parseInt(formData.price),
        stock: parseInt(formData.stock),
        image_url: formData.image_url,
      });

      if (insertError) throw insertError;

      setFormData({ name: "", price: "", stock: "", image_url: "" });
      setShowForm(false);
      await fetchProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "商品の追加に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("この商品を削除してもよろしいですか？")) return;

    try {
      const { error: deleteError } = await supabase
        .from("products")
        .delete()
        .eq("product_id", productId);

      if (deleteError) throw deleteError;
      await fetchProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "商品の削除に失敗しました");
    }
  };

  const handleSearch = (term: string) => {
    navigate(`/?search=${term}`);
  };

  if (loading && products.length === 0) {
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
          <h1 className="text-4xl font-bold">商品管理</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold"
          >
            {showForm ? "キャンセル" : "新規商品追加"}
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* 商品追加フォーム */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6">新規商品追加</h2>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="商品名"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
                <input
                  type="number"
                  placeholder="価格"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  required
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
                <input
                  type="number"
                  placeholder="在庫数"
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData({ ...formData, stock: e.target.value })
                  }
                  required
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
                <input
                  type="url"
                  placeholder="画像URL"
                  value={formData.image_url}
                  onChange={(e) =>
                    setFormData({ ...formData, image_url: e.target.value })
                  }
                  required
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 font-semibold"
              >
                {loading ? "追加中..." : "商品を追加"}
              </button>
            </form>
          </div>
        )}

        {/* 商品一覧 */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 border-b-2 border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  商品名
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  価格
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  在庫
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  作成日
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  操作
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product.product_id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="px-6 py-4 font-semibold">{product.name}</td>
                  <td className="px-6 py-4">
                    ¥{product.price.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        product.stock > 0
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {new Date(product.created_at).toLocaleDateString("ja-JP")}
                  </td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    <button
                      onClick={() =>
                        navigate(`/admin/product/${product.product_id}`)
                      }
                      className="text-blue-600 hover:underline font-semibold"
                    >
                      編集
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.product_id)}
                      className="text-red-600 hover:underline font-semibold"
                    >
                      削除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
