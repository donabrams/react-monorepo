import React, {PropTypes} from "react"
import DemoComponent from "@donabrams/demo-component"

export default function StyleGuideView({chooseComponent, components=[], displayedComponent}) {
  return (
    <div>
      <h1>Style Guide</h1>
      <nav>
        <ul>
          {components.map(component=>(
            <li key={component.label}  href={`#${component.label}`} id={component.label} onClick={()=>chooseComponent(component)}>
              {component.label}
            </li>
          ))}
        </ul>
      </nav>
      <section className="demoSpace">
        <DemoComponent {...displayedComponent} />
      </section>
    </div>
  )
}

StyleGuideView.propTypes = {
  chooseComponent: PropTypes.func.isRequired,
  components: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
  })),
  displayedComponent: PropTypes.any,
}
