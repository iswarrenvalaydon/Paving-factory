import { useState, useEffect, useRef } from "react";

const BLUE = "#1B4F8A";
const LIGHT_BLUE = "#E8EFF8";
const GREEN = "#1A7A3C";
const LIGHT_GREEN = "#E8F5ED";
const RED = "#C0392B";
const LIGHT_RED = "#FDECEA";
const ORANGE = "#E67E22";
const LIGHT_ORANGE = "#FEF5E7";
const DARK_GREY = "#333333";
const MID_GREY = "#666666";

const LOGO_URL = "https://raw.githubusercontent.com/iswarrenvalaydon/paving-mauritius-suite/main/paving-logo.png";

// ── Raw Material Thresholds (tons) ──
const RM_ALERTS = {
  OPC: 3,
  RS04: 10,
  AGG38: 5,
  PCE: 1,
  BFBL: 0.1,
  BFRD: 0.1,
  BFTC: 0.1,
  BFYL: 0.1,
  BFBN: 0.1,
  BFWH: 0.1,
  FIBR: 0.05,
};

const RM_NAMES = {
  OPC: "Cement 42.5",
  RS04: "Rock Sand 0.4",
  AGG38: "Aggregate 3.8",
  PCE: "Pocket Cement",
  BFBL: "Bayferrous Black",
  BFRD: "Bayferrous Red",
  BFTC: "Bayferrous Terracota",
  BFYL: "Bayferrous Yellow",
  BFBN: "Bayferrous Brown",
  BFWH: "Bayferrous White",
  FIBR: "Reinforcement Fibre",
};

const RM_PRICES = {
  OPC: 5.04, RS04: 0.76, AGG38: 0.56, PCE: 5.80,
  BFBL: 115, BFRD: 115, BFTC: 115, BFYL: 115,
  BFBN: 115, BFWH: 230, FIBR: 417,
};

// ── Products ──
const PRODUCTS = [
  { code: "PB60LG", name: "Paving Brick 60mm Light Grey", priceEx: 9.57, priceInc: 11.01, rm: { OPC: 0.47, RS04: 1.91, AGG38: 1.04 } },
  { code: "PB60RD", name: "Paving Brick 60mm Red", priceEx: 10.57, priceInc: 12.16, rm: { OPC: 0.47, RS04: 1.91, AGG38: 1.04, BFRD: 0.015 } },
  { code: "PB60TC", name: "Paving Brick 60mm Terracota", priceEx: 10.57, priceInc: 12.16, rm: { OPC: 0.47, RS04: 1.91, AGG38: 1.04, BFTC: 0.015 } },
  { code: "PB60DG", name: "Paving Brick 60mm Dark Grey", priceEx: 10.57, priceInc: 12.16, rm: { OPC: 0.47, RS04: 1.91, AGG38: 1.04, BFBL: 0.3125 } },
  { code: "PB60BN", name: "Paving Brick 60mm Brown", priceEx: 10.57, priceInc: 12.16, rm: { OPC: 0.47, RS04: 1.91, AGG38: 1.04, BFBN: 0.015 } },
  { code: "PB100LG", name: "Paving Brick 100mm Light Grey", priceEx: 13.30, priceInc: 15.30, rm: { OPC: 0.75, RS04: 3.09, AGG38: 1.69 } },
  { code: "PB100RD", name: "Paving Brick 100mm Red", priceEx: 14.30, priceInc: 16.45, rm: { OPC: 0.75, RS04: 3.09, AGG38: 1.69, BFRD: 0.015 } },
  { code: "PB100TC", name: "Paving Brick 100mm Terracota", priceEx: 14.30, priceInc: 16.45, rm: { OPC: 0.75, RS04: 3.09, AGG38: 1.69, BFTC: 0.015 } },
  { code: "PB100DG", name: "Paving Brick 100mm Dark Grey", priceEx: 14.30, priceInc: 16.45, rm: { OPC: 0.75, RS04: 3.09, AGG38: 1.69, BFBL: 0.3125 } },
  { code: "PB100BN", name: "Paving Brick 100mm Brown", priceEx: 14.30, priceInc: 16.45, rm: { OPC: 0.75, RS04: 3.09, AGG38: 1.69, BFBN: 0.015 } },
  { code: "PB100LGR", name: "Paving Brick 100mm Light Grey Reject", priceEx: 10.00, priceInc: 11.50, rm: { OPC: 0.75, RS04: 3.09, AGG38: 1.69 } },
  { code: "PS60LG", name: "Slab 450x450x60 Light Grey", priceEx: 152.17, priceInc: 175.00, rm: { OPC: 4.72, RS04: 19.31, AGG38: 10.60 } },
  { code: "PS60RD", name: "Slab 450x450x60 Red", priceEx: 172.17, priceInc: 198.00, rm: { OPC: 4.72, RS04: 19.31, AGG38: 10.60, BFRD: 0.015 } },
  { code: "PS60TC", name: "Slab 450x450x60 Terracota", priceEx: 172.17, priceInc: 198.00, rm: { OPC: 4.72, RS04: 19.31, AGG38: 10.60, BFTC: 0.015 } },
  { code: "PS60DG", name: "Slab 450x450x60 Dark Grey", priceEx: 172.17, priceInc: 198.00, rm: { OPC: 4.72, RS04: 19.31, AGG38: 10.60, BFBL: 0.3125 } },
  { code: "PS60BN", name: "Slab 450x450x60 Brown", priceEx: 172.17, priceInc: 198.00, rm: { OPC: 4.72, RS04: 19.31, AGG38: 10.60, BFBN: 0.015 } },
  { code: "PS60LGR", name: "Slab 450x450x60 Light Grey Reject", priceEx: 60.00, priceInc: 69.00, rm: { OPC: 4.72, RS04: 19.31, AGG38: 10.60 } },
  { code: "PS80LG", name: "Slab 600x600x80 Light Grey", priceEx: 247.82, priceInc: 284.99, rm: { OPC: 10.90, RS04: 44.55, AGG38: 24.36 } },
  { code: "PS80RD", name: "Slab 600x600x80 Red", priceEx: 283.82, priceInc: 326.39, rm: { OPC: 10.90, RS04: 44.55, AGG38: 24.36, BFRD: 0.015 } },
  { code: "PS80TC", name: "Slab 600x600x80 Terracota", priceEx: 283.82, priceInc: 326.39, rm: { OPC: 10.90, RS04: 44.55, AGG38: 24.36, BFTC: 0.015 } },
  { code: "PS80DG", name: "Slab 600x600x80 Dark Grey", priceEx: 283.82, priceInc: 326.39, rm: { OPC: 10.90, RS04: 44.55, AGG38: 24.36, BFBL: 0.3125 } },
  { code: "PS80BN", name: "Slab 600x600x80 Brown", priceEx: 283.82, priceInc: 326.39, rm: { OPC: 10.90, RS04: 44.55, AGG38: 24.36, BFBN: 0.015 } },
  { code: "CB60LG", name: "Cobble Brick 60mm Light Grey", priceEx: 8.50, priceInc: 9.78, rm: { OPC: 0.44, RS04: 1.82, AGG38: 0.99 } },
  { code: "CB60RD", name: "Cobble Brick 60mm Red", priceEx: 9.50, priceInc: 10.93, rm: { OPC: 0.44, RS04: 1.82, AGG38: 0.99, BFRD: 0.015 } },
  { code: "CB60TC", name: "Cobble Brick 60mm Terracota", priceEx: 9.50, priceInc: 10.93, rm: { OPC: 0.44, RS04: 1.82, AGG38: 0.99, BFTC: 0.015 } },
  { code: "CB60DG", name: "Cobble Brick 60mm Dark Grey", priceEx: 9.50, priceInc: 10.93, rm: { OPC: 0.44, RS04: 1.82, AGG38: 0.99, BFBL: 0.3125 } },
  { code: "CB60BN", name: "Cobble Brick 60mm Brown", priceEx: 9.50, priceInc: 10.93, rm: { OPC: 0.44, RS04: 1.82, AGG38: 0.99, BFBN: 0.015 } },
  { code: "EV120", name: "Evergreen 400x400x120 Light Grey", priceEx: 81.00, priceInc: 93.15, rm: { OPC: 4.72, RS04: 19.31, AGG38: 10.60 } },
  { code: "EV120R", name: "Evergreen 400x400x120 Reject", priceEx: 60.00, priceInc: 69.00, rm: { OPC: 4.72, RS04: 19.31, AGG38: 10.60 } },
];

