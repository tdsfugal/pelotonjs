

const animationClock = createAnimationClockDriver()

const tick$ = animationClock(controlSignal$)

tick$.observe( x => console.log(x))

import { generate, never, empty, just }       from 'most'


//Create universal requestAnimationFrame and cancelAnimationFrame functions
const requestAnimationFrame = window.requestAnimationFrame
  || window.mozRequestAnimationFrame
  || window.webkitRequestAnimationFrame
  || window.msRequestAnimationFrame
  || function(f){return setTimeout(f, 1000/60)} // simulate 60 Hz callbacks

const cancelAnimationFrame = window.cancelAnimationFrame
  || window.mozCancelAnimationFrame
  || function(requestID){clearTimeout(requestID)} //fall back


export function createAnimationClockDriver() {
  return function animationClock(control$) {

    let running     = false  // enables infinite while loop while clock running
    let terminated  = false  // Clock is terminated when true. Irrevokable.
    let last        = 0

    const clock$ = control$.map( command => {
      if (terminated) return empty()

      switch(command) { // map commands to time-stamp streams.

        case "Start":
          running = true  // flag to stop the infinite while loop
          function* tick() {
            let first = true
            while (running) {
              yield new Promise( resolve => {  // no need for reject
                requestAnimationFrame( (timeStamp) => {
                  if (first) {
                    first = false
                    last = timeStamp
                    resolve(["Start",timeStamp])
                  } else {
                    let delta = timeStamp-last
                    last = timeStamp
                    resolve([delta, timeStamp])
                  }
                })
              })
            }
          }
          return generate(tick) // emits time stamps from animation frame

        case "End":
          running = false
          terminated = true
          return just(["End",last])

        default:  // Includes "Stop"
          running = false
          return never().startWith(["Stop",last])
      }
    }).switch()  // emit only the most recent clock's events

    return clock$
  }
}
