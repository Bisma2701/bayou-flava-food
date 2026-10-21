import { useState, useRef } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { saveCateringOrder } from "../firebase/orders";
import { sendOrderEmails } from "../firebase/email";

const PRODUCTS = [
  {
    id: "chicken-pasta",
    name: "CHICKEN PASTA",
    price: 200,
    feeds: 20,
    img: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=800&q=60",
  },
  {
    id: "shrimp-pasta",
    name: "SHRIMP PASTA",
    price: 220,
    feeds: 20,
    img: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=800&q=60",
  },
];

const initialDelivery = {
  companyName: "",
  contactName: "",
  phone: "",
  email: "",
  address: "",
  instructions: "",
  date: "",
  time: "",
};

export default function Catering() {
  const [qty, setQty] = useState({ "chicken-pasta": 0, "shrimp-pasta": 0 });
  const [screen, setScreen] = useState("order"); // order | delivery | review | success
  const [delivery, setDelivery] = useState(initialDelivery);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const orderSummaryRef = useRef(null);

  const totalPans = Object.values(qty).reduce((a, b) => a + b, 0);
  const totalPrice = PRODUCTS.reduce((sum, p) => sum + qty[p.id] * p.price, 0);
  const totalFeeds = PRODUCTS.reduce((sum, p) => sum + qty[p.id] * p.feeds, 0);
  const hasItems = totalPans > 0;

  function changeQty(id, delta) {
    setQty((q) => ({ ...q, [id]: Math.max(0, q[id] + delta) }));
  }

  function scrollToSummary() {
    orderSummaryRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function updateDelivery(field, value) {
    setDelivery((d) => ({ ...d, [field]: value }));
  }

  async function handleFinalSubmit() {
    setError("");
    setSubmitting(true);

    const items = PRODUCTS.filter((p) => qty[p.id] > 0).map((p) => ({
      name: p.name,
      qty: qty[p.id],
      subtotal: qty[p.id] * p.price,
    }));
    const orderSummaryText = items.map((i) => `${i.name} x${i.qty} — $${i.subtotal}`).join("\n");
    const payload = { items, orderSummaryText, totalFeeds, totalPrice, ...delivery };

    try {
      // 1. Save to Firestore first — this is the source of truth for the dashboard.
      await saveCateringOrder(payload);
      // 2. Send emails (best-effort — order is already saved even if email fails).
      await sendOrderEmails(payload);
      setScreen("success");
    } catch (err) {
      setError("Something went wrong saving your request. Please try again or contact us directly.");
    } finally {
      setSubmitting(false);
    }
  }

  // ---------- SUCCESS SCREEN ----------
  if (screen === "success") {
    return (
      <div>
        <Header variant="catering" />
        <div className="success-box">
          <h2>Request Received!</h2>
          <p>Thank you for your catering request. Bayou Flava will verify availability and contact you shortly to confirm your order.</p>
        </div>
        <Footer />
      </div>
    );
  }

  // ---------- DELIVERY INFO SCREEN ----------
  if (screen === "delivery") {
    const canContinue = delivery.contactName && delivery.phone && delivery.email && delivery.address && delivery.date && delivery.time;
    return (
      <div>
        <Header variant="catering" />
        <div className="page-heading">
          <p className="eyebrow">BAYOU FLAVA CATERING REQUEST</p>
          <h1>Delivery Information</h1>
        </div>
        <form className="form-wrap" onSubmit={(e) => { e.preventDefault(); if (canContinue) setScreen("review"); }}>
          <div className="field">
            <label>Company / Organization</label>
            <input value={delivery.companyName} onChange={(e) => updateDelivery("companyName", e.target.value)} />
          </div>
          <div className="field">
            <label>Contact Name *</label>
            <input required value={delivery.contactName} onChange={(e) => updateDelivery("contactName", e.target.value)} />
          </div>
          <div className="field-row">
            <div className="field">
              <label>Phone *</label>
              <input required type="tel" value={delivery.phone} onChange={(e) => updateDelivery("phone", e.target.value)} />
            </div>
            <div className="field">
              <label>Email *</label>
              <input required type="email" value={delivery.email} onChange={(e) => updateDelivery("email", e.target.value)} />
            </div>
          </div>
          <div className="field">
            <label>Delivery Address *</label>
            <input required value={delivery.address} onChange={(e) => updateDelivery("address", e.target.value)} />
          </div>
          <div className="field">
            <label>Suite / Building / Delivery Instructions</label>
            <textarea value={delivery.instructions} onChange={(e) => updateDelivery("instructions", e.target.value)} />
          </div>
          <div className="field-row">
            <div className="field">
              <label>Delivery Date *</label>
              <input required type="date" value={delivery.date} onChange={(e) => updateDelivery("date", e.target.value)} />
            </div>
            <div className="field">
              <label>Delivery Time *</label>
              <input required type="time" value={delivery.time} onChange={(e) => updateDelivery("time", e.target.value)} />
            </div>
          </div>

          <button className="btn-gold" type="submit" disabled={!canContinue}>CONTINUE →</button>
          <div style={{ textAlign: "center", marginTop: 14 }}>
            <button type="button" className="btn-link" onClick={() => setScreen("order")}>← Back</button>
          </div>
        </form>
        <Footer />
      </div>
    );
  }

  // ---------- REVIEW SCREEN ----------
  if (screen === "review") {
    return (
      <div>
        <Header variant="catering" />
        <div className="page-heading">
          <p className="eyebrow">BAYOU FLAVA CATERING REQUEST</p>
          <h1>Review Request</h1>
        </div>
        <div className="review-card">
          <div className="review-section">
            <div className="review-section-head">
              <span className="label">YOUR ORDER</span>
              <button className="review-edit" onClick={() => setScreen("order")}>EDIT</button>
            </div>
            {PRODUCTS.filter((p) => qty[p.id] > 0).map((p) => (
              <div key={p.id} className="order-line" style={{ color: "inherit" }}>
                <span>{p.name.replace(/^\w/, (c) => c)} — {qty[p.id]} Full Pan{qty[p.id] > 1 ? "s" : ""}</span>
                <span className="price" style={{ color: "var(--color-gold)" }}>${qty[p.id] * p.price}</span>
              </div>
            ))}
            <p style={{ color: "#6b5d40", fontSize: "0.9rem", marginTop: 6 }}>Approximately feeds {totalFeeds} people</p>
            <p style={{ color: "var(--color-gold)", fontWeight: 700, fontSize: "0.85rem" }}>SALAD &amp; ROLLS INCLUDED</p>
          </div>

          <div className="review-section">
            <div className="review-section-head">
              <span className="label">REQUESTED DATE &amp; TIME</span>
              <button className="review-edit" onClick={() => setScreen("delivery")}>EDIT</button>
            </div>
            <p style={{ fontWeight: 700, margin: 0 }}>{delivery.date} at {delivery.time}</p>
          </div>

          <div className="review-section">
            <div className="review-section-head">
              <span className="label">DELIVERY LOCATION</span>
              <button className="review-edit" onClick={() => setScreen("delivery")}>EDIT</button>
            </div>
            <p style={{ fontWeight: 700, margin: 0 }}>{delivery.companyName}</p>
            <p style={{ color: "#6b5d40", margin: 0 }}>{delivery.address}{delivery.instructions ? `, ${delivery.instructions}` : ""}</p>
          </div>

          <div className="review-total-box">
            <div className="order-total-label">ESTIMATED FOOD TOTAL</div>
            <div className="order-total-value">${totalPrice}</div>
          </div>
        </div>

        <p className="disclaimer">
          Submitting a request does not confirm your order. Bayou Flava will verify availability and contact you to confirm.
        </p>

        {error && <p className="error-text" style={{ textAlign: "center" }}>{error}</p>}

        <div className="form-wrap" style={{ paddingTop: 0 }}>
          <button className="btn-gold" onClick={handleFinalSubmit} disabled={submitting}>
            {submitting ? "SENDING..." : "SUBMIT CATERING REQUEST →"}
          </button>
          <div style={{ textAlign: "center", marginTop: 14 }}>
            <button type="button" className="btn-link" onClick={() => setScreen("delivery")}>← Back</button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // ---------- ORDER (BUILD) SCREEN ----------
  return (
    <div>
      <Header variant="catering" />

      <div className="page-heading">
        <p className="eyebrow">BAYOU FLAVA CATERING REQUEST</p>
        <h1>Build Your Order</h1>
        <p>Choose full catering pans for your crew. Salad and rolls are included with every pan.</p>
      </div>

      {PRODUCTS.map((p) => (
        <div className="product-card" key={p.id}>
          <div className="product-img" style={{ backgroundImage: `url(${p.img})` }} />
          <div className="product-body">
            <h3>{p.name}</h3>
            <p className="product-meta">Full Catering Pan</p>
            <p className="product-feeds">Feeds approximately {p.feeds} people</p>
            <p className="product-included">SALAD &amp; ROLLS INCLUDED</p>
            <p className="product-price">${p.price} PER PAN</p>
          </div>
          <div className="qty-row">
            <button className="qty-btn" onClick={() => changeQty(p.id, -1)} aria-label={`Decrease ${p.name}`}>−</button>
            <div className="qty-display">
              <span className="num">{qty[p.id]}</span>
              <span className="label">FULL PANS</span>
            </div>
            <button className="qty-btn" onClick={() => changeQty(p.id, 1)} aria-label={`Increase ${p.name}`}>+</button>
          </div>
        </div>
      ))}

      <div className="order-summary" ref={orderSummaryRef}>
        <h3>YOUR ORDER</h3>
        {!hasItems && <p className="empty-order">No items selected yet. Add a pan above to get started.</p>}
        {hasItems && (
          <>
            {PRODUCTS.filter((p) => qty[p.id] > 0).map((p) => (
              <div className="order-line" key={p.id}>
                <span>{p.name.charAt(0) + p.name.slice(1).toLowerCase()} — {qty[p.id]} Full Pan{qty[p.id] > 1 ? "s" : ""}</span>
                <span className="price">${qty[p.id] * p.price}</span>
              </div>
            ))}
            <p className="order-feeds">Approximately feeds {totalFeeds} people</p>
            <hr className="order-divider" />
            <div className="order-total-label">ESTIMATED FOOD TOTAL</div>
            <div className="order-total-value">${totalPrice}</div>
            <p className="order-included">SALAD &amp; ROLLS INCLUDED</p>
          </>
        )}
        <button className="btn-gold" disabled={!hasItems} onClick={() => setScreen("delivery")}>
          CONTINUE →
        </button>
      </div>

      <Footer />

      {hasItems && (
        <div className="sticky-bar">
          <div className="summary-text">
            {totalPans} Full Pan{totalPans > 1 ? "s" : ""} · <span className="total">Est. ${totalPrice}</span>
          </div>
          <button onClick={scrollToSummary}>View Order</button>
        </div>
      )}
    </div>
  );
}
