import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    Router,
    RouterStateSnapshot,
    UrlTree,
} from '@angular/router';

import { ROUTES } from '../utils/constants';

import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private authService: AuthService,
        private router: Router,
    ) {}
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot,
    ): boolean | Promise<boolean> {
        const isAuthenticated = this.authService.getAuthStatus();
        if (!isAuthenticated) {
            this.router.navigate([ROUTES.ROUTE_LOGIN]);
        } else {
            const userRoles = this.authService.getRoles();
            const authRoles = route.data['roles'];
            const contains = userRoles.some((role) => {
                return authRoles?.indexOf(role) !== -1;
            });

            if (contains) {
                return true;
            }
        }

        return false;
    }
}
