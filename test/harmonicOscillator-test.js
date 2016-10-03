

import { observe, just }                       from 'most'
import { createAnimationTrigger }              from '../drivers/createAnimationTrigger.js'
import { harmonicOscillator }                  from './harmonicOscillator2.js'

const trigger$ = createAnimationTrigger()()

const restPos$ = just(1)

const { state$, control$ } = harmonicOscillator(trigger$, {
  restPos$    : restPos$,
  initPos     : 1,
  initVel     : 0,
  damping     : 1,       // 1 is critically damped, 0 is not damped
  frequency   : 2        // Hz
})

state$.observe ( x => console.log(x))
control$.observe( x => console.log("Control = " + x))

console.log("loaded")
