/* ==========================================================
   views-public.js — home, browse, listing detail, sell, how it works
   ========================================================== */

let pendingFilter = null;
let pendingPhotos = [];
let pendingPhotoFiles = [];

/* ---------- shared pieces ---------- */
function cardMedia(l){
  if(l.photos && l.photos.length){
    return `<img src="${esc(l.photos[0])}" alt="${esc(l.title)}" loading="lazy">`;
  }
  const info = typeInfo(l.type);
  return `<div class="media-ph" style="--ph-bg:${info.bg};--ph-fg:${info.fg}">${iconSVG(l.type)}</div>`;
}

function listingCardHTML(l){
  const info = typeInfo(l.type);
  const perUnit = l.size > 0 ? `${fmtINR(l.price / l.size)} per ${esc(l.unit)}` : '';
  return `
  <a href="#/listing/${l.id}" class="card">
    <div class="card-media">${cardMedia(l)}</div>
    <div class="card-body">
      <span class="tag ${info.tagClass}">${info.label}</span>
      <h3 class="card-title">${esc(l.title)}</h3>
      <p class="card-loc">${esc(l.area)}, ${esc(l.district)}</p>
      <div class="card-foot">
        <div>
          <div class="price">${fmtINR(l.price)}</div>
          <div class="price-sub">${perUnit}</div>
        </div>
        <div class="card-size">${esc(l.size)} ${esc(l.unit)}</div>
      </div>
    </div>
  </a>`;
}

function emptyState(title, text){
  return `<div class="empty-state"><strong>${title}</strong><span>${text}</span></div>`;
}

/* ---------- HOME ---------- */
function viewHome(){
  const approved = state.listings.filter(l => l.status === 'approved').slice(0, 4);
  return `
  <section class="hero">
    <div class="wrap hero-grid">
      <div class="hero-copy">
        <h1>${t('heroTitle')}</h1>
        <p class="lede">${t('heroLede')}</p>
        <div class="hero-actions">
          <a href="#/browse" class="btn btn-light">${t('browseBtn')}</a>
          <a href="#/sell" class="btn btn-outline-light">${t('listBtn')}</a>
        </div>
      </div>
      <form class="search-card" onsubmit="quickSearch(event)">
        <h2>${t('findLand')}</h2>
        <div class="field">
          <label for="quickDistrict">District</label>
          <select id="quickDistrict">
            <option value="">All districts</option>
            ${DISTRICTS.map(d => `<option value="${d}">${d}</option>`).join('')}
          </select>
        </div>
        <div class="field">
          <label for="quickType">Land type</label>
          <select id="quickType">
            <option value="">Any type</option>
            ${LAND_TYPES.map(lt => `<option value="${lt.id}">${lt.label}</option>`).join('')}
          </select>
        </div>
        <button type="submit" class="btn btn-primary btn-block">${t('searchBtn')}</button>
      </form>
    </div>
  </section>

  <section class="block wrap">
    <div class="block-head">
      <h2>${t('recentApproved')}</h2>
      <a href="#/browse" class="text-link">${t('seeAll')}</a>
    </div>
    <div class="cards">
      ${approved.length ? approved.map(listingCardHTML).join('') : emptyState('No approved listings yet', 'Check back soon, or list your own land.')}
    </div>
  </section>

  <section class="block block-tint">
    <div class="wrap">
      <div class="block-head"><h2>${t('howClosesTitle')}</h2></div>
      <ol class="steps">
        <li><span class="step-n">1</span><h3>${t('step1t')}</h3><p>${t('step1d')}</p></li>
        <li><span class="step-n">2</span><h3>${t('step2t')}</h3><p>${t('step2d')}</p></li>
        <li><span class="step-n">3</span><h3>${t('step3t')}</h3><p>${t('step3d')}</p></li>
      </ol>
    </div>
  </section>

  <section class="cta-band">
    <div class="wrap cta-inner">
      <div>
        <h2>${t('ctaTitle')}</h2>
        <p>${t('ctaBody')}</p>
      </div>
      <div class="cta-actions">
        <a href="#/sell" class="btn btn-light">${t('listYourLand')}</a>
        <a href="#/how-it-works" class="btn btn-outline-light">${t('fullDetails')}</a>
      </div>
    </div>
  </section>`;
}

function quickSearch(e){
  if(e) e.preventDefault();
  pendingFilter = {
    district: document.getElementById('quickDistrict').value,
    type: document.getElementById('quickType').value
  };
  location.hash = '#/browse';
}

