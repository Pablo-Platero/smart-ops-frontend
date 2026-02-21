import React, { useMemo, useState } from "react";
import Card from "../components/ui/Card";

type Role =
  | "Admin"
  | "Logística"
  | "Finanzas"
  | "RRHH"
  | "Ventas"
  | "Operaciones";

type EmployeeStatus = "Activo" | "Inactivo";

type Employee = {
  id: string;
  name: string;
  role: Role;
  department: string;
  status: EmployeeStatus;
  email: string;
};

const ROLES: Array<"Todos" | Role> = [
  "Todos",
  "Admin",
  "Logística",
  "Finanzas",
  "RRHH",
  "Ventas",
  "Operaciones",
];

const STATUS_LIST: Array<"Todos" | EmployeeStatus> = ["Todos", "Activo", "Inactivo"];

const EMPLOYEES: Employee[] = [
  { id: "EMP-001", name: "Alex Morgan", role: "Admin", department: "Sistemas", status: "Activo", email: "alex@gmail.com" },
  { id: "EMP-002", name: "María López", role: "Finanzas", department: "Finanzas", status: "Activo", email: "maria@gmail.com" },
  { id: "EMP-003", name: "Carlos Gómez", role: "Logística", department: "Inventarios", status: "Activo", email: "carlos@gmail.com" },
  { id: "EMP-004", name: "Ana Mora", role: "RRHH", department: "Recursos Humanos", status: "Activo", email: "ana@gmail.com" },
  { id: "EMP-005", name: "Luis Herrera", role: "Operaciones", department: "Producción", status: "Inactivo", email: "luis@gmail.com" },
  { id: "EMP-006", name: "Sofía Vargas", role: "Ventas", department: "CRM", status: "Activo", email: "sofia@gmail.com" },
];

function badgeClass(status: EmployeeStatus) {
  if (status === "Activo") return "badge badge-success";
  return "badge border-white/10 bg-white/5 text-white/70";
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

export default function HRPage() {
  const [q, setQ] = useState<string>("");
  const [role, setRole] = useState<(typeof ROLES)[number]>("Todos");
  const [status, setStatus] = useState<(typeof STATUS_LIST)[number]>("Todos");

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();

    return EMPLOYEES.filter((e) => {
      const byQ =
        term.length === 0 ||
        e.id.toLowerCase().includes(term) ||
        e.name.toLowerCase().includes(term) ||
        e.email.toLowerCase().includes(term);

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
    <div className="page">
      {/* Filters */}
      <Card className="card-pad">
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por ID, nombre o email…"
            className="input lg:col-span-2"
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value as (typeof ROLES)[number])}
            className="select"
          >
            {ROLES.map((r) => (
              <option key={r} value={r} className="bg-[#0B1220]">
                {r}
              </option>
            ))}
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as (typeof STATUS_LIST)[number])}
            className="select"
          >
            {STATUS_LIST.map((s) => (
              <option key={s} value={s} className="bg-[#0B1220]">
                {s}
              </option>
            ))}
          </select>

          <button type="button" className="btn btn-primary">
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
        <div className="card-header">
          <div>
            <div className="text-sm muted">Empleados</div>
            <div className="text-lg font-semibold">Directorio</div>
          </div>
          <button type="button" className="btn btn-ghost">
            Exportar
          </button>
        </div>

        <div className="table-wrap">
          <table className="table">
            <thead className="table-head">
              <tr className="border-b border-white/10">
                <th className="th">ID</th>
                <th className="th">Nombre</th>
                <th className="th">Rol</th>
                <th className="th">Departamento</th>
                <th className="th">Estado</th>
                <th className="th">Email</th>
                <th className="th text-right">Acción</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((e) => (
                <tr key={e.id} className="tr">
                  <td className="td-strong">{e.id}</td>
                  <td className="td-strong">{e.name}</td>
                  <td className="td">{e.role}</td>
                  <td className="td">{e.department}</td>
                  <td className="td">
                    <span className={badgeClass(e.status)}>{e.status}</span>
                  </td>
                  <td className="td">{e.email}</td>
                  <td className="td text-right">
                    <button type="button" className="btn btn-ghost px-3 py-1 text-xs">
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









{/* 

Implementé el módulo de Recursos Humanos para administrar el directorio de empleados desde una vista centralizada y consistente con el resto del ERP.

 Qué incluye
- **Búsqueda** por ID, nombre o email.
- **Filtros** por rol y estado.
- **KPIs** dinámicos según filtros aplicados (Total, Activos, Inactivos).
- **Tabla** con información principal y acción “Ver”.

 Estructura del código
- `HRPage.tsx`
  - Gestiona filtros con `useState`.
  - Calcula listado filtrado y KPIs con `useMemo` para optimización.
  - Renderiza badges por estado con estilos reutilizables.

 Estilos
Se utilizan clases globales definidas en `src/index.css` (`@layer components`):
- `page`, `card-pad`, `card-header`
- `input`, `select`
- `btn`, `btn-primary`, `btn-ghost`
- `table`, `th`, `td`, `tr`
- `badge` (variantes)

Integración backend sugerida
Endpoint recomendado:

GET /hr/employees?query=&role=&status=

Respuesta esperada (ejemplo):

[
  {
    "id": "EMP-001",
    "name": "Alex Morgan",
    "role": "Admin",
    "department": "Sistemas",
    "status": "Activo",
    "email": "alex@gmail.com"
  }
] */}