/*global require*/
import StyleGuidePage from "@donabrams/style-guide-page"

export default {
  route: "/style-guide",
  template: StyleGuidePage,
  topLevelEnv: ({packages})=>({
    props: {
      components: getStyleDataFromPackages(packages),
    },
  }),
}

function getStyleDataFromPackages(packages) {
  return packages.filter((pkg)=>pkg.styleLibrary)
    .map((pkg)=>({
      title: `${pkg.styleLibrary.title} - ${pkg.name}@${pkg.version}`,
      fixtures: pkg.styleLibrary.fixtures.indexOf("./") === 0
        ? require(`${pkg.name}${pkg.styleLibrary.fixtures.substr(1)}`)
        : require(pkg.styleLibrary.fixtures),
      view: require(`${pkg.name}${pkg.main.substr(1)}`),
    }))
    .sort((a, b)=>a.title < b.title ? -1 : 1)
}
