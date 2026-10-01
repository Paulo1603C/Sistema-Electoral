import { Component, HostListener, OnInit } from '@angular/core';
import { Candidato } from '../../../models/candidato.model';
import { CandidatosService } from '../../../services/candidatos.service';

/** Estructura del formulario de registro y edición de candidatos. */
export interface CandidatoFormulario {
  id?: number;
  nombre: string;
  partido: string;
  lista: string;
  cargo: string;
  color: string;
  iniciales: string;
  propuestaPrincipal: string;
  estado: 'Activo' | 'Inactivo';
}

/**
 * Vista completa para la administración y gestión (CRUD) de candidatos.
 * Presenta un diseño minimalista actual, con métricas en tiempo real,
 * búsqueda, filtros, vista en tarjetas y tabla, y formularios con validación.
 */
@Component({
  selector: 'se-page-candidatos',
  templateUrl: './page-candidatos.component.html',
  styleUrls: ['../placeholder.shared.css', './page-candidatos.component.css']
})
export class PageCandidatosComponent implements OnInit {

  /** Título principal de la sección electoral. */
  readonly titulo = 'Candidatos';

  /** Colección completa de candidatos administrados. */
  candidatos: Candidato[] = [];

  /** Colección filtrada según término de búsqueda y estado. */
  candidatosFiltrados: Candidato[] = [];

  /** Término de búsqueda textual. */
  terminoBusqueda = '';

  /** Filtro por estado del candidato. */
  filtroEstado: 'todos' | 'Activo' | 'Inactivo' = 'todos';

  /** Modo de visualización: cuadrícula de tarjetas o tabla de datos. */
  vistaModo: 'tarjetas' | 'tabla' = 'tarjetas';

  /** Control del modal de creación/edición. */
  modalFormularioVisible = false;
  modoFormulario: 'crear' | 'editar' = 'crear';
  erroresValidacion: string[] = [];

  /** Modelo de datos del formulario reactivo. */
  formulario: CandidatoFormulario = this.inicializarFormulario();

  /** Control del modal de visualización de detalles. */
  modalDetalleVisible = false;
  candidatoDetalle: Candidato | null = null;

  /** Control del modal de confirmación de eliminación. */
  modalEliminarVisible = false;
  candidatoAEliminar: Candidato | null = null;

  /** Notificación de retroalimentación (toast). */
  notificacion: { mensaje: string; tipo: 'exito' | 'info' | 'peligro' } | null = null;
  private notificacionTimeout: any = null;

  /** Colores predefinidos con contrastes validados para partidos políticos. */
  readonly paletaColores: string[] = [
    '#1976d2', // Azul Institucional
    '#2e7d32', // Verde Esperanza
    '#c62828', // Rojo Cívico
    '#e65100', // Naranja Renovador
    '#6a1b9a', // Púrpura Independiente
    '#00838f', // Turquesa Progreso
    '#455a64', // Gris Pizarra
    '#d81b60'  // Fucsia Solidario
  ];

  constructor(private candidatosService: CandidatosService) { }

  ngOnInit(): void {
    this.cargarCandidatos();
  }

  /** Carga todos los candidatos del servicio y recalcula los filtros. */
  cargarCandidatos(): void {
    this.candidatos = this.candidatosService.obtenerCandidatos();
    this.aplicarFiltros();
  }

  /** Total de candidatos registrados. */
  get totalCandidatos(): number {
    return this.candidatos.length;
  }

  /** Total de candidatos activos en el padrón. */
  get totalActivos(): number {
    return this.candidatos.filter(c => c.estado === 'Activo').length;
  }

  /** Total de partidos políticos únicos participantes. */
  get totalPartidos(): number {
    const partidosUnicos = new Set(this.candidatos.map(c => c.partido.trim().toLowerCase()));
    return partidosUnicos.size;
  }

