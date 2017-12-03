import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MaterialModule } from '../material.module';

// The shared components
import { LoaderComponent } from './loader/loader.component';
import { ColorsSelectorComponent } from './colors-selector/colors-selector.component';

@NgModule({
  imports: [
    FlexLayoutModule,
    MaterialModule,
    CommonModule,
    FormsModule,
  ],
  declarations: [
    LoaderComponent,
    ColorsSelectorComponent
  ],
  exports: [
    LoaderComponent,
    ColorsSelectorComponent
  ]
})
export class SharedModule { }
