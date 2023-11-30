import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { IonSearchbar } from '@ionic/angular'; // Import IonSearchbar from the correct module
@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.scss'],
  standalone : true,
  imports : [IonicModule],
})
export class SearchbarComponent {
  constructor(){

  }
  onSearch(searchTerm: any) {
    // Do something with the search term
    const val = searchTerm.target.value;
    console.log(val);
  }
}
