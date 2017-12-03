import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';

import { StoreApi } from './core/api';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';

// The components modules
import { HomeModule } from './components/home/home.module';
import { AboutModule } from './components/about/about.module';

import * as ngrx from './core/store';

@NgModule({
  imports: [
    TranslateModule.forRoot(),
    BrowserModule,
    FormsModule,
    HttpModule,
    BrowserAnimationsModule,
    MaterialModule,

    CoreModule,
    SharedModule,

    // Components modules
    HomeModule,
    AboutModule,

    // Keep this after the components :-)
    AppRoutingModule,

    ngrx.StoreModule.forRoot(ngrx.reducers),
    ngrx.StoreDevtoolsModule.instrument({
      maxAge: 25 //  Retains last 25 states
    }),
    ngrx.SettingsModule,
  ],
  providers: [
    StoreApi
  ],
  declarations: [
    AppComponent
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
