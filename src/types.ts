export interface Vehiculo {
  id: string;
  placa: string;
  modelo: string;
  cliente: string;
  telefono?: string;
  combustible: number; // 0-100
  fotos?: string[];
  fechaIngreso: string;
}

export interface HistorialRecord {
  id: string;
  placa: string;
  vehiculo: string;
  cliente: string;
  fecha: string;
  servicio: string;
  costo: number;
  aiSugerencia: {
    tipo: 'warning' | 'success' | 'info';
    texto: string;
  };
}

export interface InventarioItem {
  id: string;
  nombre: string;
  categoria: string;
  stockActual: number;
  stockMinimo: number;
  unidad: string;
  precioUnitario: number;
  estado: 'Adecuado' | 'Bajo' | 'Crítico';
}

export interface KanbanTask {
  id: string;
  placa: string;
  vehiculo: string;
  descripcion: string;
  estado: 'espera' | 'proceso' | 'listo';
  tiempo: string;
  mecanico?: {
    nombre: string;
    avatar: string;
  };
}

export interface AIInsight {
  id: string;
  tipo: 'oportunidad' | 'alerta' | 'prediccion';
  texto: string;
  resaltado: string;
}
