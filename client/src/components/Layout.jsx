import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useLocation } from "react-router";

const Layout = ({ children, showSidebar = false }) => {
  const location = useLocation();
  const isChatPage = location.pathname?.startsWith("/chat");

  return (
    <div className="min-h-screen">
      <div className="flex">
        {showSidebar && <Sidebar />}

        <div className="flex-1 flex flex-col">
          {!isChatPage && <Navbar />}

          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </div>
  );
};
export default Layout;
