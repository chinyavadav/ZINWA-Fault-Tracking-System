import { Component, ElementRef, ViewChild  } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Events, Content } from 'ionic-angular';
import { ChatServiceProvider, ChatMessage } from "../../providers/chat-service/chat-service";
import { GlobalProvider } from "../../providers/global/global";
import { Camera, CameraOptions } from '@ionic-native/camera';

/**
 * Generated class for the ForumPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

 @IonicPage()
 @Component({
 	selector: 'page-forum',
 	templateUrl: 'forum.html',
 })
 export class ForumPage {
 	@ViewChild(Content) content: Content;
 	@ViewChild('chat_input') messageInput: ElementRef;
 	editorMsg = '';
 	showEmojiPicker = false;
 	chat:any;
   image:any;
   constructor(public toastCtrl:ToastController, public camera:Camera, public global:GlobalProvider, public navCtrl: NavController, public navParams: NavParams,private chatService: ChatServiceProvider ,private events: Events) {
   }

   view(imgData){
     window.open(imgData, "_self");
   }

   ionViewWillLeave() {
     this.events.unsubscribe('chat:received');
   }

   ionViewDidEnter() {
     this.events.subscribe('chat:received', msg => {
       this.pushNewMsg(msg);
     });
     this.getMessages();
   }

   getMessages(){
     this.chatService.getMsg();
     this.chat=this.chatService.msgList;
     this.onFocus();
   }

   onFocus() {
     this.showEmojiPicker = false;
     this.content.resize();
     this.scrollToBottom();
   }

  /**
   * @name sendMsg
   */
   sendMsg(msgtype) {
     let newMsg:ChatMessage;
     if(msgtype=='Text'){
       if (!this.editorMsg.trim()) return;
       newMsg = {
         messageId: Date.now().toString(),
         fromUserId: this.global.session.flduser_id,
         fromUserName: this.global.session.fldforename+' '+this.global.session.fldsurname,
         fromAccessLevel: this.global.session.fldaccess_level,
         time: Date.now(),
         message: this.editorMsg,
         type: msgtype,
         status: 'success'

       };
     }else{
       newMsg = {
         messageId: Date.now().toString(),
         fromUserId: this.global.session.flduser_id,
         fromUserName: this.global.session.fldforename+' '+this.global.session.fldsurname,
         fromAccessLevel: this.global.session.fldaccess_level,
         time: Date.now(),
         message: this.image,
         type: msgtype,
         status: 'success'
       };
       console.log(newMsg);
     }

     this.pushNewMsg(newMsg);
     this.editorMsg = '';

     if (!this.showEmojiPicker) {
       this.focus();
     }
     this.chatService.sendMsg(newMsg);
   }

  /**
   * @name pushNewMsg
   * @param msg
   */
   pushNewMsg(msg: ChatMessage) {
   	const fromUserId = this.global.session.flduser_id;
   	if (msg.fromUserId === fromUserId) {
   		this.chat.push(msg);
   	} else if (msg.fromUserId === fromUserId) {
   		this.chat.push(msg);
   	}
   	this.scrollToBottom();
   }


   getMsgIndexById(id: string) {
   	return this.chatService.msgList.findIndex(e => e.messageId === id)
   }

   scrollToBottom() {
   	setTimeout(() => {
   		if (this.content.scrollToBottom) {
   			try{
   				this.content.scrollToBottom();
   			}catch{

   			}        
   		}
   	}, 400)
   }

   private focus() {
   	if (this.messageInput && this.messageInput.nativeElement) {
   		this.messageInput.nativeElement.focus();
   	}
   }

  /*private setTextareaScroll() {
   	const textarea =this.messageInput.nativeElement;
   	textarea.scrollTop = textarea.scrollHeight;
   }*/

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
       this.image='data:image/jpeg;base64,' + imageData;
       console.log(this.image);
       this.sendMsg('Image');
     }, (err) => {
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
 }
