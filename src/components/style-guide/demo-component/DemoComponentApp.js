import {PropTypes} from "react"
import DemoComponentView from "./DemoComponentView"
import {compose, setPropTypes, withState, mapPropsOnChange} from "recompose"

export default compose(
  setPropTypes({
    view: PropTypes.node.isRequired,
    fixtures: PropTypes.arrayOf(PropTypes.object.isRequired),
  }),
  mapPropsOnChange(["view"], ({view})=> {
    return {
      View: view,
      title: view.displayName || view.name || "Unknown Component",
    }
  }),
  withState("props", "setProps", ({fixtures})=>fixtures ? fixtures[0].props : {}),
  mapPropsOnChange(["setProps"], ({setProps})=>{
    return {
      chooseFixture: (fixture)=>setProps(()=>fixture.props),
    }
  })
)(DemoComponentView)
