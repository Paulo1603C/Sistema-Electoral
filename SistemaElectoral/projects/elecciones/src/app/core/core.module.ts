import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageLoginComponent } from './pages/page-login/page-login.component';
import { PageDatosVotanteComponent } from './pages/page-datos-votante/page-datos-votante.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';



@NgModule({
  declarations: [
    PageLoginComponent,
    PageDatosVotanteComponent,
    SidebarComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    PageLoginComponent,
    PageDatosVotanteComponent,
    SidebarComponent
  ]
})
export class CoreModule { }
