import { Component, HostListener, Inject, ChangeDetectionStrategy } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { UserService } from './services/user.service';
import { BehaviorSubject, of } from 'rxjs';
import { Observable } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  //changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Talenta Sourcing';
  isLogin = true;
  isAdminRoute = false;
  isAdminLoginRoute = false;
  //isLogin = false;
  wrapper: string;
  password: string;
  email: string;
  getAdmin: BehaviorSubject<any>;
  currentData: any;
  constructor(
    private toastr: ToastrService,
    private userServ: UserService,
    private router: Router
  ) {
    //this.isLogin = true;
    this.getAdmin = new BehaviorSubject<any>(localStorage.getItem('tknaaa'));

    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(e => {
        const url = e.urlAfterRedirects;
        this.isAdminRoute = url.startsWith('/administration');//url.startsWith('/administration');
        this.isAdminLoginRoute = (url === '/admin-login'); //|| url.startsWith('/admin-login');
      });
    
    if (this.getAdmin.getValue() !== null) {
      this.userServ.userAdmin(this.getAdmin.getValue()).subscribe((resp:any) => {
       if (resp.error) {
         //this.isLogin = true;
         this.isLogin = false;
       } else {
         this.isLogin = true
       }
      })
    }
    window.scroll(0,0);
  }

  a() {
    if (this.password === '' || this.email === '') {
      this.toastr.error('Les champs sont obligatoires', '', {
        timeOut: 5000
      });
    } else {
      const user = {
        email: this.email,
        password: this.password,
      };
      this.userServ.login(user).subscribe((data: any) => {
        console.log(data);
        if (data.error === false) {
          if (data.roles.includes('ROLE_ADMIN')) {
            this.isLogin = true;
            this.userServ.setTokenA(data.accessToken)
          } else {
            this.toastr.error('WRONG USER', '', {
              timeOut: 5000
            });
          }
        }
      },
        err => {
          this.toastr.error(err.error.message, '', {
            timeOut: 5000
          });
          console.log(err)
        });
    }
  }
  }
