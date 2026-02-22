import React, { useMemo, useState } from "react";
import Card from "../components/ui/Card";
import Modal from "../components/ui/Modal";

type Priority = "Alta" | "Media" | "Baja";
type OrderStatus = "En curso" | "Pendiente" | "Bloqueado" | "Resuelto";
type OrderType = "Orden" | "Ticket";

type Task = {
  id: number;
  title: string;
  area: string;
  done: boolean;
};

type Order = {
  id: string;
  type: OrderType;
  line: string;
  status: OrderStatus;
  eta: string;
  priority: Priority;
};

const TASKS_SEED: Task[] = [
  { id: 1, title: "Revisión de maquinaria (turno mañana)", area: "Planta 1", done: false },
  { id: 2, title: "Validar stock de materia prima crítica", area: "Bodega Central", done: true },
  { id: 3, title: "Actualizar plan de producción semanal", area: "Operaciones", done: false },
  { id: 4, title: "Inspección de seguridad (EPP)", area: "Planta 2", done: false },
];

const ORDERS_SEED: Order[] = [
  { id: "OP-1201", type: "Orden", line: "Línea A", status: "En curso", eta: "2h", priority: "Alta" },
  { id: "OP-1202", type: "Ticket", line: "Línea B", status: "Pendiente", eta: "6h", priority: "Media" },
  { id: "OP-1203", type: "Orden", line: "Línea C", status: "Bloqueado", eta: "—", priority: "Alta" },
  { id: "OP-1204", type: "Ticket", line: "Planta 1", status: "Resuelto", eta: "—", priority: "Baja" },
];

function badgeClass(status: OrderStatus) {
  if (status === "En curso") return "badge badge-info";
  if (status === "Pendiente") return "badge badge-warn";
  if (status === "Bloqueado") return "badge badge-danger";
  return "badge badge-success";
}

function priorityClass(p: Priority) {
  if (p === "Alta") return "text-red-300";
  if (p === "Media") return "text-yellow-300";
  return "text-white/70";
}

