import { User as AuthUser } from "@supabase/supabase-js";
import { supabase } from "./supabase";

//ログイン
export const login = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
};

//登録
export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw error;
  return data;
};

//ログアウト
export const logOut = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) throw error;
};

//現在のユーザーを取得
export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();

  if (error) throw error;
  return data;
};

//ユーザー情報の監視
export const onAuthStateChange = (
  callback: (user: AuthUser | null) => void,
) => {
  const { data } = supabase.auth.onAuthStateChange((event, session) =>
    callback(session?.user || null),
  );

  return data.subscription;
};
