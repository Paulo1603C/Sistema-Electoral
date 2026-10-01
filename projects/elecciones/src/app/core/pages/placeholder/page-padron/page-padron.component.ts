import { Component } from '@angular/core';

/**
 * Página placeholder para la sección "Padrón Electoral" del menú lateral.
 * De momento sólo muestra un aviso de "en construcción" y un enlace de
 * regreso; su contenido real se implementará más adelante.
 */
@Component({
  selector: 'se-page-padron',
  templateUrl: './page-padron.component.html',
  styleUrls: ['../placeholder.shared.css']
})
export class PagePadronComponent {

  /** Título visible de la sección. */
  readonly titulo = 'Padrón Electoral';

}
