import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, MenuController, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { ReportFaultPage } from '../pages/report-fault/report-fault';
import { TrackFaultsPage } from '../pages/track-faults/track-faults';
import { UsersPage } from '../pages/users/users';
import { SettingsPage } from '../pages/settings/settings';
import { FaultsPage } from '../pages/faults/faults'
import { EngineerFaultsPage } from '../pages/engineer-faults/engineer-faults'
import { ForumPage } from '../pages/forum/forum'

import { GlobalProvider } from "../providers/global/global";


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) navCtrl;  
  rootPage:any;
  
  constructor(public platform: Platform, public toastCtrl: ToastController, public global: GlobalProvider,public statusBar: StatusBar,public splashScreen: SplashScreen, public menuCtrl: MenuController, public storage: Storage) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {          
      this.storage.ready().then(()=> {
        this.storage.get('serverAddress').then((val) =>{
          this.setServerAddress(val);
        });
        this.storage.get('session').then((val) =>{
          this.setAccount(val);
        });
      });
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  setAccount(val){
    this.global.session=val;
    if(this.global.session==null){
      this.rootPage = LoginPage;
      this.global.session=null;
    }else{
      this.global.accessLevel=this.global.session.fldaccess_level;
      this.rootPage = HomePage;
    }
  }

  setServerAddress(val){
    if(val==null){
      this.global.serverAddress="http://localhost/zinwa/";
      this.storage.set("serverAddress",this.global.serverAddress);
    }else{
      this.global.serverAddress=val;
    }
  }

  openByMode(index,mode){
    var pages=[ReportFaultPage,TrackFaultsPage,UsersPage,FaultsPage,EngineerFaultsPage,SettingsPage,ForumPage];
    this.navCtrl.push(pages[index],{'mode':mode});
  }

  openPage(index){
    var pages=[ReportFaultPage,TrackFaultsPage,UsersPage,FaultsPage,EngineerFaultsPage,SettingsPage,ForumPage];
    this.navCtrl.push(pages[index]);
  }
  
  logout(){
    this.storage.remove("session"); 
    this.global.session=null;
    this.global.accessLevel=null;
    this.navCtrl.setRoot(LoginPage);
  }

}

