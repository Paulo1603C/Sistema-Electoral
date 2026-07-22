import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { PageDatosVotanteComponent } from './page-datos-votante.component';
import { VotanteService } from '../../services/votante.service';

describe('PageDatosVotanteComponent', () => {
  let component: PageDatosVotanteComponent;
  let fixture: ComponentFixture<PageDatosVotanteComponent>;
  let router: Router;

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

  it('should render every voter field', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const votante = component.votante;

    expect(compiled.querySelector('#dato-nombre')?.textContent).toContain(votante.nombre);
    expect(compiled.querySelector('#dato-cedula')?.textContent).toContain(votante.cedula);
    expect(compiled.querySelector('#dato-recinto')?.textContent).toContain(votante.recinto);
    expect(compiled.querySelector('#dato-mesa')?.textContent).toContain(votante.mesa);
    expect(compiled.querySelector('#dato-estado')?.textContent).toContain(votante.estadoVoto);
  });

  it('should style the vote status according to estadoVoto', () => {
    component.votante = { ...component.votante, estadoVoto: 'Votado' };
    fixture.detectChanges();
    expect(component.yaVoto).toBeTrue();
    let estado = (fixture.nativeElement as HTMLElement).querySelector('#dato-estado');
    expect(estado?.classList).toContain('estado-voto--votado');

    component.votante = { ...component.votante, estadoVoto: 'Pendiente' };
    fixture.detectChanges();
    expect(component.yaVoto).toBeFalse();
    estado = (fixture.nativeElement as HTMLElement).querySelector('#dato-estado');
    expect(estado?.classList).toContain('estado-voto--pendiente');
  });

  it('should build the avatar initials from the first two names', () => {
    component.votante = { ...component.votante, nombre: 'María Fernanda Cedeño Loor' };
    expect(component.iniciales).toBe('MF');
  });

  it('should navigate back to the login when leaving', () => {
    component.salir();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });
});
