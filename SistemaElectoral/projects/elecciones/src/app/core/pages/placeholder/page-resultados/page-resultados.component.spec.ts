import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { PageResultadosComponent } from './page-resultados.component';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';

describe('PageResultadosComponent', () => {
  let component: PageResultadosComponent;
  let fixture: ComponentFixture<PageResultadosComponent>;

  /** Acceso corto al DOM renderizado del componente. */
  const dom = (): HTMLElement => fixture.nativeElement as HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ CommonModule, RouterTestingModule ],
      declarations: [ PageResultadosComponent, SidebarComponent ]
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

  it('should render its section title', () => {
    expect(dom().querySelector('#placeholder-titulo')?.textContent).toContain('Resultados Electorales');
  });

  it('should offer a link back to the voter view', () => {
    const volver = dom().querySelector('.placeholder-volver');
    expect(volver).not.toBeNull();
    expect(volver?.getAttribute('ng-reflect-router-link')).toContain('/datos-votante');
  });

  it('should embed the navigation sidebar', () => {
    expect(dom().querySelector('se-sidebar')).not.toBeNull();
  });
});
