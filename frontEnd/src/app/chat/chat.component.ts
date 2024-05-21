import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { APIService } from 'src/apiservice.service';
import { ActivatedRoute } from '@angular/router';
import { error } from 'console';
import { ChatService } from './chat.service';
import { AuthService } from '../Services/Authentication/auth.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
})
export class ChatComponent implements OnInit {
  date = new Date();
  messages: Message[] = [];
  defaultDp = '../../assets/user-icon.png';

  selectedConversationId: any = null;
  @ViewChild('content', { static: true }) private content: any;
  @ViewChild('chatInput', { static: true }) messageInput!: ElementRef;
  editorMsg: string = '';
  id: string | null = null;
  conversations: Conversation[] = [];
  loggedUserId!: string; //message sender
  receiverId!: string; //message receiver
  selectedConversation!: Conversation;
  selectedConversationName = 'Select a conversation';

  constructor(
    private api: APIService,
    private route: ActivatedRoute,
    private chatService: ChatService,
    public authService: AuthService
  ) {}
  ngOnInit() {
    this.messages = this.chatService.messages;

    this.id = this.route.snapshot.queryParams['id'];

    const temp = localStorage.getItem('currentUserId');
    this.loggedUserId = temp === null ? '' : temp;

    this.api.getAllConversation().subscribe(
      (response) => {
        if (response.status === 'success') {
          this.conversations = response.data.conversation;
          console.log('conversations', this.conversations);
          if (this.conversations.length != 0)
            this.selectPerson(this.conversations[0]);

          if (this.id !== null && this.id !== undefined) {
            let present = false;
            this.conversations.forEach((conversation) => {
              const userId = conversation.participants[0].userId;
              if (userId === this.id) {
                this.selectPerson(conversation);
                present = true;
              }
            });

            if (!present) {
              this.api
                .createIndividualConversation({ recipientId: this.id })
                .subscribe(
                  (response) => {
                    console.log('create individual conversation', response);
                    this.conversations.push(response.data.conversation[0]);
                    this.selectPerson(response.data.conversation[0]);
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

  selectPerson(selectedConversation: Conversation) {
    this.selectedConversationName =
      selectedConversation.participants[0].User.firstName +
      ' ' +
      selectedConversation.participants[0].User.lastName;

    this.receiverId = selectedConversation.participants[0].userId;
    this.selectedConversationId = selectedConversation.conversationId;
    this.selectedConversation = selectedConversation;
    this.chatService.connectSocket(
      this.loggedUserId,
      this.scrollToBottom.bind(this)
    );

    this.api.getMessage(selectedConversation.conversationId).subscribe({
      next: (response) => {
        const messages = response.data.message;
        this.messages.length = 0;
        this.messages.push(...messages);
        this.messages.forEach((message) => {
          message.timestamp = new Date(message.timestamp);
        });

        this.messages.sort((a: Message, b: Message) => {
          return +new Date(a.timestamp) - +new Date(b.timestamp);
        });
        this.scrollToBottom();
      },
      error: (error) => {
        console.log(error);
      },
    });
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
