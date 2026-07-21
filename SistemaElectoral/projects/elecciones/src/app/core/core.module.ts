import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageLoginComponent } from './pages/page-login/page-login.component';



@NgModule({
  declarations: [
    PageLoginComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    PageLoginComponent
  ]
})
export class CoreModule { }
