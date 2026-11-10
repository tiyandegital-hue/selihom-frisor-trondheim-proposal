/* Selihom Frisør — shared behaviour.
   Business name is ONE swappable constant (SITE.name). */
var SITE = {
  name: "Selihom Frisør",
  address: "Ravelsveita 4, 7011 Trondheim",
  phoneDisplay: "+47 45 55 10 86",
  phoneHref: "tel:+4745551086",
  email: "selihomfrisor8@gmail.com",
  setmore: "https://selihomfrisor.setmore.com/",
  facebook: "https://www.facebook.com/p/Selihom-Frisør-100063458654895",
  maps: "https://www.google.com/maps/search/?api=1&query=Ravelsveita+4%2C+7011+Trondheim",
  rating: "4.98",
  reviews: "90"
};

var SERVICES = [
  { id: "herreklipp",        name: "Herreklipp",              min: 20, price: 300,
    desc: "Klassisk eller moderne herreklipp med saks og maskin, skarp finish." },
  { id: "barneklipp",        name: "Barneklipp",              min: 25, price: 250,
    desc: "Tålmodig og presis klipp for barn. Trygg og vennlig atmosfære." },
  { id: "skjegg-barbering",  name: "Skjegg Barbering",        min: 10, price: 200,
    desc: "Trimming, formgivning og ren barbering med knivskarpe linjer og pleie." },
  { id: "pensjonist",        name: "Herre Pensjonist Klipp",  min: 20, price: 250,
    desc: "Klassisk herreklipp med rabattert pris for honnør/pensjonist. Samme høye håndverksmessige standard." },
  { id: "klipp-og-skjegg",   name: "Herreklipp og skjegg",    min: 30, price: 350,
    desc: "Komplett pakke for hår og skjegg i én samlet behandling. Full overhaling med overgang og skarp finish." }
];

function serviceById(id) {
  for (var i = 0; i < SERVICES.length; i++) if (SERVICES[i].id === id) return SERVICES[i];
  return SERVICES[0];
}
function kr(n) { return n + " kr"; }

