import { useState } from "react";
import Card from "../components/ui/Card";

const TABS = ["Todos", "Materia prima", "Producto terminado", "En tránsito"];

const ITEMS = [
  { id: 1, name: "Tornillos M8", category: "Materia prima", stock: 12, location: "Bodega Central" },
  { id: 2, name: "Placas metálicas", category: "Materia prima", stock: 3, location: "Bodega Norte" },
  { id: 3, name: "Equipo ensamblado A1", category: "Producto terminado", stock: 25, location: "Planta 1" },
  { id: 4, name: "Motor eléctrico", category: "En tránsito", stock: 0, location: "Proveedor" },
  { id: 5, name: "Cable industrial", category: "Materia prima", stock: 40, location: "Bodega Central" },
];

function stockColor(stock) {
  if (stock === 0) return "text-red-400";
  if (stock < 10) return "text-yellow-400";
  return "text-green-400";
}

export default function InventoriesPage() {
  const [activeTab, setActiveTab] = useState("Todos");
  const [search, setSearch] = useState("");

  const filtered = ITEMS.filter((item) => {
    const byTab = activeTab === "Todos" || item.category === activeTab;
    const bySearch = item.name.toLowerCase().includes(search.toLowerCase());
    return byTab && bySearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <input
          placeholder="Buscar inventario…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-80 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm outline-none placeholder:text-white/40"
        />

        <button className="rounded-xl bg-white/10 px-4 py-2 text-sm hover:bg-white/15">
          + Nuevo ítem
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-full px-4 py-1.5 text-sm border ${
              activeTab === tab
                ? "bg-white/10 border-white/20 text-white"
                : "border-white/10 text-white/60 hover:bg-white/5"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => (
          <Card key={item.id} className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm text-white/60">{item.category}</div>
                <div className="mt-1 text-lg font-semibold">{item.name}</div>
              </div>
              <div className={`text-sm font-semibold ${stockColor(item.stock)}`}>
                {item.stock === 0 ? "Sin stock" : `${item.stock} uds`}
              </div>
            </div>

            <div className="mt-3 text-sm text-white/60">
              Ubicación: <span className="text-white/80">{item.location}</span>
            </div>

            <div className="mt-4 flex justify-end">
              <button className="rounded-lg border border-white/10 px-3 py-1 text-xs hover:bg-white/10">
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
