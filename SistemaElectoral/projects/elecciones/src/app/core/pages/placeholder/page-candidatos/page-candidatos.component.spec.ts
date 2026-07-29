import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { PageCandidatosComponent } from './page-candidatos.component';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';

describe('PageCandidatosComponent', () => {
  let component: PageCandidatosComponent;
  let fixture: ComponentFixture<PageCandidatosComponent>;

  /** Acceso corto al DOM renderizado del componente. */
  const dom = (): HTMLElement => fixture.nativeElement as HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ CommonModule, RouterTestingModule ],
      declarations: [ PageCandidatosComponent, SidebarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
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
});
