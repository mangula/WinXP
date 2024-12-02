class TetrisShape{
	constructor(index, subIndex, row, col){
		this.H = 4;
		this.W = 4;
		this.col = col !== undefined ? col : 3;
		this.row = row || 0;

		this.shape = this.getNewShape(index, subIndex);

		row===undefined&&this.shape[0].indexOf('0') < 0 && (this.row--);

	}
	random(limit){
		return Math.floor(Math.random() * limit)
	}
	join(){
		return this.shape.join`\n`;
	}
	move(r,c){
		this.row+=r;
		this.col+=c;
	}
	getNewShape(index, subIndex){
		this.tetrisShapes = [
			[1632],
			[3840,8738],
			[864,8976],
			[1584,4896],
			[1856,8752,5888,25120],
			[1808,12832,18176,8800],
			[1824,8992,9984,9760]
		];
		this.index = index >= 0 ? index : this.random(this.tetrisShapes.length);

		let subIndexLength = this.tetrisShapes[this.index].length;

		this.subIndex = subIndex >= 0 ?
			(subIndex + 1) % subIndexLength : this.random(subIndexLength);

		return this.decodeShape(this.tetrisShapes[this.index][this.subIndex]);
	}
	decodeShape(shape){
		const decodedShape = [];
		shape = shape.toString(2).padStart(this.H * this.W, 0).replace(/0/g,' ').replace(/1/g,0);
		for (let i=0; i<this.H; i++) {
			decodedShape[i] = shape.slice(i*this.W, (i+1)*this.W);
		}
		return decodedShape;
	}
}


class Tetris extends Window{
	constructor(){
		super('tetris');
		this.H = 20;
		this.W = 10;
		this.cellSize = 20;
		this.grid = [];
		this.score = 0;
		this.THIS = this;
		this.gameOver = true;
		this.length = 0;

		this.programElement.setAttribute('id', 'tetris-wrapper');

		this.tetrisElement = document.createElement('DIV');
		this.tetrisElement.setAttribute('id', 'tetris');
		this.programElement.appendChild(this.tetrisElement);

		this.playElement = document.createElement('DIV');
		this.playElement.setAttribute('id', 'play');
		this.tetrisElement.appendChild(this.playElement);

		this.backgroundElement = document.createElement('DIV');
		this.backgroundElement.setAttribute('id', 'background');
		this.tetrisElement.appendChild(this.backgroundElement);

		this.sidePanelElement = document.createElement('DIV');
		this.sidePanelElement.setAttribute('id', 'side-panel');
		this.tetrisElement.appendChild(this.sidePanelElement);

		this.scoreElement = document.createElement('DIV');
		this.scoreElement.setAttribute('id', 'score');
		this.sidePanelElement.appendChild(this.scoreElement);

		this.levelElement = document.createElement('DIV');
		this.levelElement.setAttribute('id', 'level');
		this.sidePanelElement.appendChild(this.levelElement);

		this.linesElement = document.createElement('DIV');
		this.linesElement.setAttribute('id', 'lines');
		this.sidePanelElement.appendChild(this.linesElement);

		this.nextElement = document.createElement('DIV');
		this.nextElement.setAttribute('id', 'next');
		this.sidePanelElement.appendChild(this.nextElement);

		this.buttonDivElement = document.createElement('DIV');
		this.buttonDivElement.setAttribute('id', 'button-div');
		this.buttonElement = document.createElement('BUTTON');
		this.buttonDivElement.appendChild(this.buttonElement);
		this.sidePanelElement.appendChild(this.buttonDivElement);

		this.gameOverElement = document.createElement('DIV');
		this.gameOverElement.setAttribute('id', 'game-over');
		this.programElement.appendChild(this.gameOverElement);

		this.dimm = 'px';

		this.BLANK = ' ';

		this.init();
	}
	parentExit(){
		winXP.tetrisGame = null;
	}


	getKey(event){

		if(
			this.isActive() === false ||
			this.windowElement.classList.contains('focused') === false
		) {
			return;
		}

		switch(event.key.toLowerCase()){
			case 's': this.move('down'); break;
			case 'd': this.move('right'); break;
			case 'a': this.move('left'); break;
			case 'w': this.rotate(); break;
			default: return;
		}
		this.render();
	}