document.addEventListener("DOMContentLoaded", function () {

  /* ---- mobile nav ---- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { nav.classList.remove("open"); });
    });
  }

  /* ---- open-now status (Europe/Oslo) ---- */
  var statusEls = document.querySelectorAll("[data-open-status]");
  try {
    var now = new Date(new Date().toLocaleString("en-US", { timeZone: "Europe/Oslo" }));
    var day = now.getDay();          /* 0 = Sunday */
    var mins = now.getHours() * 60 + now.getMinutes();
    var open = day !== 0 && mins >= 600 && mins < 1200; /* Mon–Sat 10:00–20:00 */
    statusEls.forEach(function (el) {
      el.classList.toggle("closed", !open);
      var label = el.querySelector("[data-open-label]");
      if (label) label.textContent = open ? "Åpent nå · 10:00–20:00" : (day === 0 ? "Stengt i dag · Åpner mandag 10:00" : "Stengt nå · Åpner 10:00");
    });
  } catch (e) { /* keep static fallback text */ }

  /* ---- FAQ accordion ---- */
  document.querySelectorAll(".faq-q").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var item = btn.closest(".faq-item");
      var wasOpen = item.classList.contains("open");
      item.closest(".faq-group, .faq-list").querySelectorAll(".faq-item").forEach(function (it) { it.classList.remove("open"); });
      if (!wasOpen) item.classList.add("open");
      btn.setAttribute("aria-expanded", wasOpen ? "false" : "true");
    });
  });

  /* ---- FAQ filters ---- */
  document.querySelectorAll("[data-faq-filter]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document.querySelectorAll("[data-faq-filter]").forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      var f = btn.getAttribute("data-faq-filter");
      document.querySelectorAll(".faq-group").forEach(function (g) {
        g.style.display = (f === "alle" || g.getAttribute("data-group") === f) ? "" : "none";
      });
    });
  });

  /* ---- gallery filters ---- */
  document.querySelectorAll("[data-gal-filter]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document.querySelectorAll("[data-gal-filter]").forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      var f = btn.getAttribute("data-gal-filter");
      document.querySelectorAll(".gal-card").forEach(function (c) {
        c.style.display = (f === "alle" || c.getAttribute("data-cat") === f) ? "" : "none";
      });
    });
  });

  /* ---- chair picker (frisører) ---- */
  var chairBtns = document.querySelectorAll(".chair-btn");
  var chairNote = document.querySelector("[data-chair-note]");
  chairBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      chairBtns.forEach(function (b) { b.classList.remove("selected"); });
      btn.classList.add("selected");
      if (chairNote) chairNote.textContent = "Valgt stasjon: " + btn.getAttribute("data-chair") + " — drop-in i Ravelsveita 4 eller direktebestilling via Setmore.";
    });
  });

  /* ---- contact form (besøk oss) — front-end demo only, no backend ---- */
  var contactForm = document.querySelector("[data-contact-form]");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = document.querySelector("[data-contact-ok]");
      if (ok) { ok.classList.add("show"); ok.scrollIntoView({ behavior: "smooth", block: "center" }); }
      contactForm.querySelector("button[type=submit]").disabled = true;
    });
  }

  /* ================= BOOKING (star page) ================= */
  var booking = document.querySelector("[data-booking]");
  if (!booking) return;

  var state = { service: SERVICES[0], date: null, time: null, name: "", phone: "", email: "" };
  var step = 1;

  var sumService = document.querySelector("[data-sum-service]");
  var sumDuration = document.querySelector("[data-sum-duration]");
  var sumDate = document.querySelector("[data-sum-date]");
  var sumTime = document.querySelector("[data-sum-time]");
  var sumPrice = document.querySelector("[data-sum-price]");
  var sumName = document.querySelector("[data-sum-name]");

  function renderSummary() {
    if (sumService) sumService.textContent = state.service.name;
    if (sumDuration) sumDuration.textContent = state.service.min + " min";
    if (sumPrice) sumPrice.textContent = kr(state.service.price);
    if (sumDate) sumDate.textContent = state.date ? state.date.label : "Ikke valgt";
    if (sumTime) sumTime.textContent = state.time || "Ikke valgt";
    if (sumName) sumName.textContent = state.name || "—";
    var step1Next = document.querySelector("[data-goto-step='2']");
    if (step1Next) step1Next.disabled = false;
  }

  function goStep(n) {
    step = n;
    document.querySelectorAll(".step-panel").forEach(function (p) { p.classList.toggle("active", p.getAttribute("data-step") === String(n)); });
    document.querySelectorAll(".step-tab").forEach(function (t) {
      var tn = parseInt(t.getAttribute("data-step"), 10);
      t.classList.toggle("active", tn === n);
      t.classList.toggle("done", tn < n);
    });
    var panel = document.querySelector('.step-panel[data-step="' + n + '"]');
    if (panel) panel.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  /* step 1 — service picker */
  document.querySelectorAll(".service-opt").forEach(function (opt) {
    opt.addEventListener("click", function () {
      document.querySelectorAll(".service-opt").forEach(function (o) { o.classList.remove("selected"); });
      opt.classList.add("selected");
      var radio = opt.querySelector("input[type=radio]");
      if (radio) radio.checked = true;
      state.service = serviceById(opt.getAttribute("data-service"));
      renderSummary();
    });
  });

  /* step 2 — dates: next 14 days, closed Sundays */
  var dateRow = document.querySelector("[data-date-row]");
  var slotGrid = document.querySelector("[data-slot-grid]");
  var daysNo = ["søndag", "mandag", "tirsdag", "onsdag", "torsdag", "fredag", "lørdag"];
  var monthsNo = ["jan", "feb", "mar", "apr", "mai", "jun", "jul", "aug", "sep", "okt", "nov", "des"];
  if (dateRow) {
    var today = new Date();
    for (var d = 0; d < 14; d++) {
      var dt = new Date(today.getFullYear(), today.getMonth(), today.getDate() + d);
      var b = document.createElement("button");
      b.type = "button";
      b.className = "date-btn";
      var isSun = dt.getDay() === 0;
      b.disabled = isSun;
      b.innerHTML = '<span class="d">' + dt.getDate() + " " + monthsNo[dt.getMonth()] + "</span><br>" +
        '<span class="w">' + (d === 0 ? "I dag" : daysNo[dt.getDay()]) + (isSun ? " · stengt" : "") + "</span>";
      (function (dt, label) {
        b.addEventListener("click", function () {
          dateRow.querySelectorAll(".date-btn").forEach(function (x) { x.classList.remove("selected"); });
          b.classList.add("selected");
          state.date = { iso: dt.toISOString().slice(0, 10), label: label };
          state.time = null;
          renderSlots(dt);
          renderSummary();
        });
      })(dt, (d === 0 ? "I dag, " : "") + daysNo[dt.getDay()] + " " + dt.getDate() + ". " + monthsNo[dt.getMonth()]);
      dateRow.appendChild(b);
    }
    /* pre-select first open day */
    var firstOpen = dateRow.querySelector(".date-btn:not([disabled])");
    if (firstOpen) firstOpen.click();
  }

  function renderSlots(dt) {
    if (!slotGrid) return;
    slotGrid.innerHTML = "";
    var now = new Date();
    var isToday = dt.toDateString() === now.toDateString();
    for (var h = 10; h < 20; h++) {
      ["00", "30"].forEach(function (m) {
        if (h === 19 && m === "30") return; /* last start 19:00 */
        var label = (h < 10 ? "0" : "") + h + ":" + m;
        var b = document.createElement("button");
        b.type = "button";
        b.className = "slot-btn";
        b.textContent = label;
        var slotDate = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), h, parseInt(m, 10));
        if (isToday && slotDate <= now) b.disabled = true;
        b.addEventListener("click", function () {
          slotGrid.querySelectorAll(".slot-btn").forEach(function (x) { x.classList.remove("selected"); });
          b.classList.add("selected");
          state.time = label;
          renderSummary();
        });
        slotGrid.appendChild(b);
      });
    }
  }

  /* step navigation */
  document.querySelectorAll("[data-goto-step]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var n = parseInt(btn.getAttribute("data-goto-step"), 10);
      if (n === 3 && (!state.date || !state.time)) {
        alert("Velg først dato og klokkeslett i steg 02.");
        return;
      }
      goStep(n);
    });
  });
  document.querySelectorAll(".step-tab").forEach(function (t) {
    t.addEventListener("click", function () {
      var n = parseInt(t.getAttribute("data-step"), 10);
      if (n === 3 && (!state.date || !state.time)) { alert("Velg først dato og klokkeslett i steg 02."); return; }
      goStep(n);
    });
  });

  /* step 3 — contact form -> confirmation (demo request, no backend) */
  var bkForm = document.querySelector("[data-booking-form]");
  if (bkForm) {
    bkForm.addEventListener("submit", function (e) {
      e.preventDefault();
      state.name = bkForm.querySelector("[name=navn]").value.trim();
      state.phone = bkForm.querySelector("[name=telefon]").value.trim();
      state.email = bkForm.querySelector("[name=epost]").value.trim();
      var c = document.querySelector("[data-confirm]");
      var f = document.querySelector("[data-booking-form-wrap]");
      if (c) {
        c.querySelector("[data-confirm-service]").textContent = state.service.name;
        c.querySelector("[data-confirm-when]").textContent = (state.date ? state.date.label : "") + " kl. " + (state.time || "");
        c.querySelector("[data-confirm-name]").textContent = state.name;
        c.querySelector("[data-confirm-price]").textContent = kr(state.service.price);
        c.style.display = "block";
        c.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      if (f) f.style.display = "none";
      renderSummary();
    });
  }

  renderSummary();
});
