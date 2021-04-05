const {src, dest, watch, series} = require("gulp");
const sass = require("gulp-dart-sass");
const postcss = require("gulp-postcss");
const cssnano = require("cssnano");
const browserSync = require("browser-sync");
const terser = require("gulp-terser");
const autoPrefixer = require("autoprefixer");

// Task for the scss
function scssTask() {
    return src("app/scss/style.scss", {sourcemaps: true})
    .pipe(sass())
    .pipe(postcss([autoPrefixer(), cssnano()]))
    .pipe(dest("dist", {sourcemaps: "."}));
}

// Task for the javascript
function jsTask() {
    return src("app/js/script.js", {sourcemaps: true})
    .pipe(terser())
    .pipe(dest("dist", {sourcemaps: "."}));
}

// Task for the browserSync
function browserSyncServe(callback) {
    browserSync.init({
        server: {
            baseDir: "."
        }
    });
    callback();
}

// Task for the browerSync to reload
function browserSyncReload(callback) {
    browserSync.reload();
    callback();
}

// Task for watching all
function watchTask() {
    watch("*.html", browserSyncReload);
    watch(["app/js/**/*.js", "app/scss/**/*.scss"], series(scssTask, jsTask, browserSyncReload));
}

// Default Gulp to run in CLI
exports.default = series(
    scssTask,
    jsTask,
    browserSyncServe,
    watchTask
);