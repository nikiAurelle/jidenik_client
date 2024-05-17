import { Component } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent
{
  // public static readonly API_URL = "http://localhost:3000"
  // public static readonly BACKOFFICE_URL = "mongodb+srv://root:root@database0.zpwtysq.mongodb.net/test?retryWrites=true&w=majority/"
  title = 'projetweb';

  constructor(private http: HttpClient,private cookie: CookieService)
  {

  }


    public async Authentificate()
    {
        this.http.get<any>(environment.apiUrl_CLIENT + "/authentificate",{ withCredentials: true }).subscribe(request =>
        {
            if(request.user != null)
            {
                let authUser = JSON.stringify(request.user);
                this.cookie.set("user",authUser);
                let linkLogin = ((document.getElementById("login"))as HTMLLinkElement);
                if(linkLogin != null)
                {
                    linkLogin.innerHTML = '<i class="bi bi-person-circle"></i>Mon profil';
                    linkLogin.href = "/profile";
                }
            }
        },
        error =>
        {
           console.log(error);
        });
    }

    ngOnInit(): void
    {
        this.Authentificate();
        let jsonMessage = localStorage.getItem("message");
        localStorage.removeItem("message");
        if(jsonMessage != null)
        {
            let objMessage = JSON.parse(jsonMessage);
            let msg = ((document.getElementById("message"))as HTMLParagraphElement);
            msg.className = objMessage.class;
            msg.innerHTML += objMessage.text;
        }

    }
}
