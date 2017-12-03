import { Action } from '@ngrx/store';
import { Color as Model } from './model';

export const SET_COLOR = 'SET_COLOR';
export const UPDATE_COLOR = 'UPDATE_COLOR';
export const DELETE_COLOR = 'DELETE_COLOR';

export class SetColor implements Action {
   readonly type = SET_COLOR;
   constructor(public payload: Model) {}
}

export class UpdateColor implements Action {
    readonly type = UPDATE_COLOR;
    constructor(public payload: Model) {}
 }

 export class DeleteColor implements Action {
    readonly type = DELETE_COLOR;
    constructor(public payload: Model) {}
 }

export type ColorsActions =
    SetColor
|   UpdateColor
|   DeleteColor
;
