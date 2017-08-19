 
# Peloton Docs

## API

### Drivers

Since virtually everything in Peloton exists in time and space these two drivers will be found in nearly every Cycle.js application that implements peloton. 

#### ViewportSizeDriver
The viewportSizeDriver reponds to resize events in the browser window. 

#### AnimationTrigger
Animation trigger produces a [ deltaTime, absoluteTime ] pair every time getAnimationFrame fires, or roughly every 16 milliseconds for a 60 hz display. 

### Clocks
There are several clock types in Peloton.  They are all pure functions that accept a trigger stream and a control stream as input and produce a clock stream that emits *tick*s synchronized with the animation trigger. The simplest clock, *simpleClock*,  responds to a control stream by emitting ticks synchronized with the browser's AnimationFrame after receiving a "Start" message, and pausing after receiving a "Stop" message. All clocks terminate with an "End" message. 

```javascript

const control$ = // some stream related to the operational context for the clock

const bigBen$ = SimpleClock(trigger$, control$)   // trigger$ comes from the animationTrigger driver

bigBen$.observe( tick => console.log("DeltaTime = " + tick[0]/1000 + "   AbsoluteTime = " + tick[1]/1000)  // convert millis to seconds

// Control$ emits a "Start", starting the clock stream bigBen$
// > DeltaTime = 0   AbsoluteTime = 2345.xxx                     // On the first tick deltaTime is undefined so a zero is returned
// > DeltaTime = 0.01672...   AbsoluteTime = ...whatever
// > DeltaTime = 0.01681...   AbsoluteTime = ...whatever
// > DeltaTime = 0.01678...   AbsoluteTime = ...whatever
// > DeltaTime = 0.01675...   AbsoluteTime = ...whatever
// Control$ emits a "Stop", pausing the clock stream bigBen$
// 
//  ... time passes
// 
// Control$ emits a "Start"
// > DeltaTime = 0   AbsoluteTime = 9745.xxx                    // DeltaTime is still undefined on the first tick so a zero is returned
// > DeltaTime = 0.01672...   AbsoluteTime = ...whatever
// > DeltaTime = 0.01681...   AbsoluteTime = ...whatever
// > DeltaTime = 0.01678...   AbsoluteTime = ...whatever
// > DeltaTime = 0.01675...   AbsoluteTime = ...whatever

// Control$ emits an "End", terminating bigBen$
// Control$ emits a "Start"
// ... nothing
```
Clocks are the primary control structure in Peloton.  They are embedded in every dynamic function so they rarely have to be explicitly created, but it is important to understand how they are controlled because the control streams are often available outside of the dynamic functions. 

### Dynamics



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
