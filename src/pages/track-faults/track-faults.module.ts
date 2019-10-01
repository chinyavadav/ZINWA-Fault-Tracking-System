import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TrackFaultsPage } from './track-faults';

@NgModule({
  declarations: [
    TrackFaultsPage,
  ],
  imports: [
    IonicPageModule.forChild(TrackFaultsPage),
  ],
})
export class TrackFaultsPageModule {}
