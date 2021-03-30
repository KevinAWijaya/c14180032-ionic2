import { Injectable } from '@angular/core';
import { CameraPhoto, CameraResultType, CameraSource, Capacitor, FilesystemDirectory, Plugins } from '@capacitor/core';
import { Platform } from '@ionic/angular';

const { Camera, Filesystem, Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class FotoService {

  public dataFoto : Photo[] = [];
  private keyFoto : string = "foto";  
  private platform : Platform;

  constructor(platform : Platform) {
    this.platform = platform;
   }

  public async tambahFoto(){
    const foto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source : CameraSource.Camera,
      quality : 100
    });
    console.log(foto);

    const fileFoto = await this.simpanFoto(foto);

    this.dataFoto.unshift(fileFoto);

    Storage.set({
      key : this.keyFoto,
      value : JSON.stringify(this.dataFoto)
    })
    Storage.clear();
  }


  public async simpanFoto(foto: CameraPhoto){
    const base64Data = await this.readAsBase64(foto);

    const namaFile = new Date().getTime()+".png";
    const simpanFile = await Filesystem.writeFile({
      path : namaFile,
      data : base64Data,
      directory  : FilesystemDirectory.Data
    });

    const response = await fetch(foto.webPath);
    const blob = await response.blob();
    const dataFoto = new File([blob], foto.path, {
      type: "image/png"
    });

    console.log(simpanFile.uri)

    if (this.platform.is('hybrid')){
      return {
        filePath : simpanFile.uri,
        webViewPath : Capacitor.convertFileSrc(simpanFile.uri),
        dataImage : dataFoto 
      }
    }else{
      return {
        filePath : namaFile,
        webViewPath : foto.webPath,
        dataImage : dataFoto
      }
    }
  }


  private async readAsBase64(foto: CameraPhoto){
    if (this.platform.is('hybrid')){
      const file = await Filesystem.readFile({
        path: foto.path
      })
      
      return file.data;
    } else{
    const response = await fetch(foto.webPath);
    const blob = await response.blob();

    return await this.convertBlobToBase64(blob) as string
    }
  }


  convertBlobToBase64 = (blob: Blob) => new Promise((resolve,reject) => {
    const reader = new FileReader;
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result)
    };
    reader.readAsDataURL(blob);
  })

  public async loadFoto(){
    const listFoto = await Storage.get({key : this.keyFoto});
    this.dataFoto = JSON.parse(listFoto.value) || [];

    if (this.platform.is ('hybrid')){
      for (let foto of this.dataFoto) {
        const readFile = await Filesystem.readFile({
          path : foto.filePath,
          directory : FilesystemDirectory.Data
        });
        foto.webViewPath = `data:image/png;base64,${readFile.data}`

        const response = await fetch(foto.webViewPath);
        const blob = await response.blob();

        foto.dataImage = new File([blob], foto.filePath,{
          type: "image/png"
        });

      }
    }
  }

}




export interface Photo{
  filePath : string;
  webViewPath : string;
  dataImage : File;
}