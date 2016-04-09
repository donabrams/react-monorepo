import React, {PropTypes} from 'react'

export default function TestView({a, b}) {
  return (
    <div>
      <span>{a}</span>
      <div>{b}</div>
    </div>
  )
}

TestView.propTypes = {
  a: PropTypes.string,
  b: PropTypes.string.isRequired,
}
