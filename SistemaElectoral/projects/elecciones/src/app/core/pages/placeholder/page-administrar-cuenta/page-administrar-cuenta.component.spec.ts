import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { PageAdministrarCuentaComponent } from './page-administrar-cuenta.component';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';

describe('PageAdministrarCuentaComponent', () => {
  let component: PageAdministrarCuentaComponent;
  let fixture: ComponentFixture<PageAdministrarCuentaComponent>;

  const dom = (): HTMLElement => fixture.nativeElement as HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ CommonModule, RouterTestingModule ],
      declarations: [ PageAdministrarCuentaComponent, SidebarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageAdministrarCuentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the page title', () => {
    expect(dom().querySelector('.cuenta-titulo')?.textContent).toContain('Administrar Cuenta');
  });

  it('should display user account data', () => {
    expect(dom().textContent).toContain('Juan Pérez García');
    expect(dom().textContent).toContain('juan.perez@example.com');
    expect(dom().textContent).toContain('15.234.567-8');
  });

  it('should display the account card', () => {
    expect(dom().querySelector('.cuenta-card')).not.toBeNull();
  });

  it('should display action buttons', () => {
    const buttons = dom().querySelectorAll('.btn');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('should offer a link back to the voter view', () => {
    const volver = dom().querySelector('.volver-link');
    expect(volver).not.toBeNull();
    expect(volver?.getAttribute('ng-reflect-router-link')).toContain('/datos-votante');
  });

  it('should embed the navigation sidebar', () => {
    expect(dom().querySelector('se-sidebar')).not.toBeNull();
  });
});
