const fs = require('fs');
const fse = require('fs-extra');

String.prototype.regexIndexOf = function(regex, startpos) {
    var indexOf = this.substring(startpos || 0).search(regex);
    return (indexOf >= 0) ? (indexOf + (startpos || 0)) : indexOf;
}

function getFileContent(path) {
    return fs.readFileSync(path).toString('utf8');
}

module.exports = {
    init: (props) => {
        this.properties = props;

        this.templatesFolder = './templates';
        this.appFolder = '../../src/app';
        this.coreFolder = this.appFolder + '/core';

        this.storeFolder = this.coreFolder + '/store';

        this.sharedComponentsFolder = this.appFolder + '/shared';
        this.componentsFolder = this.appFolder + '/components';
    },
    writeFiles: () => {
        const self = this;
        const output = [];

        //
        // Store files
        function createActionsFile(template) {
            let constantsBlock = '';
            let classesBlock = '';
            let types = [];

            for (let k in self.properties.actions) {
                let a = self.properties.actions[k];

                constantsBlock += `export const ${a.label} = '${a.value}';\n`;
                classesBlock += 
                `export class ${a.varName} implements Action {\n` +
                `    readonly type = ${a.label};\n` +
                `    constructor(public payload: Model) {}\n` +
                `}\n`;
                types.push(a.varName);
            }

            let exportBlock = `export type ${self.properties.featureCapName}Actions = ${types.join(' | ')};`;

            template = template
                .replace('_CONSTS_', constantsBlock)
                .replace('_ACTIONS_CLASSES_', classesBlock)
                .replace('_EXPORT_TYPES_', exportBlock);
            
            fse.outputFileSync(`${self.templatesFolder}/tmp/store/${self.properties.featureName}/actions.ts`, template);
        }
        function createModelFile(template) {
            let propsList = [];
            let modelPropsBlock = '';
            let modelBlock = '';

            for (let k in self.properties.model) {
                let p = self.properties.model[k];
                let isMandatory = !p.mandatory ? '?' : '';
                modelPropsBlock +=
                `   ${k}${isMandatory}: ${p.typeOf};\n`
                ;
            }
            
            modelBlock = `export interface Setting {\n` + `${modelPropsBlock}\n` + `}\n`;

            template = template.replace('_MODEL_INTERFACE_', modelBlock);
            fse.outputFileSync(`${self.templatesFolder}/tmp/store/${self.properties.featureName}/model.ts`, template);
        }
        function createModuleFile(template) {
            template = template.replace('_EXPORT_MODULE_CLASS_', `export class ${self.properties.featureCapName}Module {}`);
            fse.outputFileSync(`${self.templatesFolder}/tmp/store/${self.properties.featureName}/module.ts`, template);
        }
        function createReducerFile(template) {
            let casesBlock = '';

            for (let k in self.properties.actions) {
                let a = self.properties.actions[k];
                casesBlock += 
                `    case Actions.${a.label}:\n` +
                `        // Add here your reducer logic\n` +
                `        return state;\n`
                ;
            }

            template = template
                .replace('_CONST_FEATURE-NAME_', `export const featureName = '${self.properties.featureName}';`)
                .replace('_ACTIONS_CASES_', casesBlock)
                .replace('_FEATURE-CAP-NAME_', self.properties.featureCapName);
            fse.outputFileSync(`${self.templatesFolder}/tmp/store/${self.properties.featureName}/reducer.ts`, template);
        }
        //
        //
        
        //
        // Component files
        function createComponentRoutingModuleFile(template) {
            template = template
                .replace(/_FEATURE-CAP-NAME_/g, self.properties.featureCapName)
                .replace(/_FEATURE-NAME_/g, self.properties.featureName)
                ;
            fse.outputFileSync(`${self.templatesFolder}/tmp/component/${self.properties.featureName}/${self.properties.featureName}.routing.module.ts`, template);
        }
        function createComponentLayoutFile(template) {
            template = template
                .replace(/_FEATURE-NAME_/g, self.properties.featureName)
            ;
            fse.outputFileSync(`${self.templatesFolder}/tmp/component/${self.properties.featureName}/${self.properties.featureName}.component.html`, template);
        }
        function createComponentStyleFile(template) {
            fse.outputFileSync(`${self.templatesFolder}/tmp/component/${self.properties.featureName}/${self.properties.featureName}.component.scss`, template);
        }
        function createComponentTestFile(template) {
            fse.outputFileSync(`${self.templatesFolder}/tmp/component/${self.properties.featureName}/${self.properties.featureName}.component.spec.ts`, template);
        }
        function createComponentFile(template) {
            template = template
                .replace(/_FEATURE-CAP-NAME_/g, self.properties.featureCapName)
                .replace(/_FEATURE-NAME_/g, self.properties.featureName)
                ;
            fse.outputFileSync(`${self.templatesFolder}/tmp/component/${self.properties.featureName}/${self.properties.featureName}.component.ts`, template);
        }
        function createComponentModuleFile(template) {
            template = template
                .replace(/_FEATURE-CAP-NAME_/g, self.properties.featureCapName)
                ;
            fse.outputFileSync(`${self.templatesFolder}/tmp/component/${self.properties.featureName}/${self.properties.featureName}.module.ts`, template);
        }
        //
        //

        if (self.properties.useStore) {
            const basePath = self.templatesFolder;
            const destPath = `${this.storeFolder}/${self.properties.featureName}`;

            const actionsFileContent = getFileContent(`${self.templatesFolder}/store/_actions.ts`);
            const modelFileContent = getFileContent(`${self.templatesFolder}/store/_model.ts`);
            const moduleFileContent = getFileContent(`${self.templatesFolder}/store/_module.ts`);
            const reducerFileContent = getFileContent(`${self.templatesFolder}/store/_reducer.ts`);

            createActionsFile(actionsFileContent);
            createModelFile(modelFileContent);
            createModuleFile(moduleFileContent);
            createReducerFile(reducerFileContent);

            fse.moveSync(
                `${self.templatesFolder}/tmp/store/${self.properties.featureName}`,
                destPath,
                { overwrite: false }
            );
            output.push(destPath);
        }

        const layoutFileContent = getFileContent(`${self.templatesFolder}/component/_component.html`);
        const styleFileContent = getFileContent(`${self.templatesFolder}/component/_component.scss`);
        const testFileContent = getFileContent(`${self.templatesFolder}/component/_component.spec.ts`);
        const componentFileContent = getFileContent(`${self.templatesFolder}/component/_component.ts`);
        
        createComponentLayoutFile(layoutFileContent);
        createComponentStyleFile(styleFileContent);
        createComponentTestFile(testFileContent);
        createComponentFile(componentFileContent);

        if (!self.properties.shared) {
            const routingModuleContent = getFileContent(`${self.templatesFolder}/component/_routing.module.ts`);
            const componentModuleFileContent = getFileContent(`${self.templatesFolder}/component/_module.ts`);
            createComponentRoutingModuleFile(routingModuleContent);
            createComponentModuleFile(componentModuleFileContent);
        }

        const destFold = self.properties.shared ? this.sharedComponentsFolder : this.componentsFolder;
        const destPath = `${destFold}/${self.properties.featureName}`;
        fse.moveSync(
            `${self.templatesFolder}/tmp/component/${self.properties.featureName}`,
            destPath,
            { overwrite: false }
        );
        output.push(destPath);

        fse.removeSync(`${self.templatesFolder}/tmp`);

        fse.writeJsonSync(`./presets/${self.properties.featureName}.json`, { properties: self.properties, dirs: output });
        // Saving preset

        return output;
    },
    registerComponent: () => {
        const self = this;

        //
        //
        function injectInReducers(fileContent) {
            var lines = fileContent.split('\n');

            var lastUsefulImportIndex = 0;
            var lastUsefulExportIndex = 0;
            var lastUsefulExportSelectIndex = 0;
            for (let i=0,len=lines.length; i<len; i++) {
                let line = lines[i];
                if (line.trim().indexOf('import * as') == 0) {
                    lastUsefulImportIndex = i;
                }
                if (line.trim().regexIndexOf(/^(.*): from(.*)reducer,$/) == 0) {
                    lastUsefulExportIndex = i;
                }
                if (line.trim().regexIndexOf(/^export const { (.*) } = (.*).getSelectors(.*);$/) == 0) {
                    lastUsefulExportSelectIndex = i;
                }
            }
            lines.splice(lastUsefulImportIndex+1, 0, `import * as from${self.properties.featureCapName} from '../store/${self.properties.featureName}/reducer';`);
            lines.splice(lastUsefulExportIndex+2, 0, `    ${String(self.properties.featureCapName).toLowerCase()}: from${self.properties.featureCapName}.reducer,`);
            lines.splice(lastUsefulExportSelectIndex+3, 0,
                `\n` +
                `export const select${self.properties.featureCapName}State = createFeatureSelector<from${self.properties.featureCapName}.State>(from${self.properties.featureCapName}.featureName);\n` +
                `export const { selectAll: selectAll${self.properties.featureCapName} } = from${self.properties.featureCapName}.adapter.getSelectors(select${self.properties.featureCapName}State);`
            );

            return lines.join('\n');
        }
        function injectInStore(fileContent) {
            var lines = fileContent.split('\n');

            var lastUsefulExportReducerIndex = 0;
            var lastUsefulExportModuleIndex = 0;
            for (let i=0,len=lines.length; i<len; i++) {
                let line = lines[i];
                if (line.trim().regexIndexOf(/^selectAll(.*)$/) == 0) {
                    lastUsefulExportReducerIndex = i;
                }
                if (line.trim().regexIndexOf(/^} from '..\/store\/(.*)\/module';$/) == 0) {
                    lastUsefulExportModuleIndex = i;
                }
            }
            lines.splice(lastUsefulExportReducerIndex+1, 0, `    selectAll${self.properties.featureCapName},`);
            lines.splice(lastUsefulExportModuleIndex+2, 0,
                `\n` +
                'export {\n' +
                
                `    ${self.properties.featureCapName}Module\n` +
                `} from '../store/${self.properties.featureName}/module';`
            );

            return lines.join('\n');
        }
        function injectInAppModule(fileContent) {
            var lines = fileContent.split('\n');

            var lastUsefulImportIndex = 0;
            var lastUsefulImporModuleIndex = 0;
            var modulesPlaceholderIndex = -1;
            for (let i=0,len=lines.length; i<len; i++) {
                let line = lines[i];
                if (line.trim().regexIndexOf(/^import { (.*) } from '.\/components\/(.*)\/(.*).module';$/) == 0) {
                    lastUsefulImportIndex = i;
                }
                if (line.trim().indexOf('// Components modules') == 0) {
                    modulesPlaceholderIndex = i;
                }
                if (line.trim().regexIndexOf(/^(.*)Module,$/) == 0) {
                    lastUsefulImporModuleIndex = i;
                }

            }
            lines.splice(lastUsefulImportIndex+1, 0, `import { ${self.properties.featureCapName}Module } from './components/${self.properties.featureName}/${self.properties.featureName}.module';`);
            if (modulesPlaceholderIndex > -1) {
                lines.splice(modulesPlaceholderIndex+2, 0, `    ${self.properties.featureCapName}Module,`);
            } else {
                lines.splice(lastUsefulImporModuleIndex+2, 0, `\n    ${self.properties.featureCapName}Module,\n`);
            }

            return lines.join('\n');
            
        }
        function injectInSharedModule(fileContent) {
            var lines = fileContent.split('\n');

            var lastUsefulImportIndex = 0;
            var firstUsefulDeclarationIndex = 0;
            var firstUsefulExportIndex = 0;
            for (let i=0,len=lines.length; i<len; i++) {
                let line = lines[i];
                if (line.trim().regexIndexOf(/^import { (.*) } from '.\/(.*)\/(.*).component';$/) == 0) {
                    lastUsefulImportIndex = i;
                }
                if (line.trim().regexIndexOf(/^declarations: \[$/) == 0) {
                    firstUsefulDeclarationIndex = i;
                }
                if (line.trim().regexIndexOf(/^exports: \[$/) == 0) {
                    firstUsefulExportIndex = i;
                }
            }
            lines.splice(lastUsefulImportIndex+1, 0, `import { ${self.properties.featureCapName}Component } from './${self.properties.featureName}/${self.properties.featureName}.component';`);
            lines.splice(firstUsefulDeclarationIndex+2, 0, `    ${self.properties.featureCapName}Component,`);
            lines.splice(firstUsefulExportIndex+3, 0, `    ${self.properties.featureCapName}Component,`);

            return lines.join('\n');
        }
        function injectInApi(fileContent) {
            var lines = fileContent.split('\n');

            var lastUsefulImportIndex = 0;
            for (let i=0,len=lines.length; i<len; i++) {
                let line = lines[i];
                if (line.trim().regexIndexOf(/^import \* as (.*)Actions from '..\/store\/(.*)\/actions';$/) == 0) {
                    lastUsefulImportIndex = i;
                }
            }
            lines.splice(lastUsefulImportIndex+1, 0, `import * as ${self.properties.featureCapName}Actions from '../store/${self.properties.featureName}/actions';`);

            return lines.join('\n');
        }
        //
        //

        if (self.properties.useStore) {
            const backupFold = `add_${self.properties.featureName}_${new Date().getTime()}`;
            const reducersFileContent = getFileContent(`${self.coreFolder}/reducers/index.ts`);
            const storeFileContent = getFileContent(`${self.coreFolder}/store/index.ts`);
            const apiFileContent = getFileContent(`${self.coreFolder}/api/index.ts`);

            fse.copySync(`${self.coreFolder}/reducers/index.ts`, `./backup/${backupFold}/reducers-index.ts`);
            fse.copySync(`${self.coreFolder}/store/index.ts`, `./backup/${backupFold}/store-index.ts`);
            fse.copySync(`${self.coreFolder}/api/index.ts`, `./backup/${backupFold}/api-index.ts`);
            // Backups

            fse.outputFileSync(`${self.coreFolder}/reducers/index.ts`, injectInReducers(reducersFileContent));
            fse.outputFileSync(`${self.coreFolder}/store/index.ts`, injectInStore(storeFileContent));
            fse.outputFileSync(`${self.coreFolder}/api/index.ts`, injectInApi(apiFileContent));
            // New contents
        }

        if (self.properties.shared) {
            const sharedComponentFileContent = getFileContent(`${self.sharedComponentsFolder}/shared.module.ts`);

            fse.copySync(`${self.sharedComponentsFolder}/shared.module.ts`, `./backup/${backupFold}/shared-shared.module.ts`);
            fse.outputFileSync(`${self.sharedComponentsFolder}/shared.module.ts`, injectInSharedModule(sharedComponentFileContent));
        } else {
            const appModuleFileContent = getFileContent(`${self.appFolder}/app.module.ts`);

            fse.copySync(`${self.appFolder}/app.module.ts`, `./backup/${backupFold}/app.module.ts`);
            fse.outputFileSync(`${self.appFolder}/app.module.ts`, injectInAppModule(appModuleFileContent));
        }
    }
};

