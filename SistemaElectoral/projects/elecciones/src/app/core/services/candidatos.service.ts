import { Injectable } from '@angular/core';
import { Candidato } from '../models/candidato.model';

/**
 * Servicio para la gestión integral (CRUD) de candidatos del sistema electoral.
 * Administra el registro, actualización, consulta y baja de candidatos participantes.
 */
@Injectable({
  providedIn: 'root'
})
export class CandidatosService {

  /** Lista inicial de candidatos oficiales del proceso electoral. */
  private readonly datosSemilla: Candidato[] = [
    {
      id: 1,
      nombre: 'Ana Gómez Rivas',
      partido: 'Movimiento Futuro Verde',
      iniciales: 'AG',
      color: '#2e7d32',
      lista: 'Lista 35',
      cargo: 'Presidencia de la República',
      propuestaPrincipal: 'Transición ecológica justa, economía circular y energías renovables descentralizadas.',
      estado: 'Activo',
      fechaInscripcion: '12 de mayo, 2026'
    },
    {
      id: 2,
      nombre: 'Carlos Andrade Vera',
      partido: 'Alianza Progreso Nacional',
      iniciales: 'CA',
      color: '#1976d2',
      lista: 'Lista 21',
      cargo: 'Presidencia de la República',
      propuestaPrincipal: 'Incentivos a la inversión tecnológica, modernización portuaria y empleo juvenil.',
      estado: 'Activo',
      fechaInscripcion: '14 de mayo, 2026'
    },
    {
      id: 3,
      nombre: 'Lucía Herrera Paz',
      partido: 'Unidad Ciudadana',
      iniciales: 'LH',
      color: '#c62828',
      lista: 'Lista 5',
      cargo: 'Presidencia de la República',
      propuestaPrincipal: 'Fortalecimiento de la salud y educación pública gratuita y de calidad universal.',
      estado: 'Activo',
      fechaInscripcion: '15 de mayo, 2026'
    },
    {
      id: 4,
      nombre: 'Diego Salazar Mora',
      partido: 'Frente Renovador',
      iniciales: 'DS',
      color: '#e65100',
      lista: 'Lista 8',
      cargo: 'Presidencia de la República',
      propuestaPrincipal: 'Reforma judicial integral, transparencia estatal y combate frontal a la corrupción.',
      estado: 'Activo',
      fechaInscripcion: '18 de mayo, 2026'
    },
    {
      id: 5,
      nombre: 'Valeria Ortiz Cabrera',
      partido: 'Partido Cívico Independiente',
      iniciales: 'VO',
      color: '#6a1b9a',
      lista: 'Lista 12',
      cargo: 'Presidencia de la República',
      propuestaPrincipal: 'Descentralización financiera y autonomía administrativa de los gobiernos locales.',
      estado: 'Activo',
      fechaInscripcion: '20 de mayo, 2026'
    }
  ];

  private candidatos: Candidato[] = [];

  constructor() {
    this.restablecer();
  }

  /** Devuelve una copia de la lista de todos los candidatos. */
  obtenerCandidatos(): Candidato[] {
    return this.candidatos.map(c => ({ ...c }));
  }

  /** Obtiene un candidato por su identificador único. */
  obtenerCandidatoPorId(id: number): Candidato | undefined {
    const encontrado = this.candidatos.find(c => c.id === id);
    return encontrado ? { ...encontrado } : undefined;
  }

  /** Genera las iniciales a partir de un nombre. */
  generarIniciales(nombre: string): string {
    if (!nombre) return '??';
    const partes = nombre.trim().split(/\s+/).filter(Boolean);
    if (partes.length === 0) return '??';
    if (partes.length === 1) return partes[0].substring(0, 2).toUpperCase();
    return (partes[0][0] + partes[1][0]).toUpperCase();
  }

  /**
   * Registra un nuevo candidato en el sistema.
   * Genera el ID automáticamente si no se especifica.
   */
  crearCandidato(nuevo: Omit<Candidato, 'id'>): Candidato {
    const maxId = this.candidatos.reduce((max, c) => (c.id > max ? c.id : max), 0);
    const nuevoId = maxId + 1;

    const candidatoCreado: Candidato = {
      ...nuevo,
      id: nuevoId,
      iniciales: nuevo.iniciales?.trim() || this.generarIniciales(nuevo.nombre),
      color: nuevo.color || '#1976d2',
      cargo: nuevo.cargo || 'Presidencia de la República',
      estado: nuevo.estado || 'Activo',
      fechaInscripcion: nuevo.fechaInscripcion || new Date().toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    };

    this.candidatos.push(candidatoCreado);
    return { ...candidatoCreado };
  }

  /**
   * Actualiza los datos de un candidato existente.
   * Retorna el candidato modificado o null si no se encuentra.
   */
  actualizarCandidato(id: number, cambios: Partial<Candidato>): Candidato | null {
    const indice = this.candidatos.findIndex(c => c.id === id);
    if (indice === -1) {
      return null;
    }

    const anterior = this.candidatos[indice];
    const nombreFinal = cambios.nombre !== undefined ? cambios.nombre : anterior.nombre;
    const inicialesFinales = cambios.iniciales
      ? cambios.iniciales
      : (cambios.nombre ? this.generarIniciales(nombreFinal) : anterior.iniciales);

    const actualizado: Candidato = {
      ...anterior,
      ...cambios,
      id, // Preservar ID inmutable
      nombre: nombreFinal,
      iniciales: inicialesFinales
    };

    this.candidatos[indice] = actualizado;
    return { ...actualizado };
  }

  /**
   * Elimina un candidato del sistema por su ID.
   * Retorna true si se eliminó exitosamente, false si no se encontró.
   */
  eliminarCandidato(id: number): boolean {
    const longitudInicial = this.candidatos.length;
    this.candidatos = this.candidatos.filter(c => c.id !== id);
    return this.candidatos.length < longitudInicial;
  }

  /** Restablece la colección a los datos semilla iniciales. */
  restablecer(): void {
    this.candidatos = this.datosSemilla.map(c => ({ ...c }));
  }

  /** Busca candidatos que coincidan con un término en nombre, partido o lista. */
  buscar(termino: string): Candidato[] {
    const q = termino?.toLowerCase().trim() || '';
    if (!q) {
      return this.obtenerCandidatos();
    }
    return this.candidatos
      .filter(c =>
        c.nombre.toLowerCase().includes(q) ||
        c.partido.toLowerCase().includes(q) ||
        (c.lista && c.lista.toLowerCase().includes(q))
      )
      .map(c => ({ ...c }));
  }
}
