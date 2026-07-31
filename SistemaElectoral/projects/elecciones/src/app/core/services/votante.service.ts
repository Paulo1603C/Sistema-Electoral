import { Injectable } from '@angular/core';
import { Votante } from '../models/votante.model';

/**
 * Provee los datos del votante. Por ahora sin backend: la información es
 * fija y sirve para alimentar la vista posterior al ingreso.
 */
@Injectable({
  providedIn: 'root'
})
export class VotanteService {

  private readonly votante: Votante = {
    nombre: 'María Fernanda Cedeño Loor',
    cedula: '1312456789',
    recinto: 'Unidad Educativa Nacional Manta',
    mesa: 'Mesa 042',
    estadoVoto: 'Pendiente'
  };

  /** Devuelve una copia de los datos del votante autenticado. */
  obtenerVotante(): Votante {
    return { ...this.votante };
  }

}
