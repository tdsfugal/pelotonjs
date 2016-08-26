

import { periodic, observe, just }             from 'most'
import { createAnimationTrigger }              from '../../drivers/createAnimationTrigger.js'
//import { simpleClock }                         from './simpleClock.js'

const trigger$ = createAnimationTrigger()()
const control$ = periodic(1000, true).loop(
  (s,x) => {
    let v = s ? "Start" : "Stop"
    return { seed: !s , value: v }
  }, true ).delay(500).take(6).concat( just("End") ).multicast()

//trigger$.observe( x => console.log("Trigger = " + x))
control$.observe( x => console.log("Control = " + x))

const clock$ = simpleClock(trigger$, control$)

clock$.observe( x => console.log(x))
