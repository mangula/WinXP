/*
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d');

console.log('start')
H = canvas.height = 1000;
W = canvas.width = 2000;
*/
G= 0.5;
V = +0.1;
//ctx.fillStyle = 'green'

class Shell{
	constructor(angle, power, startPoint, ctx, orientation, binaryLayout, pixelZoom, mainGame){
		angle = orientation ? 90 - angle : angle - 270;
		//console.log('%c' + angle + ' ' +  power + ' ' + V.toFixed(2), 'background:red;color:yellow;font-size:2em');
		this.x = startPoint.x;
		this.y = startPoint.y;
		angle = angle * Math.PI / 180;
		this.deltaX = power * Math.cos(angle);
		this.deltaY = -power * Math.sin(angle);
		this.ctx = ctx;
		this.image = new Image();
		this.image.src = 'games/worms/images/missle25.png';
		this.binaryLayout = binaryLayout;
		this.pixelZoom = pixelZoom;
		this.mainGame = mainGame;
		console.log('pixelZoom', pixelZoom)

	}
	move(){
		//console.log(this.x, this.y)
		this.ctx.clearRect(this.x,this.y,32,32);
		this.deltaX += V;
		const prevX = this.x;
		const prevY = this.y;
		
		this.x += this.deltaX;
		this.deltaY += G;
		this.y += this.deltaY;
		const deltaAndleX = this.x - prevX;
		const deltaAndleY = this.y - prevY;
		
		this.missleAngle = deltaAndleX ? Math.atan(deltaAndleY / deltaAndleX) : 90;
		
		//console.log(this.x, this.y)
		if ( this.y >800 || this.x>800 || this.x < 0) {//COLISION
			//clearInterval(interval);
			//sss;
			//this.ctx.clearRect(0,0,800,800);
			//shell = new Shell((Math.random() * 30 >>0)+45, (Math.random() * 30 >>0) + 30);
			V = (0.5 - Math.random())*0.5;
			//V = 0;
			clearInterval(this.interval);
		}
	}
	render(){
		this.ctx.save();
		this.ctx.translate(this.x, this.y);
		this.ctx.rotate(this.missleAngle);
		this.ctx.drawImage(this.image, -12.5, -12.5);
		this.ctx.restore();
	}
	play(){
		this.interval = setInterval(()=>{
			this.move();
			this.render();
			this.checkCollision();
		}, 33);
	}
	checkCollision(){
		const row = this.y / this.pixelZoom >> 0;
		const col = this.x / this.pixelZoom >> 0;
		//console.log(row, col)
		if (this.binaryLayout[row]?.[col] == '*') {
			clearInterval(this.interval);
			//explode
			const blastRadius = 10;
			for (let h=-blastRadius; h<=blastRadius; h++) {
				for (let w=-blastRadius; w<=blastRadius; w++) {
					const cellRow = row + h;
					const cellCol = col + w;
					if ((cellCol - col)**2 + (cellRow - row)**2<=blastRadius**2) {
						if(this.binaryLayout[cellRow]?.[cellCol] == '*') {
							this.binaryLayout[cellRow][cellCol] = ' ';
							//console.log(cellRow, cellCol);
						}
						
					}
				}
			}
			//console.log(this.binaryLayout.map(a=>a.join('')).join('\n'))
			const limit = 5;
			let blast = 1;
			const interval = setInterval(()=>{
				blast++;
				const radius = blast / limit * blastRadius * this.pixelZoom;
				const colorValue = 255/limit*blast>>0;
				console.log('colorValue', colorValue);
				this.ctx.beginPath();
				this.ctx.fillStyle = "yellow";
				this.ctx.moveTo(this.x + radius, this.y)
				this.ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
				this.ctx.fill();
				this.ctx.closePath();
			}, 33);
			setTimeout(() => {
				clearInterval(interval);
				const radius = (blast +1) / limit * blastRadius * this.pixelZoom;
				this.ctx.clearRect(this.x - radius, this.y - radius, radius*2, radius*2)
				winXP.wormsGame.renderBackground();
			}, (limit - 1) * 33)
			
		}
	}
}


