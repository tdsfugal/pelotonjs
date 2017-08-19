# Peloton Concepts

[Disclaimer - This is very much work in progress, so the concepts described here will change rapidly.]

Peloton is an experiment in stream-based, FRP physics engines for Cycle.JS applications.  Peloton may be usable for other frameworks, but there are so many solid physics engines out there that is not a requirement for Peloton

## Time

As with all computer simulations, time in peloton is not smooth and continuous, it is chopped up into discrete intervals.  These are synchronized with the screen refresh rate to avoid additional work. A timing pulse provided by the browser's AnimationFrame drives all computations.  When the trigger pulse stops, Peloton physics calculations stop.  When it starts up again, Peloton continues computing. That's pretty much it for overall app control. 

## Governing differential equation

