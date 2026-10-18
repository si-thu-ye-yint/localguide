---
name: vietnam-menu-reader
description: Use when the user sends a photo of a restaurant menu (Vietnamese, Thai or other) or of food they got, or asks what a local dish is. Uses the LocalGuide Supabase library and hosted widgets.
---

# Menu Reader

Follow these steps exactly. Database calls use the LocalGuide Supabase connector tool `execute_sql` (project `ysoihnosrzcqqrikprdb`). Widgets use `show_widget`. The widget code is already hosted; you only send data. Never write widget HTML/CSS/JS yourself, never make an artifact, never use web image search.

Works for any menu language. "Local name" means the dish name in the menu's language (Vietnamese, Thai...). In the database, the local name always goes in the `vi` field.

Widget data goes in a `<script type="application/json" id="d">` block and must be strict JSON: double quotes around every key and string, no trailing commas.

## A. User sends a menu photo

Reply with one line only: "Got page N. Should I write out the menu, or will you send more?"
Repeat for each new photo. Wait until the user says go / ok / done.

## B. User says go: show the menu list

1. Read every item from all photos since the last menu. Keep local names as printed (normal capitalization). Use the menu's printed item numbers; if none, number 1, 2, 3... Keep prices as printed.
1b. Read section headers and small print too. If a header says the dish comes with a choice of base, for example "(PHỞ / HỦ TIẾU / MIẾN / MỲ)", the meats or toppings listed below are NOT the full dish: the customer picks one base AND one topping, and the price follows the topping. Then:
   - Add a FIRST section "Chọn bánh · Step 1: pick your noodle" with one row per base, lettered A, B, C... (letters instead of numbers), short English (for example Phở "Flat rice noodles", Miến "Glass noodles", Mỳ "Wheat egg noodles"), price "same price", photo 0. Look up and save these bases like any other item.
   - Name the next section "Chọn thịt · Step 2: pick your meat" (or the matching local/English names) and keep its rows numbered as printed.
   - Put "Same price for any noodle" in `u` when that is what the menu shows.
   - Keep add-on notes as printed, for example "Any 2 meats (bắp bò +15k)".
   - If part of the header is hidden or unreadable in the photo, leave that option out and say so in the chat line.
   Letters work like numbers in sections C and D ("Tell me more: A Phở, 1 Tái"; "I will order: A Phở, 1 Tái"). In D, a noodle plus meat is one item: name "Phở tái", price from the meat row.
2. Look them up in ONE call. For Vietnamese regional short names add the standard name in brackets so they match, for example 'Nâu (cà phê sữa)' (Nâu is the Hanoi word for milk coffee), 'Đen (cà phê đen)'.
```sql
select public.menu_lookup(array['Cơm tấm sườn','Cơm tấm xá xíu']);
```
Each result has `exact` (already saved), `en` (short English), `base` (related dish), `photo` (true/false).
3. For items where `en` is null, write a short English description (max 8 words). Save them in ONE call:
```sql
select public.save_dishes('[{"vi":"Cơm tấm xá xíu","short":"Char siu BBQ pork","en":"Broken rice with Chinese BBQ pork"}]'::jsonb);
```
4. Show the widget. Only fill the JSON:
```html
<div id="app"></div><script type="application/json" id="d">{"t":"Restaurant or menu name","u":"Prices in VND, k = 1,000","s":[["Cơm · Rice plates",[[1,"Cơm sườn","Rice with grilled pork chop","35k",0],[2,"Cơm nem nướng","Rice with grilled pork sausage","30k",1]]]]}</script><script src="https://cdn.jsdelivr.net/gh/si-thu-ye-yint/localguide@709b57eeae75c7ebe54e9e819ea09bc937251aeb/widgets/v3/menu.js"></script>
```
Row = [number, local name, short English, price as printed, photo ? 1 : 0]. Section names: "Local · English". `u` names the currency as printed, for example "Prices in VND", "Prices x1,000 VND", "Prices in THB".
5. Chat text: one short line at most.

## C. "Tell me more: 1 Cơm sườn, 3 ..."

1. One call:
```sql
select public.dish_details(array['Cơm sườn','Cơm lạp xưởng']);
```
2. For each item with `missing: true`, write the details and save them in ONE call:
   - `what`: what it is, 2-3 sentences. Name the base precisely (noodle: flat rice, round rice vermicelli, egg, tapioca, glass; rice: broken, sticky, jasmine; drink: which tea or coffee). Main ingredients and how it is served. Explain the words in the name. Vietnamese: bò beef, gà chicken, heo/lợn pork, ba rọi pork belly, tôm shrimp, cua crab, cá fish, mực squid, tái rare, chín well-done, khô dry, nướng grilled, chiên fried, xào stir-fried, thêm extra, đặc biệt house special, chay vegetarian, trân châu tapioca pearls, kem muối salted cream.
   - `taste`: taste and texture in plain words, spice level. 1-2 sentences.
   - `cmp`: comparison ONLY if there is a close match. For Vietnamese and other menus compare to Burmese or Thai dishes; for Thai menus compare to Burmese dishes. Otherwise leave it out.
   - `tags`: 1-3 short warnings: Pork, Beef, Offal, Blood, Shrimp, Peanuts, Dairy, Egg, Raw, Spicy, Very sweet.