	init(){
		const cellSize = this.cellSize,
			dimm = this.dimm,

			program = this.programElement,
			background = this.backgroundElement,
			playElement = this.playElement,
			H = this.H,
			W = this.W,
			next = this.nextElement,
			score = this.scoreElement,
			level = this.levelElement,
			lines = this.linesElement,
			buttonDiv = this.buttonDivElement,
			gameOverElement = this.gameOverElement,
			THIS = this;


		window.removeEventListener('keypress', (event)=>this.getKey(event));
		window.addEventListener('keypress', (event)=>this.getKey(event));

		program.style.top = 1 * cellSize + dimm;
		program.style.left = 1 * cellSize + dimm;
		program.style.width = (W + 11) * cellSize + dimm;
		program.style.height = (H + 4) * cellSize + dimm;

		background.style.height = (H + 2) * cellSize + dimm;
		background.style.width = (W + 2) * cellSize + dimm;

		playElement.style.height = (H) * cellSize + dimm;
		playElement.style.width = (W) * cellSize + dimm;
		playElement.style.top = (1) * cellSize + dimm;
		playElement.style.left = (1) * cellSize + dimm;

		for (let i=0; i<H; i++) {
			for (let j=0; j<W; j++) {
				this.appendChild(playElement,j,i, 'blank');
			}
		}		

		for (let i=0; i<W+2; i++) {
			for(let h of [0, H+1]) {
				this.appendChild(background,i,h,'brick');
			}
		}
		for (let i=1; i<H+1; i++) {
			for(let w of [0, W+1]) {
				this.appendChild(background,w,i,'brick');
			}
		}

		const shape = new TetrisShape();

		next.style.width = shape.W * cellSize + dimm;
		next.style.height = shape.H * cellSize + dimm;
		next.style.left = cellSize + dimm;
		next.style.top = cellSize + dimm;

		for (let i=0; i<shape.H; i++) {
			for (let j=0; j<shape.W; j++) {
				let cell = document.createElement('DIV');
				cell.className = 'blank';
				cell.style.height = cellSize + dimm;
				cell.style.width = cellSize + dimm;
				cell.style.top = i * cellSize + dimm;
				cell.style.left = j * cellSize + dimm;
				next.appendChild(cell);
			}
		}

		score.style.width = shape.W * cellSize + dimm;
		score.style.height = 2 * cellSize + dimm;
		score.style.left = cellSize + dimm;
		score.style.top = (cellSize * 6) + dimm;
		score.innerHTML = '<div>SCORE</div><div class="message">0</div>';

		level.style.width = shape.W * cellSize + dimm;
		level.style.height = 2 * cellSize + dimm;
		level.style.left = cellSize + dimm;
		level.style.top = (cellSize * 9) + dimm;
		level.innerHTML = '<div>LEVEL</div><div class="message">1</div>';

		lines.style.width = shape.W * cellSize + dimm;
		lines.style.height = 2 * cellSize + dimm;
		lines.style.left = cellSize + dimm;
		lines.style.top = (cellSize * 12) + dimm;
		lines.innerHTML = '<div>LINES</div><div class="message">0</div>';

		buttonDiv.style.width = shape.W * cellSize + dimm;
		buttonDiv.style.height = 2 * cellSize + dimm;
		buttonDiv.style.left = cellSize + dimm;
		buttonDiv.style.bottom = cellSize + dimm;

		this.buttonElement.innerHTML = 'START';
		this.buttonElement.addEventListener('click', ()=>this.handleButtonPress());

		gameOverElement.style.width = this.W * cellSize + dimm;
		gameOverElement.style.height = this.H * cellSize + dimm;
		gameOverElement.style.left = cellSize + dimm;
		gameOverElement.style.top = cellSize + dimm;
	}

	appendChild(element,i,j, className){
		const cellDiv = document.createElement('DIV'),
			cellSize = this.cellSize,
			dimm = this.dimm;

		cellDiv.classList.add(className);
		cellDiv.style.top = j * cellSize + dimm;
		cellDiv.style.left = i * cellSize + dimm;
		cellDiv.style.width = cellSize + dimm;
		cellDiv.style.height = cellSize + dimm;
		element.appendChild(cellDiv);
	}

