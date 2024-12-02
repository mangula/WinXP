class Icon{
	constructor(winXp, icon, index){

		this.iconElement = document.createElement('DIV');
		this.iconElement.classList.add('icon');
		this.iconElement.style.top = 20 + 90 * index + 'px';
		this.iconElement.style.left = 20 + 'px';
		this.iconElement.addEventListener('click', function(event){
			document.querySelectorAll('.window').forEach(function(element){
				element.classList.remove('focused');
			});
			document.querySelectorAll('.taskbar-item').forEach(function(element){
				element.classList.remove('focused');
			});
			winXp.start(icon);
			event.stopPropagation();
		});

		this.image = new Image();

		this.image.src = winXp.imagesFolder + icon + '.ico';

		this.iconElement.appendChild(this.image);
		this.nameElement = document.createElement('DIV');
		this.nameElement.classList.add('icon-name');
		this.nameElement.innerHTML = icon;

		this.iconElement.appendChild(this.nameElement);

		winXp.winXPElement.appendChild(this.iconElement);
	}
}