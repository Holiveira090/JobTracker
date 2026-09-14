import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  LayoutDashboardIcon,
  FileTextIcon,
  BuildingIcon,
  TargetIcon,
  UsersIcon,
  LogOutIcon,
  MenuIcon,
  XIcon,
  BriefcaseIcon,
} from '../ui/Icons';
import type { IconProps } from '../ui/Icons';

interface LayoutProps {
  children: ReactNode;
}

const NAV_ITEMS: { to: string; icon: (props: IconProps) => ReactNode; label: string }[] = [
  { to: '/dashboard', icon: LayoutDashboardIcon, label: 'Dashboard' },
  { to: '/applications', icon: FileTextIcon, label: 'Candidaturas' },
  { to: '/companies', icon: BuildingIcon, label: 'Empresas' },
  { to: '/roles', icon: TargetIcon, label: 'Funções' },
  { to: '/contacts', icon: UsersIcon, label: 'Contatos' },
];

const NavItem = ({
  to,
  icon: Icon,
  label,
  onClick,
}: {
  to: string;
  icon: (props: IconProps) => ReactNode;
  label: string;
  onClick?: () => void;
}) => {
  const location = useLocation();
  const isActive = location.pathname === to || location.pathname.startsWith(to);

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
        isActive
          ? 'bg-brand-600 text-white shadow-sm'
          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
      }`}
    >
      <Icon size={18} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'} />
      {label}
    </Link>
  );
};

const Brand = () => (
  <Link to="/dashboard" className="flex items-center gap-3 px-2">
    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white">
      <BriefcaseIcon size={20} />
    </span>
    <span className="text-lg font-bold tracking-tight text-white">JobTracker</span>
  </Link>
);

export const Layout = ({ children }: LayoutProps) => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const closeSidebar = () => setSidebarOpen(false);

  const initials = user?.email
    ? user.email
        .split('@')[0]
        .slice(0, 2)
        .toUpperCase()
    : '?';

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar desktop */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-slate-900 lg:flex">
        <div className="flex h-16 items-center border-b border-slate-800 px-4">
          <Brand />
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {NAV_ITEMS.map((item) => (
            <NavItem key={item.to} to={item.to} icon={item.icon} label={item.label} />
          ))}
        </nav>
        <div className="border-t border-slate-800 p-3">
          <div className="flex items-center gap-3 rounded-lg px-2 py-2">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-semibold text-white">
              {initials}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">{user?.email ?? 'Usuário'}</p>
              <p className="truncate text-xs text-slate-400">Conta</p>
            </div>
            <button
              onClick={handleLogout}
              title="Sair"
              className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
            >
              <LogOutIcon size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Topbar mobile */}
      <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 lg:hidden">
        <Brand />
        <button
          onClick={() => setSidebarOpen(true)}
          className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
          aria-label="Abrir menu"
        >
          <MenuIcon size={22} />
        </button>
      </header>

      {/* Sidebar mobile (drawer) */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-sm lg:hidden"
            onClick={closeSidebar}
          />
          <aside className="fixed inset-y-0 left-0 z-40 flex w-72 max-w-[85%] flex-col bg-slate-900 lg:hidden">
            <div className="flex h-16 items-center justify-between border-b border-slate-800 px-4">
              <Brand />
              <button
                onClick={closeSidebar}
                className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
                aria-label="Fechar menu"
              >
                <XIcon size={20} />
              </button>
            </div>
            <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
              {NAV_ITEMS.map((item) => (
                <NavItem
                  key={item.to}
                  to={item.to}
                  icon={item.icon}
                  label={item.label}
                  onClick={closeSidebar}
                />
              ))}
            </nav>
            <div className="border-t border-slate-800 p-3">
              <div className="flex items-center gap-3 rounded-lg px-2 py-2">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-semibold text-white">
                  {initials}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white">{user?.email ?? 'Usuário'}</p>
                </div>
                <button
                  onClick={handleLogout}
                  title="Sair"
                  className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
                >
                  <LogOutIcon size={18} />
                </button>
              </div>
            </div>
          </aside>
        </>
      )}

      {/* Conteúdo principal */}
      <main className="min-h-screen p-4 sm:p-6 lg:ml-64 lg:p-8">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
};