/* ---------- BROWSE ---------- */
function viewBrowse(){
  return `
  <div class="wrap page-head">
    <h1>Browse Land</h1>
    <p>All listings below have been reviewed and approved. Contact details are shared through the broker once you send an enquiry.</p>
  </div>
  <div class="wrap page-body">
    <div class="filter-bar">
      <select id="filterDistrict" aria-label="District"><option value="">All districts</option>${DISTRICTS.map(d => `<option value="${d}">${d}</option>`).join('')}</select>
      <select id="filterType" aria-label="Land type"><option value="">Any type</option>${LAND_TYPES.map(x => `<option value="${x.id}">${x.label}</option>`).join('')}</select>
      <select id="filterPrice" aria-label="Price">
        <option value="">Any price</option>
        <option value="1000000">Under ₹10L</option>
        <option value="5000000">Under ₹50L</option>
        <option value="20000000">Under ₹2Cr</option>
      </select>
      <button type="button" class="btn btn-ghost btn-sm" onclick="clearFilters()">Clear</button>
    </div>
    <div class="results-count" id="resultsCount"></div>
    <div class="cards" id="listingResults"></div>
  </div>`;
}

function attachBrowseHandlers(){
  ['filterDistrict','filterType','filterPrice'].forEach(id => {
    document.getElementById(id).addEventListener('change', applyFilters);
  });
  if(pendingFilter){
    if(pendingFilter.district) document.getElementById('filterDistrict').value = pendingFilter.district;
    if(pendingFilter.type) document.getElementById('filterType').value = pendingFilter.type;
    pendingFilter = null;
  }
  applyFilters();
}

function applyFilters(){
  const d = document.getElementById('filterDistrict').value;
  const ty = document.getElementById('filterType').value;
  const p = document.getElementById('filterPrice').value;
  let results = state.listings.filter(l => l.status === 'approved');
  if(d) results = results.filter(l => l.district === d);
  if(ty) results = results.filter(l => l.type === ty);
  if(p) results = results.filter(l => l.price <= parseInt(p));
  document.getElementById('resultsCount').textContent = `${results.length} listing${results.length !== 1 ? 's' : ''} found`;
  document.getElementById('listingResults').innerHTML = results.length
    ? results.map(listingCardHTML).join('')
    : emptyState('No land matches these filters', 'Try widening your search, or check back later as new listings are approved.');
}

function clearFilters(){
  ['filterDistrict','filterType','filterPrice'].forEach(id => document.getElementById(id).value = '');
  applyFilters();
}

