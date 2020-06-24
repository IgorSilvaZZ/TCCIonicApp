import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController, LoadingController, AlertController, NavController,ActionSheetController} from '@ionic/angular';
import { AcessProviders } from '../../providers/acess-providers';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Storage } from '@ionic/storage'
@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.page.html',
  styleUrls: ['./favoritos.page.scss'],
})
export class FavoritosPage implements OnInit {

  constructor(private router: Router, private toastCtrl: ToastController, private loadingCtrl: LoadingController, private alertCtrl: AlertController, private acssPvrs: AcessProviders, private storage: Storage, public navCtrl: NavController,private camera: Camera,public actionSheetController: ActionSheetController,private actRoute :ActivatedRoute) { }

  id: number;

  ngOnInit() {
    /* this.actRoute.params.subscribe((data: any)=>{
      console.log(data);
      this.id = data.id;

      if(this.id!=0){
        this.loadUser();
      }

    }); */

  }

}
