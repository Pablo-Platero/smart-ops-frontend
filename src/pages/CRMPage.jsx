import { useMemo, useState } from "react";
import Card from "../components/ui/Card";

const TYPES = ["Todos", "Empresa", "Persona"];
const STATUS = ["Todos", "Activo", "Prospecto", "Inactivo"];

const RECORDS = [
  { id: "CRM-001", type: "Empresa", name: "TechCorp", owner: "Ventas", status: "Activo", email: "contact@techcorp.com", phone: "+506 8888-1111" },
  { id: "CRM-002", type: "Empresa", name: "Municipalidad de Upala", owner: "Ventas", status: "Prospecto", email: "info@upala.go.cr", phone: "+506 2460-0000" },
  { id: "CRM-003", type: "Persona", name: "María López", owner: "CRM", status: "Activo", email: "maria.lopez@email.com", phone: "+506 8888-2222" },
  { id: "CRM-004", type: "Persona", name: "Carlos Gómez", owner: "CRM", status: "Inactivo", email: "carlos.g@email.com", phone: "+506 8888-3333" },
  { id: "CRM-005", type: "Empresa", name: "Constructora Norte", owner: "Ventas", status: "Activo", email: "ventas@constructora.com", phone: "+506 8888-4444" },
  { id: "CRM-006", type: "Empresa", name: "Servicios del Pacífico", owner: "Operaciones", status: "Prospecto", email: "hello@pacifico.com", phone: "+506 8888-5555" },
];

function badgeClass(status) {
  if (status === "Activo") return "bg-green-500/15 text-green-300 border-green-500/20";
  if (status === "Prospecto") return "bg-blue-500/15 text-blue-300 border-blue-500/20";
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

export default function CRMPage() {
  const [q, setQ] = useState("");
  const [type, setType] = useState("Todos");
  const [status, setStatus] = useState("Todos");

  const filtered = useMemo(() => {
    return RECORDS.filter((r) => {
      const byQ =
        r.id.toLowerCase().includes(q.toLowerCase()) ||
        r.name.toLowerCase().includes(q.toLowerCase()) ||
        r.email.toLowerCase().includes(q.toLowerCase()) ||
        r.phone.toLowerCase().includes(q.toLowerCase());

      const byType = type === "Todos" || r.type === type;
      const byStatus = status === "Todos" || r.status === status;

      return byQ && byType && byStatus;
    });
  }, [q, type, status]);

  const kpis = useMemo(() => {
    const total = filtered.length;
    const companies = filtered.filter((r) => r.type === "Empresa").length;
    const people = filtered.filter((r) => r.type === "Persona").length;
    const prospects = filtered.filter((r) => r.status === "Prospecto").length;
    return { total, companies, people, prospects };
  }, [filtered]);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="p-4">
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-6">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por nombre, email, teléfono o ID…"
            className="lg:col-span-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm outline-none placeholder:text-white/40"
          />

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none"
          >
            {TYPES.map((t) => (
              <option key={t} value={t} className="bg-[#0B1220]">
                {t}
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
            + Nuevo registro
          </button>

          <button className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10">
            Exportar
          </button>
        </div>
      </Card>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Stat label="Total" value={kpis.total} note="Filtrados" />
        <Stat label="Empresas" value={kpis.companies} note="Cuentas" />
        <Stat label="Personas" value={kpis.people} note="Contactos" />
        <Stat label="Prospectos" value={kpis.prospects} note="Por trabajar" />
      </div>

      {/* Table */}
      <Card className="p-0 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <div>
            <div className="text-sm text-white/60">CRM</div>
            <div className="text-lg font-semibold">Cuentas y contactos</div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-white/60">
              <tr className="border-b border-white/10">
                <th className="px-4 py-3 text-left font-medium">ID</th>
                <th className="px-4 py-3 text-left font-medium">Tipo</th>
                <th className="px-4 py-3 text-left font-medium">Nombre</th>
                <th className="px-4 py-3 text-left font-medium">Owner</th>
                <th className="px-4 py-3 text-left font-medium">Estado</th>
                <th className="px-4 py-3 text-left font-medium">Email</th>
                <th className="px-4 py-3 text-left font-medium">Teléfono</th>
                <th className="px-4 py-3 text-right font-medium">Acción</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-b border-white/10 hover:bg-white/5">
                  <td className="px-4 py-3 text-white/90">{r.id}</td>
                  <td className="px-4 py-3 text-white/80">{r.type}</td>
                  <td className="px-4 py-3 text-white/90">{r.name}</td>
                  <td className="px-4 py-3 text-white/80">{r.owner}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs ${badgeClass(r.status)}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-white/80">{r.email}</td>
                  <td className="px-4 py-3 text-white/80">{r.phone}</td>
                  <td className="px-4 py-3 text-right">
                    <button className="rounded-lg border border-white/10 px-3 py-1 text-xs hover:bg-white/10">
                      Ver
                    </button>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td className="px-4 py-10 text-center text-white/50" colSpan={8}>
                    No hay registros con esos filtros
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
