'use strict';
const bro = require("gulp-bro");
const sourcemaps = require("gulp-sourcemaps");
const gulp = require("gulp");
const del = require('del');
const browserSync = require('browser-sync');
const path = require('path');

gulp.task('clean', () => del(["./dist/**"]));

gulp.task('build', () => {
    return gulp.src('./src/modules/filepond.module.js')
        .pipe(bro({
            debug: true,
            transform: [
                ["babelify", { presets: ["env"] }],
                ["browserify-shim", { global: true }],
                // ['uglifyify', {global: true}]
            ]
        }))
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(sourcemaps.mapSources((sourcePath) => path.join('../src', sourcePath)))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest('dist'))
        .on('end', () => browserSync.reload())
});

gulp.task('debug', ["clean", "build"], () => {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });

    require('./tests/tempFileServer').start();

    gulp.watch('./src/components/*.js', ['build']);
    gulp.watch('./src/modules/*.js', ['build']);
    gulp.watch('./src/utils/*.js', ['build']);
    gulp.watch('./tests/page/*.js', ['build']);
    gulp.watch('./index.html', ['build']);
});
