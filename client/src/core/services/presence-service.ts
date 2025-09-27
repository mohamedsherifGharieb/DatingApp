import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { ToastService } from './toast-service';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { User } from '../../Types/user';
import { Message } from '../../Types/Message';


@Injectable({
  providedIn: 'root'
})
export class PresenceService {
  private hubUrl = environment.hubUrl;
  private toast = inject(ToastService);
  public hubConnection? : HubConnection
  onlineUser = signal<string[]>([]);

  createHubConnection(user: User){
    this.hubConnection = new HubConnectionBuilder()
    .withUrl(this.hubUrl + 'presence' , {
      accessTokenFactory: () => user.token
    })
    .withAutomaticReconnect()
    .build();
    this.hubConnection.start()
    .catch(error => console.log(error))

    this.hubConnection.on("UserOnline",userId => {
      this.onlineUser.update(users => [...users,userId])
    })
    this.hubConnection.on("UserOffline",userId => {
      this.onlineUser.update(users => users.filter(x=>x !== userId))
    });

    this.hubConnection.on('GetOnlineUsers',userIds => {
    this.onlineUser.set(userIds);
    });
    this.hubConnection.on('NewMessageReceived',(message: Message) => {
      this.toast.info(message.senderDisplayName 
        + ' has sent you a new message',5000,message.senderImageUrl
        ,`/members/${message.senderId}/messages`);
    })
  }


  stopHubConnection(){
    if(this.hubConnection?.state === HubConnectionState.Connected){
      this.hubConnection.stop().catch(error => console.log(error))
    }}

}
