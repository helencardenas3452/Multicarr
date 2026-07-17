import React, { useState } from 'react';
import { Search, Plus, Filter, Eye, X, Check, AlertTriangle, Sparkles, FileText, Calendar, DollarSign, User, ShieldAlert } from 'lucide-react';
import { HistorialRecord } from '../types';

interface HistorialProps {
  historial: HistorialRecord[];
  onAddRecord: (record: Omit<HistorialRecord, 'id'>) => void;
  onDeleteRecord: (id: string) => void;
}

export default function Historial({ historial, onAddRecord, onDeleteRecord }: HistorialProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<HistorialRecord | null>(null);

  // Form states for new record
  const [formPlaca, setFormPlaca] = useState('');
  const [formVehiculo, setFormVehiculo] = useState('');
  const [formCliente, setFormCliente] = useState('');
  const [formServicio, setFormServicio] = useState('');
  const [formCosto, setFormCosto] = useState('');
  const [formAiSugerencia, setFormAiSugerencia] = useState('Al día');
  const [formAiTipo, setFormAiTipo] = useState<'success' | 'warning' | 'info'>('success');

  // Filter list by plate or vehicle or client
  const filteredHistorial = historial.filter(item => 
    item.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.vehiculo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.cliente.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formPlaca || !formVehiculo || !formCliente || !formServicio || !formCosto) {
      alert('Por favor complete todos los campos requeridos.');
      return;
    }

    onAddRecord({
      placa: formPlaca.toUpperCase(),
      vehiculo: formVehiculo,
      cliente: formCliente,
      fecha: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }),
      servicio: formServicio,
      costo: parseFloat(formCosto),
      aiSugerencia: {
        tipo: formAiTipo,
        texto: formAiSugerencia
      }
    });

    // Reset Form
    setFormPlaca('');
    setFormVehiculo('');
    setFormCliente('');
    setFormServicio('');
    setFormCosto('');
    setFormAiSugerencia('Al día');
    setFormAiTipo('success');
    setIsModalOpen(false);
  };

  const handleAutoSuggest = () => {
    // Basic rules to suggest preventative services dynamically based on text
    const serv = formServicio.toLowerCase();
    if (serv.includes('aceite')) {
      setFormAiSugerencia('Revisión de bujías e inyectores (+15k km)');
      setFormAiTipo('info');
    } else if (serv.includes('balatas') || serv.includes('freno')) {
      setFormAiSugerencia('Cambio preventivo de líquido de frenos (+20k km)');
      setFormAiTipo('warning');
    } else if (serv.includes('afinacion') || serv.includes('motor')) {
      setFormAiSugerencia('Monitoreo preventivo de sensores de oxígeno');
      setFormAiTipo('warning');
    } else if (serv.includes('bateria') || serv.includes('electrico')) {
      setFormAiSugerencia('Revisión de alternador y encendido');
      setFormAiTipo('info');
    } else {
      setFormAiSugerencia('Inspección de amortiguadores y alineación preventiva');
      setFormAiTipo('success');
    }
  };

  return (
    <div id="historial-section" className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tighter text-slate-900 uppercase font-sans">Historial Clínico Automotriz</h2>
          <p className="text-slate-500 text-xs uppercase tracking-wider font-mono">Repositorio digital centralizado de intervenciones por vehículo</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bento-btn-primary px-6 py-3 flex items-center gap-2 self-start sm:self-center cursor-pointer"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          Nuevo Registro
        </button>
      </div>

      {/* Main Content Card */}
      <div className="table-container glass-panel rounded-none overflow-hidden">
        
        {/* Table Filter Actions */}
        <div className="p-5 border-b-2 border-slate-900 flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3 bg-white border-2 border-slate-900 rounded-none px-4 py-2 w-full sm:max-w-md focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
            <Search className="w-4 h-4 text-slate-900 flex-shrink-0" />
            <input 
              type="text" 
              placeholder="Filtrar placa, vehículo o cliente..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none text-slate-900 text-sm placeholder-slate-400 w-full font-sans font-medium"
            />
          </div>
          <div className="text-xs text-slate-600 font-mono font-bold uppercase tracking-wider self-stretch sm:self-auto flex items-center justify-end gap-2">
            <Filter className="w-3.5 h-3.5" />
            Mostrando {filteredHistorial.length} de {historial.length} registros
          </div>
        </div>

        {/* Interactive Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-900 bg-slate-100 text-xs font-black text-slate-900 font-mono uppercase tracking-wider">
                <th className="p-5">Placa</th>
                <th className="p-5">Vehículo</th>
                <th className="p-5">Cliente</th>
                <th className="p-5">Servicio Realizado</th>
                <th className="p-5">IA Sugerencia Preventiva</th>
                <th className="p-5 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-slate-900 text-sm text-slate-900">
              {filteredHistorial.length > 0 ? (
                filteredHistorial.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="p-5 font-mono">
                      <span className="px-3 py-1 bg-amber-400 text-slate-950 rounded-none font-black tracking-wider text-xs border-2 border-slate-900 shadow-[1px_1px_0px_0px_#0f172a]">
                        {record.placa}
                      </span>
                    </td>
                    <td className="p-5">
                      <div className="font-black text-slate-900 uppercase tracking-tight">{record.vehiculo}</div>
                      <div className="text-slate-500 text-xs mt-0.5 font-mono font-bold uppercase">{record.fecha}</div>
                    </td>
                    <td className="p-5 font-sans font-semibold text-slate-800">
                      {record.cliente}
                    </td>
                    <td className="p-5">
                      <span className="text-slate-900 block font-bold">{record.servicio}</span>
                      <span className="text-[11px] text-indigo-600 font-mono font-bold mt-0.5 block">${record.costo.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD</span>
                    </td>
                    <td className="p-5">
                      {record.aiSugerencia.tipo === 'success' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-400 text-slate-950 border-2 border-slate-900 rounded-none text-xs font-bold shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                          {record.aiSugerencia.texto}
                        </span>
                      ) : record.aiSugerencia.tipo === 'warning' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400 text-slate-950 border-2 border-slate-900 rounded-none text-xs font-bold shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                          <AlertTriangle className="w-3.5 h-3.5 stroke-[2.5]" />
                          {record.aiSugerencia.texto}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-400 text-slate-950 border-2 border-slate-900 rounded-none text-xs font-bold shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                          <Sparkles className="w-3.5 h-3.5 text-slate-950 stroke-[2.5]" />
                          {record.aiSugerencia.texto}
                        </span>
                      )}
                    </td>
                    <td className="p-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => setSelectedRecord(record)}
                          className="w-9 h-9 bg-white hover:bg-indigo-600 hover:text-white border-2 border-slate-900 rounded-none flex items-center justify-center text-slate-900 transition-all active:translate-x-0.5 active:translate-y-0.5 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] cursor-pointer"
                          title="Inspeccionar Historial"
                        >
                          <Eye className="w-4 h-4 stroke-[2]" />
                        </button>
                        <button 
                          onClick={() => {
                            if (confirm('¿Está seguro de eliminar este registro clínico del historial?')) {
                              onDeleteRecord(record.id);
                            }
                          }}
                          className="w-9 h-9 bg-white hover:bg-rose-500 hover:text-white border-2 border-slate-900 rounded-none flex items-center justify-center text-slate-500 hover:text-white transition-all active:translate-x-0.5 active:translate-y-0.5 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] cursor-pointer"
                          title="Eliminar Registro"
                        >
                          <X className="w-4 h-4 stroke-[2]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500 font-sans font-bold">
                    No se encontraron registros de historial para "{searchTerm}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Nuevo Registro */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white border-4 border-slate-900 rounded-none p-6 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] animate-scaleUp text-slate-900">
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4 mb-5">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2 uppercase tracking-tight">
                <FileText className="text-indigo-600 w-5.5 h-5.5 stroke-[2.5]" />
                Registrar Intervención
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-900 hover:text-rose-500 transition-colors cursor-pointer"
              >
                <X className="w-6 h-6 stroke-[2.5]" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 font-mono uppercase tracking-wider mb-1.5">
                    Placa *
                  </label>
                  <input 
                    type="text" 
                    required
                    placeholder="ABC-123" 
                    value={formPlaca}
                    onChange={(e) => setFormPlaca(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-900 rounded-none px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white uppercase font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 font-mono uppercase tracking-wider mb-1.5">
                    Vehículo (Marca/Modelo) *
                  </label>
                  <input 
                    type="text" 
                    required
                    placeholder="Honda Civic 2019" 
                    value={formVehiculo}
                    onChange={(e) => setFormVehiculo(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-900 rounded-none px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white font-sans font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 font-mono uppercase tracking-wider mb-1.5">
                  Propietario / Cliente *
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="Juan Pérez" 
                  value={formCliente}
                  onChange={(e) => setFormCliente(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-900 rounded-none px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white font-sans font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-[10px] font-black text-slate-500 font-mono uppercase tracking-wider mb-1.5">
                    Servicio Realizado *
                  </label>
                  <input 
                    type="text" 
                    required
                    placeholder="Cambio de Aceite" 
                    value={formServicio}
                    onBlur={handleAutoSuggest}
                    onChange={(e) => setFormServicio(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-900 rounded-none px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white font-sans font-semibold"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-[10px] font-black text-slate-500 font-mono uppercase tracking-wider mb-1.5">
                    Costo de Intervención (USD) *
                  </label>
                  <input 
                    type="number" 
                    required
                    step="0.01"
                    placeholder="120.00" 
                    value={formCosto}
                    onChange={(e) => setFormCosto(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-900 rounded-none px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white font-mono font-bold"
                  />
                </div>
              </div>

              <div className="border-t-2 border-slate-900 pt-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[10px] font-black text-slate-500 font-mono uppercase tracking-wider">
                    Sugerencia de Prevención Inteligente (IA)
                  </label>
                  <button 
                    type="button" 
                    onClick={handleAutoSuggest}
                    className="text-[11px] text-indigo-600 hover:text-indigo-800 font-mono font-bold flex items-center gap-1 cursor-pointer uppercase"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
                    Auto-sugerir
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-2">
                  {[
                    { val: 'success', label: 'Al día (Éxito)' },
                    { val: 'warning', label: 'Preventivo (Alerta)' },
                    { val: 'info', label: 'Inspección (IA)' }
                  ].map(b => (
                    <button
                      key={b.val}
                      type="button"
                      onClick={() => setFormAiTipo(b.val as any)}
                      className={`py-2 px-1 text-[10px] font-black uppercase rounded-none border-2 text-center transition-all cursor-pointer ${
                        formAiTipo === b.val 
                          ? 'bg-indigo-600 border-slate-900 text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' 
                          : 'bg-white border-slate-200 text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
                <input 
                  type="text" 
                  placeholder="Revisión de Balatas (+30k km)" 
                  value={formAiSugerencia}
                  onChange={(e) => setFormAiSugerencia(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-900 rounded-none px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white font-sans font-semibold"
                />
              </div>

              <div className="pt-4 border-t-2 border-slate-900 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 bg-white text-slate-900 border-2 border-slate-900 rounded-none text-xs font-black uppercase tracking-wider hover:bg-slate-100 transition-all active:translate-x-0.5 active:translate-y-0.5 shadow-[2px_2px_0px_0px_#0f172a] cursor-pointer"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-3 bg-amber-400 text-slate-950 border-2 border-slate-900 rounded-none text-xs font-black uppercase tracking-wider hover:bg-amber-500 transition-all active:translate-x-0.5 active:translate-y-0.5 shadow-[2px_2px_0px_0px_#0f172a] cursor-pointer"
                >
                  Guardar Historial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Slide / Modal: Ver Detalles Clínicos */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border-4 border-slate-900 rounded-none overflow-hidden shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] animate-scaleUp text-slate-900">
            
            {/* Health Card Header */}
            <div className="bg-indigo-600 p-6 text-white border-b-2 border-slate-900 relative">
              <button 
                onClick={() => setSelectedRecord(null)}
                className="absolute top-4 right-4 bg-slate-950 hover:bg-slate-900 rounded-none border border-slate-700 p-1.5 transition-all cursor-pointer"
              >
                <X className="w-5 h-5 text-white" />
              </button>
              <span className="bg-amber-400 text-slate-950 font-black font-mono px-3 py-1 rounded-none text-xs tracking-wider border-2 border-slate-900 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                {selectedRecord.placa}
              </span>
              <h3 className="text-xl font-black mt-4 font-sans uppercase tracking-tight">{selectedRecord.vehiculo}</h3>
              <p className="text-xs text-indigo-200 font-mono font-bold mt-1 uppercase">INTERVENCIÓN: {selectedRecord.fecha}</p>
            </div>

            {/* Health Details */}
            <div className="p-6 space-y-5 bg-white">
              
              <div className="flex gap-4 items-start pb-4 border-b border-slate-200 text-xs text-slate-800">
                <User className="w-5 h-5 text-slate-900 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-black text-slate-900 uppercase tracking-wider text-[10px] font-mono">Propietario Registrado</h4>
                  <p className="text-slate-700 font-semibold mt-1 text-sm">{selectedRecord.cliente}</p>
                </div>
              </div>

              <div className="flex gap-4 items-start pb-4 border-b border-slate-200 text-xs text-slate-800">
                <Calendar className="w-5 h-5 text-slate-900 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-black text-slate-900 uppercase tracking-wider text-[10px] font-mono">Servicio Clínico Aplicado</h4>
                  <p className="text-slate-700 font-semibold mt-1 text-sm">{selectedRecord.servicio}</p>
                </div>
              </div>

              <div className="flex gap-4 items-start pb-4 border-b border-slate-200 text-xs text-slate-800">
                <DollarSign className="w-5 h-5 text-slate-900 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-black text-slate-900 uppercase tracking-wider text-[10px] font-mono">Costo del Ticket</h4>
                  <p className="text-indigo-600 font-black mt-1 font-mono text-base">${selectedRecord.costo.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD</p>
                </div>
              </div>

              {/* Preventative diagnostic block */}
              <div className="p-4 bg-slate-50 border-2 border-slate-900 rounded-none space-y-2 shadow-[2px_2px_0px_0px_#0f172a]">
                <div className="flex items-center gap-1.5 text-[10px] font-black text-indigo-600 font-mono uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />
                  DIAGNÓSTICO PREVENTIVO IA
                </div>
                <p className="text-xs text-slate-800 leading-relaxed font-sans font-bold">
                  "{selectedRecord.aiSugerencia.texto}"
                </p>
                <div className="pt-2 text-[9px] text-slate-500 font-mono font-bold leading-normal uppercase tracking-wider border-t border-slate-200">
                  Sugerencia generada inteligentemente de acuerdo a la correlación de servicios y kilometraje estimado para este modelo de vehículo.
                </div>
              </div>

              <button 
                onClick={() => setSelectedRecord(null)}
                className="w-full py-3 bg-slate-900 text-white rounded-none border-2 border-slate-900 text-xs font-black uppercase tracking-wider hover:bg-slate-800 transition-all active:translate-x-0.5 active:translate-y-0.5 shadow-[2px_2px_0px_0px_#0f172a] cursor-pointer"
              >
                Cerrar Reporte Clínico
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
