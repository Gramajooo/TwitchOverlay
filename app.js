const target = document.querySelector(".target");
const leaderBoard = document.querySelector(".leader-board");

const drops = [];
const currentUsers = {};
let highScores = [];

function createDropElement(url, isAvatar = false) {
  const div = document.createElement("div");
  div.className = "drop";
  div.innerHTML = `
    <img class="chute" src="img/paracaidas.png" >
    <div class="user-image">
        <img class="${isAvatar ? "avatar" : ""}" 
        src="${url}" >
    </div>`;
  return div;
}

function doDrop({ username, url, isAvatar = false }) {
  currentUsers[username] = true;
  const element = createDropElement(url, isAvatar);
  const drop = {
    id: username,
    element,
    location: {
      x: window.innerWidth * Math.random(),
      y: -200,
    },
    velocity: {
      x: Math.random() * (Math.random() > 0.5 ? -1 : 1) * 5,
      y: 2 + Math.random() * 2,
    },
  };
  drops.push(drop);
  document.body.appendChild(element);
  updateDropPosition(drop);
}

function updateDropPosition(drop) {
  if (drop.landed) return;
  drop.element.style.top = drop.location.y + "px";
  drop.element.style.left =
    drop.location.x - drop.element.clientWidth / 2 + "px";
}

function update() {
  const targetHalftWidth = target.clientWidth / 2;
  drops.forEach((drop) => {
    if (drop.landed) return;
    drop.location.x += drop.velocity.x;
    drop.location.y += drop.velocity.y;
    const elementWidth = drop.element.clientWidth / 2;
    if (drop.location.x + elementWidth >= window.innerWidth) {
      drop.velocity.x = -Math.abs(drop.velocity.x);
    } else if (drop.location.x - elementWidth < 0) {
      drop.velocity.x = Math.abs(drop.velocity.x);
    }

    if (drop.location.y + drop.element.clientHeight >= window.innerHeight) {
      drop.velocity.x = 0;
      drop.velocity.y = 0;
      drop.location.y = window.innerHeight - drop.element.clientHeight;
      drop.landed = true;
      drop.element.classList.add("landed");
      const { x } = drop.location;
      //const score = ((1 - Math.abs(window.innerWidth / 2 - x)) / window.innerWidth / 2) * 100;
      const score = Math.abs(window.innerWidth / 2 - x);
      //   console.log(`Calculated width`, target.clientWidth);
      if (score <= targetHalftWidth) {
        // console.log("Target hit", drop);
        const finalScore = (1 - score / targetHalftWidth) * 100;
        console.log(finalScore);
        leaderBoard.style.display = "block";
        highScores.push({
          username: drop.username,
          score: finalScore.toFixed(2),
        });
        highScores.sort((a, b) => b.score - a.score);
        highScores = highScores.slice(0, 5);
        renderLeaderBoard();
      }
    }
  });
}

function renderLeaderBoard() {
  const scores = leaderBoard.querySelector(`.scores`);
  scores.innerHTML = highScores.reduce((html, { score, username }) => {
    return html + `<p> ${score} ${username} </p>`;
  }, ``);
}

function draw() {
  drops.forEach(updateDropPosition);
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();

const client = new tmi.Client({
  connection: {
    secure: true,
    reconnect: true,
  },
  channels: ["Gramajooo"],
});

client.connect().catch(console.error);

client.on("message", (channel, { emotes, username }, message) => {
  if (message.startsWith("!drop")) {
    if (currentUsers[username]) return;
    const args = message.split(" ");
    args.shift();
    const url = args.length ? args[0].trim() : "";

    if (emotes) {
      const emotesIds = Object.keys(emotes);
      const emote = emotesIds[Math.floor(Math.random() * emotesIds.length)];
      doDrop({
        url: `https://static-cdn.jtvnw.net/emoticons/v1/${emote}/2.0`,
        username,
      });
    } else {
      console.log(username, url, emotes);
    }
    
} else {
    // console.log(tags.username, message, tags)
    // console.log(username, message, emote);
  }
});
