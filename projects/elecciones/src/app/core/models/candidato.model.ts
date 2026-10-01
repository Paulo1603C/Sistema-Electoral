/** Candidato disponible en la elección y administración del sistema electoral. */
export interface Candidato {
  id: number;
  nombre: string;
  partido: string;
  iniciales: string;
  color: string;
  lista?: string;
  cargo?: string;
  propuestaPrincipal?: string;
  estado?: 'Activo' | 'Inactivo';
  fechaInscripcion?: string;
}
