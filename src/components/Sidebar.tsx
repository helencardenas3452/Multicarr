import React from 'react';
import { LayoutDashboard, ClipboardList, Package, Wrench, X, MessageSquareCode } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function Sidebar({ activeTab, setActiveTab, isOpen, setIsOpen }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard Financiero', icon: LayoutDashboard },
    { id: 'historial', label: 'Historial Clínico', icon: ClipboardList },
    { id: 'inventario', label: 'Inventario Inteligente', icon: Package },
    { id: 'operativo', label: 'Módulo Operativo', icon: Wrench },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed md:sticky top-0 left-0 bottom-0 h-screen w-[280px] bg-slate-950 border-r-2 border-slate-900 p-6 flex flex-col z-50 transition-all duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo Header */}
        <div className="flex items-center justify-between mb-12 gap-3">
          <div className="flex items-center min-w-0">
            <img 
              src="https://multicarr.co/images/img_footer.png" 
              alt="Multicarr Logo" 
              className="max-h-12 w-auto object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <button 
            className="md:hidden text-slate-400 hover:text-white p-1 shrink-0"
            onClick={() => setIsOpen(false)}
            aria-label="Cerrar menú"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 flex flex-col gap-2">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3.5 px-4 py-3 border-2 transition-all duration-150 group text-left rounded-none font-bold text-xs uppercase tracking-wider ${
                  isActive
                    ? 'bg-amber-400 text-slate-950 border-slate-950 shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]'
                    : 'text-slate-400 border-transparent hover:border-slate-800 hover:text-white'
                }`}
              >
                <IconComponent className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${
                  isActive ? 'text-slate-950' : 'text-slate-400 group-hover:text-white'
                }`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="pt-4 border-t-2 border-slate-900 flex items-center gap-3.5">
          <img 
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop" 
            alt="Administrador" 
            className="w-11 h-11 rounded-none object-cover border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)]"
            referrerPolicy="no-referrer"
          />
          <div className="flex flex-col min-w-0">
            <span className="font-extrabold text-xs uppercase text-slate-100 truncate">Administrador</span>
            <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider truncate">Dueño / Gerente</span>
          </div>
        </div>
      </aside>
    </>
  );
}
