import React, { useMemo, useState } from "react";
import Card from "../components/ui/Card";
import Modal from "../components/ui/Modal";

type CrmType = "Empresa" | "Persona";
type CrmStatus = "Activo" | "Prospecto" | "Inactivo";

type CrmRecord = {
  id: string;
  type: CrmType;
  name: string;
  owner: string;
  status: CrmStatus;
  email: string;
  phone: string;
};

const TYPES: Array<"Todos" | CrmType> = ["Todos", "Empresa", "Persona"];
const STATUS: Array<"Todos" | CrmStatus> = ["Todos", "Activo", "Prospecto", "Inactivo"];

const RECORDS_SEED: CrmRecord[] = [
  { id: "CRM-001", type: "Empresa", name: "TechCorp", owner: "Ventas", status: "Activo", email: "contact@techcorp.com", phone: "+506 8888-1111" },
  { id: "CRM-002", type: "Empresa", name: "Municipalidad de Upala", owner: "Ventas", status: "Prospecto", email: "info@upala.go.cr", phone: "+506 2460-0000" },
  { id: "CRM-003", type: "Persona", name: "María López", owner: "CRM", status: "Activo", email: "maria.lopez@email.com", phone: "+506 8888-2222" },
  { id: "CRM-004", type: "Persona", name: "Carlos Gómez", owner: "CRM", status: "Inactivo", email: "carlos.g@email.com", phone: "+506 8888-3333" },
  { id: "CRM-005", type: "Empresa", name: "Constructora Norte", owner: "Ventas", status: "Activo", email: "ventas@constructora.com", phone: "+506 8888-4444" },
  { id: "CRM-006", type: "Empresa", name: "Servicios del Pacífico", owner: "Operaciones", status: "Prospecto", email: "hello@pacifico.com", phone: "+506 8888-5555" },
];

