
# Peloton.js

[Peloton is very much a work in progress. The concepts and API will change rapidly until I can figure out what works and what doesn't work.]

##Overview
Peloton is an experiment in stream-based, FRP physics engines *for Cycle.JS applications*.  Cycle.js is ideal for highly interactive single-page web apps like word processors, trading dashboards, and spreadsheets where control flows, visualizations, and data flows are tightly coupled. 

Peloton is not intended to replace any of the solid physics engines out there - Phyics.js, Three.js, etc. -that could power game engines. These are mature, have large communities maintaining them, and are just the ticket if your goal is to create beautiful, cinema-quality 3D animations.  They fall a bit flat when the goal is to interact with the visualization in arbitrarily complex ways. 

Likewise, there are solid data visualization packages out there too. D3, for example, is nearly an industry standard.  It is amazingly powerful at rendering  professional visualizations of complex data sets, but again, interacting with the data in complex ways is not easy. 

There are many CSS tweening packages designed to make the DOM sing, but these packages do a poor job of covering information through motion.  If all you need are a smooth, fast twiddles, bounces, and twirls to wake up the user for web commerce then check out Angular, GreenSock, or any of the other solid, hardware accelerated solutions.  

Finally, there are a few frameworks that aspire to do to all - smooth, physics-based motions; real time data visualization; DOM-compatible interactivity, and so on.  The most famous of these, **famous**, folded up its flagship framework to pursue a quick-app development solution for non-coders. It's legacy, Samsara, is impressive but its author Dave Valdman is deliberately avoiding the massive crush of requirements that ended Famous. 

Like Samsara, virtually everything in Peloton is a stream.  The decision to use streams is slightly different, though.  Streams help untangle timing issues, however conventional scheduled physics engines manage to do this well without the additional overhead of stream processing.  However, these conventional physics engines don't integrate well with data intensive applications.  Streams offer a way to integrate both into one unified architecture.

###Tradeoffs

Cycle.js supports four stream packages - Rx, RxJS, Most, and xStream. Most was selected for Peloton purely on run-time perfrormance considerations. The Cycle.js home-grown stream package xStream was considered, however its advantages (slightly smaller footprint, simpler API, and tighter integration with Cycle.js) were not sufficient to beat Most in the trade study, given the rapid cycling that characterize all physics engines. Rx and RxJS were not seriously considered; they offered neither speed nor compatibility advantages.

###Status

A few of the functions in Peloton have been coded. They are undergoing unit testing and will be uploaded later. 

###Acknowledgements



###License MIT

Copyright (c) 2016 Tim Smith 

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
