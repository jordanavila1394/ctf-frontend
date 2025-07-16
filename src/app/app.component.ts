import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
    lang: string = 'it';
    locale: string;

    constructor(
        public translateService: TranslateService,
        public primengConfig: PrimeNGConfig
    ) {
        this.primengConfig.ripple = true;
        this.translateService.addLangs(['it', 'es', 'en']);

        // Recupera la lingua dal localStorage oppure usa 'it' come default
        const savedLang = localStorage.getItem('selectedLanguage') || 'it';
        this.changeLang(savedLang);
    }

    ngOnInit() {
        this.locale = this.translateService.currentLang;
        this.translateService.onLangChange.subscribe(
            (langChangeEvent: LangChangeEvent) => {
                this.locale = langChangeEvent.lang;
            }
        );
    }

    changeLang(lang: string) {
        this.translateService.use(lang);
        localStorage.setItem('selectedLanguage', lang); // Salva nel localStorage
        this.translateService
            .get('primeng')
            .subscribe((res) => this.primengConfig.setTranslation(res));
    }
}
