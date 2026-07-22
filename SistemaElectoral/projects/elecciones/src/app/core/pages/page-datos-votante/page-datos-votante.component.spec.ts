import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { PageDatosVotanteComponent } from './page-datos-votante.component';
import { VotanteService } from '../../services/votante.service';

describe('PageDatosVotanteComponent', () => {
  let component: PageDatosVotanteComponent;
  let fixture: ComponentFixture<PageDatosVotanteComponent>;
  let router: Router;

  /** Acceso corto al DOM renderizado del componente. */
  const dom = (): HTMLElement => fixture.nativeElement as HTMLElement;

  /** Abre el dropdown pulsando el avatar, como haría el usuario. */
  const abrirMenu = (): void => {
    (dom().querySelector('#avatar-usuario') as HTMLButtonElement).click();
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ RouterTestingModule ],
      declarations: [ PageDatosVotanteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageDatosVotanteComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load the voter data from the service', () => {
    const esperado = TestBed.inject(VotanteService).obtenerVotante();
    expect(component.votante).toEqual(esperado);
  });

  it('should no longer render the big voter card', () => {
    expect(dom().querySelector('.votante-card')).toBeNull();
    expect(dom().querySelector('.votante-header')).toBeNull();
  });

  it('should render the avatar with the initials in the top bar', () => {
    const avatar = dom().querySelector('#avatar-usuario');
    expect(avatar).not.toBeNull();
    expect(avatar?.textContent?.trim()).toBe(component.iniciales);
    expect(dom().querySelector('.votante-topbar')?.contains(avatar as Node)).toBeTrue();
  });

  it('should keep the dropdown closed until the avatar is clicked', () => {
    expect(component.menuAbierto).toBeFalse();
    expect(dom().querySelector('#menu-usuario')).toBeNull();
    expect(dom().querySelector('#dato-nombre')).toBeNull();

    abrirMenu();

    expect(component.menuAbierto).toBeTrue();
    expect(dom().querySelector('#menu-usuario')).not.toBeNull();
  });

  it('should toggle the dropdown when the avatar is clicked twice', () => {
    abrirMenu();
    expect(component.menuAbierto).toBeTrue();

    abrirMenu();
    expect(component.menuAbierto).toBeFalse();
    expect(dom().querySelector('#menu-usuario')).toBeNull();
  });

  it('should render every voter field inside the dropdown', () => {
    abrirMenu();
    const votante = component.votante;
    const menu = dom().querySelector('#menu-usuario') as HTMLElement;

    expect(menu.querySelector('#dato-nombre')?.textContent).toContain(votante.nombre);
    expect(menu.querySelector('#dato-cedula')?.textContent).toContain(votante.cedula);
    expect(menu.querySelector('#dato-recinto')?.textContent).toContain(votante.recinto);
    expect(menu.querySelector('#dato-mesa')?.textContent).toContain(votante.mesa);
    expect(menu.querySelector('#dato-estado')?.textContent).toContain(votante.estadoVoto);
  });

  it('should place the logout button as the last item of the dropdown', () => {
    abrirMenu();
    const menu = dom().querySelector('#menu-usuario') as HTMLElement;
    const boton = menu.querySelector('#boton-salir') as HTMLButtonElement;

    expect(boton).not.toBeNull();
    expect(boton.textContent).toContain('Cerrar sesión');
    expect(menu.lastElementChild).toBe(boton);
  });

  it('should style the vote status according to estadoVoto', () => {
    component.votante = { ...component.votante, estadoVoto: 'Votado' };
    abrirMenu();
    expect(component.yaVoto).toBeTrue();
    expect(dom().querySelector('#dato-estado')?.classList).toContain('estado-voto--votado');

    component.votante = { ...component.votante, estadoVoto: 'Pendiente' };
    fixture.detectChanges();
    expect(component.yaVoto).toBeFalse();
    expect(dom().querySelector('#dato-estado')?.classList).toContain('estado-voto--pendiente');
  });

  it('should build the avatar initials from the first two names', () => {
    component.votante = { ...component.votante, nombre: 'María Fernanda Cedeño Loor' };
    expect(component.iniciales).toBe('MF');
  });

  it('should keep the dropdown open when clicking inside it', () => {
    abrirMenu();
    (dom().querySelector('#dato-nombre') as HTMLElement).click();
    fixture.detectChanges();

    expect(component.menuAbierto).toBeTrue();
  });

  it('should close the dropdown when clicking outside of it', () => {
    abrirMenu();
    document.body.click();
    fixture.detectChanges();

    expect(component.menuAbierto).toBeFalse();
    expect(dom().querySelector('#menu-usuario')).toBeNull();
  });

  it('should close the dropdown when pressing Escape', () => {
    abrirMenu();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    fixture.detectChanges();

    expect(component.menuAbierto).toBeFalse();
  });

  it('should navigate back to the login when leaving from the dropdown', () => {
    abrirMenu();
    (dom().querySelector('#boton-salir') as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(router.navigate).toHaveBeenCalledWith(['/']);
    expect(component.menuAbierto).toBeFalse();
  });

  it('should not force its own scrollbar alongside the browser one', () => {
    const votantePage = dom().querySelector('.votante-page') as HTMLElement;
    const estilos = getComputedStyle(votantePage);

    // overflow-x sin overflow-y explícito hace que el navegador calcule
    // overflow-y como "auto", creando un scroll interno además del propio
    // del documento. Ambos ejes deben quedar fijados explícitamente.
    expect(estilos.overflowX).toBe('hidden');
    expect(estilos.overflowY).toBe('hidden');
  });

  it('should render the 3 candidate cards', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(component.candidatos.length).toBe(3);
    const tarjetas = compiled.querySelectorAll('.candidato-card');
    expect(tarjetas.length).toBe(3);
  });

  it('should mark the selected candidate and show a native alert', () => {
    spyOn(window, 'alert');
    const candidato = component.candidatos[1];

    component.seleccionarCandidato(candidato);
    fixture.detectChanges();

    expect(component.candidatoSeleccionado).toEqual(candidato);
    expect(window.alert).toHaveBeenCalledWith('usuario marcado');

    const compiled = fixture.nativeElement as HTMLElement;
    const tarjetaSeleccionada = compiled.querySelector(`#candidato-${candidato.id}`);
    expect(tarjetaSeleccionada?.classList).toContain('candidato-card--seleccionado');
  });

  it('should call seleccionarCandidato when a candidate card is clicked', () => {
    spyOn(window, 'alert');
    spyOn(component, 'seleccionarCandidato').and.callThrough();

    const compiled = fixture.nativeElement as HTMLElement;
    const primeraTarjeta = compiled.querySelector('.candidato-card') as HTMLButtonElement;
    primeraTarjeta.click();
    fixture.detectChanges();

    expect(component.seleccionarCandidato).toHaveBeenCalledWith(component.candidatos[0]);
    expect(window.alert).toHaveBeenCalledWith('usuario marcado');
  });
});
