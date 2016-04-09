import gulp from 'gulp'
import eslint from 'gulp-eslint'

gulp.task('lint', function() {
  return gulp.src(['src/**/*.js', 'scripts/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
})
