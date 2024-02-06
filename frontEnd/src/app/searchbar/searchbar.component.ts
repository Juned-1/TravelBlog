import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { IonSearchbar } from '@ionic/angular'; // Import IonSearchbar from the correct module
import { SearchParameter } from 'src/DataTypes';
import { Router, ActivatedRoute } from '@angular/router';
import { APIService } from 'src/apiservice.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class SearchbarComponent{
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: APIService,
    private sanitizer: DomSanitizer
  ) {}
  onSearch(searchTerm: any) {
    // Do something with the search term
    const val = searchTerm.target.value;
    console.log(val);
    let parameter : SearchParameter = {
      page : 1,
      title : 'Test P',
      //subtitle : 'W'
    };
    this.api.searchUserPost(parameter).subscribe((respnse) => {
      console.log(respnse);
    }, 
    (err) => {
      console.log(err);
    })
  }
}
