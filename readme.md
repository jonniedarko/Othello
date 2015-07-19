#Othello! Exercise

  - Rules: http://www.site-constructor.com/othello/othellorules.html
  - Example play-through: https://www.youtube.com/watch?v=2wAbQM98s78

 Here we have a working implementation of the game Othello. Clicking on the board will assign that cell to the current player, re-render the board, and update whose turn it is.

 There is, however, one very important thing missing: THE RULES!

 Currently the Game.doTurn() method is naive and simply assigns the cell clicked to the current player and re-draws the board, even if the player clicks on another player's piece (see the TODO below).

 _YOUR TASK_: Implement the rules for flipping enemy pieces based on the newly placed piece as per the rules outlined in the link above.

 **IMPORTANT:** For simplicity, you can ignore Rule #2, and #7-10; the game ends when all squares are full.

 Remember that there are 8 directions that need to be checked for flips with every move, and each direction is flipped in isolation; there is no ripple effect (i.e. flips made while scanning NORTH do not affect any potential flips while scanning NORTH EAST). Attempt to avoid a "copy-paste" solution for each of the 8 directions - there's a more elegant solution than that.

 The code can be extended, refactored, or manipulated in any way to achieve the above goal. As always, code should be concise, clean, and efficient.

 EXTRA CREDIT:
 
 - Display a current score count for each player [x]
 - Implement Rule #2 
 - implement Rule #10 [x] (this is implemented in terms excluding the effects of Rule #2)
 - Between turns, display *on the board* how many pieces would be flipped if the current player placed a piece in that square
 