/*
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d');

console.log('start')
H = canvas.height = 1000;
W = canvas.width = 2000;
*/
G = 0.5;//Gravity - vertical influence
V = +0.1;//Wind - horizontal influence
//ctx.fillStyle = 'green'
const preloadAssets = [
	'games/worms/images/explosion.png',
	'games/worms/images/missle25.png',
	'games/worms/images/0.jpg',
	'games/worms/images/1.jpg',
	'games/worms/images/2.jpg',
	'games/worms/images/worms1.ico',
	'games/worms/images/bazooka0-green32.png',
	'games/worms/images/pattern0.jpg',
	'games/worms/images/pattern1.jpg',
	'games/worms/images/pattern2.jpg',
	'games/worms/images/topPattern0.jpg',
	'games/worms/images/topPattern1.jpg',
	'games/worms/images/topPattern2.jpg',
	
];

let totalAssetsLength = preloadAssets.length;
for (const src of preloadAssets) {
	const preload = new Image();
	preload.src = 'games/worms/images/explosion.png';
	preload.addEventListener('load', ()=>{
		if (--totalAssetsLength == 0) {
			console.log('all assets preloaded')
		}
	});
}
class Shell{
	constructor(angle, power, startPoint, ctx, orientation, layout, pixelZoom){
		angle = orientation ? 90 - angle : angle - 270;
		//console.log('%c' + angle + ' ' +  power + ' ' + V.toFixed(2), 'background:red;color:yellow;font-size:2em');
		this.orientation = orientation;
		console.log('ORIENTATION', orientation)
		this.x = startPoint.x;
		this.y = startPoint.y;
		angle = angle * Math.PI / 180;
		this.deltaX = power * Math.cos(angle);
		this.deltaY = -power * Math.sin(angle);
		this.ctx = ctx;
		this.image = new Image();
		this.image.src = 'games/worms/images/missle25.png';
		this.image.addEventListener('load', ()=>{
			this.imageH = this.image.height;
			this.imageW = this.image.width;
		});
		
		this.blastImage = new Image();
		this.blastImage.src = 'games/worms/images/explosion.png';
		this.blastImageH = this.blastImage.height;
		this.blastImageW = this.blastImage.width;
		console.log('LOADED2', this.blastImageH, this.blastImageW)
		
		this.layout = layout;
		this.pixelZoom = pixelZoom;
		console.log('pixelZoom', pixelZoom)

	}
	move(){
		//console.log(this.x, this.y)
		this.ctx.clearRect(this.x,this.y,32,32);
		//this.deltaX += V;//wind effect
		this.prevX = this.x;
		this.prevY = this.y;
		
		this.x += this.deltaX;
		this.deltaY += G;
		this.y += this.deltaY;
		const deltaAndleX = this.x - this.prevX;
		const deltaAndleY = this.y - this.prevY;
		//console.log(this.x, this.y)
		this.missleAngle = deltaAndleX ? Math.atan(deltaAndleY / deltaAndleX) : (deltaAndleY > 0 ? 90 : -90) * (this.orientation ? 1:-1) * Math.PI / 180;
		
		//console.log(this.x, this.y)
		//console.log(this.missleAngle);
		if ( this.y >850 || this.x>1250 || this.x < -100) {//COLISION
			//clearInterval(interval);
			//sss;
			//this.ctx.clearRect(0,0,800,800);
			//shell = new Shell((Math.random() * 30 >>0)+45, (Math.random() * 30 >>0) + 30);
			V = (0.5 - Math.random())*0.5;
			//V = 0
			this.endTurn();
			//winXP.wormsGame.nextTurn();
			//winXP.wormsGame.checkTotalDamage();
		}
		
	}
	endTurn(){
		console.log('%cEND TURN', 'color:yellow;background:blue;font-size:2em')
		
		clearInterval(this.interval);
		winXP.wormsGame.checkTotalDamage(this.x, this.y, 0);
		return;
		//winXP.wormsGame.nextTurn();
	}
	render(){
		this.ctx.clearRect(this.prevX - this.imageW, this.prevY- this.imageH, this.imageW * 2, this.imageH * 2);
		this.ctx.save();
		this.ctx.translate(this.x, this.y);
		this.ctx.rotate(this.missleAngle);
		this.ctx.scale(this.orientation ? 1:-1, 1)
		this.ctx.drawImage(this.image, -this.imageW/2, -this.imageH/2);
		this.ctx.restore();
	}
	play(){
		console.log('%cPLAY', 'color:white;background:red;font-size:2em')
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
		if (this.layout[row]?.[col] == '*') {
			clearInterval(this.interval);
			//explode
			const blastRadius = 10;
			for (let h=-blastRadius; h<=blastRadius; h++) {
				for (let w=-blastRadius; w<=blastRadius; w++) {
					const cellRow = row + h;
					const cellCol = col + w;
					if ((cellCol - col)**2 + (cellRow - row)**2<=blastRadius**2) {
						if(this.layout[cellRow]?.[cellCol] == '*') {
							this.layout[cellRow][cellCol] = ' ';
							//console.log(cellRow, cellCol);
						}
						
					}
				}
			}
			//console.log(this.layout.map(a=>a.join('')).join('\n'))
			const limit = 25;
			let blast = 0;
			const X = this.x>>0;
			const Y = this.y>>0;
			console.log(this.x, this.y)
			const nCols = 5;
			const nRows = 5;

			
			const spriteWidth = this.blastImage.width;
			const spriteHeight = this.blastImage.width;
			const imageWidth = spriteWidth / nCols;
			const imageHeight = spriteWidth / nRows;
			const imageZoom = 0.9;
			
			const interval = setInterval(()=>{
				const imageRow = blast / nCols >> 0;
				const imageCol = blast % nCols;
				
				blast++;
				this.ctx.drawImage(
					this.blastImage,
					imageCol * imageWidth, imageRow * imageHeight + 1,
					imageWidth, imageHeight,
					X - imageHeight * imageZoom, Y - imageWidth * imageZoom,
					imageWidth * imageZoom * 2, imageHeight * imageZoom * 2
				);
				
			}, 33);
			
			
			
			setTimeout(() => {
				clearInterval(interval);
				const radius = blastRadius * this.pixelZoom;
				this.ctx.clearRect(X - radius, Y - radius, radius*2, radius*2)
				this.ctx.clearRect(0,0,1250,850);
				winXP.wormsGame.renderBackground();
				winXP.wormsGame.checkTotalDamage(X, Y, blastRadius * this.pixelZoom);
			}, (limit) * 33)
			
		} else {
			if(0)
			setTimeout(()=>{
				this.myTurn = 0;
				this.render();
				//this.blastRadius < 0
				winXP.wormsGame.nextTurn();
			},2000);
		}
	}
	simulate(){
		
	}
}


