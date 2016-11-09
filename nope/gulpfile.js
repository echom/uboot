/* eslint-env node */
/* eslint-disable camelcase */

var fs = require('fs'),
    del = require('del'),
    exec = require('child_process').exec,
    gulp = require('gulp'),
    gzip = require('gulp-gzip'),
    karma = require('karma'),
    gutil = require('gulp-util'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    eslint = require('gulp-eslint'),
    uglify = require('uglify-js'),
    minify = require('gulp-uglify/minifier'),
    karmaConfigure = require('../tools/karma-configure'),
    jsdocConfigure = require('../tools/jsdoc-configure');

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
    .pipe(minify({
      mangle: true,
      output: { max_line_len: 300 },
      compress: { hoist_vars: true }
    }, uglify))
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
    browsers: ['Chrome'],
    reporters: ['coverage'],
    coverageReporter: {
      type: 'html',
      dir: 'dist/coverage',
      subdir: browser => browser.toLowerCase().split(/[ /-]/)[0]
    },
    src: paths.src,
    mocks: paths.mocks,
    specs: paths.specs,
    singleRun: true
  }), done).start();
});

gulp.task('unit:live', done => {
  new karma.Server(karmaConfigure({
    browsers: ['Chrome'],
    reporters: ['coverage'],
    coverageReporter: { type: 'text' },
    src: paths.src,
    mocks: paths.mocks,
    specs: paths.specs
  }), done).start();
});

gulp.task('document', function(done) {
  var conf = jsdocConfigure({
    src: paths.src.concat(['package.json']),
    destination: 'dist/docs',
    template: {
      path: '../tools/jsdoc'
    },
    opts: { mode: 'public' }
  });

  exec('../node_modules/.bin/jsdoc -c ' + conf, function(err, stdout, stderr) {
    stdout && console.log(stdout);  // eslint-disable-line
    stderr && console.log(stderr);  // eslint-disable-line
    fs.unlink(conf);
    done(err);
  });
});

gulp.task('default', ['build', 'unit:dist', 'document']);
