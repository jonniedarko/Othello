/*
 Othello!

 Rules: http://www.site-constructor.com/othello/othellorules.html
 Example play-through: https://www.youtube.com/watch?v=2wAbQM98s78

 Here we have a working implementation of the game Othello. Clicking on the board will assign that cell to the current player, re-render the board, and update whose turn it is.

 There is, however, one very important thing missing: THE RULES!

 Currently the Game.doTurn() method is naive and simply assigns the cell clicked to the current player and re-draws the board, even if the player clicks on another player's piece (see the TODO below).

 YOUR TASK: Implement the rules for flipping enemy pieces based on the newly placed piece as per the rules outlined in the link above.

 IMPORTANT: For simplicity, you can ignore Rule #2, and #7-10; the game ends when all squares are full.

 Remember that there are 8 directions that need to be checked for flips with every move, and each direction is flipped in isolation; there is no ripple effect (i.e. flips made while scanning NORTH do not affect any potential flips while scanning NORTH EAST). Attempt to avoid a "copy-paste" solution for each of the 8 directions - there's a more elegant solution than that.

 The code can be extended, refactored, or manipulated in any way to achieve the above goal. As always, code should be concise, clean, and efficient.

 EXTRA CREDIT:
 - Display a current score count for each player
 - Implement Rule #2 and #10
 - Between turns, display *on the board* how many pieces would be flipped if the current player placed a piece in that square
 */

