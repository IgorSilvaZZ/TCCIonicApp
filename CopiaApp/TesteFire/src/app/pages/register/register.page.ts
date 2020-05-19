import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController, LoadingController, AlertController, ActionSheetController } from '@ionic/angular';
import { AcessProviders } from '../../providers/acess-providers';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  name: string = "";
  email:string = "";
  password: string = "";
  sexo: string = "";
  dataNasc : string = "";
  cameraData: string;
  base64Image: string;


  disableButton;

  constructor(private router: Router, private toastCtrl: ToastController, private loadingCtrl: LoadingController, private alertCtrl: AlertController, private acssPvrs: AcessProviders, private camera: Camera, public actionSheetController: ActionSheetController) { }

  ionViewDidEnter(){
    this.disableButton = false;
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


  async tryRegister(){
    if(this.name == ""){
      this.presentToast("Insira seu nome");
    }else if(this.email == ""){
      this.presentToast("Insira o Nome de Usuario");
    }else if(this.sexo == ""){
      this.presentToast("Insira o Sexo");
    }else if(this.password == ""){
      this.presentToast("Insira a Senha");
    }else if(this.dataNasc == ""){
      this.presentToast("Insira a Data de Nascimento");
    }else{
      this.disableButton = true;
      const loader = await this.loadingCtrl.create({
        message: "Por favor Espere....",
      });
      loader.present();

      return new Promise(resolve => {
        let body = {
          aski: 'proses_register',
          name: this.name,
          email: this.email,
          sexo: this.sexo,
          dataNasc: this.dataNasc,
          password: this.password,
        }

        this.acssPvrs.postData(body,'proses_api.php').subscribe((res:any)=>{
          if(res.sucess==true){
            loader.dismiss();
            this.disableButton = false;
            this.presentToast(res.msg);
            this.router.navigate(['/login']);
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
          this.tryRegister();
          }
        }
      ]
    });

    await alert.present();
  }

  ngOnInit() {
  }

}
