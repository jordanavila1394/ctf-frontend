import {
    Component,
    OnDestroy,
    OnInit,
    Renderer2,
    ViewChild,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { LayoutService } from './service/app.layout.service';
import { AppSidebarComponent } from './app.sidebar.component';
import { AppTopBarComponent } from './app.topbar.component';
import { AuthService } from '../services/auth.service';
import { ROUTES } from '../utils/constants';

@Component({
    selector: 'app-layout',
    templateUrl: './app.layout.component.html',
})
export class AppLayoutComponent implements OnInit, OnDestroy {
    overlayMenuOpenSubscription!: Subscription;
    routerSubscription!: Subscription;

    menuOutsideClickListener: (() => void) | null = null;
    profileMenuOutsideClickListener: (() => void) | null = null;

    @ViewChild(AppSidebarComponent) appSidebar!: AppSidebarComponent;
    @ViewChild(AppTopBarComponent) appTopbar!: AppTopBarComponent;

    constructor(
        public authService: AuthService,
        public layoutService: LayoutService,
        public renderer: Renderer2,
        public router: Router,
    ) { }

    ngOnInit(): void {
        this.overlayMenuOpenSubscription = this.layoutService.overlayOpen$.subscribe(() => {
            this.bindOutsideClickListeners();
            if (this.layoutService.state.staticMenuMobileActive) {
                this.blockBodyScroll();
            }
        });

        this.routerSubscription = this.router.events
            .pipe(filter((event) => event instanceof NavigationEnd))
            .subscribe(() => {
                this.hideMenu();
                this.hideProfileMenu();
            });

        if (this.router.url === '/' || this.router.url === '') {
            this.redirectBasedOnRole();
        }
    }

    redirectBasedOnRole(): void {
        const userRoles = this.authService.getRoles();
        if (userRoles.includes('ROLE_ADMIN') || userRoles.includes('ROLE_MODERATOR')) {
            this.router.navigate([ROUTES.ROUTE_DASHBOARD]);
        } else if (userRoles.includes('ROLE_ACCOUNTING')) {
            this.router.navigate([ROUTES.ROUTE_TABLE_DEADLINES]);
        } else if (userRoles.includes('ROLE_WORKER')) {
            this.router.navigate([ROUTES.ROUTE_LANDING_HOME]);
        }
    }

    bindOutsideClickListeners(): void {
        if (!this.menuOutsideClickListener) {
            this.menuOutsideClickListener = this.renderer.listen('document', 'click', (event) => {
                const target = event.target as HTMLElement;
                const clickedOutsideSidebar =
                    !this.appSidebar.el.nativeElement.contains(target) &&
                    !this.appTopbar.menuButton.nativeElement.contains(target);
                if (clickedOutsideSidebar) {
                    this.hideMenu();
                }
            });
        }

        if (!this.profileMenuOutsideClickListener) {
            this.profileMenuOutsideClickListener = this.renderer.listen('document', 'click', (event) => {
                const target = event.target as HTMLElement;
                const clickedOutsideProfile =
                    !this.appTopbar.menu.nativeElement.contains(target) &&
                    !this.appTopbar.topbarMenuButton.nativeElement.contains(target);
                if (clickedOutsideProfile) {
                    this.hideProfileMenu();
                }
            });
        }
    }

    hideMenu(): void {
        this.layoutService.state.overlayMenuActive = false;
        this.layoutService.state.staticMenuMobileActive = false;
        this.layoutService.state.menuHoverActive = false;

        if (this.menuOutsideClickListener) {
            this.menuOutsideClickListener();
            this.menuOutsideClickListener = null;
        }

        this.unblockBodyScroll();
    }

    hideProfileMenu(): void {
        this.layoutService.state.profileSidebarVisible = false;

        if (this.profileMenuOutsideClickListener) {
            this.profileMenuOutsideClickListener();
            this.profileMenuOutsideClickListener = null;
        }
    }

    blockBodyScroll(): void {
        document.body.classList.add('blocked-scroll');
    }

    unblockBodyScroll(): void {
        document.body.classList.remove('blocked-scroll');
    }

    get containerClass(): { [key: string]: boolean } {
        const config = this.layoutService.config;
        const state = this.layoutService.state;

        return {
            'layout-theme-light': config.colorScheme === 'light',
            'layout-theme-dark': config.colorScheme === 'dark',
            'layout-overlay': config.menuMode === 'overlay',
            'layout-static': config.menuMode === 'static',
            'layout-static-inactive':
                state.staticMenuDesktopInactive && config.menuMode === 'static',
            'layout-overlay-active': state.overlayMenuActive,
            'layout-mobile-active': state.staticMenuMobileActive,
            'p-input-filled': config.inputStyle === 'filled',
            'p-ripple-disabled': !config.ripple,
        };
    }

    ngOnDestroy(): void {
        if (this.overlayMenuOpenSubscription) {
            this.overlayMenuOpenSubscription.unsubscribe();
        }

        if (this.routerSubscription) {
            this.routerSubscription.unsubscribe();
        }

        if (this.menuOutsideClickListener) {
            this.menuOutsideClickListener();
            this.menuOutsideClickListener = null;
        }

        if (this.profileMenuOutsideClickListener) {
            this.profileMenuOutsideClickListener();
            this.profileMenuOutsideClickListener = null;
        }
    }
}
