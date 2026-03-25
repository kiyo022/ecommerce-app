import { useState, type FC } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { supabase } from "../lib/supabase";
import { useCartStore } from "../store/cartStore";

interface ShippingInfo {
  address: string;
  city: string;
  postalCode: string;
  phone: string;
}

type PaymentMethod = "credit_card" | "bank_transfer" | "convenience_store";

const CheckOutPage: FC = () => {
  const navigate = useNavigate();
  const cartItems = useCartStore((state) => state.items);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const clearCart = useCartStore((state) => state.clearCart);

  const [currentStep, setCurrentStep] = useState<
    "shipping" | "payment" | "confirm"
  >("shipping");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  //配送先情報
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    address: "",
    city: "",
    postalCode: "",
    phone: "",
  });

  //支払い方法
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("credit_card");

  const totalPrice = getTotalPrice();
  const taxPrice = Math.round(totalPrice * 0.1);
  const finalPrice = totalPrice + taxPrice;

  // ステップ１：配送先情報入力の検証
  const isShippingValid = () => {
    return (
      shippingInfo.address.trim() !== "" &&
      shippingInfo.city.trim() !== "" &&
      shippingInfo.postalCode.trim() !== "" &&
      shippingInfo.phone.trim() !== ""
    );
  };

  // Step遷移(配送先 → 支払い)
  const handleToPayment = () => {
    if (isShippingValid()) {
      setCurrentStep("payment");
      setError(null);
    } else {
      setError("すべての項目を入力してください");
    }
  };

  // ステップ遷移(支払い → 確認)
  const handleToConfirm = () => {
    setCurrentStep("confirm");
    setError(null);
  };

  // ステップ遷移(戻る)
  const handleBack = () => {
    if (currentStep === "payment") {
      setCurrentStep("shipping");
    } else if (currentStep === "confirm") {
      setCurrentStep("payment");
    }
  };

  //注文確定
  const handleConfirmOrder = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert({
          total_amount: finalPrice,
          status: "pending",
          shipping_address: shippingInfo.address,
          shipping_city: shippingInfo.city,
          shipping_postal_code: shippingInfo.postalCode,
          shipping_phone: shippingInfo.phone,
          payment_method: paymentMethod,
        })
        .select();
      console.log("注文データ:", orderData, "エラー:", orderError);
      if (orderError) throw orderError;
      if (!orderData || orderData.length === 0)
        throw new Error("注文作成に失敗しました");

      const orderId = orderData[0].order_id;

      //注文アイテムの保存
      const orderItems = cartItems.map((item) => ({
        order_id: orderId,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.price,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      //カートをクリア
      clearCart();

      //注文完了ページへ遷移
      navigate(`/order-complete/${orderId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "注文の確定に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term: string) => {
    navigate(`/?search=${term}`);
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar onSearch={handleSearch} />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <p className="text-2xl text-gray-500 mb-6">カートは空です</p>
            <button
              onClick={() => navigate("/")}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-bold text-lg"
            >
              ショッピングを続ける
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
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">チェックアウト</h1>

        {/* ステップインジケーター */}
        <div className="flex justify-between mb-12">
          <div
            className={`flex-1 text-center pb-4 border-b-4 transition ${currentStep === "shipping" ? "border-blue-600 text-blue-600 font-bold" : `border-gray-300 text-gray-600`}`}
          >
            1. 配送先情報
          </div>
          <div
            className={`flex-1 text-center pb-4 border-b-4 transition ${
              currentStep === "payment"
                ? "border-blue-600 text-blue-600 font-bold"
                : "border-gray-300 text-gray-600"
            } `}
          >
            2. 支払い方法
          </div>
          <div
            className={`flex-1 text-center pb-4 border-b-4 transition ${
              currentStep === "confirm"
                ? "border-blue-600 text-blue-600 font-bold"
                : "border-gray-300 text-gray-600"
            }`}
          >
            3. 確認
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* メインコンテンツ */}
          <div className="lg:col-span-2">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
                {error}
              </div>
            )}

            {/* ステップ1: 配送先情報 */}
            {currentStep === "shipping" && (
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold mb-6">配送先情報</h2>
                <form className="space-y-6">
                  {/* 住所 */}
                  <div>
                    <label className="block text-lg font-semibold mb-2">
                      住所 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={shippingInfo.address}
                      onChange={(e) =>
                        setShippingInfo({
                          ...shippingInfo,
                          address: e.target.value,
                        })
                      }
                      placeholder="例: 東京都渋谷区1-2-3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  {/* 市区町村 */}
                  <div>
                    <label className="block text-lg font-semibold mb-2">
                      市区町村 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={shippingInfo.city}
                      onChange={(e) =>
                        setShippingInfo({
                          ...shippingInfo,
                          city: e.target.value,
                        })
                      }
                      placeholder="例: 東京都"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* 郵便番号 */}
                  <div>
                    <label className="block text-lg font-semibold mb-2">
                      郵便番号 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={shippingInfo.postalCode}
                      onChange={(e) =>
                        setShippingInfo({
                          ...shippingInfo,
                          postalCode: e.target.value,
                        })
                      }
                      placeholder="例: 123-4567"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* 電話番号 */}
                  <div>
                    <label className="block text-lg font-semibold mb-2">
                      電話番号 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={shippingInfo.phone}
                      onChange={(e) =>
                        setShippingInfo({
                          ...shippingInfo,
                          phone: e.target.value,
                        })
                      }
                      placeholder="例: 090-1234-5678"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </form>
                {/* ボタン */}
                <div className="mt-8 flex gap-4">
                  <button
                    onClick={() => navigate("/cart")}
                    className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-lg hover:border-gray-400 transition font-semibold text-lg"
                  >
                    カートに戻る
                  </button>
                  <button
                    onClick={handleToPayment}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold text-lg"
                  >
                    支払い方法へ →
                  </button>
                </div>
              </div>
            )}
            {/* ステップ2: 支払い方法 */}
            {currentStep === "payment" && (
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold mb-6">支払い方法</h2>

                <div className="space-y-4">
                  {/* クレジットカード */}
                  <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition">
                    <input
                      type="radio"
                      name="payment"
                      value="credit_card"
                      checked={paymentMethod === "credit_card"}
                      onChange={(e) =>
                        setPaymentMethod(e.target.value as PaymentMethod)
                      }
                      className="w-5 h-5"
                    />
                    <div className="ml-4">
                      <p className="font-bold text-lg">💳 クレジットカード</p>
                      <p className="text-gray-600">
                        Visa, Mastercard, American Express
                      </p>
                    </div>
                  </label>
                  {/* 銀行振込 */}
                  <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition">
                    <input
                      type="radio"
                      name="payment"
                      value="bank_transfer"
                      checked={paymentMethod === "bank_transfer"}
                      onChange={(e) =>
                        setPaymentMethod(e.target.value as PaymentMethod)
                      }
                      className="w-5 h-5"
                    />
                    <div className="ml-4">
                      <p className="font-bold text-lg">🏦 銀行振込</p>
                      <p className="text-gray-600">日本国内の銀行口座</p>
                    </div>
                  </label>
                  {/* コンビニ払い */}
                  <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition">
                    <input
                      type="radio"
                      name="payment"
                      value="convenience_store"
                      checked={paymentMethod === "convenience_store"}
                      onChange={(e) =>
                        setPaymentMethod(e.target.value as PaymentMethod)
                      }
                      className="w-5 h-5"
                    />
                    <div className="ml-4">
                      <p className="font-bold text-lg">🏪 コンビニ払い</p>
                      <p className="text-gray-600">
                        セブン-イレブン、ローソン、ファミリーマートなど
                      </p>
                    </div>
                  </label>
                </div>
                {/* ボタン */}
                <div className="mt-8 flex gap-4">
                  <button
                    onClick={handleBack}
                    className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-lg hover:border-gray-400 transition font-semibold text-lg"
                  >
                    ← 戻る
                  </button>
                  <button
                    onClick={handleToConfirm}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold text-lg"
                  >
                    確認へ →
                  </button>
                </div>
              </div>
            )}
            {/* ステップ3: 注文確認 */}
            {currentStep === "confirm" && (
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold mb-6">注文確認</h2>

                {/* 配送先情報 */}
                <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-bold text-lg mb-3">配送先情報</h3>
                  <p className="text-gray-700">
                    {shippingInfo.address} {shippingInfo.city}
                  </p>
                  <p className="text-gray-700">{shippingInfo.postalCode}</p>
                  <p className="text-gray-700">{shippingInfo.phone}</p>
                </div>

                {/* 支払い方法 */}
                <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-bold text-lg mb-3">支払い方法</h3>
                  <p className="text-gray-700">
                    {paymentMethod === "credit_card" && "💳 クレジットカード"}
                    {paymentMethod === "bank_transfer" && "🏦 銀行振込"}
                    {paymentMethod === "convenience_store" && "🏪 コンビニ払い"}
                  </p>
                </div>
                {/* 注文商品 */}
                <div className="mb-8">
                  <h3 className="font-bold text-lg mb-3">注文商品</h3>
                  <div className="space-y-2">
                    {cartItems.map((item) => (
                      <div
                        key={item.product_id}
                        className="flex justify-between p-3 border-b border-gray-200"
                      >
                        <span>
                          {item.name} × {item.quantity}個
                        </span>
                        <span>
                          ¥{(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* ボタン */}
                <div className="flex gap-4">
                  <button
                    onClick={handleBack}
                    className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-lg hover:border-gray-400 transition font-semibold text-lg"
                  >
                    ← 戻る
                  </button>
                  <button
                    onClick={handleConfirmOrder}
                    disabled={loading}
                    className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition font-semibold text-lg"
                  >
                    {loading ? "確定中..." : "注文を確定する"}
                  </button>
                </div>
              </div>
            )}
          </div>
          {/* サイドバー（注文サマリー） */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
              <h2 className="text-2xl font-bold mb-6">注文サマリー</h2>
              {/* 商品一覧 */}
              <div className="space-y-2 mb-6 pb-6 border-b border-gray-200">
                {cartItems.map((item) => (
                  <div
                    key={item.product_id}
                    className="flex justify-between text-sm"
                  >
                    <span>{item.name}</span>
                    <span>
                      ¥{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* 合計 */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-700">商品合計</span>
                  <span className="font-semibold">
                    ¥{totalPrice.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between pb-3 border-b border-gray-200">
                  <span className="text-gray-700">税金 (10%)</span>
                  <span className="font-semibold">
                    ¥{taxPrice.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>合計</span>
                  <span className="text-blue-600">
                    ¥{finalPrice.toLocaleString()}
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

export default CheckOutPage;
