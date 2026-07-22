import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageLoginComponent } from './core/pages/page-login/page-login.component';
import { PageDatosVotanteComponent } from './core/pages/page-datos-votante/page-datos-votante.component';

const routes: Routes = [
  { path: '', component: PageLoginComponent },
  { path: 'datos-votante', component: PageDatosVotanteComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
