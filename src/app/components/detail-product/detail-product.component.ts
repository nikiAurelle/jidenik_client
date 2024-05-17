import { Component, OnInit } from '@angular/core';
import { EntityService } from 'src/app/services/entity.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { WebNotificationService } from 'src/app/services/web-notification.service';
import { NotificationMode } from 'src/app/models/notification-mode';

@Component({
  selector: 'app-detail-product',
  templateUrl: './detail-product.component.html',
  styleUrls: ['./detail-product.component.scss']
})
export class DetailProductComponent implements OnInit {

  productId: any;
  product: any;
  api: string = environment.apiUrl_BACKOFFICE + 'public/images/';
  isloading = false;
  user: any;

  constructor(private entityService: EntityService, private route: ActivatedRoute, private cookie:CookieService,
    private router: Router,private notificationService: WebNotificationService) {}

  async ngOnInit() {
    this.route.params.subscribe(params => {
      this.productId = params['id'];
      console.log(this.productId);
    });

    try {
      this.product = await this.entityService.getDatasById("product", this.productId).toPromise();
      if (this.product) {
        console.log(this.product);
        this.isloading = true;
      }
    } catch (error) {
      console.log(error);
    }
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
              const notif = new NotificationMode()
              const message = "Le produit à été ajouté aux favoris avec succès."
              const status = "succès"
              this.notificationService.emitNotification({message, status})

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
              const notif = new NotificationMode()
              const message = "Le produit à été ajouté aux panier avec succès."
              const status = "succès"
              this.notificationService.emitNotification({message, status})
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



