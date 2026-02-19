import { useMemo, useState } from "react";
import Card from "../components/ui/Card";

const ROLES = ["Todos", "Admin", "Logística", "Finanzas", "RRHH", "Ventas", "Operaciones"];
const STATUS = ["Todos", "Activo", "Inactivo"];

const EMPLOYEES = [
  { id: "EMP-001", name: "Alex Morgan", role: "Admin", department: "Sistemas", status: "Activo", email: "alex@smartops.com" },
  { id: "EMP-002", name: "María López", role: "Finanzas", department: "Finanzas", status: "Activo", email: "maria@smartops.com" },
  { id: "EMP-003", name: "Carlos Gómez", role: "Logística", department: "Inventarios", status: "Activo", email: "carlos@smartops.com" },
  { id: "EMP-004", name: "Ana Mora", role: "RRHH", department: "Recursos Humanos", status: "Activo", email: "ana@smartops.com" },
  { id: "EMP-005", name: "Luis Herrera", role: "Operaciones", department: "Producción", status: "Inactivo", email: "luis@smartops.com" },
  { id: "EMP-006", name: "Sofía Vargas", role: "Ventas", department: "CRM", status: "Activo", email: "sofia@smartops.com" },
];

function badgeClass(status) {
  if (status === "Activo") return "bg-green-500/15 text-green-300 border-green-500/20";
  return "bg-gray-500/15 text-gray-300 border-gray-500/20";
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

export default function HRPage() {
  const [q, setQ] = useState("");
  const [role, setRole] = useState("Todos");
  const [status, setStatus] = useState("Todos");

  const filtered = useMemo(() => {
    return EMPLOYEES.filter((e) => {
      const byQ =
        e.id.toLowerCase().includes(q.toLowerCase()) ||
        e.name.toLowerCase().includes(q.toLowerCase()) ||
        e.email.toLowerCase().includes(q.toLowerCase());

      const byRole = role === "Todos" || e.role === role;
      const byStatus = status === "Todos" || e.status === status;

      return byQ && byRole && byStatus;
    });
  }, [q, role, status]);

  const kpis = useMemo(() => {
    const total = filtered.length;
    const active = filtered.filter((e) => e.status === "Activo").length;
    const inactive = filtered.filter((e) => e.status === "Inactivo").length;
    return { total, active, inactive };
  }, [filtered]);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="p-4">
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por ID, nombre o email…"
            className="lg:col-span-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm outline-none placeholder:text-white/40"
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none"
          >
            {ROLES.map((r) => (
              <option key={r} value={r} className="bg-[#0B1220]">
                {r}
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

          <button className="rounded-xl bg-white/10 px-4 py-2 text-sm hover:bg-white/15">
            + Nuevo empleado
          </button>
        </div>
      </Card>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Stat label="Total" value={kpis.total} note="Filtrados" />
        <Stat label="Activos" value={kpis.active} note="En el sistema" />
        <Stat label="Inactivos" value={kpis.inactive} note="Archivados" />
      </div>

      {/* Table */}
      <Card className="p-0 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <div>
            <div className="text-sm text-white/60">Empleados</div>
            <div className="text-lg font-semibold">Directorio</div>
          </div>
          <button className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10">
            Exportar
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-white/60">
              <tr className="border-b border-white/10">
                <th className="px-4 py-3 text-left font-medium">ID</th>
                <th className="px-4 py-3 text-left font-medium">Nombre</th>
                <th className="px-4 py-3 text-left font-medium">Rol</th>
                <th className="px-4 py-3 text-left font-medium">Departamento</th>
                <th className="px-4 py-3 text-left font-medium">Estado</th>
                <th className="px-4 py-3 text-left font-medium">Email</th>
                <th className="px-4 py-3 text-right font-medium">Acción</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((e) => (
                <tr key={e.id} className="border-b border-white/10 hover:bg-white/5">
                  <td className="px-4 py-3 text-white/90">{e.id}</td>
                  <td className="px-4 py-3 text-white/90">{e.name}</td>
                  <td className="px-4 py-3 text-white/80">{e.role}</td>
                  <td className="px-4 py-3 text-white/80">{e.department}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs ${badgeClass(e.status)}`}>
                      {e.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-white/80">{e.email}</td>
                  <td className="px-4 py-3 text-right">
                    <button className="rounded-lg border border-white/10 px-3 py-1 text-xs hover:bg-white/10">
                      Ver
                    </button>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td className="px-4 py-10 text-center text-white/50" colSpan={7}>
                    No hay empleados con esos filtros
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
