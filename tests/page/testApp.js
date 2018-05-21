//@ts-check
(function () {
    angular.module('myApp', ['filepond'])
        .component('myApp', {
            controller: myAppController,
            controllerAs: 'app',
            template: '<div><p>Send some files here: <button ng-click="app.changeAllowMultiple()">Multiple?</button></p></div>' +
                '<file-pond config="app.filePondConfig" on-init="app.filePondInitiated(instance)"></file-pond>'
        });

    function myAppController(scope, $log) {
        $log.debug('Initializing component controller o/');

        var vm = this;

        //any changes to this object after the initalization
        //will be set using `setOptions` method
        vm.filePondConfig = {
            server: {
                url: 'http://localhost:9000/api/files/'
            },
            instantUpload: false,
            allowMultiple: true,
            allowRevert: true,
            required: true,
            maxFiles: 5,
            dropOnPage: true,
            dropOnElement: false,
        };

        vm.changeAllowMultiple = function () {
            vm.filePondConfig.allowMultiple = !vm.filePondConfig.allowMultiple;
            $log.debug('allowMultiple: ', vm.filePondConfig.allowMultiple);
        };

        vm.filePondInitiated = function (instance) {
            $log.debug("Hey, got a FilePond instance: ", instance);
        };
    }
    myAppController.$inject = [
        '$scope',
        '$log'
    ];
})();