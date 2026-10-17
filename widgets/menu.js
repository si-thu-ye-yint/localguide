(function () {
  // Menu list. Data: window.M = {t:"title", u:"price unit", s:[["Section",[[n,"vi","short en",price,hasPhoto]]]]}
  var M = window.M || {}, app = document.getElementById("app");
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  var st = el("style");
  st.textContent = ".mh{display:flex;justify-content:space-between;align-items:baseline;gap:8px;padding:.5rem 0 0}.mt{font-size:16px;font-weight:500}.mu{font-size:12px;color:var(--text-muted)}.sec{font-size:12px;color:var(--text-secondary);margin:1rem 0 4px}.it{display:flex;gap:10px;align-items:flex-start;width:100%;text-align:left;background:transparent;border:0;border-top:.5px solid var(--border);border-radius:0;padding:8px 4px;cursor:pointer;color:var(--text-primary);font:inherit}.it:hover{background:var(--surface-1)}.it.on{background:var(--bg-accent)}.n{min-width:26px;height:22px;border-radius:var(--radius);background:var(--surface-1);font-size:12px;display:flex;align-items:center;justify-content:center;color:var(--text-secondary)}.it.on .n{background:var(--fill-accent);color:var(--on-accent)}.m{flex:1;min-width:0}.t{font-size:14px;font-weight:500}.d{display:block;font-size:13px;color:var(--text-secondary)}.p{font-size:13px;font-variant-numeric:tabular-nums;color:var(--text-secondary);white-space:nowrap}.bar{border-top:.5px solid var(--border-strong);margin-top:12px;padding-top:12px;display:flex;gap:8px;align-items:center;flex-wrap:wrap}.cnt{font-size:13px;color:var(--text-secondary);flex:1;min-width:110px}.cnt.err{color:var(--text-danger)}";
  app.appendChild(st);
  var h = el("div", "mh"); h.appendChild(el("span", "mt", M.t || "Menu")); h.appendChild(el("span", "mu", (M.u || "Prices in VND") + ", tap to select")); app.appendChild(h);
  var sel = {}, order = [], cnt = el("span", "cnt", "Tap items to select");
  function upd() { var k = Object.keys(sel).length; cnt.className = "cnt"; cnt.textContent = k ? k + " selected" : "Tap items to select"; }
  (M.s || []).forEach(function (sec) {
    app.appendChild(el("div", "sec", sec[0]));
    (sec[1] || []).forEach(function (r) {
      var n = r[0], vi = r[1], b = el("button", "it");
      b.setAttribute("aria-pressed", "false");
      b.appendChild(el("span", "n", String(n)));
      var m = el("span", "m"); m.appendChild(el("span", "t", vi));
      if (r[4]) { var ic = el("i", "ti ti-photo"); ic.setAttribute("aria-label", "Has photo"); ic.style.cssText = "font-size:14px;color:var(--text-muted);margin-left:6px;vertical-align:-2px"; m.appendChild(ic); }
      m.appendChild(el("span", "d", r[2] || "")); b.appendChild(m);
      b.appendChild(el("span", "p", r[3] == null ? "" : String(r[3])));
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
})();
