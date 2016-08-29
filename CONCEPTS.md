# Peloton Concepts

[Disclaimer - This is very much work in progress, so the concepts described here will change rapidly.]

##Overview
Peloton is an experiment in stream-based, FRP physics engines for Cycle.JS applications.  Peloton may be usable for other frameworks, but there are so many solid physics engines out there that is not a requirement for Peloton

##Concepts
Peloton contains a number of stageful transformation functions that manage the animation state of the application. These are best thought of as proxy sources in the Cycle.JS world; they are not pure so they cannot be easily reversed. 

####Animation Clock
There are several clock types in Peloton.  The simplest responds to a control stream by emitting ticks synchronized with the browser's AnimationFrame after receiving a "Start" message, and pausing after receiving a "Stop" message. The clock terminates with an "End" message. 

####SpatialFrame 
A SpatialFrame is a 3D coordinate system with an origin that is anchored at some point in 3D space.  There are three orthogonal axis in the frame, numbered 1, 2 and 3 according to the right hand rule.  (Hold your right hand with thumb, index, and middle finger all pointing at right angles to each other. Your thumb is axis 1, your index finger is axis 2, and your middle finger is axis 3)

####SpatialTransform
A spatial transform is a relationship between one 3D coordinate system and another. By design, the SpatialTransforms in peloton accept one and only one generalized coordinate, a scalar, to "operate" the transform.  Arbitrarily complex transforms can be constructed by chaining together these primitive transforms.  

Note that these transforms have no knowledge of the DOM; they don't flow with the page or have any other magical side effects from the DOM. They are pure functions that will always compute the same spatial kinematics given the same set of inputs.

There are four translation transforms and four rotational transforms.  If you hold your right hand as described above, the generalized coordinate q moves the dependent frame with respect to the reference frame (your right hand) as follows: 

1. Trans_1  : Positive q slides the frame in the direction your thumb points
2. Trans_2  : Positive q slides the frame in to where your index finger points
3. Trans_3  : Positive q slides the frame in the direction you middle finger points. 
4. Translate_

####AnimationGroup
An Animation Group is a graph of spatial transforms rooted in an inertial frame.  
In general, a web page will have several independent animation groups.  This division of animation is encouraged as it reduces the computation time for animation group. 

####Inertial Frame
An inertial frame is a non-accelerating coordinate system in 3D space. In theory it may be undergoing uniform translation, but in general it will be fixed somewhere on the page. 

