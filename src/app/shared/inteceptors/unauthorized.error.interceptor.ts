import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { AuthService } from "../services/auth.service";

@Injectable()
export class UnauthorizedErrorInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthService) {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err) => {
        if ([401].includes(parseInt(err.status))) {
          // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
          this.authenticationService.signout();
          if (!request.url.includes("auth")) {
            location.reload();
          }
        }
        return throwError(err);
      })
    );
  }
}
