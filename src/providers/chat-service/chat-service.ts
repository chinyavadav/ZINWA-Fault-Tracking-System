import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators/map';
import { Http } from "@angular/http";
import { Observable } from "rxjs/observable";
import { GlobalProvider } from '../global/global';

/*
  Generated class for the ChatServiceProvider provider.
  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

export class ChatMessage {
  messageId: string;
  fromUserId: string;
  fromUserName: string;
  fromAccessLevel: string;
  time: number | string;
  message: string;
  type: string;
  status: string;
}

export class UserInfo {
  user_id: string;
  phoneno?: string;
  fullname?: string;
}

@Injectable()
export class ChatServiceProvider {
	user_id:string;
  	msgList: ChatMessage[] = [];
	constructor(public global: GlobalProvider, private http: Http) {
		console.log('Hello ChatServiceProvider Provider');
	}
	
	getMsg() {
	    // Get mock message list
	    return this.getMsgList().subscribe(res => {
	      console.log(res);
	        this.msgList=res;//filter(item => (item.userId.indexOf(this.localAccount.user_id) !== -1 && item.toUserId.indexOf(this.externalAccount.user_id) !== -1) || (item.userId.indexOf(this.externalAccount.user_id) !== -1 && item.toUserId.indexOf(this.localAccount.user_id) !== -1)) ;
	    });
  	}

  getMsgList(): Observable<ChatMessage[]> {
    const msgListUrl = this.global.serverAddress+'api/messages.php?user_id='+this.global.session.flduser_id; //msg-list.json
    return this.http.get(msgListUrl).pipe(map(response =>JSON.parse(response["_body"]).array));
  }

  sendMsg(msg: ChatMessage) {
    let message={"from":msg.fromUserId,"message":msg.message,"type":msg.type};
    this.http.post(this.global.serverAddress+'api/message.php',JSON.stringify(message))
      .subscribe(data => {
        console.log(data["_body"]);
        let response=JSON.parse(data["_body"]);
        console.log(response);
        if(response.response=="success"){
          this.getMsg();
        }
      }, error => {
        console.log("failed to send");
      }
    );
  }

  getUserInfo(): Promise<UserInfo> {
    const userInfo: UserInfo = {
      user_id: this.user_id,
      phoneno: this.global.session.fldphone_no,
      fullname: this.global.session.fldforename+' '+this.global.session.fldsurname,
    };
    return new Promise(resolve => resolve(userInfo));
  }

}