import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageLoginComponent } from './pages/page-login/page-login.component';
import { PageDatosVotanteComponent } from './pages/page-datos-votante/page-datos-votante.component';



@NgModule({
  declarations: [
    PageLoginComponent,
    PageDatosVotanteComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    PageLoginComponent,
    PageDatosVotanteComponent
  ]
})
export class CoreModule { }
