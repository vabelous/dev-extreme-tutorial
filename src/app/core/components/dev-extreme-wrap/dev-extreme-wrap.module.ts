import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DevExtremeWrapComponent } from './dev-extreme-wrap.component';

@NgModule({
  declarations: [
    DevExtremeWrapComponent
  ],
  exports: [
    DevExtremeWrapComponent
  ],
  imports: [
    CommonModule
  ],

})
export class DevExtremeWrapModule { }
