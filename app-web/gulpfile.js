/* eslint-env node */
/* eslint-disable camelcase */

var del = require('del'),
    karma = require('karma'),
    gulp = require('gulp'),
    gzip = require('gulp-gzip'),
    gutil = require('gulp-util'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    eslint = require('gulp-eslint'),
    uglify = require('uglify-js'),
    minify = require('gulp-uglify/minifier'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    cssnano = require('cssnano'),
    karmaConfigure = require('../tools/karma-configure');

var paths = {
  src: [
    'src/**/*.js'
  ],
  min: 'dist/web.min.js',
  max: 'dist/web.js',
  mocks: 'src/**/*.mock.js',
  specs: 'src/**/*.spec.js'
};

gulp.task('clean', () => del(['dist/web.js', 'dist/web.min.js', 'dist/web.css']));

gulp.task('copy-assets', ['clean'], () => {
  return gulp.src('assets/*.css')
    .pipe(concat('web.css'))
    .pipe(postcss([
      autoprefixer({ browsers: ['last 1 version'] }),
      cssnano()
    ]))
    .pipe(gulp.dest('dist/assets'));
});

gulp.task('build', ['clean', 'copy-assets'], () => {
  return gulp.src(paths.src)
    .pipe(eslint({ useEslintrc: true }))
    .pipe(eslint.format())
    .pipe(concat('web.js'))
    .pipe(gulp.dest('dist'))
    .pipe(minify({
      mangle: true,
      output: { max_line_len: 300 },
      compress: { hoist_vars: true }
    }, uglify))
    .on('error', gutil.log)
    .pipe(rename('web.min.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('gzip', ['build'], () => {
  gulp.src(paths.min)
    .pipe(gzip())
    .pipe(gulp.dest('dist'));
});

gulp.task('unit:dist', ['unit:coverage', 'build'], done => {
  new karma.Server(karmaConfigure({
    browsers: ['PhantomJS'],
    reporters: ['dots'],
    src: paths.min,
    mocks: paths.mocks,
    specs: paths.specs,
    singleRun: true
  }), done).start();
});

gulp.task('unit:coverage', done => {
  new karma.Server(karmaConfigure({
    browsers: ['PhantomJS'],
    reporters: ['coverage'],
    coverageReporter: { type: 'html', dir: 'dist/coverage' },
    src: paths.src,
    mocks: paths.mocks,
    specs: paths.specs,
    singleRun: true
  }), done).start();
});

gulp.task('unit:live', done => {
  new karma.Server(karmaConfigure({
    browsers: ['PhantomJS'],
    reporters: ['dots', 'coverage'],
    coverageReporter: { type: 'text' },
    src: paths.src,
    mocks: paths.mocks,
    specs: paths.specs
  }), done).start();
});

gulp.task('unit:debug', done => {
  new karma.Server(karmaConfigure({
    browsers: ['Chrome'],
    src: paths.src,
    mocks: paths.mocks,
    specs: paths.specs
  }), done).start();
});

gulp.task('default', ['build', 'unit:dist']);
