import gulp from 'gulp'
import babel from 'gulp-babel'
import gulpIf from 'gulp-if'
import through from 'through2'
import findup from 'findup-sync'
import nodePath from 'path'
//import debug from 'gulp-debug'
import childProcess from 'child_process'
import fs from 'fs'
import {Readable} from 'stream'
import gutil from 'gulp-util'
import shell from 'gulp-shell'

gulp.task('build', ['install-deps', 'compile-src'])

gulp.task('install-deps', ['create-release-package'], shell.task('npm install', {cwd: 'dist'}))

gulp.task('compile-src', function() {
  const packages = getPackageJsons('src')
  return gulp.src(['src/**/*'])
    .pipe(gulpIf('**/*.js', babel()))
    .pipe(rebaseToPackageJson(packages))
    .pipe(gulp.dest('dist/node_modules'))
})

gulp.task('create-release-package', function() {
  const packages = getPackageJsons('src')
  const releasePackageJson = JSON.stringify(getReleasePackage(packages), null, 2)
  return createVinylFileStreamForString('package.json', releasePackageJson)
    .pipe(gulp.dest('dist'))
})

//
// This function flattens the vinyl files based on the nearest package.json:
//
// [15:34:06] gulp-debug:
// cwd:   ~/workspace/balance-react
// base:  ~/workspace/balance-react/src/
// path:  ~/workspace/balance-react/src/components/test/testView.js
//
// with nearest `package.json` at `~/workspace/balance-react/src/test/package.json` and the package is named `@allovue/test` to
//
// [15:34:06] gulp-debug:
// cwd:   ~/workspace/balance-react
// base:  ~/workspace/balance-react/src/
// path:  ~/workspace/balance-react/src/@allovue/test/testView.js
//
function rebaseToPackageJson(packages) {
  return through.obj(function(file, encoding, emitFileToStream) {
    if (!file.isNull()) {
      const nearestPackageJsonPath = findup('package.json', {cwd: nodePath.dirname(file.path)})
      const packageName = packages[nodePath.relative(file.cwd, nearestPackageJsonPath)].name
      const filePathInternalToPackage = nodePath.relative(nodePath.dirname(nearestPackageJsonPath), file.path)
      const newFilePath = nodePath.join(file.base, packageName, filePathInternalToPackage)
      file.path = newFilePath
      emitFileToStream(null, file)
    } else {
      emitFileToStream(null, null)
    }
  })
}

// returns a object where the key is a package.json path and the object is the contents of the package.json
function getPackageJsons(path) {
  const packagePaths = childProcess.execSync(`find ${path} -name package.json`).toString().split('\n')
  const packages = packagePaths
    .filter((path)=>path.length)
    .reduce((packagesAcc, path)=> {
      packagesAcc[path] = JSON.parse(fs.readFileSync(path, 'utf8'))
      return packagesAcc
    }, {})
  return packages
}

function getReleasePackage(packages) {
  return Object.keys(packages)
    .reduce((releasePackage, packagePath) => {
      const {dependencies={}, devDependencies={}} = packages[packagePath]

      releasePackage.dependencies = Object.keys(dependencies).reduce((dependeciesAcc, moduleName)=>{
        const moduleVersion = dependencies[moduleName]
        const prevModuleVersion = dependeciesAcc[moduleName]
        if (prevModuleVersion && prevModuleVersion !== moduleVersion) {
          throw new Error(`dependency "${moduleName}" : "${moduleVersion}" in "${packagePath}" conflicts with previously required version "${prevModuleVersion}"`)
        }
        dependeciesAcc[moduleName] = moduleVersion
        return dependeciesAcc
      }, releasePackage.dependencies)

      releasePackage.devDependencies = Object.keys(devDependencies).reduce((dependeciesAcc, moduleName)=>{
        const moduleVersion = devDependencies[moduleName]
        const prevModuleVersion = dependeciesAcc[moduleName]
        if (prevModuleVersion && prevModuleVersion !== moduleVersion) {
          throw new Error(`devDependency "${moduleName}" : "${moduleVersion}" in "${packagePath}" conflicts with previously required version "${prevModuleVersion}"`)
        }
        dependeciesAcc[moduleName] = moduleVersion
        return dependeciesAcc
      }, releasePackage.devDependencies)

      return releasePackage
    }, {
      name: 'release',
      version: '0.0.1',
      dependencies: {},
      devDependencies: {},
    })
}

function createVinylFileStreamForString(filename, contentString) {
  const src = Readable({ objectMode: true })
  src._read = function() {
    this.push(new gutil.File({
      cwd: '',
      base: '',
      path: filename,
      contents: new Buffer(contentString),
    }))
    this.push(null)
  }
  return src
}
