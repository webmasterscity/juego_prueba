// Space Defender - Juego Espacial Adictivo
class SpaceDefender {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.gameState = 'menu'; // menu, playing, paused, gameOver
        
        // Game settings
        this.score = 0;
        this.level = 1;
        this.lives = 3;
        this.gameSpeed = 1;
        
        // Game objects
        this.player = null;
        this.enemies = [];
        this.bullets = [];
        this.enemyBullets = [];
        this.powerUps = [];
        this.particles = [];
        this.stars = [];
        
        // Input handling
        this.keys = {};
        this.mouse = { x: 0, y: 0 };
        
        // Game timing
        this.lastTime = 0;
        this.enemySpawnTimer = 0;
        this.powerUpTimer = 0;
        this.levelTimer = 0;
        
        // Power-up system
        this.currentWeapon = 'basic';
        this.currentPowerUp = 'none';
        this.powerUpDuration = 0;
        
        // Initialize game
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.createStarField();
        this.loadHighscores();
        this.showScreen('menuScreen');
    }
    
    setupEventListeners() {
        // Menu buttons
        document.getElementById('startBtn').addEventListener('click', () => this.startGame());
        document.getElementById('instructionsBtn').addEventListener('click', () => this.showScreen('instructionsScreen'));
        document.getElementById('highscoresBtn').addEventListener('click', () => this.showScreen('highscoresScreen'));
        
        // Game buttons
        document.getElementById('pauseBtn').addEventListener('click', () => this.togglePause());
        document.getElementById('resumeBtn').addEventListener('click', () => this.resumeGame());
        document.getElementById('menuBtn').addEventListener('click', () => this.showMainMenu());
        document.getElementById('menuBtn2').addEventListener('click', () => this.showMainMenu());
        document.getElementById('restartBtn').addEventListener('click', () => this.startGame());
        
        // Navigation buttons
        document.getElementById('backToMenuBtn').addEventListener('click', () => this.showScreen('menuScreen'));
        document.getElementById('backToMenuBtn2').addEventListener('click', () => this.showScreen('menuScreen'));
        
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            
            if (e.code === 'Space' && this.gameState === 'playing') {
                e.preventDefault();
                this.shoot();
            }
            
            if (e.code === 'KeyP' && this.gameState === 'playing') {
                this.togglePause();
            }
            
            if (e.code === 'Escape') {
                if (this.gameState === 'playing') {
                    this.togglePause();
                } else if (this.gameState === 'paused') {
                    this.showMainMenu();
                }
            }
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
        
        // Mouse movement
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });
    }
    
    showScreen(screenId) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Show requested screen
        document.getElementById(screenId).classList.add('active');
        
        if (screenId === 'highscoresScreen') {
            this.displayHighscores();
        }
    }
    
    startGame() {
        this.gameState = 'playing';
        this.score = 0;
        this.level = 1;
        this.lives = 3;
        this.gameSpeed = 1;
        this.currentWeapon = 'basic';
        this.currentPowerUp = 'none';
        this.powerUpDuration = 0;
        
        // Clear game objects
        this.enemies = [];
        this.bullets = [];
        this.enemyBullets = [];
        this.powerUps = [];
        this.particles = [];
        
        // Create player
        this.player = new Player(this.canvas.width / 2, this.canvas.height - 100);
        
        // Reset timers
        this.enemySpawnTimer = 0;
        this.powerUpTimer = 0;
        this.levelTimer = 0;
        
        this.showScreen('gameScreen');
        this.gameLoop();
    }
    
    togglePause() {
        if (this.gameState === 'playing') {
            this.gameState = 'paused';
            this.showScreen('pauseScreen');
        } else if (this.gameState === 'paused') {
            this.resumeGame();
        }
    }
    
    resumeGame() {
        this.gameState = 'playing';
        this.showScreen('gameScreen');
        this.gameLoop();
    }
    
    showMainMenu() {
        this.gameState = 'menu';
        this.showScreen('menuScreen');
        this.updateStats();
    }
    
    gameOver() {
        this.gameState = 'gameOver';
        this.saveHighscore();
        this.updateStats();
        
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('finalLevel').textContent = this.level;
        
        this.showScreen('gameOverScreen');
    }
    
    gameLoop(currentTime = 0) {
        if (this.gameState !== 'playing') return;
        
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        this.update(deltaTime);
        this.render();
        
        requestAnimationFrame((time) => this.gameLoop(time));
    }
    
    update(deltaTime) {
        // Update player
        if (this.player) {
            this.player.update(deltaTime, this.keys, this.mouse, this.canvas);
        }
        
        // Update enemies
        this.enemies.forEach((enemy, index) => {
            enemy.update(deltaTime);
            if (enemy.y > this.canvas.height + 50) {
                this.enemies.splice(index, 1);
                this.lives--;
                if (this.lives <= 0) {
                    this.gameOver();
                    return;
                }
            }
        });
        
        // Update bullets
        this.bullets.forEach((bullet, index) => {
            bullet.update(deltaTime);
            if (bullet.y < -20) {
                this.bullets.splice(index, 1);
            }
        });
        
        // Update enemy bullets
        this.enemyBullets.forEach((bullet, index) => {
            bullet.update(deltaTime);
            if (bullet.y > this.canvas.height + 20) {
                this.enemyBullets.splice(index, 1);
            }
        });
        
        // Update power-ups
        this.powerUps.forEach((powerUp, index) => {
            powerUp.update(deltaTime);
            if (powerUp.y > this.canvas.height + 30) {
                this.powerUps.splice(index, 1);
            }
        });
        
        // Update particles
        this.particles.forEach((particle, index) => {
            particle.update(deltaTime);
            if (particle.life <= 0) {
                this.particles.splice(index, 1);
            }
        });
        
        // Update stars
        this.stars.forEach(star => star.update(deltaTime));
        
        // Spawn enemies
        this.enemySpawnTimer += deltaTime;
        if (this.enemySpawnTimer > 1000 / this.gameSpeed) {
            this.spawnEnemy();
            this.enemySpawnTimer = 0;
        }
        
        // Spawn power-ups
        this.powerUpTimer += deltaTime;
        if (this.powerUpTimer > 10000) {
            this.spawnPowerUp();
            this.powerUpTimer = 0;
        }
        
        // Level progression
        this.levelTimer += deltaTime;
        if (this.levelTimer > 30000) {
            this.nextLevel();
            this.levelTimer = 0;
        }
        
        // Power-up duration
        if (this.powerUpDuration > 0) {
            this.powerUpDuration -= deltaTime;
            if (this.powerUpDuration <= 0) {
                this.currentPowerUp = 'none';
                this.updateUI();
            }
        }
        
        // Check collisions
        this.checkCollisions();
        
        // Update UI
        this.updateUI();
    }
    
    render() {
        // Clear canvas
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw stars
        this.stars.forEach(star => star.draw(this.ctx));
        
        // Draw game objects
        if (this.player) this.player.draw(this.ctx);
        this.enemies.forEach(enemy => enemy.draw(this.ctx));
        this.bullets.forEach(bullet => bullet.draw(this.ctx));
        this.enemyBullets.forEach(bullet => bullet.draw(this.ctx));
        this.powerUps.forEach(powerUp => powerUp.draw(this.ctx));
        this.particles.forEach(particle => particle.draw(this.ctx));
    }
    
    spawnEnemy() {
        const types = ['basic', 'fast', 'tank', 'shooter'];
        const type = types[Math.floor(Math.random() * types.length)];
        const x = Math.random() * (this.canvas.width - 60);
        const y = -50;
        
        this.enemies.push(new Enemy(x, y, type, this.level));
    }
    
    spawnPowerUp() {
        const types = ['health', 'weapon', 'shield', 'speed'];
        const type = types[Math.floor(Math.random() * types.length)];
        const x = Math.random() * (this.canvas.width - 30);
        const y = -30;
        
        this.powerUps.push(new PowerUp(x, y, type));
    }
    
    shoot() {
        if (!this.player) return;
        
        switch (this.currentWeapon) {
            case 'basic':
                this.bullets.push(new Bullet(this.player.x + this.player.width / 2, this.player.y, 'player'));
                break;
            case 'double':
                this.bullets.push(new Bullet(this.player.x + 10, this.player.y, 'player'));
                this.bullets.push(new Bullet(this.player.x + this.player.width - 10, this.player.y, 'player'));
                break;
            case 'triple':
                this.bullets.push(new Bullet(this.player.x + this.player.width / 2, this.player.y, 'player'));
                this.bullets.push(new Bullet(this.player.x + 10, this.player.y, 'player'));
                this.bullets.push(new Bullet(this.player.x + this.player.width - 10, this.player.y, 'player'));
                break;
            case 'laser':
                this.bullets.push(new Bullet(this.player.x + this.player.width / 2, this.player.y, 'player', 'laser'));
                break;
        }
    }
    
    checkCollisions() {
        // Player bullets vs enemies
        this.bullets.forEach((bullet, bulletIndex) => {
            this.enemies.forEach((enemy, enemyIndex) => {
                if (this.checkCollision(bullet, enemy)) {
                    enemy.health -= bullet.damage;
                    this.bullets.splice(bulletIndex, 1);
                    
                    if (enemy.health <= 0) {
                        this.score += enemy.points;
                        this.createExplosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2);
                        this.enemies.splice(enemyIndex, 1);
                        
                        // Check if all enemies are destroyed
                        if (this.enemies.length === 0) {
                            this.nextLevel();
                        }
                    }
                }
            });
        });
        
        // Enemy bullets vs player
        if (this.player) {
            this.enemyBullets.forEach((bullet, index) => {
                if (this.checkCollision(bullet, this.player)) {
                    this.enemyBullets.splice(index, 1);
                    this.damagePlayer();
                }
            });
            
            // Enemies vs player
            this.enemies.forEach((enemy, index) => {
                if (this.checkCollision(enemy, this.player)) {
                    this.enemies.splice(index, 1);
                    this.damagePlayer();
                }
            });
            
            // Power-ups vs player
            this.powerUps.forEach((powerUp, index) => {
                if (this.checkCollision(powerUp, this.player)) {
                    this.applyPowerUp(powerUp.type);
                    this.powerUps.splice(index, 1);
                }
            });
        }
    }
    
    checkCollision(obj1, obj2) {
        return obj1.x < obj2.x + obj2.width &&
               obj1.x + obj1.width > obj2.x &&
               obj1.y < obj2.y + obj2.height &&
               obj1.y + obj1.height > obj2.y;
    }
    
    damagePlayer() {
        if (this.currentPowerUp === 'shield') {
            this.currentPowerUp = 'none';
            this.powerUpDuration = 0;
        } else {
            this.lives--;
            if (this.lives <= 0) {
                this.gameOver();
            }
        }
        
        this.createExplosion(this.player.x + this.player.width / 2, this.player.y + this.player.height / 2);
    }
    
    applyPowerUp(type) {
        switch (type) {
            case 'health':
                this.lives = Math.min(this.lives + 1, 5);
                break;
            case 'weapon':
                if (this.currentWeapon === 'basic') this.currentWeapon = 'double';
                else if (this.currentWeapon === 'double') this.currentWeapon = 'triple';
                else if (this.currentWeapon === 'triple') this.currentWeapon = 'laser';
                break;
            case 'shield':
                this.currentPowerUp = 'shield';
                this.powerUpDuration = 10000;
                break;
            case 'speed':
                this.currentPowerUp = 'speed';
                this.powerUpDuration = 8000;
                break;
        }
        
        this.updateUI();
    }
    
    nextLevel() {
        this.level++;
        this.gameSpeed += 0.2;
        this.createLevelUpEffect();
    }
    
    createExplosion(x, y) {
        for (let i = 0; i < 10; i++) {
            this.particles.push(new Particle(x, y, 'explosion'));
        }
    }
    
    createLevelUpEffect() {
        for (let i = 0; i < 20; i++) {
            this.particles.push(new Particle(this.canvas.width / 2, this.canvas.height / 2, 'levelup'));
        }
    }
    
    createStarField() {
        for (let i = 0; i < 100; i++) {
            this.stars.push(new Star(
                Math.random() * this.canvas.width,
                Math.random() * this.canvas.height,
                Math.random() * 2 + 1
            ));
        }
    }
    
    updateUI() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('level').textContent = this.level;
        document.getElementById('lives').textContent = this.lives;
        document.getElementById('weapon').textContent = this.getWeaponName();
        document.getElementById('powerup').textContent = this.getPowerUpName();
    }
    
    getWeaponName() {
        const names = {
            'basic': 'Básica',
            'double': 'Doble',
            'triple': 'Triple',
            'laser': 'Láser'
        };
        return names[this.currentWeapon] || 'Básica';
    }
    
    getPowerUpName() {
        const names = {
            'none': 'Ninguno',
            'shield': 'Escudo',
            'speed': 'Velocidad'
        };
        return names[this.currentPowerUp] || 'Ninguno';
    }
    
    saveHighscore() {
        const highscores = JSON.parse(localStorage.getItem('spaceDefenderHighscores') || '[]');
        highscores.push({
            score: this.score,
            level: this.level,
            date: new Date().toLocaleDateString()
        });
        
        highscores.sort((a, b) => b.score - a.score);
        highscores.splice(10); // Keep only top 10
        
        localStorage.setItem('spaceDefenderHighscores', JSON.stringify(highscores));
        
        // Update highest stats
        const highestScore = Math.max(...highscores.map(h => h.score));
        const highestLevel = Math.max(...highscores.map(h => h.level));
        
        localStorage.setItem('spaceDefenderHighestScore', highestScore);
        localStorage.setItem('spaceDefenderHighestLevel', highestLevel);
    }
    
    loadHighscores() {
        const highestScore = localStorage.getItem('spaceDefenderHighestScore') || 0;
        const highestLevel = localStorage.getItem('spaceDefenderHighestLevel') || 0;
        
        document.getElementById('highestScore').textContent = highestScore;
        document.getElementById('highestLevel').textContent = highestLevel;
    }
    
    displayHighscores() {
        const highscores = JSON.parse(localStorage.getItem('spaceDefenderHighscores') || '[]');
        const container = document.getElementById('highscoresList');
        
        if (highscores.length === 0) {
            container.innerHTML = '<p>No hay puntuaciones aún</p>';
            return;
        }
        
        container.innerHTML = highscores.map((score, index) => `
            <div class="highscore-item">
                <span>#${index + 1}</span>
                <span>${score.score} pts</span>
                <span>Nivel ${score.level}</span>
                <span>${score.date}</span>
            </div>
        `).join('');
    }
    
    updateStats() {
        this.loadHighscores();
    }
}

