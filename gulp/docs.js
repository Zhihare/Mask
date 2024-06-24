import gulp from 'gulp';
import fileInclude from 'gulp-file-include';
import * as sass from 'sass';
import gulpSass from 'gulp-sass';
import webpCss from 'gulp-webp-css';
import csso from 'gulp-csso';
import sassGlob from 'gulp-sass-glob';
import server from 'gulp-server-livereload';
import clean from 'gulp-clean';
import sourceMaps from 'gulp-sourcemaps';
import groupMedia from 'gulp-group-css-media-queries';
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import webpack from 'webpack-stream';
import fs from 'fs';
import babel from 'gulp-babel';
import webp from 'gulp-webp';
import imagemin from 'gulp-imagemin';
import htmlclean from 'gulp-htmlclean';
import webpHTML from 'gulp-webp-html';

import { config as webpackConfig } from '../webpack.config.js';

const scss = gulpSass(sass);

export const cleanDocs = (done) => {
  if (fs.existsSync('./docs/')) {
    return gulp.src('./docs/', { read: false }).pipe(clean({ force: true }));
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

export const htmlDocs = () => {
  return gulp
     .src(['src/html/**/*.html','!src/html/blocks/*.html'])
    .pipe(plumber(plumberNotify("HTML")))
    .pipe(fileInclude(fileIncludeSettings))
    .pipe(webpHTML())  // Добавляем эту строку
    .pipe(htmlclean())
    .pipe(gulp.dest('docs/'));
};

export const sassDocs = () => {
  return gulp
    .src('src/scss/*.scss')
    .pipe(plumber(plumberNotify("SCSS")))
    .pipe(sourceMaps.init())
      .pipe(sassGlob())
      .pipe(webpCss())
    .pipe(groupMedia())
    .pipe(scss())
    .pipe(csso())
    .pipe(sourceMaps.write())
    .pipe(gulp.dest('docs/css/'));
};

export const imagesDocs = () => {
  return gulp
    .src('src/img/**/*', { encoding: false })
    .pipe(webp())
    .pipe(gulp.dest('docs/img/'))
    .pipe(gulp.src('src/img/**/*', { encoding: false }))
    .pipe(imagemin({ verbose: true }))
    .pipe(gulp.dest('docs/img/'));
};

export const jsDocs = () => {
  return gulp
    .src('./src/js/*.js')
    .pipe(plumber(plumberNotify("JS")))
    .pipe(babel())
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest('docs/js/'));
};

const serverOptions = {
  livereload: true,
  open: true,
};

export const serverDocs = () => {
  return gulp.src('./docs/').pipe(server(serverOptions));
};
