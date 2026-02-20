import { useMemo, useState } from "react";
import Card from "../components/ui/Card";
import { useForm, type Resolver, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type Category = "Materia prima" | "Producto terminado" | "En tránsito";
type Tab = "Todos" | Category;

type StockLevel = "ok" | "low" | "critical" | "none";

type InventoryItem = {
  id: number;
  name: string;
  category: Category;
  stock: number;
  location: string; // almacén / bodega
  reorderPoint: number; // punto de reorden
};

const TABS: Tab[] = ["Todos", "Materia prima", "Producto terminado", "En tránsito"];

const INITIAL_ITEMS: InventoryItem[] = [
  { id: 1, name: "Tornillos M8", category: "Materia prima", stock: 12, location: "Bodega Central", reorderPoint: 10 },
  { id: 2, name: "Placas metálicas", category: "Materia prima", stock: 3, location: "Bodega Norte", reorderPoint: 8 },
  { id: 3, name: "Equipo ensamblado A1", category: "Producto terminado", stock: 25, location: "Planta 1", reorderPoint: 5 },
  { id: 4, name: "Motor eléctrico", category: "En tránsito", stock: 0, location: "Proveedor", reorderPoint: 6 },
  { id: 5, name: "Cable industrial", category: "Materia prima", stock: 40, location: "Bodega Central", reorderPoint: 12 },
];

function stockLevel(item: InventoryItem): StockLevel {
  if (item.stock <= 0) return "none";
  if (item.stock <= Math.max(1, Math.floor(item.reorderPoint * 0.5))) return "critical";
  if (item.stock <= item.reorderPoint) return "low";
  return "ok";
}

function stockText(item: InventoryItem) {
  if (item.stock <= 0) return "Sin stock";
  return `${item.stock} uds`;
}

function stockColor(level: StockLevel) {
  if (level === "none") return "text-red-300";
  if (level === "critical") return "text-red-300";
  if (level === "low") return "text-yellow-300";
  return "text-green-300";
}

function badgeClass(level: StockLevel) {
  if (level === "critical" || level === "none") return "bg-red-500/15 text-red-300 border-red-500/20";
  if (level === "low") return "bg-yellow-500/15 text-yellow-300 border-yellow-500/20";
  return "bg-green-500/15 text-green-300 border-green-500/20";
}

function Stat({ label, value, note }: { label: string; value: string; note: string }) {
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
      <div className="absolute left-1/2 top-1/2 w-[92vw] max-w-2xl -translate-x-1/2 -translate-y-1/2">
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

const movementSchema = z.object({
  itemId: z.coerce.number().int().positive(),
  type: z.enum(["Entrada", "Salida", "Ajuste"]),
  qty: z.coerce.number().int().min(1, "Cantidad mínima 1"),
  note: z.string().optional(),
});

type MovementForm = z.infer<typeof movementSchema>;

export default function InventoriesPage() {
  const [items, setItems] = useState<InventoryItem[]>(INITIAL_ITEMS);
  const [activeTab, setActiveTab] = useState<Tab>("Todos");
  const [search, setSearch] = useState<string>("");
  const [openMove, setOpenMove] = useState<boolean>(false);

  const form = useForm<MovementForm>({
    resolver: zodResolver(movementSchema) as Resolver<MovementForm>,
    defaultValues: {
      itemId: INITIAL_ITEMS[0]?.id ?? 1,
      type: "Entrada",
      qty: 1,
      note: "",
    },
  });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return items
      .filter((item) => {
        const byTab = activeTab === "Todos" || item.category === activeTab;
        const bySearch = q.length === 0 || item.name.toLowerCase().includes(q);
        return byTab && bySearch;
      })
      .sort((a, b) => {
        // prioridad: críticos primero
        const la = stockLevel(a);
        const lb = stockLevel(b);
        const p = (lvl: StockLevel) =>
          lvl === "none" ? 0 : lvl === "critical" ? 1 : lvl === "low" ? 2 : 3;
        return p(la) - p(lb);
      });
  }, [items, activeTab, search]);

  const kpis = useMemo(() => {
    const total = items.length;
    const transit = items.filter((i) => i.category === "En tránsito").length;
    const critical = items.filter((i) => {
      const lvl = stockLevel(i);
      return lvl === "none" || lvl === "critical";
    }).length;
    const low = items.filter((i) => stockLevel(i) === "low").length;
    return { total, transit, critical, low };
  }, [items]);

  const reorderAlerts = useMemo(() => {
    return items
      .filter((i) => {
        const lvl = stockLevel(i);
        return lvl === "low" || lvl === "critical" || lvl === "none";
      })
      .slice(0, 4);
  }, [items]);

  function openMovement() {
    form.reset({
      itemId: items[0]?.id ?? 1,
      type: "Entrada",
      qty: 1,
      note: "",
    });
    setOpenMove(true);
  }

  const onSubmitMovement: SubmitHandler<MovementForm> = (values) => {
    setItems((prev) =>
      prev.map((it) => {
        if (it.id !== values.itemId) return it;

        let nextStock = it.stock;

        if (values.type === "Entrada") nextStock = it.stock + values.qty;
        if (values.type === "Salida") nextStock = Math.max(0, it.stock - values.qty);
        if (values.type === "Ajuste") nextStock = values.qty; // qty = stock final

        return { ...it, stock: nextStock };
      })
    );

    setOpenMove(false);
  };

  return (
    <div className="space-y-6">
      {/* Header + Actions */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <input
          placeholder="Buscar inventario…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-80 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm outline-none placeholder:text-white/40"
        />

        <div className="flex gap-2">
          <button className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10">
            + Nuevo ítem
          </button>
          <button onClick={openMovement} className="rounded-xl bg-white/10 px-4 py-2 text-sm hover:bg-white/15">
            + Nuevo movimiento
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Stat label="Ítems" value={`${kpis.total}`} note="Total registrados" />
        <Stat label="Críticos" value={`${kpis.critical}`} note="Sin stock o muy bajo" />
        <Stat label="Bajo stock" value={`${kpis.low}`} note="Reorden sugerido" />
        <Stat label="En tránsito" value={`${kpis.transit}`} note="Proveedor / logística" />
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={[
              "rounded-full px-4 py-1.5 text-sm border transition",
              activeTab === tab
                ? "bg-white/10 border-white/20 text-white"
                : "border-white/10 text-white/60 hover:bg-white/5",
            ].join(" ")}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Reorder alerts */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-white/60">Alertas</div>
            <div className="text-lg font-semibold">Reorden y trazabilidad</div>
          </div>
          <div className="text-xs text-white/50">Top {reorderAlerts.length}</div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {reorderAlerts.map((it) => {
            const lvl = stockLevel(it);
            return (
              <div key={it.id} className="rounded-xl border border-white/10 bg-black/20 p-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{it.name}</div>
                    <div className="text-xs text-white/50">
                      {it.location} · Reorden: {it.reorderPoint}
                    </div>
                  </div>
                  <span className={`shrink-0 inline-flex items-center rounded-full border px-3 py-1 text-xs ${badgeClass(lvl)}`}>
                    {lvl === "none" ? "Sin stock" : lvl === "critical" ? "Crítico" : "Bajo"}
                  </span>
                </div>
              </div>
            );
          })}

          {reorderAlerts.length === 0 && (
            <div className="text-sm text-white/60">No hay alertas de reorden por ahora.</div>
          )}
        </div>
      </Card>

      {/* Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => {
          const lvl = stockLevel(item);
          return (
            <Card key={item.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm text-white/60">{item.category}</div>
                  <div className="mt-1 truncate text-lg font-semibold">{item.name}</div>
                </div>

                <div className="text-right">
                  <div className={`text-sm font-semibold ${stockColor(lvl)}`}>{stockText(item)}</div>
                  <div className="mt-1 text-xs text-white/50">Reorden: {item.reorderPoint}</div>
                </div>
              </div>

              <div className="mt-3 text-sm text-white/60">
                Ubicación: <span className="text-white/80">{item.location}</span>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs ${badgeClass(lvl)}`}>
                  {lvl === "ok" ? "OK" : lvl === "low" ? "Bajo" : lvl === "critical" ? "Crítico" : "Sin stock"}
                </span>

                <button className="rounded-lg border border-white/10 px-3 py-1 text-xs hover:bg-white/10">
                  Ver detalle
                </button>
              </div>
            </Card>
          );
        })}

        {filtered.length === 0 && (
          <div className="col-span-full text-center text-white/50">No hay resultados</div>
        )}
      </div>

      {/* Modal Movement */}
      <Modal open={openMove} title="Nuevo movimiento" onClose={() => setOpenMove(false)}>
        <form onSubmit={form.handleSubmit(onSubmitMovement)} className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs text-white/60">Ítem</label>
              <select
                {...form.register("itemId")}
                className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none"
              >
                {items.map((i) => (
                  <option key={i.id} value={i.id} className="bg-[#0B1220]">
                    {i.name} · {i.location}
                  </option>
                ))}
              </select>
              {form.formState.errors.itemId && (
                <div className="mt-1 text-xs text-red-300">{form.formState.errors.itemId.message}</div>
              )}
            </div>

            <div>
              <label className="text-xs text-white/60">Tipo de movimiento</label>
              <select
                {...form.register("type")}
                className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none"
              >
                <option value="Entrada" className="bg-[#0B1220]">Entrada</option>
                <option value="Salida" className="bg-[#0B1220]">Salida</option>
                <option value="Ajuste" className="bg-[#0B1220]">Ajuste (stock final)</option>
              </select>
              {form.formState.errors.type && (
                <div className="mt-1 text-xs text-red-300">{form.formState.errors.type.message}</div>
              )}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs text-white/60">Cantidad</label>
              <input
                type="number"
                step="1"
                {...form.register("qty")}
                className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none"
              />
              {form.formState.errors.qty && (
                <div className="mt-1 text-xs text-red-300">{form.formState.errors.qty.message}</div>
              )}
              <div className="mt-1 text-xs text-white/50">
                Entrada/Salida: cantidad del movimiento. Ajuste: stock final.
              </div>
            </div>

            <div>
              <label className="text-xs text-white/60">Nota (opcional)</label>
              <input
                {...form.register("note")}
                placeholder="Ej: OC-2031, ajuste por conteo físico..."
                className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none placeholder:text-white/40"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setOpenMove(false)}
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