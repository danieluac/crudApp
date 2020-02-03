import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController,LoadingController,AlertController, NavController } from '@ionic/angular';
import { AccessProviders } from './../../providers/access-providers';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  dataStorage : any;
  name : string = "";
  users : any = [];
  limit : number = 13;
  start : number = 0;
  constructor(
    private router : Router,
    private toastCtrl : ToastController,
    private loadingtCtrl : LoadingController,
    private alertCtrl : AlertController,
    private navCtrl : NavController,
    private storage : Storage,
    private accessProviders : AccessProviders,
  ) { }
  ngOnInit() {}

  ionViewDidEnter(){
    this.storage.get("storage_xxx").then(res => {
      console.log(res);
      this.dataStorage = res;
      this.name = res.name;
      this.start = 0;
      this.users = [];
      this.loadUsers();
    })
   }
   async doRefresh(event){
    const loader = await this.loadingtCtrl.create({
      message: "Refreshing..."
    });
    loader.present();
     this.ionViewDidEnter();
     event.target.complete();
     loader.dismiss();
   }
   loadData(event){
     this.start += this.limit;
     setTimeout( () => {
       this.loadUsers().then(()=> {
         event.target.complete();
       });
     }, 5000);
   }
   async delData(user_id){
    return new Promise(resolve =>{
      let body = {
        aksi : 'load_users',
        user_id : user_id,
      }
      this.accessProviders.postData(body, "deleteData").subscribe((res:any) =>{
        if(res.success == true)
        {
          this.presentToast(res.sms);
          this.ionViewDidEnter();
        }else {
          this.presentToast(res.sms);
        }
      })
    });
   } 
  async loadUsers()
  {
      return new Promise(resolve =>{
        let body = {
          aksi : 'load_users',
          start : this.start,
          limit : this.limit,
        }
        this.accessProviders.postData(body, "loadData").subscribe((res:any) =>{
          for( let datas of res.result)
          {
            this.users.push(datas);
          }
          resolve(true);
        })
      });
  }
  openCrud(param)
  {
    this.router.navigate(["crud/"+param])
  }
  async processLogOut() {
    this.storage.clear();
    this.navCtrl.navigateRoot(["/intro"])
    this.presentToast("log out successfuly");
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