// Player class
class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 50;
        this.speed = 5;
        this.health = 100;
    }
    
    update(deltaTime, keys, mouse, canvas) {
        // Keyboard movement
        if (keys['ArrowLeft'] || keys['KeyA']) {
            this.x -= this.speed;
        }
        if (keys['ArrowRight'] || keys['KeyD']) {
            this.x += this.speed;
        }
        if (keys['ArrowUp'] || keys['KeyW']) {
            this.y -= this.speed;
        }
        if (keys['ArrowDown'] || keys['KeyS']) {
            this.y += this.speed;
        }
        
        // Mouse movement (optional)
        if (mouse.x > 0 && mouse.y > 0) {
            this.x = mouse.x - this.width / 2;
            this.y = mouse.y - this.height / 2;
        }
        
        // Keep player in bounds
        this.x = Math.max(0, Math.min(canvas.width - this.width, this.x));
        this.y = Math.max(0, Math.min(canvas.height - this.height, this.y));
    }
    
    draw(ctx) {
        // Draw player ship
        ctx.fillStyle = '#00d4ff';
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 2, this.y);
        ctx.lineTo(this.x, this.y + this.height);
        ctx.lineTo(this.x + this.width, this.y + this.height);
        ctx.closePath();
        ctx.fill();
        
        // Draw engine glow
        ctx.fillStyle = '#ff6b35';
        ctx.fillRect(this.x + this.width / 2 - 5, this.y + this.height, 10, 15);
    }
}

