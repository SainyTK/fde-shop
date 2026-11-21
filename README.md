# FDE Shop

FDE Shop is a Shopee-style marketplace built for the FDE 101 Web e-commerce workshop.
Sellers list products and manage their stock, and buyers shop, apply coupons, pay by PromptPay with a transfer slip and track their deliveries.

Live: https://fde-shop.vercel.app

This is a learning project.
Everything runs in your browser, and the accounts below are public test credentials.

## Try it

Open the live app, sign in with a demo account and follow [WALKTHROUGH.md](WALKTHROUGH.md).
It plays through buying, coupons, slip checking, shipping, tracking and stock management step by step in about 15 minutes.

## Demo logins

All demo accounts use the password `demo1234`.
The sign-in page has one-click buttons for each of them.

| Role | Email | Shop |
| --- | --- | --- |
| Buyer | buyer@fdeshop.test | |
| Buyer | piti@fdeshop.test | |
| Seller | seller@fdeshop.test | Gadget Hub TH |
| Seller | home@fdeshop.test | บ้านสบาย Living |
| Seller | style@fdeshop.test | Style Street BKK |
| Seller | sport@fdeshop.test | Active Sport |

## Features

- Seller and buyer accounts with sign up and sign in. Sellers get a Seller Centre with sales, a to-do list and stock alerts.
- Buyers browse 182 products from four shops, search and filter by category, add to cart, and check out with orders split per shop.
- Discount coupons: sellers create percent or fixed coupons with a minimum spend, maximum discount, expiry date and usage limit. Buyers pick or type a shop code at checkout, and each buyer can use a code once.
- Shipment tracking: every order moves through ordered, paid, packed, shipped (carrier and tracking number) and delivered. Sellers add tracking updates, and anyone can look up a parcel at `/track` by tracking number or order number.
- Stock management: product create, edit and delete, stock restock and count adjustments, low-stock thresholds and alerts, and a stock movement history. Stock is deducted when an order is placed, returned when it is cancelled, and checkout is blocked when stock runs out.
- Payment slip check: the order page shows a PromptPay QR for the exact amount. The buyer uploads the transfer slip, and the app decodes the slip's verification QR (Thai bank slip format with CRC check), rejects reused slips, and reads the amount with OCR. The seller then approves or rejects the slip. A demo slip generator lets you try both a matching and a wrong amount.

## Data

There is no database.
All data is stored in the browser's IndexedDB and seeded with demo shops, products, coupons and orders on first visit.
The footer has a button that resets the demo data.

## Development

```bash
npm install
npm run dev
npm run lint
npm run format
npm run build
```

Built with Next.js, TypeScript, Tailwind CSS, shadcn/ui (Base UI), Zustand, jsQR, Tesseract.js and Biome.
