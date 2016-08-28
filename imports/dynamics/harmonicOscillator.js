
import { combine, just, zip }   from 'most'
import hold                     from '@most/hold'

import { simpleClock }          from '../clocks/simple/simpleClock.js'
import rungeKutta               from '../solvers/rungeKuttaMidpoint.js'

export function harmonicOscillator (trigger$, control$, options = {} ) {

  console.log(options)

  // Parameter sources; implies piecewise continuous ODE
  const restPos$ = hold(options.restPos$ ? options.restPos$  : just(0))

  // Parameter constants (this would be so much easier in CoffeeScript)
  let initPos = 0         // pixels... Could be a problem
  if (options.initPos != undefined && options.initPos != null) {
    initPos = options.initPos
  }

  let initVel = 0         // pixels/sec... same problem
  if (options.initVel != undefined && options.initVel != null) {
    initVel = options.initVel
  }

  let damping = 1         // Damping ratio;  critical = 1, undamped = 0
  if (options.damping != undefined && options.damping != null) {
    damping = options.damping
  }

  let frequency = 1       // Undamped frequency, Hz
  if (options.frequency != undefined && options.frequency != null) {
    frequency = options.frequency
  }

  const omega0    = 2 * Math.PI * frequency  // Undamped angular velocity

  const beta      = 2 * damping * omega0
  const omega0_2  = omega0 * omega0

  // simple clock ticks every animation frame after it has been "Start"-ed
  const delT$ = simpleClock(trigger$, control$)
    .map( t => t[0]/1000)  // delta time, seconds.  Absolute time is implicit.

  // The function stream computes the integration function.  This only needs to change when
  // the parameters for the function change, so it is cached in its own stream.
  const func$ = hold(
    restPos$.map(
      ( y_star ) => {
        return function f(y, yd) {
          return [
            yd,                                     // Integrate velocity to get position
            - beta * yd - omega0_2 * (y - y_star)   // integrate acceleration to get velocity
          ]                                         //   where Accel = F/M = (-beta*rd ...)
        }
      }
    )
  )

  // Every pulse emits a [ delta time, integration function ] pair for the ODE solver to evaluate
  const pulse$  = zip(
    ( h, f) => {
      return [ h, f ]  // zip time interval and integration function together
    },
    delT$,
    delT$.sample( ( f ) => f, func$ )
  ).until(control$.filter( x => x == "End"))      // until done

  // State is the physics event loop.  Every time PulseS pulses State$ executes one loop.
  // Each loop is a time step computation of the ordinary differential equation F=MA.
  const state$ = rungeKutta( pulse$, [ initPos, initVel ] )

  return state$
}
