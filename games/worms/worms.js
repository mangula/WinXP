class Worm {
    constructor(row, ctx, binaryLayout, pixelZoom, orientation = 0){
        this.row = row;
        this.ctx = ctx;
        this.binaryLayout = this.binaryLayout;
        this.pixelZoom = pixelZoom;
        this.orientation = orientation;
    }
    render(){
        
    }
}

class Worms extends Window{
	constructor(){
		super('worms');
		this.difficulty = 0;

		this.cellSize = 50;
        this.pixelZoom = 10;//this.cellSize % this.pixelZoom === 0 !!!!!!!
		this.dimm = 'px';
        this.brick = '*';
        
        this.imagesPath = "games/worms/images/";
        
        this.programElement.setAttribute('id', 'worms-wrapper');
        this.canvas = document.createElement('CANVAS');
        this.canvas.setAttribute('id', 'worms-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.programElement.appendChild(this.canvas);
        
        this.canvasBackground = document.createElement('CANVAS');
        this.canvasBackground.setAttribute('id', 'worms-canvas-background');
        //this.canvasBackground.style.position = 'absolute';
        this.canvasBackground.style.position = 'absolute';
        this.canvasBackground.style.top = 0;
        this.canvasBackground.style.left = 0;
        this.ctxBackground = this.canvasBackground.getContext('2d');
        this.programElement.appendChild(this.canvasBackground);
        
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
			this.fileDropDownElement.insertBefore(difficultyElement, lastULElement);
		}

		this.difficultyElements = this.fileDropDownElement.querySelectorAll('[data-difficulty]');
        
        this.pattern = new Image();
        this.topPattern = new Image();
        this.setDifficulty();
        this.resizeCanvas();
        this.render();
        this.renderBackground();
		this.bombChar = '*';
		this.freeChar = ' ';
		
        
        
        return;

		
		
		const wormsHeader = document.createElement('DIV');
		wormsHeader.setAttribute('id', 'worms-header');

		this.wormsTimer = document.createElement('DIV');
		this.wormsTimer.setAttribute('id', 'worms-timer');
		this.wormsTimer.classList.add('worms-digital');

		this.wormsIndicator = document.createElement('DIV');
		this.wormsIndicator.setAttribute('id', 'worms-indicator');

		this.wormsIndicator.addEventListener('click', (event)=>{
			this.init();
			this.reset();
		});

		this.wormsBombCounter = document.createElement('DIV');
		this.wormsBombCounter.setAttribute('id', 'worms-bomb-count');
		this.wormsBombCounter.classList.add('worms-digital');

		wormsHeader.appendChild(this.wormsBombCounter);
		wormsHeader.appendChild(this.wormsIndicator);
		wormsHeader.appendChild(this.wormsTimer);

		this.wormsPlay = document.createElement('DIV');
		this.wormsPlay.setAttribute('id', 'worms-play');

		this.programElement.appendChild(wormsHeader);
		this.programElement.appendChild(this.wormsPlay);

		
		
		const questionMarkOption = document.createElement('LI');
		questionMarkOption.innerHTML = 'Use Marks ?';
		questionMarkOption.classList.add('selected');

		questionMarkOption.addEventListener('click', (event)=>{
			if (event.target.classList.contains('selected')) {
				event.target.classList.remove('selected');
				this.useQuestionMark = false;
				for (let i=0, limit = this.wormsPlay.children.length; i<limit; i++) {
					this.wormsPlay.children[i].classList.remove('worms-question-indicator');
					this.wormsPlay.children[i].classList.add('worms-none-indicator');
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
    
    render(){
        
    }
    renderBackground(){
        this.ctxBackground.clearRect(0, 0, this.W, this.H);
        this.pattern.addEventListener('load',()=>{
            for (const h in this.layout) {
                for (const w in this.layout[h]) {
                    if (this.layout[h][w] == this.brick) {
                        this.ctxBackground.drawImage(this.pattern, w * this.cellSize, h * this.cellSize);
                    }
                }
            }
            this.topPattern.addEventListener('load',()=>{
                
                for (const w in this.layout[0]) {
                    for (const h in this.layout) {
                        if (this.layout[h][w] == this.brick) {
                            this.ctxBackground.drawImage(this.topPattern, w * this.cellSize, h * this.cellSize);
                            break;
                        }
                    }
                }
                //HERE
                //if(0)
                
                
                
                for (const {row, col} of this.originalLayoutArray) {
                    if (this.binaryLayout[row][col] != this.brick) {
                        this.ctxBackground.clearRect(col * this.pixelZoom, row * this.pixelZoom, this.pixelZoom, this.pixelZoom)
                    }
                }
            });
        })
    }
    resizeCanvas(){
        this.canvasBackground.height = this.canvas.height = this.H;
        this.canvasBackground.width = this.canvas.width = this.W;
    }
    getLayout(){
        return [
            [
                "               ",
                "               ",
                "    *          ",
                "    * **       ",
                "    ******     ",
                "***********    ",
                "***********    ",
                "***************",
                "***************",
            ],
            [],
            []
        ][this.difficulty];
    }

	startTimer(){
		let time = 0;
		const THIS = this;
		this.interval = setInterval(function(){
			time++;
			THIS.wormsTimer.innerHTML = THIS.setValue(time);
			if (time === 999) {
				THIS.clearAllIntervals();
			}
		},1000);
	}

	clearAllIntervals(){
		clearInterval(this.interval);
	}

	updateBombs(){
		this.wormsBombCounter.innerHTML = this.setValue(this.remainingBombs);
	}

	setDifficulty(){
		
        
        this.layout = this.getLayout();
        this.H = this.cellSize * this.layout.length;
        this.W = this.cellSize * this.layout[0].length;
        
        const blockSize = this.cellSize / this.pixelZoom;
        this.binaryH = this.layout.length * blockSize;
        this.binaryW = this.layout[0].length * blockSize;
        
        this.binaryLayout = Array(this.layout.length * blockSize).fill(1).map((_,h)=>{
            const H = h/blockSize>>0;
            return Array(this.layout[0].length).fill(1).map((_,w)=>{
                return (this.layout[H][w]).repeat(blockSize).split('');
            }).flat(1);
        });

        this.originalLayoutArray =
            this.binaryLayout.map(
            (line,h)=>
                line.map((element, w)=>{
                    return {row:h, col:w};
                })
            ).flat(1).filter(cell=>this.binaryLayout[cell.row][cell.col] != this.brick);
        //console.log(this.originalLayoutArray.length);
        
        //sss;
        /*for (let i=0; i<100; i++) {
            this.binaryLayout[Math.random() * this.binaryH >> 0][Math.random() * this.binaryW >> 0] = ' ';
        }
        
        
        this.originalLayoutArray =
            this.binaryLayout.map(
            (line,h)=>
                line.map((element, w)=>{
                    return {row:h, col:w};
                })
            ).flat(1).filter(cell=>this.binaryLayout[cell.row][cell.col] != this.brick);
            
        console.log(this.originalLayoutArray.length);*/
        //console.log(this.binaryLayout.map(a=>a.join('')).join('\n'))
        //sss;
        
        switch(this.difficulty){
			case 0:
                this.worms = new Worm(2, this.ctx, this.binaryLayout, this.pixelZoom);
				break;
			case 1:
				break;
			default:
				break;
		}
        
		this.difficultyElements.forEach((element, index)=>{
			if (index === this.difficulty) {
				element.classList.add('selected');
			} else {
				element.classList.remove('selected');
			}
		});

        this.canvasBackground.backgroundImage = `url("${this.imagesPath}${['eazy'][this.difficulty]}.jpg")`;
        this.pattern.src = `${this.imagesPath}pattern${['Eazy'][this.difficulty]}.jpg`;
        this.topPattern.src = `${this.imagesPath}topPattern${['Eazy'][this.difficulty]}.jpg`;


	}

	init(){

		const borderWidth = 3;
		this.setDifficulty();

		this.wormsPlay.style.height = this.H * this.cellSize + borderWidth * 2 + this.dimm;
		this.wormsPlay.style.width  = this.W * this.cellSize + borderWidth * 2 + this.dimm;
		this.wormsPlay.style.borderWidth = borderWidth + this.dimm;

		this.gameOver = false;
		this.wormsPlay.innerHTML = '';
		this.wormsIndicator.style.backgroundImage = `url("${this.imagesPath}smile.ico")`;

		const THIS = this;
		for (let i=0; i<this.H; i++) {
			for (let j=0; j<this.W; j++) {
				const cell = document.createElement('DIV');
				cell.classList.add('worms-cell');
				cell.classList.add('worms-none-indicator');
				cell.dataset.row = i;
				cell.dataset.col = j;
				cell.style.height = cell.style.width = this.cellSize + this.dimm;
				cell.style.top = i * this.cellSize + borderWidth * 0 + this.dimm;
				cell.style.left = j * this.cellSize  + borderWidth * 0 + this.dimm;

				cell.addEventListener('contextmenu', function(){
					event.preventDefault();

					if(THIS.gameOver || this.classList.contains('worms-free')) {
						return;
					}

					const indicatorClasses = [
						'worms-none-indicator',
						'worms-flag-indicator',
						'worms-question-indicator'
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
						event.target.classList.contains('worms-flag-indicator') == false &&
						(eventMask == '031' || eventMask == '233')
					) {
						this.hoverNeighbours(event.target);
						return;
					}
					
					if (event.button === 0) {
						cell.classList.add('hover');
						this.wormsIndicator.style.backgroundImage = `url("${this.imagesPath}guess.ico")`;
					}

					
				});

				cell.addEventListener('mouseup', (event)=>{
					const eventMask = '' + event.button + event.buttons + event.which;

					if (eventMask == '213') {
						this.openNeighbours(event.target);
						return;
					}

					if (eventMask == '021') {
						this.wormsPlay.querySelectorAll('.hover').forEach(function(element){
						    element.classList.remove('hover');
						});
					}

					if (this.gameOver) {
						return;
					}

					this.wormsIndicator.style.backgroundImage = `url("${this.imagesPath}smile.ico")`;

				});

				cell.addEventListener('click', function(event){

					if (THIS.gameOver || this.classList.contains('worms-flag-indicator')) {
						return;
					}

					if (this.classList.contains('worms-free')) {
						if (event.button === 0 && event.buttons === 2 && event.which === 1) {
							THIS.openNeighbours(this);	
						}
						return;
					}

					this.classList.remove('worms-question-indicator');
					this.classList.add('worms-free');

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
						THIS.wormsIndicator.style.backgroundImage = `url("${THIS.imagesPath}fail.ico")`;//change class instead

						//UPDATE ALL HIDDEN BOMBS AND MISSED BOMBS
						const children = THIS.wormsPlay.children;

						for (let i=0; i<THIS.H; i++) {
							for (let j=0; j<THIS.W; j++) {
								const index = i * THIS.W + j;
								const hasFlag = children[index].classList.contains('worms-flag-indicator');
								if (THIS.bombsGrid[i][j] === THIS.bombChar) {
									if (!hasFlag) {
										children[index].classList.add('worms-bomb');	
									}
								} else if (hasFlag) {
									children[index].classList.add('worms-miss');
								}
							}
						}
						this.classList.add('worms-bomb-explode');
						this.classList.add('worms-bomb');
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
										if (neighbour.classList.contains('worms-free') ||
											neighbour.classList.contains('worms-flag-indicator') ||
											neighbour.classList.contains('worms-question-indicator')
										) {
											continue;
										}
										neighbour.classList.add('worms-free');
										const cellValue2 = THIS.bombsGrid[rowD][colD];
										if (isNaN(cellValue2) == false && cellValue2 > 0) {
											neighbour.innerHTML =  cellValue2;
											neighbour.classList.add('worms-color'+cellValue2);
										} else {
											queue.push({row:rowD, col:colD});
										}
										
									}
								}
							}

						}
					} else {
						this.innerHTML = cellValue;	
						this.classList.add('worms-color' + cellValue);
					}


					let total_open = 0;
					const children = THIS.wormsPlay.children;
					for (let i=0; i<children.length; i++) {
						if (children[i].classList.contains('worms-free')) {
							total_open++;
						}
					}

					//SUCESS
					if (total_open + THIS.bombsN == THIS.W * THIS.H) {

						THIS.gameOver = true;
						clearInterval(THIS.interval);
						THIS.wormsIndicator.style.backgroundImage = `url("${THIS.imagesPath}success2.ico")`;
						
						for (let i=0; i<THIS.H; i++) {
							for (let j=0; j<THIS.W; j++) {
								if (THIS.bombsGrid[i][j] === THIS.bombChar) {
									children[i * THIS.W + j].classList.remove('worms-question-indicator');
									children[i * THIS.W + j].classList.add('worms-flag-indicator');
								}
							}
						}
						THIS.remainingBombs = 0;
						THIS.updateBombs();
					}

				});
				this.wormsPlay.appendChild(cell);
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
			const cell = this.wormsPlay.children[neighbourIndex];
			if (cell.classList.contains('worms-free') ||
				cell.classList.contains('worms-flag-indicator')
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
		let totalBombs = 0;
		for (const neighbour of neighbours) {
			const neighbourIndex = neighbour.row * this.W + neighbour.col;
			const cell = this.wormsPlay.children[neighbourIndex];
			if (cell.classList.contains('worms-free') ||
				(cell.classList.contains('worms-flag-indicator') && (++totalBombs))
			) {
				continue;
			}
			cell.classList.remove('hover');	
		}
		element.classList.remove('hover');

		//IF WRONG CELL IS CLICKED, IT CONTAINS HOBER CLASS
		let hasHover = false;
		for (let i=0, limit = this.wormsPlay.children.length; i<limit; i++) {
			if (this.wormsPlay.children[i].classList.contains('hover')) {
				hasHover = true;
				this.wormsPlay.children[i].classList.remove('hover');
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
						const cell = this.wormsPlay.children[child_index];
						if (
							cell.classList.contains('worms-flag-indicator') ||
							cell.classList.contains('worms-free')
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
		this.wormsTimer.innerHTML = this.setValue('');
		this.wormsBombCounter.innerHTML = this.setValue(this.bombsN);
		this.remainingBombs = this.bombsN;
		this.clearAllIntervals();
	}

	parentExit(){
		winXP.wormsGame = null;
	}

}