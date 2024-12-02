class WinXP{
	constructor(){

		this.winXPElement = document.createElement('DIV');
		this.winXPElement.setAttribute('id', 'winXP');
		this.winXPElement.draggable = false;

		document.body.appendChild(this.winXPElement);

		this.imagesFolder = 'images/';
		this.taskbar = new Taskbar(this.imagesFolder);
		this.winXPElement.appendChild(this.taskbar.taskbarElement);


		this.iconsList = [
			'minesweeper',
			'tetris'
		];

		this.icons = [];
		for (let icon of this.iconsList) {
			this.icons.push(new Icon(this, icon, this.icons.length));
			this.taskbar.addIcon(icon);
		}

		window.addEventListener('mouseup', (event)=>{
			document.querySelectorAll('#minesweeper-play .minesweeper-cell.hover').forEach(function(element){
				element.classList.remove('hover');
			});
		});
		window.addEventListener('click', (event)=>{
			document.querySelectorAll('.window').forEach(function(windowElement){
		       windowElement.classList.remove('focused');
			});
			document.querySelectorAll('.taskbar-item').forEach(function(taskbarItemElement){
		       taskbarItemElement.classList.remove('focused');
			});
			this.taskbar.startMenuDropDown.classList.add('hide');
		});



		const THIS = this;
		this.taskbar.startMenuDropDownLeftPanel.querySelectorAll('.start-menu-icon').forEach(function(element){
			element.addEventListener('click',function(event){
				event.stopPropagation();
				document.querySelectorAll('.window').forEach(function(windowElement){
					windowElement.classList.remove('focused');
				});
				const name = this.querySelector('div').innerHTML.toLowerCase();
				THIS.start(name);
				THIS.taskbar.startMenuDropDown.classList.add('hide');
			});
		});
		this.backgroundImages = [
			'winXp_big.jpg'
		];
		this.setBackground();
		//new MineSweeper();
		//new Tetris();
	}

	start(program){
		this.taskbar.startMenuDropDown.classList.add('hide');
		this.taskbar.taskbarIconsElement.querySelectorAll('.taskbar-item').forEach(function(element){
			element.classList.remove('focused');
		});


		//MOZE BOLJE!!!!
		switch(program){
			case 'tetris':
				if (this.tetrisGame) {
					this.tetrisGame.focus();
				} else {
					this.tetrisGame = new Tetris();
				}
			break;
			case 'minesweeper':
				if (this.minesweeperGame) {
					this.minesweeperGame.focus();
				} else {
					this.minesweeperGame = new MineSweeper();
				}
			break;
		}
	}

	setBackground(){
		this.backgroundImage = new Image();
		this.backgroundImage.src = 'images/' + this.backgroundImages[0];
		this.backgroundImage.addEventListener('load', ()=>{
			this.winXPElement.style.backgroundImage = 'url(' + this.backgroundImage.src + ')';
			this.adjustBackground();
			window.addEventListener('resize', (event)=>{
				this.adjustBackground();
			});
		});
	}
	adjustBackground(){
		const alfa = this.backgroundImage.height / this.backgroundImage.width < window.innerHeight / window.innerWidth;
		this.winXPElement.style.backgroundSize = alfa ? 'auto 100%' : '100% auto';
	}
}

const winXP = new WinXP();