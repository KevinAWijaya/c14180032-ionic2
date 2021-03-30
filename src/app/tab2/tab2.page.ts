import { Component } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FotoService } from '../services/foto.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  urlImageStorage : string[] = [];
  nameImage : string[] = [];

  constructor(public FotoService:FotoService, private afStorage : AngularFireStorage,) {}

  async ngOnInit(){
    await this.FotoService.loadFoto();
  }

  async ionViewDidEnter(){
    await this.FotoService.loadFoto();
    this.tampilkanData();

  }

  tambahFoto(){
    this.FotoService.tambahFoto();
  }
  hapusFoto(){
    var refImage = this.afStorage.storage.ref('imgStorage');
    refImage.listAll()
      .then((res) =>{
        res.items.forEach((itemRef) => {
          itemRef.delete().then(()=>{
            // menampilkan data
            this.tampilkanData();
          });
        });
      }).catch((error) =>{
        console.log(error);
      });
  }

  tampilkanData(){
    this.urlImageStorage=[];  
    var refImage = this.afStorage.storage.ref('imgStorage');
    refImage.listAll()
      .then((res) =>{
        res.items.forEach((itemRef) => {
          itemRef.getDownloadURL().then(url => {
            this.urlImageStorage.unshift(url);
          })
         
        });
      }).catch((error) =>{
        console.log(error);
      });
  }

  uploadFoto(){
    this.urlImageStorage=[];
    for (var index in this.FotoService.dataFoto){
      const imgFilePath = "imgStorage/"+this.FotoService.dataFoto[index].filePath;
      
      this.afStorage.upload(imgFilePath, this.FotoService.dataFoto[index].dataImage).then(() => { // sudah upload lalu mau ambil url file yang sudah di uplaod
        this.afStorage.storage.ref().child(imgFilePath).getDownloadURL().then((url) => {
          this.urlImageStorage.unshift(url);
        });
      });
    }
    

  }

}

