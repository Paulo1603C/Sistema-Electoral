import { Component, EventEmitter, HostListener, Output } from '@angular/core';

/** Una entrada del menú lateral con su etiqueta y el trazo del icono SVG. */
export interface OpcionSidebar {
  /** Clave estable de la opción, útil para pruebas y para emitir la selección. */
  clave: string;
  /** Texto visible de la opción en el menú. */
  etiqueta: string;
  /** Atributo `d` del `<path>` del icono (iconos estilo Material, 24x24). */
  icono: string;
}

/**
 * Menú lateral (sidebar) desplegable mediante un botón hamburguesa.
 *
 * Es autónomo: gestiona su propio estado de apertura, se cierra al pulsar el
 * fondo oscuro, al elegir una opción o con la tecla Escape. Las opciones son de
 * ejemplo, con temática electoral, y al seleccionarse emiten `opcionSeleccionada`.
 */
@Component({
  selector: 'se-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

  /** Estado del panel lateral: `true` cuando está desplegado. */
  abierto = false;

  /** Clave de la opción activa, para resaltarla en el menú. */
  opcionActiva: string | null = null;

  /** Notifica al contenedor qué opción del menú eligió el usuario. */
  @Output() opcionSeleccionada = new EventEmitter<OpcionSidebar>();

  /** Opciones de prueba con temática electoral. */
  opciones: OpcionSidebar[] = [
    { clave: 'ver-votos', etiqueta: 'Ver Votos', icono: 'M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z' },
    { clave: 'resultados', etiqueta: 'Resultados Electorales', icono: 'M4 9h4v11H4zm6-5h4v16h-4zm6 8h4v8h-4z' },
    { clave: 'candidatos', etiqueta: 'Candidatos', icono: 'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z' },
    { clave: 'recintos', etiqueta: 'Recintos Electorales', icono: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z' },
    { clave: 'padron', etiqueta: 'Padrón Electoral', icono: 'M3 5h18v2H3zm0 6h18v2H3zm0 6h18v2H3z' },
    { clave: 'administrar-cuenta', etiqueta: 'Administrar Cuenta', icono: 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z' }
  ];

  /** Abre o cierra el panel al pulsar el botón hamburguesa. */
  alternar(): void {
    this.abierto = !this.abierto;
  }

  /** Cierra el panel lateral. */
  cerrar(): void {
    this.abierto = false;
  }

  /** Marca la opción elegida, la emite al contenedor y cierra el panel. */
  seleccionar(opcion: OpcionSidebar): void {
    this.opcionActiva = opcion.clave;
    this.opcionSeleccionada.emit(opcion);
    this.cerrar();
  }

  /** Cierra el panel con la tecla Escape, como en cualquier menú lateral. */
  @HostListener('document:keydown.escape')
  alPresionarEscape(): void {
    this.cerrar();
  }

}
