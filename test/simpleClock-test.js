

import { periodic, observe, just }             from 'most'
import { createAnimationTrigger }              from '../../drivers/createAnimationTrigger.js'
import { simpleClock }                         from './simpleClock.js'

const trigger$ = createAnimationTrigger()()

const control$ = periodic(1000, true).loop(
  (s,x) => {
    let v = s ? "Start" : "Stop"
    return { seed: !s , value: v }
  }, true )
  // give the app time to settle down
  .delay(500)
  // Emit three start/stop pairs. Should emit triggers after "Start" and not emit after "Stop"
  .take(6)
  // Terminate the clock.
  .concat( just("End") )
  // Try to start it up again.  Should fail.
  .concat( just("Start").delay(500) )

//trigger$.observe( x => console.log("Trigger = " + x))
control$.observe( x => console.log("Control = " + x))

const clock$ = simpleClock(trigger$, control$)

clock$.observe( x => console.log(x))
