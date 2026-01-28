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
    <aside className="w-[280px] shrink-0">
      <div className="sticky top-5 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
        <div className="mb-4">
          <div className="text-sm text-white/60">Smart Ops</div>
          <div className="text-xl font-semibold">Control Center</div>
        </div>

        <nav className="space-y-1">
          {menu.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
}
