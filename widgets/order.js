(function () {
  // Order card for the waiter, in the menu's language.
  // Data: window.O = {lang:"vi"|"th", items:[{n, name, en, p (number, local currency), k:"f"|"d"}], L:{optional phrase overrides}}
  // An array is also accepted (old format, Vietnamese, name in "vi").
  var D = window.O || {}, app = document.getElementById("app");
  if (Array.isArray(D)) D = { lang: "vi", items: D };
  var PACKS = {
    vi: { hi: "Cho mình gọi:", ty: "Cảm ơn!", away: ["Mang về", "Takeaway"], cur: "đ", loc: "vi-VN",
      d: [["Ít đường", "Less sugar"], ["Không đường", "No sugar"], ["Ít đá", "Less ice"], ["Không đá", "No ice"], ["Nóng", "Hot"]],
      f: [["Không cay", "Not spicy"], ["Không hành", "No green onion"], ["Không rau mùi", "No coriander"], ["Thêm cơm", "Extra rice"]] },
    th: { hi: "ขอสั่ง:", ty: "ขอบคุณ", away: ["กลับบ้าน", "Takeaway"], cur: "฿", loc: "th-TH",
      d: [["หวานน้อย", "Less sweet"], ["ไม่หวาน", "No sugar"], ["น้ำแข็งน้อย", "Less ice"], ["ไม่ใส่น้ำแข็ง", "No ice"], ["ร้อน", "Hot"]],
      f: [["ไม่เผ็ด", "Not spicy"], ["เผ็ดน้อย", "Less spicy"], ["ไม่ใส่ผักชี", "No coriander"], ["ไม่ใส่ต้นหอม", "No green onion"], ["เพิ่มข้าว", "Extra rice"]] }
  };
  var P = PACKS[D.lang] || PACKS.vi, L = D.L || {};
  for (var key in L) P[key] = L[key];
  var O = D.items || [];
  function nm(it) { return it.name || it.vi || ""; }
  function money(v) { return v.toLocaleString(P.loc || undefined) + (P.cur || ""); }
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  var st = el("style");
  st.textContent = ".oc{background:var(--surface-2);border:.5px solid var(--border);border-radius:12px;padding:1.25rem;display:grid;gap:16px}.big{font-size:26px;font-weight:500}.sm{font-size:13px;color:var(--text-secondary)}.row{border-top:.5px solid var(--border);padding-top:14px;display:grid;gap:10px}.ln{display:flex;align-items:center;gap:12px}.st{width:40px;height:40px;font-size:20px;padding:0}.q{font-size:24px;font-weight:500;min-width:28px;text-align:center;font-variant-numeric:tabular-nums}.nm{flex:1;min-width:0}.vi{font-size:21px;font-weight:500}.chips{display:flex;gap:8px;flex-wrap:wrap}.chip{font:inherit;font-size:15px;padding:6px 12px;border-radius:var(--radius);border:.5px solid var(--border-strong);background:transparent;color:var(--text-primary);cursor:pointer;text-align:left;line-height:1.3}.chip small{display:block;font-size:12px;color:var(--text-secondary)}.chip.on{background:var(--bg-accent);border-color:var(--border-accent);color:var(--text-accent)}.chip.on small{color:var(--text-accent)}.sum{font-size:20px;font-weight:500;line-height:1.5}";
  app.appendChild(st);
  var box = el("div", "oc"), top = el("div");
  top.appendChild(el("div", "big", P.hi)); top.appendChild(el("div", "sm", "I'd like to order:"));
  box.appendChild(top);
  var state = O.map(function () { return { q: 1, on: [] }; });
  var away = false, sum = el("div", "sum"), tot = el("span");
  function chip(local, en, onChange) {
    var b = el("button", "chip"); b.appendChild(document.createTextNode(local)); b.appendChild(el("small", null, en));
    b.onclick = function () { var on = !b.classList.contains("on"); b.classList.toggle("on", on); onChange(on); };
    return b;
  }
  function render() {
    sum.textContent = "";
    var total = 0, priced = true;
    O.forEach(function (it, i) {
      var s = state[i], line = s.q + " " + nm(it).toLowerCase() + (s.on.length ? " (" + s.on.join(", ").toLowerCase() + ")" : "");
      sum.appendChild(el("div", null, line));
      if (typeof it.p === "number") total += it.p * s.q; else priced = false;
    });
    if (away) sum.appendChild(el("div", null, P.away[0]));
    tot.textContent = priced && total ? " · Total about " + money(total) : "";
  }
  O.forEach(function (it, i) {
    var row = el("div", "row"), ln = el("div", "ln");
    var minus = el("button", "st", "−"), q = el("span", "q", "1"), plus = el("button", "st", "+");
    minus.setAttribute("aria-label", "Less"); plus.setAttribute("aria-label", "More");
    minus.onclick = function () { if (state[i].q > 1) { state[i].q--; q.textContent = state[i].q; render(); } };
    plus.onclick = function () { state[i].q++; q.textContent = state[i].q; render(); };
    var box2 = el("div", "nm"); box2.appendChild(el("div", "vi", nm(it)));
    box2.appendChild(el("div", "sm", [it.n != null ? "No. " + it.n : "", it.en, typeof it.p === "number" ? money(it.p) : ""].filter(Boolean).join(" · ")));
    ln.appendChild(minus); ln.appendChild(q); ln.appendChild(plus); ln.appendChild(box2); row.appendChild(ln);
    var chips = el("div", "chips");
    (P[it.k] || []).forEach(function (c) {
      chips.appendChild(chip(c[0], c[1], function (on) {
        var a = state[i].on; if (on) a.push(c[0]); else state[i].on = a.filter(function (x) { return x !== c[0]; }); render();
      }));
    });
    row.appendChild(chips); box.appendChild(row);
  });
  var foot = el("div", "row"), ac = el("div", "chips");
  ac.appendChild(chip(P.away[0], P.away[1], function (on) { away = on; render(); }));
  foot.appendChild(ac); foot.appendChild(sum);
  foot.appendChild(el("div", "big", P.ty));
  var ty = el("div", "sm", "Thank you"); ty.appendChild(tot); foot.appendChild(ty);
  box.appendChild(foot); app.appendChild(box); render();
})();
