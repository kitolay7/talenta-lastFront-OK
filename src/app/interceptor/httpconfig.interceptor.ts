import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../services/user.service';
import { BehaviorSubject } from 'rxjs';
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    token: any;
    text: any;
    public tokenSubject: Observable<any> = of([]);
    tokenFinal: string;
    getAdmin: BehaviorSubject<any>;
    constructor(
        private menuListServ: UserService) {
        this.tokenSubject = this.menuListServ.getToken();
        this.tokenSubject.subscribe((data: any) => {
            this.token = data;
            if (data !== null || localStorage.getItem('Token') !== null) {
                this.token = localStorage.getItem('Token');
                this.tokenFinal = this.token;
            } else {
                this.tokenFinal = '';
            }
        });
        this.getAdmin = new BehaviorSubject<any>(localStorage.getItem('tknaaa'));
    }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (req.urlWithParams.includes('api/test/admin')) {

            req = req.clone({
                setHeaders: {
                    'x-access-token': localStorage.getItem('tknaaa'),
                },
            });
        } else {
            req = req.clone({
                setHeaders: {
                    'x-access-token': this.tokenFinal,
                },
            });
        }

        return next.handle(req).pipe(
            map((event: HttpEvent<any>): any => {
                if (event instanceof HttpResponse) {
                }
                return event;
            }),
            catchError((error: HttpErrorResponse): any => {
              
                return throwError(error);

            }));
    }
}