// Enemy class
class Enemy {
    constructor(x, y, type, level) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.level = level;
        
        switch (type) {
            case 'basic':
                this.width = 40;
                this.height = 40;
                this.speed = 2 + level * 0.1;
                this.health = 1 + level;
                this.points = 10 + level * 5;
                this.color = '#ff4757';
                break;
            case 'fast':
                this.width = 30;
                this.height = 30;
                this.speed = 4 + level * 0.2;
                this.health = 1 + Math.floor(level / 2);
                this.points = 15 + level * 8;
                this.color = '#ffa502';
                break;
            case 'tank':
                this.width = 60;
                this.height = 60;
                this.speed = 1 + level * 0.05;
                this.health = 3 + level * 2;
                this.points = 25 + level * 15;
                this.color = '#2f3542';
                break;
            case 'shooter':
                this.width = 35;
                this.height = 35;
                this.speed = 1.5 + level * 0.1;
                this.health = 2 + level;
                this.points = 20 + level * 10;
                this.color = '#ff3838';
                this.shootTimer = 0;
                this.shootInterval = 2000;
                break;
        }
    }
    
    update(deltaTime) {
        this.y += this.speed;
        
        if (this.type === 'shooter') {
            this.shootTimer += deltaTime;
            if (this.shootTimer > this.shootInterval) {
                this.shoot();
                this.shootTimer = 0;
            }
        }
    }
    
    shoot() {
        // This would create enemy bullets - simplified for now
    }
    
    draw(ctx) {
        ctx.fillStyle = this.color;
        
        switch (this.type) {
            case 'basic':
                ctx.fillRect(this.x, this.y, this.width, this.height);
                break;
            case 'fast':
                ctx.beginPath();
                ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, 0, Math.PI * 2);
                ctx.fill();
                break;
            case 'tank':
                ctx.fillRect(this.x, this.y, this.width, this.height);
                ctx.fillStyle = '#ff4757';
                ctx.fillRect(this.x + 10, this.y + 10, this.width - 20, this.height - 20);
                break;
            case 'shooter':
                ctx.fillRect(this.x, this.y, this.width, this.height);
                ctx.fillStyle = '#ff6b35';
                ctx.fillRect(this.x + this.width / 2 - 2, this.y, 4, 8);
                break;
        }
    }
}

