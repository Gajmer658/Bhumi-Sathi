/* ==========================================================
   utils.js — small helpers + shared constants
   ========================================================== */

function esc(s){
  return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function fmtINR(n){
  n = Math.round(n);
  const s = n.toString();
  let last3 = s.substring(s.length - 3);
  const rest = s.substring(0, s.length - 3);
  if(rest !== '') last3 = ',' + last3;
  return '₹' + rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + last3;
}

function waLink(message){
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function showToast(msg, isError){
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  el.classList.toggle('error', !!isError);
  if(isError) console.error('Bhumi Sathi:', msg);
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => el.classList.remove('show'), isError ? 7000 : 2600);
}

const DISTRICTS = ["Kamrup Metropolitan","Kamrup","Nagaon","Sonitpur","Jorhat","Dibrugarh","Golaghat","Barpeta","Nalbari","Cachar","Karimganj","Dhubri","Tinsukia","Morigaon","Sivasagar","Charaideo","Majuli","Dhemaji"];
const UNITS = ["Bigha","Katha","Lecha","Acre","Sq. ft"];
const ID_TYPES = ["Aadhaar Card","Voter ID","PAN Card"];

const ICON_PATHS = {
  agricultural: '<path d="M12 21v-9"/><path d="M12 12c0-4 2.5-6 6-6 0 4-2 6-6 6Z"/><path d="M12 16c0-3-2-5-5-5 0 3 2 5 5 5Z"/>',
  residential:  '<path d="M3 11.5 12 4l9 7.5"/><path d="M5 10v10h14V10"/><path d="M10 20v-5h4v5"/>',
  commercial:   '<rect x="5" y="3" width="14" height="18" rx="1"/><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2"/>',
  industrial:   '<path d="M3 21V10l6 3.5V10l6 3.5V5h4v16Z"/><path d="M7 17h2M12 17h2M17 17h0"/>'
};

const LAND_TYPES = [
  {id:"agricultural", label:"Agricultural",     tagClass:"tag-agri", bg:"#DCE9DF", fg:"#2C6B47"},
  {id:"residential",  label:"Residential Plot", tagClass:"tag-resi", bg:"#F1E7CF", fg:"#8F6410"},
  {id:"commercial",   label:"Commercial",       tagClass:"tag-comm", bg:"#D9E6EC", fg:"#2E5E73"},
  {id:"industrial",   label:"Industrial",       tagClass:"tag-indu", bg:"#E3E0EC", fg:"#53487F"}
];

function typeInfo(id){ return LAND_TYPES.find(x => x.id === id) || LAND_TYPES[0]; }

function iconSVG(type){
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON_PATHS[type] || ICON_PATHS.agricultural}</svg>`;
}

const PLACEHOLDER_PHOTO = "data:image/svg+xml;utf8," + encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='200' height='150'><rect width='200' height='150' fill='%23E7EFE9'/><text x='50%' y='50%' font-family='sans-serif' font-size='13' fill='%234A5A50' text-anchor='middle' dy='.3em'>No photo yet</text></svg>`);
