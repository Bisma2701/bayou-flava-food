// ============================================================
// EMAIL SERVICE — EmailJS (free tier: 200 emails/month)
// ============================================================
// 1. Go to https://www.emailjs.com and create a free account
// 2. Add an Email Service (connect your Gmail/Outlook) — note the SERVICE_ID
// 3. Create TWO email templates:
//    a) "Admin Notification" template — sent to YOU when an order/inquiry comes in
//       note the TEMPLATE_ID_ADMIN
//    b) "Customer Confirmation" template — sent to the CUSTOMER confirming their request
//       note the TEMPLATE_ID_CUSTOMER
// 4. Go to Account > General to find your PUBLIC_KEY
// 5. Fill in the 4 values below.
// See README.md section "Email Setup" for full step-by-step instructions with screenshots links.

import emailjs from "@emailjs/browser";

const SERVICE_ID = "YOUR_SERVICE_ID";
const TEMPLATE_ID_ADMIN = "YOUR_ADMIN_TEMPLATE_ID";
const TEMPLATE_ID_CUSTOMER = "YOUR_CUSTOMER_TEMPLATE_ID";
const PUBLIC_KEY = "YOUR_PUBLIC_KEY";

/**
 * Sends the admin notification email + the customer confirmation email.
 * Both are "best effort" — if one fails it will not block the order from
 * being saved (order saving happens separately, before this is called).
 */
export async function sendOrderEmails(data) {
  const results = { admin: false, customer: false };

  try {
    await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID_ADMIN,
      {
        to_email: "OWNER_EMAIL_HERE@example.com", // TODO: put the business owner's email
        customer_name: data.contactName,
        customer_email: data.email,
        customer_phone: data.phone,
        order_summary: data.orderSummaryText,
        total_price: data.totalPrice,
        delivery_date: data.date,
        delivery_time: data.time,
        delivery_address: data.address,
      },
      PUBLIC_KEY
    );
    results.admin = true;
  } catch (err) {
    console.error("Admin email failed:", err);
  }

  try {
    await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID_CUSTOMER,
      {
        to_email: data.email,
        customer_name: data.contactName,
        order_summary: data.orderSummaryText,
        total_price: data.totalPrice,
        delivery_date: data.date,
        delivery_time: data.time,
      },
      PUBLIC_KEY
    );
    results.customer = true;
  } catch (err) {
    console.error("Customer email failed:", err);
  }

  return results;
}

/** Simpler single-email sender used by the Retail Partner form. */
export async function sendRetailEmail(data) {
  try {
    await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID_ADMIN,
      {
        to_email: "OWNER_EMAIL_HERE@example.com", // TODO: put the business owner's email
        customer_name: data.contactName,
        customer_email: data.email,
        customer_phone: data.phone,
        order_summary: `Retail Partner Inquiry from ${data.businessName}`,
      },
      PUBLIC_KEY
    );
    return true;
  } catch (err) {
    console.error("Retail email failed:", err);
    return false;
  }
}
