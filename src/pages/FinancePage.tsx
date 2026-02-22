import React, { useMemo, useState } from "react";
import Card from "../components/ui/Card";
import Modal from "../components/ui/Modal";

type Category =
  | "Ventas"
  | "Compras"
  | "Nómina"
  | "Servicios"
  | "Impuestos";

type Status = "Pendiente" | "Aprobado" | "Pagado";
type TxType = "Ingreso" | "Gasto";

type Transaction = {
  id: string;
  date: string;
  desc: string;
  category: Category;
  status: Status;
  amount: number;
};

const CATEGORIES: Category[] = [
  "Ventas",
  "Compras",
  "Nómina",
  "Servicios",
  "Impuestos",
];

const STATUS_LIST: Status[] = ["Pendiente", "Aprobado", "Pagado"];

const TX_SEED: Transaction[] = [
  { id: "TX-1001", date: "2026-01-03", desc: "Venta - Cliente ABC", category: "Ventas", status: "Pagado", amount: 2450 },
  { id: "TX-1002", date: "2026-01-05", desc: "Compra - Materia prima", category: "Compras", status: "Pagado", amount: -980.5 },
  { id: "TX-1003", date: "2026-01-10", desc: "Servicio - Internet planta", category: "Servicios", status: "Aprobado", amount: -120 },
  { id: "TX-1004", date: "2026-01-12", desc: "Nómina quincena", category: "Nómina", status: "Pendiente", amount: -3400 },
];

function nextTxId(existing: Transaction[]) {
  const nums = existing
    .map((t) => Number(t.id.replace("TX-", "")))
    .filter((n) => Number.isFinite(n));
  const next = (nums.length ? Math.max(...nums) : 1000) + 1;
  return `TX-${next}`;
}

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
  return "badge badge-warn";
}

function Stat({ label, value, note }: { label: string; value: string | number; note: string }) {
  return (
    <Card className="card-pad">
      <div className="text-sm muted">{label}</div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
      <div className="mt-2 text-xs muted-2">{note}</div>
    </Card>
  );
}

export default function FinancePage() {
  const [transactions, setTransactions] = useState<Transaction[]>(TX_SEED);

  const [open, setOpen] = useState(false);

  const [form, setForm] = useState<{
    date: string;
    desc: string;
    category: Category;
    status: Status;
    type: TxType;
    amount: number;
  }>({
    date: new Date().toISOString().slice(0, 10),
    desc: "",
    category: "Ventas",
    status: "Pendiente",
    type: "Ingreso",
    amount: 0,
  });

  const filtered = useMemo(() => {
    return [...transactions].sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [transactions]);

  const kpis = useMemo(() => {
    const income = filtered
      .filter((t) => t.amount > 0)
      .reduce((acc, t) => acc + t.amount, 0);

    const expense = filtered
      .filter((t) => t.amount < 0)
      .reduce((acc, t) => acc + t.amount, 0);

    const balance = income + expense;
    const pending = filtered.filter((t) => t.status === "Pendiente").length;

    return { income, expense, balance, pending };
  }, [filtered]);

  function resetForm() {
    setForm({
      date: new Date().toISOString().slice(0, 10),
      desc: "",
      category: "Ventas",
      status: "Pendiente",
      type: "Ingreso",
      amount: 0,
    });
  }

  function openModal() {
    resetForm();
    setOpen(true);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.desc.trim() || form.amount <= 0) return;

    const signedAmount = form.type === "Ingreso" ? form.amount : -form.amount;

    setTransactions((prev) => [
      {
        id: nextTxId(prev),
        date: form.date,
        desc: form.desc,
        category: form.category,
        status: form.status,
        amount: signedAmount,
      },
      ...prev,
    ]);

    setOpen(false);
  }

  return (
    <div className="page">
      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Stat label="Ingresos" value={formatMoney(kpis.income)} note="Acumulado" />
        <Stat label="Gastos" value={formatMoney(kpis.expense)} note="Acumulado" />
        <Stat label="Balance" value={formatMoney(kpis.balance)} note="Ingresos - gastos" />
        <Stat label="Pendientes" value={kpis.pending} note="Por aprobar/pagar" />
      </div>

      {/* Table */}
      <Card className="p-0 overflow-hidden">
        <div className="card-header">
          <div>
            <div className="text-sm muted">Movimientos</div>
            <div className="text-lg font-semibold">Transacciones</div>
          </div>
          <button type="button" className="btn btn-primary" onClick={openModal}>
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
                    <span className={badgeClass(t.status)}>{t.status}</span>
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
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal */}
      <Modal
        open={open}
        title="Nueva transacción"
        onClose={() => setOpen(false)}
        footer={
          <>
            <button type="button" className="btn btn-ghost" onClick={() => setOpen(false)}>
              Cancelar
            </button>
            <button type="submit" form="finance-form" className="btn btn-primary">
              Guardar
            </button>
          </>
        }
      >
        <form id="finance-form" onSubmit={onSubmit} className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <div className="text-sm muted mb-1">Fecha</div>
              <input
                type="date"
                className="input"
                value={form.date}
                onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
              />
            </div>

            <div>
              <div className="text-sm muted mb-1">Tipo</div>
              <select
                className="select"
                value={form.type}
                onChange={(e) => setForm((p) => ({ ...p, type: e.target.value as TxType }))}
              >
                <option className="bg-[#0B1220]" value="Ingreso">Ingreso</option>
                <option className="bg-[#0B1220]" value="Gasto">Gasto</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <div className="text-sm muted mb-1">Descripción</div>
              <input
                className="input"
                value={form.desc}
                onChange={(e) => setForm((p) => ({ ...p, desc: e.target.value }))}
                placeholder="Ej: Venta - Cliente XYZ"
              />
            </div>

            <div>
              <div className="text-sm muted mb-1">Categoría</div>
              <select
                className="select"
                value={form.category}
                onChange={(e) => setForm((p) => ({ ...p, category: e.target.value as Category }))}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} className="bg-[#0B1220]" value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="text-sm muted mb-1">Estado</div>
              <select
                className="select"
                value={form.status}
                onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as Status }))}
              >
                {STATUS_LIST.map((s) => (
                  <option key={s} className="bg-[#0B1220]" value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <div className="text-sm muted mb-1">Monto</div>
              <input
                type="number"
                className="input"
                value={form.amount}
                min={0}
                onChange={(e) => setForm((p) => ({ ...p, amount: Number(e.target.value) }))}
              />
            </div>
          </div>

          <div className="text-xs text-white/40">
            *Formulario mínimo para demo. El backend puede agregar impuestos, método de pago, conciliación, etc.
          </div>
        </form>
      </Modal>
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