import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController} from 'ionic-angular';
import { Http } from '@angular/http';
import { GlobalProvider } from "../../providers/global/global";

/**
 * Generated class for the AllocatePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

 @IonicPage()
 @Component({
 	selector: 'page-allocate',
 	templateUrl: 'allocate.html',
 })
 export class AllocatePage {
 	engineers=[];
 	baseURL:string;
 	fault:any;
 	constructor(public alertCtrl: AlertController, public toastCtrl:ToastController, public http:Http, public global:GlobalProvider, public navCtrl: NavController, public navParams: NavParams) {
 		this.fault=navParams.get('fault');
 		if(!this.fault){
 			this.navCtrl.pop();
 		}
 	}

 	ionViewDidLoad() {
 		console.log('ionViewDidLoad AllocatePage');
 		this.initEngineers();
 	}

 	filterEngineers(ev: any) {
 		this.http.get(this.baseURL)
 		.subscribe(data => {
 			console.log(data["_body"]);
 			this.engineers=JSON.parse(data["_body"]);
 			let val = ev.target.value;
 			if (val && val.trim() !== '') {
 				this.engineers = this.engineers.filter((user) => {
 					return ((user.fldforename.toLowerCase().indexOf(val.toLowerCase()) > -1));
 				})
 			}
 		}, error => {
 			console.log("failed");
 		}
 		);
 	}

 	initEngineers() {
 		console.log(this.global.session);
 		this.baseURL=this.global.serverAddress+"api/engineers.php"
 		this.http.get(this.baseURL)
 		.subscribe(data => {
 			console.log(data);
 			this.engineers=JSON.parse(data["_body"]);
 		}, error => {
 			console.log("failed");
 		}
 		);
 	}

 	allocate(user_id){
 		let url=this.global.serverAddress+"api/allocate.php?user_id="+user_id+"&fault_id="+this.fault.fldfault_id;
 		this.http.get(url)
 		.subscribe(data => {
 			console.log(data["_body"]);
 			let response=JSON.parse(data["_body"]);
 			if(response.response=="success"){
 				let alert = this.alertCtrl.create({
 					title: 'Engineers',
 					subTitle: 'Fault successfully allocated!',
 					buttons: ['OK']
 				});
 				alert.present();
 				this.navCtrl.pop();
 			}else{
 				let toast = this.toastCtrl.create({
 					message: 'Engineer could not be allocated!',
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

 }
