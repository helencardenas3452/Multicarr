import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Menu, Search, Bell, Settings, Car, Info, Sparkles, X, Check } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Historial from './components/Historial';
import Inventario from './components/Inventario';
import Operativo from './components/Operativo';
import { Vehiculo, HistorialRecord, InventarioItem, KanbanTask } from './types';

// Default mock datasets for initial load matching the user's mockup
const INITIAL_HISTORIAL: HistorialRecord[] = [
  {
    id: 'h-1',
    placa: 'ABC-123',
    vehiculo: 'Honda Civic 2019',
    cliente: 'Juan Pérez',
    fecha: '12 Oct 2023',
    servicio: 'Cambio de Aceite',
    costo: 120.00,
    aiSugerencia: {
      tipo: 'warning',
      texto: 'Revisión de Balatas (+30k km)'
    }
  },
  {
    id: 'h-2',
    placa: 'XYZ-987',
    vehiculo: 'Toyota Hilux 2021',
    cliente: 'Empresa Logística',
    fecha: '05 Nov 2023',
    servicio: 'Afinación Mayor',
    costo: 350.00,
    aiSugerencia: {
      tipo: 'success',
      texto: 'Al día'
    }
  }
];

const INITIAL_INVENTARIO: InventarioItem[] = [
  {
    id: 'i-1',
    nombre: 'Aceite Sintético 5W-30 (L)',
    categoria: 'Líquidos',
    stockActual: 45,
    stockMinimo: 20,
    unidad: 'Litros',
    precioUnitario: 12,
    estado: 'Adecuado'
  },
  {
    id: 'i-2',
    nombre: 'Balatas Delanteras Vento',
    categoria: 'Frenos',
    stockActual: 2,
    stockMinimo: 5,
    unidad: 'Pares',
    precioUnitario: 45,
    estado: 'Crítico'
  },
  {
    id: 'i-3',
    nombre: 'Filtro de Aire Universal',
    categoria: 'Filtros',
    stockActual: 8,
    stockMinimo: 10,
    unidad: 'Unidades',
    precioUnitario: 15,
    estado: 'Bajo'
  },
  {
    id: 'i-4',
    nombre: 'Limpiaparabrisas (Juego)',
    categoria: 'Accesorios',
    stockActual: 4,
    stockMinimo: 12,
    unidad: 'Juego',
    precioUnitario: 22,
    estado: 'Bajo'
  }
];

