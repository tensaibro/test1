const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let player = { x: 300, y: 200, size: 20, speed: 4 };
let keys = {};
let enemies = [];
let gameOver = false;
let spawnRate = 1000;

document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

function spawnEnemy() {
  const size = Math.random() * 30 + 10;
  enemies.push({
    x: Math.random() * canvas.width,
    y: -size,
    size,
    speed: Math.random() * 3 + 1
  });
}

setInterval(spawnEnemy, spawnRate);

function update() {
  if (gameOver) return;

  if (keys["ArrowUp"] || keys["w"]) player.y -= player.speed;
  if (keys["ArrowDown"] || keys["s"]) player.y += player.speed;
  if (keys["ArrowLeft"] || keys["a"]) player.x -= player.speed;
  if (keys["ArrowRight"] || keys["d"]) player.x += player.speed;

  player.x = Math.max(0, Math.min(canvas.width - player.size, player.x));
  player.y = Math.max(0, Math.min(canvas.height - player.size, player.y));

  enemies.forEach(e => {
    e.y += e.speed;
    if (
      player.x < e.x + e.size &&
      player.x + player.size > e.x &&
      player.y < e.y + e.size &&
      player.y + player.size > e.y
    ) {
      gameOver = true;
    }
  });

  enemies = enemies.filter(e => e.y < canvas.height + e.size);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "cyan";
  ctx.fillRect(player.x, player.y, player.size, player.size);

  ctx.fillStyle = "red";
  enemies.forEach(e => ctx.fillRect(e.x, e.y, e.size, e.size));

  if (gameOver) {
    ctx.fillStyle = "white";
    ctx.font = "40px monospace";
    ctx.fillText("GAME OVER", canvas.width / 2 - 120, canvas.height / 2);
  }
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
