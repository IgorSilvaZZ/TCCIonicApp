import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController, LoadingController, AlertController, NavController,ActionSheetController} from '@ionic/angular';
import { AcessProviders } from '../../providers/acess-providers';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Storage } from '@ionic/storage'
@Component({
  selector: 'app-crud',
  templateUrl: './crud.page.html',
  styleUrls: ['./crud.page.scss'],
})
export class CrudPage implements OnInit {

  datastorage: any;
  id : number;
  name: string = "";
  email:string = "";
  password: string = "";
  sexo: string = "";
  dataNasc : string = "";
  image: string = "";
  foto: string = "";
  cameraData: string = null;
  base64Image: string;

  disableButton;

  constructor(private router: Router, private toastCtrl: ToastController, private loadingCtrl: LoadingController, private alertCtrl: AlertController, private acssPvrs: AcessProviders, private storage: Storage, public navCtrl: NavController,private camera: Camera,public actionSheetController: ActionSheetController,private actRoute :ActivatedRoute) { 

    /* this.storage.get('store_xxx').then((res)=>{
      console.log(res);
      this.datastorage = res;
      this.nome = this.datastorage.nomeUsuario;
      this.email = this.datastorage.emailUsuario;
      this.image = this.datastorage.fotoUsuario;
    }); */

  }

  ngOnInit() {
    this.actRoute.params.subscribe((data: any)=>{
      console.log(data);
      this.id = data.id;

      if(this.id!=0){
        this.loadUser();
      }

    });
  }

  OpenCamera(){

    const options: CameraOptions = {
      quality: 100,
      targetWidth: 150,
      targetHeight: 150,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    
    this.camera.getPicture(options).then((imageData) => {
      this.cameraData = imageData;
      this.base64Image = 'data:image/jpeg;base64,' + imageData;
      this.foto = this.base64Image;
    }, (err) => {
      console.log(err);
    });

  }


  OpenGallery(){

    const options: CameraOptions = {
      quality: 100,
      targetWidth: 150,
      targetHeight: 150,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    
    this.camera.getPicture(options).then((imageData) => {
      this.cameraData = imageData;
      this.base64Image = 'data:image/jpeg;base64,' + imageData;
      this.foto = this.base64Image;

    }, (err) => {
      console.log(err);
    });

  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Escolha a Midia',
      buttons: [{
        text: 'Camera',
        icon: 'camera',
        handler: () => {
          this.OpenCamera();
        }
      }, {
        text: 'Abrir Galeria',
        icon: 'image',
        handler: () => {
          this.OpenGallery();
        }
      }]
    });
    await actionSheet.present();
  }

  loadUser(){

    return new Promise(resolve => {
      let body = {
        aski: 'dados_apenas',
        id: this.id
      }

      this.acssPvrs.postData(body,'proses_api.php').subscribe((res:any)=>{
        this.name = res.result.nomeUsuario;
        this.email = res.result.emailUsuario;
        this.sexo = res.result.sexoUsuario;
        this.dataNasc = res.result.dataNascUsuario;
        this.image = res.result.fotoUsuario;
        this.foto = "http://192.168.0.19/CopiaApp/TesteFire/api/"+this.image;
      });

    });

  }

  async CrudAction(){
    if(this.name == ""){
      this.presentToast("Insira seu nome");
    }else if(this.email == ""){
      this.presentToast("Insira o Nome de Usuario");
    }else if(this.sexo == ""){
      this.presentToast("Insira o Sexo");
    /* }else if(this.password == ""){
      this.presentToast("Insira a Senha");
     */}else if(this.dataNasc == ""){
      this.presentToast("Insira a Data de Nascimento");
    }else{
      this.disableButton = true;
      const loader = await this.loadingCtrl.create({
        message: "Por favor Espere....",
      });
      loader.present();

      return new Promise(resolve => {
        let body = {
          aski: 'proses_update',
          id: this.id,
          name: this.name,
          email: this.email,
          sexo: this.sexo,
          dataNasc: this.dataNasc,
          images: this.cameraData
        }

        this.acssPvrs.postData(body,'proses_api.php').subscribe((res:any)=>{
          if(res.sucess==true){
            loader.dismiss();
            this.disableButton = false;
            this.presentToast(res.msg);
            this.router.navigate(['/home']);
          }else{
            loader.dismiss();
            this.disableButton = false;
            this.presentToast(res.msg);
            /* console.log(body); */
          }
        },(err)=>{
          console.log(err);
          loader.dismiss();
          this.disableButton = false;
          this.presentAlert('Timeout');
          }

        );

      });

    }
  }

  async presentToast(a){
    const toast = await this.toastCtrl.create({
      message: a,
      duration: 1500,
      position: "top"
    })
    toast.present();
  }

  async presentAlert(a) {
    const alert = await this.alertCtrl.create({
      header: a,
      backdropDismiss: false,
      buttons: [
        {
          text: 'Close',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Tente de Novo',
          handler: () => {
          this.CrudAction();
          }
        }
      ]
    });

    await alert.present();
  }

  BackHome(){
    this.router.navigate(['/home/']);
  }

}
