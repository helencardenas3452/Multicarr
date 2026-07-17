import React, { useState } from 'react';
import { DollarSign, Car, AlertTriangle, TrendingUp, Sparkles, MessageSquare, Send, Brain, Bot } from 'lucide-react';
import { Vehiculo, HistorialRecord, InventarioItem, KanbanTask, AIInsight } from '../types';

interface DashboardProps {
  vehiculos: Vehiculo[];
  historial: HistorialRecord[];
  inventario: InventarioItem[];
  kanban: KanbanTask[];
  onNavigate: (tabId: string) => void;
}

export default function Dashboard({ vehiculos, historial, inventario, kanban, onNavigate }: DashboardProps) {
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; time: string }>>([
    { 
      sender: 'ai', 
      text: '¡Hola! Soy tu asistente AutoTech AI. ¿En qué puedo ayudarte hoy? Puedo analizar el rendimiento del taller, revisar el stock del inventario o darte un reporte rápido.', 
      time: 'Justo ahora' 
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  // Derive actual statistics from live state
  const totalIngresos = historial.reduce((sum, item) => sum + item.costo, 0);
  const autosEnTaller = kanban.filter(k => k.estado !== 'listo').length;
  const alertasStockCount = inventario.filter(item => item.stockActual <= item.stockMinimo).length;

  // Derive dynamic intelligent insights based on live state
  const getDynamicInsights = (): AIInsight[] => {
    const insights: AIInsight[] = [];
    
    // Insight 1: Operational
    const enEspera = kanban.filter(k => k.estado === 'espera').length;
    if (enEspera > 0) {
      insights.push({
        id: 'ins-1',
        tipo: 'alerta',
        texto: `Se registran ${enEspera} vehículo(s) en espera de asignación de mecánico. Asigna un técnico para evitar retrasos en las entregas.`,
        resaltado: 'Cuello de botella operativo'
      });
    } else {
      insights.push({
        id: 'ins-1',
        tipo: 'oportunidad',
        texto: 'Flujo de trabajo optimizado: El 100% de los vehículos ingresados ya cuentan con un mecánico asignado en proceso.',
        resaltado: 'Eficiencia operativa'
      });
    }

    // Insight 2: Financial
    const ultimosServicios = historial.slice(-3);
    const totalSemana = historial.reduce((acc, curr) => acc + curr.costo, 0);
    if (totalSemana > 15000) {
      insights.push({
        id: 'ins-2',
        tipo: 'prediccion',
        texto: `Con una facturación acumulada de $${totalSemana.toLocaleString('en-US', { minimumFractionDigits: 2 })} y la estacionalidad actual, se proyectan ingresos estables de $25,000 para el próximo fin de semana.`,
        resaltado: 'Tendencia al alza'
      });
    } else {
      insights.push({
        id: 'ins-2',
        tipo: 'prediccion',
        texto: 'Se proyecta una demanda incrementada de mantenimientos preventivos (cambios de aceite y frenos) para la siguiente semana debido a los días festivos.',
        resaltado: 'Predicción de demanda'
      });
    }

    // Insight 3: Inventory
    const criticos = inventario.filter(item => item.stockActual <= item.stockMinimo);
    if (criticos.length > 0) {
      insights.push({
        id: 'ins-3',
        tipo: 'alerta',
        texto: `Alerta de Stock: Hay ${criticos.length} repuesto(s) en nivel crítico. Te recomendamos abastecer urgentemente: ${criticos.slice(0, 2).map(c => c.nombre).join(', ')}.`,
        resaltado: 'Ruptura de stock inminente'
      });
    } else {
      insights.push({
        id: 'ins-3',
        tipo: 'oportunidad',
        texto: 'Los niveles de consumibles (filtros, aceites y frenos) se encuentran balanceados respecto a la demanda estimada del mes.',
        resaltado: 'Inventario saludable'
      });
    }

    return insights;
  };

  const insights = getDynamicInsights();

  // Chat handling logic
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { sender: 'user', text: userMsg, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setChatInput('');
    setIsTyping(true);

    // Simulate AI thinking and replying contextually
    setTimeout(() => {
      let aiReply = '';
      const query = userMsg.toLowerCase();

      if (query.includes('stock') || query.includes('inventario') || query.includes('repuesto') || query.includes('compras')) {
        const bajoStock = inventario.filter(i => i.stockActual <= i.stockMinimo);
        if (bajoStock.length > 0) {
          aiReply = `He analizado tu inventario actual. Tienes ${bajoStock.length} productos con existencias bajas:\n\n` +
            bajoStock.map(i => `• ${i.nombre}: ${i.stockActual} unidades disponibles (Nivel mínimo: ${i.stockMinimo}).`).join('\n') +
            `\n\nTe recomiendo generar una orden de compra preventiva desde la sección "Inventario Inteligente" para restaurar el stock adecuado.`;
        } else {
          aiReply = `El análisis de inventario indica que todo está en orden. Todas las refacciones clave se encuentran por encima del nivel mínimo establecido.`;
        }
      } else if (query.includes('taller') || query.includes('autos') || query.includes('vehiculos') || query.includes('pendientes')) {
        const pendientes = kanban.filter(k => k.estado !== 'listo');
        if (pendientes.length > 0) {
          aiReply = `Actualmente tienes ${pendientes.length} vehículos activos en reparación:\n\n` +
            pendientes.map(p => `• [${p.placa}] ${p.vehiculo} - ${p.estado === 'espera' ? 'En espera de mecánico' : 'En proceso mecánico'}: "${p.descripcion}"`).join('\n') +
            `\n\nPuedes gestionar estos servicios y reasignar técnicos en el "Módulo Operativo".`;
        } else {
          aiReply = `¡Felicidades! No hay vehículos pendientes de reparación en el taller en este momento. Todos los autos ingresados han sido entregados exitosamente.`;
        }
      } else if (query.includes('ingresos') || query.includes('ventas') || query.includes('dinero') || query.includes('financiero') || query.includes('resumen')) {
        aiReply = `Aquí tienes el balance financiero actual consolidado de hoy:\n\n` +
          `• Ingresos Totales de hoy: $${totalIngresos.toLocaleString('en-US', { minimumFractionDigits: 2 })}\n` +
          `• Servicios Realizados: ${historial.length} intervenciones registradas.\n` +
          `• Promedio por Ticket: $${(historial.length ? totalIngresos / historial.length : 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}\n\n` +
          `Se percibe un incremento positivo de las intervenciones debido a la excelente sugerencia preventiva de IA.`;
      } else {
        aiReply = `Entendido. Basado en el rendimiento de AutoTech AI:\n` +
          `Tenemos ${autosEnTaller} autos en servicio, con ingresos acumulados de $${totalIngresos.toLocaleString('en-US', { minimumFractionDigits: 2 })}.\n\n` +
          `¿Te gustaría que te ayude a revisar el 'stock de refacciones' o prefieres ver la 'lista de vehículos en reparación'?`;
      }

      setChatMessages(prev => [...prev, { 
        sender: 'ai', 
        text: aiReply, 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      }]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div id="dashboard-section" className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tighter text-slate-900 uppercase font-sans">Resumen del Día</h2>
          <p className="text-slate-500 text-xs uppercase tracking-wider font-mono">Panel de control administrativo e inteligencia automotriz</p>
        </div>
        <div className="text-[10px] font-mono bg-amber-400 border-2 border-slate-900 px-3 py-1.5 rounded-none text-slate-950 flex items-center gap-2 self-start md:self-center shadow-[2px_2px_0px_0px_#0f172a] font-bold">
          <span className="w-2.5 h-2.5 rounded-none bg-slate-950 block animate-pulse" />
          SISTEMA EN LÍNEA
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Stat 1: Revenues */}
        <div 
          onClick={() => onNavigate('historial')}
          className="glass-panel p-6 rounded-none flex items-center gap-5 cursor-pointer glass-panel-hover"
        >
          <div className="w-14 h-14 rounded-none bg-emerald-400 text-slate-950 border-2 border-slate-900 flex items-center justify-center text-2xl shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] group-hover:scale-105 transition-transform">
            <DollarSign className="w-7 h-7 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Ingresos de Hoy</h3>
            <p className="text-2xl font-black text-slate-900 mt-1">${totalIngresos.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
            <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 mt-1 font-mono uppercase">
              <TrendingUp className="w-3 h-3" /> +15.4% vs ayer
            </span>
          </div>
        </div>

        {/* Stat 2: Active Cars */}
        <div 
          onClick={() => onNavigate('operativo')}
          className="glass-panel p-6 rounded-none flex items-center gap-5 cursor-pointer glass-panel-hover"
        >
          <div className="w-14 h-14 rounded-none bg-sky-400 text-slate-950 border-2 border-slate-900 flex items-center justify-center text-2xl shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] group-hover:scale-105 transition-transform">
            <Car className="w-7 h-7 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Vehículos en Taller</h3>
            <p className="text-2xl font-black text-slate-900 mt-1">{autosEnTaller}</p>
            <span className="text-[10px] text-slate-500 font-bold flex items-center gap-1 mt-1 font-mono uppercase">
              Capacidad activa al {Math.min(100, Math.round((autosEnTaller / 12) * 100))}%
            </span>
          </div>
        </div>

        {/* Stat 3: Stock Alert */}
        <div 
          onClick={() => onNavigate('inventario')}
          className={`glass-panel p-6 rounded-none flex items-center gap-5 cursor-pointer glass-panel-hover border-l-8 ${
            alertasStockCount > 0 
              ? 'border-l-amber-400' 
              : 'border-l-emerald-400'
          }`}
        >
          <div className={`w-14 h-14 rounded-none border-2 border-slate-900 flex items-center justify-center text-2xl shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] group-hover:scale-105 transition-transform ${
            alertasStockCount > 0 
              ? 'bg-amber-400 text-slate-950' 
              : 'bg-emerald-400 text-slate-950'
          }`}>
            <AlertTriangle className="w-7 h-7 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Alertas de Inventario</h3>
            <p className="text-2xl font-black text-slate-900 mt-1">{alertasStockCount}</p>
            <span className={`text-[10px] font-bold flex items-center gap-1 mt-1 font-mono uppercase ${
              alertasStockCount > 0 ? 'text-amber-600' : 'text-emerald-600'
            }`}>
              {alertasStockCount > 0 ? 'Abastecimiento requerido' : 'Niveles óptimos'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Weekly Revenue Chart */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-none flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2 uppercase tracking-tight">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              Flujo de Ingresos (Semana)
            </h3>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-mono">Registros diarios de transacciones de taller</p>
          </div>

          {/* Interactive HTML5 Chart Bars */}
          <div className="mt-8 flex items-end justify-between gap-4 h-[220px] pb-6 border-b-2 border-slate-900 relative bg-slate-50 p-4 border border-slate-200">
            {/* Grid background lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none p-4 pb-6">
              <div className="w-full border-t border-slate-300" />
              <div className="w-full border-t border-slate-300" />
              <div className="w-full border-t border-slate-300" />
              <div className="w-full border-t border-slate-300" />
            </div>

            {/* Bars */}
            {[
              { dia: 'Lun', valor: 4200, pct: '45%' },
              { dia: 'Mar', valor: 6800, pct: '65%' },
              { dia: 'Mié', valor: 8900, pct: '82%' },
              { dia: 'Jue', valor: 5100, pct: '50%' },
              { dia: 'Vie', valor: 12450, pct: '95%', destacado: true },
            ].map((bar, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center group relative z-10">
                {/* Tooltip on hover */}
                <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-slate-950 border-2 border-slate-950 text-[10px] font-black py-1 px-2 rounded-none text-white pointer-events-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transform -translate-y-1 font-mono">
                  ${bar.valor.toLocaleString()}
                </div>
                {/* Bar */}
                <div 
                  className={`w-10 sm:w-12 border-2 border-slate-900 rounded-none transition-all duration-300 cursor-pointer ${
                    bar.destacado 
                      ? 'bg-amber-400 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]' 
                      : 'bg-white hover:bg-slate-200 shadow-[1px_1px_0px_0px_rgba(15,23,42,1)]'
                  }`} 
                  style={{ height: bar.pct }}
                />
                <span className="text-[11px] text-slate-600 font-bold mt-3.5 font-mono group-hover:text-slate-950 transition-colors uppercase">
                  {bar.dia}
                </span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 mt-3 pt-1">
            <span>TICKET PROM.: ${(historial.length ? totalIngresos / historial.length : 2490).toLocaleString('en-US', { maximumFractionDigits: 0 })} USD</span>
            <span className="text-indigo-600 font-black cursor-pointer hover:underline uppercase tracking-wider" onClick={() => onNavigate('historial')}>Ver transacciones &rarr;</span>
          </div>
        </div>

        {/* AI Smart Assistant & Chat */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Real AI-Insight Stream */}
          <div className="glass-panel p-6 rounded-none border-l-8 border-l-indigo-600">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2 mb-4 uppercase tracking-tight">
              <Sparkles className="text-indigo-600 w-5 h-5 animate-pulse" />
              Recomendaciones de IA
            </h3>
            <div className="space-y-4">
              {insights.map((insight) => (
                <div key={insight.id} className="p-3 bg-slate-50 rounded-none border-2 border-slate-900 flex gap-3 text-xs leading-relaxed group hover:bg-slate-100 transition-all duration-200 shadow-[2px_2px_0px_0px_#0f172a]">
                  <div className="mt-1">
                    {insight.tipo === 'alerta' ? (
                      <span className="w-2 h-2 rounded-none bg-rose-500 block animate-pulse border border-slate-950" />
                    ) : insight.tipo === 'oportunidad' ? (
                      <span className="w-2 h-2 rounded-none bg-emerald-500 block border border-slate-950" />
                    ) : (
                      <span className="w-2 h-2 rounded-none bg-sky-500 block border border-slate-950" />
                    )}
                  </div>
                  <div>
                    <strong className="text-indigo-600 block font-black uppercase tracking-wider text-[10px] mb-0.5 font-sans">
                      {insight.resaltado}
                    </strong>
                    <span className="text-slate-800 font-medium">{insight.texto}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Chat Bot Assistant */}
          <div className="glass-panel rounded-none flex flex-col h-[320px] overflow-hidden">
            {/* Assistant Header */}
            <div className="bg-slate-950 px-4 py-3 border-b-2 border-slate-900 flex items-center gap-2.5 text-white">
              <div className="w-8 h-8 rounded-none bg-amber-400 text-slate-950 border border-slate-950 flex items-center justify-center">
                <Brain className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-white">
                  Copilot AutoTech AI
                </h4>
                <p className="text-[9px] text-emerald-400 font-mono flex items-center gap-1 uppercase tracking-widest font-bold">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-none animate-pulse" />
                  Analista de taller activo
                </p>
              </div>
            </div>

            {/* Messages body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs bg-slate-50">
              {chatMessages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`flex gap-2.5 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-7 h-7 rounded-none border-2 border-slate-900 flex items-center justify-center text-[10px] font-black flex-shrink-0 shadow-[1px_1px_0px_0px_rgba(15,23,42,1)] ${
                    msg.sender === 'user' ? 'bg-amber-400 text-slate-950' : 'bg-white text-slate-900'
                  }`}>
                    {msg.sender === 'user' ? 'U' : <Bot className="w-3.5 h-3.5" />}
                  </div>
                  <div className={`p-3 rounded-none max-w-[85%] leading-relaxed border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] ${
                    msg.sender === 'user' 
                      ? 'bg-amber-100 text-slate-900 font-medium' 
                      : 'bg-white text-slate-900 whitespace-pre-line font-medium'
                  }`}>
                    {msg.text}
                    <span className="block text-[8px] text-slate-400 mt-1 text-right font-mono font-bold uppercase">{msg.time}</span>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-2.5">
                  <div className="w-7 h-7 rounded-none border-2 border-slate-900 bg-white text-slate-900 flex items-center justify-center flex-shrink-0 shadow-[1px_1px_0px_0px_rgba(15,23,42,1)]">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <div className="bg-white text-slate-900 p-3 rounded-none border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                    <span className="flex gap-1 items-center py-1">
                      <span className="w-1.5 h-1.5 bg-slate-900 rounded-none animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 bg-slate-900 rounded-none animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 bg-slate-900 rounded-none animate-bounce" style={{ animationDelay: '300ms' }} />
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendMessage} className="p-3 bg-white border-t-2 border-slate-900 flex gap-2">
              <input 
                type="text" 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Pregunta sobre stock, autos activos, etc..." 
                className="flex-1 bg-slate-50 border-2 border-slate-900 rounded-none px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white transition-all font-sans font-medium"
              />
              <button 
                type="submit" 
                className="w-10 h-10 rounded-none bg-indigo-600 text-white border-2 border-slate-900 flex items-center justify-center hover:bg-indigo-700 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] cursor-pointer"
              >
                <Send className="w-4 h-4 stroke-[2.5]" />
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}
