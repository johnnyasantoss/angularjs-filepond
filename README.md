# AngularJS FilePond 
[![npm](https://img.shields.io/npm/v/angularjs-filepond.svg)][npmpackage]
[![npm](https://img.shields.io/npm/dt/angularjs-filepond.svg)][npmpackage]
[![npm bundle size (minified)](https://img.shields.io/bundlephobia/minzip/angularjs-filepond.svg)][npmpackage]
[![npm](https://img.shields.io/npm/l/angularjs-filepond.svg)][npmpackage]

A AngujarJS (yes I know that he is a bit old, but still people using it) component for [FilePond][filepond].

# Usage

Add this module as a dependency:
```js
angular.module('myApp', ['filepond'])
//...
```

Create a configuration object for [FilePond][filepond], following its [**documentation**][filepond-docs-config].
```js
angular.module('myApp')
    .controller('myController', ['$log', function($log){
        var vm = this;

        //see FilePond's docs
        vm.filePondConfig = {
            allowMultiple: true,
            required: true,
            server: '/api/files'
        };

        vm.filePondInitiated = function(filePondInstance){
            $log.debug('FilePond initialized: ', filePondInstance);
        };

        return vm;
    }]);
```

Then, add it to one of your templates and the configuration that we already set up.
```html
<file-pond config="app.filePondConfig" on-init="app.filePondInitiated(instance)"></file-pond>
```

**You can check for a more detailed and working example in the `index.html` file.**

# Testing

For now I didn't wrote unit tests for this component, but there's a page for manual testing :)

# Contribute

Clone this repo and install all the dependencies using `yarn` (or `npm i` which is not recommended because I'll not keep that lock file up to date)

This project was made using `Gulp` for its automation scripts. Here's some of them and what they do:

- `gulp debug`: Builds and start a server to test the application using the `index.html` file.
- `gulp build`: Builds the js files and write the results to `dist` folder.
- `gulp publish`: Same as `build` but also build a min version.
- `gulp clean`: Deletes the `dist` folder and its contents

 [filepond]: https://github.com/pqina/filepond
 [filepond-docs-config]: https://pqina.nl/filepond/docs/patterns/api/filepond-instance/
 [npmpackage]: https://www.npmjs.com/package/angularjs-filepond