const INITIAL_KANBAN: KanbanTask[] = [
  {
    id: 'k-1',
    placa: 'DEF-456',
    vehiculo: 'Ford Explorer 2018',
    descripcion: 'Revisión de ruidos en suspensión.',
    estado: 'espera',
    tiempo: 'Hace 1h'
  },
  {
    id: 'k-2',
    placa: 'ABC-123',
    vehiculo: 'Honda Civic 2019',
    descripcion: 'Cambio de balatas y rectificado.',
    estado: 'proceso',
    tiempo: 'Hace 3h',
    mecanico: {
      nombre: 'Luis',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=150&auto=format&fit=crop'
    }
  },
  {
    id: 'k-3',
    placa: 'LMN-789',
    vehiculo: 'Nissan Versa 2022',
    descripcion: 'Afinación completa.',
    estado: 'listo',
    tiempo: 'Ayer',
    mecanico: {
      nombre: 'Carlos',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop'
    }
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [globalSearchTerm, setGlobalSearchTerm] = useState('');
  
  // Core states loaded from LocalStorage or pre-populated with defaults
  const [historial, setHistorial] = useState<HistorialRecord[]>(() => {
    const saved = localStorage.getItem('autotech_historial');
    return saved ? JSON.parse(saved) : INITIAL_HISTORIAL;
  });

  const [inventario, setInventario] = useState<InventarioItem[]>(() => {
    const saved = localStorage.getItem('autotech_inventario');
    return saved ? JSON.parse(saved) : INITIAL_INVENTARIO;
  });

  const [kanban, setKanban] = useState<KanbanTask[]>(() => {
    const saved = localStorage.getItem('autotech_kanban');
    return saved ? JSON.parse(saved) : INITIAL_KANBAN;
  });

  const [activeCompletingTask, setActiveCompletingTask] = useState<KanbanTask | null>(null);
  const [completionPrice, setCompletionPrice] = useState('180');
  const [completionClient, setCompletionClient] = useState('');

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('autotech_historial', JSON.stringify(historial));
  }, [historial]);

  useEffect(() => {
    localStorage.setItem('autotech_inventario', JSON.stringify(inventario));
  }, [inventario]);

  useEffect(() => {
    localStorage.setItem('autotech_kanban', JSON.stringify(kanban));
  }, [kanban]);

  // Global search navigation router
  const handleGlobalSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!globalSearchTerm.trim()) return;
    
    // Auto-navigate to Historial page and prefill filter
    setActiveTab('historial');
  };

  // State handlers: Historial
  const handleAddHistorialRecord = (newRecord: Omit<HistorialRecord, 'id'>) => {
    const record: HistorialRecord = {
      ...newRecord,
      id: `h-${Date.now()}`
    };
    setHistorial(prev => [record, ...prev]);
  };

  const handleDeleteHistorialRecord = (id: string) => {
    setHistorial(prev => prev.filter(item => item.id !== id));
  };

  // State handlers: Inventario
  const handleUpdateStock = (id: string, nuevoStock: number) => {
    setInventario(prev => prev.map(item => {
      if (item.id === id) {
        let estado: 'Adecuado' | 'Bajo' | 'Crítico' = 'Adecuado';
        if (nuevoStock <= item.stockMinimo) {
          estado = nuevoStock <= item.stockMinimo / 2 ? 'Crítico' : 'Bajo';
        }
        return { ...item, stockActual: nuevoStock, estado };
      }
      return item;
    }));
  };

  const handleRestockItems = (refillData: Record<string, number>) => {
    setInventario(prev => prev.map(item => {
      if (refillData[item.id] !== undefined) {
        const nuevoStock = refillData[item.id];
        let estado: 'Adecuado' | 'Bajo' | 'Crítico' = 'Adecuado';
        if (nuevoStock <= item.stockMinimo) {
          estado = nuevoStock <= item.stockMinimo / 2 ? 'Crítico' : 'Bajo';
        }
        return { ...item, stockActual: nuevoStock, estado };
      }
      return item;
    }));
  };

  // State handlers: Operativo (Kanban)
  const handleMoveKanbanTask = (id: string, nuevoEstado: 'espera' | 'proceso' | 'listo') => {
    setKanban(prev => prev.map(task => {
      if (task.id === id) {
        const updatedTask = { ...task, estado: nuevoEstado };
        if (nuevoEstado === 'proceso' && !task.mecanico) {
          // Auto-assign random mechanic if moving to process
          updatedTask.mecanico = {
            nombre: 'Carlos',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop'
          };
        }
        return updatedTask;
      }
      return task;
    }));
  };

  const handleAddKanbanTask = (newTask: Omit<KanbanTask, 'id' | 'tiempo'>) => {
    const task: KanbanTask = {
      ...newTask,
      id: `k-${Date.now()}`,
      tiempo: 'Justo ahora'
    };
    setKanban(prev => [task, ...prev]);
  };

  // Initiate completion checkout modal
  const handleInitiateCompleteTask = (id: string) => {
    const task = kanban.find(t => t.id === id);
    if (!task) return;
    setActiveCompletingTask(task);
    setCompletionClient('');
    setCompletionPrice('180');
  };

  const handleConfirmCompletion = () => {
    if (!activeCompletingTask) return;

    // Remove from Kanban
    setKanban(prev => prev.filter(t => t.id !== activeCompletingTask.id));

    // Guess dynamic AI Suggestion
    const lowerDesc = activeCompletingTask.descripcion.toLowerCase();
    let aiSugerenciaTexto = 'Revisión preventiva de niveles de aceite en 5,000 km.';
    let aiTipo: 'success' | 'warning' | 'info' = 'success';

    if (lowerDesc.includes('ruido') || lowerDesc.includes('suspension')) {
      aiSugerenciaTexto = 'Alineación y balanceo preventivo (+10k km)';
      aiTipo = 'info';
    } else if (lowerDesc.includes('fren') || lowerDesc.includes('balat')) {
      aiSugerenciaTexto = 'Revisión preventiva de discos de freno en 6 meses';
      aiTipo = 'warning';
    } else if (lowerDesc.includes('afina') || lowerDesc.includes('completa')) {
      aiSugerenciaTexto = 'Siguiente cambio de bujías preventivo';
      aiTipo = 'success';
    }

    // Add to Historial
    handleAddHistorialRecord({
      placa: activeCompletingTask.placa,
      vehiculo: activeCompletingTask.vehiculo,
      cliente: completionClient.trim() || 'Cliente General',
      fecha: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }),
      servicio: activeCompletingTask.descripcion,
      costo: parseFloat(completionPrice) || 120,
      aiSugerencia: {
        tipo: aiTipo,
        texto: aiSugerenciaTexto
      }
    });

    setActiveCompletingTask(null);
    alert(`¡Vehículo ${activeCompletingTask.vehiculo} facturado y guardado con éxito en Historial Clínico!`);
  };

  return (
    <div className="app-container flex min-h-screen">
      {/* Sidebar navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen} 
      />

      {/* Main Content Pane */}
      <main className="main-content flex-1 flex flex-col min-h-screen overflow-y-auto px-4 md:px-8 pb-12 relative">
        
        {/* Top Header */}
        <header className="top-header sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md flex items-center justify-between py-4 border-b border-white/5 mb-8">
          <div className="flex items-center gap-3.5 flex-1">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="md:hidden w-10 h-10 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white cursor-pointer"
              aria-label="Abrir menú"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            {/* Global Search form */}
            <form onSubmit={handleGlobalSearchSubmit} className="flex-1 max-w-sm hidden sm:block">
              <div className="flex items-center gap-2.5 bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2 focus-within:border-blue-500 transition-colors">
                <Search className="w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Buscar placa o cliente global..." 
                  value={globalSearchTerm}
                  onChange={(e) => setGlobalSearchTerm(e.target.value)}
                  className="bg-transparent border-none outline-none text-slate-200 text-xs placeholder-slate-500 w-full font-sans"
                />
              </div>
            </form>
          </div>

          {/* Action Center icons */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <button className="w-10 h-10 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:scale-105 active:scale-95 transition-all cursor-pointer">
                <Bell className="w-4.5 h-4.5" />
              </button>
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-950">
                3
              </span>
            </div>
            <button className="w-10 h-10 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:scale-105 active:scale-95 transition-all cursor-pointer">
              <Settings className="w-4.5 h-4.5" />
            </button>
          </div>
        </header>

        {/* Tab content wrapper with smooth motion transition */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="flex-1"
          >
            {activeTab === 'dashboard' && (
              <Dashboard 
                vehiculos={[]} 
                historial={historial} 
                inventario={inventario} 
                kanban={kanban} 
                onNavigate={setActiveTab}
              />
            )}
            {activeTab === 'historial' && (
              <Historial 
                historial={historial} 
                onAddRecord={handleAddHistorialRecord} 
                onDeleteRecord={handleDeleteHistorialRecord}
              />
            )}
            {activeTab === 'inventario' && (
              <Inventario 
                inventario={inventario} 
                onUpdateStock={handleUpdateStock} 
                onRestockItems={handleRestockItems}
              />
            )}
            {activeTab === 'operativo' && (
              <Operativo 
                kanban={kanban} 
                onMoveTask={handleMoveKanbanTask} 
                onAddTask={handleAddKanbanTask}
                onCompleteTask={handleInitiateCompleteTask}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Modal: Complete Order Invoice Check */}
        {activeCompletingTask && (
          <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-sm bg-slate-900 border border-white/10 rounded-2xl p-6 shadow-2xl animate-scaleUp">
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-5">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles className="text-emerald-400 w-5 h-5" />
                  Facturar Entrega de Vehículo
                </h3>
                <button 
                  onClick={() => setActiveCompletingTask(null)}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="p-3 bg-slate-950/80 rounded-xl border border-white/5 space-y-1">
                  <div className="text-[10px] text-slate-500 font-mono">VEHÍCULO A ENTREGAR</div>
                  <div className="font-bold text-slate-200 text-sm font-sans flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-amber-400 text-slate-950 font-bold rounded-sm text-[10px] font-mono">{activeCompletingTask.placa}</span>
                    {activeCompletingTask.vehiculo}
                  </div>
                  <div className="text-slate-400 text-xs font-sans mt-1">Trabajo: {activeCompletingTask.descripcion}</div>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handleConfirmCompletion(); }} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 font-mono uppercase tracking-wider mb-1.5">
                      Nombre del Cliente *
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder="Escriba el nombre del propietario" 
                      value={completionClient}
                      onChange={(e) => setCompletionClient(e.target.value)}
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 font-mono uppercase tracking-wider mb-1.5">
                      Costo Total Facturado (USD) *
                    </label>
                    <input 
                      type="number" 
                      required
                      placeholder="180.00" 
                      value={completionPrice}
                      onChange={(e) => setCompletionPrice(e.target.value)}
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-xs text-slate-200 focus:outline-none focus:border-blue-500 transition-colors font-mono"
                    />
                  </div>

                  <div className="pt-4 border-t border-white/5 flex gap-3">
                    <button 
                      type="button" 
                      onClick={() => setActiveCompletingTask(null)}
                      className="flex-1 py-3 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-700 transition-colors cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button 
                      type="submit" 
                      className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-semibold transition-colors shadow-lg shadow-emerald-500/15 cursor-pointer"
                    >
                      Facturar y Archivar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
