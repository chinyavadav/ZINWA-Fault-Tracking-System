import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { GlobalProvider } from "../../providers/global/global";
import { LocatePage } from '../locate/locate';
import { AllocatePage } from '../allocate/allocate';

/**
 * Generated class for the FaultsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

 @IonicPage()
 @Component({
 	selector: 'page-faults',
 	templateUrl: 'faults.html',
 })
 export class FaultsPage {
 	faults=[];
 	baseURL:string;
 	mode:string;

 	constructor(public global:GlobalProvider, public http:Http,public navCtrl: NavController, public navParams: NavParams) {
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
 		this.baseURL=this.global.serverAddress+"api/faults.php?mode="+this.mode;
 		this.http.get(this.baseURL)
 		.subscribe(data => {
 			console.log(data);
 			this.faults=JSON.parse(data["_body"]);
 		}, error => {
 			console.log("failed");
 		}
 		);
 	}

 	locate(fault){
 		let location={'lat':fault.fldlatitude,'lng':fault.fldlongitude};
 		this.navCtrl.push(LocatePage,{'location':location});
 	}

 	allocate(fault){
 		this.navCtrl.push(AllocatePage,{'fault':fault});
 	}
 }
