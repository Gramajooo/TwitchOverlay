const drops = [];

function createDropElement(url, isAvatar = false){
    const div = document.createElement('div');
    div.className = 'drop';
    div.innerHTML = `
    <img class="chute" src="img/paracaidas.png" >
    <div class="user-image">
        <img class="${isAvatar ? 'avatar' : ''}" 
        src="${url}" >
    </div>`;
    return div;
}


function doDrop(url, isAvatar = false){
    const element = createDropElement(url, isAvatar);
    const drop = {
        id: Date.now() + Math.random(),
        element,
        location: {
            x: window.innerWidth * Math.random(),
            y: -200,
        },
        velocity: {
            x: Math.random() * (Math.random() > 0.5 ? -1 : 1) * 5,
            y: 2 + Math.random() * 2
        }
    };
    drops.push(drop);    
    document.body.appendChild(element);
    updateDropPosition(drop);
}

function updateDropPosition(drop) {
    if(drop.landed) return;
    drop.element.style.top = drop.location.y + 'px';
    drop.element.style.left = (drop.location.x - (drop.element.clientWidth / 2)) + 'px';
}

function update(){
    drops.forEach(drop => {
        if(drop.landed) return;
        drop.location.x += drop.velocity.x;
        drop.location.y += drop.velocity.y;
        const elementWidth = drop.element.clientWidth / 2;
        if (drop.location.x + elementWidth >= window.innerWidth){
            drop.velocity.x = -Math.abs(drop.velocity.x);
        }else if (drop.location.x - elementWidth < 0) {
            drop.velocity.x = Math.abs(drop.velocity.x);
        }

        if(drop.location.y + drop.element.clientHeight >= window.innerHeight){
            drop.velocity.x = 0;
            drop.velocity.y = 0;
            drop.location.y = window.innerHeight - drop.element.clientHeight;
            drop.landed = true;
            drop.element.classList.add('landed');
            const { x } = drop.location;
            const score = x => ((1-Math.abs(window.innerWidth/2-x))/window.innerWidth/2)*100;
            console.log(score);
        }
    });
}

function draw(){
    drops.forEach(updateDropPosition);
}

const emotes = [
    'https://static-cdn.jtvnw.net/emoticons/v1/301379071/1.0',
    'https://static-cdn.jtvnw.net/emoticons/v1/1436650/1.0',
    'https://static-cdn.jtvnw.net/emoticons/v1/300507033/1.0',
];

emotes.forEach(doDrop);

doDrop('https://static-cdn.jtvnw.net/jtv_user_pictures/3ab4df77-c5e0-4c9f-9bf0-19ed841a6fb2-profile_image-70x70.png', true);

function gameLoop(){
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
