import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import Card from "../components/ui/Card";

type Period = "month" | "quarter";

type Stat = {
  label: string;
  value: string;
  note: string;
};

type AlertItem = {
  title: string;
  meta: string;
  severity: "info" | "warning" | "critical";
};

type ActivityPoint = {
  name: string; // label (Mes o Semana)
  value: number;
};

function StatCard({ label, value, note }: Stat) {
  return (
    <Card className="p-4">
      <div className="text-sm text-white/60">{label}</div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
      <div className="mt-2 text-xs text-white/50">{note}</div>
    </Card>
  );
}

function Badge({ active, children, onClick }: { active: boolean; children: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={[
        "rounded-full border px-3 py-1 text-xs transition",
        active
          ? "border-white/20 bg-white/10 text-white"
          : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10",
      ].join(" ")}
      type="button"
    >
      {children}
    </button>
  );
}

function severityStyles(sev: AlertItem["severity"]) {
  if (sev === "critical") return "border-red-500/20 bg-red-500/10";
  if (sev === "warning") return "border-yellow-500/20 bg-yellow-500/10";
  return "border-white/10 bg-black/20";
}

export default function DashboardPage() {
  const [period, setPeriod] = useState<Period>("month");

  const stats: Stat[] = useMemo(
    () => [
      { label: "Inventario crítico", value: "12 ítems", note: "Revisar reposición" },
      { label: "RRHH", value: "24 empleados", note: "3 vacaciones próximas" },
      { label: "CRM", value: "38 interacciones", note: "Últimos 7 días" },
      { label: "Ingresos", value: "$24.5K", note: "Estimado del mes" },
    ],
    []
  );

  const alerts: AlertItem[] = useMemo(
    () => [
      { title: "Stock bajo: Tornillos M8", meta: "Bodega Central · 2h", severity: "warning" },
      { title: "Orden bloqueada en Línea C", meta: "Operaciones · 20 min", severity: "critical" },
      { title: "Factura por aprobar", meta: "Finanzas · 3d", severity: "info" },
    ],
    []
  );

  const data: ActivityPoint[] = useMemo(() => {
    if (period === "month") {
      return [
        { name: "Ene", value: 18 },
        { name: "Feb", value: 22 },
        { name: "Mar", value: 26 },
        { name: "Abr", value: 21 },
        { name: "May", value: 29 },
        { name: "Jun", value: 33 },
        { name: "Jul", value: 31 },
        { name: "Ago", value: 36 },
        { name: "Sep", value: 28 },
        { name: "Oct", value: 34 },
        { name: "Nov", value: 39 },
        { name: "Dic", value: 41 },
      ];
    }
    // quarter (últimas 12 semanas)
    return [
      { name: "S1", value: 14 },
      { name: "S2", value: 17 },
      { name: "S3", value: 16 },
      { name: "S4", value: 20 },
      { name: "S5", value: 19 },
      { name: "S6", value: 22 },
      { name: "S7", value: 24 },
      { name: "S8", value: 23 },
      { name: "S9", value: 26 },
      { name: "S10", value: 28 },
      { name: "S11", value: 27 },
      { name: "S12", value: 30 },
    ];
  }, [period]);

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} note={s.note} />
        ))}
      </div>

      {/* Main */}
      <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        {/* Chart widget */}
        <Card className="p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-sm text-white/60">Rendimiento</div>
              <div className="mt-1 text-lg font-semibold">Actividad ({period === "month" ? "Mensual" : "Trimestral"})</div>
            </div>

            <div className="flex gap-2">
              <Badge active={period === "month"} onClick={() => setPeriod("month")}>
                Mes
              </Badge>
              <Badge active={period === "quarter"} onClick={() => setPeriod("quarter")}>
                Trimestre
              </Badge>
            </div>
          </div>

          <div className="mt-4 h-[260px] rounded-xl border border-white/10 bg-black/20 p-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="name" tick={{ fill: "rgba(255,255,255,0.55)", fontSize: 12 }} axisLine={{ opacity: 0.15 }} tickLine={{ opacity: 0.15 }} />
                <YAxis tick={{ fill: "rgba(255,255,255,0.55)", fontSize: 12 }} axisLine={{ opacity: 0.15 }} tickLine={{ opacity: 0.15 }} />
                <Tooltip
                  contentStyle={{
                    background: "rgba(10,17,30,0.95)",
                    border: "1px solid rgba(255,255,255,0.10)",
                    borderRadius: 12,
                    color: "white",
                  }}
                  labelStyle={{ color: "rgba(255,255,255,0.7)" }}
                />
                <Area type="monotone" dataKey="value" stroke="rgba(255,255,255,0.85)" fill="rgba(255,255,255,0.12)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 text-xs text-white/50">
            Consejo: este widget se puede volver configurable (por rol o por usuario) sin cambiar la UI.
          </div>
        </Card>

        {/* Alerts widget */}
        <Card className="p-4">
          <div className="text-sm text-white/60">Alertas</div>
          <div className="mt-1 text-lg font-semibold">Acciones pendientes</div>

          <div className="mt-4 space-y-3">
            {alerts.map((a) => (
              <div key={a.title} className={`rounded-xl border p-3 ${severityStyles(a.severity)}`}>
                <div className="text-sm font-medium">{a.title}</div>
                <div className="text-xs text-white/50">{a.meta}</div>
              </div>
            ))}
          </div>

          <button className="mt-4 w-full rounded-xl bg-white/10 px-4 py-2 text-sm hover:bg-white/15">
            Crear reporte
          </button>
        </Card>
      </div>
    </div>
  );
}