	getEmptyGrid(){
		return Array(this.H).fill(0).map(a=>Array(this.W).fill(' '));
	}

	render(){
		let gridCopy = this.getGridCopy();

		const cells = this.playElement.children;
		if(this.currentShape!==null)
		for (let i=0; i<this.currentShape.H; i++) {
			for (let j=0; j<this.currentShape.W; j++) {
				let row = this.currentShape.row + i;
				let col = this.currentShape.col + j;
				if (row >= 0 && row < this.H && col >= 0 && col < this.W) {
					if (this.currentShape.shape[i][j] !== this.BLANK) {
						gridCopy[row][col] = this.currentShape.index;
						cells[row * this.W + col].className =
							this.currentShape.shape[i][j] === this.BLANK ?
								'blank' : 'cell' + gridCopy[row][col];
					}
				}
 
			}
		}

		for (let i=0; i<this.H; i++) {
			for (let j=0; j<this.W; j++) {
				let cellDiv = cells[i*this.W + j];
				let cellValue = gridCopy[i][j];

				cellDiv.className = gridCopy[i][j] === this.BLANK ?
					'blank' : 'cell' + cellValue;
			}
		}
	}

	renderReset(){
		for(let i=0, limit = this.playElement.children.length; i<limit; i++){
			if (this.playElement.children.className !== 'blank') {
				this.playElement.children.className = 'blank';
			}
		}
	}

	tryDropLines(){
		
		const totals =[];
		const reducer = [];
		for (let r=this.H-1; r>=0; r--) {
			totals[r] = this.grid[r].map(a=>a===this.BLANK?0:1).reduce((a,b)=>a+b);
			if (totals[r] === 10) {
				reducer.push(r + reducer.length);
			}
		}

		for (let row of reducer) {
			for (let r = row; r>0; r--) {
				this.grid[r] = this.grid[r-1].slice();
			}
		}

		if (reducer.length > 0) {
			this.setScore(reducer.length**2 * 10 + reducer.length);
			this.setLines(reducer.length);
			this.setLevel();
			this.render();
		}
		

	}

	move(direction){

		let r = 0;
		let c = 0;
		switch(direction){
			case 'down': r++; break;
			case 'left': c--; break;
			case 'right': c++; break;
		}

		this.currentShape.move(r,c);

		if (this.canMove(r,c)) {
			this.render();
		} else {
			this.currentShape.move(-r,-c);
			if (direction === 'down') {
				this.updateGrid();
				this.tryDropLines();
				this.currentShape = this.nextShape;
				this.nextShape = new TetrisShape();
				this.updateNextShape();
				this.render();
				if(this.canMove(0,0) === false){
					this.setGameOver();
				}
			}
		}
	}

	clearInterval(){
		clearInterval(this.interval);
	}

	setGameOver(){
		this.buttonElement.innerHTML = 'START';
		this.gameOver = true;
		this.clearInterval();
		this.setMessage('GAME OVER');
	}

	emmitMessage(element, message, timerOffset, childIndex){
		for (let i=0; i<message.length; i++) {
			setTimeout(()=>{
				if(element.children[childIndex]){
					element.children[childIndex].innerHTML = message.map((a,b)=>{
						return '<div style="color:'+ (b<=i? 'white':'transparent') +'">' + a + '</div>';
					}).join``;	
				}
			}, (timerOffset[i])*100);
		}
	}

	setMessage(message){

		this.gameOverElement.className = 'dim';
		this.gameOverElement.innerHTML = '<div class="message"></div>';
		
		const space = '&nbsp';
		let skipSpace = 0;

		message = message.split``.map(a=>a.replace(/\s/g, space));
		
		const timerOffset = message.map((a,b)=>(skipSpace -= a=== space) + b);
		this.emmitMessage(this.gameOverElement, message, timerOffset, 0);

	}

	updateGrid(){
		for (let i=0; i<this.currentShape.H; i++) {
			let row = i + this.currentShape.row;

			for (let j=0; j<this.currentShape.W; j++) {
				let col = j + this.currentShape.col;

				if (this.currentShape.shape[i][j] !== this.BLANK && row>=0 && row < this.H && col >= 0 && col < this.W) {
					this.grid[row][col] = this.currentShape.index;
				}
			}
		}
	}
	
