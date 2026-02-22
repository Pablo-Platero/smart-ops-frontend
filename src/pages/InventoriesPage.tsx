import React, { useMemo, useState } from "react";
import Card from "../components/ui/Card";
import Modal from "../components/ui/Modal";
import { color } from "framer-motion";

type InventoryCategory = "Materia prima" | "Producto terminado" | "En tránsito";

type InventoryItem = {
  id: number;
  name: string;
  category: InventoryCategory;
  stock: number;
  location: string;
};

const TABS: Array<"Todos" | InventoryCategory> = [
  "Todos",
  "Materia prima",
  "Producto terminado",
  "En tránsito",
];

const ITEMS_SEED: InventoryItem[] = [
  { id: 1, name: "Tornillos M8", category: "Materia prima", stock: 12, location: "Bodega Central" },
  { id: 2, name: "Placas metálicas", category: "Materia prima", stock: 3, location: "Bodega Norte" },
  { id: 3, name: "Equipo ensamblado A1", category: "Producto terminado", stock: 25, location: "Planta 1" },
  { id: 4, name: "Motor eléctrico", category: "En tránsito", stock: 0, location: "Proveedor" },
  { id: 5, name: "Cable industrial", category: "Materia prima", stock: 40, location: "Bodega Central" },
];

const CRITICAL_STOCK = 3;
const LOW_STOCK = 10;

