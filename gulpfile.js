var gulp = require('gulp');
var concat = require('gulp-concat');

gulp.task('default', () => {
  return gulp.src([
    './src/index.js',
    './src/library.js'
    ])
    .pipe(concat('visua11y.js'))
    .pipe(gulp.dest('content-scripts'));
});
