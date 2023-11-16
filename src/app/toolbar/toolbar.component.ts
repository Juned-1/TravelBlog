import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { SearchbarComponent } from '../searchbar/searchbar.component';
import { MatToolbarModule } from '@angular/material/toolbar';
<<<<<<< HEAD
import { ActivatedRoute, Router } from '@angular/router';
import { APIService } from 'src/apiservice.service';
import { Subject } from "rxjs";
=======
import { Router } from '@angular/router';
import { LoginService } from '../login.service';
import { CommonModule } from '@angular/common';

>>>>>>> origin
@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
<<<<<<< HEAD
  standalone : true,
  imports : [IonicModule, SearchbarComponent, MatToolbarModule,CommonModule]
})
export class ToolbarComponent  implements OnInit {
  @Input() isLoggedIn! : Boolean;
  @Output() logoutButton : EventEmitter<string> = new EventEmitter<string>();
  constructor(private route : ActivatedRoute, private router : Router, private api : APIService) { }

  ngOnInit() {}
  LogIn(){
    this.router.navigate(['/login']);
  }
  Logout(){
    this.logoutButton.emit('logout');
    // this.api.logout().subscribe(
    //   (response) => {
    //     console.log(response);
    //   },
    //   (err) => {
    //     console.log(err.error.message);
    //   }
    // )
  }
}
=======
  standalone: true,
  imports: [IonicModule, SearchbarComponent, MatToolbarModule, CommonModule],
})
export class ToolbarComponent implements OnInit {
  constructor(private router: Router, public loginService: LoginService) {}

  ngOnInit() {}

  logout() {
    this.loginService.loggedIn = false;
    this.router.navigate(['/login']);
  }
}
>>>>>>> origin
