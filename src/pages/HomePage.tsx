import { FC, useState } from "react";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import { useProducts } from "../hooks/useProducts";

const HomePage: FC = () => {
  const { products, loading, fetchProducts } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const handleSearch = (term: string): void => {
    setSearchTerm(term);
    setCurrentPage(1);
    fetchProducts({ search: term, category: selectedCategory });
  };

  const handleCategoryChange = (category: string): void => {
    setSelectedCategory(category);
    setCurrentPage(1);
    fetchProducts({ category: category || undefined, search: searchTerm });
  };

  // ページネーション
  const itemsPerPage = 12;
  const filteredProducts = selectedCategory || searchTerm ? products : products;
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage,
  );
  console.log("商品数:", products.length, "総ページ数:", totalPages);

  const categories = ["", "electronics", "clothing", "books", "home"];
  const categoryLabels: { [key: string]: string } = {
    "": "すべて",
    electronics: "電子機器",
    clothing: "ファッション",
    books: "本",
    home: "ホーム",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ナビバー */}
      <Navbar onSearch={handleSearch} />

      {/* メインコンテンツ */}
      <div className="container mx-auto px-4 py-8">
        {/* フィルタセクション */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">カテゴリから探す</h2>
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded-lg transition font-semibold ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:border-blue-600"
                }`}
              >
                {categoryLabels[category]}
              </button>
            ))}
          </div>
        </div>

        {/* 商品一覧 */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">読み込み中...</p>
          </div>
        ) : paginatedProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">商品が見つかりません</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {paginatedProducts.map((product) => (
                <ProductCard key={product.product_id} product={product} />
              ))}
            </div>

            {/* ページネーション */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-3 mt-16 mb-12">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-6 py-3 border-2 border-gray-300 rounded-lg disabled:text-gray-400 disabled:cursor-not-allowed hover:border-blue-600 transition font-bold text-lg"
                >
                  前へ
                </button>

                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-3 rounded-lg transition font-bold text-base ${
                          currentPage === page
                            ? "bg-blue-600 text-white"
                            : "border-2 border-gray-300 hover:border-blue-600"
                        }`}
                      >
                        {page}
                      </button>
                    ),
                  )}
                </div>

                <button
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-6 py-3 border-2 border-gray-300 rounded-lg disabled:text-gray-400 disabled:cursor-not-allowed hover:border-blue-600 transition font-bold text-lg"
                >
                  次へ
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;
