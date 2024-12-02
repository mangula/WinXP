class MineSweeper extends Window{
	constructor(){
		super('minesweeper');
		this.difficulty = 0;

		this.cellSize = 20;
		this.dimm = 'px';
		this.bombChar = '*';
		this.freeChar = ' ';

		this.programElement.setAttribute('id', 'minesweeper-wrapper');
		
		const minesweeperHeader = document.createElement('DIV');
		minesweeperHeader.setAttribute('id', 'minesweeper-header');

		this.minesweeperTimer = document.createElement('DIV');
		this.minesweeperTimer.setAttribute('id', 'minesweeper-timer');
		this.minesweeperTimer.classList.add('minesweeper-digital');

		this.minesweeperIndicator = document.createElement('DIV');
		this.minesweeperIndicator.setAttribute('id', 'minesweeper-indicator');

		this.minesweeperIndicator.addEventListener('click', (event)=>{
			this.init();
			this.reset();
		});

		this.minesweeperBombCounter = document.createElement('DIV');
		this.minesweeperBombCounter.setAttribute('id', 'minesweeper-bomb-count');
		this.minesweeperBombCounter.classList.add('minesweeper-digital');

		minesweeperHeader.appendChild(this.minesweeperBombCounter);
		minesweeperHeader.appendChild(this.minesweeperIndicator);
		minesweeperHeader.appendChild(this.minesweeperTimer);

		this.minesweeperPlay = document.createElement('DIV');
		this.minesweeperPlay.setAttribute('id', 'minesweeper-play');

		this.programElement.appendChild(minesweeperHeader);
		this.programElement.appendChild(this.minesweeperPlay);

		this.fileDropDownElement;

		const lastULElement = this.fileDropDownElement.querySelector('li:last-of-type');
		const difficultyMode = ['Beginner', 'Intermediate', 'Expert'];

		for(const index in difficultyMode){
			const difficultyElement = document.createElement('LI');
			difficultyElement.dataset.difficulty = index;
			difficultyElement.innerHTML = difficultyMode[index];
			difficultyElement.addEventListener('click', (event)=>{
				this.difficulty = +event.target.dataset.difficulty;
				this.setDifficulty();
				this.startGame();
			});
			this.fileDropDownElement.insertBefore(difficultyElement,lastULElement);
		}

		this.difficultyElements = this.fileDropDownElement.querySelectorAll('[data-difficulty]');
		
		const questionMarkOption = document.createElement('LI');
		questionMarkOption.innerHTML = 'Use Marks ?';
		questionMarkOption.classList.add('selected');

		questionMarkOption.addEventListener('click', (event)=>{
			if (event.target.classList.contains('selected')) {
				event.target.classList.remove('selected');
				this.useQuestionMark = false;
				for (let i=0, limit = this.minesweeperPlay.children.length; i<limit; i++) {
					this.minesweeperPlay.children[i].classList.remove('minesweeper-question-indicator');
					this.minesweeperPlay.children[i].classList.add('minesweeper-none-indicator');
				}
			} else {
				event.target.classList.add('selected');
				this.useQuestionMark = true;
			}
		});
		
		this.useQuestionMark = true;

		this.fileDropDownElement.insertBefore(questionMarkOption, lastULElement);
		this.neighbourIndexes = Array(3).fill(0).map((a,b)=>+b-1);
		this.init();
		this.reset();
	}

	startTimer(){
		let time = 0;
		const THIS = this;
		this.interval = setInterval(function(){
			time++;
			THIS.minesweeperTimer.innerHTML = THIS.setValue(time);
			if (time === 999) {
				THIS.clearAllIntervals();
			}
		},1000);
	}

	clearAllIntervals(){
		clearInterval(this.interval);
	}

	updateBombs(){
		this.minesweeperBombCounter.innerHTML = this.setValue(this.remainingBombs);
	}

	setDifficulty(){
		switch(this.difficulty){
			case 0:
				this.W = 9;
				this.H = 9;
				this.bombsN = 10;
				break;
			case 1:
				this.W = 16;
				this.H = 16;
				this.bombsN = 40;
				break;
			default:
				this.W = 30;
				this.H = 16;
				this.bombsN = 99;
				break;
		}
		const THIS = this;
		this.difficultyElements.forEach(function(element, index){
			if (index === THIS.difficulty) {
				element.classList.add('selected');
			} else {
				element.classList.remove('selected');
			}
		});
	}

	init(){

		const borderWidth = 3;
		this.setDifficulty();

		this.minesweeperPlay.style.height = this.H * this.cellSize + borderWidth * 2 + this.dimm;
		this.minesweeperPlay.style.width  = this.W * this.cellSize + borderWidth * 2 + this.dimm;
		this.minesweeperPlay.style.borderWidth = borderWidth + this.dimm;

		this.gameOver = false;
		this.minesweeperPlay.innerHTML = '';
		this.minesweeperIndicator.style.backgroundImage = 'url("games/minesweeper/smile.ico")';

		const THIS = this;
		for (let i=0; i<this.H; i++) {
			for (let j=0; j<this.W; j++) {
				const cell = document.createElement('DIV');
				cell.classList.add('minesweeper-cell');
				cell.classList.add('minesweeper-none-indicator');
				cell.dataset.row = i;
				cell.dataset.col = j;
				cell.style.height = cell.style.width = this.cellSize + this.dimm;
				cell.style.top = i * this.cellSize + borderWidth * 0 + this.dimm;
				cell.style.left = j * this.cellSize  + borderWidth * 0 + this.dimm;

				cell.addEventListener('contextmenu', function(){
					event.preventDefault();

					if(THIS.gameOver || this.classList.contains('minesweeper-free')) {
						return;
					}

					const indicatorClasses = [
						'minesweeper-none-indicator',
						'minesweeper-flag-indicator',
						'minesweeper-question-indicator'
					].slice(0, 2 + THIS.useQuestionMark);

					for (let i=0, length = indicatorClasses.length; i < length; i++) {
						if (this.classList.contains(indicatorClasses[i])) {
							this.classList.remove(indicatorClasses[i]);
							this.classList.add(indicatorClasses[(i + 1) % length]);
							THIS.remainingBombs += [-1, 1, 0][i];
							break;
						}
					}

					THIS.updateBombs();

				});

				cell.addEventListener('mousedown', (event)=>{
					if (this.gameOver) {
						return;
					}
					//MOUSE DOWN BUTTON LEFT + MOUSE DOWN BUTTON RIGHT AND NOT ON FLAG
					const eventMask = '' + event.button + event.buttons + event.which;
					if (
						event.target.classList.contains('minesweeper-flag-indicator') == false &&
						(eventMask == '031' || eventMask == '233')
					) {
						this.hoverNeighbours(event.target);
						return;
					}
					
					if (event.button === 0) {
						cell.classList.add('hover');
						this.minesweeperIndicator.style.backgroundImage = 'url("games/minesweeper/guess.ico")';	
					}

					
				});

				cell.addEventListener('mouseup', (event)=>{
					const eventMask = '' + event.button + event.buttons + event.which;

					if (eventMask == '213') {
						this.openNeighbours(event.target);
						return;
					}

					if (eventMask == '021') {
						this.minesweeperPlay.querySelectorAll('.hover').forEach(function(element){
						    element.classList.remove('hover');
						});
					}

					if (this.gameOver) {
						return;
					}

					this.minesweeperIndicator.style.backgroundImage = 'url("games/minesweeper/smile.ico")';

				});

				cell.addEventListener('click', function(event){

					if (THIS.gameOver || this.classList.contains('minesweeper-flag-indicator')) {
						return;
					}

					if (this.classList.contains('minesweeper-free')) {
						if (event.button === 0 && event.buttons === 2 && event.which === 1) {
							THIS.openNeighbours(this);	
						}
						return;
					}

					this.classList.remove('minesweeper-question-indicator');
					this.classList.add('minesweeper-free');

					const row = +this.dataset.row;
					const col = +this.dataset.col;

					if (THIS.start === false) {
						THIS.start = true;
						THIS.startTimer();
						//FORM RANDOM BOMBS
						const E = Array(THIS.H * THIS.W).fill(0).map((a,b)=>b);
						//prevent first cell BOMB
						let index = row * THIS.W + col;
						E[index] = E[E.length - 1];
						E.length--;

						for (let i=0; i<THIS.bombsN; i++) {
						    index = Math.floor(Math.random() * E.length);

						    const cellNumber = E[index];

						    THIS.bombsGrid[Math.floor(cellNumber / THIS.W)][cellNumber % THIS.W] = '*';
						    E[index] = E[E.length - 1];
						    E.length--;
						}

						for (let i=0; i<THIS.H; i++) {
							for (let j=0; j<THIS.W; j++) {
								if (THIS.bombsGrid[i][j] === THIS.bombChar) {
									continue;
								}
								let total = 0;
								for (const r of THIS.neighbourIndexes) {
									let rowD = i + r;
									if (rowD < 0 || rowD == THIS.H) {
										continue;
									} 
									for (const c of THIS.neighbourIndexes) {
										let colD = j + c;
										if (colD < 0 || colD == THIS.W) {
											continue;
										}

										if (THIS.bombsGrid[rowD][colD] === THIS.bombChar) {
											total++;
										}
									}
								}
								THIS.bombsGrid[i][j] = total;
							}
						}
					}

					const cellValue = THIS.bombsGrid[row][col];
					//EXPLODE GAME OVER
					if (cellValue === THIS.bombChar) {
						
						THIS.gameOver = true;
						clearInterval(THIS.interval);
						THIS.minesweeperIndicator.style.backgroundImage = 'url("games/minesweeper/fail.ico")';//change class instead

						//UPDATE ALL HIDDEN BOMBS AND MISSED BOMBS
						const children = THIS.minesweeperPlay.children;

						for (let i=0; i<THIS.H; i++) {
							for (let j=0; j<THIS.W; j++) {
								const index = i * THIS.W + j;
								const hasFlag = children[index].classList.contains('minesweeper-flag-indicator');
								if (THIS.bombsGrid[i][j] === THIS.bombChar) {
									if (!hasFlag) {
										children[index].classList.add('minesweeper-bomb');	
									}
								} else if (hasFlag) {
									children[index].classList.add('minesweeper-miss');
								}
							}
						}
						this.classList.add('minesweeper-bomb-explode');
						this.classList.add('minesweeper-bomb');
						return;
					}

					//CLICK NEIGHBOURS
					if (cellValue === 0) {
						const queue = [{row:row, col:col}];
						while(queue.length){
							const queue_copy = [];
							for (const q of queue) {
								queue_copy.push({row:q.row, col:q.col});
							}
							queue.length = 0;
							for (const q of queue_copy) {

								for (const r of THIS.neighbourIndexes) {
									let rowD = q.row + r;
									if (rowD < 0 || rowD == THIS.H) {
										continue;
									} 
									for (const c of THIS.neighbourIndexes) {
										let colD = q.col + c;
										if ( colD < 0 || colD == THIS.W  || THIS.bombsGrid[rowD][colD] === THIS.bombChar) {
											continue;
										}
										const neighbour = this.parentElement.children[colD + rowD * THIS.W];
										if (neighbour.classList.contains('minesweeper-free') ||
											neighbour.classList.contains('minesweeper-flag-indicator') ||
											neighbour.classList.contains('minesweeper-question-indicator')
										) {
											continue;
										}
										neighbour.classList.add('minesweeper-free');
										const cellValue2 = THIS.bombsGrid[rowD][colD];
										if (isNaN(cellValue2) == false && cellValue2 > 0) {
											neighbour.innerHTML =  cellValue2;
											neighbour.classList.add('minesweeper-color'+cellValue2);
										} else {
											queue.push({row:rowD, col:colD})
										}
										
									}
								}
							}

						}
					} else {
						this.innerHTML = cellValue;	
						this.classList.add('minesweeper-color' + cellValue);
					}


					let total_open = 0;
					const children = THIS.minesweeperPlay.children;
					for (let i=0; i<children.length; i++) {
						if (children[i].classList.contains('minesweeper-free')) {
							total_open++;
						}
					}

					//SUCESS
					if (total_open + THIS.bombsN == THIS.W * THIS.H) {

						THIS.gameOver = true;
						clearInterval(THIS.interval);
						THIS.minesweeperIndicator.style.backgroundImage = 'url("games/minesweeper/success2.ico")';
						for (let i=0; i<THIS.H; i++) {
							for (let j=0; j<THIS.W; j++) {
								if (THIS.bombsGrid[i][j] === THIS.bombChar) {
									children[i * THIS.W + j].classList.remove('minesweeper-question-indicator');
									children[i * THIS.W + j].classList.add('minesweeper-flag-indicator');
								}
							}
						}
						THIS.remainingBombs = 0;
						THIS.updateBombs();
					}

				});
				this.minesweeperPlay.appendChild(cell);
			}
		}

		this.bombsGrid = [];
		for (let i=0; i<this.H; i++) {
			this.bombsGrid[i] = Array(this.W).fill(this.freeChar);
		}

		this.start = false;
	}

	getAllNeighbours(row, col){
		const neighbours = [];
		for (const r of this.neighbourIndexes) {
			const R = r + row;
			if (R<0 || R>=this.H) {
				continue;
			}
			for (const c of this.neighbourIndexes) {
				const C = c + col;
				if (C<0 || C>=this.W || r==0 && c==0) {
					continue;
				}
				neighbours.push({row:R, col:C});
			}
		}
		return neighbours;
	}

	hoverNeighbours(element){
		const neighbours = this.getAllNeighbours(+element.dataset.row, +element.dataset.col);

		for (const neighbour of neighbours) {
			const neighbourIndex = neighbour.row * this.W + neighbour.col;
			const cell = this.minesweeperPlay.children[neighbourIndex];
			if (cell.classList.contains('minesweeper-free') ||
				cell.classList.contains('minesweeper-flag-indicator')
			) {
				continue;
			}
			cell.classList.add('hover');
		}
	}

	openNeighbours(element){
		const row = +element.dataset.row;
		const col = +element.dataset.col;
		const neighbours = this.getAllNeighbours(row, col);
		let totalBombs = 0
		for (const neighbour of neighbours) {
			const neighbourIndex = neighbour.row * this.W + neighbour.col;
			const cell = this.minesweeperPlay.children[neighbourIndex];
			if (cell.classList.contains('minesweeper-free') ||
				(cell.classList.contains('minesweeper-flag-indicator') && (++totalBombs))
			) {
				continue;
			}
			cell.classList.remove('hover');	
		}
		element.classList.remove('hover');

		//IF WRONG CELL IS CLICKED, IT CONTAINS HOBER CLASS
		let hasHover = false;
		for (let i=0, limit = this.minesweeperPlay.children.length; i<limit; i++) {
			if (this.minesweeperPlay.children[i].classList.contains('hover')) {
				hasHover = true;
				this.minesweeperPlay.children[i].classList.remove('hover');
			}
		}

		if (hasHover === false && this.start && totalBombs === +this.bombsGrid[row][col]) {
			this.clickAllNeighbours(element);
		}
	}

	clickAllNeighbours(element){

		let row = +element.dataset.row;
		let col = +element.dataset.col;

		const queue = [{row:row, col:col}];
		
		while(queue.length){
			const queue_copy = [];
			for(const q of queue){
				queue_copy.push({row:q.row, col:q.col});
			}
			queue.length = 0;
			for(const q of queue_copy){
				for(const r of this.neighbourIndexes) {
					row = r + q.row;
					if (row < 0 || row >= this.H)  {
						continue;
					}
					for(const c of this.neighbourIndexes) {
						col = c + q.col;
						if (col < 0 || col >= this.W || r == 0 && c == 0) {
							continue;
						}
						const child_index = row * this.W + col;
						const cell = this.minesweeperPlay.children[child_index];
						if (
							cell.classList.contains('minesweeper-flag-indicator') ||
							cell.classList.contains('minesweeper-free')
						) {
							continue;
						}
						cell.click();
					}
				}
			}

		}
	}

	startGame(){
		this.init();
		this.reset();
	}

	setValue(value){
		value < 0 && (value = '-' + value.toString().slice(1).padStart(2,'0'));
		return '<div>' + value.toString().padStart(3,'0').split('').join('</div><div>') + '</div>';
	}

	reset(){
		this.minesweeperTimer.innerHTML = this.setValue('');
		this.minesweeperBombCounter.innerHTML = this.setValue(this.bombsN);
		this.remainingBombs = this.bombsN;
		this.clearAllIntervals();
	}

	parentExit(){
		winXP.minesweeperGame = null;
	}

}