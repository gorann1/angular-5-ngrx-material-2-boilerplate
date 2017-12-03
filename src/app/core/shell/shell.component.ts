import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ObservableMedia } from '@angular/flex-layout';
import { I18nService } from '../i18n.service';

import { StoreApi } from '../api';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent implements OnInit {

  constructor(
    private router: Router,
    private titleService: Title,
    private media: ObservableMedia,
    private i18nService: I18nService,
    private storeApi: StoreApi,
  ) { }

  ngOnInit() { }

  setLanguage(language: string) {
    this.i18nService.language = language;
    this.storeApi.setLanguage(language);
  }

  get languages(): string[] {
    return this.i18nService.supportedLanguages;
  }

  get isMobile(): boolean {
    return this.media.isActive('xs') || this.media.isActive('sm');
  }

  get title(): string {
    return this.titleService.getTitle();
  }
}
