import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

interface Product {
  product_id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  description: string;
  images?: Array<{ image_url: string }>;
}

interface FetchFilters {
  category?: string;
  search?: string;
  page?: number;
}

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async (filters?: FetchFilters) => {
    try {
      setLoading(true);
      let query = supabase.from("products").select("*");

      if (filters?.category) {
        query = query.eq("category", filters.category);
      }

      if (filters?.search) {
        query = query.ilike("name", `%${filters.search}%`);
      }

      // limit を削除して全件取得
      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      setProducts(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "商品取得エラー");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return { products, loading, error, fetchProducts };
};