  /** Aplica los filtros de búsqueda y estado sobre la lista actual. */
  aplicarFiltros(): void {
    const q = this.terminoBusqueda.toLowerCase().trim();

    this.candidatosFiltrados = this.candidatos.filter(candidato => {
      const coincideTexto = !q ||
        candidato.nombre.toLowerCase().includes(q) ||
        candidato.partido.toLowerCase().includes(q) ||
        (candidato.lista && candidato.lista.toLowerCase().includes(q)) ||
        (candidato.propuestaPrincipal && candidato.propuestaPrincipal.toLowerCase().includes(q));

      const coincideEstado = this.filtroEstado === 'todos' || candidato.estado === this.filtroEstado;

      return coincideTexto && coincideEstado;
    });
  }

  /** Cambia el filtro de estado y recalcula la vista. */
  seleccionarFiltroEstado(estado: 'todos' | 'Activo' | 'Inactivo'): void {
    this.filtroEstado = estado;
    this.aplicarFiltros();
  }

  /** Alterna entre vista de tarjetas y vista de tabla. */
  cambiarModoVista(modo: 'tarjetas' | 'tabla'): void {
    this.vistaModo = modo;
  }

  /** Limpia el campo de búsqueda de texto. */
  limpiarBusqueda(): void {
    this.terminoBusqueda = '';
    this.aplicarFiltros();
  }

  // -------------------------------------------------------------
  // CRUD: Crear y Editar
  // -------------------------------------------------------------

  /** Inicializa el formulario con valores por omisión. */
  private inicializarFormulario(): CandidatoFormulario {
    return {
      nombre: '',
      partido: '',
      lista: '',
      cargo: 'Presidencia de la República',
      color: '#1976d2',
      iniciales: '',
      propuestaPrincipal: '',
      estado: 'Activo'
    };
  }

  /** Abre el modal para registrar un nuevo candidato. */
  abrirModalCrear(): void {
    this.modoFormulario = 'crear';
    this.formulario = this.inicializarFormulario();
    this.erroresValidacion = [];
    this.modalFormularioVisible = true;
  }

  /** Abre el modal para editar un candidato existente. */
  abrirModalEditar(candidato: Candidato): void {
    this.modoFormulario = 'editar';
    this.formulario = {
      id: candidato.id,
      nombre: candidato.nombre,
      partido: candidato.partido,
      lista: candidato.lista || '',
      cargo: candidato.cargo || 'Presidencia de la República',
      color: candidato.color || '#1976d2',
      iniciales: candidato.iniciales,
      propuestaPrincipal: candidato.propuestaPrincipal || '',
      estado: candidato.estado || 'Activo'
    };
    this.erroresValidacion = [];
    this.modalFormularioVisible = true;
  }

  /** Cierra el modal de formulario. */
  cerrarModalFormulario(): void {
    this.modalFormularioVisible = false;
    this.erroresValidacion = [];
  }

  /** Actualiza las iniciales sugeridas al escribir el nombre. */
  alCambiarNombre(): void {
    if (this.formulario.nombre) {
      this.formulario.iniciales = this.candidatosService.generarIniciales(this.formulario.nombre);
    }
  }

  /** Selecciona un color de la paleta predefinida. */
  seleccionarColor(color: string): void {
    this.formulario.color = color;
  }

  /** Valida y guarda el candidato (creación o actualización). */
  guardarCandidato(): void {
    this.erroresValidacion = [];

    const nombreLimpio = this.formulario.nombre.trim();
    const partidoLimpio = this.formulario.partido.trim();

    if (!nombreLimpio) {
      this.erroresValidacion.push('El nombre completo del candidato es obligatorio.');
    } else if (nombreLimpio.length < 3) {
      this.erroresValidacion.push('El nombre debe tener al menos 3 caracteres.');
    }

    if (!partidoLimpio) {
      this.erroresValidacion.push('El movimiento o partido político es obligatorio.');
    }

    if (this.erroresValidacion.length > 0) {
      return;
    }

    const inicialesFinales = this.formulario.iniciales.trim() ||
      this.candidatosService.generarIniciales(nombreLimpio);

    if (this.modoFormulario === 'crear') {
      const nuevo = this.candidatosService.crearCandidato({
        nombre: nombreLimpio,
        partido: partidoLimpio,
        lista: this.formulario.lista.trim() || 'Sin lista',
        cargo: this.formulario.cargo.trim() || 'Presidencia de la República',
        color: this.formulario.color,
        iniciales: inicialesFinales,
        propuestaPrincipal: this.formulario.propuestaPrincipal.trim() || 'Sin propuesta registrada.',
        estado: this.formulario.estado
      });
      this.mostrarNotificacion(`Candidato "${nuevo.nombre}" registrado exitosamente.`, 'exito');
    } else if (this.modoFormulario === 'editar' && this.formulario.id) {
      const actualizado = this.candidatosService.actualizarCandidato(this.formulario.id, {
        nombre: nombreLimpio,
        partido: partidoLimpio,
        lista: this.formulario.lista.trim(),
        cargo: this.formulario.cargo.trim(),
        color: this.formulario.color,
        iniciales: inicialesFinales,
        propuestaPrincipal: this.formulario.propuestaPrincipal.trim(),
        estado: this.formulario.estado
      });
      if (actualizado) {
        this.mostrarNotificacion(`Candidato "${actualizado.nombre}" actualizado correctamente.`, 'exito');
      }
    }

    this.cerrarModalFormulario();
    this.cargarCandidatos();
  }

