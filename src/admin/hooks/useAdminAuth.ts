import { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "../firebase";

export type AdminAuthState = {
  loading: boolean;
  user: User | null;
  isAdmin: boolean;
};

export function useAdminAuth(): AdminAuthState {
  const [state, setState] = useState<AdminAuthState>({
    loading: true,
    user: null,
    isAdmin: false,
  });

  useEffect(() => {
    return onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setState({ loading: false, user: null, isAdmin: false });
        return;
      }
      try {
        const token = await user.getIdTokenResult();
        const isAdmin = token.claims.admin === true;
        setState({ loading: false, user, isAdmin });
      } catch {
        setState({ loading: false, user, isAdmin: false });
      }
    });
  }, []);

  return state;
}
