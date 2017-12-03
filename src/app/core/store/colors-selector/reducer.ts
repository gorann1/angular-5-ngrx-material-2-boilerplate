import { createEntityAdapter, EntityState, EntityAdapter } from '@ngrx/entity';

import { Color as Model } from './model';
import * as Actions from './actions';

export const featureName = 'colors';
export interface State extends EntityState<Model> {}
export const adapter: EntityAdapter<Model> = createEntityAdapter<Model>();
export const initialState: State = adapter.getInitialState();

export function reducer(
  state: State = initialState,
  action: Actions.ColorsActions
) {
  switch (action.type) {

    // NOTE: Follow https://github.com/ngrx/platform/issues/421 for the upsert
    case Actions.SET_COLOR:
      const changes = action.payload;
      const id = changes.id;

      state = adapter.addOne(action.payload, state);
      // safe, either create or do nothing

      return adapter.updateOne({
        id: action.payload.id,
        changes : {
          value: action.payload.value
        }
      }, state);
      // also safe, now it exists, we apply a (possibly dummy) update

    case Actions.UPDATE_COLOR:
      return adapter.updateOne({
        id: action.payload.id,
        changes : {
          label: action.payload.label,
          value: action.payload.value
        }
      }, state);

    case Actions.DELETE_COLOR:
      return adapter.removeOne(action.payload.id, state);

    default:
      return state;
  }
}