	canMove(r,c){

		for (let i=0; i<this.currentShape.H; i++) {
			let row = this.currentShape.row + i;
			for (let j=0; j<this.currentShape.W; j++) {
				let col = this.currentShape.col + j;
				if (this.currentShape.shape[i][j] !== this.BLANK) {
					if (row >= this.H || col < 0 || col >= this.W) {
						return false;
					}
					if (this.grid[row][col] !== this.BLANK) {

						return false;
					}
				}
			}
		}
		return true;
	}

	pause(){
		this.paused = true;
		this.buttonElement.innerHTML = 'CONTINUE';

		clearInterval(this.interval);
		console.log('pause interval',this.interval);
		this.setMessage('PAUSED');
	}

	continue(){
		this.paused = false;
		this.buttonElement.innerHTML = 'PAUSE';
		this.setInterval();
		this.gameOverElement.classList.remove('dim');
		this.gameOverElement.innerHTML = '';
	}

	rotate(){

		const rotatedShape = new TetrisShape(
			this.currentShape.index,
			this.currentShape.subIndex,
			this.currentShape.row,
			this.currentShape.col
		);

		for (let i=0; i<rotatedShape.H; i++) {
			for (let j=0; j<rotatedShape.W; j++) {
				if (rotatedShape.shape[i][j] !== this.BLANK) {
					let row = i+rotatedShape.row;
					let col = j+rotatedShape.col;
					if (row<0 || row>=this.H || col<0 || col>=this.W) {
						return;
					}
					if (this.grid[row][col] !== this.BLANK) {
						return;
					}
				}
			}
		}
		this.currentShape = rotatedShape;
		this.render();
	}

	setScore(score){
		this.score += score || -this.score;
		const message = this.score.toString().split``;
		this.scoreElement.children[1].innerHTML = this.score;
	}

	setLines(lines){
		this.lines += lines || -this.lines;
		this.linesElement.children[1].innerHTML = this.lines;
	}

	setLevel(){

		if(this.lines / (this.level + 1) >= 10) {
			this.level++;
			this.intervalTime = 1000 - this.level * 100;
			this.intervalTime < 100 && (this.intervalTime = 50);
			this.clearInterval();
			this.setInterval();
		}

		this.levelElement.children[1].innerHTML = this.level + 1;

	}

	reset(){
		this.score = 0;
		this.lines = 0;
		this.level = 0;
		this.setLevel();
		this.setScore();
		this.setLines();
		this.grid = this.getEmptyGrid();

		this.renderReset();
		this.nextShape = null;
		this.currentShape = null;
		this.paused = false;

		clearInterval(this.interval);
		console.log(this.interval);
		this.intervalTime = 1000;
		this.buttonElement.innerHTML = 'PAUSE';
		this.gameOver = false;
		this.gameOverElement.classList.remove('dim');
		this.render();
	}

	getGridCopy(){
		return this.grid.map(a=>a.slice());
	}

	updateNextShape(){
		const children = this.nextElement.children;
		for (let i=0; i<this.nextShape.H; i++) {
			for (let j=0; j<this.nextShape.W; j++) {
				const value = this.nextShape.shape[i][j];
				children[i*this.nextShape.W + j].className = value === this.BLANK ?
					'blank' : 'cell' + this.nextShape.index;
			}
		}
	}

	isActive(){
		return !(this.gameOver || this.paused);
	}

	setInterval(){
		const THIS = this;
		this.interval = setInterval(function() {
			THIS.move('down');
			//console.log('DOWN');
		}, this.intervalTime);
	}

	clearAllIntervals(){
		//console.log("CLEAR ALL INTERVALS");
		clearInterval(this.interval);
	}

	startGame(){
		this.reset();

		this.currentShape = new TetrisShape();
		this.nextShape = new TetrisShape();

		this.updateNextShape();
		this.render();

		this.setInterval();
	}

	handleButtonPress(){

		this.buttonElement.blur();
		if (this.paused) {
			//console.log('CONTINUE BUTTON');
			this.continue();
		} else if (this.gameOver) {
			this.startGame();
		} else {
			//console.log('PUSE BUTTON');
			this.pause();
		}
	}

}