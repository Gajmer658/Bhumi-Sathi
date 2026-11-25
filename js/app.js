/* ==========================================================
   app.js — router, mobile menu and start-up
   ========================================================== */

function currentRoute(){
  const hash = location.hash.replace('#/', '') || 'home';
  const parts = hash.split('/');
  return {name: parts[0], param: parts[1]};
}

function setMenu(open){
  const links = document.getElementById('navLinks');
  const btn = document.getElementById('navToggle');
  links.classList.toggle('open', open);
  btn.classList.toggle('open', open);
  btn.setAttribute('aria-expanded', String(open));
  btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
}

function navigate(){
  const r = currentRoute();
  document.querySelectorAll('.nav-link').forEach(l => l.classList.toggle('active', l.dataset.route === r.name));
  setMenu(false);
  const app = document.getElementById('app');
  window.scrollTo(0, 0);
  document.getElementById('waFloat').href = waLink("Hi, I'm interested in land on Bhumi Sathi. Can you help me?");
  switch(r.name){
    case 'home':         app.innerHTML = viewHome(); break;
    case 'browse':       app.innerHTML = viewBrowse(); attachBrowseHandlers(); break;
    case 'listing':      app.innerHTML = viewListingDetail(parseInt(r.param)); break;
    case 'sell':         app.innerHTML = viewSell(); break;
    case 'how-it-works': app.innerHTML = viewHowItWorks(); break;
    case 'admin':        app.innerHTML = viewAdmin(); attachAdminHandlers(); break;
    default:             app.innerHTML = viewHome();
  }
  document.body.dataset.route = r.name;
}

window.addEventListener('hashchange', navigate);

document.getElementById('navToggle').addEventListener('click', () => {
  setMenu(!document.getElementById('navLinks').classList.contains('open'));
});
document.addEventListener('keydown', e => { if(e.key === 'Escape') setMenu(false); });
document.addEventListener('click', e => {
  const nav = document.getElementById('nav');
  if(!nav.contains(e.target)) setMenu(false);
});

async function boot(){
  document.getElementById('udyamBadgeFooter').textContent = UDYAM_NUMBER;
  applyStaticTranslations();
  if(USE_SUPABASE && sb){
    document.getElementById('app').innerHTML = `<div class="wrap loading">Loading listings…</div>`;
    try { await dbLoadAll(); } catch(err){ console.error(err); showToast('Could not reach the server — showing demo data.', true); }
  }
  navigate();
}
boot();
