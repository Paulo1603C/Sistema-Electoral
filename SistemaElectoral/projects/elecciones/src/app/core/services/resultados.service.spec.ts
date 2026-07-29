import { TestBed } from '@angular/core/testing';

import { ResultadosService } from './resultados.service';
import { ResultadoEleccion } from '../models/resultado-electoral.model';

describe('ResultadosService', () => {
  let service: ResultadosService;
  let resultado: ResultadoEleccion;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResultadosService);
    resultado = service.obtenerResultadoPresidencial();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should simulate the presidential race between five candidates', () => {
    expect(resultado.dignidad).toBe('Presidente y Vicepresidente');
    expect(resultado.candidatos.length).toBe(5);
    resultado.candidatos.forEach(candidato => {
      expect(candidato.nombre.length).toBeGreaterThan(0);
      expect(candidato.partido.length).toBeGreaterThan(0);
      expect(candidato.votos).toBeGreaterThan(0);
    });
  });

  it('should order candidates from most to least voted and number their position', () => {
    const votos = resultado.candidatos.map(candidato => candidato.votos);
    const descendente = [...votos].sort((a, b) => b - a);

    expect(votos).toEqual(descendente);
    expect(resultado.candidatos.map(candidato => candidato.posicion)).toEqual([1, 2, 3, 4, 5]);
  });

  it('should total valid votes from the candidate tally', () => {
    const suma = resultado.candidatos.reduce((total, candidato) => total + candidato.votos, 0);

    expect(resultado.votosValidos).toBe(suma);
  });

  it('should derive candidate percentages over valid votes, adding up to 100', () => {
    const suma = resultado.candidatos.reduce((total, candidato) => total + candidato.porcentaje, 0);

    expect(suma).toBeCloseTo(100, 6);
    expect(resultado.candidatos[0].porcentaje)
      .toBeCloseTo((resultado.candidatos[0].votos * 100) / resultado.votosValidos, 6);
  });

  it('should count every ballot cast as valid, null or blank', () => {
    expect(resultado.totalSufragantes)
      .toBe(resultado.votosValidos + resultado.votosNulos + resultado.votosBlancos);

    const suma = resultado.composicion.reduce((total, segmento) => total + segmento.votos, 0);
    expect(suma).toBe(resultado.totalSufragantes);
    expect(resultado.composicion.map(segmento => segmento.clave))
      .toEqual(['validos', 'nulos', 'blancos']);
  });

  it('should derive turnout and abstention over the electoral roll', () => {
    expect(resultado.participacion)
      .toBeCloseTo((resultado.totalSufragantes * 100) / resultado.electoresHabilitados, 6);
    expect(resultado.participacion + resultado.ausentismo).toBeCloseTo(100, 6);
  });

  it('should expose the winner and its lead over the runner-up', () => {
    const [ganador, segundo] = resultado.candidatos;

    expect(resultado.ganador).toEqual(ganador);
    expect(resultado.ventajaVotos).toBe(ganador.votos - segundo.votos);
    expect(resultado.ventajaPuntos).toBeCloseTo(ganador.porcentaje - segundo.porcentaje, 6);
  });

  it('should report the tally progress without inventing a finished count', () => {
    expect(resultado.actasProcesadas).toBeLessThanOrEqual(resultado.actasTotales);
    expect(resultado.avanceActas)
      .toBeCloseTo((resultado.actasProcesadas * 100) / resultado.actasTotales, 6);
    expect(resultado.escrutinioFinalizado)
      .toBe(resultado.actasProcesadas >= resultado.actasTotales);
  });

  it('should scale the chart axis to the next multiple of ten above the winner', () => {
    expect(resultado.escalaMaxima % 10).toBe(0);
    expect(resultado.escalaMaxima).toBeGreaterThanOrEqual(resultado.ganador.porcentaje);
    expect(resultado.escalaMaxima - 10).toBeLessThan(resultado.ganador.porcentaje);
  });

  it('should hand out an independent snapshot on every call', () => {
    const otro = service.obtenerResultadoPresidencial();
    otro.candidatos[0].votos = 0;

    expect(service.obtenerResultadoPresidencial().candidatos[0].votos).toBeGreaterThan(0);
  });
});
