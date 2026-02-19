import { useMemo, useState } from "react";
import Card from "../components/ui/Card";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver, type SubmitHandler } from "react-hook-form";


type Category = "Ventas" | "Compras" | "Nómina" | "Servicios" | "Impuestos";
type TxStatus = "Pendiente" | "Aprobado" | "Pagado";

type Tx = {
  id: string;
  date: string; // YYYY-MM-DD
  desc: string;
  category: Category;
  status: TxStatus;
  amount: number; // + ingreso / - gasto
};

const CATEGORIES: Array<"Todos" | Category> = ["Todos", "Ventas", "Compras", "Nómina", "Servicios", "Impuestos"];
const STATUS: Array<"Todos" | TxStatus> = ["Todos", "Pendiente", "Aprobado", "Pagado"];

const INITIAL_TX: Tx[] = [
  { id: "TX-1001", date: "2026-01-03", desc: "Venta - Cliente ABC", category: "Ventas", status: "Pagado", amount: 2450.0 },
  { id: "TX-1002", date: "2026-01-05", desc: "Compra - Materia prima", category: "Compras", status: "Pagado", amount: -980.5 },
  { id: "TX-1003", date: "2026-01-10", desc: "Servicio - Internet planta", category: "Servicios", status: "Aprobado", amount: -120.0 },
  { id: "TX-1004", date: "2026-01-12", desc: "Nómina quincena", category: "Nómina", status: "Pendiente", amount: -3400.0 },
  { id: "TX-1005", date: "2026-01-18", desc: "Impuestos IVA", category: "Impuestos", status: "Pendiente", amount: -760.0 },
  { id: "TX-1006", date: "2026-01-22", desc: "Venta - Cliente Upala", category: "Ventas", status: "Aprobado", amount: 1500.0 },
];

