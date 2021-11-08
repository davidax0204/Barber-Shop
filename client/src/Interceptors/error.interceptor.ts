import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router, private toastr: ToastrService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error) => {
        if (error) {
          switch (error.status) {
            case 400:
              if (Array.isArray(error.error)) {
                const modalStateErrors = [];

                error.error.forEach((item) => {
                  modalStateErrors.push(item);
                  // this.toastr.error(item.description, error.status);
                  this.toastr.error(item.description);
                });

                throw modalStateErrors.flat();
              } else if (error.error.title) {
                // this.toastr.error(error.error.title, error.status);
                this.toastr.error(error.error.title);
              } else {
                error.statusText = error.error;
                // this.toastr.error(error.statusText, error.status);
                this.toastr.error(error.statusText);
              }
              break;
            case 401:
              error.statusText = 'Unauthorized';
              // this.toastr.error(error.statusText, error.status);
              this.toastr.error(error.statusText);
              break;
            case 404:
              this.router.navigateByUrl('/not-found');
              break;
            case 500:
              const navigationExtras: NavigationExtras = {
                state: { error: error.error },
              };
              this.router.navigateByUrl('/server-error', navigationExtras);
              break;
            default:
              this.toastr.error('Something unexpected went wrong');
              break;
          }
        }
        return throwError(error);
      })
    );
  }
}
