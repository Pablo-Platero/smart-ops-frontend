import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-[#0B1220] text-white">
      <div className="flex min-h-screen">
        <Sidebar />

        <main className="flex-1">
          <div className="mx-auto max-w-[1400px] px-4 py-5">
            <Topbar />
            <div className="mt-6">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
