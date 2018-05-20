//@ts-check

const angular = require('angular');
const filepond = require('filepond');

angular.module('filepond')
    .directive('filePond', genFilepondDirective);

const filteredComponentMethods = [
    'setOptions',
    'on',
    'off',
    'onOnce',
    'appendTo',
    'insertAfter',
    'insertBefore',
    'isAttachedTo',
    'replaceElement',
    'restoreElement',
    'destroy'
];

function createFilePondProxy(pond) {
    const proxy = {};
    Object.getOwnPropertyNames(pond)
        .forEach((key) => {
            if (!pond.hasOwnProperty(key) || filteredComponentMethods.indexOf(key) !== -1) {
                return;
            }
            let prop = pond[key];
            if (typeof prop === typeof Function) {
                proxy[key] = function _() {
                    prop(arguments);
                };
            }
            else {
                Object.defineProperty(proxy, key, Object.getOwnPropertyDescriptor(pond, key));
            }
        });
    return proxy;
}

function genFilepondDirective($log) {
    return {
        restrict: 'E',
        scope: {
            config: '<',
            onInit: '&'
        },
        template: '<input type="file" class="filepond" />',
        link: function (scope, element) {
            if (!filepond.supported()) {
                $log.error('FilePondComponent: FilePond isn\'t supported by this browser');
                return;
            }

            $log.debug('FilePondComponent: Initializing component...');

            const pond = filepond.create(element[0].children[0], scope.config);
            let removeWatcher = scope.$watch(() => scope.config, () => {
                $log.debug('FilePondComponent: Refreshing configs...');
                try {
                    pond.setOptions(scope.config);
                } catch (e) {
                    $log.error(e);
                }
            }, true);

            pond.oninit = function () {
                $log.debug('FilePondComponent: Initialized');

                const proxy = createFilePondProxy(pond);

                try {
                    scope.onInit({ instance: proxy });
                } catch (e) {
                    $log.error(e);
                }
            }

            element.on('$destroy', function () {
                $log.debug('FilePondComponent: Detroying component...')
                filepond.destroy(element[0]);
                removeWatcher();
            });
        }
    };
}

genFilepondDirective.$inject = [
    '$log'
];
