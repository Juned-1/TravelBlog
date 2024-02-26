import { Component, OnInit, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { AuthService } from '../Services/Authentication/auth.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule],
})
export class MenuComponent implements OnInit {
  authService: AuthService = inject(AuthService);

  public appPages = [
    { title: 'Home', url: '/', icon: 'home' },
    { title: 'My Blogs', url: '/userblog', icon: 'paper-plane' },
    { title: 'Profile', url: '/profile', icon: 'person' },
    { title: 'Trash', url: '/trash', icon: 'trash' },
  ];

  constructor() {}

  ngOnInit() {}
}