/* ---------- LISTING DETAIL ---------- */
function viewListingDetail(id){
  const l = state.listings.find(x => x.id === id);
  if(!l) return `<div class="wrap page-head"><h1>Listing not found</h1><p><a href="#/browse" class="btn btn-ghost">Back to Browse</a></p></div>`;
  const info = typeInfo(l.type);
  const buyerFee = l.price * BUYER_FEE_PCT;
  const sellerFee = l.price * SELLER_FEE_PCT;
  const hasPhotos = l.photos && l.photos.length;
  const waMsg = `Hi, I'm interested in "${l.title}" (${l.area}, ${l.district}) listed for ${fmtINR(l.price)} on Bhumi Sathi. Please share more details.`;
  return `
  <div class="wrap page-body detail-wrap">
    <a href="#/browse" class="back-link">← Back to listings</a>
    <div class="detail-grid">
      <div class="detail-main">
        <div class="detail-hero" id="detailHero">
          ${hasPhotos ? `<img id="detailHeroImg" src="${esc(l.photos[0])}" alt="${esc(l.title)}">` : `<div class="media-ph" style="--ph-bg:${info.bg};--ph-fg:${info.fg}">${iconSVG(l.type)}</div>`}
        </div>
        ${hasPhotos && l.photos.length > 1 ? `<div class="thumbs">${l.photos.map((p, i) => `<button type="button" class="thumb" onclick="swapDetailPhoto('${esc(p)}')" aria-label="Photo ${i + 1}"><img src="${esc(p)}" alt=""></button>`).join('')}</div>` : ''}
        <span class="tag ${info.tagClass}">${info.label}</span>
        <h1 class="detail-title">${esc(l.title)}</h1>
        <p class="detail-loc">${esc(l.area)}, ${esc(l.district)}</p>
        <dl class="spec-grid">
          <div><dt>Plot size</dt><dd>${esc(l.size)} ${esc(l.unit)}</dd></div>
          <div><dt>Asking price</dt><dd>${fmtINR(l.price)}</dd></div>
          <div><dt>District</dt><dd>${esc(l.district)}</dd></div>
          <div><dt>Listed on</dt><dd>${esc(l.date)}</dd></div>
        </dl>
        <div class="desc-block"><h2>About this land</h2><p>${esc(l.desc)}</p></div>
      </div>
      <aside class="contact-card">
        <div class="price">${fmtINR(l.price)}</div>
        <div class="price-sub">${esc(l.size)} ${esc(l.unit)} · ${info.label}</div>
        <div id="enquiryFormHolder">
          <a href="${waLink(waMsg)}" target="_blank" rel="noopener" class="btn btn-wa btn-block">Chat on WhatsApp about this land</a>
          <div class="or-line"><span>or send your details</span></div>
          <div class="form-row"><label for="buyerName">Your name</label><input id="buyerName" autocomplete="name" placeholder="e.g. Rina Devi"></div>
          <div class="form-row"><label for="buyerPhone">Phone number</label><input id="buyerPhone" type="tel" inputmode="tel" autocomplete="tel" placeholder="e.g. 98xxxxxxxx"></div>
          <div class="form-row"><label for="buyerMsg">Message (optional)</label><textarea id="buyerMsg" placeholder="Any questions about the land, or a good time to call"></textarea></div>
          <button type="button" class="btn btn-primary btn-block" onclick="submitInquiry(${l.id})">Contact broker about this land</button>
        </div>
        <p class="fee-note">If this deal closes, the broker charges ${BUYER_FEE_PCT * 100}% of the sale price to the buyer (${fmtINR(buyerFee)} at asking price) and ${SELLER_FEE_PCT * 100}% to the seller (${fmtINR(sellerFee)}).</p>
      </aside>
    </div>
  </div>`;
}

function swapDetailPhoto(src){
  const img = document.getElementById('detailHeroImg');
  if(img) img.src = src;
}

async function submitInquiry(listingId){
  const name = document.getElementById('buyerName').value.trim();
  const phone = document.getElementById('buyerPhone').value.trim();
  const msg = document.getElementById('buyerMsg').value.trim();
  if(!name || !phone){ showToast('Please add your name and phone number.'); return; }
  let inquiry = {
    id: state.nextInquiryId++, listingId, buyerName:name, buyerPhone:phone, message:msg,
    date: new Date().toISOString().slice(0, 10)
  };
  inquiry = await dbInsertInquiry(inquiry);
  state.inquiries.push(inquiry);
  document.getElementById('enquiryFormHolder').innerHTML = `
    <div class="note note-ok"><strong>Sent.</strong> The broker has your details and will reach out about this land shortly.</div>`;
  showToast('Enquiry sent to the broker.');
}

