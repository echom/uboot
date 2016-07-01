/* eslint-env node */

var gulp = require('gulp'),
    exec = require('child_process').exec;


gulp.task('build:nope', done => {
  exec('gulp build --gulpfile nope/gulpfile.js --cwd nope', function(err, stdout, stderr) {
    stdout && console.log(stdout); // eslint-disable-line no-unused-expressions, no-console
    stderr && console.log(stderr); // eslint-disable-line no-unused-expressions, no-console
    done(err);
  });
});
gulp.task('build:app', done => {
  exec('gulp build --gulpfile app/gulpfile.js', function(err, stdout, stderr) {
    stdout && console.log(stdout); // eslint-disable-line no-unused-expressions, no-console
    stderr && console.log(stderr); // eslint-disable-line no-unused-expressions, no-console
    done(err);
  });
});
gulp.task('build:electron', done => {
  exec('gulp build --gulpfile app-electron/gulpfile.js', function(err, stdout, stderr) {
    stdout && console.log(stdout); // eslint-disable-line no-unused-expressions, no-console
    stderr && console.log(stderr); // eslint-disable-line no-unused-expressions, no-console
    done(err);
  });
});
gulp.task('build:web', done => {
  exec('gulp build --gulpfile app-web/gulpfile.js', function(err, stdout, stderr) {
    stdout && console.log(stdout); // eslint-disable-line no-unused-expressions, no-console
    stderr && console.log(stderr); // eslint-disable-line no-unused-expressions, no-console
    done(err);
  });
});

gulp.task('build', ['build:nope', 'build:app', 'build:electron', 'build:web'], () => {
  gulp.src('nope/dist/*.js')
    .pipe(gulp.dest('app/dist'))
    .pipe(gulp.dest('app-electron/dist'))
    .pipe(gulp.dest('app-web/dist'));

  gulp.src('app/dist/**/*.*')
    .pipe(gulp.dest('app-electron/dist'))
    .pipe(gulp.dest('app-web/dist'));
});

gulp.task('watch', ['build'], () => {
  gulp.watch([
    'nope/src/**/*.js',
    'app/src/**/*.js',
    'app/assets/**/*.css',
    'app-electron/src/**/*.js',
    'app-web/src/**/*.js'
  ], ['build']);
});

gulp.task('default', ['build']);
