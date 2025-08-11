import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Import the useAuth hook
import {
  LayoutDashboard,
  Building2,
  Bot,
  UserPlus,
  LogOut,
  Settings,
  ShieldCheck, // A better icon for "Manage Admins"
} from "lucide-react";

const Sidebar = () => {
  // Use the user and logout function from the AuthContext
  const { user, logout } = useAuth();

  const navItemClass = ({ isActive }) =>
    `flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
      isActive
        ? "bg-blue-100 text-blue-600 font-semibold shadow-sm"
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
    }`;

  return (
    <aside className="h-screen fixed w-64 bg-white border-r border-gray-200 p-4 hidden md:flex flex-col justify-between shadow-md">
      <div>
        <h2 className="text-2xl font-bold text-blue-600 mb-8 text-center tracking-wide">
          Troika Tech
        </h2>
        <nav className="space-y-2">
          <NavLink to="/dashboard/overview" className={navItemClass}>
            <LayoutDashboard className="mr-3 h-5 w-5" />
            Overview
          </NavLink>

          <NavLink to="/dashboard/companies" className={navItemClass}>
            <Building2 className="mr-3 h-5 w-5" />
            Manage Companies
          </NavLink>

          <NavLink to="/dashboard/chatbots" className={navItemClass}>
            <Bot className="mr-3 h-5 w-5" />
            Manage Chatbots
          </NavLink>

          <NavLink to="/dashboard/config" className={navItemClass}>
            <Settings className="mr-3 h-5 w-5" />
            Client Config
          </NavLink>

          {/* MODIFIED: This link is now only visible to super admins */}
          {user && user.isSuperAdmin && (
            <NavLink to="/dashboard/manage-admins" className={navItemClass}>
              <ShieldCheck className="mr-3 h-5 w-5" />
              Manage Admins
            </NavLink>
          )}
        </nav>
      </div>

      <button
        onClick={logout} // Use the logout function from the context
        className="flex cursor-pointer items-center px-4 py-2 rounded-lg text-sm font-medium text-red-500 hover:text-white hover:bg-red-500 transition-all"
      >
        <LogOut className="mr-3 h-5 w-5" />
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;
