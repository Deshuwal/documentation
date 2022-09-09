import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Role } from '../models/role';
import { RoleHome } from '../models/role-home';
import { AuthService } from './auth.service';
import { LocalStoreService } from './local-store.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGaurd implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService,
    private localStora: LocalStoreService
  ) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    try {
      const isAuthenticated = await this.authService.checkAuth();

      if (isAuthenticated) {
        const user: any = this.localStora.getItem('user');
        const role: number = parseInt(user.role);
               
        if (route.data.roles && !route.data.roles.includes(role)) {
          this.router.navigateByUrl(RoleHome[role]);
          return false;
        }

        if(!!parseInt(user.force_password_update)) {
          this.router.navigateByUrl(`/auth/password/${user.password_ref}`);
          return false;
        }

        return true;
      }

      this.router.navigateByUrl('/auth/signin');
      return true;
    } catch (error) {
      this.router.navigateByUrl('/auth/signin');
      return true;
    }
  }
}
