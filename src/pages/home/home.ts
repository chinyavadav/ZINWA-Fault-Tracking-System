import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController } from 'ionic-angular';
import { GlobalProvider } from "../../providers/global/global";
import { Geolocation } from '@ionic-native/geolocation';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { ChatServiceProvider } from "../../providers/chat-service/chat-service";

import { ReportFaultPage } from '../report-fault/report-fault';

/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

 @IonicPage()
 @Component({
   selector: 'page-home',
   templateUrl: 'home.html',
 })
 export class HomePage {
   loader:any;
   faults=[];
   constructor(public chatService:ChatServiceProvider, public storage:Storage, public loadingCtrl:LoadingController, public http:Http, public geolocation:Geolocation, public toastCtrl: ToastController, public alertCtrl:AlertController, public global:GlobalProvider, public navCtrl: NavController, public navParams: NavParams) {
     if(this.global.accessLevel=='Maintenance Foreman'){
       this.initForemanFaults();
     }
   }

   ionViewDidLoad() {
     this.chatService.getMsg();
     console.log('ionViewDidLoad HomePage');
   }

   initForemanFaults() { 
     this.http.get(this.global.serverAddress+"api/faults.php?mode=Pending")
     .subscribe(data => {
       console.log(data);
       this.faults=JSON.parse(data["_body"]);
       this.sync();
     }, error => {
       console.log("failed");
     }
     );
   }

   sync(){
     for (var i = 0; i< this.faults.length; i++) {
       this.global.createNotification(this.faults[i].fldfault_id,this.faults[i].fldfault_type,this.faults[i].fldcomment);
     }
   }

   submit(mydata:any){
     this.http.post(this.global.serverAddress+"/api/location.php", JSON.stringify(mydata))
     .subscribe(data => {
       console.log(data["_body"]);
       let response = JSON.parse(data["_body"]);
       if(response.response=="success"){
         let alert = this.alertCtrl.create({
           title: 'Home',
           subTitle: 'Location has been successfully updated!',
           buttons: ['OK']
         });
         alert.present();
         this.storage.set("session",this.global.session);
       }else{
         let alert = this.alertCtrl.create({
           title: 'Home',
           subTitle: "Location could not be updated!",
           buttons: ['OK']
         });
         alert.present();
       }
       this.loader.dismiss();
     }, error => {
       let toast = this.toastCtrl.create({
         message: 'Please connect to Internet!',
         duration: 3000,
         position: 'bottom',
         cssClass: 'dark-trans',
         closeButtonText: 'OK',
         showCloseButton: true
       });
       toast.present();
       this.loader.dismiss();
     }      
     );
   }

   updateLocation(){
     let alert = this.alertCtrl.create({
       title: 'Map',
       subTitle: 'Do you want update location?',
       buttons: [
       { text:'YES', handler: ()=>{
         this.loader = this.loadingCtrl.create({
           content: "Updating...",
           spinner:"bubbles"
         });
         this.loader.present();
         this.geolocation.getCurrentPosition({ enableHighAccuracy: true }).then((resp) => {
           let data = {
             lat:resp.coords.latitude,
             lng:resp.coords.longitude,
             meterno:this.global.session.fldmeterno
           };
           this.submit(data);
         }, err => {
           let toast = this.toastCtrl.create({
             message: "Error: "+err.message,
             duration: 3000,
             position: 'bottom',
             cssClass: 'dark-trans',
             closeButtonText: 'OK',
             showCloseButton: true
           });
           toast.present();
           this.loader.dismiss();
         });
       }
     },
     { text: 'NO' }
     ]
   });
     alert.present();
   }

   reportFault(){
     this.navCtrl.push(ReportFaultPage);
   }
 }
