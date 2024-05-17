import { Component, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { AppComponent } from 'src/app/app.component';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { EntityService } from '../../services/entity.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent {
  lesProducts: any;
  public forLoop: number[];
  loading: Boolean = false;
  constructor(
    private http: HttpClient,
    private cookie: CookieService,
    private router: Router,
    private entityService: EntityService
  ) {
    this.forLoop = Array.from({ length: 12 }, (_, i) => i + 1);
  }

  @Input() favorite: any;
  @Input() productsbycategory: any;
  datas: any = [];
  isloading: Boolean = false;
  api: String = environment.apiUrl_BACKOFFICE + 'public/images/';
  user: any;

  userjson: any = {};
  colorfav: boolean = false;
  messageFavoris: any;

  ngOnInit() {
    this.user = this.cookie.get('user');
    if (this.user) this.userjson = JSON.parse(this.user);

    if (this.favorite) {
      this.entityService.getDatasByPage('product', 1, 20).subscribe({
        next: (data: any) => {
          if (data) {
            data.forEach((dat: any) => {
              if (this.favorite.includes(dat._id)) {
                this.datas.push(dat);
              }
            });
            this.isloading = true;
            console.log(this.datas);
            if (this.datas.length == 0) {
              this.messageFavoris = "vous n'avez aucun favoris.";
            }
          }
        },
        error: (err: any) => {
          console.log(err);
        },
      });
    } else {
      this.getDatasByPage();
    }
  }

  getDatasByPage() {
    this.entityService.getDatasByPage('product', 1, 20).subscribe({
      next: (data: any) => {
        if (data) {
          this.datas = data;
          this.isloading = true;
          console.log(this.datas);
        }
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  addFavorite(id: any) {
    this.user = this.cookie.get('user');
    console.log(this.user);

    let userObj: any;

    if (this.user || this.user.length != 0) {
      userObj = JSON.parse(this.user);
      if (userObj.favorite.includes(id)) {
        userObj.favorite = userObj.favorite.filter(
          (favId: any) => favId !== id
        );
        this.colorfav = true;
      } else {
        userObj.favorite.push(id);
        console.log('Item added to favorites:', id);
        this.colorfav = false;
      }

      // userObj.favorite.forEach((dat:any )=> {
      //   if(this.favorite.includes(dat._id)){
      //     this.datas.push(dat)
      //   }
      // });
      this.cookie.set('user', JSON.stringify(userObj));
      this.entityService.updateUser(userObj, userObj._id).subscribe({
        next: (data: any) => {
          if (data) {
            console.log(data);
          }
        },
      });
    } else {
      this.router.navigate(['/login']);
      return;
    }
  }

  addCart(id: any) {
    this.user = this.cookie.get('user');
    console.log(this.user);

    if (this.user || this.user.length != 0) {
      let userObj = JSON.parse(this.user);
      if (userObj.cart.includes(id)) {
        userObj.cart = userObj.cart.filter((favId: any) => favId !== id);
      } else {
        userObj.cart.push(id);
        console.log('Item added to carts:', id);
      }

      // this.datas = userObj.cart
      this.cookie.set('user', JSON.stringify(userObj));
      this.entityService.updateUser(userObj, userObj._id).subscribe({
        next: (data: any) => {
          if (data) {
            console.log(data);
          }
        },
      });
    } else {
      this.router.navigate(['/login']);
      return;
    }
  }

  // public FetchProducts()
  // {
  //     this.http.get<any>(environment.apiUrl_BACKOFFICE + "product").subscribe(request =>
  //     {
  //         let products = request.products;
  //         this.lesProducts = request.products;
  //         this.loading = true
  //       console.log(this.lesProducts)
  //         let user:any = this.Parse(this.cookie.get("user"));
  //       console.log(user)
  //         for (let i = 0; i < products.length; i++)
  //         {
  //             let product = products[i];
  //             let id = (document.getElementById("id"+i) as HTMLButtonElement);
  //             let id2 = (document.getElementById("2id"+i) as HTMLButtonElement);
  //             let name = (document.getElementById("name"+i) as HTMLTitleElement);
  //             let description = (document.getElementById("description"+i) as HTMLParagraphElement);
  //             let img = (document.getElementById("img"+i) as HTMLImageElement);
  //             let price = (document.getElementById("price"+i) as HTMLParagraphElement);

  //             id.value = product._id;
  //             id2.value = product._id;
  //             name.innerText = product.name;
  //             description.innerText = product.description;
  //             price.innerText = product.regular_price+"$";
  //             let cheminImage = environment.apiUrl_BACKOFFICE+"/public/images/"+product.imageUrls;
  //             img.src = cheminImage;

  //             if(user != null)
  //             {
  //                 if (user.favorite.includes(product._id))
  //                     {
  //                         id.className = "star-filled";
  //                     }

  //                 for (let i = 0; i < user.cart.length; i++)
  //                 {
  //                     if (user.cart[i]._id == product._id)
  //                     {
  //                         id2.innerText = "Retirer du panier";
  //                         break;
  //                     }
  //                 }
  //             }
  //         }
  //     },
  //     error =>
  //     {
  //         console.error("Une erreur s'est produite lors de la requête HTTP :", error);
  //         var msg = ((document.getElementById("message"))as HTMLParagraphElement);
  //         msg.className = "error"
  //         msg.innerHTML = "Problem loading the page. Node.js api server on port:3000 is probably offline. Look at console for more detail.";
  //     });
  // }

  // ngAfterViewInit()
  // {
  //     this.FetchProducts();
  // }

  // Favorite(event: any)
  // {
  //     let user:any = this.Parse(this.cookie.get("user"));
  //     if(user == null)
  //     {
  //         this.router.navigate(['/login']);
  //         return;
  //     }

  //     let star = event.target as HTMLButtonElement;
  //     if(star.className.toString().includes("filled"))
  //     {
  //         star.className = "star-icon";
  //     }
  //     else
  //     {
  //         star.className = "star-filled";
  //     }
  //     var favorite =
  //     {
  //         id: star.value
  //     };

  //     if(user.favorite.includes(favorite.id))
  //     {
  //         let index = user.favorite.indexOf(favorite.id);
  //         user.favorite.splice(index,1);
  //     }
  //     else
  //     {
  //         user.favorite.push(favorite.id);
  //     }
  //     let jsonUser = JSON.stringify(user);
  //     this.cookie.set("user",jsonUser);

  //     this.http.post<any>(environment.apiUrl_CLIENT + "/favorite",favorite,{ withCredentials: true }).subscribe(request =>
  //     {
  //         console.log(request.errors);
  //     },
  //     error =>
  //     {
  //         console.error("Une erreur s'est produite lors de la requête HTTP :", error);
  //         var msg = ((document.getElementById("message"))as HTMLParagraphElement);
  //         msg.className = "error"
  //         msg.innerHTML = "Problem posting the form. Node.js api server on port:3000 is probably offline. Look at console for more detail.";
  //     });
  // }

  // public AddToCart(event: any)
  // {
  //     let user:any = this.Parse(this.cookie.get("user"));
  //     if(user == null)
  //     {
  //         this.router.navigate(['/login']);
  //         return;
  //     }

  //     let btn = event.target as HTMLButtonElement;
  //     var product =
  //     {
  //         id: btn.value
  //     };
  //     if(btn.innerText.toString().includes("Ajouter"))
  //     {
  //         btn.innerText = "Retirer du panier";
  //     }
  //     else
  //     {
  //         btn.innerText = "Ajouter au panier";
  //     }

  //     let found = false;
  //     for (let i = 0; i < user.cart.length; i++)
  //     {
  //         if (user.cart[i]._id == product.id)
  //         {
  //             user.cart.splice(i,1)
  //             found = true;
  //             break;
  //         }
  //     }
  //     if(!found)
  //     {
  //         let newCartProduct =
  //         {
  //             _id : product.id,
  //             count: 1
  //         }
  //         user.cart.push(newCartProduct);
  //     }
  //     let jsonUser = JSON.stringify(user);
  //     this.cookie.set("user",jsonUser);

  //     this.http.post<any>(environment.apiUrl_CLIENT + "/addProductToCart",product,{ withCredentials: true }).subscribe(request =>
  //     {
  //         console.log(request.errors);
  //     },
  //     error =>
  //     {
  //         console.error("Une erreur s'est produite lors de la requête HTTP :", error);
  //         var msg = ((document.getElementById("message"))as HTMLParagraphElement);
  //         msg.className = "error"
  //         msg.innerHTML = "Problem posting the form. Node.js api server on port:3000 is probably offline. Look at console for more detail.";
  //     });
  // }

  // public Parse(json:any)
  // {
  //     if(json == "")
  //     {
  //         return undefined;
  //     }
  //     else
  //     {
  //         return JSON.parse(json);
  //     }
  // }

  protected readonly AppComponent = AppComponent;
}
