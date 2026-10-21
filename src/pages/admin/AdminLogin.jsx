import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/config";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/admin/dashboard");
    } catch (err) {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--color-black)" }}>
      <form onSubmit={handleLogin} style={{ background: "var(--color-cream)", padding: 40, borderRadius: 6, width: 340, maxWidth: "90vw" }}>
        <h2 style={{ fontFamily: "var(--font-heading)", marginBottom: 4 }}>Admin Login</h2>
        <p style={{ color: "#6b5d40", marginBottom: 24, fontSize: "0.9rem" }}>Bayou Flava order management</p>

        <div className="field">
          <label>Email</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="field">
          <label>Password</label>
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>

        {error && <p className="error-text">{error}</p>}

        <button className="btn-gold" type="submit" disabled={loading}>
          {loading ? "SIGNING IN..." : "SIGN IN"}
        </button>
      </form>
    </div>
  );
}
