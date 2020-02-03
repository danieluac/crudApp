import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController,LoadingController,AlertController, NavController } from '@ionic/angular';
import { AccessProviders } from './../../providers/access-providers';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  your_name : string = "";
  gender : string = "";
  email_address : string = "";
  bday_date : string = "";
  password : string = "";
  confirm_pass : string = "";
  disableButton;
  constructor(
    private router : Router,
    private toastCtrl : ToastController,
    private loadingtCtrl : LoadingController,
    private alertCtrl : AlertController,
    private navCtrl : NavController,
    private accessProviders : AccessProviders,
  ) { }

  ngOnInit() {
  }
  backlogin(){
    this.navCtrl.back();
  }
  ionViewDidEnter(){
   this.disableButton = false;
  }
  async tryRegister()
  {
    if(this.your_name == "")
    {
      this.presentToast("Your name is needed...");
    }else if(this.gender == "" ){
      this.presentToast("Your gender is needed...")
    }else if(this.email_address == "" ){
      this.presentToast("email address is needed...")
    }else if(this.bday_date == "" ){
      this.presentToast("birthday is needed...")
    }else if(this.password == "" ){
      this.presentToast("password is needed...")
    }else if(this.password != this.confirm_pass){
      this.presentToast("Confirm password is not the same...")
    }else {
        this.disableButton = true;
        const loader = await this.loadingtCtrl.create({
          message: "please wait..."
        });
        loader.present();
      return new Promise(resolve =>{
        let body = {
          aksi : 'proses_register',
          your_name : this.your_name,
          your_email : this.email_address,
          your_bday : this.bday_date,
          your_gender : this.gender,
          your_password : this.password,
        }
        this.accessProviders.postData(body, "register").subscribe((res:any) =>{
          if(res.success == true ){
            this.disableButton = false;
            loader.dismiss();
            this.presentToast(res.sms);
            this.router.navigate(["/login"]);
          }else{
            this.disableButton = false;
            loader.dismiss();
            this.presentToast(res.sms);
          }
        }, (error:any)=>{
          this.disableButton = false;
          loader.dismiss();
          this.presentAlert("Time is out ");
        })
      });

    }

  }
  async presentAlert(sms) {

    const alert = await this.alertCtrl.create({
      header: sms,
      message: sms,
      backdropDismiss: false,
      buttons: [
        {
          text: 'Close',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Try again',
          handler: () => {
            this.tryRegister();
          }
        }
      ]
    });

    await alert.present();
  }
  async presentToast(sms)
  {
    const toast = await this.toastCtrl.create({
      message: sms,
      duration: 1500,
      position:'top',
    });
    toast.present();
  }

}
