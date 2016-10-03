
import { never, empty }       from 'most'

export function simpleClock(trigger$, control$) {
  let active = true
  return control$.map( command => {
    if (active) {
      switch(command) {
        case "Start":
          return trigger$
        case "End":
          active = false
          return empty()
        default:  // "Stop"
          return never()
      }
    } else { //inactive
      return empty()
    }
  }).switch()
}