// Bullet class
class Bullet {
    constructor(x, y, owner, type = 'normal') {
        this.x = x;
        this.y = y;
        this.owner = owner;
        this.type = type;
        this.width = type === 'laser' ? 4 : 6;
        this.height = type === 'laser' ? 20 : 12;
        this.speed = owner === 'player' ? 8 : 4;
        this.damage = type === 'laser' ? 3 : 1;
        this.color = owner === 'player' ? '#00d4ff' : '#ff4757';
    }
    
    update(deltaTime) {
        if (this.owner === 'player') {
            this.y -= this.speed;
        } else {
            this.y += this.speed;
        }
    }
    
    draw(ctx) {
        ctx.fillStyle = this.color;
        if (this.type === 'laser') {
            ctx.fillRect(this.x - this.width / 2, this.y, this.width, this.height);
        } else {
            ctx.fillRect(this.x - this.width / 2, this.y, this.width, this.height);
        }
    }
}

// PowerUp class
class PowerUp {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 30;
        this.type = type;
        this.speed = 2;
        
        this.colors = {
            'health': '#2ed573',
            'weapon': '#ffa502',
            'shield': '#00d4ff',
            'speed': '#ff6b35'
        };
    }
    
    update(deltaTime) {
        this.y += this.speed;
    }
    
    draw(ctx) {
        ctx.fillStyle = this.colors[this.type];
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Draw symbol
        ctx.fillStyle = '#fff';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(this.getSymbol(), this.x + this.width / 2, this.y + this.height / 2 + 5);
    }
    
    getSymbol() {
        const symbols = {
            'health': '+',
            'weapon': '⚔',
            'shield': '🛡',
            'speed': '⚡'
        };
        return symbols[this.type] || '?';
    }
}

// Particle class
class Particle {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.life = 100;
        this.maxLife = 100;
        
        if (type === 'explosion') {
            this.vx = (Math.random() - 0.5) * 10;
            this.vy = (Math.random() - 0.5) * 10;
            this.color = '#ff6b35';
        } else if (type === 'levelup') {
            this.vx = (Math.random() - 0.5) * 5;
            this.vy = (Math.random() - 0.5) * 5;
            this.color = '#00d4ff';
        }
    }
    
    update(deltaTime) {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= 2;
    }
    
    draw(ctx) {
        const alpha = this.life / this.maxLife;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, 3, 3);
        ctx.globalAlpha = 1;
    }
}

// Star class
class Star {
    constructor(x, y, speed) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.size = Math.random() * 2 + 1;
    }
    
    update(deltaTime) {
        this.y += this.speed;
        if (this.y > 600) {
            this.y = -10;
            this.x = Math.random() * 800;
        }
    }
    
    draw(ctx) {
        ctx.fillStyle = '#fff';
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    new SpaceDefender();
});