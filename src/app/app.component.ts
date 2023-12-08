import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
})
export class AppComponent {
    lang: string = 'it';
    locale: string;

    constructor(
        public translateService: TranslateService,
        public primengConfig: PrimeNGConfig,
    ) {
        this.primengConfig.ripple = true;
        translateService.addLangs(['it', 'es', 'en']);
        this.changeLang('it');
    }
    ngOnInit() {
        this.locale = this.translateService.currentLang;
        // don't forget to unsubscribe!
        this.translateService.onLangChange.subscribe(
            (langChangeEvent: LangChangeEvent) => {
                this.locale = langChangeEvent.lang;
            },
        );
    }
    changeLang(lang: string) {
        this.translateService.use(lang);
        this.translateService
            .get('primeng')
            .subscribe((res) => this.primengConfig.setTranslation(res));
    }
}
