import { Component } from '@angular/core';

/**
 * Página placeholder para la sección "Resultados Electorales" del menú lateral.
 * De momento sólo muestra un aviso de "en construcción" y un enlace de
 * regreso; su contenido real se implementará más adelante.
 */
@Component({
  selector: 'se-page-resultados',
  templateUrl: './page-resultados.component.html',
  styleUrls: ['../placeholder.shared.css']
})
export class PageResultadosComponent {

  /** Título visible de la sección. */
  readonly titulo = 'Resultados Electorales';

}
