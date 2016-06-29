/* eslint-env node */

var gulp = require('gulp'),
    exec = require('child_process').exec,
    watch = require('gulp-watch');


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

gulp.task('build', ['build:nope', 'build:app'], () => {
  gulp.src('nope/dist/*js')
    .pipe(gulp.dest('app/dist'));
});

gulp.task('watch', () => {
  gulp.watch(['nope/src/**/*.js', 'app/src/**/*.js'], ['build']);
});

gulp.task('default', ['build']);
