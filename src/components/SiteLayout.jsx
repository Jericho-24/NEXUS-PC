import { Outlet } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import Header from "./Header";
import Footer from "./Footer";
import { useAuth } from "../context/AuthContext";
import { firebaseConfigured } from "../firebase/client";

export default function SiteLayout() {
  const { authError } = useAuth();
  return (
    <div className="app-shell">
      {!firebaseConfigured && <div className="config-warning"><AlertTriangle size={15} /> Firebase configuration is missing. Add the values from <code>.env.example</code> to <code>.env.local</code>, then restart Vite.</div>}
      {authError && <div className="config-warning" role="alert"><AlertTriangle size={15} /> {authError}</div>}
      <Header />
      <main className="site-main"><Outlet /></main>
      <Footer />
    </div>
  );
}
