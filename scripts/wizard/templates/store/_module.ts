import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';

import { reducer, featureName } from './reducer';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(featureName, reducer)
  ],
  declarations: []
})
_EXPORT_MODULE_CLASS_