function formatMoney(n: number) {
  const sign = n < 0 ? "-" : "";
  const abs = Math.abs(n);
  return `${sign}$${abs.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function badgeClass(status: TxStatus) {
  if (status === "Pagado") return "bg-green-500/15 text-green-300 border-green-500/20";
  if (status === "Aprobado") return "bg-blue-500/15 text-blue-300 border-blue-500/20";
  return "bg-yellow-500/15 text-yellow-300 border-yellow-500/20";
}

function Stat({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <Card className="p-4">
      <div className="text-sm text-white/60">{label}</div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
      <div className="mt-2 text-xs text-white/50">{note}</div>
    </Card>
  );
}

/** Modal simple (sin librerías) */
function Modal({
  open,
  title,
  children,
  onClose,
}: {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="absolute left-1/2 top-1/2 w-[92vw] max-w-xl -translate-x-1/2 -translate-y-1/2">
        <Card className="p-0 overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div className="text-sm font-semibold">{title}</div>
            <button
              onClick={onClose}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs hover:bg-white/10"
            >
              Cerrar
            </button>
          </div>
          <div className="p-4">{children}</div>
        </Card>
      </div>
    </div>
  );
}

const txSchema = z.object({
  date: z.string().min(10, "Fecha requerida"),
  desc: z.string().min(3, "Descripción muy corta"),
  category: z.enum(["Ventas", "Compras", "Nómina", "Servicios", "Impuestos"]),
  status: z.enum(["Pendiente", "Aprobado", "Pagado"]),
  type: z.enum(["Ingreso", "Gasto"]),
  amount: z.coerce.number().positive("Monto debe ser > 0"),
});

type TxForm = z.infer<typeof txSchema>;

export default function FinancePage() {
  const [tx, setTx] = useState<Tx[]>(INITIAL_TX);
  const [q, setQ] = useState<string>("");
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("Todos");
  const [status, setStatus] = useState<(typeof STATUS)[number]>("Todos");
  const [from, setFrom] = useState<string>("2026-01-01");
  const [to, setTo] = useState<string>("2026-01-31");
  const [open, setOpen] = useState<boolean>(false);

 const form = useForm<TxForm>({
  resolver: zodResolver(txSchema) as Resolver<TxForm>,
  defaultValues: {
    date: new Date().toISOString().slice(0, 10),
    desc: "",
    category: "Ventas",
    status: "Pendiente",
    type: "Ingreso",
    amount: 100,
  },
});


  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();

    // incluir el día final completo: sumamos 1 día al "to"
    const dFrom = new Date(from);
    const dTo = new Date(to);
    dTo.setDate(dTo.getDate() + 1);

    return tx
      .filter((t) => {
        const byQ =
          query.length === 0 ||
          t.id.toLowerCase().includes(query) ||
          t.desc.toLowerCase().includes(query);

        const byCategory = category === "Todos" || t.category === category;
        const byStatus = status === "Todos" || t.status === status;

        const d = new Date(t.date);
        const byDate = d >= dFrom && d < dTo;

        return byQ && byCategory && byStatus && byDate;
      })
      .sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [tx, q, category, status, from, to]);

  const kpis = useMemo(() => {
    const income = filtered.filter((t) => t.amount > 0).reduce((acc, t) => acc + t.amount, 0);
    const expenseAbs = filtered.filter((t) => t.amount < 0).reduce((acc, t) => acc + Math.abs(t.amount), 0);
    const balance = income - expenseAbs;
    const pending = filtered.filter((t) => t.status === "Pendiente").length;
    return { income, expenseAbs, balance, pending };
  }, [filtered]);

  function nextId(items: Tx[]) {
    // TX-1007...
    const nums = items
      .map((x) => Number(x.id.replace("TX-", "")))
      .filter((n) => Number.isFinite(n));
    const max = nums.length ? Math.max(...nums) : 1000;
    return `TX-${max + 1}`;
  }

  function openNewTx() {
    form.reset({
      date: new Date().toISOString().slice(0, 10),
      desc: "",
      category: "Ventas",
      status: "Pendiente",
      type: "Ingreso",
      amount: 100,
    });
    setOpen(true);
  }

  function onSubmit(values: TxForm) {
    const id = nextId(tx);
    const signedAmount = values.type === "Gasto" ? -values.amount : values.amount;

    const newTx: Tx = {
      id,
      date: values.date,
      desc: values.desc,
      category: values.category,
      status: values.status,
      amount: signedAmount,
    };

    setTx((prev) => [newTx, ...prev]);
    setOpen(false);
  }

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
            onChange={(e) => setCategory(e.target.value as (typeof CATEGORIES)[number])}
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
            onChange={(e) => setStatus(e.target.value as (typeof STATUS)[number])}
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

        <div className="mt-3 text-xs text-white/50">
          Tip: en una fase posterior se integra conciliación bancaria y facturación; por ahora tenemos flujo de caja y control de estados.
        </div>
      </Card>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Stat label="Ingresos" value={formatMoney(kpis.income)} note="En el rango seleccionado" />
        <Stat label="Gastos" value={formatMoney(kpis.expenseAbs)} note="Total egresos (abs)" />
        <Stat label="Balance" value={formatMoney(kpis.balance)} note="Ingresos - gastos" />
        <Stat label="Pendientes" value={`${kpis.pending}`} note="Por pagar/aprobar" />
      </div>

      {/* Table */}
      <Card className="p-0 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <div>
            <div className="text-sm text-white/60">Movimientos</div>
            <div className="text-lg font-semibold">Transacciones</div>
          </div>
          <button
            onClick={openNewTx}
            className="rounded-xl bg-white/10 px-4 py-2 text-sm hover:bg-white/15"
          >
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

      {/* Modal New Tx */}
      <Modal open={open} title="Nueva transacción" onClose={() => setOpen(false)}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs text-white/60">Fecha</label>
              <input
                type="date"
                {...form.register("date")}
                className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none"
              />
              {form.formState.errors.date && (
                <div className="mt-1 text-xs text-red-300">{form.formState.errors.date.message}</div>
              )}
            </div>

            <div>
              <label className="text-xs text-white/60">Tipo</label>
              <select
                {...form.register("type")}
                className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none"
              >
                <option value="Ingreso" className="bg-[#0B1220]">Ingreso</option>
                <option value="Gasto" className="bg-[#0B1220]">Gasto</option>
              </select>
              {form.formState.errors.type && (
                <div className="mt-1 text-xs text-red-300">{form.formState.errors.type.message}</div>
              )}
            </div>
          </div>

          <div>
            <label className="text-xs text-white/60">Descripción</label>
            <input
              {...form.register("desc")}
              placeholder="Ej: Venta - Cliente ABC"
              className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none placeholder:text-white/40"
            />
            {form.formState.errors.desc && (
              <div className="mt-1 text-xs text-red-300">{form.formState.errors.desc.message}</div>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <label className="text-xs text-white/60">Categoría</label>
              <select
                {...form.register("category")}
                className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none"
              >
                {(["Ventas", "Compras", "Nómina", "Servicios", "Impuestos"] as const).map((c) => (
                  <option key={c} value={c} className="bg-[#0B1220]">
                    {c}
                  </option>
                ))}
              </select>
              {form.formState.errors.category && (
                <div className="mt-1 text-xs text-red-300">{form.formState.errors.category.message}</div>
              )}
            </div>

            <div>
              <label className="text-xs text-white/60">Estado</label>
              <select
                {...form.register("status")}
                className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none"
              >
                {(["Pendiente", "Aprobado", "Pagado"] as const).map((s) => (
                  <option key={s} value={s} className="bg-[#0B1220]">
                    {s}
                  </option>
                ))}
              </select>
              {form.formState.errors.status && (
                <div className="mt-1 text-xs text-red-300">{form.formState.errors.status.message}</div>
              )}
            </div>

            <div>
              <label className="text-xs text-white/60">Monto</label>
              <input
                type="number"
                step="0.01"
                {...form.register("amount")}
                className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none"
              />
              {form.formState.errors.amount && (
                <div className="mt-1 text-xs text-red-300">{form.formState.errors.amount.message}</div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-xl bg-white/10 px-4 py-2 text-sm hover:bg-white/15"
            >
              Guardar
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
