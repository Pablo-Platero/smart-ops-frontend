import { useMemo, useState } from "react";
import Card from "../components/ui/Card";

const CATEGORIES = ["Todos", "Ventas", "Compras", "Nómina", "Servicios", "Impuestos"];
const STATUS = ["Todos", "Pendiente", "Aprobado", "Pagado"];

const TX = [
  { id: "TX-1001", date: "2026-01-03", desc: "Venta - Cliente ABC", category: "Ventas", status: "Pagado", amount: 2450.0 },
  { id: "TX-1002", date: "2026-01-05", desc: "Compra - Materia prima", category: "Compras", status: "Pagado", amount: -980.5 },
  { id: "TX-1003", date: "2026-01-10", desc: "Servicio - Internet planta", category: "Servicios", status: "Aprobado", amount: -120.0 },
  { id: "TX-1004", date: "2026-01-12", desc: "Nómina quincena", category: "Nómina", status: "Pendiente", amount: -3400.0 },
  { id: "TX-1005", date: "2026-01-18", desc: "Impuestos IVA", category: "Impuestos", status: "Pendiente", amount: -760.0 },
  { id: "TX-1006", date: "2026-01-22", desc: "Venta - Cliente Upala", category: "Ventas", status: "Aprobado", amount: 1500.0 },
];

function formatMoney(n) {
  const sign = n < 0 ? "-" : "";
  const abs = Math.abs(n);
  return `${sign}$${abs.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function badgeClass(status) {
  if (status === "Pagado") return "bg-green-500/15 text-green-300 border-green-500/20";
  if (status === "Aprobado") return "bg-blue-500/15 text-blue-300 border-blue-500/20";
  return "bg-yellow-500/15 text-yellow-300 border-yellow-500/20";
}

function Stat({ label, value, note }) {
  return (
    <Card className="p-4">
      <div className="text-sm text-white/60">{label}</div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
      <div className="mt-2 text-xs text-white/50">{note}</div>
    </Card>
  );
}

export default function FinancePage() {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("Todos");
  const [status, setStatus] = useState("Todos");
  const [from, setFrom] = useState("2026-01-01");
  const [to, setTo] = useState("2026-01-31");

  const filtered = useMemo(() => {
    return TX.filter((t) => {
      const byQ =
        t.id.toLowerCase().includes(q.toLowerCase()) ||
        t.desc.toLowerCase().includes(q.toLowerCase());

      const byCategory = category === "Todos" || t.category === category;
      const byStatus = status === "Todos" || t.status === status;

      const d = new Date(t.date);
      const dFrom = new Date(from);
      const dTo = new Date(to);
      const byDate = d >= dFrom && d <= dTo;

      return byQ && byCategory && byStatus && byDate;
    }).sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [q, category, status, from, to]);

  const kpis = useMemo(() => {
    const income = filtered.filter((t) => t.amount > 0).reduce((acc, t) => acc + t.amount, 0);
    const expense = filtered.filter((t) => t.amount < 0).reduce((acc, t) => acc + t.amount, 0);
    const balance = income + expense;
    const pending = filtered.filter((t) => t.status === "Pendiente").length;
    return { income, expense, balance, pending };
  }, [filtered]);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="p-4">
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-6">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por ID o descripción…"
            className="lg:col-span-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm outline-none placeholder:text-white/40"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c} className="bg-[#0B1220]">
                {c}
              </option>
            ))}
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none"
          >
            {STATUS.map((s) => (
              <option key={s} value={s} className="bg-[#0B1220]">
                {s}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none"
          />
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none"
          />
        </div>
      </Card>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Stat label="Ingresos" value={formatMoney(kpis.income)} note="En el rango seleccionado" />
        <Stat label="Gastos" value={formatMoney(kpis.expense)} note="En el rango seleccionado" />
        <Stat label="Balance" value={formatMoney(kpis.balance)} note="Ingresos + gastos" />
        <Stat label="Pendientes" value={`${kpis.pending}`} note="Transacciones por pagar/aprobar" />
      </div>

      {/* Table */}
      <Card className="p-0 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <div>
            <div className="text-sm text-white/60">Movimientos</div>
            <div className="text-lg font-semibold">Transacciones</div>
          </div>
          <button className="rounded-xl bg-white/10 px-4 py-2 text-sm hover:bg-white/15">
            + Nueva transacción
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-white/60">
              <tr className="border-b border-white/10">
                <th className="px-4 py-3 text-left font-medium">ID</th>
                <th className="px-4 py-3 text-left font-medium">Fecha</th>
                <th className="px-4 py-3 text-left font-medium">Descripción</th>
                <th className="px-4 py-3 text-left font-medium">Categoría</th>
                <th className="px-4 py-3 text-left font-medium">Estado</th>
                <th className="px-4 py-3 text-right font-medium">Monto</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((t) => (
                <tr key={t.id} className="border-b border-white/10 hover:bg-white/5">
                  <td className="px-4 py-3 text-white/90">{t.id}</td>
                  <td className="px-4 py-3 text-white/80">{t.date}</td>
                  <td className="px-4 py-3 text-white/90">{t.desc}</td>
                  <td className="px-4 py-3 text-white/80">{t.category}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs ${badgeClass(t.status)}`}>
                      {t.status}
                    </span>
                  </td>
                  <td className={`px-4 py-3 text-right font-semibold ${t.amount < 0 ? "text-red-300" : "text-green-300"}`}>
                    {formatMoney(t.amount)}
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td className="px-4 py-10 text-center text-white/50" colSpan={6}>
                    No hay transacciones con esos filtros
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