function badgeClass(status: CrmStatus) {
  if (status === "Activo") return "badge badge-success";
  if (status === "Prospecto") return "badge badge-info";
  return "badge border-white/10 bg-white/5 text-white/70";
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

function nextCrmId(existing: CrmRecord[]) {
  const nums = existing
    .map((r) => Number(r.id.replace("CRM-", "")))
    .filter((n) => Number.isFinite(n));
  const next = (nums.length ? Math.max(...nums) : 0) + 1;
  return `CRM-${String(next).padStart(3, "0")}`;
}

export default function CRMPage() {
  // data
  const [records, setRecords] = useState<CrmRecord[]>(RECORDS_SEED);

  // filters
  const [q, setQ] = useState<string>("");
  const [type, setType] = useState<(typeof TYPES)[number]>("Todos");
  const [status, setStatus] = useState<(typeof STATUS)[number]>("Todos");

  // modal
  const [open, setOpen] = useState(false);

  // form (minimal)
  const [form, setForm] = useState<Omit<CrmRecord, "id">>({
    type: "Empresa",
    name: "",
    owner: "Ventas",
    status: "Prospecto",
    email: "",
    phone: "",
  });

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();

    return records.filter((r) => {
      const byQ =
        term.length === 0 ||
        r.id.toLowerCase().includes(term) ||
        r.name.toLowerCase().includes(term) ||
        r.email.toLowerCase().includes(term) ||
        r.phone.toLowerCase().includes(term);

      const byType = type === "Todos" || r.type === type;
      const byStatus = status === "Todos" || r.status === status;

      return byQ && byType && byStatus;
    });
  }, [records, q, type, status]);

  const kpis = useMemo(() => {
    const total = filtered.length;
    const companies = filtered.filter((r) => r.type === "Empresa").length;
    const people = filtered.filter((r) => r.type === "Persona").length;
    const prospects = filtered.filter((r) => r.status === "Prospecto").length;
    return { total, companies, people, prospects };
  }, [filtered]);

  function resetForm() {
    setForm({
      type: "Empresa",
      name: "",
      owner: "Ventas",
      status: "Prospecto",
      email: "",
      phone: "",
    });
  }

  function openModal() {
    resetForm();
    setOpen(true);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    // minimal required fields
    if (!form.name.trim() || !form.email.trim()) return;

    setRecords((prev) => [{ id: nextCrmId(prev), ...form }, ...prev]);
    setOpen(false);
  }

  return (
    <div className="page">
      {/* Filters */}
      <Card className="card-pad">
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-6">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por nombre, email, teléfono o ID…"
            className="input lg:col-span-2"
          />

          <select
            value={type}
            onChange={(e) => setType(e.target.value as (typeof TYPES)[number])}
            className="select"
          >
            {TYPES.map((t) => (
              <option key={t} value={t} className="bg-[#0B1220]">
                {t}
              </option>
            ))}
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as (typeof STATUS)[number])}
            className="select"
          >
            {STATUS.map((s) => (
              <option key={s} value={s} className="bg-[#0B1220]">
                {s}
              </option>
            ))}
          </select>

          <button type="button" className="btn btn-primary" onClick={openModal}>
            + Nuevo registro
          </button>

          <button type="button" className="btn btn-ghost">
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
        <div className="card-header">
          <div>
            <div className="text-sm muted">CRM</div>
            <div className="text-lg font-semibold">Cuentas y contactos</div>
          </div>
        </div>

        <div className="table-wrap">
          <table className="table">
            <thead className="table-head">
              <tr className="border-b border-white/10">
                <th className="th">ID</th>
                <th className="th">Tipo</th>
                <th className="th">Nombre</th>
                <th className="th">Owner</th>
                <th className="th">Estado</th>
                <th className="th">Email</th>
                <th className="th">Teléfono</th>
                <th className="th text-right">Acción</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="tr">
                  <td className="td-strong">{r.id}</td>
                  <td className="td">{r.type}</td>
                  <td className="td-strong">{r.name}</td>
                  <td className="td">{r.owner}</td>
                  <td className="td">
                    <span className={badgeClass(r.status)}>{r.status}</span>
                  </td>
                  <td className="td">{r.email}</td>
                  <td className="td">{r.phone}</td>
                  <td className="td text-right">
                    <button className="rounded-lg border border-white/10 px-3 py-1 text-xs hover:bg-white/10">
                    Ver
                   </button>
                   

              <button
               className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs text-red-200 hover:bg-red-500/15"
                  onClick={() => setRecords((prev) => prev.filter((x) => x.id !== r.id))}
               >
                 Eliminar
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

      {/* Modal */}
      <Modal
        open={open}
        title="Nuevo registro CRM"
        onClose={() => setOpen(false)}
        footer={
          <>
            <button type="button" className="btn btn-ghost" onClick={() => setOpen(false)}>
              Cancelar
            </button>
            <button type="submit" form="crm-form" className="btn btn-primary">
              Guardar
            </button>
          </>
        }
      >
        <form id="crm-form" onSubmit={onSubmit} className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <div className="text-sm muted mb-1">Tipo</div>
              <select
                className="select"
                value={form.type}
                onChange={(e) => setForm((p) => ({ ...p, type: e.target.value as CrmType }))}
              >
                <option className="bg-[#0B1220]" value="Empresa">Empresa</option>
                <option className="bg-[#0B1220]" value="Persona">Persona</option>
              </select>
            </div>

            <div>
              <div className="text-sm muted mb-1">Estado</div>
              <select
                className="select"
                value={form.status}
                onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as CrmStatus }))}
              >
                <option className="bg-[#0B1220]" value="Prospecto">Prospecto</option>
                <option className="bg-[#0B1220]" value="Activo">Activo</option>
                <option className="bg-[#0B1220]" value="Inactivo">Inactivo</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <div className="text-sm muted mb-1">Nombre</div>
              <input
                className="input"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="Nombre de empresa o persona"
              />
            </div>

            <div>
              <div className="text-sm muted mb-1">Owner</div>
              <input
                className="input"
                value={form.owner}
                onChange={(e) => setForm((p) => ({ ...p, owner: e.target.value }))}
                placeholder="Ej: Ventas"
              />
            </div>

            <div>
              <div className="text-sm muted mb-1">Teléfono</div>
              <input
                className="input"
                value={form.phone}
                onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                placeholder="+506 8888-0000"
              />
            </div>

            <div className="sm:col-span-2">
              <div className="text-sm muted mb-1">Email</div>
              <input
                className="input"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                placeholder="correo@empresa.com"
              />
            </div>
          </div>

          <div className="text-xs text-white/40">
            *Campos mínimos para demo. El backend puede agregar campos (dirección, industria, pipeline, etc.) sin cambiar el layout.
          </div>
        </form>
      </Modal>
    </div>
  );
}







{/* 

Implementé el módulo de CRM para gestionar cuentas (empresas) y contactos (personas) desde una vista centralizada.  
La pantalla permite filtrar, buscar y revisar registros de forma rápida, manteniendo una UI consistente con el resto del ERP.

 Qué incluye
- Búsqueda global por ID, nombre, email o teléfono.
- Filtros por tipo (Empresa/Persona) y estado (Activo/Prospecto/Inactivo).
- KPIs que se recalculan en base a los filtros aplicados.
- Tabla con listado de registros y acción “Ver”.

Estructura del código
- `CRMPage.tsx`
  - Contiene la lógica de filtros/búsqueda con `useMemo` para optimizar el rendimiento.
  - Calcula KPIs desde la lista filtrada para mantener consistencia.
  - Renderiza tabla y badges de estado.

  Estilos
Se usan clases reutilizables definidas en `src/index.css` (`@layer components`) para mantener orden:
- `page`, `card`, `card-pad`, `card-header`
- `input`, `select`
- `btn`, `btn-primary`, `btn-ghost`
- `table`, `th`, `td`, `tr`
- `badge` (y variantes)

### Integración con backend
El módulo está listo para reemplazar el arreglo mock por datos reales.  
La integración recomendada es un endpoint tipo:

- `GET /crm/records?query=&type=&status=`

El frontend puede mapear la respuesta a la tabla sin cambiar el layout.*/}