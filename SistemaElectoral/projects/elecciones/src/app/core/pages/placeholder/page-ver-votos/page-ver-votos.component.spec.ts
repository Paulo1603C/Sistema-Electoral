import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { PageVerVotosComponent } from './page-ver-votos.component';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';

describe('PageVerVotosComponent', () => {
  let component: PageVerVotosComponent;
  let fixture: ComponentFixture<PageVerVotosComponent>;

  /** Acceso corto al DOM renderizado del componente. */
  const dom = (): HTMLElement => fixture.nativeElement as HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ CommonModule, RouterTestingModule ],
      declarations: [ PageVerVotosComponent, SidebarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageVerVotosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render its section title', () => {
    expect(dom().querySelector('#placeholder-titulo')?.textContent).toContain('Ver Votos');
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
