 
# Peloton Docs

## Use

First, install the two drivers in the main Cycle.js application:


```javascript

import { 
  createViewportSizeDriver,
  createAnimationTrigger 
}                            from 'peloton'
  
import { makeDOMDriver }     from '@cycle/dom'

function main(sources) {

  //Unpack sources
  const DOM         = sources.DOM
  const vpSize$     = sources.vpSize     // Source only; no sinks associated 
  const trigger$    = sources.trigger    // with either vpSize or trigger
  const ...          // other sources

  ... // do amazing stuff 

  return {
    DOM : vDom$,
    ...             // other sinks
  }
}

function start() {  
  return Cycle.run(main, {
    DOM      : makeDOMDriver('#content'),
    vpSize   : createViewportSizeDriver(),
    trigger  : createAnimationTrigger()
  })
}

const dispose = start()

... // cleanup stuff

```
