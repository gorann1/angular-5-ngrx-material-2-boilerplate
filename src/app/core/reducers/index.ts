import {
    createSelector,
    createFeatureSelector,
    ActionReducerMap
} from '@ngrx/store';

import * as fromSettings from '../store/settings/reducer';
import * as fromColors from '../store/colors-selector/reducer';
// NOTE: Import here a new feature's reducer

export const reducers: ActionReducerMap<any> = {
    settings: fromSettings.reducer,
    colors: fromColors.reducer,
    // NOTE: Add here a new feature's reducer
};

export const selectSettingsState = createFeatureSelector<fromSettings.State>(fromSettings.featureName);
export const { selectAll: selectAllSettings } = fromSettings.adapter.getSelectors(selectSettingsState);

export const selectColorsState = createFeatureSelector<fromColors.State>(fromColors.featureName);
export const { selectAll: selectAllColors } = fromColors.adapter.getSelectors(selectColorsState);
