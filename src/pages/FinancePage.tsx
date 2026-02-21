import React, { useMemo, useState } from "react";
import Card from "../components/ui/Card";

type Category =
  | "Ventas"
  | "Compras"
  | "Nómina"
  | "Servicios"
  | "Impuestos";

type Status = "Pendiente" | "Aprobado" | "Pagado";

type Transaction = {
  id: string;
  date: string;
  desc: string;
  category: Category;
  status: Status;
  amount: number;
};

const CATEGORIES: Array<"Todos" | Category> = [
  "Todos",
  "Ventas",
  "Compras",
  "Nómina",
  "Servicios",
  "Impuestos",
];

const STATUS_LIST: Array<"Todos" | Status> = [
  "Todos",
  "Pendiente",
  "Aprobado",
  "Pagado",
];

const TX: Transaction[] = [
  {
    id: "TX-1001",
    date: "2026-01-03",
    desc: "Venta - Cliente ABC",
    category: "Ventas",
    status: "Pagado",
    amount: 2450.0,
  },
  {
    id: "TX-1002",
    date: "2026-01-05",
    desc: "Compra - Materia prima",
    category: "Compras",
    status: "Pagado",
    amount: -980.5,
  },
  {
    id: "TX-1003",
    date: "2026-01-10",
    desc: "Servicio - Internet planta",
    category: "Servicios",
    status: "Aprobado",
    amount: -120.0,
  },
  {
    id: "TX-1004",
    date: "2026-01-12",
    desc: "Nómina quincena",
    category: "Nómina",
    status: "Pendiente",
    amount: -3400.0,
  },
  {
    id: "TX-1005",
    date: "2026-01-18",
    desc: "Impuestos IVA",
    category: "Impuestos",
    status: "Pendiente",
    amount: -760.0,
  },
  {
    id: "TX-1006",
    date: "2026-01-22",
    desc: "Venta - Cliente Upala",
    category: "Ventas",
    status: "Aprobado",
    amount: 1500.0,
  },
];

function formatMoney(n: number) {
  const sign = n < 0 ? "-" : "";
  const abs = Math.abs(n);
  return `${sign}$${abs.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function badgeClass(status: Status) {
  if (status === "Pagado") return "badge badge-success";
  if (status === "Aprobado") return "badge badge-info";
  return "badge badge-warning";
}

function Stat({
  label,
  value,
  note,
}: {
  label: string;
  value: string | number;
  note: string;
}) {
  return (
    <Card className="card-pad">
      <div className="text-sm muted">{label}</div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
      <div className="mt-2 text-xs muted-2">{note}</div>
    </Card>
  );
}

export default function FinancePage() {
  const [q, setQ] = useState<string>("");
  const [category, setCategory] =
    useState<(typeof CATEGORIES)[number]>("Todos");
  const [status, setStatus] =
    useState<(typeof STATUS_LIST)[number]>("Todos");
  const [from, setFrom] = useState<string>("2026-01-01");
  const [to, setTo] = useState<string>("2026-01-31");

  const filtered = useMemo(() => {
    return TX.filter((t) => {
      const term = q.trim().toLowerCase();

      const byQ =
        term.length === 0 ||
        t.id.toLowerCase().includes(term) ||
        t.desc.toLowerCase().includes(term);

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
    const income = filtered
      .filter((t) => t.amount > 0)
      .reduce((acc, t) => acc + t.amount, 0);

    const expense = filtered
      .filter((t) => t.amount < 0)
      .reduce((acc, t) => acc + t.amount, 0);

    const balance = income + expense;
    const pending = filtered.filter(
      (t) => t.status === "Pendiente"
    ).length;

    return { income, expense, balance, pending };
  }, [filtered]);

  return (
    <div className="page">
      {/* Filters */}
      <Card className="card-pad">
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-6">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por ID o descripción…"
            className="input lg:col-span-2"
          />

          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value as (typeof CATEGORIES)[number])
            }
            className="select"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c} className="bg-[#0B1220]">
                {c}
              </option>
            ))}
          </select>

          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as (typeof STATUS_LIST)[number])
            }
            className="select"
          >
            {STATUS_LIST.map((s) => (
              <option key={s} value={s} className="bg-[#0B1220]">
                {s}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="input"
          />

          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="input"
          />
        </div>
      </Card>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Ingresos"
          value={formatMoney(kpis.income)}
          note="En el rango seleccionado"
        />
        <Stat
          label="Gastos"
          value={formatMoney(kpis.expense)}
          note="En el rango seleccionado"
        />
        <Stat
          label="Balance"
          value={formatMoney(kpis.balance)}
          note="Ingresos + gastos"
        />
        <Stat
          label="Pendientes"
          value={kpis.pending}
          note="Transacciones por aprobar/pagar"
        />
      </div>

      {/* Table */}
      <Card className="p-0 overflow-hidden">
        <div className="card-header">
          <div>
            <div className="text-sm muted">Movimientos</div>
            <div className="text-lg font-semibold">Transacciones</div>
          </div>
          <button type="button" className="btn btn-primary">
            + Nueva transacción
          </button>
        </div>

        <div className="table-wrap">
          <table className="table">
            <thead className="table-head">
              <tr className="border-b border-white/10">
                <th className="th">ID</th>
                <th className="th">Fecha</th>
                <th className="th">Descripción</th>
                <th className="th">Categoría</th>
                <th className="th">Estado</th>
                <th className="th text-right">Monto</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((t) => (
                <tr key={t.id} className="tr">
                  <td className="td-strong">{t.id}</td>
                  <td className="td">{t.date}</td>
                  <td className="td-strong">{t.desc}</td>
                  <td className="td">{t.category}</td>
                  <td className="td">
                    <span className={badgeClass(t.status)}>
                      {t.status}
                    </span>
                  </td>
                  <td
                    className={`td text-right font-semibold ${
                      t.amount < 0 ? "text-red-300" : "text-green-300"
                    }`}
                  >
                    {formatMoney(t.amount)}
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td
                    className="px-4 py-10 text-center text-white/50"
                    colSpan={6}
                  >
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

{/*

Implementé el módulo de Finanzas para gestionar transacciones contables dentro del ERP.

 Funcionalidades
- Filtro por búsqueda (ID o descripción).
- Filtro por categoría y estado.
- Filtro por rango de fechas.
- KPIs dinámicos:
  - Ingresos
  - Gastos
  - Balance
  - Pendientes
- Tabla ordenada por fecha descendente.

 Estructura
- FinancePage.tsx
  - Utiliza useMemo para:
    - Filtrar transacciones
    - Calcular KPIs
  - Separa la lógica de formato monetario.
  - Implementa badges reutilizables para estados.

  Estilos
Se utilizan clases globales definidas en `index.css`:
- `page`
- `card`, `card-pad`, `card-header`
- `input`, `select`
- `btn`, `btn-primary`
- `table`, `th`, `td`
- `badge`

Esto evita repetir clases Tailwind en cada componente y mantiene consistencia visual.

### Integración backend sugerida

Endpoint sugerido:

GET /finance/transactions?from=&to=&category=&status=&query=

Formato esperado:

[
  {
    "id": "TX-1001",
    "date": "2026-01-03",
    "desc": "Venta - Cliente ABC",
    "category": "Ventas",
    "status": "Pagado",
    "amount": 2450.00
  }
]

La UI está preparada para mapear directamente esta estructura. 
  */}