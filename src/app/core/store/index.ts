export { Store, StoreModule } from '@ngrx/store';
export { StoreDevtoolsModule } from '@ngrx/store-devtools';

export {
    reducers,
    selectAllSettings,
    selectAllColors,
    // NOTE: Add here a new feature's reducer
} from '../reducers';

export {
    SettingsModule
} from '../store/settings/module';

export {
    ColorsModule
} from '../store/colors-selector/module';

// NOTE: Add here a new feature's module
