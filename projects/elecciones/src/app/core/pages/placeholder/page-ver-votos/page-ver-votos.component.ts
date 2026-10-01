import { Component } from '@angular/core';

/**
 * Página placeholder para la sección "Ver Votos" del menú lateral.
 * De momento sólo muestra un aviso de "en construcción" y un enlace de
 * regreso; su contenido real se implementará más adelante.
 */
@Component({
  selector: 'se-page-ver-votos',
  templateUrl: './page-ver-votos.component.html',
  styleUrls: ['../placeholder.shared.css']
})
export class PageVerVotosComponent {

  /** Título visible de la sección. */
  readonly titulo = 'Ver Votos';

}
