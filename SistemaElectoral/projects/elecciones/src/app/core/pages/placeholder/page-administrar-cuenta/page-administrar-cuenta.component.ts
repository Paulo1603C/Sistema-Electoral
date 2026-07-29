import { Component } from '@angular/core';

/**
 * Página placeholder para la sección "Administrar Cuenta" del menú lateral.
 * De momento sólo muestra un aviso de "en construcción" y un enlace de
 * regreso; su contenido real se implementará más adelante.
 */
@Component({
  selector: 'se-page-administrar-cuenta',
  templateUrl: './page-administrar-cuenta.component.html',
  styleUrls: ['../placeholder.shared.css']
})
export class PageAdministrarCuentaComponent {

  /** Título visible de la sección. */
  readonly titulo = 'Administrar Cuenta';

}
