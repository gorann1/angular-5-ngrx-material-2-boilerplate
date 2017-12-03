import { Component, OnInit } from '@angular/core';
import { StoreApi } from '../../core/api';
import { Color } from '../../core/store/colors-selector/model';

@Component({
  selector: 'app-colors-selector',
  templateUrl: './colors-selector.component.html',
  styleUrls: []
})
export class ColorsSelectorComponent implements OnInit {
  newColorLabel = '';
  newColorValue = '';
  colors$: any;

  constructor(
    private storeApi: StoreApi,
  ) { }

  ngOnInit() {
    this.colors$ = this.storeApi.getColors();
  }

  onColorInsert() {
    console.log('Inserting', this.newColorLabel, this.newColorValue);
    this.storeApi.saveColor(this.newColorLabel, this.newColorValue);
  }

  onColorUpdate(label: string, value: string) {
    console.log('Updating', label, value);
    this.storeApi.updateColor(label, value);
  }

  onColorDelete(label: string) {
    console.log('Deleting', label);
    this.storeApi.deleteColor(label);
  }

}
