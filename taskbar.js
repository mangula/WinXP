class Taskbar{
	constructor(imagesFolder){

		//TASKBAR
		this.taskbarElement = document.createElement('DIV');
		this.taskbarElement.draggable = false;//DOUBLECKECK
		this.taskbarElement.setAttribute('id', 'taskbar');

		//SUB-TASKBAR
		const subTaskbarElement = document.createElement('DIV');
		subTaskbarElement.setAttribute('id', 'sub-taskbar');
		this.taskbarElement.appendChild(subTaskbarElement);

		//STAR MENU
		const startMenu = document.createElement('DIV');
		startMenu.innerHTML = 'start';
		startMenu.setAttribute('id', 'startMenu');
		
		const shadowStartMenuElement = document.createElement('DIV');
		shadowStartMenuElement.classList.add('shadow');
		startMenu.appendChild(shadowStartMenuElement);
		subTaskbarElement.appendChild(startMenu);

		//START MENU DROP DOWN
		this.startMenuDropDown = document.createElement('DIV');
		this.startMenuDropDown.setAttribute('id', 'startMenuDropDown');
		//this.startMenuDropDown.classList.add('hide');
		this.startMenuDropDown.addEventListener('click', (event)=>{
			event.stopPropagation();
		});
		subTaskbarElement.appendChild(this.startMenuDropDown);

		startMenu.addEventListener('click', (event)=>{
			event.stopPropagation();
			this.startMenuDropDown.classList.toggle('hide');
			document.querySelectorAll('.window.focused').forEach(function(element){
				element.classList.remove('focused');
			});
			document.querySelectorAll('.taskbar-item.focused').forEach(function(element){
				element.classList.remove('focused');
			});

		});

		//START MENU DROP DOWN ITEMS
		const startMenuDropDownHeader = document.createElement('DIV');
		startMenuDropDownHeader.setAttribute('id', 'startMenuDropDownHeader');

		//const startMenuDropDownShadow = document.createElement('DIV');
		//startMenuDropDownShadow.classList.add('shadow');
		//startMenuDropDownHeader.appendChild(startMenuDropDownShadow);
		this.imagesFolder = imagesFolder;
		const startMenuDropDownImage = document.createElement('IMG');
		startMenuDropDownImage.src = this.imagesFolder + 'profile1.jpg';
		startMenuDropDownImage.addEventListener('load', ()=>{
			startMenuDropDownHeader.prepend(startMenuDropDownImage);	
		});

		const startMenuDropDownHeaderName = document.createElement('DIV');
		startMenuDropDownHeader.appendChild(startMenuDropDownHeaderName);
		startMenuDropDownHeaderName.innerHTML = 'Mainframe';

		const startMenuDropDownPanel = document.createElement('DIV');
		startMenuDropDownPanel.setAttribute('id', 'startMenuDropDownPanel');

		this.startMenuDropDownLeftPanel = document.createElement('DIV');
		this.startMenuDropDownLeftPanel.setAttribute('id', 'startMenuDropDownLeftPanel');

		const startMenuDropDownRightPanel = document.createElement('DIV');
		startMenuDropDownRightPanel.setAttribute('id', 'startMenuDropDownRightPanel');

		const socialLinks = [
			{image:'social-facebook-icon.png', name:'facebook', link:'https://www.facebook.com/misatheface1'},
			{image:'codingame.jpg', name:'codingame', link:'https://www.codingame.com/profile/228f67aeb45255c7de13fe03b1f0a8458693901'},
			{image:'linkedin-icon.png', name:'linkedin', link:'https://www.linkedin.com/in/milosrepic/'}
		];

		for (const socialLink of socialLinks) {
			const socialLinkElement = document.createElement('DIV');
			socialLinkElement.classList.add('socialLink');
			socialLinkElement.innerHTML = '<a target="_blank" href="' + socialLink.link + '">' + socialLink.name  + '</a>';
			socialLinkElement.style.backgroundImage = 'url("images/' + socialLink.image + '")';
			startMenuDropDownRightPanel.appendChild(socialLinkElement);
			//console.log(socialLinkElement.style.backgroundImage);
			//console.log(socialLink.image);
		}

		startMenuDropDownPanel.appendChild(this.startMenuDropDownLeftPanel);
		startMenuDropDownPanel.appendChild(startMenuDropDownRightPanel);

		this.startMenuDropDown.appendChild(startMenuDropDownHeader);
		this.startMenuDropDown.appendChild(startMenuDropDownPanel);

		//XP LOGO
		//XP LOGO-SHADOW
		const xpLogo = new Image();
		xpLogo.src = this.imagesFolder + 'Windows-XP-icon.png';
		xpLogo.addEventListener('load', ()=>{
			const xpImageElement = document.createElement('IMG');
			const xpImageShadowElement = document.createElement('IMG');
			xpImageShadowElement.src = xpImageElement.src = xpLogo.src;
			xpImageShadowElement.draggable = xpImageElement.draggable = false;
			startMenu.appendChild(xpImageElement);
			startMenu.appendChild(xpImageShadowElement);
		})

		
		//TASKBAR-ICON-CONTAINER
		const taskbarIconContainerElement = document.createElement('DIV');
		taskbarIconContainerElement.setAttribute('id', 'taskbar-icon-container');
		const shadowTaskbarContainerElement = document.createElement('DIV');
		shadowTaskbarContainerElement.classList.add('shadow');
		taskbarIconContainerElement.appendChild(shadowTaskbarContainerElement);
		subTaskbarElement.appendChild(taskbarIconContainerElement);
		
		//TASKBAR-ICONS
		this.taskbarIconsElement = document.createElement('DIV');
		this.taskbarIconsElement.setAttribute('id', 'taskbar-icons');
		taskbarIconContainerElement.appendChild(this.taskbarIconsElement);

		//CLOCK
		const clockElement = document.createElement('DIV');
		clockElement.setAttribute('id', 'taskbar-clock');
		subTaskbarElement.appendChild(clockElement);
		const shadowClockElement = document.createElement('DIV');
		shadowClockElement.classList.add('shadow');
		clockElement.appendChild(shadowClockElement);

		//TIME
		this.timeOutputElement = document.createElement('DIV');
		clockElement.appendChild(this.timeOutputElement);

		this.setTime();

	}

	addIcon(name){
		const iconElement = document.createElement('DIV');
		iconElement.classList.add('start-menu-icon');
		
		const imgElement = document.createElement('IMG');
		imgElement.src = this.imagesFolder + name + '.ico';
		imgElement.addEventListener('load',()=>{
			iconElement.prepend(imgElement);	
		});
		
		const nameElement = document.createElement('DIV');
		nameElement.innerHTML = name;
		iconElement.appendChild(nameElement);
		iconElement.dataset.name = name;
		this.startMenuDropDownLeftPanel.appendChild(iconElement);
	}

	setTime(){
		this.timeOutputElement.innerHTML = this.getTime();
		var interval = setInterval(()=>{
			var time = this.getTime();
			if (this.timeOutputElement.innerHTML !== time) {
				clearInterval(interval);
				this.timeOutputElement.innerHTML = time;
				setInterval(()=>{
					this.timeOutputElement.innerHTML = this.getTime();
				}, 1000 * 60)
			}
		},1000);
	}

	getTime(){
		let date = new Date();
		let hours = date.getHours();
		return (hours > 13 ? hours % 12 : hours)
			+ this.formatTime(date.getMinutes())
			//+ this.formatTime(date.getSeconds())
			+ ' ' + (hours > 11 ? 'PM' : 'AM');
	}

	formatTime(time){
		return ':' + String(time).padStart(2,0);
	}
}