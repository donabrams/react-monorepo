import gulp from 'gulp'
import eslint from 'gulp-eslint'

gulp.task('lint', ['jslint'])

gulp.task('jslint', function() {
  return gulp.src(['src/**/*.js', 'scripts/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
})
