import React, { useMemo, useState } from "react";
import Card from "../components/ui/Card";

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

const ITEMS: InventoryItem[] = [
  { id: 1, name: "Tornillos M8", category: "Materia prima", stock: 12, location: "Bodega Central" },
  { id: 2, name: "Placas metálicas", category: "Materia prima", stock: 3, location: "Bodega Norte" },
  { id: 3, name: "Equipo ensamblado A1", category: "Producto terminado", stock: 25, location: "Planta 1" },
  { id: 4, name: "Motor eléctrico", category: "En tránsito", stock: 0, location: "Proveedor" },
  { id: 5, name: "Cable industrial", category: "Materia prima", stock: 40, location: "Bodega Central" },
];

function stockClass(stock: number) {
  if (stock === 0) return "text-red-300";
  if (stock < 10) return "text-yellow-300";
  return "text-green-300";
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
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("Todos");
  const [search, setSearch] = useState<string>("");

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    return ITEMS.filter((item) => {
      const byTab = activeTab === "Todos" || item.category === activeTab;
      const bySearch = term.length === 0 || item.name.toLowerCase().includes(term);
      return byTab && bySearch;
    });
  }, [activeTab, search]);

  return (
    <div className="page">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <input
          placeholder="Buscar inventario…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input md:w-80"
        />

        <button type="button" className="btn btn-primary">
          + Nuevo ítem
        </button>
      </div>

      {/* Tabs */}
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

      {/* Grid */}
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
              <button type="button" className="btn btn-ghost px-3 py-1 text-xs">
                Ver detalle
              </button>
            </div>
          </Card>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full text-center text-white/50">
            No hay resultados
          </div>
        )}
      </div>
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