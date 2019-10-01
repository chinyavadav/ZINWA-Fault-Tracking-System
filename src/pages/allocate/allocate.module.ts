import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AllocatePage } from './allocate';

@NgModule({
  declarations: [
    AllocatePage,
  ],
  imports: [
    IonicPageModule.forChild(AllocatePage),
  ],
})
export class AllocatePageModule {}
