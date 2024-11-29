import { Outlet,Navigate } from "react-router-dom";
import SideBar from "./sidebar";

function Layout() {
  const isLoggedIn = localStorage.getItem("authToken")

  return isLoggedIn ? (
    <section className="flex min-h-screen">
      <SideBar />
      <div className="w-full">
        <Outlet />
      </div>
    </section>
  ) : (
    <Navigate to="/" />
  );
}

export default Layout;
