import gulp from 'gulp';
import fileInclude from 'gulp-file-include';
import * as sass from 'sass';
import gulpSass from 'gulp-sass';
import sassGlob from 'gulp-sass-glob';
import server from 'gulp-server-livereload';
import clean from 'gulp-clean';
import sourceMaps from 'gulp-sourcemaps';
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import webpack from 'webpack-stream';
import fs from 'fs';
import babel from 'gulp-babel';
import imagemin from 'gulp-imagemin';
import changed from 'gulp-changed';
import webpackConfig from '../webpack.config.js';

const scss = gulpSass(sass);

export const cleanDev = (done) => {
    if (fs.existsSync('./build/')) { 
        return gulp.src('./build/', { read: false }).pipe(clean({ force: true }));
    }
    done();
};

const fileIncludeSettings = {
    prefix: '@@',
    basepath: '@file'
};

const plumberNotify = (title) => ({
    errorHandler: notify.onError({
        title: title,
        message: 'Error: <%= error.message %>',
        sound: false,
    })
});

export const htmlDev = () => {
    return gulp
        .src(['src/html/**/*.html', '!src/html/blocks/*.html'])
        .pipe(plumber(plumberNotify("HTML")))
        .pipe(changed('./build/'))
        .pipe(fileInclude(fileIncludeSettings))
        .pipe(gulp.dest('build/'));
};

export const sassDev = () => {
    return gulp
        .src('src/scss/*.scss')
        .pipe(changed('build/css/'))
        .pipe(plumber(plumberNotify("SCSS")))
        .pipe(sourceMaps.init())
        .pipe(sassGlob())
        .pipe(scss())
        .pipe(sourceMaps.write())
        .pipe(gulp.dest('build/css/'));
};

export const imagesDev = () => {
    return gulp
        .src('src/img/**/*', { encoding: false })
        .pipe(changed('build/img/'))
        .pipe(imagemin({ verbose: true }))
        .pipe(gulp.dest('build/img/'));
};

export const jsDev = () => {
    return gulp
        .src('./src/js/*.js')
        .pipe(plumber(plumberNotify("JS")))
        .pipe(babel())
        .pipe(webpack(webpackConfig))
        .pipe(gulp.dest('build/js/'));
};

const serverOptions = {
    livereload: true,
    open: true,
};

export const serverDev = () => {
    return gulp.src('./build/').pipe(server(serverOptions));
};

export const watchDev = () => {
    gulp.watch('./src/scss/**/*.scss', sassDev);
    gulp.watch('./src/**/*.html', htmlDev);
    gulp.watch('./src/img/**/*', imagesDev);
    gulp.watch('./src/js/**/*.js', jsDev);
};

// Добавляем дополнительную функцию, которая сигнализирует о завершении задачи
export const defaultTask = gulp.series(cleanDev, gulp.parallel(htmlDev, sassDev, imagesDev, jsDev), gulp.parallel(serverDev, watchDev));

export default defaultTask;