```sql
select public.save_dishes('[{"vi":"...","en":"...","what":"...","taste":"...","cmp":"...","tags":["Pork"]}]'::jsonb);
```
3. Show the widget, one object per item. Copy `img` and `cr` exactly from dish_details; leave them out if absent.
```html
<div id="app"></div><script type="application/json" id="d">[{"n":1,"vi":"Cơm sườn","en":"...","p":"35k","img":"...","cr":"...","what":"...","taste":"...","cmp":"...","tags":["Pork"]}]</script><script src="https://cdn.jsdelivr.net/gh/si-thu-ye-yint/localguide@709b57eeae75c7ebe54e9e819ea09bc937251aeb/widgets/v3/cards.js"></script>
```
4. No chat text after it.

## D. "I will order: 3 Cơm lạp xưởng, ..."

No database call. The card speaks the menu's language: set `lang` to "vi" (Vietnamese) or "th" (Thai).
```html
<div id="app"></div><script type="application/json" id="d">{"lang":"vi","items":[{"n":3,"name":"Cơm lạp xưởng","en":"Rice with Chinese sausage","p":30000,"k":"f"}]}</script><script src="https://cdn.jsdelivr.net/gh/si-thu-ye-yint/localguide@709b57eeae75c7ebe54e9e819ea09bc937251aeb/widgets/v3/order.js"></script>
```
- `p` = full price as a number in local currency (30k = 30000; 70 on an x1,000 VND menu = 70000; 60 baht = 60). `k` = "f" food, "d" drink.
- Any other language: keep `"lang":"vi"` and add `"L"` with phrases in that language, for example `"L":{"hi":"注文します:","ty":"ありがとう","away":["持ち帰り","Takeaway"],"cur":"円","loc":"ja-JP","f":[["辛くしないで","Not spicy"]],"d":[["氷なし","No ice"]]}`.
- One line of chat: "Show this to the waiter."

## E. User sends a photo of the food they got

Ask which item it is if not clear.
1. Get the upload key (never show it to the user):
```sql
select v from public.app_config where k = 'upload_key';
```
2. Run in the code tool (replace FILE, KEY and the dish name exactly as on the menu):
```bash
python3 -c "from PIL import Image,ImageOps;im=ImageOps.exif_transpose(Image.open('FILE')).convert('RGB');im.thumbnail((1280,1280));im.save('/tmp/dish.jpg',quality=82)"
curl -sS -X POST -H 'x-key: KEY' -F 'file=@/tmp/dish.jpg' -F 'dish=Cơm lạp xưởng' https://ysoihnosrzcqqrikprdb.supabase.co/functions/v1/upload-dish-photo
```
Uploaded files are usually in /mnt/user-data/uploads/. On `"ok":true` reply: "Saved as the photo for Cơm lạp xưởng." If curl cannot connect, tell the user to add `ysoihnosrzcqqrikprdb.supabase.co` to allowed domains in Settings > Capabilities.

## F. Questions

Answer in chat, short. If you explain a dish in detail, also save it with `save_dishes`.

## Rules

- Short chat text. No emoji.
- In SQL text, write a single quote inside a value as two single quotes ('').
- In widget JSON, escape any double quote inside text as \".

## Maintenance (only when the user asks)

- Edge functions: `load-dish-image` (Wikipedia photo by dish id, uses wiki_title), `sync-dish-photos` (copies storage photos to GitHub; run until remaining is 0), `upload-dish-photo` (user photos), `push-file` (writes one file under skills/ or widgets/ in github.com/si-thu-ye-yint/localguide; POST JSON {path, content} or {path, copy_from} with header x-key = the upload key; returns the commit).
- Widget scripts: put a changed widget in a NEW folder (widgets/v4/, v5/...) with `push-file`, then change the pinned commit in the script URLs above to the commit it returns. Never rely on @main; jsDelivr caches it.
- Table `public.dishes`. Functions: `menu_lookup`, `dish_details`, `save_dishes`, `find_dish`.
- The shared copy of this skill is skills/vietnam-menu-reader/SKILL.md in the repo. When this skill changes, push the new text there with `push-file` too.
