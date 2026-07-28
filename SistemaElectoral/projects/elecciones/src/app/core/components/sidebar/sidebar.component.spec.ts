import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpcionSidebar, SidebarComponent } from './sidebar.component';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;

  /** Acceso corto al DOM renderizado del componente. */
  const dom = (): HTMLElement => fixture.nativeElement as HTMLElement;

  /** Pulsa el botón hamburguesa, como haría el usuario. */
  const pulsarToggle = (): void => {
    (dom().querySelector('#sidebar-toggle') as HTMLButtonElement).click();
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ CommonModule ],
      declarations: [ SidebarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the hamburger toggle button', () => {
    expect(dom().querySelector('#sidebar-toggle')).not.toBeNull();
  });

  it('should keep the panel collapsed until the hamburger is clicked', () => {
    expect(component.abierto).toBeFalse();
    expect(dom().querySelector('.sidebar-panel--abierto')).toBeNull();
    expect(dom().querySelector('.sidebar-overlay')).toBeNull();

    pulsarToggle();

    expect(component.abierto).toBeTrue();
    expect(dom().querySelector('.sidebar-panel--abierto')).not.toBeNull();
    expect(dom().querySelector('.sidebar-overlay')).not.toBeNull();
  });

  it('should toggle the panel when the hamburger is clicked twice', () => {
    pulsarToggle();
    expect(component.abierto).toBeTrue();

    pulsarToggle();
    expect(component.abierto).toBeFalse();
  });

  it('should render the electoral test options', () => {
    const etiquetas = component.opciones.map(o => o.etiqueta);
    expect(etiquetas).toContain('Ver Votos');
    expect(etiquetas).toContain('Administrar Cuenta');

    pulsarToggle();
    const botones = dom().querySelectorAll('.sidebar-opcion');
    expect(botones.length).toBe(component.opciones.length);
    expect(dom().querySelector('#sidebar-opcion-ver-votos')).not.toBeNull();
    expect(dom().querySelector('#sidebar-opcion-administrar-cuenta')).not.toBeNull();
  });

  it('should emit the chosen option, mark it active and close the panel', () => {
    let emitida: OpcionSidebar | undefined;
    component.opcionSeleccionada.subscribe(o => (emitida = o));

    pulsarToggle();
    (dom().querySelector('#sidebar-opcion-ver-votos') as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(emitida?.clave).toBe('ver-votos');
    expect(component.opcionActiva).toBe('ver-votos');
    expect(component.abierto).toBeFalse();
  });

  it('should close the panel when clicking the dark overlay', () => {
    pulsarToggle();
    (dom().querySelector('.sidebar-overlay') as HTMLElement).click();
    fixture.detectChanges();

    expect(component.abierto).toBeFalse();
  });

  it('should close the panel when pressing the close button', () => {
    pulsarToggle();
    (dom().querySelector('#sidebar-cerrar') as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(component.abierto).toBeFalse();
  });

  it('should close the panel when pressing Escape', () => {
    pulsarToggle();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    fixture.detectChanges();

    expect(component.abierto).toBeFalse();
  });
});
