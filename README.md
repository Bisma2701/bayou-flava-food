# Bayou Flava Food — React Website (Full Version)

4 areas: Home, Catering (multi-step order + live pricing), Retail Partner (contact form),
and an Admin Dashboard (order history for both).

No monthly-cost backend required — uses Firebase's free tier (Firestore + Authentication)
and EmailJS's free tier (200 emails/month) for admin + customer emails.

---

## 1. Run it locally

Requires [Node.js](https://nodejs.org) 18+.

```bash
cd bayou-flava
npm install
npm run dev
```

Open the link shown (usually `http://localhost:5173`).

**Note:** the site will run, but order submission / dashboard / emails won't actually work
until you complete the setup in sections 2 and 3 below — those are one-time steps.

---

## 2. Backend setup — Firebase (free, ~15-20 minutes, one-time)

Firebase gives you the database (to store orders) and login (to protect the dashboard).

1. Go to https://console.firebase.google.com and sign in with any Google account
2. Click **"Add project"** → name it (e.g. `bayou-flava`) → finish the wizard (you can
   disable Google Analytics, not needed)
3. In the left sidebar: **Build → Firestore Database → Create database**
   - Choose a location close to your customers
   - Start in **test mode** for now (we'll note a production security rule below)
4. In the left sidebar: **Build → Authentication → Get started → Sign-in method →
   Email/Password → Enable → Save**
5. Still in Authentication, go to the **Users** tab → **Add user** → enter the admin's
   email + a password. This is what you'll log into `/admin` with.
6. Go to **Project Overview** (top left) → click the **`</>`** (web app) icon → register
   an app (any nickname) → it will show a `firebaseConfig` object like:
   ```js
   const firebaseConfig = {
     apiKey: "AIza...",
     authDomain: "bayou-flava.firebaseapp.com",
     projectId: "bayou-flava",
     storageBucket: "bayou-flava.appspot.com",
     messagingSenderId: "...",
     appId: "...",
   };
   ```
7. Open `src/firebase/config.js` in this project and paste your real values in, replacing
   the placeholders.

**Before going live**, tighten the Firestore security rules (Firestore Database → Rules) so only
logged-in admins can read orders, e.g.:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /cateringOrders/{doc} {
      allow create: if true;                 // anyone can submit an order
      allow read, update, delete: if request.auth != null;  // only logged-in admin can view/manage
    }
    match /retailLeads/{doc} {
      allow create: if true;
      allow read, update, delete: if request.auth != null;
    }
  }
}
```

---

## 3. Email setup — EmailJS (free, ~10-15 minutes, one-time)

This sends the admin notification email AND the customer confirmation email.

1. Go to https://www.emailjs.com → create a free account
2. **Email Services** → **Add New Service** → connect your Gmail/Outlook (whichever the
   business owner uses) → note the **Service ID**
3. **Email Templates** → **Create New Template** — make TWO templates:
   - **Admin template** — subject like `New Catering Order — {{customer_name}}`, body
     includes `{{order_summary}}`, `{{total_price}}`, `{{delivery_date}}`, `{{delivery_time}}`,
     `{{delivery_address}}`, `{{customer_email}}`, `{{customer_phone}}`. Note its **Template ID**.
   - **Customer template** — subject like `We received your catering request!`, body
     includes `{{customer_name}}`, `{{order_summary}}`, `{{total_price}}`. Note its **Template ID**.
4. **Account → General** → copy your **Public Key**
5. Open `src/firebase/email.js` and fill in:
   - `SERVICE_ID`
   - `TEMPLATE_ID_ADMIN`
   - `TEMPLATE_ID_CUSTOMER`
   - `PUBLIC_KEY`
   - Replace `OWNER_EMAIL_HERE@example.com` (appears twice) with the real business owner email

---

## 4. Deploy the site (free — Netlify or Vercel)

### Netlify (easiest — drag & drop)
1. `npm run build` → creates a `dist` folder
2. Go to https://app.netlify.com/drop and drag the `dist` folder in
3. Site goes live instantly on a free `.netlify.app` link
4. Custom domain: Netlify dashboard → **Domain settings** → **Add custom domain** → follow DNS steps

### Vercel
1. Free account at https://vercel.com
2. `npm install -g vercel`
3. Inside `bayou-flava/`, run `vercel` and follow the prompts
4. Custom domain: project → **Settings → Domains**

Both are free and give HTTPS automatically.

---

## 5. Using the Admin Dashboard

- Go to `yoursite.com/admin`
- Log in with the email/password you created in Firebase Authentication (step 2.5 above)
- You'll see two tabs: **Catering Orders** and **Retail Leads**, newest first
- Click any row to see the full details in a popup
- New submissions appear automatically (live) — no need to refresh

---

## 6. Editing content later

- Product names/prices/images: `src/pages/Catering.jsx` → `PRODUCTS` array
- Retail form fields: `src/pages/Retail.jsx`
- Colors/fonts: `src/index.css`
- Email wording: edit the templates directly in your EmailJS dashboard (no code change needed)

---

## 7. What's included

- 3 public pages, responsive (mobile = desktop layout)
- Catering: live qty selector, real-time price calc, order summary + sticky mobile bar,
  delivery info step, review step
- Retail: contact form matching the reference design
- On submit: order/lead saved to Firestore **and** admin + customer emails sent
- Admin Dashboard (`/admin`): login-protected, live order/lead history, click for full details
- No payment processing (request-only, as specified)

## 8. Costs going forward

- Firebase free tier: 50k reads/20k writes per day — more than enough for this scale
- EmailJS free tier: 200 emails/month — upgrade only needed if order volume gets high
- Hosting (Netlify/Vercel): free tier is enough for a site this size
- Domain: whatever the registrar charges (client's own purchase, as discussed)
