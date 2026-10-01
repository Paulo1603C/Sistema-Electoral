import { TestBed } from '@angular/core/testing';
import { CandidatosService } from './candidatos.service';
import { Candidato } from '../models/candidato.model';

describe('CandidatosService', () => {
  let service: CandidatosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CandidatosService);
    service.restablecer();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should provide the 5 initial official candidates', () => {
    const lista = service.obtenerCandidatos();
    expect(lista.length).toBe(5);
    expect(lista.map(c => c.nombre)).toContain('Ana Gómez Rivas');
    expect(lista.map(c => c.nombre)).toContain('Carlos Andrade Vera');
  });

  it('should get a candidate by its id', () => {
    const candidato = service.obtenerCandidatoPorId(1);
    expect(candidato).toBeDefined();
    expect(candidato?.nombre).toBe('Ana Gómez Rivas');
    expect(candidato?.partido).toBe('Movimiento Futuro Verde');

    const inexistente = service.obtenerCandidatoPorId(999);
    expect(inexistente).toBeUndefined();
  });

  it('should generate initials accurately from names', () => {
    expect(service.generarIniciales('Ana Gómez')).toBe('AG');
    expect(service.generarIniciales('Carlos Andrade Vera')).toBe('CA');
    expect(service.generarIniciales('Lucía')).toBe('LU');
    expect(service.generarIniciales('')).toBe('??');
  });

  it('should create a new candidate and assign an incremental id', () => {
    const nuevo: Omit<Candidato, 'id'> = {
      nombre: 'Elena Morales Ruiz',
      partido: 'Acción Democrática Popular',
      iniciales: '',
      color: '#00897b',
      lista: 'Lista 40',
      cargo: 'Presidencia de la República',
      propuestaPrincipal: 'Impulso a la educación digital y ciencia aplicada.',
      estado: 'Activo'
    };

    const creado = service.crearCandidato(nuevo);
    expect(creado.id).toBe(6);
    expect(creado.iniciales).toBe('EM');
    expect(creado.nombre).toBe('Elena Morales Ruiz');

    const todos = service.obtenerCandidatos();
    expect(todos.length).toBe(6);
    expect(todos.find(c => c.id === 6)).toBeDefined();
  });

  it('should update an existing candidate', () => {
    const resultado = service.actualizarCandidato(2, {
      nombre: 'Carlos Andrade V.',
      partido: 'Alianza Progreso Actualizada'
    });

    expect(resultado).not.toBeNull();
    expect(resultado?.nombre).toBe('Carlos Andrade V.');
    expect(resultado?.partido).toBe('Alianza Progreso Actualizada');
    expect(resultado?.id).toBe(2);

    const obtenido = service.obtenerCandidatoPorId(2);
    expect(obtenido?.nombre).toBe('Carlos Andrade V.');
  });

  it('should return null when updating a non-existent candidate', () => {
    const res = service.actualizarCandidato(9999, { nombre: 'Fantasma' });
    expect(res).toBeNull();
  });

  it('should delete a candidate by id', () => {
    const eliminado = service.eliminarCandidato(3);
    expect(eliminado).toBeTrue();

    const lista = service.obtenerCandidatos();
    expect(lista.length).toBe(4);
    expect(lista.find(c => c.id === 3)).toBeUndefined();
  });

  it('should return false when deleting a non-existent candidate', () => {
    const res = service.eliminarCandidato(8888);
    expect(res).toBeFalse();
  });

  it('should reset candidates back to initial seed data', () => {
    service.eliminarCandidato(1);
    service.eliminarCandidato(2);
    expect(service.obtenerCandidatos().length).toBe(3);

    service.restablecer();
    expect(service.obtenerCandidatos().length).toBe(5);
  });

  it('should search candidates by name, party, or list', () => {
    const porNombre = service.buscar('ana');
    expect(porNombre.length).toBe(1);
    expect(porNombre[0].nombre).toBe('Ana Gómez Rivas');

    const porPartido = service.buscar('ciudadana');
    expect(porPartido.length).toBe(1);
    expect(porPartido[0].partido).toBe('Unidad Ciudadana');

    const porLista = service.buscar('lista 8');
    expect(porLista.length).toBe(1);
    expect(porLista[0].nombre).toBe('Diego Salazar Mora');

    const sinResultados = service.buscar('inexistente 123');
    expect(sinResultados.length).toBe(0);
  });
});
