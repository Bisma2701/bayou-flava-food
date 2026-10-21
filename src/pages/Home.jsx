import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div>
      <Header variant="home" />

      <section className="hero">
        <div className="hero-inner">
          <div className="hero-text">
            <h1>CATERING<br />FOR BUSINESSES<br />&amp; SPECIAL OCCASIONS</h1>
            <div className="section-divider" />
            <p>Great food makes a lasting impression.</p>
            <Link to="/catering" className="btn-gold" style={{ width: "auto", display: "inline-flex" }}>
              VIEW CATERING MENU →
            </Link>
          </div>
          <div className="hero-img" />
        </div>
      </section>

      <section className="split-section">
        <div className="split-half split-img" />
        <div className="split-half split-text">
          <h2>RETAIL PARTNERS</h2>
          <p>Quality products that keep customers coming back.<br />Boudin Balls, Boudin Eggrolls and more.</p>
          <Link to="/retail" className="btn-gold">PARTNER WITH US →</Link>
        </div>
      </section>

      <div className="icon-strip">
        <div><div className="icon">👥</div>Businesses</div>
        <div><div className="icon">🛒</div>Convenience Store Partners</div>
        <div><div className="icon">🍴</div>Good Food Brings People Together</div>
      </div>

      <Footer />
    </div>
  );
}
