import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EngineerFaultsPage } from './engineer-faults';

@NgModule({
  declarations: [
    EngineerFaultsPage,
  ],
  imports: [
    IonicPageModule.forChild(EngineerFaultsPage),
  ],
})
export class EngineerFaultsPageModule {}
