import { useMemo, useState } from "react";
import Card from "../components/ui/Card";

const TASKS_SEED = [
  { id: 1, title: "Revisión de maquinaria (turno mañana)", area: "Planta 1", done: false },
  { id: 2, title: "Validar stock de materia prima crítica", area: "Bodega Central", done: true },
  { id: 3, title: "Actualizar plan de producción semanal", area: "Operaciones", done: false },
  { id: 4, title: "Inspección de seguridad (EPP)", area: "Planta 2", done: false },
];

const ORDERS = [
  { id: "OP-1201", type: "Orden", line: "Línea A", status: "En curso", eta: "2h", priority: "Alta" },
  { id: "OP-1202", type: "Ticket", line: "Línea B", status: "Pendiente", eta: "6h", priority: "Media" },
  { id: "OP-1203", type: "Orden", line: "Línea C", status: "Bloqueado", eta: "—", priority: "Alta" },
  { id: "OP-1204", type: "Ticket", line: "Planta 1", status: "Resuelto", eta: "—", priority: "Baja" },
];

function badgeClass(status) {
  if (status === "En curso") return "bg-blue-500/15 text-blue-300 border-blue-500/20";
  if (status === "Pendiente") return "bg-yellow-500/15 text-yellow-300 border-yellow-500/20";
  if (status === "Bloqueado") return "bg-red-500/15 text-red-300 border-red-500/20";
  return "bg-green-500/15 text-green-300 border-green-500/20";
}

function priorityClass(p) {
  if (p === "Alta") return "text-red-300";
  if (p === "Media") return "text-yellow-300";
  return "text-white/70";
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

export default function OperationsPage() {
  const [tasks, setTasks] = useState(TASKS_SEED);

  const doneCount = useMemo(() => tasks.filter((t) => t.done).length, [tasks]);

  function toggleTask(id) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Stat label="Producción hoy" value="1,240 uds" note="Objetivo: 1,500" />
        <Stat label="Eficiencia" value="82%" note="Últimas 24h" />
        <Stat label="Órdenes abiertas" value="3" note="En curso / pendientes" />
        <Stat label="Incidentes" value="1" note="Requiere atención" />
      </div>

      {/* Main grid */}
      <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        {/* Orders / Tickets */}
        <Card className="p-0 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <div>
              <div className="text-sm text-white/60">Operación</div>
              <div className="text-lg font-semibold">Órdenes & Tickets</div>
            </div>
            <button className="rounded-xl bg-white/10 px-4 py-2 text-sm hover:bg-white/15">
              + Crear
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-white/60">
                <tr className="border-b border-white/10">
                  <th className="px-4 py-3 text-left font-medium">ID</th>
                  <th className="px-4 py-3 text-left font-medium">Tipo</th>
                  <th className="px-4 py-3 text-left font-medium">Área</th>
                  <th className="px-4 py-3 text-left font-medium">Estado</th>
                  <th className="px-4 py-3 text-left font-medium">ETA</th>
                  <th className="px-4 py-3 text-right font-medium">Prioridad</th>
                </tr>
              </thead>

              <tbody>
                {ORDERS.map((o) => (
                  <tr key={o.id} className="border-b border-white/10 hover:bg-white/5">
                    <td className="px-4 py-3 text-white/90">{o.id}</td>
                    <td className="px-4 py-3 text-white/80">{o.type}</td>
                    <td className="px-4 py-3 text-white/80">{o.line}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs ${badgeClass(o.status)}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-white/80">{o.eta}</td>
                    <td className={`px-4 py-3 text-right font-semibold ${priorityClass(o.priority)}`}>
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
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-white/60">Checklist</div>
                <div className="text-lg font-semibold">Tareas operativas</div>
              </div>
              <div className="text-xs text-white/50">
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
                  <div className="flex-1">
                    <div className={`text-sm font-medium ${t.done ? "line-through text-white/50" : "text-white/90"}`}>
                      {t.title}
                    </div>
                    <div className="text-xs text-white/50">{t.area}</div>
                  </div>
                </label>
              ))}
            </div>

            <button className="mt-4 w-full rounded-xl bg-white/10 px-4 py-2 text-sm hover:bg-white/15">
              + Agregar tarea
            </button>
          </Card>

          {/* Alerts */}
          <Card className="p-4">
            <div className="text-sm text-white/60">Alertas</div>
            <div className="mt-1 text-lg font-semibold">Atención inmediata</div>

            <div className="mt-4 space-y-3">
              <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                <div className="text-sm font-medium">Línea C bloqueada</div>
                <div className="text-xs text-white/50">Falla de motor · hace 20 min</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                <div className="text-sm font-medium">Stock crítico: Placas metálicas</div>
                <div className="text-xs text-white/50">Inventarios · hoy</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                <div className="text-sm font-medium">Inspección de seguridad pendiente</div>
                <div className="text-xs text-white/50">Planta 2 · hoy</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
