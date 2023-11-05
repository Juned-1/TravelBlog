import { Component, EnvironmentInjector, OnInit, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { SignupComponent } from './signup/signup.component';
import { HomePage } from './home/home.page';
import { RouterModule,ActivatedRoute,Router } from '@angular/router';
import { SearchbarComponent } from './searchbar/searchbar.component';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    SignupComponent,
    HomePage,
    RouterModule,
    SearchbarComponent,
    MatToolbarModule,
  ],
})
export class AppComponent implements OnInit{
  public environmentInjector = inject(EnvironmentInjector);

  constructor(private route : ActivatedRoute, private router : Router) {}
  ngOnInit(): void {
    //console.log(this.router.url);
  }
}
