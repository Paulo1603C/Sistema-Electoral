import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PageLoginComponent } from './pages/page-login/page-login.component';
import { PageDatosVotanteComponent } from './pages/page-datos-votante/page-datos-votante.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { PageVerVotosComponent } from './pages/placeholder/page-ver-votos/page-ver-votos.component';
import { PageResultadosComponent } from './pages/placeholder/page-resultados/page-resultados.component';
import { PageCandidatosComponent } from './pages/placeholder/page-candidatos/page-candidatos.component';
import { PageRecintosComponent } from './pages/placeholder/page-recintos/page-recintos.component';
import { PagePadronComponent } from './pages/placeholder/page-padron/page-padron.component';
import { PageAdministrarCuentaComponent } from './pages/placeholder/page-administrar-cuenta/page-administrar-cuenta.component';



@NgModule({
  declarations: [
    PageLoginComponent,
    PageDatosVotanteComponent,
    SidebarComponent,
    PageVerVotosComponent,
    PageResultadosComponent,
    PageCandidatosComponent,
    PageRecintosComponent,
    PagePadronComponent,
    PageAdministrarCuentaComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  exports: [
    PageLoginComponent,
    PageDatosVotanteComponent,
    SidebarComponent,
    PageVerVotosComponent,
    PageResultadosComponent,
    PageCandidatosComponent,
    PageRecintosComponent,
    PagePadronComponent,
    PageAdministrarCuentaComponent
  ]
})
export class CoreModule { }
