import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { saveRetailLead } from "../firebase/orders";
import { sendRetailEmail } from "../firebase/email";

const initialState = {
  businessName: "",
  storeAddress: "",
  contactName: "",
  position: "",
  phone: "",
  email: "",
  locations: "",
  sellsHotFood: "",
  products: [],
  hasWarmer: "",
  contactMethod: "",
  additionalInfo: "",
};

export default function Retail() {
  const [form, setForm] = useState(initialState);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function toggleProduct(value) {
    setForm((f) => {
      const has = f.products.includes(value);
      return { ...f, products: has ? f.products.filter((p) => p !== value) : [...f.products, value] };
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      // 1. Save to Firestore first — source of truth for the dashboard's Retail Leads tab.
      await saveRetailLead(form);
      // 2. Send notification email (best-effort — lead is already saved even if email fails).
      await sendRetailEmail(form);
      setSubmitted(true);
    } catch (err) {
      setError("Something went wrong sending your request. Please try again or contact us directly.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div>
        <Header variant="catering" />
        <div className="success-box">
          <h2>Thank you!</h2>
          <p>We've received your retail partnership request. Bayou Flava will review your location and contact you to discuss availability and next steps.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header variant="home" />

      <section className="retail-hero">
        <div className="retail-hero-inner">
          <div style={{ flex: "1 1 340px" }}>
            <p style={{ color: "var(--color-gold)", fontWeight: 700, letterSpacing: 2, marginBottom: 6 }}>RETAIL PARTNERS</p>
            <h1>BRING BAYOU FLAVA <span className="accent">TO YOUR STORE.</span></h1>
            <p style={{ opacity: 0.85 }}>Hot grab &amp; go Louisiana favorites made for convenience stores.</p>
            <div className="section-divider" />
            <p style={{ fontWeight: 600 }}>BOUDIN EGGROLLS &nbsp;•&nbsp; BOUDIN BALLS</p>
            <div className="retail-icons">
              <div><div className="icon">📈</div>Increase Foot Traffic</div>
              <div><div className="icon">👥</div>A Popular Louisiana Favorite</div>
              <div><div className="icon">🤝</div>A Simple Partnership</div>
            </div>
          </div>
          <div className="retail-hero-img" />
        </div>
      </section>

      <section className="retail-form-section">
        <h2>INTERESTED IN BAYOU FLAVA FOR YOUR STORE?</h2>
        <p className="subtext">Tell us about your location. We'll contact you to discuss the retail program.</p>

        <form className="form-wrap" style={{ paddingBottom: 40 }} onSubmit={handleSubmit}>
          <div className="field-row">
            <div className="field">
              <label>Store / Business Name *</label>
              <input required placeholder="e.g. Joe's Corner Store" value={form.businessName}
                onChange={(e) => update("businessName", e.target.value)} />
            </div>
            <div className="field">
              <label>Store Address *</label>
              <input required placeholder="Street address, city, state, ZIP" value={form.storeAddress}
                onChange={(e) => update("storeAddress", e.target.value)} />
            </div>
          </div>

          <div className="field-row">
            <div className="field">
              <label>Contact Name *</label>
              <input required placeholder="First and last name" value={form.contactName}
                onChange={(e) => update("contactName", e.target.value)} />
            </div>
            <div className="field">
              <label>Your Position *</label>
              <select required value={form.position} onChange={(e) => update("position", e.target.value)}>
                <option value="">Select one</option>
                <option>Owner</option>
                <option>Manager</option>
                <option>Buyer</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          <div className="field-row">
            <div className="field">
              <label>Phone Number *</label>
              <input required type="tel" placeholder="(123) 456-7890" value={form.phone}
                onChange={(e) => update("phone", e.target.value)} />
            </div>
            <div className="field">
              <label>Email Address *</label>
              <input required type="email" placeholder="you@yourstore.com" value={form.email}
                onChange={(e) => update("email", e.target.value)} />
            </div>
          </div>

          <div className="field-row">
            <div className="field">
              <label>How many locations do you operate? *</label>
              <select required value={form.locations} onChange={(e) => update("locations", e.target.value)}>
                <option value="">Select one</option>
                <option>1</option>
                <option>2-5</option>
                <option>6-10</option>
                <option>10+</option>
              </select>
            </div>
            <div className="field">
              <label>Do you currently sell hot grab &amp; go food? *</label>
              <select required value={form.sellsHotFood} onChange={(e) => update("sellsHotFood", e.target.value)}>
                <option value="">Select one</option>
                <option>Yes</option>
                <option>No</option>
              </select>
            </div>
          </div>

          <div className="field">
            <label>Which products are you interested in? *</label>
            <div className="checkbox-row">
              <label><input type="checkbox" checked={form.products.includes("Boudin Eggrolls")}
                onChange={() => toggleProduct("Boudin Eggrolls")} /> Boudin Eggrolls</label>
              <label><input type="checkbox" checked={form.products.includes("Boudin Balls")}
                onChange={() => toggleProduct("Boudin Balls")} /> Boudin Balls</label>
              <label><input type="checkbox" checked={form.products.includes("Both")}
                onChange={() => toggleProduct("Both")} /> Both</label>
            </div>
          </div>

          <div className="field">
            <label>Do you currently have a hot food warmer? *</label>
            <select required value={form.hasWarmer} onChange={(e) => update("hasWarmer", e.target.value)}>
              <option value="">Select one</option>
              <option>Yes</option>
              <option>No</option>
              <option>Not sure</option>
            </select>
          </div>

          <div className="field">
            <label>Best way to contact you *</label>
            <select required value={form.contactMethod} onChange={(e) => update("contactMethod", e.target.value)}>
              <option value="">Select one</option>
              <option>Phone</option>
              <option>Email</option>
              <option>Text</option>
            </select>
          </div>

          <div className="field">
            <label>Additional Information (Optional)</label>
            <textarea placeholder="Tell us about your store, locations, or any questions." value={form.additionalInfo}
              onChange={(e) => update("additionalInfo", e.target.value)} />
          </div>

          {error && <p className="error-text">{error}</p>}

          <button className="btn-gold" type="submit" disabled={submitting}>
            {submitting ? "SENDING..." : "REQUEST RETAIL PARTNERSHIP →"}
          </button>
          <p style={{ textAlign: "center", fontSize: "0.8rem", color: "#6b5d40", marginTop: 16 }}>
            Submitting this form does not automatically establish a retail partnership.
            Bayou Flava will review your location and contact you to discuss availability and next steps.
          </p>
        </form>
      </section>

      <Footer />
    </div>
  );
}
