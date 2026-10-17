(function () {
  // Waits for data in <script type="application/json" id="d"> (or window.M), because the inline data may arrive after this script runs.
  var tries = 0;
  function data() { if (window.M) return window.M; var e = document.getElementById("d"); if (e) { try { return JSON.parse(e.textContent); } catch (x) {} } return null; }
  function start() { var d = data(); if (!d && tries++ < 50) { setTimeout(start, 100); return; } run(d || {}); }
  function run(DATA) {
  // Menu list. Data: {t:"title", u:"price unit", s:[["Section",[[n,"local name","short en",price,hasPhoto]]]]}
  var M = DATA, app = document.getElementById("app");
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  var st = el("style");
  st.textContent = ".mh{display:flex;justify-content:space-between;align-items:baseline;gap:8px;padding:.5rem 0 .25rem}.mt{font-size:16px;font-weight:500}.mu{font-size:12px;color:var(--text-muted)}.sec{font-size:12px;color:var(--text-secondary);padding:1rem 0 .25rem;border-bottom:.5px solid var(--border)}.it{display:flex;gap:10px;align-items:baseline;padding:10px 2px;border-bottom:.5px solid var(--border);cursor:pointer;color:var(--text-primary);-webkit-tap-highlight-color:transparent}.it:focus-visible{outline:2px solid var(--border-accent);outline-offset:-2px}.n{min-width:22px;font-size:13px;color:var(--text-muted);font-variant-numeric:tabular-nums}.it.on .n,.it.on .t{color:var(--text-accent)}.it.on .n{font-weight:500}.ck{font-size:16px;color:var(--text-accent);visibility:hidden;align-self:center}.it.on .ck{visibility:visible}.m{flex:1;min-width:0}.t{font-size:15px}.d{display:block;font-size:13px;color:var(--text-secondary)}.p{font-size:14px;font-variant-numeric:tabular-nums;color:var(--text-secondary);white-space:nowrap}.bar{margin-top:12px;display:flex;gap:8px;align-items:center;flex-wrap:wrap}.cnt{font-size:13px;color:var(--text-secondary);flex:1;min-width:110px}.cnt.err{color:var(--text-danger)}";
  app.appendChild(st);
  var h = el("div", "mh"); h.appendChild(el("span", "mt", M.t || "Menu")); h.appendChild(el("span", "mu", (M.u || "Prices in VND") + ", tap to select")); app.appendChild(h);
  var sel = {}, order = [], cnt = el("span", "cnt", "Tap items to select");
  function upd() { var k = Object.keys(sel).length; cnt.className = "cnt"; cnt.textContent = k ? k + " selected" : "Tap items to select"; }
  (M.s || []).forEach(function (sec) {
    app.appendChild(el("div", "sec", sec[0]));
    (sec[1] || []).forEach(function (r) {
      var n = r[0], vi = r[1], b = el("div", "it");
      b.setAttribute("role", "button"); b.setAttribute("tabindex", "0"); b.setAttribute("aria-pressed", "false");
      b.onkeydown = function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); b.click(); } };
      b.appendChild(el("span", "n", String(n)));
      var m = el("span", "m"); m.appendChild(el("span", "t", vi));
      if (r[4]) { var ic = el("i", "ti ti-photo"); ic.setAttribute("aria-label", "Has photo"); ic.style.cssText = "font-size:14px;color:var(--text-muted);margin-left:6px;vertical-align:-2px"; m.appendChild(ic); }
      m.appendChild(el("span", "d", r[2] || "")); b.appendChild(m);
      b.appendChild(el("span", "p", r[3] == null ? "" : String(r[3])));
      var ck = el("i", "ti ti-check ck"); ck.setAttribute("aria-hidden", "true"); b.appendChild(ck);
      b.onclick = function () {
        var on = !sel[n];
        if (on) { sel[n] = vi; order.push(n); } else { delete sel[n]; order = order.filter(function (x) { return x !== n; }); }
        b.classList.toggle("on", on); b.setAttribute("aria-pressed", String(on)); upd();
      };
      app.appendChild(b);
    });
  });
  function picked() { return order.slice().sort(function (a, b) { return a - b; }).map(function (n) { return n + " " + sel[n]; }).join(", "); }
  function go(t) { if (!order.length) { cnt.className = "cnt err"; cnt.textContent = "Select an item first"; return; } sendPrompt(t + ": " + picked()); }
  var bar = el("div", "bar"); bar.appendChild(cnt);
  var b1 = el("button", null, "Tell me more ↗"), b2 = el("button", null, "I'll order this ↗");
  b1.onclick = function () { go("Tell me more"); }; b2.onclick = function () { go("I will order"); };
  bar.appendChild(b1); bar.appendChild(b2); app.appendChild(bar);
  }
  start();
})();
