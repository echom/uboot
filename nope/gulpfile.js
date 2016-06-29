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
    uglify = require('gulp-uglify'),
    karmaConfigure = require('../tools/karma-configure');

var paths = {
  src: [
    'src/nope.js',
    'src/*/**/*.js'
  ],
  min: 'dist/app.min.js',
  max: 'dist/app.js',
  mocks: 'test/**/*.mock.js',
  specs: 'test/**/*.spec.js'
};

gulp.task('clean', () => del(['dist/*']));

gulp.task('build', ['clean'], () => {
  return gulp.src(paths.src)
    .pipe(eslint({ useEslintrc: true }))
    .pipe(eslint.format())
    .pipe(concat('nope.js'))
    .pipe(gulp.dest('dist'))
    .pipe(uglify({
      mangle: true,
      output: { max_line_len: 300 },
      compress: { hoist_vars: true }
    }))
    .on('error', gutil.log)
    .pipe(rename('nope.min.js'))
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
