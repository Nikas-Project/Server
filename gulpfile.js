"use strict";

var fibers = require("fibers"),
    gulp = require("gulp"),
    sass = require("gulp-sass")(require("sass")),
    sourcemaps = require("gulp-sourcemaps"),
    prefixer = require("gulp-autoprefixer");

var sassOptions = {
    fiber: fibers,
    outputStyle: "compressed",
};

gulp.task("sass", function () {
    return gulp
        .src("./nikas/sass/*.scss")
        .pipe(sourcemaps.init())
        .pipe(sass(sassOptions).on("error", sass.logError))
        .pipe(prefixer())
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest("./nikas/css"));
});

gulp.task("sass:watch", function () {
    gulp.watch("./nikas/sass/*.scss", ["sass"]);
});
