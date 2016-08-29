# Peloton.js

[Peloton is very much a work in progress. The concepts and API will change rapidly until I can figure out what works and what doesn't work.]

##Overview
Peloton is an experiment in stream-based, FRP physics engines for Cycle.JS applications.  Peloton may be usable for other frameworks, but there are so many solid physics engines out there that is not a requirement for Peloton.

Virtually everything in Peloton is a stream.  Most.js was selected as the stream package to power Peloton because of its run-time speed. xStream was considered because of its affinity with Cycle.js, however the advantages of its slightly smaller footprint and simpler API were not compelling given the in-lining and other performance tuning that most.js offers.  

###Use

A few of the functions in Peloton have been coded. They are undergoing unit testing and will be uploaded later. 

