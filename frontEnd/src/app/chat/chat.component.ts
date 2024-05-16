import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { APIService } from 'src/apiservice.service';
import { ActivatedRoute } from '@angular/router';
import { error } from 'console';

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
  // persons = [
  //   {
  //     name: 'Person 1',
  //     messages: [
  //       {
  //         message: 'Hi',
  //         userIsSender: true,
  //         createdAt: new Date(),
  //       },
  //       {
  //         message: 'Hello',
  //         userIsSender: false,
  //         createdAt: new Date(),
  //       },
  //     ],
  //   },
  //   {
  //     name: 'Person 2',
  //     messages: [
  //       {
  //         message: 'How are you',
  //         userIsSender: true,
  //         createdAt: new Date(),
  //       },
  //       {
  //         message: 'I am good',
  //         userIsSender: false,
  //         createdAt: new Date(),
  //       },
  //     ],
  //   },
  // ];
  selectedConversationId: any = null;
  @ViewChild('content', { static: true }) private content: any;
  @ViewChild('chatInput', { static: true }) messageInput!: ElementRef;
  editorMsg: string = '';
  id: string | null = null;
  conversations: Conversation[] = [];
  loggedUserId!: string;
  // messages!: Message[];
  // conversationId: string = '';
  // receiverFullName: string = '';
  // receiverId;
  constructor(private api: APIService, private route: ActivatedRoute) {}
  ngOnInit() {
    this.id = this.route.snapshot.queryParams['id'];

    const id = localStorage.getItem('currentUserId');
    this.loggedUserId = id === null ? '' : id;

    this.api.getAllConversation().subscribe(
      (response) => {
        if (response.status === 'success') {
          this.conversations = response.data.conversation;

          let present = false;

          if (this.id !== null) {
            this.conversations.forEach((conversation) => {
              const userId = conversation.participants[0].userId;
              if (userId === this.id) {
                this.selectPerson(conversation.conversationId);
                present = true;
              }
            });
          }

          if (!present) {
            this.api
              .createIndividualConversation({ recipientId: this.id })
              .subscribe(
                (response) => {
                  this.conversations.push(response.data.conversation[0])
                  console.log('Succesfully created individual conversation');
                  console.log(response);
                },
                (error) => {
                  console.log(error);
                }
              );
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

  selectPerson(id: string) {
    this.selectedConversationId = id;

    this.api.getMessage(id).subscribe({
      next: (response) => {
        console.log(response);
        this.messages = response.data.message;
        this.messages.forEach((message) => {
          message.timestamp = new Date(message.timestamp);
        });

        this.messages.sort((a: Message, b: Message) => {
          return +new Date(a.timestamp) - +new Date(b.timestamp);
        });
        console.log(this.messages);
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
      next: (response) => {
        console.log(response);
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
