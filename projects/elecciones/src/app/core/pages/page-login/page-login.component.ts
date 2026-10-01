import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'se-page-login',
  templateUrl: './page-login.component.html',
  styleUrls: ['./page-login.component.css']
})
export class PageLoginComponent implements OnInit {

  usuario = '';
  contrasena = '';
  errorMensaje = '';

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  /**
   * Sin backend: no valida credenciales, únicamente exige que ambos campos
   * estén llenos antes de redirigir a los datos del votante.
   */
  onSubmit(): void {
    if (!this.usuario || !this.contrasena) {
      this.errorMensaje = 'Ingrese usuario y contraseña.';
      return;
    }

    this.errorMensaje = '';
    this.router.navigate(['/datos-votante']);
  }

}