/* ---------- SELL ---------- */
function viewSell(){
  if(!state.currentSeller){
    return `
    <div class="wrap page-head">
      <h1>Register as a Seller</h1>
      <p>Before you can list land, we need your details on file. This is what lets the broker cross-check who you are against the land documents before anything goes live — it also means buyers can trust that every seller on the site is a real, verified person.</p>
    </div>
    <div class="wrap page-body">
      <div class="note note-ok">Registration takes a minute. Your ID details are only used by the broker for verification — they are never shown publicly on your listing.</div>
      <div class="form-shell">
        <div class="two-col">
          <div class="form-row"><label for="rName">Full name</label><input id="rName" autocomplete="name" placeholder="e.g. Bipul Saikia"></div>
          <div class="form-row"><label for="rPhone">Phone number</label><input id="rPhone" type="tel" inputmode="tel" autocomplete="tel" placeholder="e.g. 98xxxxxxxx"></div>
        </div>
        <div class="two-col">
          <div class="form-row"><label for="rIdType">ID type</label><select id="rIdType">${ID_TYPES.map(x => `<option>${x}</option>`).join('')}</select></div>
          <div class="form-row"><label for="rIdNumber">ID number</label><input id="rIdNumber" placeholder="As printed on the ID"></div>
        </div>
        <div class="form-row"><label for="rEmail">Email (optional)</label><input id="rEmail" type="email" autocomplete="email" placeholder="you@example.com"></div>
        <button type="button" class="btn btn-primary btn-wide" onclick="registerSeller()">Register &amp; continue to list land</button>
      </div>
    </div>`;
  }

  const seller = state.currentSeller;
  pendingPhotos = [];
  pendingPhotoFiles = [];
  return `
  <div class="wrap page-head">
    <h1>List Your Land</h1>
    <p>Fill in your land details and upload real photos of the plot. Every submission is reviewed by the broker — including a match against your registered ID — before it appears publicly.</p>
  </div>
  <div class="wrap page-body">
    <div class="note note-ok">Registered as <strong>${esc(seller.name)}</strong> (${esc(seller.idType)}, verification pending admin cross-check). Not you? <a href="#" onclick="switchSeller();return false;" class="inline-link">Register a different seller</a></div>
    <div class="note note-warn">A one-time, non-refundable verification fee of <strong>${fmtINR(VERIFICATION_FEE)}</strong> applies when you submit a listing — this covers the broker's site visit and document check, whether or not the land eventually sells. It is separate from the closing commission (charged only if a deal goes through: ${BUYER_FEE_PCT * 100}% from the buyer, ${SELLER_FEE_PCT * 100}% from the seller).</div>
    <div class="form-shell" id="sellFormShell">
      <div class="form-row"><label for="sTitle">Listing title</label><input id="sTitle" placeholder="e.g. Roadside Plot near Six Mile"></div>
      <div class="two-col">
        <div class="form-row"><label for="sDistrict">District</label>
          <select id="sDistrict"><option value="">Select district</option>${DISTRICTS.map(d => `<option>${d}</option>`).join('')}</select>
        </div>
        <div class="form-row"><label for="sArea">Area / locality</label><input id="sArea" placeholder="e.g. Near Kolong River"></div>
      </div>
      <div class="two-col">
        <div class="form-row"><label for="sType">Land type</label>
          <select id="sType">${LAND_TYPES.map(x => `<option value="${x.id}">${x.label}</option>`).join('')}</select>
        </div>
        <div class="form-row"><label for="sPrice">Asking price (₹)</label><input id="sPrice" type="number" inputmode="numeric" placeholder="e.g. 1800000"></div>
      </div>
      <div class="two-col">
        <div class="form-row"><label for="sSize">Plot size</label><input id="sSize" type="number" inputmode="decimal" step="0.1" placeholder="e.g. 3"></div>
        <div class="form-row"><label for="sUnit">Unit</label>
          <select id="sUnit">${UNITS.map(u => `<option>${u}</option>`).join('')}</select>
        </div>
      </div>
      <div class="form-row"><label for="sDesc">Description</label><textarea id="sDesc" placeholder="Road access, water source, nearby landmarks, ownership documents available, etc."></textarea></div>
      <div class="form-row">
        <label for="sPhotos">Land photos</label>
        <input type="file" id="sPhotos" accept="image/*" multiple onchange="handlePhotoSelect(event)">
        <div class="hint">Upload real photos taken on-site — this is what the broker checks against before approving.</div>
        <div id="photoPreview" class="photo-preview"></div>
      </div>
      <div class="check-row">
        <input type="checkbox" id="sFeeAgree">
        <label for="sFeeAgree">I understand a ${fmtINR(VERIFICATION_FEE)} verification fee applies to this submission, and I agree to pay it so the broker can visit and verify my land.</label>
      </div>
      <button type="button" class="btn btn-primary btn-wide" onclick="submitListing()">Submit for approval</button>
    </div>
  </div>`;
}

async function registerSeller(){
  const name = document.getElementById('rName').value.trim();
  const phone = document.getElementById('rPhone').value.trim();
  const idType = document.getElementById('rIdType').value;
  const idNumber = document.getElementById('rIdNumber').value.trim();
  const email = document.getElementById('rEmail').value.trim();
  if(!name || !phone || !idNumber){ showToast('Please fill in name, phone and ID number.'); return; }
  let seller = {id: state.nextSellerId++, name, phone, idType, idNumber, email, dateRegistered: new Date().toISOString().slice(0, 10)};
  seller = await dbInsertSeller(seller);
  state.sellers.push(seller);
  state.currentSeller = seller;
  document.getElementById('app').innerHTML = viewSell();
  window.scrollTo(0, 0);
  showToast('Registered. Now add your land details.');
}

function switchSeller(){
  state.currentSeller = null;
  document.getElementById('app').innerHTML = viewSell();
}

