import { FC } from "react";
import { Link } from "react-router-dom";
import { useCartStore } from "../store/cartStore";

interface Product {
  product_id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  description: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: FC<ProductCardProps> = ({ product }) => {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem({
      product_id: product.product_id,
      name: product.name,
      price: product.price,
      quantity: 1,
    });
    alert("カートに追加しました！");
  };

  return (
    <Link to={`/products/${product.product_id}`} className="no-underline">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition flex flex-col h-full">
        {/* 画像 */}
        <div className="w-full h-48 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0">
          <span className="text-6xl">📦</span>
        </div>

        {/* 商品情報 */}
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="font-bold text-lg mb-2 line-clamp-2">
            {product.name}
          </h3>

          {/* 説明文：固定高さで2行表示 */}
          <p className="text-gray-600 text-sm mb-3 h-10 line-clamp-2">
            {product.description}
          </p>

          {/* 価格と在庫 */}
          <div className="flex justify-between items-center mb-3">
            <span className="text-2xl font-bold text-blue-600">
              ¥{product.price.toLocaleString()}
            </span>
            <span className="text-sm text-gray-500">在庫: {product.stock}</span>
          </div>

          {/* 星評価 */}
          <div className="flex items-center mb-4">
            <span className="text-yellow-400">★★★★☆</span>
            <span className="text-gray-500 text-sm ml-2">(25)</span>
          </div>

          {/* ボタン：下に固定 */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-semibold mt-auto"
          >
            {product.stock > 0 ? "カートに追加" : "在庫なし"}
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
