import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#0B1220] text-white">
      <div className="flex min-h-screen">
        <Sidebar />

        <main className="flex-1">
          <div className="mx-auto max-w-[1400px] px-4 py-5">
            <Topbar />

            {/* Page transition */}
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="mt-6"
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
