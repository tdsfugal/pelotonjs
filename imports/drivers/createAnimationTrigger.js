
import { generate }       from 'most'

//Create universal requestAnimationFrame and cancelAnimationFrame functions
const requestAnimationFrame = window.requestAnimationFrame
  || window.mozRequestAnimationFrame
  || window.webkitRequestAnimationFrame
  || window.msRequestAnimationFrame
  || function(f){return setTimeout(f, 1000/60)} // simulate 60 Hz callbacks

const cancelAnimationFrame = window.cancelAnimationFrame
  || window.mozCancelAnimationFrame
  || function(requestID){clearTimeout(requestID)} //fall back


export function createAnimationTrigger() {
  return function animationTrigger() {

    function* tick() {
      let id, then
      let running = true
      while (running) {
        yield new Promise(
          resolve => {
            id = requestAnimationFrame( (now) => {
              let delta = then ? (now - then) : null
              then = now
              resolve([delta, now])
            })
          },
          reject => {
            if (id) cancelAnimationFrame(id)
            running = false
          }
        )
      }
    }
    // emits a [delta, absolute] time pair every time a promise resolves.
    return generate(tick)
  }
}
