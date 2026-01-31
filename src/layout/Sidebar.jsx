import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Boxes,
  BadgeDollarSign,
  Users,
  Contact,
  KanbanSquare,
  Megaphone,
  Factory,
} from "lucide-react";

const menu = [
  { to: "/dashboard", label: "Dashboards", icon: LayoutDashboard },
  { to: "/inventories", label: "Inventarios", icon: Boxes },
  { to: "/finance", label: "Finanzas", icon: BadgeDollarSign },
  { to: "/hr", label: "RRHH", icon: Users },
  { to: "/crm", label: "CRM", icon: Contact },
  { to: "/projects", label: "Gestión de proyectos", icon: KanbanSquare },
  { to: "/leads", label: "Generación de LEADS", icon: Megaphone },
  { to: "/operations", label: "Producción y operaciones", icon: Factory },
];

export default function Sidebar() {
  return (
    <aside className="w-[280px] shrink-0 border-r border-white/10 bg-[#0A111E]">
      <div className="flex min-h-screen flex-col">
        {/* Brand */}
        <div className="px-5 pt-5">
          <div className="text-sm text-white/60">Smart Ops</div>
          <div className="text-xl font-semibold">Control Center</div>
        </div>

        {/* Menu */}
        <nav className="mt-5 flex-1 px-3">
          <div className="space-y-1">
            {menu.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  [
                    "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition",
                    isActive
                      ? "bg-white/10 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.10)]"
                      : "text-white/70 hover:bg-white/5 hover:text-white",
                  ].join(" ")
                }
              >
                <Icon size={18} className="opacity-90" />
                <span className="truncate">{label}</span>
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Footer (opcional, tipo user) */}
        <div className="px-5 pb-5 pt-4 border-t border-white/10 text-xs text-white/50">
          v1 · Smart Ops
        </div>
      </div>
    </aside>
  );
}
