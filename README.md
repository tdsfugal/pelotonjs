
# Peloton.js

##Overview
Peloton is an experiment in stream-based, FRP physics engines *for Cycle.JS applications*.  Cycle.js is ideal for highly interactive single-page web apps like word processors, trading dashboards, and spreadsheets where control flows, visualizations, and data flows are tightly coupled. 

Cycle.js takes the basic input -> process -> output construct and closes the loop. Cycle programs have few mutable variables.  Instead, it uses **streams** - highly reactive immutable pipelines that accept events from sources and feed events to sinks, to construct highly responsive reactive networks.  In Cycle the **run** function behaves more like a constructor. It runs once to "lay out the tracks," and after that events flow around asynchronously on these mostly immutable "tracks" to operate the program. 

Peloton is an attempt to provide real physics calculations in the form of streams.  Every Peloton function accepts streans as arguments (sources) and produces streams as output (sinks).  Calling the function is like calling a constructor to create an event transformation instance that joins streams together.  Running the function creates an immutable part of the Cycle network. Whenever it recieves an input event from one of its source streams it reacts by processing it and emitting one or more output events on its sink stream(s). 

Because they represent physical processes, Peloton functions exist somewhere between pure functions and impure functions.  Some are pure functions, but most carry an internal state that is set by the accumulated history of events from the sources.  Peloton functions are pure in the sense that they will always produce the same output given the same history of input events (neglecting accumulated round-off errors), but a single event will produce different outputs at different times because the response depends on the input history. 

##Motivation

Peloton is not intended to be a replacement for a full-size physics or game engines.  There are many to choose from - Physics.js, Three.js, etc. that are mature, capable, and have large communities maintaining them. If your goal is to create a beautiful, cinema-quality 3D animated world use one of these.  Likewise, there are many mature data visualization packages out there.  if your goal is to create a visualization of a large data sets use D3 or something like it.  

If all you need are smooth, fast twiddles, bounces, and twirls for web commerce purposes then check out Angular, GreenSock, or any of the other hardware accelerated tweening solutions. There are many smaller players in this domain that may provide what you need with a smaller footprint too. 

The use case for Peloton is to provide the physical responses in highly interactive user interfaces where the user not only visualizes complex data but interacts with it in physicaly meaningful ways - by pushing, pulling, etc.  Unlike tweening engine, the responses Peloton can produces appear as if they were done to real objects moving in the real world. 

###Tradeoffs

Cycle.js supports four stream packages - Rx, RxJS, Most, and xStream. Most was selected for Peloton purely on run-time perfrormance considerations. The Cycle.js home-grown stream package xStream was considered, however its advantages (slightly smaller footprint, simpler API, and tighter integration with Cycle.js) were not sufficient to beat Most in the trade study, given the rapid cycling that characterize all physics engines. Rx and RxJS were not seriously considered; they offered neither speed nor compatibility advantages.

###Status

A few of the functions in Peloton have been coded. They are undergoing unit testing and will be uploaded later. 

Peloton is very much a work in progress. The concepts and API will change rapidly until I can figure out what works and what doesn't work.


###License MIT

Copyright (c) 2016 Tim Smith 

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
