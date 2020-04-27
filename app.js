function createDrop(url, isAvatar = false){
    const div = document.createElement('div');
    div.className = 'drop'
    div.innerHTML = `
    <img class="chute" src="img/paracaidas.png">
    <div class="user-image">
        <img class="${isAvatar ? 'avatar' : ''}" 
        src="${url}">
    </div>`;
    return div;
}