import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { routes } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';

/**
 * Pruebas de integración del mapa de navegación: montan `CoreModule` con las
 * rutas reales y navegan de verdad, de modo que un componente mal declarado o
 * una ruta que apunte a un archivo movido falle aquí y no en ejecución.
 */
describe('AppRoutingModule', () => {
  let router: Router;
  let fixture: ComponentFixture<AppComponent>;

  /** Selector del componente que el `router-outlet` acabó renderizando. */
  const renderizado = (): string | null => {
    const outlet = (fixture.nativeElement as HTMLElement).querySelector('router-outlet');
    const siguiente = outlet?.nextElementSibling;
    return siguiente ? siguiente.tagName.toLowerCase() : null;
  };

  /** Navega y sincroniza la vista. */
  const irA = (ruta: string): void => {
    router.navigateByUrl(ruta);
    tick();
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ CoreModule, RouterTestingModule.withRoutes(routes) ],
      declarations: [ AppComponent ]
    })
    .compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
  });

  it('should render the results view at /resultados', fakeAsync(() => {
    irA('/resultados');

    expect(router.url).toBe('/resultados');
    expect(renderizado()).toBe('se-page-resultados');
  }));

  it('should show the tallied results, not a placeholder notice', fakeAsync(() => {
    irA('/resultados');
    const dom = fixture.nativeElement as HTMLElement;

    expect(dom.querySelector('#grafico-candidatos')).not.toBeNull();
    expect(dom.querySelectorAll('#grafico-candidatos .grafico-fila').length).toBe(5);
    expect(dom.querySelector('.placeholder-card')).toBeNull();
    expect(dom.textContent).not.toContain('en construcción');
  }));

  it('should keep the remaining sections reachable', fakeAsync(() => {
    const esperado: Array<[string, string]> = [
      ['/', 'se-page-login'],
      ['/datos-votante', 'se-page-datos-votante'],
      ['/ver-votos', 'se-page-ver-votos'],
      ['/candidatos', 'se-page-candidatos'],
      ['/recintos', 'se-page-recintos'],
      ['/padron', 'se-page-padron'],
      ['/administrar-cuenta', 'se-page-administrar-cuenta']
    ];

    esperado.forEach(([ruta, selector]) => {
      irA(ruta);
      expect(renderizado()).withContext(`ruta ${ruta}`).toBe(selector);
    });
  }));

  it('should send unknown routes back to the login view', fakeAsync(() => {
    irA('/ruta-inexistente');

    expect(router.url).toBe('/');
    expect(renderizado()).toBe('se-page-login');
  }));

  it('should let the sidebar reach the results view', fakeAsync(() => {
    irA('/datos-votante');

    const opcion = (fixture.nativeElement as HTMLElement)
      .querySelector('#sidebar-opcion-resultados') as HTMLButtonElement;
    expect(opcion).not.toBeNull();

    opcion.click();
    tick();
    fixture.detectChanges();

    expect(router.url).toBe('/resultados');
    expect(renderizado()).toBe('se-page-resultados');
  }));
});
