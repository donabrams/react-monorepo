import through from "through2"
import findup from "findup-sync"
import nodePath from "path"
import childProcess from "child_process"
import fs from "fs"
import {Readable} from "stream"
import gutil from "gulp-util"

//
// This function flattens the vinyl files based on the nearest package.json:
//
// [15:34:06] gulp-debug:
// cwd:   ~/workspace/react-monorepo
// base:  ~/workspace/react-monorepo/src/
// path:  ~/workspace/react-monorepo/src/components/test/testView.js
//
// with nearest `package.json` at `~/workspace/react-monorepo/src/test/package.json` and the package is named `@donabrams/test` to
//
// [15:34:06] gulp-debug:
// cwd:   ~/workspace/react-monorepo
// base:  ~/workspace/react-monorepo/src/
// path:  ~/workspace/react-monorepo/src/@donabrams/test/testView.js
//
export function rebaseToPackageJson(packages) {
  return through.obj(function(file, encoding, emitFileToStream) {
    if (!file.isNull()) {
      const nearestPackageJsonPath = findup("package.json", {cwd: nodePath.dirname(file.path)})
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
export function getPackageJsons(path) {
  const packagePaths = childProcess.execSync(`find ${path} -name package.json`).toString().split("\n")
  const packages = packagePaths
    .filter((path)=>path.length)
    .reduce((packagesAcc, path)=> {
      packagesAcc[path] = JSON.parse(fs.readFileSync(path, "utf8"))
      return packagesAcc
    }, {})
  return packages
}

// Given a map of packages, returns a new package.json with all the dependencies and devDependencies
// If a dependency differs in any way between packages, throws an error
export function getReleasePackage(packages) {
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
      name: "react-monorepo-release",
      version: "0.0.1",
      dependencies: {},
      devDependencies: {},
    })
}

// creates a stream that emits a single vinyl file with the given filename and contentString
export function createVinylFileStreamForString(filename, contentString) {
  const src = Readable({ objectMode: true })
  src._read = function() {
    this.push(new gutil.File({
      cwd: "",
      base: "",
      path: filename,
      contents: new Buffer(contentString),
    }))
    this.push(null)
  }
  return src
}
