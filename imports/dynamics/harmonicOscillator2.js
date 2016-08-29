
import { combine, just, merge, zip }   from 'most'
import hold                     from '@most/hold'
import proxy                    from 'cycle-proxy/most'

import { simpleClock }          from '../clocks/simple/simpleClock.js'
import rungeKutta               from '../solvers/rungeKuttaMidpoint.js'

function initValue(opt, def) {
  if (opt != undefined && opt != null) return opt
  return def
}

const START = "Start"
const STOP  = "Stop"
const END   = "End"

function rollingSum (state, x) {
  // do the adds
  var newSum = state[0] + x
  var newArr = state[1].concat(x)
  // if rolling, do the removes
  if (newArr.length > 10) {
    newSum -= newArr[0]
    newArr = newArr.slice(1,100)
  }
  // pack and ship
  return [ newSum, newArr ]
}

export function harmonicOscillator (trigger$, options = {} ) {

  // Parameter sources; implies piecewise continuous ODE
  const restPos$ = hold(options.restPos$ ? options.restPos$  : just(0))

  // Parameter constants (this would be so much easier in CoffeeScript)
  const initPos   = initValue(options.initPos, 0)    // pixels... Could be a problem
  const initVel   = initValue(options.initVel, 0)    // pixels/sec... same problem
  const damping   = initValue(options.damping, 1)    // Damping ratio; 1=critical, 0=none
  const frequency = initValue(options.frequency, 1)  // Undamped frequency, Hz

  const omega0    = 2 * Math.PI * frequency  // Undamped angular speed

  const beta      = 2 * damping * omega0
  const omega0_2  = omega0 * omega0

  // The governing function defines the ordinary differential equaiton F=MA for a
  // damped, driven harmonic oscillator. When it changes the ODE problem changes.
  //
  // (Note - this function is somewhat analogous to an Action generator in a React/Flux
  //         or React/Redux app. In both cases the function is called to create a concise
  //         description of a desired change. The big difference is that Action generators //         produce Action objects and the governing function generator produces functions)
  //
  function governingFunction ( y_star ) {
    return function f(y, yd) {
      return [
        yd,                                     // Integrate velocity to get position
        - beta * yd - omega0_2 * (y - y_star)   // integrate acceleration to get velocity
      ]                                         //   where Accel = F/M = (-beta*rd ...)
    }
  }

  // The function stream computes the integration function.  This only needs to change when
  // the parameters for the function change, so it is cached in its own stream.
  const func$ = restPos$.map(governingFunction)

  // Build the control stream.
  const start$   = func$.constant(START)  // START whenever the governing equation changes
  const stopP$   = proxy()                // Proxy for "no movement" STOP stream
  const control$ = merge(start$, stopP$)

  // simple clock ticks every animation frame after it has been "Start"-ed
  // and stops ticking when "Stop"-ed.  Emit only the delta time values.
  const delT$ = simpleClock(trigger$, control$)
    .map( t => t[0]/1000)  // delta time, seconds.

  // Pulse produces a [ delta time, integration function ] pair on every clock tick
  const pulse$  = zip(
    ( h, f) => {
      return [ h, f ]  // zip time interval and integration function together
    },
    delT$,
    delT$.sample( ( f ) => f, func$ )
  ).until(control$.filter( x => x == END))      // until done

  // State steps the ODE once with every pulse.  This computes F=MA for the oscillator.
  const state$ = rungeKutta( pulse$, [ initPos, initVel ] )

  // stop$ emits "Stop" when the solution converges, defined as when the
  // rolling sum of |speed| values is very small.
  const stop$ = state$
    .scan(
      (rs, s) => rollingSum(rs, Math.abs(s[1])),  // Adds last n speed values together
      [ 0, [] ]                                   // Initial state
    ).map( rs => rs[0] < 0.01) // termination criteria; true if rolling speed sum is small
    .skipRepeats()             // Only need one true, so ignore the rest. Resets with a false.
    .filter( x => x )          // Only let through the true values. False means it's moving.
    .map( x => STOP)           // Convert true events to stop messages
    .thru(stopP$.proxy)        // The output.  Passes events into stopP$
    .subscribe({               // Required to activate stop$
      start: (s) => null,
      next: (v) => null,
      complete: (cv) => null,
      error: (ev) => null
    })

  return { state$, control$ }
}
