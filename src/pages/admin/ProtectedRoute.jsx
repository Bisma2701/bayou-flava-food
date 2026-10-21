import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase/config";

export default function ProtectedRoute({ children }) {
  const [user, setUser] = useState(undefined); // undefined = loading, null = not logged in

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  if (user === undefined) {
    return <div style={{ padding: 60, textAlign: "center" }}>Loading…</div>;
  }
  if (!user) {
    return <Navigate to="/admin" replace />;
  }
  return children;
}
