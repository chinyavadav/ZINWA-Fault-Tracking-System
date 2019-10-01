import { Injectable } from '@angular/core';
import { LocalNotifications } from '@ionic-native/local-notifications';

/*
  Generated class for the GlobalProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
  */
  @Injectable()
  export class GlobalProvider {
    notifications=[];
    session:any;
    serverAddress:string;
    accessLevel=null;
    tempFenceData:any

    constructor(private localNotifications: LocalNotifications) {
      console.log('Hello GlobalProvider Provider');
    }
    
    createNotification(notification_id,title,text){
      if(!(notification_id in this.notifications)){
        let notification={'title':title,'text':text};
        this.notifications[notification_id]=notification;
        this.showNotification(notification_id,notification);
      }
    }

    showNotification(notification_id,notification){
      this.localNotifications.schedule({
        id: notification_id,
        title: notification.title,
        text: notification.text,
        sound: 'file://sound.mp3',
      });
    }
  }
