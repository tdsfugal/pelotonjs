

import { observe, just }                       from 'most'
import { createAnimationTrigger }              from '../drivers/createAnimationTrigger.js'
import { harmonicOscillator }                  from './harmonicOscillator.js'

const trigger$ = createAnimationTrigger()()

const control$ = just("End").delay(2000).startWith("Start").delay(5000)

const restPos$ = just(0).multicast()


//trigger$.observe( x => console.log("Trigger = " + x))
control$.observe( x => console.log("Control = " + x))
restPos$.observe( x => console.log("RestPos = " + x))

const states$ = harmonicOscillator(trigger$, control$, {
  restPos$    : restPos$,
  initPos     : 1,
  initVel     : 0,
  damping     : 0,       // 1 is critically damped, 0 is not damped
  frequency   : 2        // Hz
})

states$.observe( x => console.log(x))


console.log("loaded")
