function handleMouseDown(event){
	event.stopPropagation();
	function clearSelection() {
		 if (window.getSelection) {window.getSelection().removeAllRanges();}
		 else if (document.selection) {document.selection.empty();}
	}
	clearSelection();
	const moveWindow = (event)=>{
		
		//console.log('moveWindow');
		//console.log(event);
		//console.log(this);
		this.parentElement.style.top = event.clientY - Y + 'px';
		this.parentElement.style.left = event.clientX - X + 'px';
		//console.log(window.getSelection().anchorNode);
		let x = event.clientX - X;
		let y = event.clientY - Y;
		//console.log(x,y, window.innerWidth, window.innerHeight);
	}
	const releaseWindow = (event)=>{
		console.log('releaseWindow');
		console.log(window.getSelection().anchorNode);
		console.log(event);
		console.log(this);
		//this.removeEventListener('mousemove', moveWindow);
		//this.removeEventListener('mouseup',releaseWindow);

		window.removeEventListener('mousemove', moveWindow);
		window.removeEventListener('mouseup', releaseWindow);

		console.log(this.parentElement.style.top,
		this.parentElement.style.left);
		let tolerance = 40;
		let y = parseInt(this.parentElement.style.top);
		let x = parseInt(this.parentElement.style.left);
		//console.log('x',x);
		//console.log('y',y);
		if (y > window.innerHeight * 5) {
			//y = window.innerHeight - tolerance;
			y = 0;
		} else if (y > window.innerHeight) {
			y = window.innerHeight - tolerance;
		} else if (y < tolerance) {
			y = 0;
		}

		console.log(event.clientX, window.innerWidth);
		let width = parseInt(this.parentElement.style.width);
		console.log('x',x);
		console.log('tolerance',tolerance);
		console.log('width',width);
		
		if (event.clientX > window.innerWidth * 5) {
			x = 0;
		} else if (event.clientX > window.innerWidth) {
			x = window.innerWidth - parseInt(this.parentElement.style.width);

			x = window.innerWidth - width;
			
			//console.log(x)
		} else if (x < tolerance + width * 0) {
			x = 0;
		}

		this.parentElement.style.left = x + 'px';
		this.parentElement.style.top = y + 'px';
		/*function clearSelection() {
			 if (window.getSelection) {window.getSelection().removeAllRanges();}
			 else if (document.selection) {document.selection.empty();}
		}
		clearSelection();*/
	}

	//console.log(this)
	//console.log(event);
	//console.log(event.srcElement.classList);
	
	if (event.srcElement.classList.contains('window-sub-header') === false && event.srcElement.classList.contains('shadow') === false) {
		return;
	}
	//console.log('event', event);
	if (event.button !== 0) {//not LEFT button
		return;
	}

	this.parentElement.classList.add('focused');
	console.log('parent',this.parentElement);
	
	const windowName = this.parentElement.querySelector('.window-sub-header').innerHTML;
	document.querySelectorAll('.taskbar-item').forEach(function(element){
		//console.log(element);
		if (element.innerHTML === windowName) {
			element.classList.add('focused');
		} else {
			element.classList.remove('focused');
		}
	});

	document.querySelectorAll('.window').forEach(function(element){
		if (element.querySelector('.window-sub-header').innerHTML === windowName) {
			element.classList.add('focused');
		} else {
			element.classList.remove('focused');
		}
	});
	let X = event.clientX - parseInt(this.parentElement.style.left);
	let Y = event.clientY - parseInt(this.parentElement.style.top);
	//console.log(X,Y);
	window.addEventListener('mousemove', moveWindow);
	window.addEventListener('mouseup', releaseWindow);;
}

