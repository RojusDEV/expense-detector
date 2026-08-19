import { useState } from "react";
import { Outlet } from "react-router";
import Sidebar from "./Sidebar";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <nav className="fixed top-0 right-0 left-0 z-30 flex h-14 items-center border-b-2 border-(--sidebar-outline) bg-(--side-bar-bg) px-4 md:hidden">
        <button
          onClick={() => setIsSidebarOpen((prev) => !prev)}
          aria-label="Toggle menu"
          aria-expanded={isSidebarOpen}
          className="flex h-8 w-8 flex-col justify-center gap-1.5"
        >
          <span
            className={`block h-0.5 w-6 bg-(--text-primary-white) transition-transform duration-300 ${
              isSidebarOpen ? "translate-y-2 rotate-45" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-6 bg-(--text-primary-white) transition-opacity duration-300 ${
              isSidebarOpen ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`block h-0.5 w-6 bg-(--text-primary-white) transition-transform duration-300 ${
              isSidebarOpen ? "-translate-y-2 -rotate-45" : ""
            }`}
          />
        </button>
      </nav>

      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
        />
      )}

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="flex-1 min-w-0 pt-14 md:pt-0">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
