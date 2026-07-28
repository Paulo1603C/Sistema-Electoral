import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Votante } from '../../models/votante.model';
import { Candidato } from '../../models/candidato.model';
import { VotanteService } from '../../services/votante.service';
import { OpcionSidebar } from '../../components/sidebar/sidebar.component';

@Component({
  selector: 'se-page-datos-votante',
  templateUrl: './page-datos-votante.component.html',
  styleUrls: ['./page-datos-votante.component.css']
})
export class PageDatosVotanteComponent implements OnInit {

  votante!: Votante;

  /** Contenedor del avatar y su dropdown, usado para detectar clicks externos. */
  @ViewChild('usuarioMenu') usuarioMenu?: ElementRef<HTMLElement>;

  /** Estado del dropdown de la cuenta que cuelga del avatar. */
  menuAbierto = false;

  /** Candidatos de ejemplo para la elección de presidente. */
  candidatos: Candidato[] = [
    { id: 1, nombre: 'Ana Gómez Rivas', partido: 'Movimiento Futuro Verde', iniciales: 'AG', color: '#2e7d32' },
    { id: 2, nombre: 'Carlos Andrade Vera', partido: 'Alianza Progreso Nacional', iniciales: 'CA', color: '#1976d2' },
    { id: 3, nombre: 'Lucía Herrera Paz', partido: 'Unidad Ciudadana', iniciales: 'LH', color: '#c62828' }
  ];

  candidatoSeleccionado: Candidato | null = null;

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

  /** Abre o cierra el dropdown de la cuenta al pulsar el avatar. */
  alternarMenu(): void {
    this.menuAbierto = !this.menuAbierto;
  }

  /** Cierra el dropdown de la cuenta. */
  cerrarMenu(): void {
    this.menuAbierto = false;
  }

  /** Cierra el dropdown cuando el click ocurre fuera del avatar o del menú. */
  @HostListener('document:click', ['$event'])
  alClickDocumento(evento: MouseEvent): void {
    if (!this.menuAbierto) {
      return;
    }

    const contenedor = this.usuarioMenu?.nativeElement;
    if (contenedor && !contenedor.contains(evento.target as Node)) {
      this.cerrarMenu();
    }
  }

  /** Cierra el dropdown con la tecla Escape, como en cualquier menú de cuenta. */
  @HostListener('document:keydown.escape')
  alPresionarEscape(): void {
    this.cerrarMenu();
  }

  salir(): void {
    this.cerrarMenu();
    this.router.navigate(['/']);
  }

  /** Reacciona a la opción elegida en el menú lateral (opciones de prueba). */
  alSeleccionarOpcion(opcion: OpcionSidebar): void {
    alert('Opción seleccionada: ' + opcion.etiqueta);
  }

  /** Marca al candidato elegido y notifica la selección al usuario. */
  seleccionarCandidato(candidato: Candidato): void {
    this.candidatoSeleccionado = candidato;
    alert('usuario marcado');
  }

}
