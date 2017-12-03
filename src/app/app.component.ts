import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { merge } from 'rxjs/observable/merge';
import { filter, map, mergeMap } from 'rxjs/operators';

import { environment } from '../environments/environment';
import { Logger } from './core/logger.service';
import { I18nService } from './core/i18n.service';

import { StoreApi } from './core/api';

const log = new Logger('App');

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  settings$: any;

  constructor(
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private titleService: Title,
              private translateService: TranslateService,
              private i18nService: I18nService,
              private storeApi: StoreApi,
  ) { }

  ngOnInit() {
    // Setup logger
    if (environment.production) {
      Logger.enableProductionMode();
    }

    log.debug('init');

    // Get settings
    this.settings$ = this.storeApi.getSettings();

    // Init routines
    this.setupTranslations();
    this.subscribeLanguageChanges();
    this.syncSettingsStore();
  }

  setupTranslations() {
    this.i18nService.init(environment.defaultLanguage, environment.supportedLanguages);
  }

  // Change page title on navigation or language change, based on route data
  subscribeLanguageChanges() {
    const onNavigationEnd = this.router.events.pipe(filter(event => event instanceof NavigationEnd));

    merge(this.translateService.onLangChange, onNavigationEnd)
      .pipe(
        map(() => {
          let route = this.activatedRoute;
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        filter(route => route.outlet === 'primary'),
        mergeMap(route => route.data)
      )
      .subscribe(event => {
        const title = event['title'];
        if (title) {
          this.titleService.setTitle(this.translateService.instant(title));
        }
      });
  }

  syncSettingsStore() {
    // Sync language
    this.storeApi.setLanguage(this.i18nService.language);
  }

}
