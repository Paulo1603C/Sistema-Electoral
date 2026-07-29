import { Component, OnInit } from '@angular/core';
import { ResultadoCandidato, ResultadoEleccion } from '../../models/resultado-electoral.model';
import { ResultadosService } from '../../services/resultados.service';

/**
 * Vista de resultados electorales de una dignidad.
 *
 * Presenta el escrutinio en cuatro bloques: cabecera con el avance de actas,
 * tarjeta del candidato ganador, fila de indicadores del padrón y el gráfico de
 * barras de votos por candidato con su vista de tabla equivalente. Las cifras
 * provienen de `ResultadosService`, que hoy entrega una simulación fija.
 *
 * Sobre el gráfico: las barras comparten un único azul porque su longitud ya
 * codifica la magnitud —repetirla en el matiz gastaría el canal de identidad—,
 * el eje llega a un múltiplo de 10 en lugar de escalarse al líder para no
 * distorsionar la comparación, y cada valor va rotulado junto a su barra, de modo
 * que el tooltip sólo acompaña y nunca es la única forma de leer un dato.
 */
@Component({
  selector: 'se-page-resultados',
  templateUrl: './page-resultados.component.html',
  styleUrls: ['./page-resultados.component.css']
})
export class PageResultadosComponent implements OnInit {

  /** Título visible de la sección. */
  readonly titulo = 'Resultados Electorales';

  /** Escrutinio mostrado en la vista. */
  resultado!: ResultadoEleccion;

  /** `true` cuando el usuario cambia el gráfico por su tabla equivalente. */
  vistaTabla = false;

  /** Candidato bajo el cursor o con el foco, para mostrar su tooltip. */
  candidatoResaltado: number | null = null;

  constructor(private resultadosService: ResultadosService) { }

  ngOnInit(): void {
    this.resultado = this.resultadosService.obtenerResultadoPresidencial();
  }

  /** Marcas del eje horizontal del gráfico, en puntos porcentuales. */
  get ejeTicks(): number[] {
    const ticks: number[] = [];
    for (let valor = 0; valor <= this.resultado.escalaMaxima; valor += 10) {
      ticks.push(valor);
    }
    return ticks;
  }

  /** Alterna entre el gráfico de barras y la tabla de resultados. */
  alternarVista(): void {
    this.vistaTabla = !this.vistaTabla;
    this.candidatoResaltado = null;
  }

  /** Resalta (o deja de resaltar) la fila de un candidato del gráfico. */
  resaltar(id: number | null): void {
    this.candidatoResaltado = id;
  }

  /** Ancho de la barra de un candidato como porcentaje del eje. */
  anchoBarra(candidato: ResultadoCandidato): number {
    return (candidato.porcentaje * 100) / this.resultado.escalaMaxima;
  }

  /** Posición de una marca del eje como porcentaje del ancho del gráfico. */
  posicionTick(tick: number): number {
    return (tick * 100) / this.resultado.escalaMaxima;
  }

  /** Entero con separador de miles en formato local: `1244656` → `1.244.656`. */
  formatearEntero(valor: number): string {
    return Math.round(valor)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  /** Porcentaje con coma decimal y símbolo: `35.4292` → `35,43 %`. */
  formatearPorcentaje(valor: number, decimales = 2): string {
    return `${valor.toFixed(decimales).replace('.', ',')} %`;
  }

  /** Descripción accesible y de tooltip de la votación de un candidato. */
  descripcionVotacion(candidato: ResultadoCandidato): string {
    return `${this.formatearEntero(candidato.votos)} votos · ${this.formatearPorcentaje(candidato.porcentaje)} de los válidos`;
  }

}
