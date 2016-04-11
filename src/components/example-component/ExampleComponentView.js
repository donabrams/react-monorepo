import React, {PropTypes} from "react"

export default function ExampleComponentView({a, b}) {
  return (
    <div>
      <span>{a}</span>
      <div>{b}</div>
    </div>
  )
}

ExampleComponentView.propTypes = {
  a: PropTypes.string,
  b: PropTypes.string.isRequired,
}
