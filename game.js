const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let player = { x: 300, y: 350, size: 20, speed: 4 };
let keys = {};
let enemies = [];
let bullets = [];
let gameOver = false;

let level = 1;
let enemySpawnRate = 1200;
let enemySpeedMin = 1;
let enemySpeedMax = 3;

document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

function spawnEnemy() {
  const size = Math.random() * 30 + 15;
  enemies.push({
    x: Math.random() * canvas.width,
    y: -size,
    size,
    speed: Math.random() * (enemySpeedMax - enemySpeedMin) + enemySpeedMin
  });
}

setInterval(spawnEnemy, enemySpawnRate);

function fireBurst() {
  // 3 fast bullets upward
  for (let i = 0; i < 3; i++) {
    bullets.push({
      x: player.x + player.size / 2 - 2,
      y: player.y,
      size: 5,
      speed: 8 + i * 2
    });
  }
}

function update() {
  if (gameOver) return;

  // Movement (WASD only)
  if (keys["w"]) player.y -= player.speed;
  if (keys["s"]) player.y += player.speed;
  if (keys["a"]) player.x -= player.speed;
  if (keys["d"]) player.x += player.speed;

  // Boundaries
  player.x = Math.max(0, Math.min(canvas.width - player.size, player.x));
  player.y = Math.max(0, Math.min(canvas.height - player.size, player.y));

  // Shooting
  if (keys["f"]) fireBurst();

  // Update bullets
  bullets.forEach(b => b.y -= b.speed);
  bullets = bullets.filter(b => b.y > -10);

  // Update enemies
  enemies.forEach(e => {
    e.y += e.speed;

    // Collision with player
    if (
      player.x < e.x + e.size &&
      player.x + player.size > e.x &&
      player.y < e.y + e.size &&
      player.y + player.size > e.y
    ) {
      gameOver = true;
    }
  });

  // Bullet hits enemy
  bullets.forEach(b => {
    enemies.forEach((e, i) => {
      if (
        b.x < e.x + e.size &&
        b.x + b.size > e.x &&
        b.y < e.y + e.size &&
        b.y + b.size > e.y
      ) {
        enemies.splice(i, 1);
      }
    });
  });

  // Remove off-screen enemies
  enemies = enemies.filter(e => e.y < canvas.height + e.size);

  // Level progression
  if (enemies.length === 0) {
    level++;
    enemySpawnRate = Math.max(300, enemySpawnRate - 100);
    enemySpeedMin += 0.5;
    enemySpeedMax += 0.5;
    spawnEnemy();
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Player
  ctx.fillStyle = "cyan";
  ctx.fillRect(player.x, player.y, player.size, player.size);

  // Enemies
  ctx.fillStyle = "red";
  enemies.forEach(e => ctx.fillRect(e.x, e.y, e.size, e.size));

  // Bullets
  ctx.fillStyle = "yellow";
  bullets.forEach(b => ctx.fillRect(b.x, b.y, b.size, b.size));

  // Level display
  ctx.fillStyle = "white";
  ctx.font = "20px monospace";
  ctx.fillText("Level: " + level, 10, 25);

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
