import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageLoginComponent } from './core/pages/page-login/page-login.component';
import { PageDatosVotanteComponent } from './core/pages/page-datos-votante/page-datos-votante.component';
import { PageVerVotosComponent } from './core/pages/placeholder/page-ver-votos/page-ver-votos.component';
import { PageResultadosComponent } from './core/pages/placeholder/page-resultados/page-resultados.component';
import { PageCandidatosComponent } from './core/pages/placeholder/page-candidatos/page-candidatos.component';
import { PageRecintosComponent } from './core/pages/placeholder/page-recintos/page-recintos.component';
import { PagePadronComponent } from './core/pages/placeholder/page-padron/page-padron.component';
import { PageAdministrarCuentaComponent } from './core/pages/placeholder/page-administrar-cuenta/page-administrar-cuenta.component';

const routes: Routes = [
  { path: '', component: PageLoginComponent },
  { path: 'datos-votante', component: PageDatosVotanteComponent },
  { path: 'ver-votos', component: PageVerVotosComponent },
  { path: 'resultados', component: PageResultadosComponent },
  { path: 'candidatos', component: PageCandidatosComponent },
  { path: 'recintos', component: PageRecintosComponent },
  { path: 'padron', component: PagePadronComponent },
  { path: 'administrar-cuenta', component: PageAdministrarCuentaComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
