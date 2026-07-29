import { Injectable } from '@angular/core';
import {
  ResultadoCandidato,
  ResultadoEleccion,
  SegmentoVotos
} from '../models/resultado-electoral.model';

/** Votación cruda de un candidato, tal como llegaría del conteo de actas. */
interface VotacionCandidato {
  id: number;
  nombre: string;
  partido: string;
  iniciales: string;
  votos: number;
}

/** Cifras crudas del escrutinio de una dignidad, sin porcentajes derivados. */
interface EscrutinioCrudo {
  dignidad: string;
  ambito: string;
  fechaCorte: string;
  electoresHabilitados: number;
  votosNulos: number;
  votosBlancos: number;
  actasProcesadas: number;
  actasTotales: number;
  votaciones: VotacionCandidato[];
}

/**
 * Provee el escrutinio que alimenta la vista de resultados. Todavía sin backend:
 * las cifras son una simulación fija y todos los porcentajes, totales y la
 * ventaja del ganador se derivan aquí a partir de los votos crudos, de modo que
 * la vista nunca calcula ni almacena cifras redundantes.
 */
@Injectable({
  providedIn: 'root'
})
export class ResultadosService {

  /**
   * Simulación del escrutinio presidencial entre cinco candidatos. Sólo se
   * declaran cifras crudas (votos, nulos, blancos, actas y padrón); lo demás se
   * calcula, así los datos no pueden quedar incoherentes entre sí.
   */
  private readonly escrutinioPresidencial: EscrutinioCrudo = {
    dignidad: 'Presidente y Vicepresidente',
    ambito: 'Unidad Educativa Nacional Manta · Circunscripción única',
    fechaCorte: '29 de julio de 2026, 20:45',
    electoresHabilitados: 1486320,
    votosNulos: 48912,
    votosBlancos: 31204,
    actasProcesadas: 4182,
    actasTotales: 4215,
    votaciones: [
      { id: 1, nombre: 'Ana Gómez Rivas', partido: 'Movimiento Futuro Verde', iniciales: 'AG', votos: 328940 },
      { id: 2, nombre: 'Carlos Andrade Vera', partido: 'Alianza Progreso Nacional', iniciales: 'CA', votos: 412586 },
      { id: 3, nombre: 'Lucía Herrera Paz', partido: 'Unidad Ciudadana', iniciales: 'LH', votos: 214375 },
      { id: 4, nombre: 'Diego Salazar Mora', partido: 'Frente Renovador', iniciales: 'DS', votos: 132208 },
      { id: 5, nombre: 'Valeria Ortiz Cabrera', partido: 'Partido Cívico Independiente', iniciales: 'VO', votos: 76431 }
    ]
  };

  /** Devuelve el escrutinio presidencial con todas sus cifras derivadas. */
  obtenerResultadoPresidencial(): ResultadoEleccion {
    return this.derivar(this.escrutinioPresidencial);
  }

  /** Convierte las cifras crudas de un escrutinio en el modelo de la vista. */
  private derivar(crudo: EscrutinioCrudo): ResultadoEleccion {
    const votosValidos = crudo.votaciones.reduce((total, votacion) => total + votacion.votos, 0);
    const totalSufragantes = votosValidos + crudo.votosNulos + crudo.votosBlancos;

    const candidatos: ResultadoCandidato[] = [...crudo.votaciones]
      .sort((a, b) => b.votos - a.votos)
      .map((votacion, indice) => ({
        id: votacion.id,
        nombre: votacion.nombre,
        partido: votacion.partido,
        iniciales: votacion.iniciales,
        votos: votacion.votos,
        porcentaje: this.porcentaje(votacion.votos, votosValidos),
        posicion: indice + 1
      }));

    const ganador = candidatos[0];
    const segundo = candidatos[1];

    const composicion: SegmentoVotos[] = [
      { clave: 'validos', etiqueta: 'Votos válidos', votos: votosValidos, porcentaje: this.porcentaje(votosValidos, totalSufragantes) },
      { clave: 'nulos', etiqueta: 'Votos nulos', votos: crudo.votosNulos, porcentaje: this.porcentaje(crudo.votosNulos, totalSufragantes) },
      { clave: 'blancos', etiqueta: 'Votos blancos', votos: crudo.votosBlancos, porcentaje: this.porcentaje(crudo.votosBlancos, totalSufragantes) }
    ];

    const participacion = this.porcentaje(totalSufragantes, crudo.electoresHabilitados);

    return {
      dignidad: crudo.dignidad,
      ambito: crudo.ambito,
      fechaCorte: crudo.fechaCorte,
      escrutinioFinalizado: crudo.actasProcesadas >= crudo.actasTotales,
      actasProcesadas: crudo.actasProcesadas,
      actasTotales: crudo.actasTotales,
      avanceActas: this.porcentaje(crudo.actasProcesadas, crudo.actasTotales),
      electoresHabilitados: crudo.electoresHabilitados,
      votosValidos,
      votosNulos: crudo.votosNulos,
      votosBlancos: crudo.votosBlancos,
      totalSufragantes,
      participacion,
      ausentismo: 100 - participacion,
      candidatos,
      composicion,
      ganador,
      ventajaVotos: ganador.votos - (segundo ? segundo.votos : 0),
      ventajaPuntos: ganador.porcentaje - (segundo ? segundo.porcentaje : 0),
      escalaMaxima: this.escalaMaxima(ganador.porcentaje)
    };
  }

  /** Porcentaje de `parte` sobre `total`, en escala 0–100 y a prueba de 0. */
  private porcentaje(parte: number, total: number): number {
    return total > 0 ? (parte * 100) / total : 0;
  }

  /** Múltiplo de 10 inmediatamente superior al porcentaje del líder. */
  private escalaMaxima(porcentajeGanador: number): number {
    const tope = Math.ceil(porcentajeGanador / 10) * 10;
    return Math.min(100, Math.max(10, tope));
  }

}