function nextOpId(existing: Order[]) {
  const nums = existing
    .map((o) => Number(o.id.replace("OP-", "")))
    .filter((n) => Number.isFinite(n));
  const next = (nums.length ? Math.max(...nums) : 1200) + 1;
  return `OP-${next}`;
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

export default function OperationsPage() {
  const [tasks, setTasks] = useState<Task[]>(TASKS_SEED);
  const [orders, setOrders] = useState<Order[]>(ORDERS_SEED);

  // modal
  const [open, setOpen] = useState(false);

  // form
  const [form, setForm] = useState<Omit<Order, "id">>({
    type: "Orden",
    line: "Planta 1",
    status: "Pendiente",
    eta: "—",
    priority: "Media",
  });

  const doneCount = useMemo(() => tasks.filter((t) => t.done).length, [tasks]);

  function toggleTask(id: number) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  function resetForm() {
    setForm({
      type: "Orden",
      line: "Planta 1",
      status: "Pendiente",
      eta: "—",
      priority: "Media",
    });
  }

  function openModal() {
    resetForm();
    setOpen(true);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.line.trim()) return;

    setOrders((prev) => [{ id: nextOpId(prev), ...form }, ...prev]);
    setOpen(false);
  }

  return (
    <div className="page">
      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Stat label="Producción hoy" value="1,240 uds" note="Objetivo: 1,500" />
        <Stat label="Eficiencia" value="82%" note="Últimas 24h" />
        <Stat label="Órdenes abiertas" value={orders.filter((o) => o.status !== "Resuelto").length} note="En curso / pendientes" />
        <Stat label="Incidentes" value={orders.filter((o) => o.status === "Bloqueado").length} note="Requiere atención" />
      </div>

      {/* Main grid */}
      <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        {/* Orders / Tickets */}
        <Card className="p-0 overflow-hidden">
          <div className="card-header">
            <div>
              <div className="text-sm muted">Operación</div>
              <div className="text-lg font-semibold">Órdenes & Tickets</div>
            </div>

            <button type="button" className="btn btn-primary" onClick={openModal}>
              + Crear
            </button>
          </div>

          <div className="table-wrap">
            <table className="table">
              <thead className="table-head">
                <tr className="border-b border-white/10">
                  <th className="th">ID</th>
                  <th className="th">Tipo</th>
                  <th className="th">Área</th>
                  <th className="th">Estado</th>
                  <th className="th">ETA</th>
                  <th className="th text-right">Prioridad</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="tr">
                    <td className="td-strong">{o.id}</td>
                    <td className="td">{o.type}</td>
                    <td className="td">{o.line}</td>
                    <td className="td">
                      <span className={badgeClass(o.status)}>{o.status}</span>
                    </td>
                    <td className="td">{o.eta}</td>
                    <td className={`td text-right font-semibold ${priorityClass(o.priority)}`}>
                      {o.priority}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Tasks + Alerts */}
        <div className="space-y-4">
          {/* Tasks */}
          <Card className="card-pad">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm muted">Checklist</div>
                <div className="text-lg font-semibold">Tareas operativas</div>
              </div>
              <div className="text-xs muted-2">
                {doneCount}/{tasks.length} completadas
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {tasks.map((t) => (
                <label
                  key={t.id}
                  className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-black/20 p-3 hover:bg-white/5"
                >
                  <input
                    type="checkbox"
                    checked={t.done}
                    onChange={() => toggleTask(t.id)}
                    className="mt-1 h-4 w-4 accent-white"
                  />
                  <div className="min-w-0 flex-1">
                    <div className={["text-sm font-medium", t.done ? "line-through text-white/50" : "text-white/90"].join(" ")}>
                      {t.title}
                    </div>
                    <div className="text-xs muted-2">{t.area}</div>
                  </div>
                </label>
              ))}
            </div>

            <button type="button" className="btn btn-primary mt-4 w-full">
              + Agregar tarea
            </button>
          </Card>

          {/* Alerts */}
          <Card className="card-pad">
            <div className="text-sm muted">Alertas</div>
            <div className="mt-1 text-lg font-semibold">Atención inmediata</div>

            <div className="mt-4 space-y-3">
              <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                <div className="text-sm font-medium">Línea C bloqueada</div>
                <div className="text-xs muted-2">Falla de motor · hace 20 min</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                <div className="text-sm font-medium">Stock crítico: Placas metálicas</div>
                <div className="text-xs muted-2">Inventarios · hoy</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                <div className="text-sm font-medium">Inspección de seguridad pendiente</div>
                <div className="text-xs muted-2">Planta 2 · hoy</div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Modal */}
      <Modal
        open={open}
        title="Crear orden / ticket"
        onClose={() => setOpen(false)}
        footer={
          <>
            <button type="button" className="btn btn-ghost" onClick={() => setOpen(false)}>
              Cancelar
            </button>
            <button type="submit" form="op-form" className="btn btn-primary">
              Guardar
            </button>
          </>
        }
      >
        <form id="op-form" onSubmit={onSubmit} className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <div className="text-sm muted mb-1">Tipo</div>
              <select
                className="select"
                value={form.type}
                onChange={(e) => setForm((p) => ({ ...p, type: e.target.value as OrderType }))}
              >
                <option className="bg-[#0B1220]" value="Orden">Orden</option>
                <option className="bg-[#0B1220]" value="Ticket">Ticket</option>
              </select>
            </div>

            <div>
              <div className="text-sm muted mb-1">Estado</div>
              <select
                className="select"
                value={form.status}
                onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as OrderStatus }))}
              >
                <option className="bg-[#0B1220]" value="Pendiente">Pendiente</option>
                <option className="bg-[#0B1220]" value="En curso">En curso</option>
                <option className="bg-[#0B1220]" value="Bloqueado">Bloqueado</option>
                <option className="bg-[#0B1220]" value="Resuelto">Resuelto</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <div className="text-sm muted mb-1">Área / Línea</div>
              <input
                className="input"
                value={form.line}
                onChange={(e) => setForm((p) => ({ ...p, line: e.target.value }))}
                placeholder="Ej: Línea A / Planta 1 / Bodega Central"
              />
            </div>

            <div>
              <div className="text-sm muted mb-1">ETA</div>
              <input
                className="input"
                value={form.eta}
                onChange={(e) => setForm((p) => ({ ...p, eta: e.target.value }))}
                placeholder="Ej: 2h / 1d / —"
              />
            </div>

            <div>
              <div className="text-sm muted mb-1">Prioridad</div>
              <select
                className="select"
                value={form.priority}
                onChange={(e) => setForm((p) => ({ ...p, priority: e.target.value as Priority }))}
              >
                <option className="bg-[#0B1220]" value="Alta">Alta</option>
                <option className="bg-[#0B1220]" value="Media">Media</option>
                <option className="bg-[#0B1220]" value="Baja">Baja</option>
              </select>
            </div>

          </div>

           
          

          <div className="text-xs text-white/40">
            *Modelo mínimo para demo. El backend puede agregar asignado, descripción, timestamps, etc.
          </div>
        </form>
      </Modal>
    </div>
  );
}






{/* 

Implementé el módulo de Operaciones para visualizar el estado operativo del sistema y facilitar el seguimiento de órdenes, tickets y tareas del día.

 Qué incluye
- KPIs operativos (producción, eficiencia, órdenes abiertas e incidentes).
- Tabla de Órdenes & Tickets** con:
  - ID, tipo, área, estado, ETA y prioridad.
- Checklist de tareas operativas** con:
  - conteo de completadas
  - toggle de estado (done / pendiente)
- Alertas con eventos que requieren atención inmediata.

 Estructura del código
- `OperationsPage.tsx`
  - Usa `useState` para manejar checklist local.
  - Usa `useMemo` para calcular tareas completadas.
  - Renderiza badges por estado y colores por prioridad.

 Estilos
Se utilizan clases globales definidas en `src/index.css`:
- `page`, `card-pad`, `card-header`
- `btn`, `btn-primary`
- `table`, `th`, `td`, `tr`
- `badge` (variantes para estados)

Integración backend sugerida
Endpoints recomendados:

- GET /operations/kpis
- GET /operations/orders
- GET /operations/tasks
- GET /operations/alerts

La UI puede reemplazar los mocks sin modificar el layout. */}