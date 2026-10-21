import { db } from "./config";
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from "firebase/firestore";

/** Save a catering order to Firestore. Returns the new doc id. */
export async function saveCateringOrder(order) {
  const ref = await addDoc(collection(db, "cateringOrders"), {
    ...order,
    status: "new", // new | confirmed | completed | cancelled — admin updates this from dashboard
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

/** Save a retail partner inquiry to Firestore. */
export async function saveRetailLead(lead) {
  const ref = await addDoc(collection(db, "retailLeads"), {
    ...lead,
    status: "new",
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

/** Live-subscribe to all catering orders, newest first. Call the returned function to unsubscribe. */
export function subscribeToCateringOrders(callback) {
  const q = query(collection(db, "cateringOrders"), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}

/** Live-subscribe to all retail leads, newest first. */
export function subscribeToRetailLeads(callback) {
  const q = query(collection(db, "retailLeads"), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}
