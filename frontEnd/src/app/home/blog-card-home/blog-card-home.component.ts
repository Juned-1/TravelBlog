import { Component, Input, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-blog-card-home',
  templateUrl: './blog-card-home.component.html',
  styleUrls: ['./blog-card-home.component.scss'],
  imports: [IonicModule, CommonModule],
  standalone: true,
})
export class BlogCardHomeComponent  implements OnInit {
  @Input() post:any;
  constructor() { }

  ngOnInit() {}

}