function handlePhotoSelect(event){
  Array.from(event.target.files || []).forEach(file => {
    pendingPhotoFiles.push(file);
    const reader = new FileReader();
    reader.onload = e => { pendingPhotos.push(e.target.result); renderPhotoPreview(); };
    reader.readAsDataURL(file);
  });
}

function renderPhotoPreview(){
  const holder = document.getElementById('photoPreview');
  if(!holder) return;
  holder.innerHTML = pendingPhotos.map((src, i) =>
    `<div class="pv"><img src="${src}" alt="Selected photo ${i + 1}"><button type="button" onclick="removePendingPhoto(${i})" aria-label="Remove photo ${i + 1}">×</button></div>`
  ).join('');
}

function removePendingPhoto(i){
  pendingPhotos.splice(i, 1);
  pendingPhotoFiles.splice(i, 1);
  renderPhotoPreview();
}

async function submitListing(){
  const seller = state.currentSeller;
  const title = document.getElementById('sTitle').value.trim();
  const district = document.getElementById('sDistrict').value;
  const area = document.getElementById('sArea').value.trim();
  const type = document.getElementById('sType').value;
  const price = parseFloat(document.getElementById('sPrice').value);
  const size = parseFloat(document.getElementById('sSize').value);
  const unit = document.getElementById('sUnit').value;
  const desc = document.getElementById('sDesc').value.trim();

  if(!title || !district || !area || !price || !size){ showToast('Please fill in all required fields.'); return; }
  if(pendingPhotos.length === 0){ showToast('Please upload at least one photo of the land before submitting.'); return; }
  if(!document.getElementById('sFeeAgree').checked){ showToast(`Please confirm you agree to the ${fmtINR(VERIFICATION_FEE)} verification fee before submitting.`); return; }

  showToast('Submitting…');
  const photos = USE_SUPABASE ? await dbUploadPhotos(pendingPhotoFiles) : pendingPhotos.slice();
  let newListing = {
    id: state.nextListingId++, title, district, area, type, size, unit, price, desc,
    sellerId: seller.id, sellerName: seller.name, sellerPhone: seller.phone,
    status: 'pending', date: new Date().toISOString().slice(0, 10), photos
  };
  newListing = await dbInsertListing(newListing);
  state.listings.unshift(newListing);
  pendingPhotos = [];
  pendingPhotoFiles = [];
  const waMsg = `Hi, I just submitted my land "${title}" (${area}, ${district}) on Bhumi Sathi for approval. My name is ${seller.name}.`;
  document.getElementById('sellFormShell').innerHTML = `
    <div class="success-box">
      <h2>Submitted for review</h2>
      <p>Thanks, ${esc(seller.name.split(' ')[0])}. “${esc(title)}” has been sent to the broker for approval, along with your registered ID for cross-check. The broker will contact you to collect the ${fmtINR(VERIFICATION_FEE)} verification fee and arrange a site visit — approved listings usually go up within a day after that.</p>
      <div class="btn-row">
        <a href="${waLink(waMsg)}" target="_blank" rel="noopener" class="btn btn-wa btn-sm">Confirm on WhatsApp</a>
        <a href="#/browse" class="btn btn-ghost btn-sm">Browse other land</a>
      </div>
    </div>`;
  showToast('Listing submitted for approval.');
}

/* ---------- HOW IT WORKS ---------- */
function viewHowItWorks(){
  return `
  <div class="wrap page-head">
    <h1>${t('hiwTitle')}</h1>
    <p>${t('hiwSub')}</p>
  </div>
  <div class="wrap page-body">
    <div class="audience">
      <div><h3>${t('forSellersT')}</h3><span class="aud-label">${t('forSellers')}</span><p>${t('forSellersD')}</p></div>
      <div><h3>${t('forBuyersT')}</h3><span class="aud-label">${t('forBuyers')}</span><p>${t('forBuyersD')}</p></div>
      <div><h3>${t('forEveryoneT')}</h3><span class="aud-label">${t('forEveryone')}</span><p>${t('forEveryoneD')}</p></div>
    </div>
    <div class="prose">
      <h2>${t('whyFeeTitle')}</h2>
      <p>${t('whyFeeBody')}</p>
      <h2>${t('regTitle')}</h2>
      <p>${t('regBody')}</p>
    </div>
    <div class="btn-row">
      <a href="#/sell" class="btn btn-primary">List land</a>
      <a href="#/browse" class="btn btn-ghost">Browse land</a>
    </div>
  </div>`;
}
