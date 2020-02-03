import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController,LoadingController,AlertController, NavController } from '@ionic/angular';
import { AccessProviders } from './../../providers/access-providers';
import { Storage } from '@ionic/storage';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email_address : string = "";
  password : string = "";
  constructor(
    private router : Router,
    private toastCtrl : ToastController,
    private loadingtCtrl : LoadingController,
    private alertCtrl : AlertController,
    private navCtrl : NavController,
    private storage : Storage,
    private accessProviders : AccessProviders,
  ) { }

  ngOnInit() {
  }
  openRegister(){
    this.navCtrl.navigateRoot(["/register"]);
  }
  async tryLogin()
  {
    if(this.email_address == "" ){
      this.presentToast("email address is needed...")
    }else if(this.password == "" ){
      this.presentToast("password is needed...")
    }else {
        
        const loader = await this.loadingtCtrl.create({
          message: "please wait..."
        });
        loader.present();
      return new Promise(resolve =>{
        let body = {
          aksi : 'proses_login',
          your_email : this.email_address,
          your_password : this.password,
        }
        this.accessProviders.postData(body, "login").subscribe((res:any) =>{
          if(res.success == true ){
            
            loader.dismiss();
            this.presentToast("Login successfull");
            this.storage.set("storage_xxx",res.result);
            this.navCtrl.navigateRoot(["/home"]);
          }else{
            
            loader.dismiss();
            this.presentToast(res.sms);
          }
        }, (error:any)=>{
          
          loader.dismiss();
          this.presentToast("Time is out ");
        })
      });

    }

  }
  async presentToast(sms)
  {
    const toast = await this.toastCtrl.create({
      message: sms,
      duration: 1500,
      position:'bottom',
    });
    toast.present();
  }

}
