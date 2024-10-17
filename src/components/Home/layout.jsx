import { Outlet } from "react-router-dom";
import SideBar from "./sidebar";

function Layout() {
  return (
    <section className="flex min-h-screen">
      <SideBar />
      <div className="w-full">
        <Outlet />
      </div>
    </section>
  );
}

export default Layout;
