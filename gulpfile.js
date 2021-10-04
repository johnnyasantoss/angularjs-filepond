'use strict';
const bro = require("gulp-bro");
const sourcemaps = require("gulp-sourcemaps");
const gulp = require("gulp");
const del = require('del');
const browserSync = require('browser-sync');
const path = require('path');
const rename = require("gulp-rename");
const gulpif = require('gulp-if');

/**
 * @param {boolean} isMinified
 * @param {Function} cb
 * @returns {NodeJS.ReadWriteStream}
 */
function buildJs(isMinified, cb) {
    var transformers = [
        ["babelify", { presets: ["@babel/preset-env"] }],
        ["browserify-shim", { global: true }],
    ];

    if (isMinified) {
        transformers.push(
            [
                'uglifyify'
                , {
                    mangle: true,
                    global: true,
                    compress: {
                        sequences: true,
                        dead_code: true,
                        booleans: true,
                        conditionals: true,
                        if_return: false,
                        drop_console: true,
                        keep_fnames: true
                    },
                    output: {
                        comments: false
                    }
                }
            ]);
    }

    return gulp.src('./src/modules/filepond.module.js')
        .pipe(bro({
            error: 'emit',
            transform: transformers
        }))
        .pipe(gulpif(isMinified, rename(path => {
            if (path.basename.indexOf('.js') > 0) {
                path.basename = path.basename.replace('.js', '.min.js')
            } else if (path.extname === '.js') {
                path.extname = '.min' + path.extname
            }
        })))
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(sourcemaps.mapSources((sourcePath) => path.join('../src', sourcePath)))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest('dist'))
        .on('end', () => cb());
}

gulp.task('clean', () => del(["./dist/**"]));

gulp.task('publish', gulp.series(['clean'], (done) => {
    buildJs(false, () => {
        buildJs(true, () => done());
    });
    return undefined;
}));

gulp.task('build', () => {
    return buildJs(false, () => browserSync.reload())
});

gulp.task('debug', gulp.series(["clean", "build"], () => {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });

    require('./tests/tempFileServer').start();

    gulp.watch(
        [
            './src/components/*.js',
            './src/modules/*.js',
            './src/utils/*.js',
            './tests/page/*.js',
            './index.html'
        ],
        gulp.series('build')
    );
}));
