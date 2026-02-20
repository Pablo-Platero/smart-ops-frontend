import { useMemo, useState } from "react";
import Card from "../components/ui/Card";
import { useForm, type Resolver, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type Status = "En curso" | "Pendiente" | "Bloqueado" | "Resuelto";
type Priority = "Alta" | "Media" | "Baja";
type Type = "Orden" | "Ticket";

type Order = {
  id: string;
  type: Type;
  line: string;
  status: Status;
  eta: string;
  priority: Priority;
};

const SEED_ORDERS: Order[] = [
  { id: "OP-1201", type: "Orden", line: "Línea A", status: "En curso", eta: "2h", priority: "Alta" },
  { id: "OP-1202", type: "Ticket", line: "Línea B", status: "Pendiente", eta: "6h", priority: "Media" },
  { id: "OP-1203", type: "Orden", line: "Línea C", status: "Bloqueado", eta: "—", priority: "Alta" },
  { id: "OP-1204", type: "Ticket", line: "Planta 1", status: "Resuelto", eta: "—", priority: "Baja" },
];

const TASKS_SEED = [
  { id: 1, title: "Revisión de maquinaria (turno mañana)", area: "Planta 1", done: false },
  { id: 2, title: "Validar stock de materia prima crítica", area: "Bodega Central", done: true },
  { id: 3, title: "Actualizar plan de producción semanal", area: "Operaciones", done: false },
  { id: 4, title: "Inspección de seguridad (EPP)", area: "Planta 2", done: false },
];

function badgeClass(status: Status) {
  if (status === "En curso") return "bg-blue-500/15 text-blue-300 border-blue-500/20";
  if (status === "Pendiente") return "bg-yellow-500/15 text-yellow-300 border-yellow-500/20";
  if (status === "Bloqueado") return "bg-red-500/15 text-red-300 border-red-500/20";
  return "bg-green-500/15 text-green-300 border-green-500/20";
}

function priorityClass(p: Priority) {
  if (p === "Alta") return "text-red-300";
  if (p === "Media") return "text-yellow-300";
  return "text-white/70";
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
      <div className="absolute left-1/2 top-1/2 w-[92vw] max-w-2xl -translate-x-1/2 -translate-y-1/2">
        <Card className="p-0 overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div className="text-sm font-semibold">{title}</div>
            <button onClick={onClose} className="text-xs px-3 py-1 border border-white/10 rounded-lg">
              Cerrar
            </button>
          </div>
          <div className="p-4">{children}</div>
        </Card>
      </div>
    </div>
  );
}

const orderSchema = z.object({
  type: z.enum(["Orden", "Ticket"]),
  line: z.string().min(2, "Área requerida"),
  priority: z.enum(["Alta", "Media", "Baja"]),
  eta: z.string().min(1),
});

type OrderForm = z.infer<typeof orderSchema>;

export default function OperationsPage() {
  const [orders, setOrders] = useState<Order[]>(SEED_ORDERS);
  const [tasks, setTasks] = useState(TASKS_SEED);
  const [open, setOpen] = useState(false);

  const form = useForm<OrderForm>({
    resolver: zodResolver(orderSchema) as Resolver<OrderForm>,
    defaultValues: {
      type: "Orden",
      line: "",
      priority: "Media",
      eta: "4h",
    },
  });

  const kpis = useMemo(() => {
    const openOrders = orders.filter(o => o.status !== "Resuelto").length;
    const blocked = orders.filter(o => o.status === "Bloqueado").length;
    const highPriority = orders.filter(o => o.priority === "Alta").length;
    const resolved = orders.filter(o => o.status === "Resuelto").length;
    return { openOrders, blocked, highPriority, resolved };
  }, [orders]);

  const doneCount = useMemo(() => tasks.filter(t => t.done).length, [tasks]);

  function toggleTask(id: number) {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  }

  const onSubmit: SubmitHandler<OrderForm> = (values) => {
    const newOrder: Order = {
      id: `OP-${Math.floor(1000 + Math.random() * 9000)}`,
      type: values.type,
      line: values.line,
      status: "Pendiente",
      eta: values.eta,
      priority: values.priority,
    };

    setOrders(prev => [newOrder, ...prev]);
    setOpen(false);
  };

  return (
    <div className="space-y-6">

      {/* KPIs dinámicos */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Stat label="Órdenes abiertas" value={`${kpis.openOrders}`} note="Pendientes / En curso" />
        <Stat label="Bloqueadas" value={`${kpis.blocked}`} note="Requieren acción" />
        <Stat label="Alta prioridad" value={`${kpis.highPriority}`} note="Atención inmediata" />
        <Stat label="Resueltas" value={`${kpis.resolved}`} note="Histórico reciente" />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">

        {/* Orders */}
        <Card className="p-0 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <div>
              <div className="text-sm text-white/60">Operación</div>
              <div className="text-lg font-semibold">Órdenes & Tickets</div>
            </div>
            <button onClick={() => setOpen(true)} className="rounded-xl bg-white/10 px-4 py-2 text-sm">
              + Crear
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-white/60">
                <tr className="border-b border-white/10">
                  <th className="px-4 py-3 text-left">ID</th>
                  <th className="px-4 py-3 text-left">Tipo</th>
                  <th className="px-4 py-3 text-left">Área</th>
                  <th className="px-4 py-3 text-left">Estado</th>
                  <th className="px-4 py-3 text-left">ETA</th>
                  <th className="px-4 py-3 text-right">Prioridad</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id} className="border-b border-white/10 hover:bg-white/5">
                    <td className="px-4 py-3">{o.id}</td>
                    <td className="px-4 py-3">{o.type}</td>
                    <td className="px-4 py-3">{o.line}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-3 py-1 text-xs border rounded-full ${badgeClass(o.status)}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">{o.eta}</td>
                    <td className={`px-4 py-3 text-right font-semibold ${priorityClass(o.priority)}`}>
                      {o.priority}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Tasks */}
        <Card className="p-4">
          <div className="flex justify-between">
            <div>
              <div className="text-sm text-white/60">Checklist</div>
              <div className="text-lg font-semibold">Tareas operativas</div>
            </div>
            <div className="text-xs text-white/50">{doneCount}/{tasks.length}</div>
          </div>

          <div className="mt-4 space-y-3">
            {tasks.map(t => (
              <label key={t.id} className="flex gap-3 p-3 border border-white/10 rounded-xl cursor-pointer">
                <input type="checkbox" checked={t.done} onChange={() => toggleTask(t.id)} />
                <div>
                  <div className={`${t.done ? "line-through text-white/50" : ""}`}>
                    {t.title}
                  </div>
                  <div className="text-xs text-white/50">{t.area}</div>
                </div>
              </label>
            ))}
          </div>
        </Card>
      </div>

      {/* Modal Nueva Orden */}
      <Modal open={open} title="Nueva orden / ticket" onClose={() => setOpen(false)}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <select {...form.register("type")} className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2">
            <option value="Orden">Orden</option>
            <option value="Ticket">Ticket</option>
          </select>

          <input {...form.register("line")} placeholder="Área / Línea"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2" />

          <select {...form.register("priority")}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2">
            <option value="Alta">Alta</option>
            <option value="Media">Media</option>
            <option value="Baja">Baja</option>
          </select>

          <input {...form.register("eta")} placeholder="ETA (ej: 3h)"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2" />

          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setOpen(false)}
              className="px-4 py-2 border border-white/10 rounded-xl">
              Cancelar
            </button>
            <button type="submit"
              className="px-4 py-2 bg-white/10 rounded-xl">
              Crear
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}