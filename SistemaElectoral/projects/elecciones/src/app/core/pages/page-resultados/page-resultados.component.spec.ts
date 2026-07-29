import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { PageResultadosComponent } from './page-resultados.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { ResultadosService } from '../../services/resultados.service';

describe('PageResultadosComponent', () => {
  let component: PageResultadosComponent;
  let fixture: ComponentFixture<PageResultadosComponent>;

  /** Acceso corto al DOM renderizado del componente. */
  const dom = (): HTMLElement => fixture.nativeElement as HTMLElement;

  /** Texto normalizado de un selector, sin saltos de línea ni espacios dobles. */
  const texto = (selector: string): string =>
    (dom().querySelector(selector)?.textContent || '').replace(/\s+/g, ' ').trim();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ CommonModule, RouterTestingModule ],
      declarations: [ PageResultadosComponent, SidebarComponent ],
      providers: [ ResultadosService ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageResultadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render its section title and the tallied office', () => {
    expect(texto('#resultados-titulo')).toContain('Resultados Electorales');
    expect(texto('#resultados-dignidad')).toContain(component.resultado.dignidad);
  });

  it('should embed the navigation sidebar', () => {
    expect(dom().querySelector('se-sidebar')).not.toBeNull();
  });

  it('should offer a link back to the voter view', () => {
    const volver = dom().querySelector('.resultados-volver');

    expect(volver).not.toBeNull();
    expect(volver?.getAttribute('ng-reflect-router-link')).toContain('/datos-votante');
  });

  it('should draw one bar per candidate, ordered by votes', () => {
    const filas = dom().querySelectorAll('#grafico-candidatos .grafico-fila');

    expect(filas.length).toBe(5);
    expect(dom().querySelectorAll('#grafico-candidatos .grafico-barra').length).toBe(5);

    const nombres = Array.from(filas).map(fila => fila.querySelector('.grafico-nombre')?.textContent?.trim());
    expect(nombres).toEqual(component.resultado.candidatos.map(candidato => candidato.nombre));
  });

  it('should label every bar with its votes and percentage, so no value is hover-only', () => {
    component.resultado.candidatos.forEach(candidato => {
      const fila = dom().querySelector(`#resultado-candidato-${candidato.id}`);

      expect(fila).not.toBeNull();
      expect(fila?.querySelector('.grafico-valor-porcentaje')?.textContent)
        .toContain(component.formatearPorcentaje(candidato.porcentaje));
      expect(fila?.querySelector('.grafico-valor-votos')?.textContent)
        .toContain(component.formatearEntero(candidato.votos));
    });
  });

  it('should size each bar against the axis maximum, never against the leader', () => {
    const { candidatos, escalaMaxima, ganador } = component.resultado;

    expect(component.anchoBarra(ganador)).toBeCloseTo((ganador.porcentaje * 100) / escalaMaxima, 6);
    expect(component.anchoBarra(ganador)).toBeLessThan(100);

    const anchos = candidatos.map(candidato => component.anchoBarra(candidato));
    expect(anchos).toEqual([...anchos].sort((a, b) => b - a));
  });

  it('should tick the axis every ten points up to the maximum', () => {
    const marcas = Array.from(dom().querySelectorAll('.grafico-eje-marca'))
      .map(marca => marca.textContent?.trim());

    expect(component.ejeTicks[0]).toBe(0);
    expect(component.ejeTicks[component.ejeTicks.length - 1]).toBe(component.resultado.escalaMaxima);
    expect(marcas.length).toBe(component.ejeTicks.length);
    expect(marcas[marcas.length - 1]).toBe(`${component.resultado.escalaMaxima} %`);
  });

  it('should headline the winner with its percentage, votes and lead', () => {
    const { ganador, ventajaVotos, ventajaPuntos } = component.resultado;

    expect(texto('#ganador-nombre')).toBe(ganador.nombre);
    expect(texto('#ganador-porcentaje')).toBe(component.formatearPorcentaje(ganador.porcentaje));
    expect(texto('#ganador-votos')).toBe(component.formatearEntero(ganador.votos));
    expect(texto('#ganador-ventaja')).toContain(component.formatearEntero(ventajaVotos));
    expect(texto('#ganador-ventaja')).toContain(component.formatearPorcentaje(ventajaPuntos));
  });

  it('should show the electoral roll indicators', () => {
    const { electoresHabilitados, totalSufragantes, participacion, ausentismo } = component.resultado;

    expect(texto('#indicador-habilitados')).toBe(component.formatearEntero(electoresHabilitados));
    expect(texto('#indicador-sufragantes')).toBe(component.formatearEntero(totalSufragantes));
    expect(texto('#indicador-participacion')).toBe(component.formatearPorcentaje(participacion));
    expect(texto('#indicador-ausentismo')).toBe(component.formatearPorcentaje(ausentismo));
  });

  it('should report the tally progress with its state', () => {
    const { actasProcesadas, actasTotales, escrutinioFinalizado } = component.resultado;

    expect(texto('#avance-actas')).toContain(component.formatearEntero(actasProcesadas));
    expect(texto('#avance-actas')).toContain(component.formatearEntero(actasTotales));
    expect(texto('#estado-escrutinio'))
      .toBe(escrutinioFinalizado ? 'Escrutinio finalizado' : 'Escrutinio en curso');
  });

  it('should break the ballots down into valid, null and blank votes', () => {
    const items = dom().querySelectorAll('#composicion-leyenda .composicion-item');

    expect(dom().querySelectorAll('.composicion-segmento').length).toBe(3);
    expect(items.length).toBe(3);

    component.resultado.composicion.forEach((segmento, indice) => {
      const item = items[indice];
      expect(item.textContent).toContain(segmento.etiqueta);
      expect(item.textContent).toContain(component.formatearEntero(segmento.votos));
      expect(item.textContent).toContain(component.formatearPorcentaje(segmento.porcentaje));
    });
  });

  it('should swap the chart for an equivalent table on demand', () => {
    const boton = dom().querySelector('#boton-vista') as HTMLButtonElement;

    expect(dom().querySelector('#tabla-resultados')).toBeNull();

    boton.click();
    fixture.detectChanges();

    const tabla = dom().querySelector('#tabla-resultados');
    expect(component.vistaTabla).toBeTrue();
    expect(dom().querySelector('#grafico-candidatos')).toBeNull();
    expect(tabla).not.toBeNull();
    expect(tabla?.querySelectorAll('tbody tr').length).toBe(5);
    expect(tabla?.textContent).toContain(component.formatearEntero(component.resultado.ganador.votos));

    boton.click();
    fixture.detectChanges();

    expect(component.vistaTabla).toBeFalse();
    expect(dom().querySelector('#grafico-candidatos')).not.toBeNull();
  });

  it('should show a candidate tooltip only while its row is highlighted', () => {
    const fila = dom().querySelector('#resultado-candidato-2') as HTMLElement;

    expect(dom().querySelector('.grafico-tooltip')).toBeNull();

    fila.dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();

    expect(dom().querySelectorAll('.grafico-tooltip').length).toBe(1);
    expect(fila.querySelector('.grafico-tooltip')?.textContent)
      .toContain(component.descripcionVotacion(component.resultado.ganador));

    fila.dispatchEvent(new MouseEvent('mouseleave'));
    fixture.detectChanges();

    expect(dom().querySelector('.grafico-tooltip')).toBeNull();
  });

  it('should format figures with local thousand and decimal separators', () => {
    expect(component.formatearEntero(1244656)).toBe('1.244.656');
    expect(component.formatearEntero(412)).toBe('412');
    expect(component.formatearPorcentaje(35.4292)).toBe('35,43 %');
    expect(component.formatearPorcentaje(83.7407, 1)).toBe('83,7 %');
  });
});
