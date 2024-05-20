// import { Component, Input, OnInit, inject } from '@angular/core';
// import { IonicModule } from '@ionic/angular';
// import { CommonModule } from '@angular/common';
// import { AuthService } from '../Services/Authentication/auth.service';
// import { RouterModule } from '@angular/router';
// import { ChatService } from '../chat/chat.service';

// @Component({
//   selector: 'app-menu',
//   templateUrl: './menu.component.html',
//   styleUrls: ['./menu.component.scss'],
//   standalone: true,
//   imports: [IonicModule, CommonModule, RouterModule],
// })
// export class MenuComponent implements OnInit {
//   authService: AuthService = inject(AuthService);

//   @Input() persons!: Conversation;

//   // public persons = [
//   //   { Name: 'Home', icon: 'person' },
//   //   { Name: 'My Blogs', icon: 'person' },
//   //   { Name: 'Chats', icon: 'person' },
//   //   { Name: 'Profile', icon: 'person' },
//   //   { Name: 'Trash', icon: 'person' },
//   // ];

//   constructor(private chatService: ChatService) {

//   }

//   ngOnInit() {}
// }

// interface Conversation {
//   conversationId: string;
//   conversationType: string;
//   conversationName: string | null;
//   createdAt: string;
//   participants: Participant[];
// }

// interface Participant {
//   userId: string;
//   User: User;
// }

// interface User {
//   firstName: string;
//   lastName: string;
// }