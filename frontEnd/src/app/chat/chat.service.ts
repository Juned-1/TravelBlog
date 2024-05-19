import { Injectable } from '@angular/core';
import io from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  socket!: any;

  constructor() {}

  connectSocket(userId:string): void {
    this.socket = io(`http://localhost:8081?userId=${userId}`);

    this.socket.on('getOnlineUsers', (msg: any) => {
      console.log(msg);
    });

    this.socket.on('newMessage', (msg: any) => {
      console.log(msg);
    });

    this.socket.on('deleteMessage', (msg: any) => {
      console.log(msg);
    });

    this.socket.on('editMessage', (msg: any) => {
      console.log(msg);
    });
  }

  getMessages() {
    let observable = new Observable<{ user: String; message: String }>(
      (observer) => {
        this.socket.on('new-message', (data: { user: String; message: String; } | undefined) => {
          observer.next(data);
        });
        return () => {
          this.socket.disconnect();
        };
      }
    );
    return observable;
  }

}
