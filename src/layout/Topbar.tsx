import React from "react";
import { useLocation } from "react-router-dom";
import { Bell, Search, PanelLeft } from "lucide-react";
import { useUI } from "../app/uiState";

const TITLE_MAP = {
  "/dashboard": "Visión general",
  "/inventories": "Inventarios",
  "/finance": "Finanzas",
  "/hr": "Recursos Humanos",
  "/crm": "CRM",
  "/operations": "Producción y operaciones",
} as const;

type KnownPath = keyof typeof TITLE_MAP;

function breadcrumb(pathname: string) {
  const clean = pathname.replace("/", "") || "dashboard";
  return `Home / ${clean}`;
}

export default function Topbar() {
  const { pathname } = useLocation();
  const { toggleSidebar, toggleMobileSidebar } = useUI();

  const title =
    (TITLE_MAP as Record<string, string>)[pathname] ?? "Panel";

  return (
    <header className="flex items-center justify-between gap-4">
      <div className="flex items-start gap-3">
        <button
          onClick={() => {
            if (window.innerWidth < 1024) toggleMobileSidebar(); // mobile/tablet
            else toggleSidebar(); // desktop
          }}
          className="mt-1 rounded-xl border border-white/10 bg-white/5 p-2 hover:bg-white/10"
          title="Toggle sidebar"
          type="button"
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
        <button
          type="button"
          className="rounded-xl border border-white/10 bg-white/5 p-2 hover:bg-white/10"
        >
          <Bell size={18} className="text-white/80" />
        </button>
      </div>
    </header>
  );
}