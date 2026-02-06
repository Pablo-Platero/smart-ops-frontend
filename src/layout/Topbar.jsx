import { useLocation } from "react-router-dom";
import { Bell, Search, PanelLeft } from "lucide-react";
import { useUI } from "../app/uiState";

const TITLE_MAP = {
  "/dashboard": "Visión general",
  "/inventories": "Inventarios",
  "/finance": "Finanzas",
  "/hr": "Recursos Humanos",
  "/crm": "CRM",
  "/projects": "Gestión de proyectos",
  "/leads": "Generación de LEADS",
  "/operations": "Producción y operaciones",
};

function breadcrumb(pathname) {
  const clean = pathname.replace("/", "") || "dashboard";
  return `Home / ${clean}`;
}

export default function Topbar() {
  const { pathname } = useLocation();
  const title = TITLE_MAP[pathname] ?? "Panel";
  const { toggleSidebar } = useUI();

  return (
    <header className="flex items-center justify-between gap-4">
      <div className="flex items-start gap-3">
        <button
          onClick={toggleSidebar}
          className="mt-1 rounded-xl border border-white/10 bg-white/5 p-2 hover:bg-white/10"
          title="Toggle sidebar"
        >
          <PanelLeft size={18} className="text-white/80" />
        </button>

        <div>
          <div className="text-xs uppercase tracking-widest text-white/50">
            {breadcrumb(pathname)}
          </div>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">{title}</h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 backdrop-blur md:flex">
          <Search size={16} className="text-white/60" />
          <input
            placeholder="Buscar…"
            className="w-56 bg-transparent text-sm outline-none placeholder:text-white/40"
          />
        </div>

        <button className="rounded-xl border border-white/10 bg-white/5 p-2 hover:bg-white/10">
          <Bell size={18} className="text-white/80" />
        </button>
      </div>
    </header>
  );
}
