import { AfterViewInit, Component, OnInit, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { SearchbarComponent } from '../searchbar/searchbar.component';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { Router, ActivatedRoute } from '@angular/router';
import { APIService } from 'src/apiservice.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
  imports: [
    ToolbarComponent,
    IonicModule,
    MatToolbarModule,
    CommonModule,
    ToolbarComponent,
    FormsModule,
  ],
})
export class ProfileComponent implements OnInit {
  isLoggedIn = true;
  formData = {
    firstName: 'Bikram',
    lastName: 'Upadhyaya',
    email: 'abc@gmail.com',
    password: 'qwerty@123',
    dob: '2022-01-16',
    gender: 'male',
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: APIService,
    private sanitizer: DomSanitizer,
    private toast: ToastrService
  ) {}

  ngOnInit() {

  }

  makeChanges(){

  }
}
