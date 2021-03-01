============================
========= READ ME ==========
============================

---- Quick Background:
I implemented this game originally as a 3x3 grid or 9 tiles.
I realized that the game is not very play-able with this few amount of tiles,
so I modified it to have a 4x4 grid of 16 tiles.
Both implementations have the same functions, and nothing has been changed except the two arrays:
tileCoordinates[] and adjacentTiles[] and a bit of CSS.

****************************************************
COMMENTS HAVE ONLY BEEN ADDED FOR THE 4X4 ONE, 
SO IT MAY BE EASIER TO MARK THAT ONE.
****************************************************

Unfortunately, the game still hasn't been winable, as the largest card I've managed to get is 256.
In the future, after my exams are over, I'd like to re-work the game or implement other
features in order to have the game be play-able, be fun, and be able to win.

---- Some ideas I have:
* A shuffle function that shuffles the existing tiles on the board. This could allow "stuck" higher
value cards to be possibly placed beside each other.
* Levels of 1024, 2048, 4096
* To have allotted moves?

For now I've got all the game functioning, but there's a bit more work on the game design itself 
I'd like to do before adding it to my portfolio. :)



==== SPECS ====
Coded using Atom 1.41.0
Test using Brave (a Chromium build) browser Version 1.0.1 (Chromium: 78.0.3904.108)
