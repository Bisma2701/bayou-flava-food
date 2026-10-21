import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/config";
import { subscribeToCateringOrders, subscribeToRetailLeads } from "../../firebase/orders";

function formatDate(ts) {
  if (!ts?.toDate) return "—";
  return ts.toDate().toLocaleString();
}

export default function AdminDashboard() {
  const [tab, setTab] = useState("catering");
  const [orders, setOrders] = useState([]);
  const [leads, setLeads] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const unsub1 = subscribeToCateringOrders(setOrders);
    const unsub2 = subscribeToRetailLeads(setLeads);
    return () => {
      unsub1();
      unsub2();
    };
  }, []);

  const list = tab === "catering" ? orders : leads;

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-cream)" }}>
      <header className="site-header">
        <span className="brand-plain">BAYOU FLAVA — ADMIN</span>
        <button className="icon-btn" onClick={() => signOut(auth)}>Sign Out</button>
      </header>

      <div className="container" style={{ paddingTop: 30, paddingBottom: 60 }}>
        <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
          <button
            className="btn-gold"
            style={{ width: "auto", padding: "10px 20px", opacity: tab === "catering" ? 1 : 0.5 }}
            onClick={() => setTab("catering")}
          >
            Catering Orders ({orders.length})
          </button>
          <button
            className="btn-gold"
            style={{ width: "auto", padding: "10px 20px", opacity: tab === "retail" ? 1 : 0.5 }}
            onClick={() => setTab("retail")}
          >
            Retail Leads ({leads.length})
          </button>
        </div>

        {list.length === 0 && <p style={{ color: "#6b5d40" }}>No {tab === "catering" ? "orders" : "leads"} yet.</p>}

        <div style={{ display: "grid", gap: 14 }}>
          {list.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelected(item)}
              style={{
                background: "var(--color-cream-dark)",
                padding: "16px 20px",
                borderRadius: 4,
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 8,
              }}
            >
              <div>
                <strong>{item.contactName || item.businessName}</strong>
                <div style={{ fontSize: "0.85rem", color: "#6b5d40" }}>{formatDate(item.createdAt)}</div>
              </div>
              <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                {tab === "catering" && <span style={{ fontWeight: 700, color: "var(--color-gold)" }}>${item.totalPrice}</span>}
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    padding: "4px 10px",
                    borderRadius: 20,
                    background: item.status === "new" ? "#d98e1f" : "#8a9c6b",
                    color: "#fff",
                    textTransform: "uppercase",
                  }}
                >
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selected && (
        <div
          onClick={() => setSelected(null)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, zIndex: 200 }}
        >
          <div onClick={(e) => e.stopPropagation()} style={{ background: "#fff", borderRadius: 6, padding: 28, maxWidth: 520, width: "100%", maxHeight: "85vh", overflowY: "auto" }}>
            <h3 style={{ fontFamily: "var(--font-heading)", marginTop: 0 }}>{selected.contactName || selected.businessName}</h3>
            <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit", fontSize: "0.9rem", background: "var(--color-cream)", padding: 16, borderRadius: 4 }}>
{JSON.stringify(selected, null, 2)}
            </pre>
            <button className="btn-link" onClick={() => setSelected(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
