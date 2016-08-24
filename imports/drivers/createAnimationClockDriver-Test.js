

import { periodic, observe, just }               from 'most'

import most               from 'most'

import { createAnimationClockDriver }   from './createAnimationClockDriver.js'

console.log(most)

const controlSignal$ = periodic(1000, true).loop(
  (s,x) => {
    let v = s ? "Start" : "Stop"
    return { seed: !s , value: v }
  }, true ).delay(1000).take(6).concat( just("End") )

controlSignal$.observe( c => console.log(c))

const animationClock = createAnimationClockDriver()

const source$ = animationClock(controlSignal$)

source$.observe( x => console.log(x))
