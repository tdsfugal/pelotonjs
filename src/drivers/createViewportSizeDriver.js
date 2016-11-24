

import { fromEvent, startWith, skipRepeats } from 'most'
import hold                                  from '@most/hold'
import { EventEmitter }                      from 'events'

export function createViewportSizeDriver () {

  const sizeEmitter = new EventEmitter()

  window.onresize = function(e) {
    sizeEmitter.emit("size", [e.target.innerWidth, e.target.innerHeight])
  }

  const size$ = fromEvent("size", sizeEmitter)
    .startWith([ window.innerWidth, window.innerHeight ])
    .skipRepeats()
    .thru(hold)

  return () => size$
}
