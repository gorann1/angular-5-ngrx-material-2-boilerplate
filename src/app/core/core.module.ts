import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  HttpModule,
  Http,
  XHRBackend,
  ConnectionBackend,
  RequestOptions
} from '@angular/http';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { I18nService } from './i18n.service';
import { HttpService } from './http/http.service';
import { HttpCacheService } from './http/http-cache.service';

import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material.module';
import { ShellComponent } from './shell/shell.component';

export function createHttpService(backend: ConnectionBackend,
                                  defaultOptions: RequestOptions,
                                  httpCacheService: HttpCacheService) {
  return new HttpService(backend, defaultOptions, httpCacheService);
}

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    TranslateModule,
    FlexLayoutModule,
    FormsModule,
    MaterialModule,
    SharedModule,
    RouterModule
  ],
  declarations: [
    ShellComponent
  ],
  providers: [
    I18nService,
    HttpCacheService,
    {
      provide: Http,
      deps: [XHRBackend, RequestOptions, HttpCacheService],
      useFactory: createHttpService
    }
  ]
})
export class CoreModule {

  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    // Import guard
    if (parentModule) {
      throw new Error(`${parentModule} has already been loaded. Import Core module in the AppModule only.`);
    }
  }

}
