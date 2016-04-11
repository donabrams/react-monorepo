import {PropTypes} from "react"
import StyleGuideView from "./StyleGuideView"
import {compose, setPropTypes, withState, mapPropsOnChange} from "recompose"

export default compose(
  setPropTypes({
    components: PropTypes.array,
  }),
  withState("displayedComponent", "setDisplayedComponent", ({components})=>components ? components[0] : null),
  mapPropsOnChange(["setDisplayedComponent"], ({setDisplayedComponent})=>{
    return {
      chooseComponent: (component) => setDisplayedComponent(()=>component),
    }
  }),
)(StyleGuideView)
