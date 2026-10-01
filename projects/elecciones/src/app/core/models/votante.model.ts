/** Estado del sufragio de un votante en el padrón electoral. */
export type EstadoVoto = 'Votado' | 'Pendiente';

/** Datos del votante mostrados tras el ingreso al sistema. */
export interface Votante {
  nombre: string;
  cedula: string;
  recinto: string;
  mesa: string;
  estadoVoto: EstadoVoto;
}