class Window{
	constructor(name){

		this.windowElement = document.createElement('DIV');

		const headerElement = document.createElement('DIV');
		const subHeaderElement = document.createElement('DIV');
		const menuElement = document.createElement('DIV');
		this.taskbarItemElement = document.createElement('DIV');
		this.programElement = document.createElement('DIV');

		//HERE TODO
		//Z-INDEX
		//POSITION
		this.windowElement.style.top = (Math.floor(Math.random() * 3) + 2) * 50 + 'px';
		this.windowElement.style.left = (Math.floor(Math.random() * 3) + 2) * 50 + 'px';


		this.windowElement.classList.add('window');

		this.focus();

		headerElement.classList.add('window-header');
		subHeaderElement.classList.add('window-sub-header');


		const shadowElement = document.createElement('DIV');
		shadowElement.classList.add('shadow');
		headerElement.appendChild(shadowElement);
		headerElement.appendChild(subHeaderElement);

		menuElement.classList.add('window-menu');

		const fileMenuElement = document.createElement('DIV');
		fileMenuElement.classList.add('sub-menu');
		fileMenuElement.innerHTML = 'Game';
		menuElement.appendChild(fileMenuElement);


		this.fileDropDownElement = document.createElement('UL');
		this.fileDropDownElement.classList.add('drop-down-menu');
		this.fileDropDownElement.classList.add('hide');
		
		const newGameString = 'New game';
		const exitString = 'Exit';

		this.fileDropDownElement.innerHTML = '<li>' + newGameString + '</li><li>' + exitString + '</li>';
		fileMenuElement.appendChild(this.fileDropDownElement);

		fileMenuElement.addEventListener('click', (event) => {
			this.fileDropDownElement.classList.toggle('hide');
			if (event.target.tagName.toUpperCase() === 'LI') {
				switch(event.target.innerHTML){
					case exitString: this.exit(); break;
					case newGameString: this.newGame(); break;
				}
			}
		});

		fileMenuElement.addEventListener('mouseleave', (event)=>{
			this.fileDropDownElement.classList.add('hide');
		});

		this.taskbarItemElement.classList.add('taskbar-item');
		const imageElement = document.createElement('IMG');
		imageElement.src = 'images/' + name + '.ico';
		imageElement.addEventListener('load', ()=>{
			this.taskbarItemElement.prepend(imageElement);			
		});
		const taskbarItemNameElement = document.createElement('DIV');
		taskbarItemNameElement.innerHTML = name;

		this.taskbarItemElement.appendChild(taskbarItemNameElement);
		//this.taskbarItemElement.style.backgroundImage = 'url(images/' + name + '.png)';

		//this.taskbarItemElement.style.backgroundImage = 'url(images/' + name + '.png)';
		
		this.taskbarItemElement.addEventListener('click', (event)=>{
			console.log('event CLICK', event);
			document.querySelectorAll('.taskbar-item').forEach(function(element){
				if (element.querySelector('DIV').innerHTML.toLowerCase() === name) {
					element.classList.toggle('focused');
				} else {
					element.classList.remove('focused');
				}
			});

			document.querySelectorAll('.window').forEach(function(element){
				if (element.querySelector('.window-sub-header').innerHTML === name) {
					element.classList.toggle('focused') && (element.style.display = 'block');
				} else {
					element.classList.remove('focused');
				}
			});
			document.querySelector('#startMenuDropDown').classList.add('hide');
			event.stopPropagation();
		});

		const taskbarItemShadow = document.createElement('DIV');
		taskbarItemShadow.classList.add('taskbar-item-shadow');
		//this.taskbarItemElement.appendChild(taskbarItemShadow);

		subHeaderElement.innerHTML = name;
		subHeaderElement.style.backgroundImage = 'url(images/' + name + '.ico)';

		this.programElement.classList.add('window-program');

		headerElement.addEventListener('mousedown', handleMouseDown);

		this.windowElement.appendChild(headerElement);
		this.windowElement.appendChild(menuElement);
		this.windowElement.appendChild(this.programElement);

		this.getWinXPElement().appendChild(this.windowElement);
		this.getTaskBarContainerElement().appendChild(this.taskbarItemElement);

		const minimizeButton = document.createElement('DIV');
		minimizeButton.classList.add('button');
		minimizeButton.classList.add('minimize-button');

		const maximizeButton = document.createElement('DIV');
		maximizeButton.classList.add('button');
		maximizeButton.classList.add('maximize-button');
		maximizeButton.disable = true;

		const closeButton = document.createElement('DIV');
		closeButton.classList.add('button');
		closeButton.classList.add('close-button');

		headerElement.appendChild(minimizeButton);
		headerElement.appendChild(maximizeButton);
		headerElement.appendChild(closeButton);

		closeButton.addEventListener('click', ()=>{
			this.exit();
		});

		minimizeButton.addEventListener('click', (event)=>{
			event.stopPropagation();
			this.windowElement.style.display = 'none';
			this.windowElement.classList.remove('focused');
			this.taskbarItemElement.classList.remove('focused');
		});

		maximizeButton.addEventListener('click', function(event){
			event.stopPropagation();
			this.focus();
		});

		this.windowElement.addEventListener('mousedown', (event)=>{
			//console.log('FOCUS MOUSEDOWN');
			event.stopPropagation();
			document.querySelectorAll('.focused').forEach(function(element){
				element.classList.remove('focused');
			});
			this.focus();
		});

		this.windowElement.addEventListener('click', (event)=>{
			//console.log('FOCUS CLICK');
			event.stopPropagation();

			document.querySelectorAll('.focused').forEach(function(element){
				element.classList.remove('focused');
			});
			this.focus();
			document.querySelector('#startMenuDropDown').classList.add('hide');
		});
	}

	focus(){
		this.windowElement.classList.add('focused');
		this.windowElement.style.display = 'block';
		this.taskbarItemElement.classList.add('focused');
	}

	exit(){
		this.clearAllIntervals && this.clearAllIntervals();
		
		this.taskbarItemElement.parentElement.removeChild(this.taskbarItemElement);
		this.windowElement.parentElement.removeChild(this.windowElement);
		this.parentExit();
	}

	newGame(){
		this.clearAllIntervals();
		this.startGame();
	}

	getWinXPElement(){
		return document.getElementById('winXP');
	}

	getTaskBarContainerElement(){
		return this.getWinXPElement().querySelector('#taskbar #taskbar-icon-container #taskbar-icons');
	}
}