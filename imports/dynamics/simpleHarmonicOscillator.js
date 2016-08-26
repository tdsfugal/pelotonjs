

import { just }   from 'most'

export function simpleHarmonicOscillator (clock$, goalState$ ) {

  if(true) return just(1)
  
  const beta   = 0    // damping coefficient
  const omega0 = 1    // natural frequency (undamped)

  const x0     = options.initialPosition ? options.initialPosition : 0
  const v0     = options.initialVelocity ? options.initialVelocity : 0

  const dynamicState$ = goalState$.loop(
    ( initialState, goal) => {

      // Create a clock
      const tick$ = just(0)

      // Create a stream that calculates the motion
      const dynamic$ = tick$.loop(
        ( old, tick) => {
          // ignore tick
          const t = (new Date).getTime()
          const x = old[1] + (t-old[0]) * old[2]
          const v = old[2]
          return { seed: [t, x, v], value: x }
        }, [(new Date).getTime(), 0, 0]
      )
      // Pack and ship
      return { seed: [0 , 0], value: dynamic$}
    },
    [ t0, x0 , v0 ]
  )

  return dynamicState$.switch()  // piecewise solution
}
