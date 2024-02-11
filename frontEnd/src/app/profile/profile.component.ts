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
//import moment from "moment";
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
  formData: userDetails = {
    firstName: '',
    lastName: '',
    gender: '',
    dob: '',
    email: '',
    // password: '',
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: APIService,
    private sanitizer: DomSanitizer,
    private toast: ToastrService
  ) {}

  ngOnInit() {
    this.api.getUserDetails().subscribe(
      (response) => {
        console.log(response);
        if (
          'status' in response &&
          response.status === 'success' &&
          'data' in response
        ) {
          this.formData = (response.data as data).userDetails as userDetails;
          //this.formData.dob = moment(this.formData.dob).utc().format('YYYY-MM-DD')
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  makeChanges() {
    console.log("hello");
    this.api.setUserDetails(this.formData).subscribe(
      (response) => {
        console.log(response);
        if ('status' in response && response.status === 'success') {
          this.toast.success('Profile Edited successfully');
          this.router.navigate(['/profile']);
        }
      },
      (err) => {
        this.toast.error('Profile Edit unsuccessful');
        console.log(err);
      }
    );
  }
}

interface userDetails {
  firstName: string;
  lastName: string;
  dob: string;
  gender: string;
  email: string;
  // password: string;
}
interface data {
  userDetails;
}
