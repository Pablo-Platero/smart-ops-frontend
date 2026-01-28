import Card from "../components/ui/Card";

function StatCard({ label, value, note }) {
  return (
    <Card className="p-4">
      <div className="text-sm text-white/60">{label}</div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
      <div className="mt-2 text-xs text-white/50">{note}</div>
    </Card>
  );
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Inventario crítico" value="12 ítems" note="Revisar reposición" />
        <StatCard label="Proyectos activos" value="6" note="2 en riesgo" />
        <StatCard label="Leads nuevos" value="38" note="Últimos 7 días" />
        <StatCard label="Ingresos" value="$24.5K" note="Estimado del mes" />
      </div>

      {/* Main */}
      <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-white/60">Rendimiento</div>
              <div className="mt-1 text-lg font-semibold">Actividad mensual</div>
            </div>
            <div className="flex gap-2">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                Mes
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                Trimestre
              </span>
            </div>
          </div>

          <div className="mt-4 h-[260px] rounded-xl border border-white/10 bg-black/20">
            <div className="flex h-full items-center justify-center text-sm text-white/50">
              Gráfica (placeholder)
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="text-sm text-white/60">Alertas</div>
          <div className="mt-1 text-lg font-semibold">Acciones pendientes</div>

          <div className="mt-4 space-y-3">
            <div className="rounded-xl border border-white/10 bg-black/20 p-3">
              <div className="text-sm font-medium">Stock bajo: Tornillos M8</div>
              <div className="text-xs text-white/50">Bodega Central · 2h</div>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/20 p-3">
              <div className="text-sm font-medium">Proyecto “Municipal” en riesgo</div>
              <div className="text-xs text-white/50">Retraso en entregables · 1d</div>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/20 p-3">
              <div className="text-sm font-medium">Factura por aprobar</div>
              <div className="text-xs text-white/50">Finanzas · 3d</div>
            </div>
          </div>

          <button className="mt-4 w-full rounded-xl bg-white/10 px-4 py-2 text-sm hover:bg-white/15">
            Crear reporte
          </button>
        </Card>
      </div>
    </div>
  );
}
