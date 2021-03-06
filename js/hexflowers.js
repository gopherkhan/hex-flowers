window.HexFlowers = function(cssSelector) {
	if (!cssSelector) { throw "CSS target needed"; }
	var grid = document.querySelector(cssSelector);
		
		var NUM_COLS = Math.floor(window.innerWidth / 100); //20;
		var NUM_ROWS = Math.floor(window.innerHeight / 90); //10;
		var SPACER = 100;
		var OFFSET = SPACER / 2;

		var tiles = new Array(NUM_ROWS);
		var colors = ['#44B3C2', '#F1A94E', '#E45641', '#7B8D8E', 'gold',
						'#32B92D',	'#FF6EB0',	'#FFCB00',	'#93228D',
						'#B84B9E', '#F20075'];

		var lastColorIdx = -1;
		// hex grid looks kind of gross if there's too much white
		// space on the right side. We extend the odd (j is odd) rows
		// by one 
		var extendOddRows = (NUM_COLS * 100 + 50) < window.innerWidth;

		function constructTiles() {
			for (var j = 0; j < NUM_ROWS; ++j) {
				var numRowCols = extendOddRows && j % 2 === 1 ? NUM_COLS + 1 : NUM_COLS;
				let row = new Array(numRowCols);
				for (var i = 0; i < numRowCols; ++i) {
					if (j % 2 == 1 && i === 0) { continue; }
					row[i] = makeHexTile(i, j);
				}
				tiles[j] = row;
			}
		}

		function renderBoard() {
			for (let row of tiles) {
				for (let tile of row) {
					if (!tile) { continue; }
					grid.appendChild(tile);
				}
			}
		}

		function getAdjacentTiles(i,j) {
			var adjacent = [];
			for (let jDelta = -1; jDelta <= 1; ++jDelta) {
				for (let iDelta = -1; iDelta <= 1; ++iDelta) {
					// -j means look up
					// grid looks up and left
					// down and right
					if (jDelta === 0 && iDelta === 0) {
						// identity
						continue;
					}
					var isOddRow = j % 2 === 1;
					if (isOddRow) { // odd row
						// looks up and up/left, down and down/left
						if (jDelta === -1 && iDelta === 1 || 
							jDelta === 1 && iDelta === 1) {
							continue;
						}
					} else {
						// evens look down and down/right, up and up/right
						if (jDelta === -1 && iDelta === -1 || 
							jDelta === 1 && iDelta === -1) {
							continue;
						}
					}

					var numRowCols = (isOddRow && extendOddRows) ? 
																		NUM_COLS + 1 : NUM_COLS;
					let iNew = iDelta + i;
					let jNew = jDelta + j;
					if (jNew < 0 || jNew >= NUM_ROWS || 
							iNew < 0 || iNew >= numRowCols) {
						continue;
					}
					if (tiles[jNew][iNew]) {
						adjacent.push(tiles[jNew][iNew]);
					}
				}
			}
			return adjacent;
		}

		function handleClick(e) {
			if (!e.target) { return; }
			if (!e.target.classList.contains('hex')) { return; }
			var tile = e.target;
			var i = ~~tile.getAttribute('data-i');
			var j = ~~tile.getAttribute('data-j');
			var adjacentTiles = getAdjacentTiles(i, j);
			var color = getNextColor();
			for (let adj of adjacentTiles) {
				adj.style['background-color'] = color; 
			}
			tile.style['background-color'] = color !== 'gold' ? 'gold' : '#F1A94E';
		}

		function getNextColor() {
			return colors[++lastColorIdx % colors.length];
		}

		function makeHexTile(i,j) {
			var elem = document.createElement('div');
			elem.classList.add('hex');
			if (j % 2 == 1) {
				elem.classList.add('odd');
			}
			elem.setAttribute('data-i', i);
			elem.setAttribute('data-j', j);
			elem.style.top = (j * (SPACER - 12)) + 'px';
			elem.style.left = (i * SPACER) + 'px';

			return elem;
		}

		function init() {
			constructTiles();
			renderBoard();
			grid.addEventListener('click', handleClick, true);
		}

		init();
}