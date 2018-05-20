const angular = require('angular');
require('../utils/cssCreator')();

module.exports = angular.module('filepond', [])
    .name;

require('../components/filepond.component')

