/* ==========================================================
   views-admin.js — broker dashboard
   ========================================================== */

let adminTab = 'pending';

function viewAdmin(){
  if(!state.adminUnlocked){
    return `
    <div class="wrap admin-gate">
      <h1>Broker Dashboard</h1>
      <p>This area is for the broker only — approve listings, review enquiries, and close deals.</p>
      <form onsubmit="unlockAdmin(event)">
        <input id="adminPass" type="password" autocomplete="current-password" placeholder="Enter access code" aria-label="Access code">
        <button type="submit" class="btn btn-primary btn-block">Enter dashboard</button>
      </form>
    </div>`;
  }

  const pending = state.listings.filter(l => l.status === 'pending');
  const approved = state.listings.filter(l => l.status === 'approved');
  const closed = state.listings.filter(l => l.status === 'closed');
  const totalCommission = closed.reduce((sum, l) => sum + (l.salePrice || l.price) * TOTAL_FEE_PCT, 0);

  return `
  <div class="wrap page-head">
    <h1>Broker Dashboard</h1>
    <p>Approve new listings, follow up on buyer enquiries, and record closed deals with commission calculated automatically.</p>
  </div>
  <div class="wrap page-body">
    <div class="stat-row">
      <div class="stat-box"><div class="num">${pending.length}</div><div class="lbl">Pending approval</div></div>
      <div class="stat-box"><div class="num">${approved.length}</div><div class="lbl">Live listings</div></div>
      <div class="stat-box"><div class="num">${state.inquiries.length}</div><div class="lbl">Buyer enquiries</div></div>
      <div class="stat-box"><div class="num">${fmtINR(totalCommission)}</div><div class="lbl">Commission earned</div></div>
    </div>
    <div class="admin-tabs" role="tablist">
      <button type="button" class="admin-tab ${adminTab === 'pending' ? 'active' : ''}" data-tab="pending">Pending (${pending.length})</button>
      <button type="button" class="admin-tab ${adminTab === 'listings' ? 'active' : ''}" data-tab="listings">All listings</button>
      <button type="button" class="admin-tab ${adminTab === 'inquiries' ? 'active' : ''}" data-tab="inquiries">Enquiries (${state.inquiries.length})</button>
      <button type="button" class="admin-tab ${adminTab === 'closed' ? 'active' : ''}" data-tab="closed">Closed deals</button>
      <button type="button" class="admin-tab ${adminTab === 'sellers' ? 'active' : ''}" data-tab="sellers">Sellers (${state.sellers.length})</button>
    </div>
    <div id="adminTabContent">${renderAdminTab()}</div>
  </div>`;
}

function renderAdminTab(){
  if(adminTab === 'pending') return renderPendingTab();
  if(adminTab === 'listings') return renderAllListingsTab();
  if(adminTab === 'inquiries') return renderInquiriesTab();
  if(adminTab === 'closed') return renderClosedTab();
  if(adminTab === 'sellers') return renderSellersTab();
  return '';
}

function renderSellersTab(){
  if(!state.sellers.length) return emptyState('No sellers registered yet', '');
  return `<div class="table-scroll"><table class="stack">
    <thead><tr><th>Name</th><th>Phone</th><th>ID type</th><th>ID number</th><th>Registered</th><th>Listings</th></tr></thead>
    <tbody>
    ${state.sellers.slice().reverse().map(s => {
      const count = state.listings.filter(l => l.sellerId === s.id).length;
      return `<tr>
        <td data-label="Name">${esc(s.name)}</td><td data-label="Phone">${esc(s.phone)}</td><td data-label="ID type">${esc(s.idType)}</td>
        <td data-label="ID number">${esc(s.idNumber)}</td><td data-label="Registered">${esc(s.dateRegistered)}</td><td data-label="Listings">${count}</td>
      </tr>`;
    }).join('')}
    </tbody></table></div>`;
}

