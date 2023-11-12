import { Injectable } from "@angular/core";
import {
    ActivatedRouteSnapshot,
    CanActivate,
    Router,
    RouterStateSnapshot,
    UrlTree
} from "@angular/router";

import { ROUTES } from '../utils/constants'


import { AuthService } from "./auth.service";

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private authService: AuthService,
        private router: Router,
    ) {
    }
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): boolean | Promise<boolean> {
        const isAuthenticated = this.authService.getAuthStatus();
        if (!isAuthenticated) {
            this.router.navigate([ROUTES.ROUTE_LOGIN]);
        } else {
          const userRole = this.authService.getRole();
          if (route.data["role"] && route.data["role"].indexOf(userRole) === -1) {
            this.router.navigate([ROUTES.ROUTE_DASHBOARD]);

            return false;
          }

          return true;
        }

        return false;
    }
}
