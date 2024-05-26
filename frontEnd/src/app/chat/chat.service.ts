import { Injectable } from '@angular/core';
import io from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  socket!: any;
  messages: Message[] = [];

  constructor() {}

  connectSocket(userId: string, scrollToBottom:any): void {
    this.socket = io(`http://localhost:8081?userId=${userId}`);

    this.socket.on('getOnlineUsers', (msg: any) => {
      //console.log(msg);
    });

    this.socket.on('newMessage', (msg: any) => {
      const newMessage: Message = msg;
      newMessage.timestamp = new Date(newMessage.timestamp);
      this.messages.push(newMessage);
      scrollToBottom();
      //console.log(msg);
    });

    this.socket.on('deleteMessage', (msg: any) => {
      //console.log(msg);
    });

    this.socket.on('editMessage', (msg: any) => {
      //console.log(msg);
    });
  }

  // getMessages() {
  //   let observable = new Observable<{ user: String; message: String }>(
  //     (observer) => {
  //       this.socket.on(
  //         'new-message',
  //         (data: { user: String; message: String } | undefined) => {
  //           observer.next(data);
  //         }
  //       );
  //       return () => {
  //         this.socket.disconnect();
  //       };
  //     }
  //   );
  //   return observable;
  // }
}

interface Conversation {
  conversationId: string;
  conversationType: string;
  conversationName: string | null;
  createdAt: string;
  participants: Participant[];
}

interface Participant {
  userId: string;
  User: User;
}

interface User {
  firstName: string;
  lastName: string;
}

interface Message {
  messageId: string;
  conversationId: string;
  senderId: string;
  messageText: string;
  timestamp: Date;
  Attachments: any[]; // You can define a specific type for Attachments if needed
  User: {
    firstName: string;
    lastName: string;
  };
}
