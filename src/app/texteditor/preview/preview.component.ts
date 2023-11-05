import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { QuillModule } from 'ngx-quill';
import { Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss'],
  standalone : true,
  imports : [FormsModule,IonicModule,QuillModule,CommonModule]
})
export class PreviewComponent  implements OnInit {
  @Input() data! : any;
  constructor(private modalCtrl : ModalController) { }

  ngOnInit() {
  }
  dismiss(){
    this.modalCtrl.dismiss();
  }
}
