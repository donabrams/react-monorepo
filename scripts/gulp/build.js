import gulp from "gulp"
import babel from "gulp-babel"
//import debug from "gulp-debug"
import gulpIf from "gulp-if"
import shell from "gulp-shell"
import {rebaseToPackageJson, getPackageJsons, getReleasePackage, createVinylFileStreamForString} from "./helpers"

gulp.task("build", ["install-deps", "compile-src"])

gulp.task("install-deps", ["create-release-package"], shell.task("npm install", {cwd: "dist"}))

gulp.task("compile-src", function() {
  const packages = getPackageJsons("src")
  return gulp.src(["src/**/*"])
    .pipe(gulpIf("**/*.js", babel()))
    .pipe(rebaseToPackageJson(packages))
    .pipe(gulp.dest("dist/node_modules"))
})

gulp.task("create-release-package", function() {
  const packages = getPackageJsons("src")
  const releasePackageJson = JSON.stringify(getReleasePackage(packages), null, 2)
  return createVinylFileStreamForString("package.json", releasePackageJson)
    .pipe(gulp.dest("dist"))
})
