import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { PageCandidatosComponent } from './page-candidatos.component';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';
import { CandidatosService } from '../../../services/candidatos.service';

describe('PageCandidatosComponent', () => {
  let component: PageCandidatosComponent;
  let fixture: ComponentFixture<PageCandidatosComponent>;
  let service: CandidatosService;

  /** Acceso corto al DOM renderizado del componente. */
  const dom = (): HTMLElement => fixture.nativeElement as HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ CommonModule, FormsModule, RouterTestingModule ],
      declarations: [ PageCandidatosComponent, SidebarComponent ],
      providers: [ CandidatosService ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    service = TestBed.inject(CandidatosService);
    service.restablecer();
    fixture = TestBed.createComponent(PageCandidatosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render its section title', () => {
    expect(dom().querySelector('#placeholder-titulo')?.textContent).toContain('Candidatos');
  });

  it('should offer a link back to the voter view', () => {
    const volver = dom().querySelector('.placeholder-volver');
    expect(volver).not.toBeNull();
    expect(volver?.getAttribute('ng-reflect-router-link')).toContain('/datos-votante');
  });

  it('should embed the navigation sidebar', () => {
    expect(dom().querySelector('se-sidebar')).not.toBeNull();
  });

  it('should display the initial 5 official candidates in the cards grid', () => {
    const cards = dom().querySelectorAll('.candidato-card');
    expect(cards.length).toBe(5);

    const nombres = Array.from(cards).map(c => c.querySelector('.candidato-nombre')?.textContent?.trim());
    expect(nombres).toContain('Ana Gómez Rivas');
    expect(nombres).toContain('Carlos Andrade Vera');
    expect(nombres).toContain('Lucía Herrera Paz');
    expect(nombres).toContain('Diego Salazar Mora');
    expect(nombres).toContain('Valeria Ortiz Cabrera');
  });

  it('should compute and render metrics correctly', () => {
    expect(dom().querySelector('#total-candidatos')?.textContent?.trim()).toBe('5');
    expect(dom().querySelector('#total-activos')?.textContent?.trim()).toBe('5');
    expect(dom().querySelector('#total-partidos')?.textContent?.trim()).toBe('5');
  });

  it('should filter candidates dynamically by search term', () => {
    component.terminoBusqueda = 'gómez';
    component.aplicarFiltros();
    fixture.detectChanges();

    const cards = dom().querySelectorAll('.candidato-card');
    expect(cards.length).toBe(1);
    expect(cards[0].querySelector('.candidato-nombre')?.textContent?.trim()).toBe('Ana Gómez Rivas');
  });

  it('should filter candidates by status', () => {
    // Cambiar estado de uno a Inactivo
    component.candidatos[0].estado = 'Inactivo';
    component.seleccionarFiltroEstado('Inactivo');
    fixture.detectChanges();

    expect(component.candidatosFiltrados.length).toBe(1);
    expect(component.candidatosFiltrados[0].nombre).toBe('Ana Gómez Rivas');

    component.seleccionarFiltroEstado('Activo');
    fixture.detectChanges();
    expect(component.candidatosFiltrados.length).toBe(4);
  });

  it('should toggle view mode between tarjetas and tabla', () => {
    expect(dom().querySelector('.candidatos-grid')).not.toBeNull();
    expect(dom().querySelector('.candidatos-tabla')).toBeNull();

    component.cambiarModoVista('tabla');
    fixture.detectChanges();

    expect(dom().querySelector('.candidatos-grid')).toBeNull();
    expect(dom().querySelector('.candidatos-tabla')).not.toBeNull();
    expect(dom().querySelectorAll('.candidatos-tabla tbody tr').length).toBe(5);
  });

  it('should open create modal and register a new candidate', () => {
    component.abrirModalCrear();
    fixture.detectChanges();

    expect(component.modalFormularioVisible).toBeTrue();
    expect(component.modoFormulario).toBe('crear');
    expect(dom().querySelector('.modal-dialog--formulario')).not.toBeNull();

    component.formulario.nombre = 'Guillermo Lasso Mendoza';
    component.formulario.partido = 'Movimiento Creando Oportunidades';
    component.formulario.lista = 'Lista 21';
    component.alCambiarNombre();
    expect(component.formulario.iniciales).toBe('GL');

    component.guardarCandidato();
    fixture.detectChanges();

    expect(component.modalFormularioVisible).toBeFalse();
    expect(component.totalCandidatos).toBe(6);
    expect(component.candidatos.some(c => c.nombre === 'Guillermo Lasso Mendoza')).toBeTrue();
  });

  it('should validate required fields and prevent invalid candidate submission', () => {
    component.abrirModalCrear();
    component.formulario.nombre = ' ';
    component.formulario.partido = '';
    component.guardarCandidato();
    fixture.detectChanges();

    expect(component.erroresValidacion.length).toBeGreaterThan(0);
    expect(component.modalFormularioVisible).toBeTrue();
    expect(component.totalCandidatos).toBe(5);
  });

  it('should open edit modal and modify candidate data', () => {
    const primero = component.candidatos[0];
    component.abrirModalEditar(primero);
    fixture.detectChanges();

    expect(component.modalFormularioVisible).toBeTrue();
    expect(component.modoFormulario).toBe('editar');
    expect(component.formulario.nombre).toBe(primero.nombre);

    component.formulario.nombre = 'Ana Gómez Rivas Modificada';
    component.guardarCandidato();
    fixture.detectChanges();

    expect(component.modalFormularioVisible).toBeFalse();
    const actualizado = component.candidatos.find(c => c.id === primero.id);
    expect(actualizado?.nombre).toBe('Ana Gómez Rivas Modificada');
  });

  it('should open detail modal and show candidate dossier', () => {
    const segundo = component.candidatos[1];
    component.abrirModalDetalle(segundo);
    fixture.detectChanges();

    expect(component.modalDetalleVisible).toBeTrue();
    expect(dom().querySelector('.modal-dialog--detalle')).not.toBeNull();
    expect(dom().querySelector('.detalle-nombre')?.textContent).toContain(segundo.nombre);

    component.cerrarModalDetalle();
    fixture.detectChanges();
    expect(component.modalDetalleVisible).toBeFalse();
  });

  it('should open delete modal and remove candidate on confirmation', () => {
    const candidato = component.candidatos[2];
    component.abrirModalEliminar(candidato);
    fixture.detectChanges();

    expect(component.modalEliminarVisible).toBeTrue();
    expect(dom().querySelector('.modal-dialog--eliminar')).not.toBeNull();

    component.confirmarEliminacion();
    fixture.detectChanges();

    expect(component.modalEliminarVisible).toBeFalse();
    expect(component.totalCandidatos).toBe(4);
    expect(component.candidatos.find(c => c.id === candidato.id)).toBeUndefined();
  });

  it('should show empty state when search finds no matches', () => {
    component.terminoBusqueda = 'inexistente99999';
    component.aplicarFiltros();
    fixture.detectChanges();

    expect(component.candidatosFiltrados.length).toBe(0);
    expect(dom().querySelector('.candidatos-vacio')).not.toBeNull();
    expect(dom().querySelector('.vacio-titulo')?.textContent).toContain('No se encontraron candidatos');
  });

  it('should reset candidates back to initial 5 when requested', () => {
    component.abrirModalEliminar(component.candidatos[0]);
    component.confirmarEliminacion();
    expect(component.totalCandidatos).toBe(4);

    component.restablecerDatos();
    fixture.detectChanges();

    expect(component.totalCandidatos).toBe(5);
  });

  it('should close open modals when Escape key is pressed', () => {
    component.abrirModalCrear();
    expect(component.modalFormularioVisible).toBeTrue();

    component.alPresionarEscape();
    expect(component.modalFormularioVisible).toBeFalse();
  });
});
