/* ==========================================================
   i18n.js — English / Assamese text and the language switch
   ========================================================== */

let LANG = 'en';
const T = {
  en: {
    brandTag: "land, honestly brokered",
    navBrowse: "Browse Land", navSell: "Sell Your Land", navHow: "How It Works", navAdmin: "Admin", navCta: "List Land",
    heroTitle: "Buy and sell land in Assam, without the guesswork.",
    heroLede: "Every listing here is checked by a broker before it goes live, and every deal is closed with a broker in the middle — so buyers know the land is real, and sellers know the buyer is serious.",
    browseBtn: "Browse Land", listBtn: "List Your Land",
    recentApproved: "Recently approved", seeAll: "See all listings →",
    howClosesTitle: "How a deal actually closes",
    step1t: "Seller lists, broker verifies", step1d: "A seller submits their land details. Nothing goes live until it's reviewed and approved.",
    step2t: "Buyer enquires", step2d: "A buyer finds land they like and sends an enquiry. The broker connects both sides directly.",
    step3t: "Broker closes the deal", step3d: "The broker handles the negotiation and paperwork, and charges a fee only once the deal is done.",
    fullDetails: "Full details", listYourLand: "List your land",
    hiwTitle: "How Bhumi Sathi works",
    hiwSub: "A simple idea: land deals in Assam often fall apart from mistrust, disappearing sellers, or unclear paperwork. Putting a broker in the middle of every deal fixes that.",
    forSellers: "For Sellers", forSellersT: "List for free, get verified", forSellersD: "Submit your land details. A broker checks the basics before it goes live, so serious buyers take listings here seriously.",
    forBuyers: "For Buyers", forBuyersT: "Browse with confidence", forBuyersD: "Every plot you see has already passed a review. Send an enquiry and the broker connects you directly with the seller.",
    forEveryone: "For Everyone", forEveryoneT: "Broker closes the loop", forEveryoneD: "The broker helps negotiate, verifies documents, and sees the deal through to registration.",
    whyFeeTitle: "Why a small verification fee?",
    whyFeeBody: `A one-time, non-refundable fee of ${fmtINR(VERIFICATION_FEE)} is collected from the seller when a listing is submitted — this covers the broker's site visit and document check, whether or not the land eventually sells. Buyers pay nothing to browse or enquire. The closing commission above is only charged once a deal actually goes through.`,
    regTitle: "Registered business",
    regBody: `Bhumi Sathi is registered under the Ministry of MSME, Government of India (Udyam No. ${UDYAM_NUMBER}). This is a matter of public record and can be verified on udyamregistration.gov.in.`,
    footerDesc: "A brokered marketplace for buying and selling land across Assam. Every deal is reviewed and closed by a broker — no fake listings, no vanishing sellers.",
    footerServing: "Serving Kamrup, Nagaon, Jorhat, Dibrugarh, Sonitpur & more.",
    ctaTitle: "Have land to sell in Assam?",
    ctaBody: "Register, list your plot, and a broker will visit, verify and bring you serious buyers.",
    findLand: "Find land by area", searchBtn: "Search listings"
  },
  as: {
    brandTag: "সততাৰে মধ্যস্থতা কৰা মাটি",
    navBrowse: "মাটি চাওক", navSell: "মাটি বিক্ৰী কৰক", navHow: "কেনেকৈ কাম কৰে", navAdmin: "এডমিন", navCta: "তালিকাভুক্ত কৰক",
    heroTitle: "অসমত মাটি কিনক আৰু বিক্ৰী কৰক, কোনো সংশয় নোহোৱাকৈ।",
    heroLede: "ইয়াত থকা প্ৰতিটো তালিকা প্ৰকাশ হোৱাৰ আগতেই এজন দালালে পৰীক্ষা কৰে, আৰু প্ৰতিটো চুক্তি দালালৰ মাধ্যমতহে সম্পূৰ্ণ হয় — যাতে ক্ৰেতাই জানিব পাৰে মাটিখন প্ৰকৃত, আৰু বিক্ৰেতাই জানিব পাৰে ক্ৰেতাগৰাকী প্ৰকৃততে আগ্ৰহী।",
    browseBtn: "মাটি চাওক", listBtn: "আপোনাৰ মাটি তালিকাভুক্ত কৰক",
    recentApproved: "শেহতীয়াকৈ অনুমোদিত", seeAll: "সকলো তালিকা চাওক →",
    howClosesTitle: "এটা চুক্তি কেনেকৈ সম্পূৰ্ণ হয়",
    step1t: "বিক্ৰেতাই তালিকাভুক্ত কৰে, দালালে সত্যাপন কৰে", step1d: "বিক্ৰেতাজনে মাটিৰ বিৱৰণ দাখিল কৰে। পৰীক্ষা আৰু অনুমোদন নোহোৱালৈকে একো প্ৰকাশ নহয়।",
    step2t: "ক্ৰেতাই অনুসন্ধান কৰে", step2d: "ক্ৰেতাজনে পছন্দৰ মাটি বিচাৰি পায় আৰু অনুসন্ধান পঠায়। দালালে দুয়োপক্ষক পোনপটীয়াকৈ সংযোগ কৰে।",
    step3t: "দালালে চুক্তি সম্পূৰ্ণ কৰে", step3d: "দালালে দৰাদৰি আৰু কাগজ-পত্ৰৰ কাম চম্ভালে, আৰু চুক্তি সম্পূৰ্ণ হোৱাৰ পিছতহে মাচুল লয়।",
    fullDetails: "সম্পূৰ্ণ বিৱৰণ", listYourLand: "আপোনাৰ মাটি তালিকাভুক্ত কৰক",
    hiwTitle: "ভূমি সাথীয়ে কেনেকৈ কাম কৰে",
    hiwSub: "এটা সহজ ধাৰণা: অসমত মাটিৰ চুক্তি সঘনাই অবিশ্বাস, উধাও হোৱা বিক্ৰেতা, বা অস্পষ্ট কাগজ-পত্ৰৰ বাবে ভাঙি পৰে। প্ৰতিটো চুক্তিৰ মাজত এজন দালাল থকাই এই সমস্যা সমাধান কৰে।",
    forSellers: "বিক্ৰেতাসকলৰ বাবে", forSellersT: "বিনামূলীয়াকৈ তালিকাভুক্ত কৰক, সত্যাপিত হওক", forSellersD: "আপোনাৰ মাটিৰ বিৱৰণ দাখিল কৰক। প্ৰকাশ হোৱাৰ আগতে দালালে মূল কথাবোৰ পৰীক্ষা কৰে, যাতে প্ৰকৃত ক্ৰেতাসকলে ইয়াত থকা তালিকাক গুৰুত্ব সহকাৰে লয়।",
    forBuyers: "ক্ৰেতাসকলৰ বাবে", forBuyersT: "বিশ্বাসেৰে চাওক", forBuyersD: "আপুনি দেখা প্ৰতিখন মাটিয়ে ইতিমধ্যে পৰীক্ষা পাৰ কৰিছে। এটা অনুসন্ধান পঠাওক আৰু দালালে আপোনাক পোনপটীয়াকৈ বিক্ৰেতাৰ সৈতে সংযোগ কৰিব।",
    forEveryone: "সকলোৰে বাবে", forEveryoneT: "দালালে সম্পূৰ্ণ কৰে", forEveryoneD: "দালালে দৰাদৰিত সহায় কৰে, কাগজ-পত্ৰ সত্যাপন কৰে, আৰু পঞ্জীয়নলৈকে চুক্তিটো চাই থাকে।",
    whyFeeTitle: "সৰু সত্যাপন মাচুল কিয়?",
    whyFeeBody: `তালিকা দাখিল কৰাৰ সময়ত বিক্ৰেতাৰ পৰা এবাৰতীয়া, ঘূৰাই নিদিয়া ${fmtINR(VERIFICATION_FEE)} মাচুল লোৱা হয় — ই দালালৰ স্থান পৰিদৰ্শন আৰু কাগজ-পত্ৰ পৰীক্ষাৰ খৰচ বহন কৰে, মাটিখন শেষত বিক্ৰী হওক বা নহওক। ক্ৰেতাসকলে চোৱা বা অনুসন্ধান কৰাৰ বাবে একো দিব নালাগে। ওপৰৰ কমিছন কেৱল চুক্তি সম্পূৰ্ণ হ'লেহে লোৱা হয়।`,
    regTitle: "পঞ্জীকৃত ব্যৱসায়",
    regBody: `ভূমি সাথী MSME মন্ত্ৰালয়, ভাৰত চৰকাৰৰ অধীনত পঞ্জীভুক্ত (উদ্যম নং. ${UDYAM_NUMBER})। এইটো এটা ৰাজহুৱা তথ্য আৰু udyamregistration.gov.in ত সত্যাপন কৰিব পাৰি।`,
    footerDesc: "অসমজুৰি মাটি কিনা-বেচাৰ এক দালাল-মধ্যস্থিত বজাৰ। প্ৰতিটো চুক্তি দালালৰ দ্বাৰা পৰীক্ষা আৰু সম্পূৰ্ণ কৰা হয় — ভুৱা তালিকা নাই, উধাও হোৱা বিক্ৰেতা নাই।",
    footerServing: "কামৰূপ, নগাঁও, যোৰহাট, ডিব্ৰুগড়, শোণিতপুৰ আৰু অধিক স্থানত সেৱা আগবঢ়োৱা হয়।"
  }
};

/* Falls back to English when an Assamese string is not defined */
function t(key){ return (T[LANG] && T[LANG][key]) || T.en[key] || ''; }

function applyStaticTranslations(){
  document.documentElement.setAttribute('data-lang', LANG);
  document.documentElement.lang = LANG === 'en' ? 'en' : 'as';
  document.getElementById('navBrandTag').textContent = t('brandTag');
  document.getElementById('navBrowse').textContent = t('navBrowse');
  document.getElementById('navSell').textContent = t('navSell');
  document.getElementById('navHow').textContent = t('navHow');
  document.getElementById('navAdmin').textContent = t('navAdmin');
  document.getElementById('navCta').textContent = t('navCta');
  document.getElementById('langToggleBtn').textContent = LANG === 'en' ? 'অসমীয়া' : 'English';
  document.getElementById('footerDesc').textContent = t('footerDesc');
  document.getElementById('footerServing').textContent = t('footerServing');
}

function toggleLang(){
  LANG = (LANG === 'en') ? 'as' : 'en';
  applyStaticTranslations();
  navigate();
}
