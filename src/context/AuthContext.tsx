import { User as AuthUser } from "@supabase/supabase-js";
import {
  createContext,
  useEffect,
  useState,
  type FC,
  type ReactNode,
} from "react";
import { onAuthStateChange } from "../lib/auth";

interface User {
  id: string;
  email?: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const subscription = onAuthStateChange((authUser: AuthUser | null) => {
      if (authUser) {
        setUser({
          id: authUser.id,
          email: authUser.email,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription?.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