class Worm {
    constructor(col, ctx, binaryLayout, pixelZoom, brick, orientation = 0){
        this.col = col;
        this.x = col * pixelZoom;
        this.ctx = ctx;
        this.binaryLayout = binaryLayout;
        this.pixelZoom = pixelZoom;
        this.brick = brick;
        this.orientation = orientation;
        this.adjustH();
        this.image = new Image();
        //this.image.src = `games/worms/images/worm${orientation?1:''}.png`;
        //this.image.src = `games/worms/images/worms${orientation?1:''}.ico`;
		this.image.src = `games/worms/images/worms1.ico`;
		
		
		
		this.bazooka = new Image();
        //this.bazooka.src = `games/worms/images/bazooka.png`;
		this.bazooka.src = `games/worms/images/bazooka0-green32.png`;
		
		this.bazookaAngle = 90;
		//this.adjustBazookaAngle();
        //this.render();
        this.image.addEventListener('load',()=>{
			this.width = this.image.width;
			this.height = this.image.height;
			console.log('this.width', this.width)
			console.log('this.width', this.height)
            this.render()
        });
    }
	adjustBazookaAngle(direction){
		this.bazookaAngle -= direction * 10;
		if (this.bazookaAngle > 90) {
			this.bazookaAngle = 90;
		} else if (this.bazookaAngle < 0) {
			this.bazookaAngle = 0;
		}
	}
	powerUp(){
		
		if (this.poweringUp){
			return;
		}
		
		console.log("POWERING UP");
		this.poweringUp = true;
		this.power = 1;
		this.renderTrail();
		this.interval = setInterval(()=>{
			this.power++;
			if (this.power == this.powerArray.length) {
				this.fire();
				return;
			}
			this.renderTrail();
			
		}, 30);
	}
	renderTrail(){
		console.log("POWER UP", this.power);
		const startPoint = this.powerArray[0];
		this.ctx.beginPath();
		this.ctx.lineWidth = 10;
		this.ctx.moveTo(startPoint.x, startPoint.y);
		const endPoint = this.powerArray[this.power];
		this.ctx.lineTo(endPoint.x, endPoint.y);
		this.ctx.stroke();
	}
	fire(){
		clearInterval(this.interval);
		this.poweringUp = false;
		console.log("FIRE");
		this.render();
		this.shell = new Shell(this.bazookaAngle, this.power, this.powerArray[0], this.ctx, this.orientation, this.binaryLayout, this.pixelZoom, this);
		this.shell.play();
	}
    adjustH(){
        for (let h=0; h<this.binaryLayout.length; h++) {
            if (this.binaryLayout[h][this.col] == this.brick) {
                this.row = h-1;
                break;
            }
        }
    }
    render(){
        //console.log(this.row, this.col);
        //console.log(this.row * this.pixelZoom, this.col * this.pixelZoom);
        //console.log('ctx 333', this.ctx);
		let x = this.col * this.pixelZoom - this.width / 2;
		let y = this.row * this.pixelZoom - this.height / 1.5;
		this.ctx.clearRect(x - 100, y - 100,300,200)
		this.ctx.save();
		this.ctx.scale(this.orientation?1:-1,1);
        this.ctx.drawImage(this.image, this.orientation ? x : -x - 32, y);
		this.ctx.restore();
        //this.ctx.drawImage(this.bazooka, this.col * this.pixelZoom - this.width / 2, this.row * this.pixelZoom - this.height/1.5);
		
		this.ctx.save();
		
		//this.ctx.translate(x,y);
		//x+=32/2 * 2;
		const e=0.92;
		x+=32/2 * 3.5 * (this.orientation ? e: -0.35);
		y+=32/2;
		this.ctx.translate(x,y);
		this.ctx.scale(this.orientation ? 1 : -1, 1)
		const totalAngle = this.orientation ? (this.bazookaAngle + 90 + 180 ) : (this.bazookaAngle - 90);
		this.ctx.rotate(totalAngle * Math.PI/180);
		
		const deltaX = -Math.sin(this.bazookaAngle *Math.PI / 180) * 40 - 10;
		const deltaY = -Math.cos(this.bazookaAngle *Math.PI / 180) * 40 - 10;
		
		this.ctx.drawImage(
			this.bazooka,
		    deltaX,
		    deltaY
	    )
		this.ctx.restore();
		
		x-=32/2 * 3.5 * (this.orientation ? e: -0.35);
		x += 16;
		
		y+=5;
		
		this.ctx.fillStyle = 'white';
		this.powerArray = Array(30).fill(0);
		const sinTotalAngle = Math.sin(totalAngle * Math.PI / 180);
		const cosTotalAngle = Math.cos(totalAngle * Math.PI / 180);
		for (const i in this.powerArray) {
			//console.log('i', i)
			const trailX = i * 3 * cosTotalAngle * (this.orientation ? 1 : -1) + x;
			const trailY = i * 3 * sinTotalAngle + y;
			this.powerArray[i] = {x:trailX, y:trailY};
			if(i>3 && i%5 == 0){
				this.ctx.beginPath();
				this.ctx.moveTo(trailX + 2, trailY);
				this.ctx.arc(trailX, trailY, 2, 0, 2 * Math.PI);
				this.ctx.fill();
			}
		}
		
		return
		this.ctx.moveTo(x-50,y);
		this.ctx.lineTo(x+50,y);
		this.ctx.moveTo(x, y-50);
		this.ctx.lineTo(x, y+50);
		
		
		this.ctx.stroke();
		return;
		this.ctx.moveTo(x + deltaX - 50, y + deltaY);
		this.ctx.lineTo(x + deltaX + 50,y + deltaY);
		this.ctx.moveTo(x + deltaX, y-50 + deltaY);
		this.ctx.lineTo(x + deltaX, y+50 + deltaY);
		this.ctx.stroke();
		
		return;
		this.ctx.moveTo(x-50,y);
		this.ctx.lineTo(x+50,y);
		this.ctx.moveTo(x, y-50);
		this.ctx.lineTo(x, y+50);
		// we’re done with the rotating so restore the unrotated context
		
    }
}

