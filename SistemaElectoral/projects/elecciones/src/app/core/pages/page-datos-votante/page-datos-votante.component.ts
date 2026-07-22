import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Votante } from '../../models/votante.model';
import { VotanteService } from '../../services/votante.service';

@Component({
  selector: 'se-page-datos-votante',
  templateUrl: './page-datos-votante.component.html',
  styleUrls: ['./page-datos-votante.component.css']
})
export class PageDatosVotanteComponent implements OnInit {

  votante!: Votante;

  constructor(
    private votanteService: VotanteService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.votante = this.votanteService.obtenerVotante();
  }

  /** Indica si el votante ya sufragó, para resaltar el estado en la vista. */
  get yaVoto(): boolean {
    return this.votante?.estadoVoto === 'Votado';
  }

  /** Devuelve las iniciales del votante para el avatar. */
  get iniciales(): string {
    return (this.votante?.nombre || '')
      .split(' ')
      .filter(parte => !!parte)
      .slice(0, 2)
      .map(parte => parte.charAt(0).toUpperCase())
      .join('');
  }

  salir(): void {
    this.router.navigate(['/']);
  }

}
