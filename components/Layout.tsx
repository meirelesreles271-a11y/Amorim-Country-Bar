
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Beer, 
  UserRound, 
  CircleDollarSign, 
  Settings, 
  Menu as MenuIcon,
  X,
  LogOut
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/commands', label: 'Comandas', icon: Beer },
    { path: '/waiter', label: 'Modo Garçom', icon: UserRound },
    { path: '/inventory', label: 'Produtos', icon: MenuIcon },
    { path: '/cashier', label: 'Caixa', icon: CircleDollarSign },
    { path: '/settings', label: 'Configurações', icon: Settings },
  ];

  const activePath = (path: string) => location.pathname === path;

  // Don't show layout for the digital menu (customer view)
  if (location.pathname.startsWith('/menu')) {
      return <>{children}</>;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#1a1410]">
      {/* Mobile Toggle */}
      <button 
        className="lg:hidden fixed top-4 right-4 z-50 p-2 bg-[#8b4513] rounded-md text-white"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X size={24} /> : <MenuIcon size={24} />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out
        bg-[#2a1f18] border-r border-[#3d2b1f] flex flex-col
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 border-b border-[#3d2b1f]">
          <h1 className="text-2xl font-bold country-font text-[#d4af37]">AMORIM</h1>
          <p className="text-xs text-[#8b4513] tracking-widest uppercase">Country Bar</p>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsSidebarOpen(false)}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                ${activePath(item.path) 
                  ? 'bg-[#8b4513] text-white' 
                  : 'text-[#f3e5ab] hover:bg-[#3d2b1f]'}
              `}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-[#3d2b1f]">
           <button className="flex items-center gap-3 px-4 py-3 w-full text-red-400 hover:bg-[#3d2b1f] rounded-lg transition-colors">
              <LogOut size={20} />
              <span>Sair</span>
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 lg:p-8 relative">
        <div className="max-w-7xl mx-auto">
            {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
