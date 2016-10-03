

import { createAnimationClockDriver }   from './createAnimationClockDriver.js'

const animationClock = createAnimationClockDriver()

const tick$ = animationClock()

tick$.observe( x => console.log(x))
