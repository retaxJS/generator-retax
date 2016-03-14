'use strict';
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var _ = require('lodash');
var updateExport = require('../../helpers/updateIndex').updateExport;

module.exports = yeoman.Base.extend({
  constructor: function () {
    yeoman.Base.apply(this, arguments);

    this.argument('reducerName', {desc: 'The reducer name (eg. errors)', type: String, required: true});

    this.reducerName = _.camelCase(this.reducerName);
    this.capitalizedReducerName = _.capitalize(this.reducerName);
  },

  prompting: function () {
    this.log(yosay('I will scaffold a reducer'));
  },

  _copyReducer() {
    this.fs.copyTpl(
      this.templatePath(`reducer.js`),
      this.destinationPath(`src/reducers/${this.reducerName}.js`),
      {
        reducerName: this.reducerName
      }
    );

    this.fs.copyTpl(
      this.templatePath(`__tests__/reducer-test.js`),
      this.destinationPath(`src/reducers/__tests__/${this.reducerName}-test.js`),
      {
        reducerName: this.reducerName,
        capitalizedReducerName: this.capitalizedReducerName
      }
    );
  },

  _updateOrCopyReducerIndex() {
    updateExport.bind(this)('src/reducers/reducers.js', {
      templateFile: 'index.js',
      templateOptions: {
        reducerName: this.reducerName
      },
      exportRegex: new RegExp(`export { default as ${this.reducerName} } from '\\.\\/${this.reducerName}';`, 'g'),
      exportString: `export { default as ${this.reducerName} } from './${this.reducerName}';`
    });
  },

  writing: function () {
    this._copyReducer();
    this._updateOrCopyReducerIndex();
  },

  end: function () {
    this.log('The reducer has been initialized.');
  }
});
