import { Component, EnvironmentInjector, OnInit, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { MenuComponent } from './menu/menu.component';
import { CommentsModule } from './comments/comments.module';
import {
  SocialAuthService,
  SocialLoginModule,
  SocialUser,
} from '@abacritt/angularx-social-login';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  providers: [],
  imports: [
    IonicModule,
    CommonModule,
    ToolbarComponent,
    MenuComponent,
    CommentsModule,
    SocialLoginModule,
  ],
})
export class AppComponent {
  public environmentInjector = inject(EnvironmentInjector);



  constructor() {}

  
}
