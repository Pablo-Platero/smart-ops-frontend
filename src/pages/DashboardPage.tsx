import React from "react";
import Card from "../components/ui/Card";
import ActivityChart from "../components/charts/ActivityChart";

type StatCardProps = {
  label: string;
  value: string;
  note: string;
};

function StatCard({ label, value, note }: StatCardProps) {
  return (
    <Card className="card-pad">
      <div className="text-sm muted">{label}</div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
      <div className="mt-2 text-xs muted-2">{note}</div>
    </Card>
  );
}

const mockActivity = [
  { name: "Lun", value: 400 },
  { name: "Mar", value: 320 },
  { name: "Mié", value: 520 },
  { name: "Jue", value: 260 },
  { name: "Vie", value: 720 },
  { name: "Sáb", value: 460 },
  { name: "Dom", value: 380 },
];

export default function DashboardPage() {
  return (
    <div className="page">
      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Inventario crítico" value="12 ítems" note="Revisar reposición" />
        <StatCard label="Órdenes activas" value="6" note="2 en riesgo" />
        <StatCard label="Leads nuevos" value="38" note="Últimos 7 días" />
        <StatCard label="Ingresos" value="$24.5K" note="Estimado del mes" />
      </div>

      {/* Main */}
      <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        {/* Performance */}
        <Card className="card-pad">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm muted">Rendimiento</div>
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

          <div className="mt-4">
            <ActivityChart data={mockActivity} />
          </div>

          <div className="mt-3 text-xs text-white/50">
            *Datos mock para layout. El backend puede reemplazar `mockActivity` con respuesta de `/dashboard/activity`.
          </div>
        </Card>

        {/* Alerts */}
        <Card className="card-pad">
          <div className="text-sm muted">Alertas</div>
          <div className="mt-1 text-lg font-semibold">Acciones pendientes</div>

          <div className="mt-4 space-y-3">
            <div className="rounded-xl border border-white/10 bg-black/20 p-3">
              <div className="text-sm font-medium">Stock bajo: Tornillos M8</div>
              <div className="text-xs muted-2">Bodega Central · 2h</div>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/20 p-3">
              <div className="text-sm font-medium">Orden “Municipal” en riesgo</div>
              <div className="text-xs muted-2">Retraso en entregables · 1d</div>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/20 p-3">
              <div className="text-sm font-medium">Factura por aprobar</div>
              <div className="text-xs muted-2">Finanzas · 3d</div>
            </div>
          </div>

          <button className="btn btn-primary mt-4 w-full" type="button">
            Crear reporte
          </button>
        </Card>
      </div>
    </div>
  );
}


{/* Implementé el Dashboard como el panel central del ERP para proveer visibilidad rápida del estado del sistema.  
La vista está diseñada para mostrar KPIs, una gráfica de actividad y un bloque de alertas/pendientes.

 Objetivo
- Proveer un resumen ejecutivo de alto nivel.
- Centralizar métricas clave (inventarios, operaciones, CRM y finanzas).
- Preparar la vista para conexión directa con el backend sin cambiar el layout.


 Componentes

 src/pages/DashboardPage.tsx
Responsable de renderizar:
- **KPIs** (4 tarjetas con métricas principales)
- **Gráfica de actividad** (componente Recharts)
- **Alertas / acciones pendientes** (lista de items)

Actualmente utiliza datos mock para fines de UI/estructura.  
Los datos pueden reemplazarse por respuestas del backend sin modificar el diseño.

---

src/components/charts/ActivityChart.tsx
Componente reutilizable que implementa una gráfica lineal usando Recharts.
 */}