function stockClass(stock: number) {
  if (stock === 0) return "text-red-300";
  if (stock <= CRITICAL_STOCK) return "text-red-300";
  if (stock < LOW_STOCK) return "text-yellow-300";
  return "text-green-300";
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

function TabButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-full px-4 py-1.5 text-sm border transition",
        active
          ? "bg-white/10 border-white/20 text-white"
          : "border-white/10 text-white/60 hover:bg-white/5 hover:text-white/80",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

export default function InventoriesPage() {
  const [items, setItems] = useState<InventoryItem[]>(ITEMS_SEED);

  // ✅ filtros
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("Todos");
  const [search, setSearch] = useState<string>("");

  // ✅ modal
  const [open, setOpen] = useState<boolean>(false);
  const [form, setForm] = useState<Omit<InventoryItem, "id">>({
    name: "",
    category: "Materia prima",
    stock: 0,
    location: "",
  });

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return items.filter((item) => {
      const byTab = activeTab === "Todos" || item.category === activeTab;
      const bySearch = term.length === 0 || item.name.toLowerCase().includes(term);
      return byTab && bySearch;
    });
  }, [items, activeTab, search]);

  const kpis = useMemo(() => {
    const total = items.length;
    const inTransit = items.filter((i) => i.category === "En tránsito").length;
    const critical = items.filter((i) => i.stock > 0 && i.stock <= CRITICAL_STOCK).length;
    const lowStock = items.filter((i) => i.stock > CRITICAL_STOCK && i.stock < LOW_STOCK).length;
    const outOfStock = items.filter((i) => i.stock === 0).length;
    return { total, inTransit, critical, lowStock, outOfStock };
  }, [items]);

  function resetForm() {
    setForm({
      name: "",
      category: "Materia prima",
      stock: 0,
      location: "",
    });
  }

  function openModal() {
    resetForm();
    setOpen(true);
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const name = form.name.trim();
    const location = form.location.trim();
    if (!name || !location) return;

    setItems((prev) => [{ id: Date.now(), ...form, name, location }, ...prev]);
    setOpen(false);
  }

  return (
    <div className="page space-y-6">
      {/* ✅ Buscador + botón + tabs arriba */}
      <div className="space-y-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <input
            placeholder="Buscar inventario..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-80 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm outline-none placeholder:text-white/40"
          />

          <button type="button" className="btn btn-primary" onClick={openModal}>
            + Nuevo ítem
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {TABS.map((tab) => (
            <TabButton
              key={tab}
              label={tab}
              active={activeTab === tab}
              onClick={() => setActiveTab(tab)}
            />
          ))}
        </div>
      </div>

      {/* ✅ KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Stat label="Items" value={kpis.total} note="Total registrados" />
        <Stat label="Críticos" value={kpis.critical} note={`Stock ≤ ${CRITICAL_STOCK}`} />
        <Stat label="Bajo stock" value={kpis.lowStock} note={`Stock < ${LOW_STOCK}`} />
        <Stat label="En tránsito" value={kpis.inTransit} note="Proveedor / ruta" />
        <Stat label="Sin stock" value={kpis.outOfStock} note="Stock = 0" />
      </div>

      {/* ✅ Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => (
          <Card key={item.id} className="card-pad">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-sm muted">{item.category}</div>
                <div className="mt-1 truncate text-lg font-semibold">{item.name}</div>
              </div>

              <div className={`shrink-0 text-sm font-semibold ${stockClass(item.stock)}`}>
                {item.stock === 0 ? "Sin stock" : `${item.stock} uds`}
              </div>
            </div>

            <div className="mt-3 text-sm muted">
              Ubicación: <span className="text-white/80">{item.location}</span>
            </div>

            <div className="mt-4 flex justify-end">
              <div className="mt-4 flex items-center justify-end gap-2">
              <button className="rounded-lg border border-white/10 px-3 py-1 text-xs hover:bg-white/10">
               Ver
              </button>

              <button
            className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs text-red-200 hover:bg-red-500/15"

               >
              Eliminar
            </button>
              </div>
            </div>
          </Card>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full text-center text-white/50">
            No hay resultados
          </div>
        )}
      </div>

      {/* ✅ Modal */}
      <Modal
        open={open}
        title="Nuevo ítem de inventario"
        onClose={() => setOpen(false)}
        footer={
          <>
            <button type="button" className="btn btn-ghost" onClick={() => setOpen(false)}>
              Cancelar
            </button>
            <button type="submit" form="inv-form" className="btn btn-primary">
              Guardar
            </button>
          </>
        }
      >
        <form id="inv-form" onSubmit={onSubmit} className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <div className="text-sm muted mb-1">Nombre</div>
              <input
                className="input"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="Ej: Tornillos M10"
              />
            </div>

            <div>
              <div className="text-sm muted mb-1">Categoría</div>
              <select
                className="select"
                value={form.category}
                onChange={(e) =>
                  setForm((p) => ({ ...p, category: e.target.value as InventoryCategory }))
                }
              >
                <option className="bg-[#0B1220]" value="Materia prima">
                  Materia prima
                </option>
                <option className="bg-[#0B1220]" value="Producto terminado">
                  Producto terminado
                </option>
                <option className="bg-[#0B1220]" value="En tránsito">
                  En tránsito
                </option>
              </select>
            </div>

            <div>
              <div className="text-sm muted mb-1">Stock</div>
              <input
                className="input"
                type="number"
                value={form.stock}
                onChange={(e) => setForm((p) => ({ ...p, stock: Number(e.target.value) }))}
                min={0}
              />
            </div>

            <div className="sm:col-span-2">
              <div className="text-sm muted mb-1">Ubicación</div>
              <input
                className="input"
                value={form.location}
                onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
                placeholder="Ej: Bodega Central"
              />
            </div>
          </div>

          <div className="text-xs text-white/40">
            *Formulario mínimo para demo. El backend puede agregar SKU, lote, proveedor, etc.
          </div>
        </form>
      </Modal>
    </div>
  );
}

{/*

Implementé el módulo de Inventarios para visualizar y organizar el stock por categorías, facilitando búsquedas rápidas y revisión por estado de inventario.

 Qué incluye
- Búsqueda por nombre de ítem.
- Tabs por categoría:
  - Materia prima
  - Producto terminado
  - En tránsito
- **Vista en cards** con:
  - categoría, nombre, stock y ubicación
- **Indicador visual de stock**:
  - Rojo: sin stock
  - Amarillo: stock bajo
  - Verde: stock saludable

 Estructura del código
- `InventoriesPage.tsx`
  - Controla el tab activo y la búsqueda con `useState`.
  - Filtra items con `useMemo` para optimización.
  - Define `stockClass()` para estilos del estado del stock.
  - Usa `Card` como contenedor reutilizable.

Estilos
Se utilizan clases globales definidas en `src/index.css`:
- `page`, `card-pad`
- `input`
- `btn`, `btn-primary`, `btn-ghost`

### Integración backend sugerida
Endpoint recomendado:

GET /inventories?query=&category=

Ejemplo de respuesta esperada:

[
  {
    "id": 1,
    "name": "Tornillos M8",
    "category": "Materia prima",
    "stock": 12,
    "location": "Bodega Central"
  }
] */}