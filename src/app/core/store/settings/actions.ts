import { Action } from '@ngrx/store';
import { Setting as Model } from './model';

export const SET_LANGUAGE = 'SET_LANGUAGE';

export class SetLanguage implements Action {
   readonly type = SET_LANGUAGE;
   constructor(public payload: Model) {}
}

export type SettingsActions =
    SetLanguage
;
