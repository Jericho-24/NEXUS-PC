import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db, firebaseConfigured } from "../firebase/client";
import { hasAdminAccess } from "../utils/admin";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState("");
  const registering = useRef(false);

  useEffect(() => {
    if (!firebaseConfigured) {
      setAuthError("Firebase is not configured. Copy the supplied values into .env.local and restart the app.");
      setLoading(false);
      return undefined;
    }

    return onAuthStateChanged(auth, async (nextUser) => {
      const registrationInProgress = registering.current;
      setUser(nextUser);
      setProfile(null);
      setIsAdmin(false);
      setAuthError("");
      if (!nextUser) {
        setLoading(false);
        return;
      }

      try {
        setIsAdmin(hasAdminAccess(nextUser.uid));
        const profileSnapshot = await getDoc(doc(db, "users", nextUser.uid));
        if (profileSnapshot.exists()) {
          setProfile(profileSnapshot.data());
        } else if (!registrationInProgress) {
          const initialProfile = {
            uid: nextUser.uid,
            name: nextUser.displayName || "",
            email: nextUser.email || "",
            phone: "",
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          };
          await setDoc(doc(db, "users", nextUser.uid), initialProfile);
          setProfile({ ...initialProfile, createdAt: new Date(), updatedAt: new Date() });
        }
      } catch (error) {
        setAuthError(error.message || "Could not load your account profile.");
      } finally {
        setLoading(false);
      }
    });
  }, []);

  const value = useMemo(() => ({
    user,
    profile,
    isAdmin,
    loading,
    authError,
    register: async ({ name, email, password }) => {
      registering.current = true;
      try {
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(credential.user, { displayName: name });
        const initialProfile = {
          uid: credential.user.uid,
          name,
          email,
          phone: "",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };
        await setDoc(doc(db, "users", credential.user.uid), initialProfile);
        setProfile({ ...initialProfile, createdAt: new Date(), updatedAt: new Date() });
        return { user: credential.user };
      } finally {
        registering.current = false;
      }
    },
    login: (email, password) => signInWithEmailAndPassword(auth, email, password),
    logout: () => signOut(auth),
    resetPassword: (email) => sendPasswordResetEmail(auth, email),
    updateProfile: async ({ name, phone }) => {
      const updates = { name: name.trim(), phone: phone.trim(), updatedAt: serverTimestamp() };
      await setDoc(doc(db, "users", user.uid), updates, { merge: true });
      if (user.displayName !== updates.name) await updateProfile(user, { displayName: updates.name });
      setProfile((current) => ({ ...current, ...updates, updatedAt: new Date() }));
    },
  }), [user, profile, isAdmin, loading, authError]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider.");
  return context;
}