const EXPENSE_CATS = [
  { code: "RML", name: "Raw Material" },
  { code: "UTL", name: "Utilities" },
  { code: "EMPL", name: "Employees" },
  { code: "MORT", name: "Mortgage" },
  { code: "LOA", name: "Loan" },
  { code: "MISC", name: "Miscellaneous" },
  { code: "PAL", name: "Palettes" },
  { code: "RPC", name: "Repair Cost" },
  { code: "MAC", name: "Maintenance" },
  { code: "UPG", name: "Upgrading" },
  { code: "ADM", name: "Administrative" },
];

const INCOME_CATS = [
  { code: "SLI", name: "Sales Income" },
  { code: "CNI", name: "Contracting Income" },
  { code: "TAI", name: "Transportation Income" },
  { code: "OTI", name: "Other Income" },
];

function fmt(n) { return Number(n || 0).toLocaleString("en-MU", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
function today() { return new Date().toISOString().split("T")[0]; }
function fmtDate(d) { if (!d) return ""; const [y, m, day] = d.split("-"); return `${day}/${m}/${y}`; }

// ── Initial RM Stock (kg) ──
const INIT_RM = () => Object.fromEntries(Object.keys(RM_NAMES).map(k => [k, 0]));
const INIT_STOCK = () => Object.fromEntries(PRODUCTS.map(p => [p.code, 0]));

export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [notification, setNotification] = useState(null);

  // ── Persisted State ──
  const [openingStock, setOpeningStock] = useState({});
  const [productionLog, setProductionLog] = useState([]);
  const [salesLog, setSalesLog] = useState([]);
  const [rmStock, setRmStock] = useState({});
  const [rmPurchases, setRmPurchases] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);

  // ── Load from storage ──
  useEffect(() => {
    async function load() {
      try {
        const keys = ["openingStock", "productionLog", "salesLog", "rmStock", "rmPurchases", "expenses", "incomes"];
        for (const key of keys) {
          try {
            const r = await window.storage.get(key);
            if (r) {
              const val = JSON.parse(r.value);
              if (key === "openingStock") setOpeningStock(val);
              else if (key === "productionLog") setProductionLog(val);
              else if (key === "salesLog") setSalesLog(val);
              else if (key === "rmStock") setRmStock(val);
              else if (key === "rmPurchases") setRmPurchases(val);
              else if (key === "expenses") setExpenses(val);
              else if (key === "incomes") setIncomes(val);
            }
          } catch {}
        }
      } catch {}
    }
    load();
  }, []);

  async function save(key, val) {
    try { await window.storage.set(key, JSON.stringify(val)); } catch {}
  }

  function notify(msg, type = "success") {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3500);
  }

  // ── Computed Stock ──
  function getCurrentStock() {
    const stock = { ...INIT_STOCK(), ...openingStock };
    for (const e of productionLog) stock[e.code] = (stock[e.code] || 0) + Number(e.qty);
    for (const e of salesLog) stock[e.code] = (stock[e.code] || 0) - Number(e.qty);
    return stock;
  }

  function getCurrentRM() {
    const rm = { ...INIT_RM(), ...rmStock };
    // Deduct RM used in production
    for (const e of productionLog) {
      const prod = PRODUCTS.find(p => p.code === e.code);
      if (!prod) continue;
      for (const [rmCode, kgPerUnit] of Object.entries(prod.rm)) {
        rm[rmCode] = (rm[rmCode] || 0) - (kgPerUnit * Number(e.qty)) / 1000; // convert g to kg to tons? No — keep in kg
      }
    }
    return rm;
  }

  const currentStock = getCurrentStock();
  const currentRM = getCurrentRM();

  // ── RM Alerts ──
  const rmAlerts = Object.keys(RM_NAMES).filter(k => {
    const kgStock = currentRM[k] || 0;
    const tonStock = kgStock / 1000;
    return tonStock < (RM_ALERTS[k] || 0);
  });

  // ── Financials ──
  const totalExpenses = expenses.reduce((s, e) => s + Number(e.amount), 0);
  const totalIncome = incomes.reduce((s, e) => s + Number(e.amount), 0);
  const totalSalesValue = salesLog.reduce((s, e) => {
    const prod = PRODUCTS.find(p => p.code === e.code);
    return s + (prod ? prod.priceEx * Number(e.qty) : 0);
  }, 0);
  const totalStockValue = PRODUCTS.reduce((s, p) => s + (currentStock[p.code] || 0) * p.priceEx, 0);

  // ── Forms ──
  const [prodForm, setProdForm] = useState({ date: today(), code: "", qty: "" });
  const [saleForm, setSaleForm] = useState({ date: today(), code: "", qty: "" });
  const [rmForm, setRmForm] = useState({ date: today(), code: "OPC", qty: "", unit: "ton" });
  const [expForm, setExpForm] = useState({ date: today(), code: "EMPL", desc: "", amount: "" });
  const [incForm, setIncForm] = useState({ date: today(), code: "SLI", desc: "", amount: "" });
  const [openingForm, setOpeningForm] = useState({ code: "", qty: "" });
  const [rmOpeningForm, setRmOpeningForm] = useState({ code: "OPC", qty: "", unit: "ton" });

  function addProduction() {
    if (!prodForm.code || !prodForm.qty) { notify("Fill all fields", "error"); return; }
    const newLog = [...productionLog, { ...prodForm, id: Date.now() }];
    setProductionLog(newLog); save("productionLog", newLog);
    // Deduct RM
    const prod = PRODUCTS.find(p => p.code === prodForm.code);
    if (prod) {
      const newRM = { ...INIT_RM(), ...rmStock };
      for (const [rmCode, kgPerUnit] of Object.entries(prod.rm)) {
        newRM[rmCode] = (newRM[rmCode] || 0) - (kgPerUnit * Number(prodForm.qty));
      }
      setRmStock(newRM); save("rmStock", newRM);
    }
    setProdForm({ date: today(), code: "", qty: "" });
    notify(`✅ Production recorded!`);
  }

  function addSale() {
    if (!saleForm.code || !saleForm.qty) { notify("Fill all fields", "error"); return; }
    if (Number(saleForm.qty) > (currentStock[saleForm.code] || 0)) { notify("❌ Not enough stock!", "error"); return; }
    const newLog = [...salesLog, { ...saleForm, id: Date.now() }];
    setSalesLog(newLog); save("salesLog", newLog);
    setSaleForm({ date: today(), code: "", qty: "" });
    notify(`✅ Sale recorded!`);
  }

  function addRMPurchase() {
    if (!rmForm.qty) { notify("Enter quantity", "error"); return; }
    const kgQty = rmForm.unit === "ton" ? Number(rmForm.qty) * 1000 : Number(rmForm.qty);
    const newRM = { ...INIT_RM(), ...rmStock };
    newRM[rmForm.code] = (newRM[rmForm.code] || 0) + kgQty;
    setRmStock(newRM); save("rmStock", newRM);
    const newPurchases = [...rmPurchases, { ...rmForm, qty: kgQty, id: Date.now() }];
    setRmPurchases(newPurchases); save("rmPurchases", newPurchases);
    setRmForm({ date: today(), code: "OPC", qty: "", unit: "ton" });
    notify(`✅ RM purchase recorded!`);
  }

  function addExpense() {
    if (!expForm.amount) { notify("Enter amount", "error"); return; }
    const newExp = [...expenses, { ...expForm, id: Date.now() }];
    setExpenses(newExp); save("expenses", newExp);
    setExpForm({ date: today(), code: "EMPL", desc: "", amount: "" });
    notify(`✅ Expense recorded!`);
  }

  function addIncome() {
    if (!incForm.amount) { notify("Enter amount", "error"); return; }
    const newInc = [...incomes, { ...incForm, id: Date.now() }];
    setIncomes(newInc); save("incomes", newInc);
    setIncForm({ date: today(), code: "SLI", desc: "", amount: "" });
    notify(`✅ Income recorded!`);
  }

  function setOpening() {
    if (!openingForm.code || !openingForm.qty) { notify("Fill all fields", "error"); return; }
    const newOS = { ...openingStock, [openingForm.code]: Number(openingForm.qty) };
    setOpeningStock(newOS); save("openingStock", newOS);
    setOpeningForm({ code: "", qty: "" });
    notify(`✅ Opening stock set!`);
  }

  function setRMOpening() {
    if (!rmOpeningForm.qty) { notify("Enter quantity", "error"); return; }
    const kgQty = rmOpeningForm.unit === "ton" ? Number(rmOpeningForm.qty) * 1000 : Number(rmOpeningForm.qty);
    const newRM = { ...INIT_RM(), ...rmStock, [rmOpeningForm.code]: kgQty };
    setRmStock(newRM); save("rmStock", newRM);
    setRmOpeningForm({ code: "OPC", qty: "", unit: "ton" });
    notify(`✅ RM opening stock set!`);
  }

  const sel = (val, onChange, options, style = {}) => (
    <select value={val} onChange={e => onChange(e.target.value)}
      style={{ border: "1px solid #ddd", borderRadius: 6, padding: "7px 10px", fontSize: 13, background: "#fff", ...style }}>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );

  const inp = (val, onChange, placeholder, type = "text", style = {}) => (
    <input type={type} value={val} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      style={{ border: "1px solid #ddd", borderRadius: 6, padding: "7px 10px", fontSize: 13, ...style }} />
  );

  const card = (children, style = {}) => (
    <div style={{ background: "#fff", borderRadius: 12, padding: 18, boxShadow: "0 2px 8px #0001", marginBottom: 16, ...style }}>
      {children}
    </div>
  );

  const sectionTitle = (icon, title) => (
    <div style={{ fontWeight: 700, color: BLUE, fontSize: 15, marginBottom: 14 }}>{icon} {title}</div>
  );

  const statCard = (label, value, color = BLUE, bg = LIGHT_BLUE, icon = "") => (
    <div style={{ background: bg, borderRadius: 10, padding: "12px 16px", flex: 1, minWidth: 140 }}>
      <div style={{ fontSize: 11, color: MID_GREY, fontWeight: 600 }}>{icon} {label}</div>
      <div style={{ fontSize: 18, fontWeight: 700, color, marginTop: 4 }}>{value}</div>
    </div>
  );

  const tabs = [
    ["dashboard", "📊 Dashboard"],
    ["production", "🏭 Production"],
    ["sales", "💰 Sales"],
    ["stock", "📦 Stock"],
    ["rawmat", "🧱 Raw Materials"],
    ["finance", "📋 Finance"],
  ];

  return (
    <div style={{ fontFamily: "Segoe UI, Arial, sans-serif", background: "#F0F4FA", minHeight: "100vh" }}>

      {/* Notification */}
      {notification && (
        <div style={{ position: "fixed", top: 16, right: 16, zIndex: 999, background: notification.type === "error" ? RED : GREEN, color: "#fff", padding: "12px 20px", borderRadius: 10, fontWeight: 600, fontSize: 14, boxShadow: "0 4px 16px #0003" }}>
          {notification.msg}
        </div>
      )}

      {/* Header */}
      <div style={{ background: BLUE, color: "#fff", padding: "0 16px", display: "flex", alignItems: "center", gap: 12, height: 56 }}>
        <img src={LOGO_URL} alt="logo" style={{ height: 38, objectFit: "contain" }} />
        <div>
          <div style={{ fontWeight: 700, fontSize: 15 }}>Paving Mauritius — Factory</div>
          <div style={{ fontSize: 10, opacity: 0.75 }}>Stock · Production · Finance</div>
        </div>
        {rmAlerts.length > 0 && (
          <div style={{ marginLeft: "auto", background: RED, borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 700 }}>
            ⚠️ {rmAlerts.length} Low Stock Alert{rmAlerts.length > 1 ? "s" : ""}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div style={{ background: "#fff", borderBottom: `3px solid ${BLUE}`, display: "flex", overflowX: "auto", gap: 0 }}>
        {tabs.map(([t, label]) => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: "10px 14px", border: "none", cursor: "pointer", fontWeight: 600, fontSize: 12,
            background: tab === t ? BLUE : "transparent", color: tab === t ? "#fff" : BLUE, whiteSpace: "nowrap"
          }}>{label}</button>
        ))}
      </div>

      <div style={{ maxWidth: 860, margin: "16px auto", padding: "0 12px", paddingBottom: 40 }}>

        {/* ══ DASHBOARD ══ */}
        {tab === "dashboard" && (<>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
            {statCard("Total Stock Value", `Rs ${fmt(totalStockValue)}`, BLUE, LIGHT_BLUE, "📦")}
            {statCard("Total Sales (excl VAT)", `Rs ${fmt(totalSalesValue)}`, GREEN, LIGHT_GREEN, "💰")}
            {statCard("Total Expenses", `Rs ${fmt(totalExpenses)}`, RED, LIGHT_RED, "📋")}
            {statCard("Net P&L", `Rs ${fmt(totalSalesValue + totalIncome - totalExpenses)}`, totalSalesValue + totalIncome - totalExpenses >= 0 ? GREEN : RED, totalSalesValue + totalIncome - totalExpenses >= 0 ? LIGHT_GREEN : LIGHT_RED, "📈")}
          </div>

          {/* RM Alerts */}
          {rmAlerts.length > 0 && card(
            <>
              {sectionTitle("⚠️", "Raw Material Low Stock Alerts")}
              {rmAlerts.map(k => {
                const kgStock = currentRM[k] || 0;
                const tonStock = (kgStock / 1000).toFixed(2);
                return (
                  <div key={k} style={{ background: LIGHT_RED, border: `1px solid ${RED}`, borderRadius: 8, padding: "8px 12px", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: 600, color: RED }}>{RM_NAMES[k]}</span>
                    <span style={{ fontSize: 13, color: RED }}>
                      {tonStock}t remaining — Min: {RM_ALERTS[k]}t
                    </span>
                  </div>
                );
              })}
            </>
          )}

          {/* Top stock products */}
          {card(<>
            {sectionTitle("📦", "Current Finished Stock (Top 10)")}
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ background: BLUE, color: "#fff" }}>
                    {["Product", "Stock", "Value (Rs)"].map(h => <th key={h} style={{ padding: "7px 10px", textAlign: "left" }}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {PRODUCTS.filter(p => (currentStock[p.code] || 0) > 0)
                    .sort((a, b) => (currentStock[b.code] || 0) - (currentStock[a.code] || 0))
                    .slice(0, 10)
                    .map((p, i) => (
                      <tr key={p.code} style={{ background: i % 2 === 0 ? LIGHT_BLUE : "#fff" }}>
                        <td style={{ padding: "6px 10px" }}>{p.name}</td>
                        <td style={{ padding: "6px 10px", fontWeight: 600 }}>{(currentStock[p.code] || 0).toLocaleString()}</td>
                        <td style={{ padding: "6px 10px", color: BLUE, fontWeight: 600 }}>Rs {fmt((currentStock[p.code] || 0) * p.priceEx)}</td>
                      </tr>
                    ))}
                  {PRODUCTS.filter(p => (currentStock[p.code] || 0) > 0).length === 0 && (
                    <tr><td colSpan={3} style={{ padding: 16, color: MID_GREY, textAlign: "center" }}>No stock yet — add opening stock or record production</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </>)}

          {/* Recent activity */}
          {card(<>
            {sectionTitle("🕐", "Recent Activity")}
            {[...productionLog.map(e => ({ ...e, type: "prod" })), ...salesLog.map(e => ({ ...e, type: "sale" })), ...expenses.map(e => ({ ...e, type: "exp" })), ...incomes.map(e => ({ ...e, type: "inc" }))]
              .sort((a, b) => b.id - a.id).slice(0, 8).map((e, i) => {
                const prod = PRODUCTS.find(p => p.code === e.code);
                const expCat = EXPENSE_CATS.find(c => c.code === e.code);
                const incCat = INCOME_CATS.find(c => c.code === e.code);
                let label = "", color = DARK_GREY, icon = "";
                if (e.type === "prod") { label = `Production: ${prod?.name || e.code} — ${Number(e.qty).toLocaleString()} units`; color = BLUE; icon = "🏭"; }
                else if (e.type === "sale") { label = `Sale: ${prod?.name || e.code} — ${Number(e.qty).toLocaleString()} units`; color = GREEN; icon = "💰"; }
                else if (e.type === "exp") { label = `Expense: ${expCat?.name || e.code} — Rs ${fmt(e.amount)} ${e.desc ? `(${e.desc})` : ""}`; color = RED; icon = "📋"; }
                else { label = `Income: ${incCat?.name || e.code} — Rs ${fmt(e.amount)}`; color = GREEN; icon = "💵"; }
                return (
                  <div key={e.id} style={{ padding: "8px 0", borderBottom: "1px solid #eee", fontSize: 13, color, display: "flex", gap: 8 }}>
                    <span>{icon}</span>
                    <span>{fmtDate(e.date)} — {label}</span>
                  </div>
                );
              })}
            {productionLog.length + salesLog.length + expenses.length + incomes.length === 0 && (
              <div style={{ color: MID_GREY, fontSize: 13 }}>No activity yet</div>
            )}
          </>)}
        </>)}

        {/* ══ PRODUCTION ══ */}
        {tab === "production" && (<>
          {card(<>
            {sectionTitle("🏭", "Record Production")}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {inp(prodForm.date, v => setProdForm({ ...prodForm, date: v }), "Date", "date")}
              {sel(prodForm.code, v => setProdForm({ ...prodForm, code: v }), [{ value: "", label: "Select product..." }, ...PRODUCTS.map(p => ({ value: p.code, label: p.name }))])}
              {inp(prodForm.qty, v => setProdForm({ ...prodForm, qty: v }), "Quantity produced", "number")}
              {prodForm.code && prodForm.qty && (() => {
                const prod = PRODUCTS.find(p => p.code === prodForm.code);
                if (!prod) return null;
                return (
                  <div style={{ background: LIGHT_BLUE, borderRadius: 8, padding: "10px 14px", fontSize: 12 }}>
                    <div style={{ fontWeight: 600, color: BLUE, marginBottom: 6 }}>RM that will be consumed:</div>
                    {Object.entries(prod.rm).map(([rmCode, kgPerUnit]) => (
                      <div key={rmCode} style={{ color: MID_GREY }}>
                        {RM_NAMES[rmCode]}: {((kgPerUnit * Number(prodForm.qty)) / 1000).toFixed(3)}t
                      </div>
                    ))}
                  </div>
                );
              })()}
              <button onClick={addProduction} style={{ background: BLUE, color: "#fff", border: "none", borderRadius: 8, padding: "10px", cursor: "pointer", fontWeight: 700, fontSize: 14 }}>
                ✅ Record Production
              </button>
            </div>
          </>)}

          {card(<>
            {sectionTitle("📋", "Production Log")}
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr style={{ background: BLUE, color: "#fff" }}>
                    {["Date", "Product", "Qty"].map(h => <th key={h} style={{ padding: "7px 10px", textAlign: "left" }}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {[...productionLog].reverse().slice(0, 20).map((e, i) => (
                    <tr key={e.id} style={{ background: i % 2 === 0 ? LIGHT_BLUE : "#fff" }}>
                      <td style={{ padding: "6px 10px" }}>{fmtDate(e.date)}</td>
                      <td style={{ padding: "6px 10px" }}>{PRODUCTS.find(p => p.code === e.code)?.name || e.code}</td>
                      <td style={{ padding: "6px 10px", fontWeight: 600 }}>{Number(e.qty).toLocaleString()}</td>
                    </tr>
                  ))}
                  {productionLog.length === 0 && <tr><td colSpan={3} style={{ padding: 16, color: MID_GREY, textAlign: "center" }}>No production recorded yet</td></tr>}
                </tbody>
              </table>
            </div>
          </>)}
        </>)}

        {/* ══ SALES ══ */}
        {tab === "sales" && (<>
          {card(<>
            {sectionTitle("💰", "Record Sale")}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {inp(saleForm.date, v => setSaleForm({ ...saleForm, date: v }), "Date", "date")}
              {sel(saleForm.code, v => setSaleForm({ ...saleForm, code: v }), [{ value: "", label: "Select product..." }, ...PRODUCTS.map(p => ({ value: p.code, label: `${p.name} (Stock: ${(currentStock[p.code] || 0).toLocaleString()})` }))])}
              {inp(saleForm.qty, v => setSaleForm({ ...saleForm, qty: v }), "Quantity sold", "number")}
              {saleForm.code && saleForm.qty && (() => {
                const prod = PRODUCTS.find(p => p.code === saleForm.code);
                if (!prod) return null;
                const total = prod.priceInc * Number(saleForm.qty);
                const totalEx = prod.priceEx * Number(saleForm.qty);
                return (
                  <div style={{ background: LIGHT_GREEN, borderRadius: 8, padding: "10px 14px", fontSize: 12 }}>
                    <div style={{ color: MID_GREY }}>Unit price (incl VAT): Rs {fmt(prod.priceInc)}</div>
                    <div style={{ color: GREEN, fontWeight: 700, fontSize: 14, marginTop: 4 }}>Total: Rs {fmt(total)} (excl VAT: Rs {fmt(totalEx)})</div>
                  </div>
                );
              })()}
              <button onClick={addSale} style={{ background: GREEN, color: "#fff", border: "none", borderRadius: 8, padding: "10px", cursor: "pointer", fontWeight: 700, fontSize: 14 }}>
                ✅ Record Sale
              </button>
            </div>
          </>)}

          {card(<>
            {sectionTitle("📋", "Sales Log")}
            <div style={{ background: LIGHT_GREEN, borderRadius: 8, padding: "10px 14px", marginBottom: 12, fontWeight: 700, color: GREEN }}>
              Total Sales Revenue: Rs {fmt(totalSalesValue)} (excl VAT)
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr style={{ background: BLUE, color: "#fff" }}>
                    {["Date", "Product", "Qty", "Value (Rs)"].map(h => <th key={h} style={{ padding: "7px 10px", textAlign: "left" }}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {[...salesLog].reverse().slice(0, 20).map((e, i) => {
                    const prod = PRODUCTS.find(p => p.code === e.code);
                    return (
                      <tr key={e.id} style={{ background: i % 2 === 0 ? LIGHT_BLUE : "#fff" }}>
                        <td style={{ padding: "6px 10px" }}>{fmtDate(e.date)}</td>
                        <td style={{ padding: "6px 10px" }}>{prod?.name || e.code}</td>
                        <td style={{ padding: "6px 10px", fontWeight: 600 }}>{Number(e.qty).toLocaleString()}</td>
                        <td style={{ padding: "6px 10px", color: GREEN, fontWeight: 600 }}>Rs {fmt((prod?.priceEx || 0) * Number(e.qty))}</td>
                      </tr>
                    );
                  })}
                  {salesLog.length === 0 && <tr><td colSpan={4} style={{ padding: 16, color: MID_GREY, textAlign: "center" }}>No sales recorded yet</td></tr>}
                </tbody>
              </table>
            </div>
          </>)}
        </>)}

        {/* ══ STOCK ══ */}
        {tab === "stock" && (<>
          {card(<>
            {sectionTitle("📦", "Set Opening Stock")}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {sel(openingForm.code, v => setOpeningForm({ ...openingForm, code: v }), [{ value: "", label: "Select product..." }, ...PRODUCTS.map(p => ({ value: p.code, label: p.name }))], { flex: 2, minWidth: 200 })}
              {inp(openingForm.qty, v => setOpeningForm({ ...openingForm, qty: v }), "Quantity", "number", { flex: 1, minWidth: 100 })}
              <button onClick={setOpening} style={{ background: BLUE, color: "#fff", border: "none", borderRadius: 8, padding: "7px 16px", cursor: "pointer", fontWeight: 700, fontSize: 13 }}>Set</button>
            </div>
          </>)}

          {card(<>
            {sectionTitle("📦", `Current Stock — Total Value: Rs ${fmt(totalStockValue)}`)}
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr style={{ background: BLUE, color: "#fff" }}>
                    {["Code", "Product", "Opening", "Produced", "Sold", "Current", "Value (Rs)"].map(h => <th key={h} style={{ padding: "7px 8px", textAlign: "left", fontSize: 11 }}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {PRODUCTS.map((p, i) => {
                    const opening = openingStock[p.code] || 0;
                    const produced = productionLog.filter(e => e.code === p.code).reduce((s, e) => s + Number(e.qty), 0);
                    const sold = salesLog.filter(e => e.code === p.code).reduce((s, e) => s + Number(e.qty), 0);
                    const current = currentStock[p.code] || 0;
                    const value = current * p.priceEx;
                    return (
                      <tr key={p.code} style={{ background: i % 2 === 0 ? LIGHT_BLUE : "#fff" }}>
                        <td style={{ padding: "5px 8px", color: MID_GREY, fontSize: 10 }}>{p.code}</td>
                        <td style={{ padding: "5px 8px", fontSize: 11 }}>{p.name}</td>
                        <td style={{ padding: "5px 8px", textAlign: "right" }}>{opening.toLocaleString()}</td>
                        <td style={{ padding: "5px 8px", textAlign: "right", color: BLUE }}>{produced.toLocaleString()}</td>
                        <td style={{ padding: "5px 8px", textAlign: "right", color: RED }}>{sold.toLocaleString()}</td>
                        <td style={{ padding: "5px 8px", textAlign: "right", fontWeight: 700, color: current < 0 ? RED : DARK_GREY }}>{current.toLocaleString()}</td>
                        <td style={{ padding: "5px 8px", textAlign: "right", color: GREEN, fontWeight: 600 }}>Rs {fmt(value)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>)}
        </>)}

        {/* ══ RAW MATERIALS ══ */}
        {tab === "rawmat" && (<>
          {card(<>
            {sectionTitle("🧱", "Set Opening RM Stock")}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {sel(rmOpeningForm.code, v => setRmOpeningForm({ ...rmOpeningForm, code: v }), Object.keys(RM_NAMES).map(k => ({ value: k, label: RM_NAMES[k] })), { flex: 2, minWidth: 180 })}
              {inp(rmOpeningForm.qty, v => setRmOpeningForm({ ...rmOpeningForm, qty: v }), "Quantity", "number", { flex: 1, minWidth: 80 })}
              {sel(rmOpeningForm.unit, v => setRmOpeningForm({ ...rmOpeningForm, unit: v }), [{ value: "ton", label: "Tons" }, { value: "kg", label: "Kg" }], { width: 80 })}
              <button onClick={setRMOpening} style={{ background: BLUE, color: "#fff", border: "none", borderRadius: 8, padding: "7px 16px", cursor: "pointer", fontWeight: 700, fontSize: 13 }}>Set</button>
            </div>
          </>)}

          {card(<>
            {sectionTitle("📥", "Record RM Purchase")}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {inp(rmForm.date, v => setRmForm({ ...rmForm, date: v }), "Date", "date")}
              {sel(rmForm.code, v => setRmForm({ ...rmForm, code: v }), Object.keys(RM_NAMES).map(k => ({ value: k, label: RM_NAMES[k] })), { flex: 2, minWidth: 180 })}
              {inp(rmForm.qty, v => setRmForm({ ...rmForm, qty: v }), "Quantity", "number", { flex: 1, minWidth: 80 })}
              {sel(rmForm.unit, v => setRmForm({ ...rmForm, unit: v }), [{ value: "ton", label: "Tons" }, { value: "kg", label: "Kg" }], { width: 80 })}
              <button onClick={addRMPurchase} style={{ background: GREEN, color: "#fff", border: "none", borderRadius: 8, padding: "7px 16px", cursor: "pointer", fontWeight: 700, fontSize: 13 }}>✅ Add</button>
            </div>
          </>)}

          {card(<>
            {sectionTitle("🧱", "Current Raw Material Stock")}
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr style={{ background: BLUE, color: "#fff" }}>
                    {["Raw Material", "Stock (kg)", "Stock (tons)", "Min Alert", "Status"].map(h => <th key={h} style={{ padding: "7px 10px", textAlign: "left" }}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(RM_NAMES).map((k, i) => {
                    const kgStock = currentRM[k] || 0;
                    const tonStock = kgStock / 1000;
                    const isLow = tonStock < (RM_ALERTS[k] || 0);
                    return (
                      <tr key={k} style={{ background: isLow ? LIGHT_RED : i % 2 === 0 ? LIGHT_BLUE : "#fff" }}>
                        <td style={{ padding: "6px 10px", fontWeight: 600 }}>{RM_NAMES[k]}</td>
                        <td style={{ padding: "6px 10px" }}>{kgStock.toFixed(1)}</td>
                        <td style={{ padding: "6px 10px" }}>{tonStock.toFixed(3)}</td>
                        <td style={{ padding: "6px 10px", color: MID_GREY }}>{RM_ALERTS[k]}t</td>
                        <td style={{ padding: "6px 10px", fontWeight: 700, color: isLow ? RED : GREEN }}>
                          {isLow ? "⚠️ LOW" : "✅ OK"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>)}
        </>)}

        {/* ══ FINANCE ══ */}
        {tab === "finance" && (<>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
            {statCard("Total Income", `Rs ${fmt(totalIncome + totalSalesValue)}`, GREEN, LIGHT_GREEN, "💵")}
            {statCard("Total Expenses", `Rs ${fmt(totalExpenses)}`, RED, LIGHT_RED, "📋")}
            {statCard("Net P&L", `Rs ${fmt(totalSalesValue + totalIncome - totalExpenses)}`, totalSalesValue + totalIncome - totalExpenses >= 0 ? GREEN : RED, totalSalesValue + totalIncome - totalExpenses >= 0 ? LIGHT_GREEN : LIGHT_RED, "📈")}
          </div>

          {card(<>
            {sectionTitle("📋", "Record Expense")}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {inp(expForm.date, v => setExpForm({ ...expForm, date: v }), "Date", "date")}
              {sel(expForm.code, v => setExpForm({ ...expForm, code: v }), EXPENSE_CATS.map(c => ({ value: c.code, label: c.name })))}
              {inp(expForm.desc, v => setExpForm({ ...expForm, desc: v }), "Description (optional)")}
              {inp(expForm.amount, v => setExpForm({ ...expForm, amount: v }), "Amount (Rs)", "number")}
              <button onClick={addExpense} style={{ background: RED, color: "#fff", border: "none", borderRadius: 8, padding: "10px", cursor: "pointer", fontWeight: 700, fontSize: 14 }}>
                ✅ Record Expense
              </button>
            </div>
          </>)}

          {card(<>
            {sectionTitle("💵", "Record Other Income")}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {inp(incForm.date, v => setIncForm({ ...incForm, date: v }), "Date", "date")}
              {sel(incForm.code, v => setIncForm({ ...incForm, code: v }), INCOME_CATS.map(c => ({ value: c.code, label: c.name })))}
              {inp(incForm.desc, v => setIncForm({ ...incForm, desc: v }), "Description (optional)")}
              {inp(incForm.amount, v => setIncForm({ ...incForm, amount: v }), "Amount (Rs)", "number")}
              <button onClick={addIncome} style={{ background: GREEN, color: "#fff", border: "none", borderRadius: 8, padding: "10px", cursor: "pointer", fontWeight: 700, fontSize: 14 }}>
                ✅ Record Income
              </button>
            </div>
          </>)}

          {card(<>
            {sectionTitle("📋", "Expense Log")}
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr style={{ background: BLUE, color: "#fff" }}>
                    {["Date", "Category", "Description", "Amount (Rs)"].map(h => <th key={h} style={{ padding: "7px 10px", textAlign: "left" }}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {[...expenses].reverse().slice(0, 20).map((e, i) => (
                    <tr key={e.id} style={{ background: i % 2 === 0 ? LIGHT_BLUE : "#fff" }}>
                      <td style={{ padding: "6px 10px" }}>{fmtDate(e.date)}</td>
                      <td style={{ padding: "6px 10px" }}>{EXPENSE_CATS.find(c => c.code === e.code)?.name || e.code}</td>
                      <td style={{ padding: "6px 10px", color: MID_GREY }}>{e.desc}</td>
                      <td style={{ padding: "6px 10px", color: RED, fontWeight: 600 }}>Rs {fmt(e.amount)}</td>
                    </tr>
                  ))}
                  {expenses.length === 0 && <tr><td colSpan={4} style={{ padding: 16, color: MID_GREY, textAlign: "center" }}>No expenses recorded yet</td></tr>}
                </tbody>
              </table>
            </div>
          </>)}
        </>)}

      </div>
    </div>
  );
}
