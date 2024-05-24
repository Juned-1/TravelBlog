import { Component, EnvironmentInjector, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { CommentsModule } from './comments/comments.module';
import { SocialLoginModule } from '@abacritt/angularx-social-login';


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
    CommentsModule,
    SocialLoginModule,
  ],
})
export class AppComponent {
  public environmentInjector = inject(EnvironmentInjector);

  constructor() {
  }
}