(function (window) {
	var PLAYER_RED = 1,
		PLAYER_BLUE = -1,
		PLAYER_NONE = 0,
		MAX_ROWS = 8,
		MAX_COLS = 8;
	var N = [-1, 0],
		NE = [-1, 1],
		E = [0, 1],
		SE = [1, 1],
		S = [1, 0],
		SW = [1, -1],
		W = [0, -1],
		NW = [-1, -1];
	var DIRECTION_VECTORS = [N, NE, E, SE, S, SW, W, NW];

	var Util = {
		cellIdForRowAndCol: function (r, c) {
			return "r" + r + "_c" + c;
		},
		rowAndColForCellId: function (cellId) {
			var coords = cellId.split('_');
			coords[0] = parseInt(coords[0].substr(1, coords[0].length));
			coords[1] = parseInt(coords[1].substr(1, coords[1].length));
			return coords;
		},
		cellContentsForPlayer: function (player) {
			if (player === PLAYER_RED) {
				return '<div class="piece red"></div>';
			} else if (player === PLAYER_BLUE) {
				return '<div class="piece blue"></div>';
			}
			return '';
		},
		/**
		 * updates the score board based on the progress supplied
		 * @param progress
		 */
		updateScore: function(progress){
			$('#red_score').html(progress.red);
			$('#blue_score').html(progress.blue);
		},
		/**
		 * converts an array or row & column to associate array,
		 * to allow more readable code for x y coordinates where r is the row
		 * and c is the column
		 * @param arr
		 * @param col
		 * @returns {{r: *, c: *}}
		 */
		toObject: function (arr, col) {
			if (Object.prototype.toString.call(arr) === '[object Array]') {
				return {r: arr[0], c: arr[1]};
			}
			return {r: arr, c: col};
		}
	};

	var Game = {
		init: function () {
			var t_row, r, c, cellInitialized;
			this.board = [];

			//setup initial board state
			//    - all empty, except middle 4 sqares which are alternating colors
			//        ( i.e. [3,3] = red, [3,4] = blue, [4,3] = red, [4,4] = blue )
			for (r = 0; r < MAX_ROWS; r += 1) {
				t_row = []
				for (c = 0; c < MAX_COLS; c += 1) {
					cellInitialized = false;
					if (r === 3) {
						if (c === 3) {
							t_row.push(PLAYER_RED);
							cellInitialized = true;
						} else if (c === 4) {
							t_row.push(PLAYER_BLUE);
							cellInitialized = true;
						}
					} else if (r === 4) {
						if (c === 3) {
							t_row.push(PLAYER_BLUE);
							cellInitialized = true;
						} else if (c === 4) {
							t_row.push(PLAYER_RED);
							cellInitialized = true;
						}
					}
					if (!cellInitialized) {
						t_row.push(PLAYER_NONE);
					}
				}
				this.board.push(t_row);
			}

			//setup click handlers
			$('.cell').on('click', this.cellClicked.bind(this));

			//red goes first
			this.currentPlayer = PLAYER_RED;

			//correct initial score
			var progress = this.getGameProgress();
			Util.updateScore(progress);
			return this;
		},
		drawBoard: function () {
			var t_row, t_col, r, c, cellId,
				currPlayer = this.currentPlayer === PLAYER_RED ? 'red' : 'blue';

			//draw all pieces on the board
			for (r = 0; r < MAX_ROWS; r += 1) {
				t_row = this.board[r];
				for (c = 0; c < MAX_COLS; c += 1) {
					cellId = '#' + Util.cellIdForRowAndCol(r, c);
					$(cellId).empty()
						.html(Util.cellContentsForPlayer(this.board[r][c]));
				}
			}

			//show current player
			$('#currentPlayer')
				.removeClass('blue').removeClass('red')
				.addClass(currPlayer)
				.text(currPlayer.toUpperCase());
			return this;
		},
		cellClicked: function (e) {
			var cellId = e.currentTarget.id,
				coords = Util.rowAndColForCellId(cellId);


			this.doTurn(coords[0], coords[1]);
		},

		/******************** TODO: Fix Me! ********************/

		doTurn: function (row, column) {
			//Implement the correct rules
			this.board[row][column] = this.currentPlayer;


			var cells = this.checkInAllDirections(row, column);
			for (var j = 0; j < cells.length; j++) {
				this.flip(cells[j]);
			}

			this.currentPlayer *= -1;
			this.drawBoard();
			var progress = this.getGameProgress();
			Util.updateScore(progress);

			if (progress.free === 0) {
				if(progress.red === progress.blue) {
					alert('game Over - Draw');
				}
				else if(progress.red >= progress.blue) {
					alert('game Over - Red wins');
				}
				else{
					alert('game Over - Blue wins');
				}
				if(confirm('Do you want to play again?')){
					this.init().drawBoard();
				}
			}
		},
		/**
		 * finds all the cells that are allowed to be flipped
		 * based on the point selected
		 * @param row
		 * @param column
		 * @returns {Array}
		 */
		checkInAllDirections: function (row, column) {
			var playerPos = Util.toObject(row, column);
			var direction;
			var fillableCells = [];

			for (var i = 0, len = DIRECTION_VECTORS.length; i < len; i++) {
				direction = Util.toObject(DIRECTION_VECTORS[i]);
				var cells = this.checkCells(playerPos, direction);
				if(cells.length > 0){
					fillableCells.push.apply(fillableCells, cells)
				}
			}
			return fillableCells;
		},
		/**
		 * gets an array of points that are allowed to be inverted
		 * by the current Player based on the players position
		 * and the direction
		 * @param playerPosRC
		 * @param directionRC
		 * @returns {Array}
		 */
		checkCells: function (playerPosRC, directionRC) {

			var pointRC = playerPosRC;
			var nextPointRC = this.getNextPos(pointRC, directionRC);

			var isOnBoard = this.isOnBoard(nextPointRC);
			var isBelongToEnemy;
			var pointsToFlip = [];
			while (isOnBoard) {
				isBelongToEnemy = this.isEnemyOccupied(nextPointRC);
				if (!isBelongToEnemy) {
					// all possible flips have been added prior to this point
					break;
				}

				pointsToFlip.push(nextPointRC);
				//increment to next Cell in the direction
				nextPointRC = this.getNextPos(nextPointRC, directionRC);
				// update check to make sure next Point is still within board limits
				isOnBoard = this.isOnBoard(nextPointRC);
			}
			// this makes sure the the next cell is belong to the current player
			var isSurrounded = this.isPlayerOccupied(nextPointRC);
			if (pointsToFlip.length > 0 && isSurrounded) {
				return pointsToFlip;
			}
			return [];


		},
		/**
		 * inverts the disc at the point provided
		 * @param posRC
		 */
		flip: function (posRC) {
			this.board[posRC.r][posRC.c] = -(this.board[posRC.r][posRC.c]);
		},
		/**
		 * Checks if the point is with in the boards boundaries
		 * @param pointRC
		 */
		isOnBoard: function (pointRC) {
			var maxRowIndex = MAX_ROWS - 1;
			var maxColIndex = MAX_COLS - 1;
			if ((pointRC.r >= 0 && pointRC.r <= maxRowIndex)
				&& (pointRC.c >= 0 && pointRC.c <= maxColIndex)) {
				return true;
			}
			return false;
		},
		/**
		 * calculates the next point in a given direction
		 * @param pointRC
		 * @param directionRC
		 * @returns {{r: *, c: *}}
		 */
		getNextPos: function (pointRC, directionRC) {
			return {
				r: pointRC.r + directionRC.r,
				c: pointRC.c + directionRC.c
			}

		},
		/**
		 * checks if the color of the point provided is that
		 * of the opposing player
		 * @param pointRC
		 * @returns {boolean}
		 */
		isEnemyOccupied: function (pointRC) {
			var boardColor = this.board[pointRC.r][pointRC.c];

			return boardColor !== this.currentPlayer && boardColor !== 0;

		},
		/**
		 * checks if the color of the point provided is that
		 * of the current player
		 * @param pointRC
		 * @returns {boolean}
		 */
		isPlayerOccupied: function (pointRC) {
			if (pointRC.r < 0 || pointRC.r > MAX_ROWS - 1 || pointRC.c < 0 || pointRC.c > MAX_COLS - 1) {
				return false;
			}
			var boardColor = this.board[pointRC.r][pointRC.c];
			return boardColor === this.currentPlayer;
		},
		/**
		 * updates the count for the values present on the board
		 * @returns {{red: Number, blue: Number, free: Number}}
		 */
		getGameProgress: function () {
			var cell, reds = [], blues = [], free = [];
			for (var r = 0; r < MAX_ROWS; r++) {
				for (var c = 0; c < MAX_COLS; c++) {
					cell = this.board[r][c];
					if (cell === PLAYER_BLUE) {
						blues.push(cell);
					}
					else if (cell === PLAYER_RED) {
						reds.push(cell);
					}
					else {
						free.push(cell);
					}
				}
			}
			return {
				red: reds.length,
				blue: blues.length,
				free: free.length
			}

		}
		/*******************************************************/


	};

	window.Othello = Game;
})(window)

Othello.init().drawBoard();