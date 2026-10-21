import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-script">Louisiana Flavor.</div>
      <div className="footer-tag">BIGGER OPPORTUNITIES.</div>
      <div className="footer-links">
        <Link to="/catering">CATERING</Link>
        <Link to="/retail">RETAIL PARTNERS</Link>
        <Link to="/catering">SPECIAL OCCASIONS</Link>
      </div>
    </footer>
  );
}
