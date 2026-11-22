/* ------------------------------------------------------------------
   à la PAGE — store config and product catalogue
   Edit this file to change prices, names, photos and contact details.
   Drop new photos into /images and list them in a product's `images`.
   A product with an empty `images` list shows a branded placeholder.
------------------------------------------------------------------- */
window.ALA = {
  STORE: {
    name: "à la PAGE",
    currency: "$",
    whatsapp: "9613144466", // country code + number, digits only (wa.me format)
    phoneDisplay: "+961 3 144 466",
    address: "El Shir, Jounieh, Lebanon",
    lat: 33.9823475,
    lng: 35.6266385,
    hours: [
      ["Monday to Saturday", "10:00 am to 8:00 pm"],
      ["Sunday", "Closed"]
    ],
    instagram: "" // e.g. "https://instagram.com/yourhandle"
  },

  CATEGORIES: [
    "Knitwear",
    "Jackets & coats",
    "Tops",
    "Trousers & jeans",
    "Skirts",
    "Shoes",
    "Accessories"
  ],

  PRODUCTS: [
    {
      id: "leopard-collar-cardigan",
      name: "Leopard Collar Cardigan",
      category: "Knitwear",
      price: 59,
      badge: "New",
      color: "Mocha",
      sizes: ["XS", "S", "M", "L"],
      images: [
        "images/cardigan-catalog.jpg",
        "images/cardigan-sunbeam.jpg",
        "images/cardigan-flatlay.jpg"
      ],
      tone: "#7a5c4b",
      desc: "A soft knit cardigan with a row of fabric-covered buttons and a leopard-print faux fur collar. Relaxed through the body, with ribbed cuffs and hem.",
      details: ["Faux fur leopard-print collar", "Fabric-covered buttons", "Ribbed cuffs and hem", "Relaxed fit, hip length"]
    },
    {
      id: "gold-button-bell-sleeve-cardigan",
      name: "Gold Button Bell-Sleeve Cardigan",
      category: "Knitwear",
      price: 52,
      badge: "New",
      color: "Oatmeal",
      sizes: ["S", "M", "L"],
      images: [
        "images/look-crosswalk-front.jpg",
        "images/look-crosswalk-side.jpg"
      ],
      tone: "#d8cdbf",
      desc: "A soft oatmeal cardigan with a round neckline and three crinkled gold buttons. The bell sleeves finish with a small bow and a gold button at each cuff.",
      details: ["Round neckline", "Three gold metal buttons", "Bell sleeves with bow detail", "Boxy, hip length"]
    },
    {
      id: "gold-button-funnel-neck-top",
      name: "Gold Button Funnel-Neck Top",
      category: "Knitwear",
      price: 39,
      badge: "New",
      color: "Cream",
      sizes: ["XS", "S", "M", "L"],
      images: ["images/look-bus-cream-burgundy.jpg"],
      tone: "#e8dfc9",
      desc: "A fitted fine-rib knit with a fold-over funnel neck and a half-placket of flat gold disc buttons. Raglan sleeves and a waist-length hem.",
      details: ["Fold-over funnel neck", "Flat gold disc buttons", "Raglan sleeves", "Fitted, waist length"]
    },
    {
      id: "black-faux-leather-wide-leg-trousers",
      name: "Black Faux-Leather Wide-Leg Trousers",
      category: "Trousers & jeans",
      price: 59,
      badge: "New",
      color: "Black",
      sizes: ["34", "36", "38", "40", "42"],
      images: [
        "images/look-crosswalk-side.jpg",
        "images/look-crosswalk-front.jpg"
      ],
      tone: "#1a1a1c",
      desc: "High-waisted trousers in a soft-sheen faux leather, with a wide waistband, belt loops, pressed front pleats and a small metal charm at the waist. A long, straight, wide leg.",
      details: ["Faux leather, soft sheen", "High waist with belt loops", "Front pleats", "Side zip", "Wide straight leg"]
    },
    {
      id: "burgundy-ribbed-wide-leg-trousers",
      name: "Burgundy Ribbed Wide-Leg Trousers",
      category: "Trousers & jeans",
      price: 49,
      badge: "New",
      color: "Burgundy",
      sizes: ["34", "36", "38", "40", "42"],
      images: ["images/look-bus-cream-burgundy.jpg"],
      tone: "#5a1f2b",
      desc: "Very wide-leg trousers in a soft ribbed knit with subtle tonal ribbing, a flat elastic waistband and turned-up cuffs.",
      details: ["Tonal vertical ribbing", "High waist, flat elastic waistband", "Turn-up cuffs", "Very wide leg"]
    },
    {
      id: "oversized-crew-sweater",
      name: "Oversized Crew Sweater",
      category: "Knitwear",
      price: 42,
      color: "Charcoal",
      sizes: ["S", "M", "L"],
      images: [],
      tone: "#4b4b50",
      desc: "A roomy crew-neck sweater with dropped shoulders. Wear it with jeans or over a skirt.",
      details: ["Crew neck", "Dropped shoulders", "Oversized fit"]
    },
    {
      id: "burgundy-leather-look-jacket",
      name: "Burgundy Leather-Look Jacket",
      category: "Jackets & coats",
      price: 79,
      badge: "New",
      color: "Burgundy",
      sizes: ["S", "M", "L"],
      images: [],
      tone: "#6d2230",
      desc: "A boxy blazer-cut jacket in a deep burgundy leather-look finish.",
      details: ["Blazer cut", "Two front pockets", "Boxy fit"]
    },
    {
      id: "long-tailored-coat",
      name: "Long Tailored Coat",
      category: "Jackets & coats",
      price: 119,
      oldPrice: 149,
      badge: "Sale",
      color: "Camel",
      sizes: ["S", "M", "L"],
      images: [],
      tone: "#b58f62",
      desc: "A long, straight coat in camel. Cut to sit over knitwear.",
      details: ["Long length", "Straight cut", "Front pockets"]
    },
    {
      id: "relaxed-blazer",
      name: "Relaxed Blazer",
      category: "Jackets & coats",
      price: 69,
      color: "Black",
      sizes: ["XS", "S", "M", "L"],
      images: [],
      tone: "#1b1b1b",
      desc: "A single-breasted blazer with a relaxed shoulder. Smart with trousers, easy with jeans.",
      details: ["Single-breasted", "Relaxed shoulder", "Lined"]
    },
    {
      id: "satin-button-blouse",
      name: "Satin Button Blouse",
      category: "Tops",
      price: 29,
      color: "Champagne",
      sizes: ["XS", "S", "M", "L"],
      images: [],
      tone: "#d8c3a5",
      desc: "A fluid satin blouse with a soft collar and covered buttons.",
      details: ["Satin finish", "Soft collar", "Covered buttons"]
    },
    {
      id: "fine-rib-top",
      name: "Fine Rib Top",
      category: "Tops",
      price: 19,
      color: "White",
      sizes: ["XS", "S", "M", "L"],
      images: [],
      tone: "#e9e9e6",
      desc: "A close-fitting rib top. A basic you will wear every week.",
      details: ["Fine rib", "Close fit", "Long sleeves"]
    },
    {
      id: "tailored-wide-leg-trousers",
      name: "Tailored Wide-Leg Trousers",
      category: "Trousers & jeans",
      price: 49,
      badge: "New",
      color: "Cream",
      sizes: ["34", "36", "38", "40", "42"],
      images: [],
      tone: "#e4dccb",
      desc: "High-waisted trousers with a pressed crease and a long, wide leg.",
      details: ["High waist", "Pressed crease", "Wide leg"]
    },
    {
      id: "light-wash-straight-jeans",
      name: "Light-Wash Straight Jeans",
      category: "Trousers & jeans",
      price: 45,
      color: "Light blue",
      sizes: ["34", "36", "38", "40", "42"],
      images: [],
      tone: "#8fb0cf",
      desc: "Straight-leg jeans in a light wash with a mid rise.",
      details: ["Straight leg", "Mid rise", "Five pockets"]
    },
    {
      id: "pleated-midi-skirt",
      name: "Pleated Midi Skirt",
      category: "Skirts",
      price: 35,
      color: "Black",
      sizes: ["XS", "S", "M", "L"],
      images: [],
      tone: "#262626",
      desc: "A midi skirt with fine pleats that move when you walk.",
      details: ["Pleated", "Midi length", "Elastic back waist"]
    },
    {
      id: "white-sneakers",
      name: "Clean White Sneakers",
      category: "Shoes",
      price: 65,
      color: "White",
      sizes: ["37", "38", "39", "40", "41"],
      images: [],
      tone: "#ecebe8",
      desc: "Low-profile white sneakers that go with everything in the shop.",
      details: ["Low profile", "Lace-up", "Rubber sole"]
    },
    {
      id: "printed-scarf",
      name: "Printed Scarf",
      category: "Accessories",
      price: 19,
      color: "Cream and navy",
      sizes: ["One size"],
      images: [],
      tone: "#c9c3a8",
      desc: "A light scarf to tie at the neck, in the hair or on a bag.",
      details: ["Light weight", "Square shape"]
    },
    {
      id: "structured-shoulder-bag",
      name: "Structured Shoulder Bag",
      category: "Accessories",
      price: 55,
      badge: "New",
      color: "Black",
      sizes: ["One size"],
      images: [],
      tone: "#141414",
      desc: "A small structured bag with a top handle and a detachable strap.",
      details: ["Top handle", "Detachable strap", "Inner pocket"]
    }
  ]
};
