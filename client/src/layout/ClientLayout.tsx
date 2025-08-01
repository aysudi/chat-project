import Sidebar from "@/components/Sidebar";
import { Outlet } from "react-router-dom";

const ClientLayout = () => {
  return (
    <div className="flex h-screen w-full ">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default ClientLayout;
