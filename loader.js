const allImages = [
    'games/worms/images/explosion.png',
    'images/loader.png',
    'images/profile1.jpg',
    'images/Windows-XP-icon.png',
    'images/minesweeper.ico',
    'images/tetris.ico',
    'images/worms.ico',
    'images/winXp_big.jpg',
    'images/social-facebook-icon.png',
    'images/codingame.jpg',
    'images/linkedin-icon.png',
    'images/github.png',
    'images/worms.ico',
    'images/minimize.ico',
    'images/maximize2.ico',
    'images/close2.ico',
    'games/worms/images/0.jpg',
    'games/worms/images/worms1.ico',
    'games/worms/images/bazooka0-green32.png',
    'games/worms/images/pattern0.jpg',
    'games/worms/images/topPattern0.jpg',
    'images/tetris.ico',
    'images/minesweeper.ico',
    'games/minesweeper/images/smile.ico'
]

const loaderScreen = document.createElement('DIV');
loaderScreen.setAttribute('id', 'loaderScreen');
document.body.appendChild(loaderScreen);
const loaderFrame = document.createElement('DIV');
loaderFrame.setAttribute('id', 'loaderFrame');
loaderScreen.appendChild(loaderFrame);
for (let i=0; i<3; i++) {
    const loaderFloat = document.createElement('DIV');
    loaderFloat.setAttribute('class', 'loaderFloat');
    loaderFrame.appendChild(loaderFloat);
}

const loaderImage = new Image();
loaderImage.src = 'images/loader.png';
loaderImage.addEventListener('load', ()=>{
    loaderScreen.style.backgroundImage = 'url(' + loaderImage.src + ')'; 
    loaderScreen.style.backgroundRepeat = 'no-repeat';
    loaderScreen.style.backgroundPosition = '50%';
});

let totalImagesLoading = allImages.length;
for (const imageName of allImages) {
    const image = new Image();
    image.src = imageName;
    image.addEventListener('load',()=>{
        totalImagesLoading--;
        if(totalImagesLoading == 0){
            loaderScreen.className = 'fadeLoader';
            console.log('allImages LOADED');
        }
    });
}