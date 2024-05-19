import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { APIService } from 'src/apiservice.service';
import { ActivatedRoute } from '@angular/router';
import { error } from 'console';
import { ChatService } from './chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
})
export class ChatComponent implements OnInit {
  date = new Date();
  messages!: Message[];

  selectedConversationId: any = null;
  @ViewChild('content', { static: true }) private content: any;
  @ViewChild('chatInput', { static: true }) messageInput!: ElementRef;
  editorMsg: string = '';
  id: string | null = null;
  conversations: Conversation[] = [];
  loggedUserId!: string; //message sender
  receiverId!: string; //message receiver

  constructor(
    private api: APIService,
    private route: ActivatedRoute,
    private chatService: ChatService
  ) {}
  ngOnInit() {
    this.id = this.route.snapshot.queryParams['id'];

    const temp = localStorage.getItem('currentUserId');
    this.loggedUserId = temp === null ? '' : temp;

    this.api.getAllConversation().subscribe(
      (response) => {
        if (response.status === 'success') {
          this.conversations = response.data.conversation;
          console.log('conversations', this.conversations);

          if (this.id !== null && this.id !== undefined) {
            let present = false;
            this.conversations.forEach((conversation) => {
              const userId = conversation.participants[0].userId;
              if (userId === this.id) {
                this.selectPerson(
                  conversation.conversationId,
                  conversation.participants[0].userId
                );
                present = true;
              }
            });

            if (!present) {
              this.api
                .createIndividualConversation({ recipientId: this.id })
                .subscribe(
                  (response) => {
                    console.log('create individual conversation',response);
                    this.conversations.push(response.data.conversation[0]);
                    this.selectPerson(
                      response.data.conversation[0].conversationId,
                      response.data.conversation[0].participants[0].userId
                    );
                  },
                  (error) => {
                    console.log(error);
                  }
                );
            }
          }
        } else {
          console.error('Failed to fetch conversations:', response);
        }
      },
      (error) => {
        // Handle error
        console.error(error);
      }
    );
  }

  selectPerson(selectedConversationId: string, receiverId: string) {
    this.receiverId = receiverId;
    this.selectedConversationId = selectedConversationId;
    this.chatService.connectSocket(this.loggedUserId);

    this.api.getMessage(selectedConversationId).subscribe({
      next: (response) => {
        this.messages = response.data.message;
        this.messages.forEach((message) => {
          message.timestamp = new Date(message.timestamp);
        });

        this.messages.sort((a: Message, b: Message) => {
          return +new Date(a.timestamp) - +new Date(b.timestamp);
        });
      },
      error: (error) => {
        console.log(error);
      },
    });

    this.scrollToBottom();
  }

  onFocus() {
    if (this.messageInput && this.messageInput.nativeElement) {
      this.messageInput.nativeElement.focus();
    }
  }
  sendMessage() {
    if (!this.editorMsg.trim()) {
      return;
    }
    const messageText = this.editorMsg;

    this.editorMsg = '';
    this.onFocus();

    this.api.sendMessage(this.selectedConversationId, messageText).subscribe({
      //also send userId
      next: (response) => {
        //add the message in conversation
        const newMessage: Message = response.data.message;
        newMessage.timestamp = new Date(newMessage.timestamp);
        this.messages.push(newMessage);
        this.scrollToBottom();
      },
      error: (error) => {
        console.log(error);
      },
    });

    this.scrollToBottom();
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.content.scrollToBottom) {
        this.content.scrollToBottom();
      }
    }, 1);
  }
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
