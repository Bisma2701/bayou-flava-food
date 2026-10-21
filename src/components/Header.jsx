import { Link } from "react-router-dom";

export default function Header({ variant = "home" }) {
  if (variant === "catering") {
    return (
      <header className="site-header">
        <button className="icon-btn" aria-label="Menu">☰</button>
        <Link to="/" className="brand-plain">BAYOU FLAVA FOOD</Link>
        <Link to="/" className="icon-btn" aria-label="Home">🍴</Link>
      </header>
    );
  }
  return (
    <header className="site-header">
      <button className="icon-btn" aria-label="Menu">☰</button>
      <Link to="/" className="brand">Bayou <span style={{ color: "#fff" }}>Flava</span></Link>
      <button className="icon-btn" aria-label="Call">📞</button>
    </header>
  );
}
