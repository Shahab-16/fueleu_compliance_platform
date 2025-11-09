import { NavLink } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AltRouteIcon from "@mui/icons-material/AltRoute";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import GroupWorkIcon from "@mui/icons-material/GroupWork";
import SettingsIcon from "@mui/icons-material/Settings"; // ✅ for Admin icon

const Sidebar = () => {
  const links = [
    { name: "Routes", path: "/", icon: <AltRouteIcon fontSize="medium" /> },
    { name: "Compare", path: "/compare", icon: <CompareArrowsIcon fontSize="medium" /> },
    { name: "Banking", path: "/banking", icon: <AccountBalanceIcon fontSize="medium" /> },
    { name: "Pooling", path: "/pooling", icon: <GroupWorkIcon fontSize="medium" /> },
    { name: "Admin", path: "/admin", icon: <SettingsIcon fontSize="medium" /> }, // ✅ new admin page
  ];

  return (
    <aside className="w-64 bg-white shadow-lg h-screen border-r border-gray-200 flex flex-col">
      {/* Logo + Brand */}
      <div className="flex items-center space-x-3 px-6 py-5 border-b border-gray-200">
        <img
          src="/varuna-logo.jpg"
          alt="Varuna Marine Services"
          className="w-12 h-12 object-contain rounded-md"
        />
        <div className="text-xl font-bold text-blue-700">
          Varuna Marine
          <p className="text-xs text-gray-500">Fuel EU Dashboard</p>
        </div>
      </div>

      {/* Dashboard Label */}
      <div className="px-6 pt-4 text-gray-500 uppercase tracking-wide text-sm font-semibold">
        <DashboardIcon className="mr-2 text-blue-500" />
        Dashboard
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col p-4 space-y-2 mt-2">
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-md text-lg font-medium transition-all ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-blue-100 hover:text-blue-800"
              }`
            }
          >
            {link.icon}
            {link.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
