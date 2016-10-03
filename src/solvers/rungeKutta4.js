


/*

Classic Runge-Kutta 4 stage solver, aka RK4

xn+1 = xn + h⁄6 (a + 2 b + 2 c + d) where

a = f (tn, xn)
b = f (tn + h⁄2, xn + h⁄2 a)
c = f (tn + h⁄2, xn + h⁄2 b)
d = f (tn + h, xn + h c)

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
      const h2     = h/2
      const h6     = h/6
      const f      = func

      // if h is not OK then loop in place until it is
      if ( !(h > 0) ) return {
        seed: [x, xd],
        value: [x, xd]
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

    }, initial
  )

}
