import React, {PropTypes} from "react"

export default function DemoComponent({chooseFixture, props={}, title, View, fixtures=[]}) {
  return (
    <div>
      <h2>{title}</h2>
      <ul display-if={fixtures.length}>
        {fixtures.map((fixture, i)=>(
          <li key={i} onClick={() => chooseFixture(fixture)}>
            {fixture.label || i}
          </li>
        ))}
      </ul>
      <View {...props} />
    </div>
  )
}

DemoComponent.propTypes = {
  chooseFixture: PropTypes.func.isRequired,
  props: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  View: PropTypes.element.isRequired,

  fixtures: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
  })),
}
