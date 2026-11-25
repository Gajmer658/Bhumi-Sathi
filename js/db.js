/* ==========================================================
   db.js — Supabase read/write. Falls back to in-memory demo
   data when Supabase is not configured.
   ========================================================== */

async function dbLoadAll(){
  if(!USE_SUPABASE || !sb) return;
  const [{data: sellers}, {data: listings}, {data: inquiries}] = await Promise.all([
    sb.from('sellers').select('*').order('id', {ascending:false}),
    sb.from('listings').select('*').order('id', {ascending:false}),
    sb.from('inquiries').select('*').order('id', {ascending:false})
  ]);
  state.sellers = (sellers||[]).map(s => ({id:s.id, name:s.name, phone:s.phone, idType:s.id_type, idNumber:s.id_number, email:s.email, dateRegistered:s.date_registered}));
  state.listings = (listings||[]).map(l => ({id:l.id, title:l.title, district:l.district, area:l.area, type:l.type, size:l.size, unit:l.unit, price:l.price, desc:l.description, sellerId:l.seller_id, sellerName:l.seller_name, sellerPhone:l.seller_phone, status:l.status, date:l.date, photos:l.photos||[], salePrice:l.sale_price}));
  state.inquiries = (inquiries||[]).map(i => ({id:i.id, listingId:i.listing_id, buyerName:i.buyer_name, buyerPhone:i.buyer_phone, message:i.message, date:i.date}));
}

async function dbInsertSeller(seller){
  if(!USE_SUPABASE || !sb) return seller;
  const {data, error} = await sb.from('sellers').insert({
    name:seller.name, phone:seller.phone, id_type:seller.idType, id_number:seller.idNumber, email:seller.email
  }).select().single();
  if(error){ showToast('Seller not saved to server: ' + error.message, true); return seller; }
  return {...seller, id:data.id, dateRegistered:data.date_registered};
}

async function dbUploadPhotos(files){
  if(!USE_SUPABASE || !sb) return [];
  const urls = [];
  for(const file of files){
    const path = `${Date.now()}_${Math.random().toString(36).slice(2)}_${file.name}`;
    const {error} = await sb.storage.from(PHOTO_BUCKET).upload(path, file);
    if(error){ showToast('Photo upload failed: ' + error.message, true); continue; }
    const {data} = sb.storage.from(PHOTO_BUCKET).getPublicUrl(path);
    urls.push(data.publicUrl);
  }
  return urls;
}

async function dbInsertListing(listing){
  if(!USE_SUPABASE || !sb) return listing;
  const {data, error} = await sb.from('listings').insert({
    title:listing.title, district:listing.district, area:listing.area, type:listing.type,
    size:listing.size, unit:listing.unit, price:listing.price, description:listing.desc,
    seller_id:listing.sellerId, seller_name:listing.sellerName, seller_phone:listing.sellerPhone,
    status:'pending', photos:listing.photos
  }).select().single();
  if(error){ showToast('Listing not saved to server: ' + error.message, true); return listing; }
  return {...listing, id:data.id, date:data.date};
}

async function dbInsertInquiry(inquiry){
  if(!USE_SUPABASE || !sb) return inquiry;
  const {data, error} = await sb.from('inquiries').insert({
    listing_id:inquiry.listingId, buyer_name:inquiry.buyerName, buyer_phone:inquiry.buyerPhone, message:inquiry.message
  }).select().single();
  if(error){ showToast('Enquiry not saved to server: ' + error.message, true); return inquiry; }
  return {...inquiry, id:data.id, date:data.date};
}

async function dbUpdateListing(id, fields){
  if(!USE_SUPABASE || !sb) return;
  const dbFields = {};
  if('status' in fields) dbFields.status = fields.status;
  if('salePrice' in fields) dbFields.sale_price = fields.salePrice;
  const {error} = await sb.from('listings').update(dbFields).eq('id', id);
  if(error) showToast('Update not saved to server: ' + error.message, true);
}
