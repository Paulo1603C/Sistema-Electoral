/**
 * Modelo del escrutinio de una dignidad. Los porcentajes viajan en escala 0–100
 * con toda su precisión: el redondeo es responsabilidad de la vista.
 */

/** Votación obtenida por un candidato, ya ubicada en el escrutinio. */
export interface ResultadoCandidato {
  id: number;
  nombre: string;
  partido: string;
  iniciales: string;
  /** Votos válidos obtenidos por el candidato. */
  votos: number;
  /** Porcentaje sobre el total de votos válidos (0–100). */
  porcentaje: number;
  /** Puesto en el escrutinio: 1 es el más votado. */
  posicion: number;
}

/** Clave de cada tramo en que se descompone el total de sufragios emitidos. */
export type ClaveSegmento = 'validos' | 'nulos' | 'blancos';

/** Tramo de la composición del total de sufragios (válidos, nulos, blancos). */
export interface SegmentoVotos {
  clave: ClaveSegmento;
  etiqueta: string;
  votos: number;
  /** Porcentaje sobre el total de sufragantes (0–100). */
  porcentaje: number;
}

/** Escrutinio completo de una dignidad, con sus totales ya derivados. */
export interface ResultadoEleccion {
  /** Dignidad escrutada, p. ej. "Presidente y Vicepresidente". */
  dignidad: string;
  /** Ámbito geográfico o institucional del escrutinio. */
  ambito: string;
  /** Fecha y hora del corte informativo. */
  fechaCorte: string;
  /** `true` cuando el 100 % de las actas fue procesado. */
  escrutinioFinalizado: boolean;
  actasProcesadas: number;
  actasTotales: number;
  /** Avance del procesamiento de actas (0–100). */
  avanceActas: number;
  electoresHabilitados: number;
  votosValidos: number;
  votosNulos: number;
  votosBlancos: number;
  /** Válidos + nulos + blancos. */
  totalSufragantes: number;
  /** Participación sobre electores habilitados (0–100). */
  participacion: number;
  /** Ausentismo sobre electores habilitados (0–100). */
  ausentismo: number;
  /** Candidatos ordenados de mayor a menor votación. */
  candidatos: ResultadoCandidato[];
  /** Composición del total de sufragios emitidos. */
  composicion: SegmentoVotos[];
  /** Candidato más votado. */
  ganador: ResultadoCandidato;
  /** Ventaja del ganador sobre el segundo, en votos. */
  ventajaVotos: number;
  /** Ventaja del ganador sobre el segundo, en puntos porcentuales. */
  ventajaPuntos: number;
  /**
   * Tope del eje del gráfico de barras, en puntos porcentuales: el múltiplo de
   * 10 inmediatamente superior al porcentaje del ganador. Evita distorsionar la
   * comparación escalando las barras al líder.
   */
  escalaMaxima: number;
}
