import { useMemo, useState } from "react";
import Card from "../components/ui/Card";

const STATUS = ["Todos", "En curso", "En riesgo", "Completado"];

const PROJECTS = [
  {
    id: "PR-001",
    name: "Sistema Municipal - Control Vehicular",
    owner: "Equipo TI",
    status: "En curso",
    progress: 62,
    due: "2026-02-15",
    summary: "Módulos de entradas/salidas, reservas y reportes.",
  },
  {
    id: "PR-002",
    name: "Dashboard Operaciones",
    owner: "Operaciones",
    status: "En riesgo",
    progress: 45,
    due: "2026-02-05",
    summary: "KPI + alertas + integración de inventarios.",
  },
  {
    id: "PR-003",
    name: "CRM Leads Pipeline",
    owner: "Ventas",
    status: "En curso",
    progress: 70,
    due: "2026-02-20",
    summary: "Kanban de leads + seguimiento + reportes.",
  },
  {
    id: "PR-004",
    name: "Cierre Contable",
    owner: "Finanzas",
    status: "Completado",
    progress: 100,
    due: "2026-01-25",
    summary: "Conciliación y reportes de cierre mensual.",
  },
  {
    id: "PR-005",
    name: "Optimización Inventarios",
    owner: "Bodega",
    status: "En curso",
    progress: 33,
    due: "2026-03-01",
    summary: "Stock mínimo, alertas y clasificación por categoría.",
  },
];

function badgeClass(status) {
  if (status === "Completado") return "bg-green-500/15 text-green-300 border-green-500/20";
  if (status === "En riesgo") return "bg-red-500/15 text-red-300 border-red-500/20";
  return "bg-blue-500/15 text-blue-300 border-blue-500/20";
}

function ProgressBar({ value }) {
  return (
    <div className="mt-2 h-2 w-full rounded-full bg-white/10">
      <div
        className="h-2 rounded-full bg-white/30"
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
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

export default function ProjectsPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("Todos");

  const filtered = useMemo(() => {
    return PROJECTS.filter((p) => {
      const byQ =
        p.id.toLowerCase().includes(q.toLowerCase()) ||
        p.name.toLowerCase().includes(q.toLowerCase()) ||
        p.owner.toLowerCase().includes(q.toLowerCase());
      const byStatus = status === "Todos" || p.status === status;
      return byQ && byStatus;
    });
  }, [q, status]);

  const kpis = useMemo(() => {
    const total = filtered.length;
    const inProgress = filtered.filter((p) => p.status === "En curso").length;
    const atRisk = filtered.filter((p) => p.status === "En riesgo").length;
    const done = filtered.filter((p) => p.status === "Completado").length;
    return { total, inProgress, atRisk, done };
  }, [filtered]);

  return (
    <div className="space-y-6">
      {/* Header actions */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex w-full flex-col gap-3 md:flex-row md:items-center">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por ID, nombre o dueño…"
            className="w-full md:w-96 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm outline-none placeholder:text-white/40"
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full md:w-56 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none"
          >
            {STATUS.map((s) => (
              <option key={s} value={s} className="bg-[#0B1220]">
                {s}
              </option>
            ))}
          </select>
        </div>

        <button className="rounded-xl bg-white/10 px-4 py-2 text-sm hover:bg-white/15">
          + Nuevo proyecto
        </button>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Stat label="Total" value={kpis.total} note="Proyectos filtrados" />
        <Stat label="En curso" value={kpis.inProgress} note="Activos" />
        <Stat label="En riesgo" value={kpis.atRisk} note="Requieren atención" />
        <Stat label="Completados" value={kpis.done} note="Finalizados" />
      </div>

      {/* Grid of project cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <Card key={p.id} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs text-white/50">{p.id}</div>
                <div className="mt-1 text-lg font-semibold leading-tight">{p.name}</div>
              </div>
              <span className={`shrink-0 inline-flex items-center rounded-full border px-3 py-1 text-xs ${badgeClass(p.status)}`}>
                {p.status}
              </span>
            </div>

            <div className="mt-2 text-sm text-white/60">{p.summary}</div>

            <div className="mt-4 text-xs text-white/60">
              Due: <span className="text-white/80">{p.due}</span> · Owner:{" "}
              <span className="text-white/80">{p.owner}</span>
            </div>

            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-white/60">
                <span>Progreso</span>
                <span className="text-white/80 font-semibold">{p.progress}%</span>
              </div>
              <ProgressBar value={p.progress} />
            </div>

            <div className="mt-4 flex justify-end">
              <button className="rounded-lg border border-white/10 px-3 py-1 text-xs hover:bg-white/10">
                Ver detalle
              </button>
            </div>
          </Card>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full text-center text-white/50 py-12">
            No hay proyectos con esos filtros
          </div>
        )}
      </div>
    </div>
  );
}
