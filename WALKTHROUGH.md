# FDE Shop walkthrough

This guide plays through every workshop feature on https://fde-shop.vercel.app in about 15 minutes.
The app is in Thai, so the buttons to click are quoted in Thai with a short English meaning.

All data lives in your own browser, so you can try anything without affecting other people.
If things get messy, click "รีเซ็ตข้อมูลเดโม" (reset demo data) in the footer to start over.

Only one account can be signed in at a time.
To switch between buyer and seller, open "เข้าสู่ระบบ" (sign in) at `/login` and click another demo account.

## 1. Buy something as a buyer

1. Open `/login` and click the "ผู้ซื้อ" (buyer) demo account, `buyer@fdeshop.test`.
2. Search for `iphone` in the top bar, or pick a category on the home page.
3. Open "Apple iPhone Charger" (฿699).
   The product page shows the stock left and the shop's coupon codes.
4. Click "ซื้อสินค้า" (buy now).
   You land on the checkout page with only this item selected.

The cart at `/cart` groups items by shop.
If you check out items from two shops, the app creates one order per shop, like Shopee does.

## 2. Apply a discount coupon

1. On checkout, next to "โค้ดส่วนลดร้านค้า" (shop coupon), click "เลือกโค้ด" (choose code).
2. The list shows every coupon of the shop and why it can or cannot be used.
   Try to spot each rule: minimum spend, expired, fully used and already used by you.
3. Pick `GADGET50` (฿50 off, minimum ฿500).
   The total becomes ฿699 - ฿50 + ฿40 shipping = ฿689.
4. Click "สั่งสินค้า" (place order).

## 3. Pay and check the slip

The order page now shows a PromptPay QR for the exact amount.
You don't need to transfer real money.

1. Click "ยังไม่มีสลิป? สร้างสลิปทดลอง" (no slip? create a test slip).
2. Change the amount to something wrong, such as `600`, click "สร้างสลิป" (create slip), then "ใช้สลิปนี้" (use this slip).
   The app reads the QR on the slip and reads the amount with OCR, then blocks the slip because the amount does not match.
3. Click "เลือกสลิปใหม่" (choose another slip) and create a test slip with the correct amount.
   All four checks pass: QR found, valid Thai bank slip format, reference not used before, amount matches.
4. Click "ส่งสลิปให้ร้านค้า" (send slip to the shop).
   The order status becomes "รอตรวจสลิป" (waiting for slip review).

You can also click "ดาวน์โหลด" (download) on a test slip and upload the image file yourself.
Uploading the same slip for another order fails the "reference not used before" check.

## 4. Approve, pack and ship as the seller

1. Sign in with the "ผู้ขาย (Gadget Hub TH)" demo account, `seller@fdeshop.test`.
   The Seller Centre dashboard shows sales, a to-do list and stock alerts.
2. Open "คำสั่งซื้อ" (orders), then the "รอตรวจสลิป" (slip review) tab, and open your order.
3. Review the slip and click "ยืนยันการชำระเงิน" (confirm payment).
   Click "สลิปไม่ถูกต้อง" (slip invalid) instead to see the rejection path: the buyer is asked to upload a new slip.
4. Click "เตรียมพัสดุเรียบร้อย" (packed).
5. Click "ส่งพัสดุ" (ship), choose a carrier, click "สร้างเลข" (generate number) and "ยืนยันการส่ง" (confirm).
6. Add a tracking update, for example "พัสดุถึงศูนย์คัดแยกสินค้า" (arrived at sorting centre) at "ศูนย์คัดแยก บางนา".

## 5. Track the parcel

1. Copy the tracking number from the order page.
2. Open "ติดตามพัสดุ" (track parcel) at `/track` and paste it.
   This page works without signing in, and it also accepts the order number.
3. Sign back in as the buyer, open "การซื้อของฉัน" (my purchases), open the order and click "ได้รับสินค้าแล้ว" (received).
   The progress bar reaches the last step.

## 6. Manage stock as the seller

1. As the seller, open "สินค้า" (products) and click "เพิ่มสินค้าใหม่" (add product).
2. Upload a picture, fill in a name and price, set "สต็อกเริ่มต้น" (starting stock) to `2` and save.
   With the default alert level of 5, the product is flagged "ใกล้หมด" (low stock) straight away.
3. Click "ปรับสต็อก" (adjust stock) and receive 3 more units.
   The movement history shows the starting stock and the restock with the running balance.
4. Sign in as the buyer and buy all 5 units.
   The product page now shows "สินค้าหมด" (sold out) and buying is disabled.
5. Cancel that order as the buyer with "ยกเลิกคำสั่งซื้อ" (cancel order).
   Back in the seller's "สต็อกสินค้า" (stock) page, the history shows the sale and the stock returned by the cancellation.

## 7. Create a coupon as the seller

1. Open "คูปองส่วนลด" (coupons) and click "สร้างคูปอง" (create coupon).
2. Set a code, a percent or fixed discount, a minimum spend, a usage limit and an expiry date.
3. Sign in as the buyer and look for your code on any of the shop's products or at checkout.

## 8. Open your own shop

1. Click "สมัครใหม่" (sign up) on the sign-in page and choose "ผู้ขาย" (seller).
2. Fill in a shop name and your details.
   You start with an empty Seller Centre and can add products, coupons and a PromptPay number under "ตั้งค่าร้านค้า" (shop settings).

## Where to look in the code

- `src/utils/orders.ts` places orders and moves them through each status.
- `src/utils/coupon.ts` holds the coupon rules.
- `src/utils/stock.ts` and `src/utils/products.ts` record stock movements and adjustments.
- `src/utils/slip.ts` parses the slip QR, checks its CRC and compares the amount.
- `src/services/slip-scanner.ts` runs the QR decoder and OCR in the browser.
- `src/store/` keeps all data in one store saved to IndexedDB, and `src/utils/seed.ts` builds the demo data.
