const { src, dest, watch, series, parallel } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync').create();

// Sassのコンパイル（複数対応）
function compileSass() {
  return src('src/scss/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCSS())
    .pipe(dest('dist/css'))
    .pipe(browserSync.stream());
}

// JSの圧縮（複数対応）
function compressJS() {
  return src('src/js/*.js')
    .pipe(uglify())
    .pipe(dest('dist/js'))
    .pipe(browserSync.stream());
}

// HTMLファイルをコピー（複数対応）
function copyHTML() {
  return src('src/*.html')
    .pipe(dest('dist'))
    .pipe(browserSync.stream());
}

// ローカルサーバー＆監視
function serve() {
  browserSync.init({
    server: {
      baseDir: 'dist'
    }
  });

  watch('src/scss/**/*.scss', compileSass);
  watch('src/js/**/*.js', compressJS);
  watch('src/*.html', copyHTML);
}

exports.default = series(
  parallel(compileSass, compressJS, copyHTML),
  serve
);
