// Cloudflare Pages Function: POST /api/create-checkout-session
// Variabili d'ambiente (Cloudflare Pages > Settings > Variables and Secrets):
//   STRIPE_SECRET_KEY (secret), DOMAIN (es. https://tuodominio.it, senza "/" finale)
const COLORS = { grigio: "Grigio", nero: "Nero", blu: "Blu navy", azzurro: "Azzurro", rosso: "Rosso", viola: "Viola" };
const MAX_QTY = 3;

export async function onRequestPost({ request, env }) {
  let body = {};
  try { body = await request.json(); } catch (e) {}
  const color = COLORS[body.color] ? body.color : "grigio";
  const qty = Math.min(MAX_QTY, Math.max(1, parseInt(body.qty, 10) || 1));

  const mode = "payment"; // pagamento singolo
  const params = {
    ui_mode: "form",
    mode,
    line_items: [{ price: "price_1UV1R6AcUX6qZXFV2cAjH7DX", quantity: qty }], // TODO: sostituisci con il Price ID da 8,99 €
    billing_address_collection: "required",
    phone_number_collection: { enabled: false },
    automatic_tax: { enabled: false },
    submit_type: "auto",
    shipping_address_collection: { allowed_countries: ["IT"] },
    name_collection: { individual: { enabled: true } },
    integration_identifier: "custom_embedded_web_0002",
    return_url: `${env.DOMAIN}/grazie.html?session_id={CHECKOUT_SESSION_ID}`,
    metadata: { colore: COLORS[color] },
    payment_intent_data: { metadata: { colore: COLORS[color] } },
  };

  const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "Stripe-Version": "2026-03-25.dahlia",
    },
    body: encode(params),
  });
  const session = await res.json();
  const h = { "Content-Type": "application/json" };
  if (!res.ok) {
    console.error("Stripe error:", JSON.stringify(session));
    return new Response(JSON.stringify({ error: "checkout_failed" }), { status: 500, headers: h });
  }
  return new Response(JSON.stringify({ client_secret: session.client_secret }), { headers: h });
}

// Codifica annidata in formato form-urlencoded richiesto da Stripe
function encode(obj, prefix = "") {
  return Object.entries(obj).flatMap(([k, v]) => {
    const key = prefix ? `${prefix}[${k}]` : k;
    return v !== null && typeof v === "object" ? encode(v, key) : [`${encodeURIComponent(key)}=${encodeURIComponent(v)}`];
  }).join("&");
}
