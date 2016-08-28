


/*
Euler method:

xn+1 = xn + h * a where

a = f (tn, xn)

This version only computes for state = [pos, vel].  A more general form would be nice but it
adds additional operations that just aren't needed with the harmonic oscillator.

*/


export default function ( pulse$, initial ) {

  return pulse$.loop(
    ( [r_0, rd_0], [delT, func ]) => {

      // Cache some variables for speed.  Also solves some mysterious assignment bugs.
      const x      = r_0
      const xd     = rd_0
      const h      = delT
      const f      = func

      // if h is not OK then loop in place until it is
      if ( !(h > 0) ) return {
        seed: [x, xd],
        value: [x, xd]
      }

      // Compute the Runge-Kutta variables.
      const a = f( x           , xd           )

      // integrate to get next velocity and position.
      const r_1   = x  + a[0] * h
      const rd_1  = xd + a[1] * h

      // pack, ship, and repeat
      const state = [r_1, rd_1]

      return {
        seed: state,
        value: state
      }

    }, initial
  )

}
