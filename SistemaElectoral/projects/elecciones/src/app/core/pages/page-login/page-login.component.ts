import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'se-page-login',
  templateUrl: './page-login.component.html',
  styleUrls: ['./page-login.component.css']
})
export class PageLoginComponent implements OnInit {

  usuario = '';
  contrasena = '';
  errorMensaje = '';

  constructor() { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (!this.usuario || !this.contrasena) {
      this.errorMensaje = 'Ingrese usuario y contraseña.';
      return;
    }

    this.errorMensaje = '';
  }

}
