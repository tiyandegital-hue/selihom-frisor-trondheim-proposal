# QA REPORT — Selihom Frisør demo site

**Build dir:** `~/workspace/lead-builds/no-selihom-frisor-trondheim/`
**Date:** 2026-11-10 · **Design:** "Fjord Poster" from STITCH-EXPORT.md (petrol-teal #0A1618/#121d1f, ice-white #f4f9fa, signal orange #FF5A1F, Oswald + Space Grotesk, hairline poster grid, oversized price numerals)
**Status: ✅ QA PASSED** (with the documented limitations in §f)

## (a) Pages & internal links
- All 9 pages exist at build-dir root: `index.html`, `tjenester.html`, `booking.html`, `galleri.html`, `anmeldelser.html`, `om.html`, `frisorer.html`, `besok.html`, `faq.html`.
- Automated link audit (regex over all `href`/`src`): **zero dead internal links, zero missing assets**. Every page has exactly 1 `<h1>`, exactly 1 active nav item, shared sticky header + footer.
- Every `assets/css`, `assets/js`, `assets/img`, `assets/fonts` reference resolves to an existing file (16 woff2 files verified).
- Live serve test: `python3 -m http.server` + curl — **all 9 pages, CSS, JS, 4 images and a sample font returned HTTP 200**.
- All JS hooks referenced in `assets/js/main.js` verified present in the HTML (31/31: booking steps, summary fields, date/time pickers, FAQ accordion/filters, gallery filters, chair picker, contact form, open-status, mobile nav).

## (b) Viewport / overflow — 390px & 1280px
- **No headless browser is available on this VM** (no Chromium/Playwright/puppeteer installed; `which chromium` empty) — so no rendered screenshot check was possible. Static overflow audit performed instead:
  - `box-sizing: border-box` globally; `img { max-width: 100% }`; `body { overflow-x: hidden }`.
  - All type uses `clamp()` (hero H1 56–148px, section H2 30–52px); hero headline is split over two lines (`SELIHOM` / `FRISØR`), so the widest word at 390px is ~200px.
  - Grids collapse: `.grid-3/.grid-2/.gal-grid/.teaser-grid` → 1 column ≤720px; `.grid-4` → 2 cols ≤1080px; `.stat-strip` → 2 cols ≤1080px; booking layout → 1 column ≤1080px with static (non-sticky) summary; price rows reflow to 2 columns ≤720px; step tabs stack ≤720px; header status hidden ≤1080px, Setmore text-link hidden ≤720px, nav becomes hamburger ≤1080px.
  - Fixed-width scan: only hits are the two `@media (max-width: …)` breakpoints (1080px / 720px) — no element has a fixed pixel width ≥390px.
  - **Residual risk:** a rendered 390px screenshot was not taken; parent should eyeball on deploy if possible.

## (c) Console errors
- `node --check assets/js/main.js` → **passes, no syntax errors**.
- No external scripts, no CDN, no trackers: the only script is the local `assets/js/main.js`; fonts are self-hosted woff2. No `console.log`/throw paths in the code; all DOM lookups are null-guarded (`if (booking) return` pattern) so pages without booking widgets cannot throw.
- **Not verified in a live browser console** (no browser on VM) — stated plainly; risk is low given the above.

## (d) Fidelity audit — invented content removed / fixed
Checked against the STITCH-EXPORT.md §FIDELITY AUDIT (automated case-insensitive scan of all 9 pages + CSS + JS, re-run after fixes — **0 hits**):
1. ✅ "EST. 2021" / "ETABLERT 2021" / "ESTABLERINGSÅR: 2021" — absent everywhere (header subline is "Frisør · Trondheim").
2. ✅ 6th service "Hårvask & Styling / 200 kr" — absent; only the 5 verified services appear.
3. ✅ Wrong prices 150 kr / 450 kr — absent; all prices are the verified 300/250/200/250/350 kr.
4. ✅ Rating distribution (88×5★ etc.), "Q1 2025", "KATALOG 2025", "PROTOKOLL 2024", "SETMORE API STATUS", "SYSTEM STATUS: 200 OK", "SETMORE AUDIT LOG" — all absent.
5. ✅ "3 operative stoler" / "3 klippestasjoner i drift daglig" and invented chair roles (HOVEDFRISØR etc.) — absent; Frisører page uses generic "Stol 01/02/03 — navn og bilde bekreftes av salongen" placeholders; chair-picker durations corrected to verified per-service durations (20/25/10 min).
6. ✅ Coordinates, walking times, parking names/distances, metrobus lines, age limit "til og med 12 år", payment methods (Vipps/BankAxept/Visa/Mastercard), "uten innlogging eller forhåndsbetaling", "forventet svartid 24 timer", accessibility/floor claims, "25–40 min", "20m effektiv klippetid", hygiene specifics ("blader byttes", "desinfiseres"), superlatives ("mest konsistente") — all absent. Payment is stated only as "Betaling i salongen — spør salongen".
7. ✅ Typos fixed: "RESIDÈR" → "RESERVER" (FAQ), "UMINDELIG" → "UMIDDELBAR" (booking drop-in card).
8. ✅ Hero subhead rewritten in Norwegian Bokmål (no "Razor-sharp" English mix).
9. ✅ Full verified service names used in all visible labels ("Skjegg Barbering", "Herre Pensjonist Klipp"); remaining `skjegg`/`pensjonist` strings exist only as machine-readable `id`/`data-*` attribute values, never as visible copy.
10. ✅ Reviews: only the 3 reviews named in the build brief are shown (Tedros, Tesfaberhan, Ståle Øiaas, verbatim, first names only, "Fra Setmore"). The two extra Setmore reviews from PAGES.md (Halil, Khadijat) were **removed** after the first QA scan because the Khadijat quote names "Alex", who is not a confirmed staff member — presenting it risked implying a staff identity. No invented testimonials anywhere.
11. ✅ FAQ "Tilbyr dere dameklipp eller hårfarging?" is kept as a **question** (per the Stitch brief) with the answer "kun de 5 tjenestene over er listet — spør salongen". No women's services are offered anywhere on the site.
12. ✅ No women's services, no stylist names, no founding year, no prices beyond the 5 listed.

## (e) External links — verified URLs only
Complete inventory of external URLs in the site (no others exist):
- `https://selihomfrisor.setmore.com/` — booking (prominent "Bestill via Setmore" on every page; header "Setmore direkte ↗" link).
- `https://www.facebook.com/p/Selihom-Frisør-100063458654895` — Facebook page.
- `https://www.google.com/maps/search/?api=1&query=Ravelsveita+4%2C+7011+Trondheim` — "Åpne i Google Maps".
- `https://www.google.com/maps?q=Ravelsveita+4%2C+7011+Trondheim&output=embed` — map iframe on besøk.html.
- No Google Fonts CDN, no other third-party requests. Fonts are 16 locally hosted woff2 files (Oswald + Space Grotesk, weights 400/500/600/700, latin + latin-ext) — site renders offline.

## (f) Known limitations / unverified items
- **Images:** 4 AI-generated images total (media pipeline limit is 4 calls per response): 1 hero (1920×1280) + 3 gallery portraits (1280×1920). Gallery card 04 (Klassisk herreklipp & sideskille) **reuses the hero image** with a different crop — flagged here, not hidden. All images labelled in-page "EKSEMPELBILDE — AI-GENERERT PRØVE". The 3 small home teasers reuse the 3 gallery portraits.
- **No rendered browser check:** no headless browser on this VM — viewport (§b) and console (§c) results rest on static audit + `node --check` + HTTP 200 serve test, as stated above.
- **Booking steps 02/03 + confirmation are front-end mocks** (per brief): date/time picker generates the next 14 days (Sundays disabled/closed, past slots disabled today), contact form shows a confirmation state clearly labelled "demo-forespørsel, ikke en bekreftet booking" with a "Bekreft via Setmore" button. No fake backend.
- **Contact form (besøk.html)** is front-end only and labelled as a demo; it does not send to the salon.
- **Business name constant:** `SITE.name` in `assets/js/main.js` is the single swappable config constant (with address/phone/email/Setmore/Facebook/maps in the same object). Page HTML carries the literal name; swapping the constant alone does not rewrite static HTML — noted for the parent.
- **Open-now status** is computed client-side in Europe/Oslo time (Mon–Sat 10:00–20:00); falls back to static "Åpent i dag 10:00–20:00" text if the timezone API fails.
- **Not done (per instructions):** no GitHub push, no Vercel deploy, no outreach. `vercel.json` (cleanUrls) is included for the parent's deploy step.
