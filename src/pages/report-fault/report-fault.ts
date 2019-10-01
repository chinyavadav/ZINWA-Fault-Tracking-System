import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController } from 'ionic-angular';
import { GlobalProvider } from "../../providers/global/global";
import { Http } from '@angular/http';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HomePage } from '../home/home';
import { LocationPage } from '../location/location';

/**
 * Generated class for the ReportFaultPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

 @IonicPage()
 @Component({
 	selector: 'page-report-fault',
 	templateUrl: 'report-fault.html',
 })
 export class ReportFaultPage {
 	isLocationSet=false;
 	fault:any;
 	selectedItem:number;
 	faultTypes=["Burst Pipe","Low Water Pressure","Other"];
 	public title:string;
 	defaultPhotoPath:string="assets/imgs/placeholder.jpg";
 	imgPath=this.defaultPhotoPath;
 	public formAddEdit: FormGroup;

 	constructor(public camera:Camera, public http:Http, public alertCtrl:AlertController ,public global:GlobalProvider ,public loadingCtrl:LoadingController , public toastCtrl: ToastController, public formBuilder:FormBuilder, public navCtrl: NavController, public navParams: NavParams) {
 		this.global.tempFenceData=null;
 		let tempFault=navParams.get('fault');
 		if(!tempFault){
 			this.title="New Fault";
 		}else{
 			this.fault=tempFault;
 			this.title=tempFault.fldfault_type;
 			if(this.fault.fldpicture!=""){
 				this.imgPath=this.fault.fldpicture;
 			}
 			this.selectedItem=this.faultTypes.indexOf(this.fault.fldfault_type);
 			this.global.tempFenceData={'lat':tempFault.fldlatitude,'lng':tempFault.fldlongitude};
 		}
 		this.formAddEdit=this.formBuilder.group({
 			type: ['',Validators.required],      
 			description: ['',Validators.required],
 		});
 	}

 	ionViewDidLoad() {
 		console.log('ionViewDidLoad NewReportPage');
 	}

 	returnHome(){
 		this.navCtrl.setRoot(HomePage);
 	}

 	addEdit() {
 		if(this.formAddEdit.valid && this.imgPath!=this.defaultPhotoPath){
 			let loader = this.loadingCtrl.create({
 				content: "Processing...",
 				spinner:"bubbles"
 			});
 			loader.present();
 			let postData:any;
 			postData=this.formAddEdit.value;
 			postData["user_id"]=this.global.session.flduser_id;
 			postData["latitude"]=this.global.tempFenceData.lat;
 			postData["longitude"]=this.global.tempFenceData.lng;
 			postData["picture"]=this.imgPath;
 			let mybaseURL:string;
 			if(this.fault){
 				mybaseURL=this.global.serverAddress+"api/edit_fault.php?fault_id="+this.fault.fldfault_id;
 			}else{
 				mybaseURL=this.global.serverAddress+"api/add_fault.php";
 			}
 			this.http.post(mybaseURL, JSON.stringify(postData))
 			.subscribe(data => {
 				console.log(data["_body"]);
 				let response = JSON.parse(data["_body"]);
 				if(response.response=="success"){
 					loader.dismiss();
 					let alert = this.alertCtrl.create({
 						title: 'Report',
 						subTitle: this.title+' Report successfully saved!',
 						buttons: ['OK']
 					});
 					alert.present();
 					this.navCtrl.pop();
 					//this.returnHome();
 				}else{
 					loader.dismiss();
 					let alert = this.alertCtrl.create({
 						title: 'Edit Report',
 						subTitle: this.title+' Report could not be saved!',
 						buttons: ['OK']
 					});
 					alert.present();
 				}
 			}, error => {
 				loader.dismiss();
 				let toast = this.toastCtrl.create({
 					message: 'Resolve Connectivity Issue!',
 					duration: 3000,
 					position: 'bottom',
 					cssClass: 'dark-trans',
 					closeButtonText: 'OK',
 					showCloseButton: true
 				});
 				toast.present();
 			}
 			);
 		}else{
 			let toast = this.toastCtrl.create({
 				message: 'Properly fill in all details!',
 				duration: 3000,
 				position: 'bottom',
 				cssClass: 'dark-trans',
 				closeButtonText: 'OK',
 				showCloseButton: true
 			});
 			toast.present();
 		}
 	}

 	takePhoto(){
 		const options: CameraOptions = {
 			quality: 70,
 			destinationType: this.camera.DestinationType.DATA_URL,
 			//sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
 			encodingType: this.camera.EncodingType.JPEG,
 			mediaType: this.camera.MediaType.PICTURE,
 			saveToPhotoAlbum: false,
 			allowEdit: false,
 			targetWidth:  500,
 			targetHeight: 500
 		}

 		this.camera.getPicture(options).then((imageData) => {
 			this.imgPath = 'data:image/jpeg;base64,' + imageData;
 		}, (err) => {
 			this.imgPath=this.defaultPhotoPath;
 			let toast = this.toastCtrl.create({
 				message: 'Could not access camera!',
 				duration: 3000,
 				position: 'bottom',
 				cssClass: 'dark-trans',
 				closeButtonText: 'OK',
 				showCloseButton: true
 			});
 			toast.present();
 		});
 	}

 	getPhoto(){
 		const options: CameraOptions = {
 			quality: 70,
 			destinationType: this.camera.DestinationType.DATA_URL,
 			sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
 			saveToPhotoAlbum: false,
 			allowEdit: true,
 			targetWidth: 500,
 			targetHeight: 500
 		}

 		this.camera.getPicture(options).then((imageData) => {
 			this.imgPath = 'data:image/jpeg;base64,' + imageData;
 		}, (err) => {
 			this.imgPath=this.defaultPhotoPath;
 			let toast = this.toastCtrl.create({
 				message: 'Could not open Gallery!',
 				duration: 3000,
 				position: 'bottom',
 				cssClass: 'dark-trans',
 				closeButtonText: 'OK',
 				showCloseButton: true
 			});
 			toast.present();
 		});
 	}

 	locate(){
 		this.navCtrl.push(LocationPage);
 	}

 }
