import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController, ToastController} from 'ionic-angular';
import { Http } from '@angular/http';
import { GlobalProvider } from "../../providers/global/global";

import { LocatePage } from '../locate/locate';

/**
 * Generated class for the EngineerFaultsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

 @IonicPage()
 @Component({
 	selector: 'page-engineer-faults',
 	templateUrl: 'engineer-faults.html',
 })
 export class EngineerFaultsPage {
 	faults=[];
 	baseURL:string;
 	mode:string;
 	constructor(public toastCtrl:ToastController ,public alertCtrl:AlertController, public global:GlobalProvider, public http:Http,public navCtrl: NavController, public navParams: NavParams) {
 		this.mode=navParams.get('mode');
 		if(!this.mode){
 			this.navCtrl.pop();
 		}
 	}

 	ionViewDidLoad() {
 		console.log('ionViewDidLoad FaultsPage');
 	}

 	ionViewDidEnter() {
 		this.initFaults();
 		console.log('ionViewDidLoad FaultsPage');
 	}

 	filterFaults(ev: any) {
 		this.http.get(this.baseURL)
 		.subscribe(data => {
 			console.log(data["_body"]);
 			this.faults=JSON.parse(data["_body"]);
 			let val = ev.target.value;
 			if (val && val.trim() !== '') {
 				this.faults = this.faults.filter((fault) => {
 					return ((fault.fldfault_type.toLowerCase().indexOf(val.toLowerCase()) > -1));
 				})
 			}
 		}, error => {
 			console.log("failed");
 		}
 		);
 	}

 	initFaults() {
 		this.baseURL=this.global.serverAddress+"api/engineer-faults.php?user_id="+this.global.session.flduser_id+"&mode="+this.mode;	
 		this.http.get(this.baseURL)
 		.subscribe(data => {
 			console.log(data);
 			this.faults=JSON.parse(data["_body"]);
 		}, error => {
 			console.log("failed");
 		}
 		);
 	}

 	report(fault){
 		let url=this.global.serverAddress+"api/report-resolved.php?fault_id="+fault.fldfault_id;
 		this.http.get(url)
 		.subscribe(data => {
 			console.log(data["_body"]);
 			let response=JSON.parse(data["_body"]);
 			if(response.response=="success"){
 				let alert = this.alertCtrl.create({
 					title: 'Engineers',
 					subTitle: 'Successfully updated!',
 					buttons: ['OK']
 				});
 				alert.present();
 				this.navCtrl.pop();
 			}else{
 				let toast = this.toastCtrl.create({
 					message: 'Report could not be submitted!',
 					duration: 3000,
 					position: 'bottom',
 					cssClass: 'dark-trans',
 					closeButtonText: 'OK',
 					showCloseButton: true
 				});
 				toast.present();
 			}
 		}, error => {
 			console.log("failed");
 		}
 		);
 	}

 	locate(fault){
 		let location={'lat':fault.fldlatitude,'lng':fault.fldlongitude};
 		this.navCtrl.push(LocatePage,{'location':location});
 	}
 }
