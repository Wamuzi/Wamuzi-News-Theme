
import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';

const AdminSidebar: React.FC = () => {
  const { settings } = useSettings();
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
      isActive ? 'bg-brand-blue text-white' : 'text-gray-700 hover:bg-gray-200'
    }`;

  return (
    <aside className="w-64 bg-light-surface border-r border-gray-200 flex-shrink-0 flex flex-col">
      <div className="h-20 flex items-center justify-center px-4 border-b border-gray-200 flex-col">
        <Link to="/" className="mb-1">
           <img src={settings.general.logoUrl} alt="Wamuzi News Logo" className="h-8 w-auto" />
        </Link>
         <h2 className="text-sm font-bold text-gray-700 tracking-wider">THEME OPTIONS</h2>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        <NavLink to="/admin/general" className={navLinkClass}>
          General Settings
        </NavLink>
        <NavLink to="/admin/header" className={navLinkClass}>
          Header Settings
        </NavLink>
        <NavLink to="/admin/footer" className={navLinkClass}>
          Footer Settings
        </NavLink>
         <NavLink to="/admin/homepage" className={navLinkClass}>
          Homepage Settings
        </NavLink>
        <NavLink to="/admin/styling" className={navLinkClass}>
          Styling
        </NavLink>
        <NavLink to="/admin/users" className={navLinkClass}>
          User Management
        </NavLink>
      </nav>
      <div className="p-4 border-t border-gray-200">
        <Link to="/" className="flex items-center justify-center w-full px-4 py-2.5 text-sm font-medium text-brand-blue rounded-lg transition-colors hover:bg-blue-50">
          &larr; Back to Site
        </Link>
      </div>
    </aside>
  );
};

export default AdminSidebar;
