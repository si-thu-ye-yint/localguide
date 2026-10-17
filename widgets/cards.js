(function () {
  // Waits for window.C (or <script type="application/json" id="d">) because the inline data script may run after this one.
  var tries = 0;
  function data() { if (window.C) return window.C; var e = document.getElementById("d"); if (e) { try { return JSON.parse(e.textContent); } catch (x) {} } return null; }
  function start() { var d = data(); if (!d && tries++ < 50) { setTimeout(start, 100); return; } run(d || []); }
  function run(DATA) {
  // Dish detail cards. Data: [{n, vi, en, p, img, cr, what, taste, cmp, tags:[]}]
  var C = DATA, app = document.getElementById("app");
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  var st = el("style");
  st.textContent = ".c{background:var(--surface-2);border:.5px solid var(--border);border-radius:12px;overflow:hidden;margin-bottom:12px}.c img{width:100%;aspect-ratio:4/3;object-fit:cover;display:block;background:var(--surface-1)}.b{padding:1rem 1.25rem;display:grid;gap:8px}.h{display:flex;justify-content:space-between;align-items:baseline;gap:12px}.hn{font-size:18px;font-weight:500}.hp{font-variant-numeric:tabular-nums;white-space:nowrap}.en{font-size:14px;color:var(--text-secondary)}.l{font-size:12px;color:var(--text-muted);margin:0}.x{font-size:14px;margin:0}.chips{display:flex;gap:6px;flex-wrap:wrap}.chip{font-size:12px;padding:2px 8px;border-radius:var(--radius);background:var(--bg-warning);color:var(--text-warning)}.cr{font-size:11px;color:var(--text-muted);margin:0}.ob{justify-self:start}";
  app.appendChild(st);
  C.forEach(function (d) {
    var c = el("div", "c");
    if (d.img) { var im = el("img"); im.src = d.img; im.alt = d.vi; im.onerror = function () { im.remove(); }; c.appendChild(im); }
    var b = el("div", "b"), h = el("div", "h");
    h.appendChild(el("span", "hn", (d.n != null ? d.n + ". " : "") + d.vi));
    if (d.p) h.appendChild(el("span", "hp", String(d.p)));
    b.appendChild(h);
    if (d.en) b.appendChild(el("span", "en", d.en));
    function sec(label, text) { if (!text) return; var w = el("div"); w.appendChild(el("p", "l", label)); w.appendChild(el("p", "x", text)); b.appendChild(w); }
    sec("What it is", d.what);
    sec("Taste", [d.taste, d.cmp].filter(Boolean).join(" "));
    if (d.tags && d.tags.length) { var ch = el("div", "chips"); d.tags.forEach(function (t) { ch.appendChild(el("span", "chip", t)); }); b.appendChild(ch); }
    b.appendChild(el("p", "cr", d.img ? (d.cr || "") + (d.cr === "Your photo" ? "" : ". Typical dish, not this restaurant's version.") : "No photo yet. Send one when your food arrives."));
    var ob = el("button", "ob", "I'll order this ↗");
    ob.onclick = function () { sendPrompt("I will order: " + (d.n != null ? d.n + " " : "") + d.vi); };
    b.appendChild(ob);
    c.appendChild(b); app.appendChild(c);
  });
  }
  start();
})();
