import { Component } from '@angular/core';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  constructor() {}

  angka;

  min = Math.ceil(1);
  max = Math.floor(10);
  angkaRandom = Math.floor(Math.random() * (this.max - this.min) + this.min)

  muncul = false;

  submitAngka(){
    this.angka = Number(this.angka)
    if (this.angka == this.angkaRandom){
      this.muncul = true;
    }
  }

}