class Worms extends Window{
	constructor(){
		super('worms');
		this.difficulty = 0;

		this.cellSize = 50;
        this.pixelZoom = 5;//this.cellSize % this.pixelZoom === 0 !!!!!!!
		this.dimm = 'px';
        this.brick = '*';
		this.fire = ' ';
        
        this.imagesPath = "games/worms/images/";
        
        this.programElement.setAttribute('id', 'worms-wrapper');
        this.canvas = document.createElement('CANVAS');
        this.canvas.setAttribute('id', 'worms-canvas');
		this.canvas.style.position = 'relative';
        this.ctx = this.canvas.getContext('2d');
        
        this.canvasBackground = document.createElement('CANVAS');
        this.canvasBackground.setAttribute('id', 'worms-canvas-background');
        //this.canvasBackground.style.position = 'absolute';
        this.canvasBackground.style.position = 'absolute';
        this.canvasBackground.style.top = 0;
        this.canvasBackground.style.left = 0;
        this.ctxBackground = this.canvasBackground.getContext('2d');
		
        this.programElement.appendChild(this.canvasBackground);
        this.programElement.appendChild(this.canvas);
        
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
		
		this.setEventListeners();
		
		
		this.bombChar = '*';//delete
		this.freeChar = ' ';//delte
		
		this.myTurn = 1;
		
        
        
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
    setEventListeners(){
		window.addEventListener('keydown', (event)=>{
			if (this.myTurn && this.windowElement.classList.contains('focused')) {
				//console.log('event', event.key);
				switch(event.key.toLowerCase()){
					case 'arrowRight':
					case 'd':
					case 6:
						this.worms[0].orientation = 1;
						break;
					case 'arrowLeft':
					case 'a':
					case 4:
						this.worms[0].orientation = 0;
						break;
						
					case 'arrowUp':
					case 'w':
					case 8:
						this.worms[0].adjustBazookaAngle(1);
						break;
					case 'arrowUDown':
					case 's':
					case 2:
						this.worms[0].adjustBazookaAngle(-1);
						break;
					case this.fire:
						this.worms[0].powerUp();
						return; // not to render
				}
				
				this.worms[0].render();
			}
		})
		
		window.addEventListener('keyup', (event)=>{
			if (event.key == this.fire) {
				this.worms[0].fire();
			}
		});
	}
    render(){
        
    }
    renderBackground(){
        this.ctxBackground.clearRect(0, 0, this.W, this.H);
        this.pattern.addEventListener('load',()=>{
    		this.drawMainPattern();        
            this.topPattern.addEventListener('load',()=>{
    			this.drawTopLayer();
				this.eraseExploded();
            });
        })
		this.drawMainPattern();
		this.drawTopLayer();
		this.eraseExploded();
    }
	drawMainPattern(){
		for (const h in this.layout) {
			for (const w in this.layout[h]) {
				if (this.layout[h][w] == this.brick) {
					this.ctxBackground.drawImage(this.pattern, w * this.cellSize, h * this.cellSize);
				}
			}
		}
	}
	drawTopLayer(){
		for (const w in this.layout[0]) {
			for (const h in this.layout) {
				if (this.layout[h][w] == this.brick) {
					this.ctxBackground.drawImage(this.topPattern, w * this.cellSize, h * this.cellSize);
					break;
				}
			}
		}
	}
	eraseExploded(){
		//HERE
		//if(0)
		for (const w in this.binaryLayout[0]) {
			for (const h in this.binaryLayout) {
				if (this.binaryLayout[h][w] != this.brick) {
					//this.ctxBackground.drawImage(this.topPattern, w * this.cellSize, h * this.cellSize);
					this.ctxBackground.clearRect(w * this.pixelZoom, h * this.pixelZoom, this.pixelZoom, this.pixelZoom)
					//break;
				}
			}
		}

		if(0)
		for (const {row, col} of this.originalLayoutArray) {
			if (this.binaryLayout[row][col] != this.brick) {
				this.ctxBackground.clearRect(col * this.pixelZoom, row * this.pixelZoom, this.pixelZoom, this.pixelZoom)
			}    
		}
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
        
        console.log('ctx', this.ctx)
        switch(this.difficulty){
			case 0:
                this.worms = [new Worm(2 * blockSize + 2, this.ctx, this.binaryLayout, this.pixelZoom, this.brick, 1)];
				this.enemy = [new Worm(12 * blockSize + 2, this.ctx, this.binaryLayout, this.pixelZoom, this.brick)];
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