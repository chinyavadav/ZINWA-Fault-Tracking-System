import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { GlobalProvider } from "../../providers/global/global";
import { ReportFaultPage } from '../report-fault/report-fault';

/**
 * Generated class for the TrackFaultsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-track-faults',
  templateUrl: 'track-faults.html',
})
export class TrackFaultsPage {
 	faults=[];
 	total:number;
 	productsURL:string;
 	baseURL:string;

 	constructor(public global:GlobalProvider, public http:Http,public navCtrl: NavController, public navParams: NavParams) {
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
 		this.baseURL=this.global.serverAddress+"api/track-faults.php?user_id="+this.global.session.flduser_id;
 		this.http.get(this.baseURL)
 		.subscribe(data => {
 			console.log(data);
 			this.faults=JSON.parse(data["_body"]);
 		}, error => {
 			console.log("failed");
 		}
 		);
 	}

 	edit(fault){
 		this.navCtrl.push(ReportFaultPage, {'fault':fault});
 	}

 	add(){
 		this.navCtrl.push(ReportFaultPage);
 	}

}
