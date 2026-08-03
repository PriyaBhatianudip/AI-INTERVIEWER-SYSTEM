import LoginNavbar from "./LoginNavbar";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <>
      {/* Admin Navbar */}
      <LoginNavbar />

      {/* Admin Content */}
      <main className="pt-20 bg-gray-100 min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </>
  );
}
