import React, { useState } from 'react';
import { Package, Brain, Search, Plus, Minus, Check, ShoppingCart, ShoppingBag, X, RefreshCw, Sparkles, Filter } from 'lucide-react';
import { InventarioItem } from '../types';

interface InventarioProps {
  inventario: InventarioItem[];
  onUpdateStock: (id: string, nuevoStock: number) => void;
  onRestockItems: (idsAndQuantities: Record<string, number>) => void;
}

export default function Inventario({ inventario, onUpdateStock, onRestockItems }: InventarioProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [activePurchaseOrder, setActivePurchaseOrder] = useState<Array<{ item: InventarioItem; sugerido: number }> | null>(null);

  // Filter items by category & search term
  const filteredInventario = inventario.filter(item => {
    const matchesSearch = item.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todas' || item.categoria === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get distinct categories
  const distinctCategories = ['Todas', ...Array.from(new Set(inventario.map(i => i.categoria)))];

  // Derive low/critical stock list for AI predictions
  const criticalItems = inventario.filter(item => item.stockActual <= item.stockMinimo);

  // Suggestions list mapping (low stock gets customized suggested quantities, or seasonal recommendations)
  const getAiSuggestions = () => {
    const suggestions: Array<{ item: InventarioItem; cantidad: number; razon: string }> = [];
    
    // Add critical items
    criticalItems.forEach(item => {
      const sugerido = Math.max(item.stockMinimo * 2, 15);
      suggestions.push({
        item,
        cantidad: sugerido,
        razon: 'Nivel crítico. Demanda proyectada en aumento para afinaciones preventivas.'
      });
    });

    // Seasonal weather suggestion
    const limpia = inventario.find(i => i.nombre.toLowerCase().includes('limpiaparabrisas'));
    if (limpia) {
      suggestions.push({
        item: limpia,
        cantidad: 20,
        razon: 'Previsión de lluvias en los próximos 10 días (Demanda estacional alta).'
      });
    }

    return suggestions;
  };

  const aiSuggestions = getAiSuggestions();

  const handleGeneratePurchaseOrder = () => {
    // Collect suggested restock list
    const orderList = aiSuggestions.map(s => ({
      item: s.item,
      sugerido: s.cantidad
    }));

    if (orderList.length === 0) {
      alert('Todo tu inventario se encuentra en óptimas condiciones. No se requieren compras preventivas.');
      return;
    }

    setActivePurchaseOrder(orderList);
  };

  const handleConfirmPurchase = () => {
    if (!activePurchaseOrder) return;

    // Apply stock refill in state
    const refillData: Record<string, number> = {};
    activePurchaseOrder.forEach(order => {
      refillData[order.item.id] = order.item.stockActual + order.sugerido;
    });

    onRestockItems(refillData);
    setActivePurchaseOrder(null);
    alert('¡Orden de Compra enviada exitosamente! El inventario ha sido reabastecido.');
  };

  return (
    <div id="inventario-section" className="space-y-8 animate-fadeIn text-slate-900">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-black tracking-tighter text-slate-900 uppercase font-sans">Gestión de Inventario</h2>
        <p className="text-slate-500 text-xs uppercase tracking-wider font-mono">Control de consumibles y refacciones con inteligencia predictiva</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Column: Items Table */}
        <div className="lg:col-span-8 flex flex-col gap-5">
          <div className="table-container glass-panel rounded-none overflow-hidden">
            
            {/* Table Header Filter Action */}
            <div className="p-5 border-b-2 border-slate-900 flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3 bg-white border-2 border-slate-900 rounded-none px-4 py-2 w-full sm:max-w-xs focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
                <Search className="w-4 h-4 text-slate-900" />
                <input 
                  type="text" 
                  placeholder="Buscar refacción..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent border-none outline-none text-slate-900 text-sm placeholder-slate-400 w-full font-sans font-semibold"
                />
              </div>

              {/* Categorías pill selector */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none">
                {distinctCategories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-none text-xs font-black uppercase border-2 transition-all cursor-pointer ${
                      selectedCategory === cat 
                        ? 'bg-indigo-600 border-slate-900 text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' 
                        : 'bg-white border-slate-900 text-slate-700 hover:bg-slate-100 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Inventory table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-900 bg-slate-100 text-xs font-black text-slate-900 font-mono uppercase tracking-wider">
                    <th className="p-5">Refacción / Consumible</th>
                    <th className="p-5">Categoría</th>
                    <th className="p-5 text-center">Stock Actual</th>
                    <th className="p-5 text-center">Nivel Mínimo</th>
                    <th className="p-5 text-center">Estado</th>
                    <th className="p-5 text-right">Ajuste Rápido</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-slate-900 text-sm text-slate-900">
                  {filteredInventario.length > 0 ? (
                    filteredInventario.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="p-5 font-sans">
                          <div className="font-black text-slate-900 uppercase tracking-tight">{item.nombre}</div>
                          <div className="text-slate-500 text-xs mt-0.5 font-mono font-bold uppercase">PU: ${item.precioUnitario} USD / {item.unidad}</div>
                        </td>
                        <td className="p-5 font-bold text-slate-600 uppercase tracking-wide text-xs">
                          {item.categoria}
                        </td>
                        <td className="p-5 text-center font-black text-base font-mono text-slate-900">
                          {item.stockActual}
                        </td>
                        <td className="p-5 text-center font-bold font-mono text-slate-500">
                          {item.stockMinimo}
                        </td>
                        <td className="p-5 text-center">
                          {item.stockActual <= item.stockMinimo ? (
                            item.stockActual <= item.stockMinimo / 2 ? (
                              <span className="inline-flex items-center px-2.5 py-1 bg-rose-400 text-slate-950 border-2 border-slate-900 rounded-none text-xs font-bold shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] uppercase tracking-wider">
                                Crítico
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-1 bg-amber-400 text-slate-950 border-2 border-slate-900 rounded-none text-xs font-bold shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] uppercase tracking-wider">
                                Bajo
                              </span>
                            )
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-1 bg-emerald-400 text-slate-950 border-2 border-slate-900 rounded-none text-xs font-bold shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] uppercase tracking-wider">
                                Adecuado
                              </span>
                          )}
                        </td>
                        <td className="p-5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button 
                              onClick={() => onUpdateStock(item.id, Math.max(0, item.stockActual - 1))}
                              className="w-8 h-8 rounded-none bg-white border-2 border-slate-900 hover:bg-slate-100 text-slate-900 flex items-center justify-center transition-all cursor-pointer shadow-[1px_1px_0px_0px_#0f172a] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                              title="Disminuir -1"
                            >
                              <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                            </button>
                            <button 
                              onClick={() => onUpdateStock(item.id, item.stockActual + 1)}
                              className="w-8 h-8 rounded-none bg-indigo-600 border-2 border-slate-900 hover:bg-indigo-700 text-white flex items-center justify-center transition-all cursor-pointer shadow-[1px_1px_0px_0px_#0f172a] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                              title="Aumentar +1"
                            >
                              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-500 font-sans font-bold">
                        No se encontraron consumibles para "{searchTerm}"
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Side Column: AI Predictions widget */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="glass-panel p-6 rounded-none border-t-8 border-t-indigo-600 space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <Brain className="text-indigo-600 w-6 h-6 animate-pulse" />
              <h3 className="text-base font-black text-slate-900 font-sans uppercase tracking-tight">Predicción de Compras (IA)</h3>
            </div>
            
            <p className="text-xs text-slate-500 leading-relaxed font-medium uppercase tracking-wider font-mono">
              Basado en el historial de servicios, estacionalidad (alta por lluvias) y tasas de desgaste computadas por AutoTech AI.
            </p>

            {/* List of suggested items to buy */}
            <div className="space-y-3.5 pt-2">
              {aiSuggestions.length > 0 ? (
                aiSuggestions.map((suggestion, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-none border-2 border-slate-900 flex flex-col gap-1 text-xs shadow-[2px_2px_0px_0px_#0f172a]">
                    <div className="flex justify-between items-center">
                      <span className="font-black text-slate-900 uppercase tracking-tight truncate pr-2 font-sans">{suggestion.item.nombre}</span>
                      <span className="text-slate-950 font-black whitespace-nowrap bg-amber-400 border border-slate-950 px-2 py-0.5 rounded-none text-[9px] font-mono shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                        Sugerido: +{suggestion.cantidad} {suggestion.item.unidad}
                      </span>
                    </div>
                    <span className="text-slate-700 text-[11px] leading-normal font-sans font-semibold">
                      {suggestion.razon}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-4 bg-slate-50 rounded-none border-2 border-dashed border-slate-300 text-center text-xs text-slate-500 font-sans font-semibold uppercase tracking-wider">
                  No se registran alertas de compras sugeridas. Tu inventario está al día.
                </div>
              )}
            </div>

            <button 
              onClick={handleGeneratePurchaseOrder}
              className="w-full bento-btn-primary flex items-center justify-center gap-2 text-xs py-3 rounded-none cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4 stroke-[2.5]" />
              Generar Orden de Compra
            </button>
          </div>
        </div>
      </div>

      {/* Modal: Purchase Order Preview */}
      {activePurchaseOrder && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border-4 border-slate-900 rounded-none p-6 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] animate-scaleUp text-slate-900">
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4 mb-5">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2 font-sans uppercase tracking-tight">
                <ShoppingBag className="text-indigo-600 w-5 h-5 stroke-[2.5]" />
                Confirmar Orden de Compra (IA)
              </h3>
              <button 
                onClick={() => setActivePurchaseOrder(null)}
                className="text-slate-900 hover:text-rose-500 transition-colors cursor-pointer"
              >
                <X className="w-6 h-6 stroke-[2.5]" />
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-xs text-slate-600 font-semibold uppercase tracking-wider font-mono">
                Se ha generado un borrador de compra automatizado. Al confirmar, las piezas se añadirán directamente a tu stock.
              </p>

              {/* Order table breakdown */}
              <div className="bg-slate-50 rounded-none border-2 border-slate-900 divide-y border-slate-200 p-1 max-h-[220px] overflow-y-auto">
                {activePurchaseOrder.map((order, idx) => (
                  <div key={idx} className="p-3 flex justify-between items-center text-xs font-sans">
                    <div>
                      <div className="font-black text-slate-900 uppercase tracking-tight">{order.item.nombre}</div>
                      <div className="text-slate-500 text-[10px] font-mono font-bold">Stock actual: {order.item.stockActual}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-emerald-600 font-black font-mono text-sm">+{order.sugerido} {order.item.unidad}</div>
                      <div className="text-slate-500 text-[10px] font-mono font-bold">Est.: ${(order.item.precioUnitario * order.sugerido).toLocaleString('en-US')} USD</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cost overview */}
              <div className="p-4 bg-amber-100 border-2 border-slate-900 rounded-none flex justify-between items-center text-sm font-sans font-black uppercase tracking-tight shadow-[2px_2px_0px_0px_#0f172a]">
                <span className="text-slate-800">Total Proyectado:</span>
                <span className="text-slate-950 font-mono text-base">
                  ${activePurchaseOrder.reduce((acc, o) => acc + (o.item.precioUnitario * o.sugerido), 0).toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
                </span>
              </div>

              <div className="pt-4 border-t-2 border-slate-900 flex gap-3">
                <button 
                  onClick={() => setActivePurchaseOrder(null)}
                  className="flex-1 py-3 bg-white text-slate-900 border-2 border-slate-900 rounded-none text-xs font-black uppercase tracking-wider hover:bg-slate-100 transition-all active:translate-x-0.5 active:translate-y-0.5 shadow-[2px_2px_0px_0px_#0f172a] cursor-pointer"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleConfirmPurchase}
                  className="flex-1 py-3 bg-indigo-600 text-white border-2 border-slate-900 rounded-none text-xs font-black uppercase tracking-wider hover:bg-indigo-700 transition-all active:translate-x-0.5 active:translate-y-0.5 shadow-[2px_2px_0px_0px_#0f172a] cursor-pointer"
                >
                  Confirmar y Reabastecer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
