import { useMemo, useState } from "react";
import Card from "../components/ui/Card";
import { useForm, type Resolver, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type Role = "Admin" | "Logística" | "Finanzas" | "RRHH" | "Ventas" | "Operaciones";
type EmpStatus = "Activo" | "Inactivo";

type Employee = {
  id: string;
  name: string;
  role: Role;
  department: string;
  status: EmpStatus;
  email: string;
};

const ROLES: Array<"Todos" | Role> = ["Todos", "Admin", "Logística", "Finanzas", "RRHH", "Ventas", "Operaciones"];
const STATUS: Array<"Todos" | EmpStatus> = ["Todos", "Activo", "Inactivo"];

const INITIAL_EMPLOYEES: Employee[] = [
  { id: "EMP-001", name: "Alex Morgan", role: "Admin", department: "Sistemas", status: "Activo", email: "alex@smartops.com" },
  { id: "EMP-002", name: "María López", role: "Finanzas", department: "Finanzas", status: "Activo", email: "maria@smartops.com" },
  { id: "EMP-003", name: "Carlos Gómez", role: "Logística", department: "Inventarios", status: "Activo", email: "carlos@smartops.com" },
  { id: "EMP-004", name: "Ana Mora", role: "RRHH", department: "Recursos Humanos", status: "Activo", email: "ana@smartops.com" },
  { id: "EMP-005", name: "Luis Herrera", role: "Operaciones", department: "Producción", status: "Inactivo", email: "luis@smartops.com" },
  { id: "EMP-006", name: "Sofía Vargas", role: "Ventas", department: "CRM", status: "Activo", email: "sofia@smartops.com" },
];

function badgeClass(status: EmpStatus) {
  if (status === "Activo") return "bg-green-500/15 text-green-300 border-green-500/20";
  return "bg-gray-500/15 text-gray-300 border-gray-500/20";
}

function Stat({ label, value, note }: { label: string; value: number; note: string }) {
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
      <div className="absolute left-1/2 top-1/2 w-[92vw] max-w-xl -translate-x-1/2 -translate-y-1/2">
        <Card className="p-0 overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div className="text-sm font-semibold">{title}</div>
            <button
              onClick={onClose}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs hover:bg-white/10"
              type="button"
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

const employeeSchema = z.object({
  name: z.string().min(3, "Nombre muy corto"),
  email: z.string().email("Email inválido"),
  role: z.enum(["Admin", "Logística", "Finanzas", "RRHH", "Ventas", "Operaciones"]),
  department: z.string().min(2, "Departamento requerido"),
  status: z.enum(["Activo", "Inactivo"]),
});

type EmployeeForm = z.infer<typeof employeeSchema>;

export default function HRPage() {
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [q, setQ] = useState<string>("");
  const [role, setRole] = useState<(typeof ROLES)[number]>("Todos");
  const [status, setStatus] = useState<(typeof STATUS)[number]>("Todos");
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<EmployeeForm>({
    resolver: zodResolver(employeeSchema) as Resolver<EmployeeForm>,
    defaultValues: {
      name: "",
      email: "",
      role: "RRHH",
      department: "Recursos Humanos",
      status: "Activo",
    },
  });

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();

    return employees.filter((e) => {
      const byQ =
        query.length === 0 ||
        e.id.toLowerCase().includes(query) ||
        e.name.toLowerCase().includes(query) ||
        e.email.toLowerCase().includes(query);

      const byRole = role === "Todos" || e.role === role;
      const byStatus = status === "Todos" || e.status === status;

      return byQ && byRole && byStatus;
    });
  }, [employees, q, role, status]);

  const kpis = useMemo(() => {
    const total = filtered.length;
    const active = filtered.filter((e) => e.status === "Activo").length;
    const inactive = filtered.filter((e) => e.status === "Inactivo").length;
    return { total, active, inactive };
  }, [filtered]);

  function nextId(items: Employee[]) {
    const nums = items
      .map((x) => Number(x.id.replace("EMP-", "")))
      .filter((n) => Number.isFinite(n));
    const max = nums.length ? Math.max(...nums) : 0;
    const next = String(max + 1).padStart(3, "0");
    return `EMP-${next}`;
  }

  function openNewEmployee() {
    form.reset({
      name: "",
      email: "",
      role: "RRHH",
      department: "Recursos Humanos",
      status: "Activo",
    });
    setOpen(true);
  }

  const onSubmit: SubmitHandler<EmployeeForm> = (values) => {
    const newEmployee: Employee = {
      id: nextId(employees),
      name: values.name,
      email: values.email,
      role: values.role,
      department: values.department,
      status: values.status,
    };

    setEmployees((prev) => [newEmployee, ...prev]);
    setOpen(false);
  };

  function handleView(e: Employee) {
    alert(`Empleado: ${e.name}\nRol: ${e.role}\nEmail: ${e.email}`);
  }

  function handleEdit(e: Employee) {
    // MVP: ejemplo. Después puede abrir modal de edición.
    alert(`Editar: ${e.name} (${e.id})`);
  }

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
            onChange={(e) => setRole(e.target.value as (typeof ROLES)[number])}
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
            onChange={(e) => setStatus(e.target.value as (typeof STATUS)[number])}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none"
          >
            {STATUS.map((s) => (
              <option key={s} value={s} className="bg-[#0B1220]">
                {s}
              </option>
            ))}
          </select>

          <button onClick={openNewEmployee} className="rounded-xl bg-white/10 px-4 py-2 text-sm hover:bg-white/15">
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
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleView(e)}
                        className="rounded-lg border border-white/10 px-3 py-1 text-xs hover:bg-white/10"
                      >
                        Ver
                      </button>
                      <button
                        onClick={() => handleEdit(e)}
                        className="rounded-lg bg-white/10 px-3 py-1 text-xs hover:bg-white/15"
                      >
                        Editar
                      </button>
                    </div>
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

      {/* Modal New Employee */}
      <Modal open={open} title="Nuevo empleado" onClose={() => setOpen(false)}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-xs text-white/60">Nombre completo</label>
            <input
              {...form.register("name")}
              placeholder="Ej: Pablo Platero"
              className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none placeholder:text-white/40"
            />
            {form.formState.errors.name && (
              <div className="mt-1 text-xs text-red-300">{form.formState.errors.name.message}</div>
            )}
          </div>

          <div>
            <label className="text-xs text-white/60">Email</label>
            <input
              {...form.register("email")}
              placeholder="ej: nombre@smartops.com"
              className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none placeholder:text-white/40"
            />
            {form.formState.errors.email && (
              <div className="mt-1 text-xs text-red-300">{form.formState.errors.email.message}</div>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs text-white/60">Rol</label>
              <select
                {...form.register("role")}
                className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none"
              >
                {(["Admin", "Logística", "Finanzas", "RRHH", "Ventas", "Operaciones"] as const).map((r) => (
                  <option key={r} value={r} className="bg-[#0B1220]">
                    {r}
                  </option>
                ))}
              </select>
              {form.formState.errors.role && (
                <div className="mt-1 text-xs text-red-300">{form.formState.errors.role.message}</div>
              )}
            </div>

            <div>
              <label className="text-xs text-white/60">Estado</label>
              <select
                {...form.register("status")}
                className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none"
              >
                {(["Activo", "Inactivo"] as const).map((s) => (
                  <option key={s} value={s} className="bg-[#0B1220]">
                    {s}
                  </option>
                ))}
              </select>
              {form.formState.errors.status && (
                <div className="mt-1 text-xs text-red-300">{form.formState.errors.status.message}</div>
              )}
            </div>
          </div>

          <div>
            <label className="text-xs text-white/60">Departamento</label>
            <input
              {...form.register("department")}
              placeholder="Ej: Recursos Humanos"
              className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none placeholder:text-white/40"
            />
            {form.formState.errors.department && (
              <div className="mt-1 text-xs text-red-300">{form.formState.errors.department.message}</div>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
            >
              Cancelar
            </button>
            <button type="submit" className="rounded-xl bg-white/10 px-4 py-2 text-sm hover:bg-white/15">
              Guardar
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
