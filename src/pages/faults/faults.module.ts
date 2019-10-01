import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FaultsPage } from './faults';

@NgModule({
  declarations: [
    FaultsPage,
  ],
  imports: [
    IonicPageModule.forChild(FaultsPage),
  ],
})
export class FaultsPageModule {}
