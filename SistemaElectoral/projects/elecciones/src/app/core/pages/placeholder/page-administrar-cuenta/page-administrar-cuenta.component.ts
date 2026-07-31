import { Component } from '@angular/core';

interface CuentaUsuario {
  nombre: string;
  email: string;
  cedula: string;
  telefono: string;
  fechaRegistro: string;
  rol: string;
}

@Component({
  selector: 'se-page-administrar-cuenta',
  templateUrl: './page-administrar-cuenta.component.html',
  styleUrls: ['../placeholder.shared.css', './page-administrar-cuenta.component.css']
})
export class PageAdministrarCuentaComponent {
  readonly titulo = 'Administrar Cuenta';

  cuenta: CuentaUsuario = {
    nombre: 'Juan Pérez García',
    email: 'juan.perez@example.com',
    cedula: '15.234.567-8',
    telefono: '+56 9 1234 5678',
    fechaRegistro: '15 de marzo, 2024',
    rol: 'Votante'
  };
}
