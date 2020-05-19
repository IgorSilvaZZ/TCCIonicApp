import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController, LoadingController, AlertController, NavController} from '@ionic/angular';
import { AcessProviders } from '../../providers/acess-providers';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email:string = "";
  password: string = "";

  disableButton;

  constructor(private router: Router, private toastCtrl: ToastController, private loadingCtrl: LoadingController, private alertCtrl: AlertController, private acssPvrs: AcessProviders, private storage: Storage, public navCtrl: NavController) { }

  ngOnInit() {
  }

  ionViewDidEnter(){
    this.disableButton = false;
  }

  openRegister(){
    this.router.navigate(['/register']);
  }

  async tryLogin(){
    if(this.email == ""){
      this.presentToast('Insira seu Email');
    }else if(this.password == ""){
      this.presentToast('Insira a Senha');
    }else{
      this.disableButton = true;
      const loader = await this.loadingCtrl.create({
        message: "Por favor Espere....",
      });
      loader.present();

      return new Promise(resolve => {
        let body = {
          aski: 'proses_login',
          email: this.email,
          password: this.password
        }

        this.acssPvrs.postData(body,'proses_api.php').subscribe((res:any)=>{
          if(res.sucess==true){
            loader.dismiss();
            this.disableButton = false;
            this.presentToast('Logado com Sucesso');
            this.storage.set('store_xxx',res.result); //Criando storage sessao
            this.navCtrl.navigateRoot(['/home']);
          }else{
            loader.dismiss();
            this.disableButton = false;
            this.presentToast('Email ou Senha Inválidos');
          }
        },(err)=>{
          loader.dismiss();
          this.disableButton = false;
          this.presentToast('Timeout');
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

}
