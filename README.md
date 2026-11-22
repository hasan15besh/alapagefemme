# à la PAGE: demo storefront

A static, no-build demo shop for à la PAGE. Plain HTML, CSS and JavaScript.

**What it does**
- The shop sign rebuilt in CSS (pink frame, script "à la", bold "PAGE", pink square)
- Product grid with category chips, search, sort, saved pieces (heart)
- Product pop-up with gallery, size picker and "Ask on WhatsApp"
- Bag with quantities and total, saved between visits
- **Send order on WhatsApp**: opens WhatsApp with the whole order written out
- Lookbook, opening hours, call/WhatsApp/directions buttons and a Google map

## Run locally
```bash
npx serve .
```
or open `index.html` directly.

## Deploy on Vercel
1. Push this folder to a GitHub repo.
2. In Vercel choose **Add New, Project**, import the repo.
3. Framework preset: **Other**. No build command, no output directory. Deploy.

## Edit the shop
Everything lives in `js/products.js`:
- `STORE`: WhatsApp number (`whatsapp`, digits only with country code), phone, address, map coordinates, hours
- `PRODUCTS`: name, category, price, `oldPrice` (for sale), `badge` ("New" or "Sale"), colour, sizes, description
- Photos: put files in `images/` and list them in the product's `images`. The first is the main photo, the second shows on hover. A product with no images shows a branded "Photo coming soon" tile.

## Files
```
index.html        page structure
css/style.css     all styles
js/products.js    store details + catalogue (edit this)
js/app.js         filters, product pop-up, bag, WhatsApp checkout
images/           product and lookbook photos
fonts/            self-hosted Anton, Yellowtail, Hanken Grotesk (SIL OFL)
vercel.json       clean URLs + basic headers
```

This is a demo concept. It is not the official à la PAGE website.
