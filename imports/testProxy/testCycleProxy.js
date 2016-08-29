

import proxy     from 'cycle-proxy/most'

import { periodic }  from 'most'

const trigger$ = periodic(1000, 1)
  .scan( (s, t) => s + t, 0)
  .take(10)

const p$ = proxy()

const x$ = trigger$.until(p$)

const y$ = x$
  .scan( (s, x) => s + x, 0 )
  .map( sum => sum >= 15)
  .filter( b => b )
  .skipRepeats()
  .thru(p$.proxy)

x$.observe( x => console.log("X: " + x))
y$.observe( y => console.log("Y: " + y))
p$.observe( p => console.log("P: " + p))