function renderPendingTab(){
  const pending = state.listings.filter(l => l.status === 'pending');
  if(!pending.length) return emptyState('Nothing waiting', 'All submitted listings have been reviewed.');
  return pending.map(l => {
    const seller = state.sellers.find(s => s.id === l.sellerId);
    const photos = (l.photos && l.photos.length ? l.photos : [PLACEHOLDER_PHOTO]).map(p => `<img src="${esc(p)}" alt="">`).join('');
    return `
    <article class="pending-card">
      <div class="pending-top">
        <div>
          <h3>${esc(l.title)}</h3>
          <p class="meta">${esc(l.area)} · ${esc(l.district)} · ${esc(l.size)} ${esc(l.unit)} · ${fmtINR(l.price)}</p>
        </div>
        <div class="btn-row">
          <button type="button" class="btn btn-primary btn-sm" onclick="setListingStatus(${l.id},'approved')">Approve &amp; publish</button>
          <button type="button" class="btn btn-ghost btn-sm" onclick="setListingStatus(${l.id},'rejected')">Reject</button>
        </div>
      </div>
      <div class="pending-photos">${photos}</div>
      <div class="pending-seller">
        <strong>Seller on record for cross-check:</strong>
        ${seller ? `${esc(seller.name)} · ${esc(seller.phone)} · ${esc(seller.idType)}: ${esc(seller.idNumber)} · registered ${esc(seller.dateRegistered)}` : `${esc(l.sellerName)} · ${esc(l.sellerPhone)} (no registration record found — verify manually)`}
        <div class="collect">Collect ${fmtINR(VERIFICATION_FEE)} verification fee at the site visit for this listing.</div>
      </div>
    </article>`;
  }).join('');
}

function renderAllListingsTab(){
  return `<div class="table-scroll"><table class="stack">
    <thead><tr><th>Listing</th><th>District</th><th>Price</th><th>Status</th><th>Action</th></tr></thead>
    <tbody>
    ${state.listings.map(l => `
      <tr>
        <td data-label="Listing"><strong>${esc(l.title)}</strong></td>
        <td data-label="District">${esc(l.district)}</td>
        <td data-label="Price">${fmtINR(l.price)}</td>
        <td data-label="Status"><span class="status-pill status-${esc(l.status)}">${esc(l.status)}</span></td>
        <td data-label="Action"><div class="row-actions">
          <a href="#/listing/${l.id}" class="btn btn-ghost btn-sm">View</a>
          ${l.status === 'approved' ? `<button type="button" class="btn btn-primary btn-sm" onclick="openCloseDeal(${l.id})">Mark closed</button>` : ''}
        </div></td>
      </tr>
      ${l._showCloseForm ? closeDealFormHTML(l) : ''}`).join('')}
    </tbody></table></div>`;
}

function closeDealFormHTML(l){
  return `<tr class="close-row"><td colspan="5">
    <div class="close-deal-form">
      <div class="field"><label for="closePrice_${l.id}">Final sale price (₹)</label><input type="number" inputmode="numeric" id="closePrice_${l.id}" value="${l.price}"></div>
      <button type="button" class="btn btn-primary btn-sm" onclick="confirmCloseDeal(${l.id})">Confirm closed &amp; calculate fee</button>
      <button type="button" class="btn btn-ghost btn-sm" onclick="cancelCloseDeal(${l.id})">Cancel</button>
    </div>
  </td></tr>`;
}

function openCloseDeal(id){
  state.listings.forEach(l => l._showCloseForm = (l.id === id));
  refreshAdminTab();
}
function cancelCloseDeal(id){
  const l = state.listings.find(x => x.id === id);
  l._showCloseForm = false;
  refreshAdminTab();
}
async function confirmCloseDeal(id){
  const l = state.listings.find(x => x.id === id);
  const price = parseFloat(document.getElementById('closePrice_' + id).value) || l.price;
  l.status = 'closed';
  l.salePrice = price;
  l._showCloseForm = false;
  refreshAdmin();
  showToast(`Deal closed. Buyer fee ${fmtINR(price * BUYER_FEE_PCT)}, seller fee ${fmtINR(price * SELLER_FEE_PCT)}.`);
  await dbUpdateListing(id, {status:'closed', salePrice:price});
}

