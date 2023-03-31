import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageSettingComponent } from './pages/page-setting/page-setting.component';
import { DesignComponent } from './components/design/design.component';
import { InformationComponent } from './components/information/information.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';



@NgModule({
  declarations: [
    PageSettingComponent,
    DesignComponent,
    InformationComponent
  ],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  exports:[
    PageSettingComponent,
  ]
})
export class SettingsModule { }
