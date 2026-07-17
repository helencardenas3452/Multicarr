import React, { useState } from 'react';
import { ClipboardCheck, ArrowRight, ArrowLeft, CheckCircle2, MessageSquare, Plus, X, Camera, MapPin, Gauge, ShieldAlert, Sparkles, AlertCircle } from 'lucide-react';
import { KanbanTask, Vehiculo } from '../types';

interface OperativoProps {
  kanban: KanbanTask[];
  onMoveTask: (id: string, nuevoEstado: 'espera' | 'proceso' | 'listo') => void;
  onAddTask: (task: Omit<KanbanTask, 'id' | 'tiempo'>) => void;
  onCompleteTask: (id: string) => void; // Trigger history logging once completed!
}

export default function Operativo({ kanban, onMoveTask, onAddTask, onCompleteTask }: OperativoProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Checklist form states
  const [placa, setPlaca] = useState('');
  const [modelo, setModelo] = useState('');
  const [cliente, setCliente] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [combustible, setCombustible] = useState(50);
  const [mecanicoId, setMecanicoId] = useState('Luis');
  const [photoSelected, setPhotoSelected] = useState<string | null>(null);

  // Group kanban cards by column
  const enEspera = kanban.filter(t => t.estado === 'espera');
  const enProceso = kanban.filter(t => t.estado === 'proceso');
  const listo = kanban.filter(t => t.estado === 'listo');

  // Mechanic mock options
  const mecanicos = [
    { nombre: 'Luis', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=150&auto=format&fit=crop' },
    { nombre: 'Carlos', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop' },
    { nombre: 'Andrés', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop' },
  ];

  // Preset car photo mockups to click and upload in the applet
  const sampleCarPhotos = [
    { id: 'honda', label: 'Civic frontal', url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=300&auto=format&fit=crop' },
    { id: 'ford', label: 'Explorer lateral', url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=300&auto=format&fit=crop' },
    { id: 'generic', label: 'Motor estado', url: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?q=80&w=300&auto=format&fit=crop' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!placa || !modelo || !cliente || !descripcion) {
      alert('Por favor complete todos los campos obligatorios.');
      return;
    }

    const selectedMec = mecanicos.find(m => m.nombre === mecanicoId) || mecanicos[0];

    onAddTask({
      placa: placa.toUpperCase(),
      vehiculo: modelo,
      descripcion,
      estado: 'espera',
      mecanico: selectedMec
    });

    // Reset Form
    setPlaca('');
    setModelo('');
    setCliente('');
    setDescripcion('');
    setCombustible(50);
    setPhotoSelected(null);
    setIsModalOpen(false);
  };

  const handleWhatsappAlert = (task: KanbanTask) => {
    const text = `Hola, te escribe AutoTech AI. Queremos informarte que tu vehículo *${task.vehiculo}* [${task.placa}] ya está listo para entrega en nuestro taller. ¡Puedes pasar por él cuando desees!`;
    const whatsappUrl = `https://wa.me/573000000000?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div id="operativo-section" className="space-y-8 animate-fadeIn text-slate-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tighter text-slate-900 uppercase font-sans">Área Operativa</h2>
          <p className="text-slate-500 text-xs uppercase tracking-wider font-mono">Estatus de órdenes activas y checklist técnico en tiempo real</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bento-btn-primary font-sans flex items-center gap-2 self-start sm:self-center cursor-pointer py-3"
        >
          <ClipboardCheck className="w-5 h-5 stroke-[2.5]" />
          Nuevo Checklist Recepción
        </button>
      </div>

      {/* Kanban Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Column 1: En Espera */}
        <div className="bg-slate-50 border-2 border-slate-900 rounded-none p-5 space-y-4 shadow-[4px_4px_0px_0px_#0f172a]">
          <div className="flex justify-between items-center border-b-2 border-slate-900 pb-2">
            <h3 className="text-xs font-black text-slate-900 flex items-center gap-2 uppercase tracking-widest font-mono">
              <span className="w-2.5 h-2.5 rounded-none border border-slate-900 bg-slate-400 block" />
              En Espera
            </h3>
            <span className="bg-slate-900 text-white font-black px-2 py-0.5 rounded-none text-xs font-mono">
              {enEspera.length}
            </span>
          </div>

          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
            {enEspera.length > 0 ? (
              enEspera.map((task) => (
                <div key={task.id} className="glass-panel p-5 rounded-none relative group hover:border-slate-900 transition-all duration-300">
                  <div className="flex justify-between items-center mb-3">
                    <span className="px-2 py-0.5 bg-slate-900 text-white border border-slate-900 rounded-none font-black font-mono text-[10px] tracking-wider uppercase">
                      {task.placa}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono font-bold uppercase">{task.tiempo}</span>
                  </div>
                  <h4 className="text-sm font-black text-slate-900 font-sans uppercase tracking-tight">{task.vehiculo}</h4>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed font-sans font-medium">{task.descripcion}</p>
                  
                  {/* Footer mechanic + Actions */}
                  <div className="mt-4 pt-3 border-t-2 border-slate-900 flex items-center justify-between">
                    <span className="text-[10px] text-indigo-600 font-black uppercase font-mono">Sin Mecánico</span>
                    <button 
                      onClick={() => onMoveTask(task.id, 'proceso')}
                      className="w-7 h-7 rounded-none bg-white border-2 border-slate-900 hover:bg-indigo-600 hover:text-white text-slate-900 flex items-center justify-center transition-all cursor-pointer shadow-[1px_1px_0px_0px_#0f172a] active:translate-x-0.5 active:translate-y-0.5"
                      title="Mover a En Proceso"
                    >
                      <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-xs text-slate-400 border-2 border-dashed border-slate-300 rounded-none font-sans font-bold uppercase tracking-wider">
                No hay vehículos en espera de servicio.
              </div>
            )}
          </div>
        </div>

        {/* Column 2: En Proceso */}
        <div className="bg-amber-50 border-2 border-slate-900 rounded-none p-5 space-y-4 shadow-[4px_4px_0px_0px_#0f172a]">
          <div className="flex justify-between items-center border-b-2 border-slate-900 pb-2">
            <h3 className="text-xs font-black text-amber-700 flex items-center gap-2 uppercase tracking-widest font-mono">
              <span className="w-2.5 h-2.5 rounded-none border border-slate-900 bg-amber-400 block animate-pulse" />
              En Proceso
            </h3>
            <span className="bg-amber-400 border border-slate-900 text-slate-950 font-black px-2 py-0.5 rounded-none text-xs font-mono">
              {enProceso.length}
            </span>
          </div>

          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
            {enProceso.length > 0 ? (
              enProceso.map((task) => (
                <div key={task.id} className="glass-panel p-5 rounded-none border-l-8 border-l-amber-400 relative group hover:border-slate-900 transition-all duration-300">
                  <div className="flex justify-between items-center mb-3">
                    <span className="px-2 py-0.5 bg-slate-900 text-white border border-slate-900 rounded-none font-black font-mono text-[10px] tracking-wider uppercase">
                      {task.placa}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono font-bold uppercase">{task.tiempo}</span>
                  </div>
                  <h4 className="text-sm font-black text-slate-900 font-sans uppercase tracking-tight">{task.vehiculo}</h4>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed font-sans font-medium">{task.descripcion}</p>
                  
                  {/* Assigned mechanic + Actions */}
                  <div className="mt-4 pt-3 border-t-2 border-slate-900 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[11px] text-slate-700 font-bold uppercase font-mono">
                      {task.mecanico && (
                        <>
                          <img src={task.mecanico.avatar} alt="M" className="w-5 h-5 rounded-none object-cover border border-slate-900" referrerPolicy="no-referrer" />
                          <span>{task.mecanico.nombre}</span>
                        </>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <button 
                        onClick={() => onMoveTask(task.id, 'espera')}
                        className="w-7 h-7 rounded-none bg-white border-2 border-slate-900 hover:bg-slate-100 text-slate-900 flex items-center justify-center transition-all cursor-pointer shadow-[1px_1px_0px_0px_#0f172a] active:translate-x-0.5 active:translate-y-0.5"
                        title="Regresar a En Espera"
                      >
                        <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
                      </button>
                      <button 
                        onClick={() => onMoveTask(task.id, 'listo')}
                        className="w-7 h-7 rounded-none bg-emerald-400 border-2 border-slate-900 hover:bg-emerald-500 text-slate-950 flex items-center justify-center transition-all cursor-pointer shadow-[1px_1px_0px_0px_#0f172a] active:translate-x-0.5 active:translate-y-0.5"
                        title="Mover a Listo"
                      >
                        <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-xs text-amber-600/60 border-2 border-dashed border-amber-200 rounded-none font-sans font-bold uppercase tracking-wider">
                Ningún vehículo en fase técnica activa.
              </div>
            )}
          </div>
        </div>

        {/* Column 3: Listo */}
        <div className="bg-emerald-50 border-2 border-slate-900 rounded-none p-5 space-y-4 shadow-[4px_4px_0px_0px_#0f172a]">
          <div className="flex justify-between items-center border-b-2 border-slate-900 pb-2">
            <h3 className="text-xs font-black text-emerald-800 flex items-center gap-2 uppercase tracking-widest font-mono">
              <span className="w-2.5 h-2.5 rounded-none border border-slate-900 bg-emerald-400 block" />
              Listo para Entrega
            </h3>
            <span className="bg-emerald-400 border border-slate-900 text-slate-950 font-black px-2 py-0.5 rounded-none text-xs font-mono">
              {listo.length}
            </span>
          </div>

          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
            {listo.length > 0 ? (
              listo.map((task) => (
                <div key={task.id} className="glass-panel p-5 rounded-none border-l-8 border-l-emerald-500 relative group hover:border-slate-900 transition-all duration-300">
                  <div className="flex justify-between items-center mb-3">
                    <span className="px-2 py-0.5 bg-slate-900 text-white border border-slate-900 rounded-none font-black font-mono text-[10px] tracking-wider uppercase">
                      {task.placa}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono font-bold uppercase">{task.tiempo}</span>
                  </div>
                  <h4 className="text-sm font-black text-slate-900 font-sans uppercase tracking-tight">{task.vehiculo}</h4>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed font-sans font-medium">{task.descripcion}</p>
                  
                  {/* Mechanic list item + actions */}
                  <div className="mt-4 pt-3 border-t-2 border-slate-900 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[11px] text-slate-700 font-bold uppercase font-mono">
                        {task.mecanico && (
                          <>
                            <img src={task.mecanico.avatar} alt="M" className="w-5 h-5 rounded-none object-cover border border-slate-900" referrerPolicy="no-referrer" />
                            <span>{task.mecanico.nombre}</span>
                          </>
                        )}
                      </div>
                      <div className="flex gap-1.5">
                        <button 
                          onClick={() => onMoveTask(task.id, 'proceso')}
                          className="w-7 h-7 rounded-none bg-white border-2 border-slate-900 hover:bg-slate-100 text-slate-900 flex items-center justify-center transition-all cursor-pointer shadow-[1px_1px_0px_0px_#0f172a] active:translate-x-0.5 active:translate-y-0.5"
                          title="Regresar a En Proceso"
                        >
                          <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
                        </button>
                        <button 
                          onClick={() => onCompleteTask(task.id)}
                          className="w-7 h-7 rounded-none bg-emerald-400 border-2 border-slate-900 hover:bg-emerald-500 text-slate-950 flex items-center justify-center transition-all cursor-pointer shadow-[1px_1px_0px_0px_#0f172a] active:translate-x-0.5 active:translate-y-0.5"
                          title="Facturar e Integrar a Historial Clínico"
                        >
                          <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Notify client WhatsApp button */}
                    <button 
                      onClick={() => handleWhatsappAlert(task)}
                      className="w-full py-2 bg-emerald-400 hover:bg-emerald-500 border-2 border-slate-900 text-slate-950 font-black text-xs rounded-none flex items-center justify-center gap-1.5 transition-all shadow-[2px_2px_0px_0px_#0f172a] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer uppercase tracking-wider"
                    >
                      <MessageSquare className="w-4 h-4 stroke-[2.5]" />
                      Avisar Cliente (WhatsApp)
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-xs text-emerald-600/60 border-2 border-dashed border-emerald-200 rounded-none font-sans font-bold uppercase tracking-wider">
                Ningún vehículo listo para retirar.
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Modal: Checklist Recepción */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white border-4 border-slate-900 rounded-none p-6 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] animate-scaleUp max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4 mb-5">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2 font-sans uppercase tracking-tight">
                <ClipboardCheck className="text-indigo-600 w-5.5 h-5.5 stroke-[2.5]" />
                Checklist de Recepción
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-900 hover:text-rose-600 transition-colors cursor-pointer"
              >
                <X className="w-6 h-6 stroke-[2.5]" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-slate-900">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-900 font-mono uppercase tracking-wider mb-1.5">
                    Placa *
                  </label>
                  <input 
                    type="text" 
                    required
                    placeholder="ABC-123" 
                    value={placa}
                    onChange={(e) => setPlaca(e.target.value)}
                    className="w-full bg-white border-2 border-slate-900 rounded-none px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors uppercase font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-900 font-mono uppercase tracking-wider mb-1.5">
                    Modelo de Vehículo *
                  </label>
                  <input 
                    type="text" 
                    required
                    placeholder="Ford Explorer 2018" 
                    value={modelo}
                    onChange={(e) => setModelo(e.target.value)}
                    className="w-full bg-white border-2 border-slate-900 rounded-none px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors font-sans font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-black text-slate-900 font-mono uppercase tracking-wider mb-1.5">
                    Cliente / Propietario *
                  </label>
                  <input 
                    type="text" 
                    required
                    placeholder="Sandra Gómez" 
                    value={cliente}
                    onChange={(e) => setCliente(e.target.value)}
                    className="w-full bg-white border-2 border-slate-900 rounded-none px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors font-sans font-bold"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-black text-slate-900 font-mono uppercase tracking-wider mb-1.5">
                    Asignar Mecánico Inicial
                  </label>
                  <select 
                    value={mecanicoId}
                    onChange={(e) => setMecanicoId(e.target.value)}
                    className="w-full bg-white border-2 border-slate-900 rounded-none px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors font-sans font-bold"
                  >
                    {mecanicos.map(m => (
                      <option key={m.nombre} value={m.nombre}>{m.nombre}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-900 font-mono uppercase tracking-wider mb-1.5">
                  Descripción del Fallo / Diagnóstico *
                </label>
                <textarea 
                  required
                  rows={2}
                  placeholder="Revisión de ruidos metálicos al frenar y alineación de dirección." 
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  className="w-full bg-white border-2 border-slate-900 rounded-none px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors font-sans font-bold resize-none"
                />
              </div>

              {/* Fuel Slider */}
              <div className="bg-slate-50 p-4 border-2 border-slate-900 rounded-none space-y-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-black text-slate-900 font-mono uppercase tracking-wider flex items-center gap-1">
                    <Gauge className="w-4 h-4 text-slate-900" />
                    Nivel de Gasolina
                  </span>
                  <span className="font-extrabold text-indigo-600 text-sm font-mono">{combustible}%</span>
                </div>
                <div className="flex gap-4 items-center">
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={combustible}
                    onChange={(e) => setCombustible(parseInt(e.target.value))}
                    className="cursor-pointer w-full h-2 bg-slate-200 border-2 border-slate-900 appearance-none rounded-none outline-none accent-indigo-600"
                  />
                </div>
              </div>

              {/* Exterior Inspection Photos */}
              <div className="space-y-2">
                <label className="block text-xs font-black text-slate-900 font-mono uppercase tracking-wider">
                  Fotografía de Estado de Carrocería
                </label>
                
                {/* Image presets */}
                <div className="grid grid-cols-3 gap-2">
                  {sampleCarPhotos.map(photo => (
                    <button
                      key={photo.id}
                      type="button"
                      onClick={() => setPhotoSelected(photo.url)}
                      className={`relative aspect-video rounded-none overflow-hidden border-2 transition-all cursor-pointer ${
                        photoSelected === photo.url 
                          ? 'border-indigo-600 ring-2 ring-indigo-500/30' 
                          : 'border-slate-900 hover:opacity-90'
                      }`}
                    >
                      <img src={photo.url} alt={photo.label} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      <div className="absolute inset-x-0 bottom-0 bg-white/95 border-t border-slate-900 flex items-center justify-center p-1">
                        <span className="text-[9px] text-slate-900 font-mono font-bold truncate uppercase">{photo.label}</span>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="border-2 border-dashed border-slate-400 p-5 rounded-none flex flex-col items-center justify-center gap-1.5 text-slate-500 cursor-pointer hover:border-indigo-500 hover:bg-slate-50 transition-all">
                  <Camera className="w-6 h-6 text-slate-900" />
                  <span className="text-xs text-slate-900 font-black font-sans uppercase tracking-wider">Tomar o adjuntar foto real</span>
                  <span className="text-[10px] text-slate-500 font-mono font-bold">SOPORTA JPG, PNG EN LA APP FÍSICA</span>
                </div>
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
                  className="flex-1 py-3 bg-indigo-600 text-white border-2 border-slate-900 rounded-none text-xs font-black uppercase tracking-wider hover:bg-indigo-700 transition-all active:translate-x-0.5 active:translate-y-0.5 shadow-[2px_2px_0px_0px_#0f172a] cursor-pointer"
                >
                  Guardar e Iniciar Orden
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