function renderInquiriesTab(){
  if(!state.inquiries.length) return emptyState('No enquiries yet', 'Buyer enquiries from listing pages will show up here.');
  return `<div class="table-scroll"><table class="stack">
    <thead><tr><th>Buyer</th><th>Phone</th><th>Listing</th><th>Message</th><th>Date</th></tr></thead>
    <tbody>
    ${state.inquiries.slice().reverse().map(i => {
      const listing = state.listings.find(l => l.id === i.listingId);
      return `<tr>
        <td data-label="Buyer">${esc(i.buyerName)}</td>
        <td data-label="Phone">${esc(i.buyerPhone)}</td>
        <td data-label="Listing">${listing ? `<a href="#/listing/${listing.id}" class="inline-link">${esc(listing.title)}</a>` : '—'}</td>
        <td data-label="Message">${i.message ? esc(i.message) : '—'}</td>
        <td data-label="Date">${esc(i.date)}</td>
      </tr>`;
    }).join('')}
    </tbody></table></div>`;
}

function renderClosedTab(){
  const closed = state.listings.filter(l => l.status === 'closed');
  if(!closed.length) return emptyState('No deals closed yet', 'Closed deals and their commission will be recorded here.');
  const totalBuyer = closed.reduce((s, l) => s + l.salePrice * BUYER_FEE_PCT, 0);
  const totalSeller = closed.reduce((s, l) => s + l.salePrice * SELLER_FEE_PCT, 0);
  return `
  <div class="table-scroll"><table class="stack">
    <thead><tr><th>Listing</th><th>Sale price</th><th>Buyer fee (${BUYER_FEE_PCT * 100}%)</th><th>Seller fee (${SELLER_FEE_PCT * 100}%)</th><th>Total commission</th></tr></thead>
    <tbody>
    ${closed.map(l => `
      <tr>
        <td data-label="Listing">${esc(l.title)}</td>
        <td data-label="Sale price">${fmtINR(l.salePrice)}</td>
        <td data-label="Buyer fee">${fmtINR(l.salePrice * BUYER_FEE_PCT)}</td>
        <td data-label="Seller fee">${fmtINR(l.salePrice * SELLER_FEE_PCT)}</td>
        <td data-label="Total"><strong>${fmtINR(l.salePrice * TOTAL_FEE_PCT)}</strong></td>
      </tr>`).join('')}
    </tbody></table></div>
  <div class="commission-summary">
    <div><span>Total commission across ${closed.length} closed deal${closed.length !== 1 ? 's' : ''}</span><strong>${fmtINR(totalBuyer + totalSeller)}</strong></div>
    <div><span>From buyers</span><strong>${fmtINR(totalBuyer)}</strong></div>
    <div><span>From sellers</span><strong>${fmtINR(totalSeller)}</strong></div>
  </div>`;
}

async function setListingStatus(id, status){
  const l = state.listings.find(x => x.id === id);
  l.status = status;
  refreshAdmin();
  showToast(status === 'approved' ? 'Listing approved and now live.' : 'Listing rejected.');
  await dbUpdateListing(id, {status});
}

function refreshAdminTab(){
  document.getElementById('adminTabContent').innerHTML = renderAdminTab();
}
function refreshAdmin(){
  document.getElementById('app').innerHTML = viewAdmin();
  attachAdminHandlers();
}

function unlockAdmin(e){
  if(e) e.preventDefault();
  const val = document.getElementById('adminPass').value;
  if(val === ADMIN_CODE){
    state.adminUnlocked = true;
    refreshAdmin();
  } else {
    showToast('Incorrect access code.', true);
  }
}

function attachAdminHandlers(){
  document.querySelectorAll('.admin-tab').forEach(tab => {
    tab.addEventListener('click', () => { adminTab = tab.dataset.tab; refreshAdmin(); });
  });
}
