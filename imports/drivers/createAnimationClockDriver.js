
import { generate, never, empty }       from 'most'


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

  let running = false // stops the inner infinite loop.
  return function animationClock(control$) {

    let active = true     // true until driver is shut down
    let clock = never()   // Initical clock emits nothing

    while (active) {
      control$.map((command) => {
        // Control$ stream events switch the driver on and off
        switch(command) {
          case "Start":  // Start emitting animation frame time stamps
            // Tick is a generator function that emits time stamp promises
            // setting running to false ends the while loop, which shuts down
            // the generator function.
            running = true
            function* tick() {
              while (running) {
                yield new Promise( resolve => {  // no need for reject
                  requestAnimationFrame( (timeStamp) => resolve(timeStamp) )
                })
              }
            }
            clock$ = generate(tick)
            break

          case "End":         // On End, shut everything down.
            running = false
            active = false
            clock$ = empty()  // Emits nothing, stopped.
            break

          default:  // Includes "Stop." Stop the infinite loop in while.
            running = false
            clock$ = never()   // Emits nothing, runs forever.
            break
        }
        return generate(clocks).switch()
      })
    }
  }
}
