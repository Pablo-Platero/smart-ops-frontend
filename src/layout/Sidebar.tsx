import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Boxes,
  BadgeDollarSign,
  Users,
  Contact,
  Factory,
  type LucideIcon,
} from "lucide-react";
import { useUI } from "../app/uiState";

type MenuLink = {
  to: string;
  label: string;
  icon: LucideIcon;
};

type Section = {
  title: string;
  items: MenuLink[];
};

const sections: Section[] = [
  {
    title: "PRINCIPAL",
    items: [{ to: "/dashboard", label: "Dashboards", icon: LayoutDashboard }],
  },
  {
    title: "GESTIÓN",
    items: [
      { to: "/inventories", label: "Inventarios", icon: Boxes },
      { to: "/finance", label: "Finanzas", icon: BadgeDollarSign },
      { to: "/hr", label: "RRHH", icon: Users },
      { to: "/crm", label: "CRM", icon: Contact },
    ],
  },
  {
    title: "OPERACIONES",
    items: [{ to: "/operations", label: "Producción y operaciones", icon: Factory }],
  },
];

type MenuItemProps = MenuLink & {
  collapsed: boolean;
  onNavigate?: () => void;
};

function MenuItem({ to, label, icon: Icon, collapsed, onNavigate }: MenuItemProps) {
  return (
    <NavLink
      to={to}
      onClick={onNavigate}
      title={collapsed ? label : undefined}
      className={({ isActive }) =>
        [
          "group flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition",
          "focus:outline-none focus:ring-2 focus:ring-white/10",
          isActive
            ? "bg-white/10 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.10)]"
            : "text-white/70 hover:bg-white/5 hover:text-white",
          collapsed ? "justify-center" : "",
        ].join(" ")
      }
    >
      <Icon size={18} className="opacity-90 group-hover:opacity-100" />
      {!collapsed && <span className="truncate">{label}</span>}
    </NavLink>
  );
}

type SidebarContentProps = {
  collapsed: boolean;
  onNavigate?: () => void;
};

function SidebarContent({ collapsed, onNavigate }: SidebarContentProps) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Brand */}
      <div className="px-5 pt-5">
        <div className="text-xs uppercase tracking-widest text-white/50">
          {collapsed ? "SO" : "Smart Ops"}
        </div>
        {!collapsed && <div className="mt-1 text-xl font-semibold tracking-tight">logo</div>}
        <div className="mt-4 h-px w-full bg-white/10" />
      </div>

      {/* Menu */}
      <div className="flex-1 overflow-y-auto px-3 py-4">
        {sections.map((sec) => (
          <div key={sec.title} className="mb-4">
            {!collapsed && (
              <div className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-widest text-white/40">
                {sec.title}
              </div>
            )}

            <div className="space-y-1">
              {sec.items.map((it) => (
                <MenuItem
                  key={it.to}
                  {...it}
                  collapsed={collapsed}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* User footer */}
      <div className="border-t border-white/10 px-4 py-4">
        <div
          className={[
            "rounded-2xl border border-white/10 bg-white/5 p-3",
            collapsed ? "flex justify-center" : "flex items-center gap-3",
          ].join(" ")}
        >
          <div className="relative h-10 w-10 overflow-hidden rounded-full bg-white/10">
            <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-white/70">
              PP
            </div>
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-[#0A111E]" />
          </div>

          {!collapsed && (
            <>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold">Pablo Platero</div>
                <div className="truncate text-xs text-white/60">Front-end · Online</div>
              </div>

              <button className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-xs text-white/70 hover:bg-white/10">
                Logout
              </button>
            </>
          )}
        </div>

        {!collapsed && <div className="mt-3 text-xs text-white/40">v1 · Smart Ops</div>}
      </div>
    </div>
  );
}

export default function Sidebar() {
  const { isSidebarCollapsed, isMobileSidebarOpen, closeMobileSidebar } = useUI();

  return (
    <>
      {/* Desktop */}
      <aside
        className={[
          "hidden lg:block shrink-0 border-r border-white/10 bg-[#0A111E]",
          "transition-all duration-200",
          isSidebarCollapsed ? "w-[84px]" : "w-[290px]",
        ].join(" ")}
      >
        <SidebarContent collapsed={isSidebarCollapsed} />
      </aside>

      {/* Mobile */}
      <div className={`lg:hidden ${isMobileSidebarOpen ? "block" : "hidden"}`}>
        <div onClick={closeMobileSidebar} className="fixed inset-0 z-40 bg-black/60" />
        <aside className="fixed left-0 top-0 z-50 h-full w-[290px] border-r border-white/10 bg-[#0A111E]">
          <SidebarContent collapsed={false} onNavigate={closeMobileSidebar} />
        </aside>
      </div>
    </>
  );
}