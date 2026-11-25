/* ==========================================================
   config.js — all settings you may need to change live here
   ========================================================== */

/* WhatsApp Business number: country code + number, no "+" or spaces */
const WHATSAPP_NUMBER = "917002429458";

/* Commission on a closed deal */
const BUYER_FEE_PCT  = 0.015;  // 1.5%
const SELLER_FEE_PCT = 0.025;  // 2.5%
const TOTAL_FEE_PCT  = BUYER_FEE_PCT + SELLER_FEE_PCT;

/* One-time, non-refundable fee charged to the seller at listing submission */
const VERIFICATION_FEE = 1000;

/* MSME / Udyam registration number shown as a trust badge */
const UDYAM_NUMBER = "UDYAM-AS-08-0026466";

/* Supabase project (Project Settings → API) */
const SUPABASE_URL = "https://vqwooxhwsyftfwhrumjn.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_s0D9jhG-ZvghVivUmnuiUQ_kmoVpCOQ";
const PHOTO_BUCKET = "land-photos";

/* Broker dashboard access code.
   NOTE: anything in a browser file can be read by visitors. Treat this as a
   light gate only; move to Supabase Auth before handling real client data. */
const ADMIN_CODE = "Startup@2026";

const USE_SUPABASE = !SUPABASE_URL.startsWith("YOUR_") && !SUPABASE_ANON_KEY.startsWith("YOUR_");
const sb = (USE_SUPABASE && window.supabase) ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;
