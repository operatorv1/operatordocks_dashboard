import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { auth, onAuthStateChanged, fbSignOut, type User } from "@/firebase";

// Minimal user shape used by the UI. Real Firebase `User` is a superset of this,
// so it satisfies the type. Demo users are plain objects that match this shape.
type AppUser = Pick<User, "uid" | "email" | "displayName" | "photoURL"> & {
  isDemo?: boolean;
};

interface AuthCtx {
  user: AppUser | null;
  loading: boolean;
  signOut: () => Promise<void>;
  demoSignIn: (u: { displayName: string; email: string }) => void;
}

const DEMO_KEY = "operatordocks.demoUser";

const AuthContext = createContext<AuthCtx>({
  user: null,
  loading: true,
  signOut: async () => {},
  demoSignIn: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore demo session synchronously if present.
    try {
      const raw = localStorage.getItem(DEMO_KEY);
      if (raw) {
        setUser(JSON.parse(raw));
        setLoading(false);
        return;
      }
    } catch {}

    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u as AppUser | null);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const demoSignIn: AuthCtx["demoSignIn"] = ({ displayName, email }) => {
    const demo: AppUser = {
      uid: `demo-${email}`,
      email,
      displayName,
      photoURL: null,
      isDemo: true,
    };
    localStorage.setItem(DEMO_KEY, JSON.stringify(demo));
    setUser(demo);
  };

  const signOut = async () => {
    localStorage.removeItem(DEMO_KEY);
    if (user?.isDemo) {
      setUser(null);
      return;
    }
    try {
      await fbSignOut(auth);
    } catch {}
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut, demoSignIn }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
