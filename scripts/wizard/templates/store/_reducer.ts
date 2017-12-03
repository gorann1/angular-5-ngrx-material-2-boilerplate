import { createEntityAdapter, EntityState, EntityAdapter } from '@ngrx/entity';

import { Setting as Model } from './model';
import * as Actions from './actions';

_CONST_FEATURE-NAME_

export interface State extends EntityState<Model> {}
export const adapter: EntityAdapter<Model> = createEntityAdapter<Model>();
export const initialState: State = adapter.getInitialState();

export function reducer(
  state: State = initialState,
  action: Actions._FEATURE-CAP-NAME_Actions
) {
  switch (action.type) {

_ACTIONS_CASES_

    default:
      return state;
  }
}
