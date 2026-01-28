import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-[#0B1220] text-white">
      <div className="mx-auto flex max-w-[1400px] gap-6 px-4 py-5">
        <Sidebar />
        <main className="flex-1">
          <Topbar />
          <div className="mt-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
