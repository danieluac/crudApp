import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController,LoadingController,AlertController, NavController } from '@ionic/angular';
import { AccessProviders } from './../../providers/access-providers';

@Component({
  selector: 'app-crud',
  templateUrl: './crud.page.html',
  styleUrls: ['./crud.page.scss'],
})
export class CrudPage implements OnInit {
  id : number;
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
    private actRoute : ActivatedRoute,
    private accessProviders : AccessProviders,
  ) { }

  ngOnInit() {
    this.actRoute.params.subscribe((data)=> {
     // console.log(data);
      this.id = data.id;
      if(this.id != 0)
        this.loadUser();

    })
  }
  backHome(){
    this.navCtrl.back();
  }
  ionViewDidEnter(){
    this.disableButton = false;
   }
   loadUser(){
    return new Promise(resolve =>{
      let body = {
        aksi : 'proses_load_user',
        your_id : this.id,
      }
      this.accessProviders.postData(body,"loadUser").subscribe((res:any) =>{
        if(res.success == true ){
         this.your_name = res.result.name;
         this.email_address = res.result.email;
         this.bday_date = res.result.bday;
         this.gender = res.result.gender;
        }else{
          
        }
      })
    });
   }
   async  crudAction(action)
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
     }else if(this.password == "" && this.id== 0 ){
       this.presentToast("password is needed...")
     }else if(this.password != this.confirm_pass && this.id== 0 ){
       this.presentToast("Confirm password is not the same...")
     }else {
         this.disableButton = true;
         const loader = await this.loadingtCtrl.create({
           message: "please wait..."
         });
         loader.present();
       return new Promise(resolve =>{
         let body = {
           aksi : 'proses_register_or_update',
           your_id : this.id,
           your_name : this.your_name,
           your_email : this.email_address,
           your_bday : this.bday_date,
           your_gender : this.gender,
           your_password : this.password,
         }
         this.accessProviders.postData(body, action).subscribe((res:any) =>{
           if(res.success == true ){
             this.disableButton = false;
             loader.dismiss();
             this.presentToast(action + res.sms);
             this.router.navigate(["/home"]);
           }else{
             this.disableButton = false;
             loader.dismiss();
             this.presentAlert(res.sms, action);
           }
         }, (error:any)=>{
           this.disableButton = false;
           loader.dismiss();
           this.presentAlert("Time is out ", action);
         })
       });
 
     }
 
   }
   async presentAlert(sms, action) {
 
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
             this.crudAction(action);
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
