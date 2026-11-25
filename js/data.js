/* ==========================================================
   data.js — app state and demo data (used until Supabase has rows)
   ========================================================== */

const state = {
  sellers: [
    {id:1, name:"Bipul Saikia", phone:"98640XXXXX", idType:"Aadhaar Card", idNumber:"XXXX-XXXX-4521", dateRegistered:"2026-08-09"},
    {id:2, name:"Nayanmoni Bora", phone:"94350XXXXX", idType:"Voter ID", idNumber:"ASS0XXXXXXX", dateRegistered:"2026-08-17"},
    {id:3, name:"Ranjit Gogoi", phone:"90850XXXXX", idType:"Aadhaar Card", idNumber:"XXXX-XXXX-7710", dateRegistered:"2026-08-01"},
    {id:4, name:"Probin Hazarika", phone:"87650XXXXX", idType:"Voter ID", idNumber:"ASS1XXXXXXX", dateRegistered:"2026-08-30"},
    {id:5, name:"Dilip Das", phone:"96130XXXXX", idType:"PAN Card", idNumber:"XXXXX9821X", dateRegistered:"2026-09-02"}
  ],
  nextSellerId: 6,
  currentSeller: null,
  listings: [
    {id:1, title:"Riverside Paddy Land near Kolong", district:"Nagaon", area:"Near Kolong River, Kolong Chapori", type:"agricultural", size:3, unit:"Bigha", price:1800000, desc:"Fertile paddy land close to the Kolong river, currently under cultivation. Road access on one side, tube well available. Clear ownership papers, ready for registration.", sellerId:1, sellerName:"Bipul Saikia", sellerPhone:"98640XXXXX", status:"approved", date:"2026-08-10", photos:[]},
    {id:2, title:"Corner Residential Plot, Six Mile", district:"Kamrup Metropolitan", area:"Six Mile, near GS Road", type:"residential", size:3.5, unit:"Katha", price:6200000, desc:"Corner plot on a 20ft approach road, walking distance to GS Road. Ideal for a house or small apartment. Boundary walled on two sides.", sellerId:2, sellerName:"Nayanmoni Bora", sellerPhone:"94350XXXXX", status:"approved", date:"2026-08-18", photos:[]},
    {id:3, title:"Roadside Commercial Land, AT Road", district:"Jorhat", area:"AT Road, near Cinnamora", type:"commercial", size:8, unit:"Katha", price:14500000, desc:"Flat commercial plot right on AT Road with high visibility, suitable for showroom, godown or fuel outlet. All-weather road frontage.", sellerId:3, sellerName:"Ranjit Gogoi", sellerPhone:"90850XXXXX", status:"approved", date:"2026-08-02", photos:[]},
    {id:4, title:"Tea Garden Adjacent Plot", district:"Dibrugarh", area:"Near Chabua", type:"agricultural", size:2, unit:"Bigha", price:900000, desc:"Quiet plot bordering a tea estate, good soil, seasonal stream nearby. Suitable for horticulture or a farmhouse.", sellerId:4, sellerName:"Probin Hazarika", sellerPhone:"87650XXXXX", status:"pending", date:"2026-09-01", photos:[]},
    {id:5, title:"Small Industrial Plot, Bamunimaidan", district:"Kamrup Metropolitan", area:"Bamunimaidan Industrial Estate", type:"industrial", size:1.2, unit:"Acre", price:22000000, desc:"Fenced industrial plot with existing shed structure, three-phase power connection available on the boundary.", sellerId:5, sellerName:"Dilip Das", sellerPhone:"96130XXXXX", status:"pending", date:"2026-09-03", photos:[]}
  ],
  inquiries: [],
  nextListingId: 6,
  nextInquiryId: 1,
  adminUnlocked: false
};
