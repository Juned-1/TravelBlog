import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
})
export class ChatComponent implements OnInit{
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
  editorMsg:string='';
  // messages!: Message[];
  // conversationId: string = '';
  // receiverFullName: string = '';
  // receiverId;

ngOnInit(){
  // this.id = this.route.snapshot.queryParams['id'];

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

    this.persons.forEach(person => {
      if(person.name===this.selectedPerson.name){
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
