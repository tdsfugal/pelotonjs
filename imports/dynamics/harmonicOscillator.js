
import { combine, just, zip }   from 'most'

import { simpleClock }          from '../clocks/simple/simpleClock.js'

export function harmonicOscillator (trigger$, control$, options = {} ) {

  console.log(options)

  // Parameter sources; implies piecewise continuous ODE
  const restPos$ = options.restPos$ ? options.restPos$  : just(0)

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

  // Every clock tick pulse emits an array of computation inputs
  const pulse$  = zip(
    (t, p) => [t].concat(p),    // zip in the time
    delT$,
    delT$.sample(    // Sample the dynamic parameters every clock tick
      (p) => [p],
      restPos$
    )
  ).until(control$.filter( x => x == "End"))      // until done

  // State is the physics event loop.  Every time PulseS pulses State$ executes one loop.
  // Each loop is a time step computation of the ordinary differential equation F=MA.
  const state$ = pulse$.loop(
    ( [r_0, rd_0], [delT, r_star]) => {

      // Cache some variables for speed.  Also solves some mysterious assignment bugs.
      const x      = r_0
      const xd     = rd_0
      const h      = delT
      const h2     = h/2
      const h6     = h/6
      const y_star = r_star

      // if h is not OK then loop in place until it is
      if ( !(h > 0) ) return {
        seed: [x, xd],
        value: [x, xd]
      }

      // Integration function recieves a vector and produces a vector
      function f(y, yd) {  // explicit time not used by design. External force assumed constant.
        return [
          yd,                                     // Integrate velocity to get position
          - beta * yd - omega0_2 * (y - y_star)   // integrate acceleration to get velocity
        ]                                         //   where Accel = F/M = (-beta*rd ...)
      }

      // Compute the Runge-Kutta variables.
      const a = f( x           , xd           )
      const b = f( x + a[0]*h2 , xd + a[1]*h2 )
      const c = f( x + b[0]*h2 , xd + b[1]*h2 )
      const d = f( x + a[0]*h  , xd + a[1]*h  )

      // integrate to get next velocity and position.
      const r_1   = x  + ( a[0] + 2*b[0] + 2*c[0] + d[0] ) * h6
      const rd_1  = xd + ( a[1] + 2*b[1] + 2*c[1] + d[1] ) * h6

      // pack, ship, and repeat
      const state = [r_1, rd_1]

      return {
        seed: state,
        value: state
      }

    }, [initPos, initVel]
  )

  return state$
}

/*

xn+1 = xn + h⁄6 (a + 2 b + 2 c + d) where
a = f (tn, xn)
b = f (tn + h⁄2, xn + h⁄2 a)
c = f (tn + h⁄2, xn + h⁄2 b)
d = f (tn + h, xn + h c)

*/
