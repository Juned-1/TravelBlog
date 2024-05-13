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
  persons = [
    {
      name: 'Person 1',
      messages: [
        {
          message: 'Hi',
          userIsSender: true,
          createdAt: new Date(),
        },
        {
          message: 'Hello',
          userIsSender: false,
          createdAt: new Date(),
        },
      ],
    },
    {
      name: 'Person 2',
      messages: [
        {
          message: 'How are you',
          userIsSender: true,
          createdAt: new Date(),
        },
        {
          message: 'I am good',
          userIsSender: false,
          createdAt: new Date(),
        },
      ],
    },
  ];
  selectedPerson: any = null;
  @ViewChild('content', { static: true }) private content: any;
  @ViewChild('chatInput', { static: true }) messageInput!: ElementRef;
  editorMsg: string = '';
  id: string | null = null;
  conversations: any[] = [];
  // messages!: Message[];
  // conversationId: string = '';
  // receiverFullName: string = '';
  // receiverId;
  constructor(private api: APIService, private route: ActivatedRoute) {}
  ngOnInit() {
    this.id = this.route.snapshot.queryParams['id'];

    // this.api.createIndividualConversation({recepientId: this.id}).subscribe(
    //   (response)=>{
    //     console.log(response);
    //   },
    //   (error)=>{
    //     console.log(error);
    //   }
    // );

    console.log(this.id);
    this.api.getAllConversation().subscribe(
      (response) => {
        console.log(response);
        if (response.status === 'success') {
          this.conversations = response.data.conversation;
          console.log('All conversations:', this.conversations);

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

  selectPerson(person: any) {
    this.selectedPerson = person;
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

    const message = {
      message: this.editorMsg,
      userIsSender: true,
      createdAt: new Date(),
    };

    this.editorMsg = '';
    this.onFocus();

    console.log(this.selectedPerson);

    this.persons.forEach((person) => {
      if (person.name === this.selectedPerson.name) {
        person.messages.push(message);
      }
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
