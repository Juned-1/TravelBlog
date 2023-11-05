import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SearchbarComponent } from '../searchbar/searchbar.component';
import { MatToolbarModule } from '@angular/material/toolbar';
@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  standalone : true,
  imports : [IonicModule, SearchbarComponent, MatToolbarModule]
})
export class ToolbarComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
