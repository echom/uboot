/* eslint-env node */

var gulp = require('gulp'),
    exec = require('child_process').exec;


gulp.task('build:nope', done => {
  exec('./node_modules/.bin/gulp build --gulpfile nope/gulpfile.js --cwd nope', function(err, stdout, stderr) {
    stdout && console.log(stdout); // eslint-disable-line no-unused-expressions, no-console
    stderr && console.log(stderr); // eslint-disable-line no-unused-expressions, no-console
    done(err);
  });
});
gulp.task('build:app', done => {
  exec('./node_modules/.bin/gulp build --gulpfile app/gulpfile.js', function(err, stdout, stderr) {
    stdout && console.log(stdout); // eslint-disable-line no-unused-expressions, no-console
    stderr && console.log(stderr); // eslint-disable-line no-unused-expressions, no-console
    done(err);
  });
});
gulp.task('build:electron', done => {
  exec('./node_modules/.bin/gulp build --gulpfile app-electron/gulpfile.js', function(err, stdout, stderr) {
    stdout && console.log(stdout); // eslint-disable-line no-unused-expressions, no-console
    stderr && console.log(stderr); // eslint-disable-line no-unused-expressions, no-console
    done(err);
  });
});
gulp.task('build:web', done => {
  exec('./node_modules/.bin/gulp build --gulpfile app-web/gulpfile.js', function(err, stdout, stderr) {
    stdout && console.log(stdout); // eslint-disable-line no-unused-expressions, no-console
    stderr && console.log(stderr); // eslint-disable-line no-unused-expressions, no-console
    done(err);
  });
});

gulp.task('pull:nope', ['build:nope'], () => {
  gulp.src('nope/dist/**/*.*')
    .pipe(gulp.dest('app-electron/dist'))
    .pipe(gulp.dest('app-web/dist'));
});
gulp.task('pull:app', ['build:app'], () => {
  gulp.src('app/dist/**/*.*')
    .pipe(gulp.dest('app-electron/dist'))
    .pipe(gulp.dest('app-web/dist'));
});

gulp.task('build', ['build:electron', 'build:web', 'pull:nope', 'pull:app']);

gulp.task('watch', ['build'], () => {
  gulp.watch('nope/src/**/*.js', ['pull:nope']);
  gulp.watch('app/src/**/*.js', ['pull:app']);
  gulp.watch('app/assets/**/*.*', ['pull:app']);
  gulp.watch('app-electron/src/**/*.js', ['build:electron']);
  gulp.watch('app-web/src/**/*.js', ['build:web']);
});

gulp.task('default', ['build']);
