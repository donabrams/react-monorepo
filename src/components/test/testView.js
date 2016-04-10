// @flow

import React, {PropTypes} from 'react'

type TestViewProps = {
  a: string;
  b: boolean;
};

export default function TestView({a, b}: TestViewProps): React.Element {
  return (
    <div>
      <span>{a}</span>
      <div>{b}</div>
    </div>
  )
}

const testClass = <TestView foo="string" /> // should error
