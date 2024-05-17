import { Component, OnInit } from '@angular/core';
import { EntityService } from 'src/app/services/entity.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { WebNotificationService } from 'src/app/services/web-notification.service';
import { NotificationMode } from 'src/app/models/notification-mode';


@Component({
  selector: 'app-filtre-product',
  templateUrl: './filtre-product.component.html',
  styleUrls: ['./filtre-product.component.scss']
})
export class FiltreProductComponent {


  categoryId: any;
  public forLoop: number[];
  products: any;
  isloading = false;
  user: any;
  datas: any = [];
  message = ""
  api : String = environment.apiUrl_BACKOFFICE + 'public/images/'

  constructor(private entityService: EntityService, private route: ActivatedRoute, private cookie:CookieService,
    private router: Router,private notificationService: WebNotificationService) {
      this.forLoop = Array.from({length: 12}, (_, i) => i + 1);
    }


  async ngOnInit(){
    this.route.params.subscribe(params => {
      this.categoryId = params['id'];
      console.log(this.categoryId);
    });

    try {
      this.products = await this.entityService.getProductByCategory(this.categoryId).toPromise();
      if (this.products.length != 0) {
        console.log(this.products);
        this.datas = this.products
        this.isloading = true;
      }
      else{
        this.message = "Aucun produit trouvé."
        this.getDatasByPage()
      }
    } catch (error) {
      console.log(error);
    }
  }

  getDatasByPage(){

    this.entityService.getDatasByPage("product", 1, 20).subscribe({
      next: (data: any) => {
        if (data) {
          this.datas = data;
          this.isloading = true
          console.log(this.datas)
        }
      }, error: (err: any) => {
        console.log(err)
      }
    });

  }

  addFavorite(id: any) {
    this.user = this.cookie.get("user");
    console.log(this.user);


    console.log(JSON.parse(this.user));

    if (this.user || this.user.length != 0){
        let userObj = JSON.parse(this.user);
        if (userObj.favorite.includes(id)) {
            userObj.favorite = userObj.favorite.filter((favId: any) => favId !== id);
        } else {
          userObj.favorite.push(id);
          console.log("Item added to favorites:", id);
        }

        this.cookie.set("user",JSON.stringify(userObj));
        this.entityService.updateUser(userObj, userObj._id).subscribe({
          next: (data: any)=>{
            if(data){
              console.log(data);
            }
          }
        })
    }
    else{
      this.router.navigate(['/login']);
            return;
    }
  }


addCart(id:any){

  this.user = this.cookie.get("user");
    console.log(this.user);


    console.log(JSON.parse(this.user));

    if (this.user || this.user.length != 0) {
        let userObj = JSON.parse(this.user);
        if (userObj.cart.includes(id)) {
            userObj.cart = userObj.cart.filter((favId: any) => favId !== id);
        } else {
          userObj.cart.push(id);
          console.log("Item added to carts:", id);
        }

        this.cookie.set("user",JSON.stringify(userObj));
        this.entityService.updateUser(userObj, userObj._id).subscribe({
          next: (data: any)=>{
            if(data){
              console.log(data);
            }
          }
        })
    }
    else{
      this.router.navigate(['/login']);
            return;
    }
  }



}