  // -------------------------------------------------------------
  // CRUD: Leer / Detalle
  // -------------------------------------------------------------

  /** Abre el modal para ver el perfil completo del candidato. */
  abrirModalDetalle(candidato: Candidato): void {
    this.candidatoDetalle = { ...candidato };
    this.modalDetalleVisible = true;
  }

  /** Cierra el modal de detalle. */
  cerrarModalDetalle(): void {
    this.modalDetalleVisible = false;
    this.candidatoDetalle = null;
  }

  // -------------------------------------------------------------
  // CRUD: Eliminar
  // -------------------------------------------------------------

  /** Abre el diálogo de confirmación para eliminar un candidato. */
  abrirModalEliminar(candidato: Candidato): void {
    this.candidatoAEliminar = candidato;
    this.modalEliminarVisible = true;
  }

  /** Cierra el diálogo de eliminación sin cambios. */
  cerrarModalEliminar(): void {
    this.modalEliminarVisible = false;
    this.candidatoAEliminar = null;
  }

  /** Ejecuta la eliminación confirmada del candidato. */
  confirmarEliminacion(): void {
    if (!this.candidatoAEliminar) return;

    const nombre = this.candidatoAEliminar.nombre;
    const exito = this.candidatosService.eliminarCandidato(this.candidatoAEliminar.id);

    if (exito) {
      this.mostrarNotificacion(`Candidato "${nombre}" ha sido eliminado.`, 'peligro');
      this.cargarCandidatos();
    }

    this.cerrarModalEliminar();
  }

  /** Restablece la lista a los datos predeterminados. */
  restablecerDatos(): void {
    this.candidatosService.restablecer();
    this.terminoBusqueda = '';
    this.filtroEstado = 'todos';
    this.cargarCandidatos();
    this.mostrarNotificacion('Padrón de candidatos restablecido con éxito.', 'info');
  }

  // -------------------------------------------------------------
  // Notificaciones y Teclado
  // -------------------------------------------------------------

  /** Muestra un mensaje temporal en la interfaz. */
  mostrarNotificacion(mensaje: string, tipo: 'exito' | 'info' | 'peligro' = 'exito'): void {
    if (this.notificacionTimeout) {
      clearTimeout(this.notificacionTimeout);
    }
    this.notificacion = { mensaje, tipo };
    this.notificacionTimeout = setTimeout(() => {
      this.notificacion = null;
    }, 4000);
  }

  /** Cierra la notificación activa inmediatamente. */
  cerrarNotificacion(): void {
    this.notificacion = null;
    if (this.notificacionTimeout) {
      clearTimeout(this.notificacionTimeout);
    }
  }

  /** Cierra cualquier modal abierto con la tecla Escape. */
  @HostListener('document:keydown.escape')
  alPresionarEscape(): void {
    if (this.modalFormularioVisible) this.cerrarModalFormulario();
    if (this.modalDetalleVisible) this.cerrarModalDetalle();
    if (this.modalEliminarVisible) this.cerrarModalEliminar();
  }
}
