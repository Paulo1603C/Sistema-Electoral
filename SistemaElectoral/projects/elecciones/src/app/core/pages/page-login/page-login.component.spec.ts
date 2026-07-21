import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { PageLoginComponent } from './page-login.component';

describe('PageLoginComponent', () => {
  let component: PageLoginComponent;
  let fixture: ComponentFixture<PageLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ FormsModule ],
      declarations: [ PageLoginComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the username and password fields', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('#usuario')).toBeTruthy();
    expect(compiled.querySelector('#contrasena')).toBeTruthy();
  });

  it('should show an error when submitting empty fields', () => {
    component.onSubmit();
    expect(component.errorMensaje).toBeTruthy();
  });

  it('should render the logo and input icons', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.login-logo')).toBeTruthy();
    expect(compiled.querySelectorAll('.input-icon').length).toBe(2);
  });

  it('should render the error message with an icon when errorMensaje is set', () => {
    component.errorMensaje = 'Ingrese usuario y contraseña.';
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const error = compiled.querySelector('.login-error');
    expect(error).toBeTruthy();
    expect(error?.querySelector('.login-error-icon')).toBeTruthy();
    expect(error?.textContent).toContain('Ingrese usuario y contraseña.');
  });
});