class Worm {
    constructor(col, ctx, ctxWeapons, layout, pixelZoom, brick, orientation = 0){
		this.damage = 100;
        this.col = col;
        this.x = col * pixelZoom;
        this.ctx = ctx;
        this.ctxWeapons = ctxWeapons;
        this.layout = layout;
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
	activate() {
		console.log('%cactivate', 'color:yellow;background:blue;font-size:2em')
		this.myTurn = 1;	
		this.active = 1;
		this.render();
	}
	
	checkDamage(X, Y, blastRadius) {
		this.damageChecked = 0;
		const distance = Math.round(((this.x - X) ** 2 + (this.y - Y) ** 2)**0.5);
		
		console.log('%c' + this.x + ' ' + this.y+ ' ' + blastRadius+ ' ' + X+ ' ' + Y+ ' ' + distance, 'color:yellow;background:red;font-size:2em')
		
		this.blastRadius = blastRadius - distance;
		if (this.blastRadius < 0) {
			console.log('%c this.blastRadius < 0' , 'color:yellow;background:blue;font-size:2em')
			setTimeout(()=>{
				//this.myTurn = 0;
				//this.render();
				//this.blastRadius < 0
				//winXP.wormsGame.nextTurn();
			}, 2000);
			this.damageChecked = 1;
			return;
		}
		//check drop
		this.checkDrop();
		
		//this.animateDamage();
		
	}
	checkDrop(){
		console.log('%cchecking DROP', 'color:lime;background:green;font-size:2em')
		this.layout[this.row][this.col] = ' ';
		//console.log(this.layout.map(a=>a.join(' ').slice(0,100)).join('\n'))
		
		console.log(this.row, this.col)
			let targetRow;
			for(let h=1; ;h++){
				try{
					if(this.layout[this.row + h][this.col] == this.brick){
						targetRow = this.row + h-1;
						console.log('%c land ' + h + ' ' + targetRow, 'color:red;background:yellow;font-size:3em');
						break;
					}
				} catch(e){
					targetRow = this.layout.length + this.pixelZoom * 10;
					console.log('%cexception', 'color:red;background:yellow;text-size:3em');
					this.damage = 0;
					break;
				}
			}
			let G= 0;
			this.y = this.row * this.pixelZoom;
			console.log('start drop',this.y, this.row);
			const interval = setInterval(_=>{
				G+=.5;
				this.y += G;
				this.row = this.y / this.pixelZoom >> 0;
				if (this.row >= targetRow) {
					this.row = targetRow;
					clearInterval(interval);
					this.animateDamage();
				}
				this.render();
			}, 33);
		
	}
	animateDamage(){
		console.log('ANIMATE DAMAGE')
		const originalDamage = this.damage;
		let targetDamage = originalDamage - this.blastRadius;
		if (targetDamage < 0) {
			targetDamage = 0;
			this.damage = 0;
		}
		const limit = 10;
		let counter = limit;
		
		
		this.damageInterval = setInterval(()=>{
			counter--;
			if (counter == 0) {
				clearInterval(this.damageInterval);
				this.damageChecked = 1;
			}
			this.damage = targetDamage + Math.round((originalDamage - targetDamage) * counter / limit);
			
			//console.log(newDamage);
			this.render();
		},100);
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
		console.log('power up', this.poweringUp, this.active)
		if (this.poweringUp || this.active != 1){
			return;
		}
		
		console.log("POWERING UP");
		this.poweringUp = true;
		this.power = 6;
		this.renderTrail();
		this.interval = setInterval(()=>{
			this.power++;
			if (this.power == this.powerArray.length) {
				this.fire();
				clearInterval(this.interval);
				return;
			}
			this.renderTrail();
			
		}, 40);
	}
	renderTrail(){
		//console.log("POWER UP", this.power);
		const startPoint = this.powerArray[6];
		this.ctx.beginPath();
		this.ctx.strokeStyle = this.power > this.powerArray.length / 2 ? this.power > this.powerArray.length * 5 / 6 ? 'Lime' : 'yellow' : 'Aqua';
		this.ctx.lineWidth = 5;
		this.ctx.moveTo(startPoint.x, startPoint.y);
		const endPoint = this.powerArray[this.power];
		this.ctx.lineTo(endPoint.x, endPoint.y);
		this.ctx.lineCap = "round";
		this.ctx.stroke();
	}
	fire(){
		clearInterval(this.interval);
		this.poweringUp = 0;
		//this.poweringUp = false;
		//console.log("FIRE");
		this.active = 0;
		this.render();
		this.shell = new Shell(this.bazookaAngle, this.power, this.powerArray[0], this.ctxWeapons, this.orientation, this.layout, this.pixelZoom);
		this.shell.play();
	}
    adjustH(){
        for (let h=0; h<this.layout.length; h++) {
            if (this.layout[h][this.col] == this.brick && this.layout[h-1]?.[this.col] == ' ') {
                this.row = h-1;
        		this.y = this.row * this.pixelZoom;
                break;
            }
        }
    }
    render(){
        //console.log(this.row, this.col);
        //console.log(this.row * this.pixelZoom, this.col * this.pixelZoom);
        //console.log('ctx 333', this.ctx);
		let x = this.col * this.pixelZoom - this.width / 2;
		let y = this.row * this.pixelZoom - this.height / 1.2;
		this.ctx.clearRect(x - 100, y - 100,300,200)
		this.ctx.save();
		this.ctx.scale(this.orientation?1:-1,1);
        this.ctx.drawImage(this.image, this.orientation ? x : -x - 32, y);
		this.ctx.restore();
        //this.ctx.drawImage(this.bazooka, this.col * this.pixelZoom - this.width / 2, this.row * this.pixelZoom - this.height/1.5);
		//sss;
		
		this.ctx.save();
		this.ctx.font = '12px Arial';
		this.ctx.fillStyle = 'black';
		this.ctx.fillText(this.damage, x + 20 - 5 * this.damage.toString().length, y - 8);
		this.ctx.restore();
		if (this.myTurn != 1) {
			return;
		}
		
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
		if (this.active != 1) {
			return;
		}
		x -= 32/2 * 3.5 * (this.orientation ? e: -0.35);
		x += 16;
		
		y+=5;
		
		this.ctx.fillStyle = 'Aqua';
		this.powerArray = Array(31).fill(0);
		const sinTotalAngle = Math.sin(totalAngle * Math.PI / 180);
		const cosTotalAngle = Math.cos(totalAngle * Math.PI / 180);
		for (const i in this.powerArray) {
			//console.log('i', i)
			const trailX = i * 3 * cosTotalAngle * (this.orientation ? 1 : -1) + x;
			const trailY = i * 3 * sinTotalAngle + y;
			this.powerArray[i] = {x:trailX, y:trailY};
			if(i>3 && (i)%5 == 0){
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
	play(layout, enemy) {
		//console.log(layout.map(a=>a.join(' ').slice(100)).join('\n'));
		console.log(enemy)
		
		
		/*const power = 30 || Math.random() * 31 >> 0;
		const angle = 90 || Math.random() * 91 >> 0;
		let orientation = -1 || Math.random() < 0.5 ? 1 : 0;
		
		
		orientation = 0;*/
		this.myTurn = 1;
		const maxAngle = 90;
		const angleIncrement = 15;
		const power = (Math.random() * 16 >> 0) + 15;
		const angle = ((Math.random() * (maxAngle/angleIncrement) >> 0) + 1) * angleIncrement;
		this.bazookaAngle = 90;
		let orientation = Math.random() < 0.5 ? 1 : 0;
		orientation = 0;
		let X = this.col * this.pixelZoom - this.width / 2;
		let Y = this.row * this.pixelZoom - this.height / 1.2;
		const e=0.92;
		X+=32/2 * 3.5 * (this.orientation ? e: -0.35);
		Y+=32/2;
		X -= 32/2 * 3.5 * (this.orientation ? e: -0.35);
		X += 16;
		Y+=5;
		
		console.log(power, angle, orientation);
		console.log(X,Y);
		
		console.log('%cTARGET ANGLE ' + angle + ' ' + power, 'color:white;background:red;font-size:2em')
		this.shell = new Shell(angle, power, {x:X, y:Y}, this.ctxWeapons, orientation, this.layout, this.pixelZoom);
		this.shell.simulate();//TODO
		this.orientation = orientation;
		
		this.render();
		const interval = setInterval(()=>{
			
			const angleDiff = angle - this.bazookaAngle;
			console.log('this.bazookaAngle', this.bazookaAngle)
			if (angleDiff == 0) {
				clearInterval(interval);
				setTimeout(_=>{
					this.shell.play();
				},100);
			}
			this.bazookaAngle += 15 * (angleDiff > 0 ? 1:-1);
			//console.groupCollapse
			this.render();	
		}, 100);
		return;
		
		//ssss;
		//setInterval();
		
		
		
		//this.simulate();
		for (;;) {
			
			break;
			
			
		}
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
		
        this.canvasWeapons = document.createElement('CANVAS');
        this.canvasWeapons.setAttribute('id', 'worms-canvas-weapons');
        //this.canvasBackground.style.position = 'absolute';
        this.canvasWeapons.style.position = 'absolute';
        this.canvasWeapons.style.top = 0;
        this.canvasWeapons.style.left = 0;
        this.ctxWeapons = this.canvasWeapons.getContext('2d');
		
        this.programElement.appendChild(this.canvasBackground);
        this.programElement.appendChild(this.canvas);
        this.programElement.appendChild(this.canvasWeapons);
		
		
		this.gameOverElement = document.createElement('DIV');
		this.gameOverElement.setAttribute('id', 'game-over-worms');
        this.gameOverElement.style.position = 'absolute';
        this.gameOverElement.style.top = 0;
        this.gameOverElement.style.left = 0;
		this.programElement.appendChild(this.gameOverElement);
        
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
		
		this.wormIndex = 0; //this.worms.some(a=>a.myturn);
	
        	
        
        return;

		this.init();
		this.reset();
	}
    setEventListeners(){
		window.addEventListener('keydown', (event)=>{
			if (~this.wormIndex && this.worms[this.wormIndex].active && this.windowElement.classList.contains('focused')) {
				console.log('event', event.key, this.wormIndex);
				const worm = this.worms[this.wormIndex];
				switch(event.key.toLowerCase()){
					case 'arrowright':
					case 'd':
					case 6:
						worm.orientation = 1;
						break;
					case 'arrowleft':
					case 'a':
					case 4:
						worm.orientation = 0;
						break;
						
					case 'arrowup':
					case 'w':
					case 8:
						worm.adjustBazookaAngle(1);
						break;
					case 'arrowdown':
					case 's':
					case 2:
						worm.adjustBazookaAngle(-1);
						break;
					case this.fire:
						worm.powerUp();
						return; // not to render
				}
				
				this.worms[0].render();
			}
		})
		
		window.addEventListener('keyup', (event)=>{
			if (event.key == this.fire && ~this.wormIndex && this.worms[this.wormIndex].active) {
				this.worms[this.wormIndex].fire();
			}
		});
	}
	checkTotalDamage(X, Y, blastRadius){
		console.log('%ccheckTotalDamage ' + X + ' ' + Y + ' ' + blastRadius, 'color:black; background:lime; font-size:2em')
		const allWorms = [this.worms,this.enemy].flat(1);
		for (const worm of allWorms){
			worm.checkDamage(X,Y,blastRadius);
		}
		
		const interval = setInterval(()=>{
			//this.myTurn = 0;
			//this.render();
			
			if (allWorms.every(a=>a.damageChecked == 1)) {
				clearInterval(interval);
				if (this.worms.every(a=>a.damage == 0)) {
					this.gameOver();
					return;
				}
				if (this.enemy.every(a=>a.damage == 0)) {
					this.nextLevel();
					return;
				}
				setTimeout(()=>{
					allWorms.forEach(a=>{a.active = 0; a.myTurn=0;a.render()});
					winXP.wormsGame.nextTurn();	
				}, 1000);
				
			}
		}, 100);
	}
    render(){
        
    }
    renderBackground(){
        this.ctxBackground.clearRect(0, 0, this.W, this.H);
        this.pattern.addEventListener('load',()=>{
    		this.drawMainPattern();        
            this.topPattern.addEventListener('load',()=>{
    			this.drawTopLayer();
				this.eraseExplodedCells();
            });
        })
		this.drawMainPattern();
		this.drawTopLayer();
		this.eraseExplodedCells();
    }
	drawMainPattern(){
		for (const h in this.basicLayout) {
			for (const w in this.basicLayout[h]) {
				if (this.basicLayout[h][w] == this.brick) {
					this.ctxBackground.drawImage(this.pattern, w * this.cellSize, h * this.cellSize);
				}
			}
		}
	}
	drawTopLayer(){
		for (const w in this.basicLayout[0]) {
			for (const h in this.basicLayout) {
				if (this.basicLayout[h][w] == this.brick && this.basicLayout[h-1]?.[w] == ' ') {
					this.ctxBackground.drawImage(this.topPattern, w * this.cellSize, h * this.cellSize);
					//break;
				}
			}
		}
	}
	eraseExplodedCells(){
		//HERE
		//if(0)
		for (const w in this.layout[0]) {
			for (const h in this.layout) {
				if (this.layout[h][w] != this.brick) {
					//this.ctxBackground.drawImage(this.topPattern, w * this.cellSize, h * this.cellSize);
					this.ctxBackground.clearRect(w * this.pixelZoom, h * this.pixelZoom, this.pixelZoom, this.pixelZoom)
					//break;
				}
			}
		}

		if(0)
		for (const {row, col} of this.originalLayoutArray) {
			if (this.layout[row][col] != this.brick) {
				this.ctxBackground.clearRect(col * this.pixelZoom, row * this.pixelZoom, this.pixelZoom, this.pixelZoom)
			}    
		}
	}
    resizeCanvas(){
		
		for (const element of [this.canvasWeapons, this.canvasBackground, this.canvas]) {
			element.height = this.H;
			element.width = this.W;
		}
		this.gameOverElement.style.height = this.H + this.dimm;
		this.gameOverElement.style.width = this.W + this.dimm;
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
            [
                "*                       *",
                "*                       *",
                "*                       *",
                "*     *                 *",
                "*    *                  *",
                "*    ****               *",
                "*       **     *        *",
                "***********    **       *",
                "****          ********* *",
                "*************************",
                "*************************",
                "*************************",
                "*************************",
            ],
            [
				"*************************",
                "*************************",
                "*                       *",
                "*                       *",
                "*                       *",
                "**    *                 *",
                "**   *                  *",
                "*    ****               *",
                "*  *    **     *        *",
                "***********    **      **",
                "****  ***     ***   *** *",
                "**************** *****  *",
                "****                *****",
                "*************************",
                "*************************",
            ],
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
	nextTurn(){
		console.log('%cnextTurn ' + this.wormIndex + ' ' + ~this.wormIndex, 'color:lime;background:black;font-size:2em');
		if (~this.wormIndex) {
			this.wormIndex = -1;
			this.playEnemy();
		} else {
			this.wormIndex = 0;
			this.worms[this.wormIndex].activate();
		}
	}
	playEnemy(){
		console.log('%cPLAY ENEMY', 'color:lime;background:black;font-size:2em');
		this.enemy[0].play(this.layout, this.worms);
	}

	clearAllIntervals(){
		clearInterval(this.interval);
	}


	setDifficulty(){
		
        
        this.basicLayout = this.getLayout();
        this.H = this.cellSize * this.basicLayout.length;
        this.W = this.cellSize * this.basicLayout[0].length;
        console.log(this.H * this.cellSize, this.W*this.cellSize)
        const blockSize = this.cellSize / this.pixelZoom;
        this.binaryH = this.basicLayout.length * blockSize;
        this.binaryW = this.basicLayout[0].length * blockSize;
        
        this.layout = Array(this.basicLayout.length * blockSize).fill(1).map((_,h)=>{
            const H = h/blockSize>>0;
            return Array(this.basicLayout[0].length).fill(1).map((_,w)=>{
                return (this.basicLayout[H][w]).repeat(blockSize).split('');
            }).flat(1);
        });

        this.originalLayoutArray =
            this.layout.map(
            (line,h)=>
                line.map((element, w)=>{
                    return {row:h, col:w};
                })
            ).flat(1).filter(cell=>this.layout[cell.row][cell.col] != this.brick);
        //console.log(this.originalLayoutArray.length);
        
        //sss;
        /*for (let i=0; i<100; i++) {
            this.layout[Math.random() * this.binaryH >> 0][Math.random() * this.binaryW >> 0] = ' ';
        }
        
        
        this.originalLayoutArray =
            this.layout.map(
            (line,h)=>
                line.map((element, w)=>{
                    return {row:h, col:w};
                })
            ).flat(1).filter(cell=>this.layout[cell.row][cell.col] != this.brick);
            
        console.log(this.originalLayoutArray.length);*/
        //console.log(this.layout.map(a=>a.join('')).join('\n'))
        //sss;
        
        console.log('ctx', this.ctx)
        switch(this.difficulty){
			case 0:
                this.worms = [new Worm(2 * blockSize + 2, this.ctx, this.ctxWeapons, this.layout, this.pixelZoom, this.brick, 1)];
				this.worms[0].activate();
				
				this.enemy = [new Worm(12 * blockSize + 2, this.ctx, this.ctxWeapons, this.layout, this.pixelZoom, this.brick)];
				break;
			case 1:
				console.log('dasdas')
                this.worms = [new Worm(2 * blockSize + 2, this.ctx, this.ctxWeapons, this.layout, this.pixelZoom, this.brick, 1)];
				this.worms[0].activate();
				this.enemy = [new Worm(20 * blockSize + 2, this.ctx, this.ctxWeapons, this.layout, this.pixelZoom, this.brick)];
				break;
			default:
                this.worms = [new Worm(2 * blockSize + 2, this.ctx, this.ctxWeapons, this.layout, this.pixelZoom, this.brick, 1)];
				this.worms[0].activate();
				this.enemy = [new Worm(22 * blockSize + 2, this.ctx, this.ctxWeapons, this.layout, this.pixelZoom, this.brick)];
				break;
		}
        
		this.difficultyElements.forEach((element, index)=>{
			if (index === this.difficulty) {
				element.classList.add('selected');
			} else {
				element.classList.remove('selected');
			}
		});

        this.canvasBackground.style.backgroundImage = `url("${this.imagesPath}${this.difficulty}.jpg")`;
        this.pattern.src = `${this.imagesPath}pattern${this.difficulty}.jpg`;
        this.topPattern.src = `${this.imagesPath}topPattern${this.difficulty}.jpg`;
		this.resizeCanvas()
		this.renderBackground()

	}

	init(){	
		this.setDifficulty();
		this.start = false;
	}

	gameOver(){
		this.setMessage("GAME OVER");	
	}
	nextLevel(){
		this.setMessage("WIN !!! NEXT LEVEL");
		setTimeout(()=>{
			this.difficulty = (this.difficulty + 1) %3;
			this.startGame();
		}, 2000);
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

	startGame(){
		this.init();
		this.reset();
	}

	setValue(value){
		value < 0 && (value = '-' + value.toString().slice(1).padStart(2,'0'));
		return '<div>' + value.toString().padStart(3,'0').split('').join('</div><div>') + '</div>';
	}

	reset(){
		this.clearAllIntervals();
		this.gameOverElement.classList.remove('dim');
		this.gameOverElement.innerHTML = '';
		this.wormIndex = 0;
	}

	parentExit(){
		winXP.wormsGame = null;
	}

}