# toadvine_enter-update-exit

[Demo bl.ocks link](http://bl.ocks.org/haydenwagner/eb5e308d2da484a0ca2cd4efbf8a79a6)

##enter-update-exit
The data join concept is central to D3&mdash;if you have never heard of it before you should read [this post](https://bost.ocks.org/mike/join/) by D3's creator, Mike Bostock.

This concept is easy to understand once you understand it. The problem for me was that, for whatever reason, I wasn't able to fully wrap my head around it for a while.

I made this visual to show the concept: **It allows users to manually add (enter selection), change (update selection), and delete (exit selection) data points and watch the effect on the data-bound visual elements**. 

The data is an array of x/y coordinates that is visible to the user, and the visual elements are circles that correspond to the coordinate data. 
