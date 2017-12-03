import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MaterialModule } from '../../material.module';
import { _FEATURE-CAP-NAME_RoutingModule } from './routing.module';
import { _FEATURE-CAP-NAME_Component } from './component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    FlexLayoutModule,
    MaterialModule,
    _FEATURE-CAP-NAME_RoutingModule
  ],
  declarations: [
    _FEATURE-CAP-NAME_Component
  ]
})
export class _FEATURE-CAP-NAME_Module { }
