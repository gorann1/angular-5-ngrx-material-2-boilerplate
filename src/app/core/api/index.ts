import { Injectable } from '@angular/core';
import * as ngrx from '../store';

import * as SettingsActions from '../store/settings/actions';
import * as ColorsActions from '../store/colors-selector/actions';
// NOTE: Add here a new feature's actions

@Injectable()
export class StoreApi {
  constructor(
    private store: ngrx.Store<any>,
  ) {
    // do nothing
  }

  setLanguage(language: string) {
    this.store.dispatch(
        new SettingsActions.SetLanguage({
          id: 'language',
          label: 'Language',
          value: language
        })
      );
  }

  getSettings() {
    return this.store.select(ngrx.selectAllSettings);
  }

  saveColor(label: string, value: string) {
    this.store.dispatch(
      new ColorsActions.SetColor({
        id: label,
        label: label,
        value: value
      })
    );
  }

  updateColor(label: string, value: string) {
    this.store.dispatch(
      new ColorsActions.UpdateColor({
        id: label,
        label: label,
        value: value
      })
    );
  }

  deleteColor(id: string) {
    this.store.dispatch(
      new ColorsActions.DeleteColor({
        id: id
      })
    );
  }

  getColors() {
    return this.store.select(ngrx.selectAllColors);
  }

}
