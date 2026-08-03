import LoginNavbar from "./LoginNavbar";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <>
      <LoginNavbar />
      <main className="pt-20 px-4">
        <Outlet />
      </main>
    </>
  );
}
