const templates = require('./utils/templates');

const chalk = require('chalk');
const chalkAnimation = require('chalk-animation');
const prompt = require('node-ask').prompt;
const ask = require('node-ask').ask;
const _confirm = require('node-ask').confirm;
const multiline = require('node-ask').multiline;

const typeIcon = '→';
const folderIcon = '◰';
const fileIcon = '◉';
const tickIcon = '✔';
const errorIcon = '✘';

//
// Knowledge
let properties = {};
let model = {};
let actions = {};

const questions = [
    { key: 'featureName',       msg: askInput('What\'s the feature name?'),                         fn: 'prompt' },
    { key: 'shared',            msg: askInput('Do you want to share this component with others?'),  fn: 'confirm' },
    { key: 'useStore',          msg: askInput('Does it need a store?'),                             fn: 'confirm' },
];
//
//

//
// Helpers
function empty() {
    console.log('');
}
function say(f) {
    console.log(f);
}
function output(msg) {
    return chalk.black.bgKeyword('yellow')(` ${msg} `);
}
function askInput(msg) {
    return chalk.black.bgKeyword('green')(` ${msg} ${typeIcon} `);
}
function folder(name, indentLevel=0) {
    let indentSpace = '';
    for (let i=0,len=indentLevel; i<len; i++) {
        indentSpace += '  ';
    }
    return chalk.black.bgKeyword('gray')(` ${indentSpace} ${folderIcon} ${name} `);
}
function file(name, indentLevel=1) {
    let indentSpace = '';
    for (let i=0,len=indentLevel; i<len; i++) {
        indentSpace += '  ';
    }
    return chalk.black.bgKeyword('gray')(` ${indentSpace} ${fileIcon} ${name} `);
}
function confirm(msg) {
    return chalk.black.bgKeyword('green')(` ${tickIcon} ${msg} `);
}
function error(msg) {
    return chalk.black.bgKeyword('red')(` ${errorIcon} ${msg} `);
}
function camelize(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
        if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
        return index == 0 ? match.toLowerCase() : match.toUpperCase();
    });
}
function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
function nameToSlug(text) {
    return text
        .toString()
        .toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
}
function safePropertyName(text) {
    return camelize(text.trim().toLowerCase().replace(/\W/g, ' '));
}
function safeActionName(text) {
    return text.trim().toLowerCase().replace(/\W/g, '-');
}
function safeActionVarName(text) {
    return capitalizeFirstLetter(camelize(text.trim().toLowerCase().replace(/\W/g, ' ')));
}
//
//

//
// Behaviors
function gatherProperty(property) {
    model[property] = {};

    empty();
    return prompt(`What's the type of ${property}? [number|string|boolean] `)
        .then(answer => {
            model[property].typeOf = answer;
        })
}
function gatherPropertyMandatory(property) {
    return _confirm(`Is ${property} mandatory? `)
        .then(answer => {
            model[property].mandatory = answer;
        });
}
function gatherModel() {
    empty();
    return multiline(askInput('What are the properties of the model?\n  Please, press the ENTER key before start typing a new property. Double ENTER to end the list.'))
        .then(async answer => {
            let properties = [];
            lines = answer.split('\n');
            properties = lines.map(prop => {
                return safePropertyName(prop);
            });

            for (let p of properties) {
                await gatherProperty(p);
                await gatherPropertyMandatory(p);
            }
        });
}

function gatherActionLabel(action) {
    actions[action] = {
        varName: safeActionVarName(action)
    };

    const suggestedLabel = action.toUpperCase().replace(/\W/g, '_');

    empty();
    return prompt(`What's the label of ${action}? (${suggestedLabel})`)
        .then(answer => {
            actions[action].label = answer == '' ? `${suggestedLabel}` : answer;
        })
}
function gatherActionValue(action) {
    return prompt(`What's the value of ${action}? ([${properties.featureName}] ${actions[action].label})`)
        .then(answer => {
            actions[action].value = answer == '' ? `[${properties.featureName}] ${actions[action].label}` : answer;
        })
}
function gatherActions() {
    empty();
    return multiline(askInput('What are the actions for this feature?\n  Please, press the ENTER key before start typing a new action. Double ENTER to end the list.'))
        .then(async answer => {
            let actions = [];
            lines = answer.split('\n');
            actions = lines.map(action => {
                return safeActionName(action);
            });

            for (let a of actions) {
                await gatherActionLabel(a);
                await gatherActionValue(a);
            }
        });
}

function applyChanges() {
    properties.model = model;
    properties.actions = actions;

    templates.init(properties);
    const result = templates.writeFiles();
    templates.registerComponent();


    empty();
    say(output(`${tickIcon} The new component has been created succesfully.`));
    for (let item of result) say(folder(item));
    empty();
}
function abort() {
    empty();
    say(output('Ok, no problem. Bye!'));
    empty();
}
function finalize() {
    empty();
    say(output('Properties'));
    console.log(JSON.stringify(properties, 0, 2));
    
    empty();
    say(output('Model'));
    console.log(JSON.stringify(model, 0, 2));
    
    empty();
    say(output('Actions'));
    console.log(JSON.stringify(actions, 0, 2));

    empty();
    prompt(confirm('Is this recap OK? Answer Yes or No. '))
        .then(answer => {
            answer = answer.toLowerCase();
            if (answer == 'yes' || answer == 'yep' || answer == 'yeah' || answer == 'y') {
                applyChanges();
            } else if (answer == 'no' || answer == 'nope' || answer == 'n') {
                abort();
            } else {
                empty();
                say(error('Sorry, I don\'t recognize your answer.'));
                empty();

                finalize();
            }
        });
}
//
//

empty();
say(output('                                                                                                   '));
say(output('                                                                                                   '));
say(output('Hi, I\'ll help you creating a component for a new feature, please answer the following questions... '));
say(output('                                                                                                   '));
say(output('                                                                                                   '));
empty();

ask(questions)
    .then(
        async answers => {
            const origFeatureName = answers.featureName;
            answers.featureName = nameToSlug(answers.featureName);
            answers.featureCapName = capitalizeFirstLetter(camelize(origFeatureName)).replace(/\W/, '');

            properties = answers;
            if (properties.useStore) {
                await gatherModel();
                await gatherActions();
            }

            finalize();
        }
    )
    .catch(
        err => {
            console.log(err.stack);
        }
    );

