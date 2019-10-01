import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Geolocation } from '@ionic-native/geolocation';
import { IonicStorageModule } from '@ionic/storage';
import { HttpModule } from '@angular/http';
import { Camera } from '@ionic-native/camera';

import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';
import { ReportFaultPage } from '../pages/report-fault/report-fault';
import { TrackFaultsPage } from '../pages/track-faults/track-faults';
import { SettingsPage } from '../pages/settings/settings';
import { SignupPage } from '../pages/signup/signup';
import { LocationPage } from '../pages/location/location';
import { UsersPage } from '../pages/users/users';
import { FaultsPage } from '../pages/faults/faults';
import { EngineerFaultsPage } from '../pages/engineer-faults/engineer-faults'
import { LocatePage } from '../pages/locate/locate'
import { AllocatePage } from '../pages/allocate/allocate'
import { ForumPage } from '../pages/forum/forum'

import { GlobalProvider } from '../providers/global/global';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { ChatServiceProvider } from '../providers/chat-service/chat-service';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    SettingsPage,
    SignupPage,
    ReportFaultPage,
    TrackFaultsPage,
    LocationPage,
    UsersPage,
    FaultsPage,
    EngineerFaultsPage,
    LocatePage,
    AllocatePage,
    ForumPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    SettingsPage,
    SignupPage,
    ReportFaultPage,
    TrackFaultsPage,
    LocationPage,
    UsersPage,
    FaultsPage,
    EngineerFaultsPage,
    LocatePage,
    AllocatePage,
    ForumPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Geolocation,
    GlobalProvider,
    Camera,
    LocalNotifications,
    ChatServiceProvider
  ]
})
export class AppModule {}
