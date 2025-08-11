// Space Defender - Juego Espacial Adictivo con Todas las Mejoras
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
        this.gameStartTime = 0;
        this.currentGameTime = 0;
        
        // Game objects
        this.player = null;
        this.enemies = [];
        this.bullets = [];
        this.enemyBullets = [];
        this.bossBullets = [];
        this.powerUps = [];
        this.particles = [];
        this.stars = [];
        this.bosses = [];
        this.bossClones = [];
        this.specialEffects = [];
        this.laserBeams = [];
        this.earthquakeWaves = [];
        
        // Advanced systems
        this.audioManager = null;
        this.particleSystem = null;
        this.achievementSystem = null;
        
        // Boss system
        this.bossSpawnTimer = 0;
        this.bossSpawnInterval = 30000; // 30 segundos
        this.currentBoss = null;
        this.bossLevel = 1;
        
        // Input handling
        this.keys = {};
        this.mouse = { x: 0, y: 0 };
        
        // Game timing
        this.lastTime = 0;
        this.enemySpawnTimer = 0;
        this.powerUpTimer = 0;
        this.levelTimer = 0;
        this.survivalTime = 0;
        this.totalGames = 0;
        this.highestScore = 0;
        
        // Power-up system
        this.currentWeapon = 'basic';
        this.currentPowerUp = 'none';
        this.powerUpDuration = 0;
        
        // Advanced game mechanics
        this.combo = 0;
        this.maxCombo = 0;
        this.comboTimer = 0;
        this.comboTimeout = 3000; // 3 segundos para mantener combo
        this.difficultyMultiplier = 1;
        this.specialPowerUpChance = 0.1; // 10% chance de power-up especial
        
        // Statistics
        this.shotsFired = 0;
        this.shotsHit = 0;
        this.enemiesDestroyed = 0;
        this.powerUpsCollected = 0;
        this.lastShotTime = 0;
        this.totalDamageDealt = 0;
        this.totalDamageTaken = 0;
        this.survivalTime = 0;
        
        // Daily Challenge System
        this.dailyChallenge = null;
        this.dailyChallengeCompleted = false;
        this.dailyChallengeReward = 0;
        
        // Time Freeze System
        this.timeFreezeActive = false;
        this.timeFreezeTimer = 0;
        this.timeFreezeDuration = 5000; // 5 segundos
        this.timeFreezeSlowFactor = 0.3; // Ralentiza el tiempo al 30%
        
        // Initialize game
        this.init();
    }
    
    init() {
        // Configurar canvas
        this.resizeCanvas();
        
        // Crear jugador
        this.player = new Player(this.canvas.width / 2, this.canvas.height - 100);
        
        // Crear estrellas de fondo
        for (let i = 0; i < 100; i++) {
            this.stars.push(new Star());
        }
        
        // Inicializar sistemas avanzados
        this.audioManager = new AudioManager();
        this.particleSystem = new ParticleSystem();
        this.achievementSystem = new AchievementSystem();
        
        // Generar desafío diario
        this.generateDailyChallenge();
        
        // Cargar datos guardados
        this.loadGameData();
        
        // Configurar eventos
        this.setupEventListeners();
        
        // Mostrar pantalla del menú
        this.showScreen('menuScreen');
        
        // Iniciar bucle del juego
        this.gameLoop();
    }
    
    setupEventListeners() {
        // Botones del menú principal
        document.getElementById('startBtn').addEventListener('click', () => {
            this.showScreen('gameScreen');
        });
        
        document.getElementById('instructionsBtn').addEventListener('click', () => {
            this.showScreen('instructionsScreen');
        });
        
        document.getElementById('highscoresBtn').addEventListener('click', () => {
            this.showScreen('highscoresScreen');
        });
        
        document.getElementById('statsBtn').addEventListener('click', () => {
            this.showStatsScreen();
        });
        
        // Botones de instrucciones
        document.getElementById('backToMenuFromInstructions').addEventListener('click', () => {
            this.showMainMenu();
        });
        
        // Botones de puntuaciones altas
        document.getElementById('backToMenuFromHighscores').addEventListener('click', () => {
            this.showMainMenu();
        });
        
        // Botones de estadísticas
        document.getElementById('backToMenuFromStats').addEventListener('click', () => {
            this.showMainMenu();
        });
        
        document.getElementById('resetStats').addEventListener('click', () => {
            this.resetStats();
        });
        
        // Botones del juego
        document.getElementById('pauseBtn').addEventListener('click', () => {
            this.togglePause();
        });
        
        document.getElementById('backToMenuBtn').addEventListener('click', () => {
            this.showMainMenu();
        });
        
        // Botones de pausa
        document.getElementById('resumeBtn').addEventListener('click', () => {
            this.togglePause();
        });
        
        document.getElementById('backToMenuFromPause').addEventListener('click', () => {
            this.showMainMenu();
        });
        
        // Botones de game over
        document.getElementById('playAgainBtn').addEventListener('click', () => {
            this.showScreen('gameScreen');
        });
        
        document.getElementById('backToMenuFromGameOver').addEventListener('click', () => {
            this.showMainMenu();
        });
        
        // Controles del teclado
        document.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
            
            // Tecla Escape para pausar/reanudar
            if (e.key === 'Escape' && this.gameState === 'playing') {
                this.togglePause();
            }
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });
        
        // Controles del mouse
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });
        
        this.canvas.addEventListener('click', () => {
            if (this.gameState === 'playing' && this.player) {
                this.shoot();
            }
        });
        
        // Evento de cambio de tamaño de ventana
        window.addEventListener('resize', () => {
            this.resizeCanvas();
        });
    }
    
    showScreen(screenId) {
        // Ocultar todas las pantallas
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Mostrar la pantalla solicitada
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.add('active');
        }
        
        // Cambiar estado del juego
        if (screenId === 'gameScreen') {
            this.gameState = 'playing';
            this.startGame();
        } else if (screenId === 'menuScreen') {
            this.gameState = 'menu';
        } else if (screenId === 'pausedScreen') {
            this.gameState = 'paused';
        } else if (screenId === 'gameOverScreen') {
            this.gameState = 'gameOver';
        }
    }
    
    startGame() {
        this.gameStartTime = Date.now();
        this.currentGameTime = 0;
        this.survivalTime = 0;
        this.score = 0;
        this.level = 1;
        this.lives = 3;
        this.gameSpeed = 1;
        this.combo = 0;
        this.maxCombo = 0;
        this.comboTimer = 0;
        this.difficultyMultiplier = 1;
        this.specialPowerUpChance = 0.1;
        
        // Resetear jugador
        if (this.player) {
            this.player.health = this.player.maxHealth;
            this.player.shield = this.player.maxShield;
            this.player.specialWeapon = null;
            this.player.specialWeaponAmmo = 0;
            this.player.currentWeapon = 'basic';
        }
        
        // Limpiar arrays
        this.enemies = [];
        this.bullets = [];
        this.enemyBullets = [];
        this.bossBullets = [];
        this.powerUps = [];
        this.particles = [];
        this.bosses = [];
        this.bossClones = [];
        this.specialEffects = [];
        this.laserBeams = [];
        this.earthquakeWaves = [];
        
        // Resetear timers
        this.enemySpawnTimer = 0;
        this.powerUpTimer = 0;
        this.levelTimer = 0;
        this.bossSpawnTimer = 0;
        
        // Resetear time freeze
        this.timeFreezeActive = false;
        this.timeFreezeTimer = 0;
        
        // Iniciar música
        if (this.audioManager) {
            this.audioManager.playMusic('background', true);
        }
        
        console.log('🚀 ¡Juego iniciado!');
    }
    
    togglePause() {
        if (this.gameState === 'playing') {
            this.gameState = 'paused';
            this.showScreen('pausedScreen');
            
            // Pausar música
            if (this.audioManager) {
                this.audioManager.pauseMusic();
            }
        } else if (this.gameState === 'paused') {
            this.gameState = 'playing';
            this.showScreen('gameScreen');
            
            // Reanudar música
            if (this.audioManager) {
                this.audioManager.resumeMusic();
            }
        }
    }
    
    resumeGame() {
        if (this.gameState === 'paused') {
            this.gameState = 'playing';
            this.showScreen('gameScreen');
            this.audioManager.playMusic('background', true);
            this.gameLoop();
        }
    }
    
    showMainMenu() {
        this.showScreen('menuScreen');
        
        // Iniciar música de fondo
        if (this.audioManager) {
            this.audioManager.playMusic('background', true);
        }
    }
    
    gameOver() {
        this.gameState = 'gameOver';
        
        // Guardar puntuación alta
        if (this.score > 0) {
            this.highscores.push({
                score: this.score,
                date: new Date().toLocaleDateString(),
                level: this.level,
                survivalTime: this.survivalTime
            });
            
            // Ordenar por puntuación
            this.highscores.sort((a, b) => b.score - a.score);
            
            // Mantener solo las 10 mejores
            if (this.highscores.length > 10) {
                this.highscores = this.highscores.slice(0, 10);
            }
            
            // Actualizar puntuación más alta
            if (this.score > (this.highscores[0]?.score || 0)) {
                this.highestScore = this.score;
            }
        }
        
        // Incrementar contador de juegos
        this.totalGames = (this.totalGames || 0) + 1;
        
        // Guardar datos
        this.saveGameData();
        
        // Mostrar pantalla de game over
        this.showScreen('gameOverScreen');
        
        // Sonido de game over
        if (this.audioManager) {
            this.audioManager.playSound('gameOver', 0.8);
        }
        
        // Actualizar UI de game over
        this.updateGameOverUI();
    }
    
    updateGameOverUI() {
        const scoreElement = document.getElementById('finalScore');
        const levelElement = document.getElementById('finalLevel');
        const timeElement = document.getElementById('finalTime');
        const comboElement = document.getElementById('finalCombo');
        
        if (scoreElement) scoreElement.textContent = this.score;
        if (levelElement) levelElement.textContent = this.level;
        if (timeElement) {
            const minutes = Math.floor(this.survivalTime / 60000);
            const seconds = Math.floor((this.survivalTime % 60000) / 1000);
            timeElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
        if (comboElement) comboElement.textContent = this.maxCombo;
    }
    
    // Método principal del bucle del juego
    gameLoop(currentTime = 0) {
        if (!this.lastTime) {
            this.lastTime = currentTime;
        }
        
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        // Solo actualizar si el juego está activo
        if (this.gameState === 'playing') {
            this.update(deltaTime);
        }
        
        // Siempre renderizar
        this.render();
        
        // Continuar el bucle
        requestAnimationFrame((time) => this.gameLoop(time));
    }
    
    // Método para actualizar el estado del juego
    update(deltaTime) {
        // Calcular tiempo efectivo (considerando time freeze)
        const effectiveDeltaTime = this.timeFreezeActive ? 
            deltaTime * this.timeFreezeSlowFactor : deltaTime;
        
        // Actualizar tiempo de supervivencia
        this.survivalTime += effectiveDeltaTime;
        
        // Actualizar timers
        this.powerUpTimer += effectiveDeltaTime;
        this.bossSpawnTimer -= effectiveDeltaTime;
        
        // Spawn de enemigos
        if (this.powerUpTimer >= 2000) {
            this.spawnEnemy();
            this.powerUpTimer = 0;
        }
        
        // Spawn de power-ups
        if (Math.random() < 0.01) {
            this.spawnPowerUp();
        }
        
        // Actualizar jugador
        if (this.player) {
            this.player.update(effectiveDeltaTime);
        }
        
        // Actualizar enemigos
        this.enemies.forEach(enemy => enemy.update(effectiveDeltaTime));
        
        // Actualizar jefes
        this.bosses.forEach(boss => boss.update(effectiveDeltaTime));
        
        // Actualizar balas del jugador
        this.bullets.forEach(bullet => bullet.update(effectiveDeltaTime));
        
        // Actualizar balas enemigas
        this.enemyBullets.forEach(bullet => bullet.update(effectiveDeltaTime));
        
        // Actualizar power-ups
        this.powerUps.forEach(powerUp => powerUp.update(effectiveDeltaTime));
        
        // Actualizar estrellas de fondo
        this.stars.forEach(star => star.update(effectiveDeltaTime));
        
        // Actualizar efectos especiales
        this.laserBeams.forEach(laser => laser.update(effectiveDeltaTime));
        this.earthquakeWaves.forEach(wave => wave.update(effectiveDeltaTime));
        
        // Actualizar sistemas
        if (this.particleSystem) {
            this.particleSystem.update(effectiveDeltaTime);
        }
        
        if (this.achievementSystem) {
            this.achievementSystem.update(effectiveDeltaTime);
        }
        
        // Actualizar sistema de combo
        this.updateComboSystem(effectiveDeltaTime);
        
        // Actualizar escalado de dificultad
        this.updateDifficultyScaling();
        
        // Verificar colisiones
        this.checkCollisions();
        
        // Verificar estado del juego
        this.checkGameState();
        
        // Limpiar objetos muertos
        this.cleanupDeadObjects();
        
        // Verificar desafío diario
        this.checkDailyChallenge();
        
        // Actualizar UI
        this.updateUI();
        
        // Desactivar time freeze si expiró
        if (this.timeFreezeActive && this.timeFreezeTimer <= 0) {
            this.timeFreezeActive = false;
            this.timeFreezeTimer = 0;
        }
        
        if (this.timeFreezeActive) {
            this.timeFreezeTimer -= effectiveDeltaTime;
        }
    }
    
    // Método para renderizar el juego
    render() {
        // Limpiar canvas
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Dibujar estrellas de fondo
        this.stars.forEach(star => star.draw(this.ctx));
        
        // Dibujar power-ups
        this.powerUps.forEach(powerUp => powerUp.draw(this.ctx));
        
        // Dibujar enemigos
        this.enemies.forEach(enemy => enemy.draw(this.ctx));
        
        // Dibujar jefes
        this.bosses.forEach(boss => boss.draw(this.ctx));
        
        // Dibujar balas del jugador
        this.bullets.forEach(bullet => bullet.draw(this.ctx));
        
        // Dibujar balas enemigas
        this.enemyBullets.forEach(bullet => bullet.draw(this.ctx));
        
        // Dibujar jugador
        if (this.player) {
            this.player.draw(this.ctx);
        }
        
        // Dibujar efectos especiales
        this.laserBeams.forEach(laser => laser.draw(this.ctx));
        this.earthquakeWaves.forEach(wave => wave.draw(this.ctx));
        
        // Dibujar sistemas
        if (this.particleSystem) {
            this.particleSystem.render(this.ctx);
        }
        
        if (this.achievementSystem) {
            this.achievementSystem.render(this.ctx);
        }
        
        // Dibujar UI del juego
        if (this.gameState === 'playing') {
            this.drawUI();
            this.drawComboInfo();
            this.drawDifficultyIndicator();
        }
        
        // Efecto de time freeze
        if (this.timeFreezeActive) {
            this.drawTimeFreezeEffect();
        }
    }
    
    // Método para mostrar pantalla principal
    showMainMenu() {
        this.showScreen('menuScreen');
        
        // Reproducir música de fondo
        if (this.audioManager) {
            this.audioManager.playBackgroundMusic();
        }
    }
    
    // Método para mostrar instrucciones
    showInstructions() {
        this.showScreen('instructionsScreen');
    }
    
    // Método para mostrar puntuaciones altas
    showHighScores() {
        this.showScreen('highscoresScreen');
        this.updateHighScoresDisplay();
    }
    
    // Método para actualizar display de puntuaciones altas
    updateHighScoresDisplay() {
        const highScoresList = document.getElementById('highscoresList');
        if (!highScoresList) return;
        
        highScoresList.innerHTML = '';
        
        this.highScores.forEach((score, index) => {
            const li = document.createElement('li');
            li.textContent = `${index + 1}. ${score.name}: ${score.score}`;
            highScoresList.appendChild(li);
        });
    }
    
    // Método para actualizar display de estadísticas
    updateStatsDisplay() {
        // Precisión
        const accuracy = this.shotsFired > 0 ? 
            ((this.shotsHit / this.shotsFired) * 100).toFixed(1) : '0.0';
        document.getElementById('accuracy').textContent = `${accuracy}%`;
        
        // Combo máximo
        document.getElementById('maxCombo').textContent = this.maxCombo.toString();
        
        // Daño total
        document.getElementById('damageDealt').textContent = this.totalDamageDealt.toString();
        document.getElementById('damageTaken').textContent = this.totalDamageTaken.toString();
        
        // Tiempo de supervivencia
        const totalMinutes = Math.floor(this.survivalTime / 60000);
        const totalSeconds = Math.floor((this.survivalTime % 60000) / 1000);
        document.getElementById('survivalTime').textContent = `${totalMinutes}:${totalSeconds.toString().padStart(2, '0')}`;
        
        // Total de juegos
        document.getElementById('totalGames').textContent = this.totalGames.toString();
        
        // Puntuación más alta
        document.getElementById('highestScore').textContent = this.highestScore.toString();
        
        // Enemigos destruidos
        document.getElementById('enemiesDestroyed').textContent = this.enemiesDestroyed.toString();
        
        // Power-ups recolectados
        document.getElementById('powerUpsCollected').textContent = this.powerUpsCollected.toString();
    }
    
    // Método para actualizar UI del juego
    updateUI() {
        // Actualizar elementos HTML si existen
        const scoreElement = document.getElementById('score');
        if (scoreElement) scoreElement.textContent = this.score.toString();
        
        const levelElement = document.getElementById('level');
        if (levelElement) levelElement.textContent = this.level.toString();
        
        const livesElement = document.getElementById('lives');
        if (livesElement) livesElement.textContent = this.lives.toString();
        
        const timeElement = document.getElementById('time');
        if (timeElement) {
            const minutes = Math.floor(this.survivalTime / 60000);
            const seconds = Math.floor((this.survivalTime % 60000) / 1000);
            timeElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
    }
    
    // Método para actualizar UI del game over
    updateGameOverUI() {
        const finalScoreElement = document.getElementById('finalScore');
        if (finalScoreElement) finalScoreElement.textContent = this.score.toString();
        
        const finalLevelElement = document.getElementById('finalLevel');
        if (finalLevelElement) finalLevelElement.textContent = this.level.toString();
        
        const finalTimeElement = document.getElementById('finalTime');
        if (finalTimeElement) {
            const minutes = Math.floor(this.survivalTime / 60000);
            const seconds = Math.floor((this.survivalTime % 60000) / 1000);
            finalTimeElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
        
        const finalComboElement = document.getElementById('finalCombo');
        if (finalComboElement) finalComboElement.textContent = this.maxCombo.toString();
    }
    
    updateComboSystem(deltaTime) {
        if (this.combo > 0) {
            this.comboTimer += deltaTime;
            
            // Resetear combo si pasa el tiempo límite
            if (this.comboTimer >= this.comboTimeout) {
                this.combo = 0;
                this.comboTimer = 0;
            }
        }
    }
    
    updateDifficultyScaling() {
        // Escalar dificultad basada en el tiempo de supervivencia
        const minutes = this.survivalTime / 60000;
        
        if (minutes >= 2) {
            this.difficultyMultiplier = 1.5;
            this.gameSpeed = 1.5;
            this.bossSpawnInterval = 25000;
            this.specialPowerUpChance = 0.15;
        }
        
        if (minutes >= 5) {
            this.difficultyMultiplier = 2.0;
            this.gameSpeed = 2.0;
            this.bossSpawnInterval = 20000;
            this.specialPowerUpChance = 0.2;
        }
        
        if (minutes >= 10) {
            this.difficultyMultiplier = 3.0;
            this.gameSpeed = 3.0;
            this.bossSpawnInterval = 15000;
            this.specialPowerUpChance = 0.25;
        }
    }
    
    spawnEnemy() {
        const x = Math.random() * (this.canvas.width - 40);
        const y = -40;
        
        // Crear enemigo con propiedades aleatorias
        const enemy = new Enemy(x, y);
        enemy.speed *= this.gameSpeed;
        enemy.health = Math.ceil(enemy.health * this.difficultyMultiplier);
        enemy.damage = Math.ceil(enemy.damage * this.difficultyMultiplier);
        
        this.enemies.push(enemy);
    }
    
    spawnPowerUp() {
        const x = Math.random() * (this.canvas.width - 20);
        const y = -20;
        
        // Tipos de power-ups disponibles
        const powerUpTypes = [
            'weapon', 'speed', 'life', 'shield', 'specialWeapon', 
            'dashUpgrade', 'health', 'timeFreeze'
        ];
        
        // Probabilidad de power-up especial
        let type;
        if (Math.random() < this.specialPowerUpChance) {
            type = 'specialWeapon';
        } else {
            type = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
        }
        
        let powerUp;
        if (type === 'specialWeapon') {
            powerUp = new SpecialPowerUp(x, y, type);
        } else {
            powerUp = new PowerUp(x, y, type);
        }
        
        this.powerUps.push(powerUp);
    }
    
    spawnBoss() {
        if (this.currentBoss) return;
        
        // Determinar tipo de jefe basado en el nivel
        let bossType;
        if (this.level <= 3) {
            bossType = 'destroyer';
        } else if (this.level <= 6) {
            bossType = 'teleporter';
        } else if (this.level <= 9) {
            bossType = 'wave';
        } else {
            bossType = 'grid';
        }
        
        const boss = new Boss(this.canvas.width / 2, -100, bossType);
        this.bosses.push(boss);
        this.currentBoss = boss;
        
        // Sonido de aparición del jefe
        if (this.audioManager) {
            this.audioManager.playSound('bossSpawn', 0.8);
        }
        
        // Notificación
        if (this.achievementSystem) {
            this.achievementSystem.showNotification(
                '🚨 JEFE DETECTADO!',
                boss.name,
                'warning'
            );
        }
    }
    
    shoot() {
        if (!this.player || this.player.weaponCooldown > 0) return;
        
        const bullet = new Bullet(
            this.player.x + this.player.width / 2,
            this.player.y,
            this.player.currentWeapon
        );
        
        this.bullets.push(bullet);
        this.player.weaponCooldown = this.player.weaponMaxCooldown;
        this.shotsFired++;
        
        // Sonido de disparo
        if (this.audioManager) {
            this.audioManager.playSound('shoot', 0.6);
        }
        
        // Efecto de partículas
        if (this.particleSystem) {
            this.particleSystem.addEmitter(
                this.player.x + this.player.width / 2,
                this.player.y + this.player.height,
                'engine',
                3
            );
        }
    }
    
    checkCollisions() {
        if (!this.player) return;
        
        // Colisión bala jugador - enemigo
        this.bullets.forEach((bullet, bulletIndex) => {
            this.enemies.forEach((enemy, enemyIndex) => {
                if (this.checkCollision(bullet, enemy)) {
                    // Incrementar combo
                    this.combo++;
                    this.maxCombo = Math.max(this.maxCombo, this.combo);
                    this.comboTimer = 0;
                    
                    // Puntuación con bonus de combo
                    this.score += 100 * this.combo;
                    
                    // Estadísticas
                    this.enemiesDestroyed++;
                    this.shotsHit++;
                    this.totalDamageDealt += bullet.damage;
                    
                    // Crear explosión
                    if (this.particleSystem) {
                        this.particleSystem.addEmitter(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 'explosion', 20);
                    }
                    
                    // Sonido de explosión
                    if (this.audioManager) {
                        this.audioManager.playSound('explosion', 0.8);
                    }
                    
                    // Remover objetos
                    this.bullets.splice(bulletIndex, 1);
                    this.enemies.splice(enemyIndex, 1);
                }
            });
        });
        
        // Colisión bala jugador - jefe
        this.bullets.forEach((bullet, bulletIndex) => {
            this.bosses.forEach((boss, bossIndex) => {
                if (this.checkCollision(bullet, boss)) {
                    // Incrementar combo
                    this.combo++;
                    this.maxCombo = Math.max(this.maxCombo, this.combo);
                    this.comboTimer = 0;
                    
                    // Puntuación con bonus de combo
                    this.score += 200 * this.combo;
                    
                    // Estadísticas
                    this.shotsHit++;
                    this.totalDamageDealt += bullet.damage;
                    
                    // Dañar jefe
                    boss.takeDamage(bullet.damage);
                    
                    // Partículas de explosión
                    if (this.particleSystem) {
                        this.particleSystem.addEmitter(bullet.x, bullet.y, 'explosion', 10);
                    }
                    
                    // Sonido de impacto
                    if (this.audioManager) {
                        this.audioManager.playSound('hit', 0.6);
                    }
                    
                    // Remover bala
                    this.bullets.splice(bulletIndex, 1);
                }
            });
        });
        
        // Colisión bala jugador - clon del jefe
        this.bullets.forEach((bullet, bulletIndex) => {
            this.bossClones.forEach((clone, cloneIndex) => {
                if (this.checkCollision(bullet, clone)) {
                    // Incrementar combo
                    this.combo++;
                    this.maxCombo = Math.max(this.maxCombo, this.combo);
                    this.comboTimer = 0;
                    
                    // Puntuación con bonus de combo
                    this.score += 150 * this.combo;
                    
                    // Estadísticas
                    this.shotsHit++;
                    
                    // Crear explosión
                    if (this.particleSystem) {
                        this.particleSystem.addEmitter(clone.x + clone.width / 2, clone.y + clone.height / 2, 'explosion', 15);
                    }
                    
                    // Remover objetos
                    this.bullets.splice(bulletIndex, 1);
                    this.bossClones.splice(cloneIndex, 1);
                }
            });
        });
        
        // Colisión bala enemiga - jugador
        this.enemyBullets.forEach((bullet, bulletIndex) => {
            if (this.checkCollision(bullet, this.player)) {
                this.damagePlayer(bullet.damage || 1);
                this.enemyBullets.splice(bulletIndex, 1);
                
                // Resetear combo
                this.combo = 0;
                this.comboTimer = 0;
            }
        });
        
        // Colisión bala del jefe - jugador
        this.bossBullets.forEach((bullet, bulletIndex) => {
            if (this.checkCollision(bullet, this.player)) {
                this.damagePlayer(bullet.damage || 1);
                this.bossBullets.splice(bulletIndex, 1);
                
                // Resetear combo
                this.combo = 0;
                this.comboTimer = 0;
            }
        });
        
        // Colisión power-up - jugador
        this.powerUps.forEach((powerUp, powerUpIndex) => {
            if (this.checkCollision(powerUp, this.player)) {
                this.applyPowerUp(powerUp.type);
                this.powerUps.splice(powerUpIndex, 1);
                
                // Estadísticas
                this.powerUpsCollected++;
                
                // Bonus de combo
                this.score += 50 * this.combo;
            }
        });
        
        // Colisión enemigo - jugador
        this.enemies.forEach((enemy, enemyIndex) => {
            if (this.checkCollision(enemy, this.player)) {
                this.damagePlayer(enemy.damage || 1);
                this.enemies.splice(enemyIndex, 1);
                
                // Resetear combo
                this.combo = 0;
                this.comboTimer = 0;
            }
        });
        
        // Colisión clon del jefe - jugador
        this.bossClones.forEach((clone, cloneIndex) => {
            if (this.checkCollision(clone, this.player)) {
                this.damagePlayer(clone.damage || 2);
                this.bossClones.splice(cloneIndex, 1);
                
                // Resetear combo
                this.combo = 0;
                this.comboTimer = 0;
            }
        });
        
        // Colisión efecto especial - jugador
        this.specialEffects.forEach((effect, effectIndex) => {
            if (this.checkCollision(effect, this.player)) {
                this.damagePlayer(effect.damage || 1);
                this.specialEffects.splice(effectIndex, 1);
                
                // Resetear combo
                this.combo = 0;
                this.comboTimer = 0;
            }
        });
        
        // Colisión láser del jefe - jugador
        this.laserBeams.forEach((laser, laserIndex) => {
            if (this.checkCollision(laser, this.player)) {
                this.damagePlayer(laser.damage);
                
                // Resetear combo
                this.combo = 0;
                this.comboTimer = 0;
            }
        });
        
        // Colisión onda sísmica - jugador
        this.earthquakeWaves.forEach((wave, waveIndex) => {
            const distance = Math.sqrt(
                Math.pow(this.player.x + this.player.width / 2 - wave.x, 2) +
                Math.pow(this.player.y + this.player.height / 2 - wave.y, 2)
            );
            
            if (distance <= wave.radius) {
                this.damagePlayer(wave.damage);
                
                // Resetear combo
                this.combo = 0;
                this.comboTimer = 0;
            }
        });
    }
    
    checkCollision(obj1, obj2) {
        return obj1.x < obj2.x + obj2.width &&
               obj1.x + obj1.width > obj2.x &&
               obj1.y < obj2.y + obj2.height &&
               obj1.y + obj1.height > obj2.y;
    }
    
    damagePlayer(damage) {
        if (this.player) {
            this.player.takeDamage(damage);
            this.totalDamageTaken += damage;
            
            // Verificar si el jugador murió
            if (this.player.health <= 0) {
                this.lives--;
                this.player.health = this.player.maxHealth;
                
                if (this.lives <= 0) {
                    this.gameOver();
                } else {
                    // Efecto de respawn
                    this.player.isFlashing = true;
                    this.player.flashTimer = 0;
                    
                    // Sonido de pérdida de vida
                    if (this.audioManager) {
                        this.audioManager.playSound('lifeLost', 0.8);
                    }
                }
            }
        }
    }
    
    applyPowerUp(type) {
        switch (type) {
            case 'weapon':
                this.currentWeapon = this.currentWeapon === 'basic' ? 'spread' : 'laser';
                this.powerUpDuration = 10000;
                break;
            case 'speed':
                this.player.speed *= 1.5;
                this.powerUpDuration = 8000;
                break;
            case 'life':
                this.lives = Math.min(this.lives + 1, 5);
                break;
            case 'shield':
                this.player.shield = Math.min(this.player.shield + 50, this.player.maxShield);
                break;
            case 'specialWeapon':
                const weapons = ['plasma', 'missile', 'laserBeam'];
                this.player.specialWeapon = weapons[Math.floor(Math.random() * weapons.length)];
                this.player.specialWeaponAmmo = 5;
                break;
            case 'dashUpgrade':
                this.player.dashMaxCooldown = Math.max(500, this.player.dashMaxCooldown - 200);
                this.player.dashSpeed *= 1.2;
                break;
            case 'health':
                this.player.health = Math.min(this.player.health + 1, this.player.maxHealth);
                break;
            case 'timeFreeze':
                this.activateTimeFreeze();
                break;
        }
        
        // Sonido de power-up
        if (this.audioManager) {
            this.audioManager.playSound('powerup', 0.8);
        }
        
        // Efecto de partículas
        if (this.particleSystem) {
            this.particleSystem.addEmitter(this.player.x + this.player.width / 2, 
                                         this.player.y + this.player.height / 2, 'powerup', 15);
        }
        
        // Actualizar UI
        this.updateUI();
    }
    
    activateTimeFreeze() {
        this.timeFreezeActive = true;
        this.timeFreezeTimer = 0;
        
        // Efecto visual de congelación
        if (this.particleSystem) {
            // Crear partículas de hielo en toda la pantalla
            for (let i = 0; i < 50; i++) {
                this.particleSystem.addEmitter(
                    Math.random() * this.canvas.width,
                    Math.random() * this.canvas.height,
                    'ice',
                    3
                );
            }
        }
        
        // Sonido de congelación
        if (this.audioManager) {
            this.audioManager.playSound('freeze', 0.7);
        }
        
        // Notificación
        if (this.achievementSystem) {
            this.achievementSystem.showNotification(
                '❄️ TIEMPO CONGELADO!',
                'Los enemigos se ralentizan',
                'info'
            );
        }
    }
    
    nextLevel() {
        this.level++;
        
        // Aumentar dificultad
        this.gameSpeed += 0.1;
        this.bossSpawnInterval = Math.max(10000, this.bossSpawnInterval - 2000);
        
        // Notificación de nuevo nivel
        if (this.achievementSystem) {
            this.achievementSystem.showNotification(
                '🎯 NUEVO NIVEL!',
                `Nivel ${this.level}`,
                'success'
            );
        }
        
        // Sonido de nivel
        if (this.audioManager) {
            this.audioManager.playSound('levelUp', 0.8);
        }
        
        // Efecto visual
        if (this.particleSystem) {
            this.particleSystem.addEmitter(this.canvas.width / 2, this.canvas.height / 2, 'levelUp', 50);
        }
    }
    
    createExplosion(x, y) {
        if (this.particleSystem) {
            this.particleSystem.addEmitter(x, y, 'explosion', 20);
        }
    }
    
    createLevelUpEffect() {
        if (this.particleSystem) {
            this.particleSystem.addEmitter(400, 300, 'powerup', 30);
        }
    }
    
    createStarField() {
        for (let i = 0; i < 100; i++) {
            const x = Math.random() * 800;
            const y = Math.random() * 600;
            const speed = Math.random() * 0.5 + 0.1;
            this.stars.push(new Star(x, y, speed));
        }
    }
    
    getWeaponName() {
        const names = {
            'basic': 'Básica',
            'double': 'Doble',
            'triple': 'Triple',
            'spread': 'Dispersión'
        };
        return names[this.currentWeapon] || 'Desconocida';
    }
    
    getPowerUpName() {
        const names = {
            'none': 'Ninguno',
            'weapon': 'Arma Mejorada',
            'shield': 'Escudo',
            'speed': 'Velocidad',
            'life': 'Vida Extra'
        };
        return names[this.currentPowerUp] || 'Desconocido';
    }
    
    saveHighscore() {
        const highscores = this.loadHighscores();
        const newScore = {
            score: this.score,
            level: this.level,
            date: new Date().toLocaleDateString(),
            time: this.currentGameTime
        };
        
        highscores.push(newScore);
        highscores.sort((a, b) => b.score - a.score);
        
        // Mantener solo los 10 mejores
        if (highscores.length > 10) {
            highscores.splice(10);
        }
        
        localStorage.setItem('spaceDefender_highscores', JSON.stringify(highscores));
    }
    
    loadHighscores() {
        const saved = localStorage.getItem('spaceDefender_highscores');
        return saved ? JSON.parse(saved) : [];
    }
    
    displayHighscores() {
        const highscores = this.loadHighscores();
        const container = document.getElementById('highscoresList');
        container.innerHTML = '';
        
        highscores.forEach((score, index) => {
            const scoreElement = document.createElement('div');
            scoreElement.className = 'highscore-item';
            scoreElement.innerHTML = `
                <span class="rank">#${index + 1}</span>
                <span class="score">${score.score.toLocaleString()}</span>
                <span class="level">Nivel ${score.level}</span>
                <span class="date">${score.date}</span>
            `;
            container.appendChild(scoreElement);
        });
    }
    
    updateStats() {
        // Las estadísticas se actualizan automáticamente en gameOver()
    }
    
    showStatsScreen() {
        this.showScreen('statsScreen');
        this.updateStatsDisplay();
    }
    
    resetStats() {
        if (confirm('¿Estás seguro de que quieres resetear todas las estadísticas? Esta acción no se puede deshacer.')) {
            // Resetear estadísticas
            this.shotsFired = 0;
            this.shotsHit = 0;
            this.enemiesDestroyed = 0;
            this.powerUpsCollected = 0;
            this.totalDamageDealt = 0;
            this.totalDamageTaken = 0;
            this.survivalTime = 0;
            this.totalGames = 0;
            this.highestScore = 0;
            this.maxCombo = 0;
            
            // Resetear logros
            if (this.achievementSystem) {
                this.achievementSystem.resetAchievements();
            }
            
            // Resetear puntuaciones altas
            this.highscores = [];
            
            // Limpiar localStorage
            localStorage.removeItem('spaceDefender_highscores');
            localStorage.removeItem('spaceDefender_achievements');
            localStorage.removeItem('spaceDefender_stats');
            localStorage.removeItem('spaceDefender_dailyChallenge');
            
            // Generar nuevo desafío diario
            this.generateDailyChallenge();
            
            // Actualizar UI
            this.updateStatsDisplay();
            
            alert('Estadísticas reseteadas correctamente.');
        }
    }
    
    generateDailyChallenge() {
        const challenges = [
            {
                id: 'score10k',
                name: 'Puntuación Diaria',
                description: 'Alcanza 10,000 puntos en una partida',
                target: 10000,
                type: 'score',
                reward: 500
            },
            {
                id: 'combo15',
                name: 'Combo Diario',
                description: 'Alcanza un combo de 15 en una partida',
                target: 15,
                type: 'combo',
                reward: 300
            },
            {
                id: 'survive3min',
                name: 'Sobreviviente Diario',
                description: 'Sobrevive 3 minutos en una partida',
                target: 180000, // 3 minutos en ms
                type: 'survival',
                reward: 400
            },
            {
                id: 'destroy50',
                name: 'Destructor Diario',
                description: 'Destruye 50 enemigos en una partida',
                target: 50,
                type: 'enemies',
                reward: 250
            },
            {
                id: 'accuracy85',
                name: 'Precisión Diaria',
                description: 'Alcanza 85% de precisión en una partida',
                target: 0.85,
                type: 'accuracy',
                reward: 350
            }
        ];
        
        // Generar challenge basado en la fecha
        const today = new Date().toDateString();
        const seed = today.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
        const challengeIndex = seed % challenges.length;
        
        this.dailyChallenge = challenges[challengeIndex];
        this.dailyChallengeCompleted = false;
        this.dailyChallengeReward = this.dailyChallenge.reward;
        
        // Guardar en localStorage
        localStorage.setItem('spaceDefender_dailyChallenge', JSON.stringify({
            challenge: this.dailyChallenge,
            date: today,
            completed: false
        }));
    }
    
    checkDailyChallenge() {
        if (!this.dailyChallenge || this.dailyChallengeCompleted) return;
        
        let completed = false;
        
        switch (this.dailyChallenge.type) {
            case 'score':
                completed = this.score >= this.dailyChallenge.target;
                break;
            case 'combo':
                completed = this.combo >= this.dailyChallenge.target;
                break;
            case 'survival':
                completed = this.survivalTime >= this.dailyChallenge.target;
                break;
            case 'enemies':
                completed = this.enemiesDestroyed >= this.dailyChallenge.target;
                break;
            case 'accuracy':
                const accuracy = this.shotsFired > 0 ? this.shotsHit / this.shotsFired : 0;
                completed = accuracy >= this.dailyChallenge.target;
                break;
        }
        
        if (completed) {
            this.completeDailyChallenge();
        }
    }
    
    completeDailyChallenge() {
        this.dailyChallengeCompleted = true;
        this.score += this.dailyChallengeReward;
        
        // Guardar en localStorage
        const saved = JSON.parse(localStorage.getItem('spaceDefender_dailyChallenge') || '{}');
        saved.completed = true;
        localStorage.setItem('spaceDefender_dailyChallenge', JSON.stringify(saved));
        
        // Mostrar notificación
        if (this.achievementSystem) {
            this.achievementSystem.showNotification(
                `🎯 ${this.dailyChallenge.name} Completado!`,
                `+${this.dailyChallengeReward} puntos`,
                'success'
            );
        }
        
        // Efecto visual
        if (this.particleSystem) {
            this.particleSystem.addEmitter(400, 300, 'powerup', 30);
        }
        
        // Sonido de logro
        if (this.audioManager) {
            this.audioManager.playSound('achievement', 0.8);
        }
    }
    
    drawUI() {
        // Información del juego
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '20px Arial';
        this.ctx.textAlign = 'left';
        
        // Puntuación
        this.ctx.fillText(`Puntuación: ${this.score}`, 20, 30);
        
        // Nivel
        this.ctx.fillText(`Nivel: ${this.level}`, 20, 60);
        
        // Vidas
        this.ctx.fillText(`Vidas: ${this.lives}`, 20, 90);
        
        // Tiempo de supervivencia
        const survivalMinutes = Math.floor(this.survivalTime / 60000);
        const survivalSeconds = Math.floor((this.survivalTime % 60000) / 1000);
        this.ctx.fillText(`Tiempo: ${survivalMinutes}:${survivalSeconds.toString().padStart(2, '0')}`, 20, 120);
        
        // Información del jugador
        if (this.player) {
            // Escudo
            if (this.player.shield > 0) {
                this.ctx.fillStyle = '#00ffff';
                this.ctx.fillText(`Escudo: ${Math.ceil(this.player.shield)}`, 20, 150);
            }
            
            // Arma especial
            if (this.player.specialWeapon && this.player.specialWeaponAmmo > 0) {
                this.ctx.fillStyle = '#ff00ff';
                this.ctx.fillText(`${this.player.specialWeapon.toUpperCase()}: ${this.player.specialWeaponAmmo}`, 20, 180);
            }
            
            // Arma actual
            this.ctx.fillStyle = '#ffff00';
            this.ctx.fillText(`Arma: ${this.player.currentWeapon}`, 20, 210);
        }
        
        // Desafío diario
        if (this.dailyChallenge && !this.dailyChallengeCompleted) {
            this.ctx.fillStyle = '#ffaa00';
            this.ctx.font = '16px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(`🎯 ${this.dailyChallenge.name}`, this.canvas.width / 2, 30);
            this.ctx.fillText(this.dailyChallenge.description, this.canvas.width / 2, 50);
            this.ctx.fillText(`Recompensa: +${this.dailyChallengeReward}`, this.canvas.width / 2, 70);
        }
        
        // Resetear alineación
        this.ctx.textAlign = 'left';
    }
    
    loadGameData() {
        // Cargar puntuaciones altas
        const savedHighscores = localStorage.getItem('spaceDefender_highscores');
        if (savedHighscores) {
            try {
                this.highscores = JSON.parse(savedHighscores);
            } catch (e) {
                this.highscores = [];
            }
        } else {
            this.highscores = [];
        }
        
        // Cargar logros
        const savedAchievements = localStorage.getItem('spaceDefender_achievements');
        if (savedAchievements) {
            try {
                const achievements = JSON.parse(savedAchievements);
                if (this.achievementSystem) {
                    this.achievementSystem.loadAchievements(achievements);
                }
            } catch (e) {
                console.log('Error cargando logros:', e);
            }
        }
        
        // Cargar estadísticas
        const savedStats = localStorage.getItem('spaceDefender_stats');
        if (savedStats) {
            try {
                const stats = JSON.parse(savedStats);
                this.shotsFired = stats.shotsFired || 0;
                this.shotsHit = stats.shotsHit || 0;
                this.enemiesDestroyed = stats.enemiesDestroyed || 0;
                this.powerUpsCollected = stats.powerUpsCollected || 0;
                this.totalDamageDealt = stats.totalDamageDealt || 0;
                this.totalDamageTaken = stats.totalDamageTaken || 0;
                this.survivalTime = stats.survivalTime || 0;
                this.totalGames = stats.totalGames || 0;
                this.highestScore = stats.highestScore || 0;
                this.maxCombo = stats.maxCombo || 0;
            } catch (e) {
                console.log('Error cargando estadísticas:', e);
            }
        }
        
        // Cargar desafío diario
        const savedChallenge = localStorage.getItem('spaceDefender_dailyChallenge');
        if (savedChallenge) {
            try {
                const challengeData = JSON.parse(savedChallenge);
                const today = new Date().toDateString();
                
                if (challengeData.date === today) {
                    this.dailyChallenge = challengeData.challenge;
                    this.dailyChallengeCompleted = challengeData.completed;
                    this.dailyChallengeReward = this.dailyChallenge.reward;
                } else {
                    // Generar nuevo desafío para el nuevo día
                    this.generateDailyChallenge();
                }
            } catch (e) {
                console.log('Error cargando desafío diario:', e);
                this.generateDailyChallenge();
            }
        } else {
            this.generateDailyChallenge();
        }
    }
    
    saveGameData() {
        // Guardar puntuaciones altas
        localStorage.setItem('spaceDefender_highscores', JSON.stringify(this.highscores));
        
        // Guardar logros
        if (this.achievementSystem) {
            localStorage.setItem('spaceDefender_achievements', JSON.stringify(this.achievementSystem.getAchievements()));
        }
        
        // Guardar estadísticas
        const stats = {
            shotsFired: this.shotsFired,
            shotsHit: this.shotsHit,
            enemiesDestroyed: this.enemiesDestroyed,
            powerUpsCollected: this.powerUpsCollected,
            totalDamageDealt: this.totalDamageDealt,
            totalDamageTaken: this.totalDamageTaken,
            survivalTime: this.survivalTime,
            totalGames: this.totalGames || 0,
            highestScore: this.highestScore || 0,
            maxCombo: this.maxCombo
        };
        localStorage.setItem('spaceDefender_stats', JSON.stringify(stats));
    }
    
    resizeCanvas() {
        // Ajustar tamaño del canvas si es necesario
        const container = this.canvas.parentElement;
        if (container) {
            this.canvas.width = container.clientWidth;
            this.canvas.height = container.clientHeight;
        }
    }
    
    // Método para aplicar power-up
    applyPowerUp(powerUp) {
        if (!this.player) return;
        
        switch (powerUp.type) {
            case 'weapon':
                this.player.weaponLevel = Math.min(5, this.player.weaponLevel + 1);
                break;
            case 'speed':
                this.player.speed *= 1.2;
                setTimeout(() => {
                    this.player.speed /= 1.2;
                }, 10000);
                break;
            case 'life':
                this.lives = Math.min(5, this.lives + 1);
                break;
            case 'shield':
                this.player.shield = Math.min(100, this.player.shield + 30);
                break;
            case 'specialWeapon':
                const weapons = ['plasma', 'missile', 'laserBeam'];
                this.player.specialWeapon = weapons[Math.floor(Math.random() * weapons.length)];
                this.player.specialWeaponAmmo = 5;
                break;
            case 'dashUpgrade':
                this.player.dashCooldown = Math.max(500, this.player.dashCooldown - 200);
                break;
            case 'health':
                this.player.health = Math.min(this.player.maxHealth, this.player.health + 20);
                break;
            case 'timeFreeze':
                this.activateTimeFreeze();
                break;
        }
        
        // Efecto visual
        if (this.particleSystem) {
            this.particleSystem.addEmitter(powerUp.x, powerUp.y, 'powerup', 15);
        }
        
        // Sonido
        if (this.audioManager) {
            this.audioManager.playSound('powerup', 0.8);
        }
        
        // Incrementar estadísticas
        this.powerUpsCollected++;
        
        // Notificación
        if (this.achievementSystem) {
            this.achievementSystem.showNotification(
                '⚡ POWER-UP!',
                powerUp.type,
                'info'
            );
        }
    }
    
    // Método para manejar colisión con enemigo
    handleEnemyCollision(enemy) {
        // Daño al jugador
        this.damagePlayer(enemy.damage);
        
        // Destruir enemigo
        enemy.isDead = true;
        
        // Efecto de explosión
        if (this.particleSystem) {
            this.particleSystem.addEmitter(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 'explosion', 20);
        }
        
        // Sonido
        if (this.audioManager) {
            this.audioManager.playSound('explosion', 0.7);
        }
        
        // Resetear combo
        this.combo = 0;
        this.comboTimer = 0;
    }
    
    // Método para manejar colisión con jefe
    handleBossCollision(boss) {
        // Daño al jugador
        this.damagePlayer(boss.damage);
        
        // Efecto de explosión
        if (this.particleSystem) {
            this.particleSystem.addEmitter(boss.x + boss.width / 2, boss.y + boss.height / 2, 'explosion', 30);
        }
        
        // Sonido
        if (this.audioManager) {
            this.audioManager.playSound('explosion', 0.8);
        }
        
        // Resetear combo
        this.combo = 0;
        this.comboTimer = 0;
    }
    
    // Método para manejar colisión con power-up
    handlePowerUpCollision(powerUp) {
        this.applyPowerUp(powerUp);
        powerUp.isDead = true;
    }
    
    // Método para manejar colisión con bala enemiga
    handleEnemyBulletCollision(bullet) {
        this.damagePlayer(bullet.damage);
        bullet.isDead = true;
        
        // Efecto de partículas
        if (this.particleSystem) {
            this.particleSystem.addEmitter(bullet.x, bullet.y, 'explosion', 8);
        }
        
        // Sonido
        if (this.audioManager) {
            this.audioManager.playSound('hit', 0.6);
        }
        
        // Resetear combo
        this.combo = 0;
        this.comboTimer = 0;
    }
    
    // Método para manejar colisión con bala del jugador
    handlePlayerBulletCollision(bullet, target) {
        // Aplicar daño
        if (target.takeDamage) {
            target.takeDamage(bullet.damage);
        }
        
        // Destruir bala
        bullet.isDead = true;
        
        // Incrementar combo
        this.combo++;
        this.comboTimer = 5000;
        
        // Efecto de partículas
        if (this.particleSystem) {
            this.particleSystem.addEmitter(bullet.x, bullet.y, 'explosion', 5);
        }
        
        // Sonido
        if (this.audioManager) {
            this.audioManager.playSound('hit', 0.5);
        }
        
        // Verificar si el objetivo murió
        if (target.isDead) {
            this.handleTargetDestroyed(target);
        }
    }
    
    // Método para manejar objetivo destruido
    handleTargetDestroyed(target) {
        // Puntos según tipo
        let points = 0;
        if (target instanceof Enemy) {
            points = 10 * this.level;
            this.enemiesDestroyed++;
        } else if (target instanceof Boss) {
            points = 100 * this.level;
            this.currentBoss = null;
            
            // Efecto especial de muerte del jefe
            if (this.particleSystem) {
                this.particleSystem.addEmitter(target.x + target.width / 2, target.y + target.height / 2, 'bossDeath', 50);
            }
            
            // Sonido especial
            if (this.audioManager) {
                this.audioManager.playSound('bossDeath', 1.0);
            }
        }
        
        // Aplicar puntos
        this.score += points;
        
        // Bonus de combo
        if (this.combo > 1) {
            const comboBonus = Math.floor(this.combo * 0.5) * points;
            this.score += comboBonus;
        }
        
        // Verificar logros
        if (this.achievementSystem) {
            this.achievementSystem.checkAchievements(this);
        }
        
        // Verificar cambio de nivel
        if (this.score >= this.level * 1000) {
            this.nextLevel();
        }
    }
    
    // Método para dibujar información del combo
    drawComboInfo() {
        if (this.combo > 1) {
            const ctx = this.ctx;
            ctx.save();
            
            // Fondo
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(10, 80, 120, 40);
            
            // Borde
            ctx.strokeStyle = '#ffff00';
            ctx.lineWidth = 2;
            ctx.strokeRect(10, 80, 120, 40);
            
            // Texto del combo
            ctx.fillStyle = '#ffff00';
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(`COMBO x${this.combo}`, 70, 100);
            
            // Barra de progreso del combo
            const progress = this.comboTimer / 5000;
            ctx.fillStyle = '#00ff00';
            ctx.fillRect(15, 110, 110 * progress, 5);
            
            ctx.restore();
        }
    }
    
    // Método para dibujar indicador de dificultad
    drawDifficultyIndicator() {
        if (this.difficultyMultiplier > 1) {
            this.ctx.save();
            this.ctx.fillStyle = '#ff0000';
            this.ctx.font = 'bold 16px Arial';
            this.ctx.textAlign = 'right';
            this.ctx.shadowColor = '#000000';
            this.ctx.shadowBlur = 3;
            
            this.ctx.fillText(
                `DIFICULTAD x${this.difficultyMultiplier.toFixed(1)}`,
                this.canvas.width - 20,
                30
            );
            
            this.ctx.restore();
        }
    }
    
    spawnEnemy() {
        const x = Math.random() * (this.canvas.width - 40);
        const y = -40;
        
        // Crear enemigo con propiedades aleatorias
        const enemy = new Enemy(x, y);
        enemy.speed *= this.gameSpeed;
        enemy.health = Math.ceil(enemy.health * this.difficultyMultiplier);
        enemy.damage = Math.ceil(enemy.damage * this.difficultyMultiplier);
        
        this.enemies.push(enemy);
    }
    
    spawnPowerUp() {
        const x = Math.random() * (this.canvas.width - 20);
        const y = -20;
        
        // Tipos de power-ups disponibles
        const powerUpTypes = [
            'weapon', 'speed', 'life', 'shield', 'specialWeapon', 
            'dashUpgrade', 'health', 'timeFreeze'
        ];
        
        // Probabilidad de power-up especial
        let type;
        if (Math.random() < this.specialPowerUpChance) {
            type = 'specialWeapon';
        } else {
            type = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
        }
        
        let powerUp;
        if (type === 'specialWeapon') {
            powerUp = new SpecialPowerUp(x, y, type);
        } else {
            powerUp = new PowerUp(x, y, type);
        }
        
        this.powerUps.push(powerUp);
    }
    
    spawnBoss() {
        if (this.currentBoss) return;
        
        // Determinar tipo de jefe basado en el nivel
        let bossType;
        if (this.level <= 3) {
            bossType = 'destroyer';
        } else if (this.level <= 6) {
            bossType = 'teleporter';
        } else if (this.level <= 9) {
            bossType = 'wave';
        } else {
            bossType = 'grid';
        }
        
        const boss = new Boss(this.canvas.width / 2, -100, bossType);
        this.bosses.push(boss);
        this.currentBoss = boss;
        
        // Sonido de aparición del jefe
        if (this.audioManager) {
            this.audioManager.playSound('bossSpawn', 0.8);
        }
        
        // Notificación
        if (this.achievementSystem) {
            this.achievementSystem.showNotification(
                '🚨 JEFE DETECTADO!',
                boss.name,
                'warning'
            );
        }
    }
    
    shoot() {
        if (!this.player || this.player.weaponCooldown > 0) return;
        
        const bullet = new Bullet(
            this.player.x + this.player.width / 2,
            this.player.y,
            this.player.currentWeapon
        );
        
        this.bullets.push(bullet);
        this.player.weaponCooldown = this.player.weaponMaxCooldown;
        this.shotsFired++;
        
        // Sonido de disparo
        if (this.audioManager) {
            this.audioManager.playSound('shoot', 0.6);
        }
        
        // Efecto de partículas
        if (this.particleSystem) {
            this.particleSystem.addEmitter(
                this.player.x + this.player.width / 2,
                this.player.y + this.player.height,
                'engine',
                3
            );
        }
    }
    
    checkCollisions() {
        if (!this.player) return;
        
        // Colisión bala jugador - enemigo
        this.bullets.forEach((bullet, bulletIndex) => {
            this.enemies.forEach((enemy, enemyIndex) => {
                if (this.checkCollision(bullet, enemy)) {
                    // Incrementar combo
                    this.combo++;
                    this.maxCombo = Math.max(this.maxCombo, this.combo);
                    this.comboTimer = 0;
                    
                    // Puntuación con bonus de combo
                    this.score += 100 * this.combo;
                    
                    // Estadísticas
                    this.enemiesDestroyed++;
                    this.shotsHit++;
                    this.totalDamageDealt += bullet.damage;
                    
                    // Crear explosión
                    if (this.particleSystem) {
                        this.particleSystem.addEmitter(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 'explosion', 20);
                    }
                    
                    // Sonido de explosión
                    if (this.audioManager) {
                        this.audioManager.playSound('explosion', 0.8);
                    }
                    
                    // Remover objetos
                    this.bullets.splice(bulletIndex, 1);
                    this.enemies.splice(enemyIndex, 1);
                }
            });
        });
        
        // Colisión bala jugador - jefe
        this.bullets.forEach((bullet, bulletIndex) => {
            this.bosses.forEach((boss, bossIndex) => {
                if (this.checkCollision(bullet, boss)) {
                    // Incrementar combo
                    this.combo++;
                    this.maxCombo = Math.max(this.maxCombo, this.combo);
                    this.comboTimer = 0;
                    
                    // Puntuación con bonus de combo
                    this.score += 200 * this.combo;
                    
                    // Estadísticas
                    this.shotsHit++;
                    this.totalDamageDealt += bullet.damage;
                    
                    // Dañar jefe
                    boss.takeDamage(bullet.damage);
                    
                    // Partículas de explosión
                    if (this.particleSystem) {
                        this.particleSystem.addEmitter(bullet.x, bullet.y, 'explosion', 10);
                    }
                    
                    // Sonido de impacto
                    if (this.audioManager) {
                        this.audioManager.playSound('hit', 0.6);
                    }
                    
                    // Remover bala
                    this.bullets.splice(bulletIndex, 1);
                }
            });
        });
        
        // Colisión bala jugador - clon del jefe
        this.bullets.forEach((bullet, bulletIndex) => {
            this.bossClones.forEach((clone, cloneIndex) => {
                if (this.checkCollision(bullet, clone)) {
                    // Incrementar combo
                    this.combo++;
                    this.maxCombo = Math.max(this.maxCombo, this.combo);
                    this.comboTimer = 0;
                    
                    // Puntuación con bonus de combo
                    this.score += 150 * this.combo;
                    
                    // Estadísticas
                    this.shotsHit++;
                    
                    // Crear explosión
                    if (this.particleSystem) {
                        this.particleSystem.addEmitter(clone.x + clone.width / 2, clone.y + clone.height / 2, 'explosion', 15);
                    }
                    
                    // Remover objetos
                    this.bullets.splice(bulletIndex, 1);
                    this.bossClones.splice(cloneIndex, 1);
                }
            });
        });
        
        // Colisión bala enemiga - jugador
        this.enemyBullets.forEach((bullet, bulletIndex) => {
            if (this.checkCollision(bullet, this.player)) {
                this.damagePlayer(bullet.damage || 1);
                this.enemyBullets.splice(bulletIndex, 1);
                
                // Resetear combo
                this.combo = 0;
                this.comboTimer = 0;
            }
        });
        
        // Colisión bala del jefe - jugador
        this.bossBullets.forEach((bullet, bulletIndex) => {
            if (this.checkCollision(bullet, this.player)) {
                this.damagePlayer(bullet.damage || 1);
                this.bossBullets.splice(bulletIndex, 1);
                
                // Resetear combo
                this.combo = 0;
                this.comboTimer = 0;
            }
        });
        
        // Colisión power-up - jugador
        this.powerUps.forEach((powerUp, powerUpIndex) => {
            if (this.checkCollision(powerUp, this.player)) {
                this.applyPowerUp(powerUp.type);
                this.powerUps.splice(powerUpIndex, 1);
                
                // Estadísticas
                this.powerUpsCollected++;
                
                // Bonus de combo
                this.score += 50 * this.combo;
            }
        });
        
        // Colisión enemigo - jugador
        this.enemies.forEach((enemy, enemyIndex) => {
            if (this.checkCollision(enemy, this.player)) {
                this.damagePlayer(enemy.damage || 1);
                this.enemies.splice(enemyIndex, 1);
                
                // Resetear combo
                this.combo = 0;
                this.comboTimer = 0;
            }
        });
        
        // Colisión clon del jefe - jugador
        this.bossClones.forEach((clone, cloneIndex) => {
            if (this.checkCollision(clone, this.player)) {
                this.damagePlayer(clone.damage || 2);
                this.bossClones.splice(cloneIndex, 1);
                
                // Resetear combo
                this.combo = 0;
                this.comboTimer = 0;
            }
        });
        
        // Colisión efecto especial - jugador
        this.specialEffects.forEach((effect, effectIndex) => {
            if (this.checkCollision(effect, this.player)) {
                this.damagePlayer(effect.damage || 1);
                this.specialEffects.splice(effectIndex, 1);
                
                // Resetear combo
                this.combo = 0;
                this.comboTimer = 0;
            }
        });
        
        // Colisión láser del jefe - jugador
        this.laserBeams.forEach((laser, laserIndex) => {
            if (this.checkCollision(laser, this.player)) {
                this.damagePlayer(laser.damage);
                
                // Resetear combo
                this.combo = 0;
                this.comboTimer = 0;
            }
        });
        
        // Colisión onda sísmica - jugador
        this.earthquakeWaves.forEach((wave, waveIndex) => {
            const distance = Math.sqrt(
                Math.pow(this.player.x + this.player.width / 2 - wave.x, 2) +
                Math.pow(this.player.y + this.player.height / 2 - wave.y, 2)
            );
            
            if (distance <= wave.radius) {
                this.damagePlayer(wave.damage);
                
                // Resetear combo
                this.combo = 0;
                this.comboTimer = 0;
            }
        });
    }
    
    checkCollision(obj1, obj2) {
        return obj1.x < obj2.x + obj2.width &&
               obj1.x + obj1.width > obj2.x &&
               obj1.y < obj2.y + obj2.height &&
               obj1.y + obj1.height > obj2.y;
    }
    
    damagePlayer(damage) {
        if (this.player) {
            this.player.takeDamage(damage);
            this.totalDamageTaken += damage;
            
            // Verificar si el jugador murió
            if (this.player.health <= 0) {
                this.lives--;
                this.player.health = this.player.maxHealth;
                
                if (this.lives <= 0) {
                    this.gameOver();
                } else {
                    // Efecto de respawn
                    this.player.isFlashing = true;
                    this.player.flashTimer = 0;
                    
                    // Sonido de pérdida de vida
                    if (this.audioManager) {
                        this.audioManager.playSound('lifeLost', 0.8);
                    }
                }
            }
        }
    }
    
    applyPowerUp(type) {
        switch (type) {
            case 'weapon':
                this.currentWeapon = this.currentWeapon === 'basic' ? 'spread' : 'laser';
                this.powerUpDuration = 10000;
                break;
            case 'speed':
                this.player.speed *= 1.5;
                this.powerUpDuration = 8000;
                break;
            case 'life':
                this.lives = Math.min(this.lives + 1, 5);
                break;
            case 'shield':
                this.player.shield = Math.min(this.player.shield + 50, this.player.maxShield);
                break;
            case 'specialWeapon':
                const weapons = ['plasma', 'missile', 'laserBeam'];
                this.player.specialWeapon = weapons[Math.floor(Math.random() * weapons.length)];
                this.player.specialWeaponAmmo = 5;
                break;
            case 'dashUpgrade':
                this.player.dashMaxCooldown = Math.max(500, this.player.dashMaxCooldown - 200);
                this.player.dashSpeed *= 1.2;
                break;
            case 'health':
                this.player.health = Math.min(this.player.health + 1, this.player.maxHealth);
                break;
            case 'timeFreeze':
                this.activateTimeFreeze();
                break;
        }
        
        // Sonido de power-up
        if (this.audioManager) {
            this.audioManager.playSound('powerup', 0.8);
        }
        
        // Efecto de partículas
        if (this.particleSystem) {
            this.particleSystem.addEmitter(this.player.x + this.player.width / 2, 
                                         this.player.y + this.player.height / 2, 'powerup', 15);
        }
        
        // Actualizar UI
        this.updateUI();
    }
    
    activateTimeFreeze() {
        this.timeFreezeActive = true;
        this.timeFreezeTimer = 0;
        
        // Efecto visual de congelación
        if (this.particleSystem) {
            // Crear partículas de hielo en toda la pantalla
            for (let i = 0; i < 50; i++) {
                this.particleSystem.addEmitter(
                    Math.random() * this.canvas.width,
                    Math.random() * this.canvas.height,
                    'ice',
                    3
                );
            }
        }
        
        // Sonido de congelación
        if (this.audioManager) {
            this.audioManager.playSound('freeze', 0.7);
        }
        
        // Notificación
        if (this.achievementSystem) {
            this.achievementSystem.showNotification(
                '❄️ TIEMPO CONGELADO!',
                'Los enemigos se ralentizan',
                'info'
            );
        }
    }
    
    nextLevel() {
        this.level++;
        
        // Aumentar dificultad
        this.gameSpeed += 0.1;
        this.bossSpawnInterval = Math.max(10000, this.bossSpawnInterval - 2000);
        
        // Notificación de nuevo nivel
        if (this.achievementSystem) {
            this.achievementSystem.showNotification(
                '🎯 NUEVO NIVEL!',
                `Nivel ${this.level}`,
                'success'
            );
        }
        
        // Sonido de nivel
        if (this.audioManager) {
            this.audioManager.playSound('levelUp', 0.8);
        }
        
        // Efecto visual
        if (this.particleSystem) {
            this.particleSystem.addEmitter(this.canvas.width / 2, this.canvas.height / 2, 'levelUp', 50);
        }
    }
    
    createExplosion(x, y) {
        if (this.particleSystem) {
            this.particleSystem.addEmitter(x, y, 'explosion', 20);
        }
    }
    
    createLevelUpEffect() {
        if (this.particleSystem) {
            this.particleSystem.addEmitter(400, 300, 'powerup', 30);
        }
    }
    
    createStarField() {
        for (let i = 0; i < 100; i++) {
            const x = Math.random() * 800;
            const y = Math.random() * 600;
            const speed = Math.random() * 0.5 + 0.1;
            this.stars.push(new Star(x, y, speed));
        }
    }
    
    updateUI() {
        // Actualizar elementos de la UI del juego
        const scoreElement = document.getElementById('score');
        const levelElement = document.getElementById('level');
        const livesElement = document.getElementById('lives');
        
        if (scoreElement) scoreElement.textContent = this.score;
        if (levelElement) levelElement.textContent = this.level;
        if (livesElement) livesElement.textContent = this.lives;
        
        // Actualizar información del jugador si existe
        if (this.player) {
            const healthElement = document.getElementById('playerHealth');
            const shieldElement = document.getElementById('playerShield');
            const weaponElement = document.getElementById('playerWeapon');
            
            if (healthElement) healthElement.textContent = this.player.health;
            if (shieldElement) shieldElement.textContent = Math.ceil(this.player.shield);
            if (weaponElement) weaponElement.textContent = this.player.currentWeapon;
        }
    }
    
    getWeaponName() {
        const names = {
            'basic': 'Básica',
            'double': 'Doble',
            'triple': 'Triple',
            'spread': 'Dispersión'
        };
        return names[this.currentWeapon] || 'Desconocida';
    }
    
    getPowerUpName() {
        const names = {
            'none': 'Ninguno',
            'weapon': 'Arma Mejorada',
            'shield': 'Escudo',
            'speed': 'Velocidad',
            'life': 'Vida Extra'
        };
        return names[this.currentPowerUp] || 'Desconocido';
    }
    
    saveHighscore() {
        const highscores = this.loadHighscores();
        const newScore = {
            score: this.score,
            level: this.level,
            date: new Date().toLocaleDateString(),
            time: this.currentGameTime
        };
        
        highscores.push(newScore);
        highscores.sort((a, b) => b.score - a.score);
        
        // Mantener solo los 10 mejores
        if (highscores.length > 10) {
            highscores.splice(10);
        }
        
        localStorage.setItem('spaceDefender_highscores', JSON.stringify(highscores));
    }
    
    loadHighscores() {
        const saved = localStorage.getItem('spaceDefender_highscores');
        return saved ? JSON.parse(saved) : [];
    }
    
    displayHighscores() {
        const highscores = this.loadHighscores();
        const container = document.getElementById('highscoresList');
        container.innerHTML = '';
        
        highscores.forEach((score, index) => {
            const scoreElement = document.createElement('div');
            scoreElement.className = 'highscore-item';
            scoreElement.innerHTML = `
                <span class="rank">#${index + 1}</span>
                <span class="score">${score.score.toLocaleString()}</span>
                <span class="level">Nivel ${score.level}</span>
                <span class="date">${score.date}</span>
            `;
            container.appendChild(scoreElement);
        });
    }
    
    updateStats() {
        // Las estadísticas se actualizan automáticamente en gameOver()
    }
    
    showStatsScreen() {
        this.showScreen('statsScreen');
        this.updateStatsDisplay();
    }
    
    updateStatsDisplay() {
        // Actualizar estadísticas de precisión
        const accuracyElement = document.getElementById('accuracyValue');
        if (accuracyElement) {
            const accuracy = this.shotsFired > 0 ? (this.shotsHit / this.shotsFired * 100).toFixed(1) : '0.0';
            accuracyElement.textContent = `${accuracy}%`;
        }
        
        // Actualizar estadísticas de combo
        const maxComboElement = document.getElementById('maxComboValue');
        if (maxComboElement) {
            maxComboElement.textContent = this.maxCombo;
        }
        
        // Actualizar estadísticas de daño
        const damageDealtElement = document.getElementById('damageDealtValue');
        const damageTakenElement = document.getElementById('damageTakenValue');
        if (damageDealtElement) damageDealtElement.textContent = this.totalDamageDealt;
        if (damageTakenElement) damageTakenElement.textContent = this.totalDamageTaken;
        
        // Actualizar estadísticas de supervivencia
        const survivalTimeElement = document.getElementById('survivalTimeValue');
        if (survivalTimeElement) {
            const minutes = Math.floor(this.survivalTime / 60000);
            const seconds = Math.floor((this.survivalTime % 60000) / 1000);
            survivalTimeElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
        
        // Actualizar resumen
        const totalGamesElement = document.getElementById('totalGamesValue');
        const highestScoreElement = document.getElementById('highestScoreValue');
        const enemiesDestroyedElement = document.getElementById('enemiesDestroyedValue');
        const powerUpsCollectedElement = document.getElementById('powerUpsCollectedValue');
        
        if (totalGamesElement) totalGamesElement.textContent = this.totalGames || 0;
        if (highestScoreElement) highestScoreElement.textContent = this.highestScore || 0;
        if (enemiesDestroyedElement) enemiesDestroyedElement.textContent = this.enemiesDestroyed;
        if (powerUpsCollectedElement) powerUpsCollectedElement.textContent = this.powerUpsCollected;
    }
    
    resetStats() {
        if (confirm('¿Estás seguro de que quieres resetear todas las estadísticas? Esta acción no se puede deshacer.')) {
            // Resetear estadísticas
            this.shotsFired = 0;
            this.shotsHit = 0;
            this.enemiesDestroyed = 0;
            this.powerUpsCollected = 0;
            this.totalDamageDealt = 0;
            this.totalDamageTaken = 0;
            this.survivalTime = 0;
            this.totalGames = 0;
            this.highestScore = 0;
            this.maxCombo = 0;
            
            // Resetear logros
            if (this.achievementSystem) {
                this.achievementSystem.resetAchievements();
            }
            
            // Resetear puntuaciones altas
            this.highscores = [];
            
            // Limpiar localStorage
            localStorage.removeItem('spaceDefender_highscores');
            localStorage.removeItem('spaceDefender_achievements');
            localStorage.removeItem('spaceDefender_stats');
            localStorage.removeItem('spaceDefender_dailyChallenge');
            
            // Generar nuevo desafío diario
            this.generateDailyChallenge();
            
            // Actualizar UI
            this.updateStatsDisplay();
            
            alert('Estadísticas reseteadas correctamente.');
        }
    }
    
    generateDailyChallenge() {
        const challenges = [
            {
                id: 'score10k',
                name: 'Puntuación Diaria',
                description: 'Alcanza 10,000 puntos en una partida',
                target: 10000,
                type: 'score',
                reward: 500
            },
            {
                id: 'combo15',
                name: 'Combo Diario',
                description: 'Alcanza un combo de 15 en una partida',
                target: 15,
                type: 'combo',
                reward: 300
            },
            {
                id: 'survive3min',
                name: 'Sobreviviente Diario',
                description: 'Sobrevive 3 minutos en una partida',
                target: 180000, // 3 minutos en ms
                type: 'survival',
                reward: 400
            },
            {
                id: 'destroy50',
                name: 'Destructor Diario',
                description: 'Destruye 50 enemigos en una partida',
                target: 50,
                type: 'enemies',
                reward: 250
            },
            {
                id: 'accuracy85',
                name: 'Precisión Diaria',
                description: 'Alcanza 85% de precisión en una partida',
                target: 0.85,
                type: 'accuracy',
                reward: 350
            }
        ];
        
        // Generar challenge basado en la fecha
        const today = new Date().toDateString();
        const seed = today.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
        const challengeIndex = seed % challenges.length;
        
        this.dailyChallenge = challenges[challengeIndex];
        this.dailyChallengeCompleted = false;
        this.dailyChallengeReward = this.dailyChallenge.reward;
        
        // Guardar en localStorage
        localStorage.setItem('spaceDefender_dailyChallenge', JSON.stringify({
            challenge: this.dailyChallenge,
            date: today,
            completed: false
        }));
    }
    
    checkDailyChallenge() {
        if (!this.dailyChallenge || this.dailyChallengeCompleted) return;
        
        let completed = false;
        
        switch (this.dailyChallenge.type) {
            case 'score':
                completed = this.score >= this.dailyChallenge.target;
                break;
            case 'combo':
                completed = this.combo >= this.dailyChallenge.target;
                break;
            case 'survival':
                completed = this.survivalTime >= this.dailyChallenge.target;
                break;
            case 'enemies':
                completed = this.enemiesDestroyed >= this.dailyChallenge.target;
                break;
            case 'accuracy':
                const accuracy = this.shotsFired > 0 ? this.shotsHit / this.shotsFired : 0;
                completed = accuracy >= this.dailyChallenge.target;
                break;
        }
        
        if (completed) {
            this.completeDailyChallenge();
        }
    }
    
    completeDailyChallenge() {
        this.dailyChallengeCompleted = true;
        this.score += this.dailyChallengeReward;
        
        // Guardar en localStorage
        const saved = JSON.parse(localStorage.getItem('spaceDefender_dailyChallenge') || '{}');
        saved.completed = true;
        localStorage.setItem('spaceDefender_dailyChallenge', JSON.stringify(saved));
        
        // Mostrar notificación
        if (this.achievementSystem) {
            this.achievementSystem.showNotification(
                `🎯 ${this.dailyChallenge.name} Completado!`,
                `+${this.dailyChallengeReward} puntos`,
                'success'
            );
        }
        
        // Efecto visual
        if (this.particleSystem) {
            this.particleSystem.addEmitter(400, 300, 'powerup', 30);
        }
        
        // Sonido de logro
        if (this.audioManager) {
            this.audioManager.playSound('achievement', 0.8);
        }
    }
    
    drawUI() {
        // Información del juego
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '20px Arial';
        this.ctx.textAlign = 'left';
        
        // Puntuación
        this.ctx.fillText(`Puntuación: ${this.score}`, 20, 30);
        
        // Nivel
        this.ctx.fillText(`Nivel: ${this.level}`, 20, 60);
        
        // Vidas
        this.ctx.fillText(`Vidas: ${this.lives}`, 20, 90);
        
        // Tiempo de supervivencia
        const survivalMinutes = Math.floor(this.survivalTime / 60000);
        const survivalSeconds = Math.floor((this.survivalTime % 60000) / 1000);
        this.ctx.fillText(`Tiempo: ${survivalMinutes}:${survivalSeconds.toString().padStart(2, '0')}`, 20, 120);
        
        // Información del jugador
        if (this.player) {
            // Escudo
            if (this.player.shield > 0) {
                this.ctx.fillStyle = '#00ffff';
                this.ctx.fillText(`Escudo: ${Math.ceil(this.player.shield)}`, 20, 150);
            }
            
            // Arma especial
            if (this.player.specialWeapon && this.player.specialWeaponAmmo > 0) {
                this.ctx.fillStyle = '#ff00ff';
                this.ctx.fillText(`${this.player.specialWeapon.toUpperCase()}: ${this.player.specialWeaponAmmo}`, 20, 180);
            }
            
            // Arma actual
            this.ctx.fillStyle = '#ffff00';
            this.ctx.fillText(`Arma: ${this.player.currentWeapon}`, 20, 210);
        }
        
        // Desafío diario
        if (this.dailyChallenge && !this.dailyChallengeCompleted) {
            this.ctx.fillStyle = '#ffaa00';
            this.ctx.font = '16px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(`🎯 ${this.dailyChallenge.name}`, this.canvas.width / 2, 30);
            this.ctx.fillText(this.dailyChallenge.description, this.canvas.width / 2, 50);
            this.ctx.fillText(`Recompensa: +${this.dailyChallengeReward}`, this.canvas.width / 2, 70);
        }
        
        // Resetear alineación
        this.ctx.textAlign = 'left';
    }
    
    loadGameData() {
        // Cargar puntuaciones altas
        const savedHighscores = localStorage.getItem('spaceDefender_highscores');
        if (savedHighscores) {
            try {
                this.highscores = JSON.parse(savedHighscores);
            } catch (e) {
                this.highscores = [];
            }
        } else {
            this.highscores = [];
        }
        
        // Cargar logros
        const savedAchievements = localStorage.getItem('spaceDefender_achievements');
        if (savedAchievements) {
            try {
                const achievements = JSON.parse(savedAchievements);
                if (this.achievementSystem) {
                    this.achievementSystem.loadAchievements(achievements);
                }
            } catch (e) {
                console.log('Error cargando logros:', e);
            }
        }
        
        // Cargar estadísticas
        const savedStats = localStorage.getItem('spaceDefender_stats');
        if (savedStats) {
            try {
                const stats = JSON.parse(savedStats);
                this.shotsFired = stats.shotsFired || 0;
                this.shotsHit = stats.shotsHit || 0;
                this.enemiesDestroyed = stats.enemiesDestroyed || 0;
                this.powerUpsCollected = stats.powerUpsCollected || 0;
                this.totalDamageDealt = stats.totalDamageDealt || 0;
                this.totalDamageTaken = stats.totalDamageTaken || 0;
                this.survivalTime = stats.survivalTime || 0;
                this.totalGames = stats.totalGames || 0;
                this.highestScore = stats.highestScore || 0;
                this.maxCombo = stats.maxCombo || 0;
            } catch (e) {
                console.log('Error cargando estadísticas:', e);
            }
        }
        
        // Cargar desafío diario
        const savedChallenge = localStorage.getItem('spaceDefender_dailyChallenge');
        if (savedChallenge) {
            try {
                const challengeData = JSON.parse(savedChallenge);
                const today = new Date().toDateString();
                
                if (challengeData.date === today) {
                    this.dailyChallenge = challengeData.challenge;
                    this.dailyChallengeCompleted = challengeData.completed;
                    this.dailyChallengeReward = this.dailyChallenge.reward;
                } else {
                    // Generar nuevo desafío para el nuevo día
                    this.generateDailyChallenge();
                }
            } catch (e) {
                console.log('Error cargando desafío diario:', e);
                this.generateDailyChallenge();
            }
        } else {
            this.generateDailyChallenge();
        }
    }
    
    saveGameData() {
        // Guardar puntuaciones altas
        localStorage.setItem('spaceDefender_highscores', JSON.stringify(this.highscores));
        
        // Guardar logros
        if (this.achievementSystem) {
            localStorage.setItem('spaceDefender_achievements', JSON.stringify(this.achievementSystem.getAchievements()));
        }
        
        // Guardar estadísticas
        const stats = {
            shotsFired: this.shotsFired,
            shotsHit: this.shotsHit,
            enemiesDestroyed: this.enemiesDestroyed,
            powerUpsCollected: this.powerUpsCollected,
            totalDamageDealt: this.totalDamageDealt,
            totalDamageTaken: this.totalDamageTaken,
            survivalTime: this.survivalTime,
            totalGames: this.totalGames || 0,
            highestScore: this.highestScore || 0,
            maxCombo: this.maxCombo
        };
        localStorage.setItem('spaceDefender_stats', JSON.stringify(stats));
    }
    
    resizeCanvas() {
        // Ajustar tamaño del canvas si es necesario
        const container = this.canvas.parentElement;
        if (container) {
            this.canvas.width = container.clientWidth;
            this.canvas.height = container.clientHeight;
        }
    }
    
    // Método para aplicar power-up
    applyPowerUp(powerUp) {
        if (!this.player) return;
        
        switch (powerUp.type) {
            case 'weapon':
                this.player.weaponLevel = Math.min(5, this.player.weaponLevel + 1);
                break;
            case 'speed':
                this.player.speed *= 1.2;
                setTimeout(() => {
                    this.player.speed /= 1.2;
                }, 10000);
                break;
            case 'life':
                this.lives = Math.min(5, this.lives + 1);
                break;
            case 'shield':
                this.player.shield = Math.min(100, this.player.shield + 30);
                break;
            case 'specialWeapon':
                const weapons = ['plasma', 'missile', 'laserBeam'];
                this.player.specialWeapon = weapons[Math.floor(Math.random() * weapons.length)];
                this.player.specialWeaponAmmo = 5;
                break;
            case 'dashUpgrade':
                this.player.dashCooldown = Math.max(500, this.player.dashCooldown - 200);
                break;
            case 'health':
                this.player.health = Math.min(this.player.maxHealth, this.player.health + 20);
                break;
            case 'timeFreeze':
                this.activateTimeFreeze();
                break;
        }
        
        // Efecto visual
        if (this.particleSystem) {
            this.particleSystem.addEmitter(powerUp.x, powerUp.y, 'powerup', 15);
        }
        
        // Sonido
        if (this.audioManager) {
            this.audioManager.playSound('powerup', 0.8);
        }
        
        // Incrementar estadísticas
        this.powerUpsCollected++;
        
        // Notificación
        if (this.achievementSystem) {
            this.achievementSystem.showNotification(
                '⚡ POWER-UP!',
                powerUp.type,
                'info'
            );
        }
    }
    
    // Método para manejar colisión con enemigo
    handleEnemyCollision(enemy) {
        // Daño al jugador
        this.damagePlayer(enemy.damage);
        
        // Destruir enemigo
        enemy.isDead = true;
        
        // Efecto de explosión
        if (this.particleSystem) {
            this.particleSystem.addEmitter(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 'explosion', 20);
        }
        
        // Sonido
        if (this.audioManager) {
            this.audioManager.playSound('explosion', 0.7);
        }
        
        // Resetear combo
        this.combo = 0;
        this.comboTimer = 0;
    }
    
    // Método para manejar colisión con jefe
    handleBossCollision(boss) {
        // Daño al jugador
        this.damagePlayer(boss.damage);
        
        // Efecto de explosión
        if (this.particleSystem) {
            this.particleSystem.addEmitter(boss.x + boss.width / 2, boss.y + boss.height / 2, 'explosion', 30);
        }
        
        // Sonido
        if (this.audioManager) {
            this.audioManager.playSound('explosion', 0.8);
        }
        
        // Resetear combo
        this.combo = 0;
        this.comboTimer = 0;
    }
    
    // Método para manejar colisión con power-up
    handlePowerUpCollision(powerUp) {
        this.applyPowerUp(powerUp);
        powerUp.isDead = true;
    }
    
    // Método para manejar colisión con bala enemiga
    handleEnemyBulletCollision(bullet) {
        this.damagePlayer(bullet.damage);
        bullet.isDead = true;
        
        // Efecto de partículas
        if (this.particleSystem) {
            this.particleSystem.addEmitter(bullet.x, bullet.y, 'explosion', 8);
        }
        
        // Sonido
        if (this.audioManager) {
            this.audioManager.playSound('hit', 0.6);
        }
        
        // Resetear combo
        this.combo = 0;
        this.comboTimer = 0;
    }
    
    // Método para manejar colisión con bala del jugador
    handlePlayerBulletCollision(bullet, target) {
        // Aplicar daño
        if (target.takeDamage) {
            target.takeDamage(bullet.damage);
        }
        
        // Destruir bala
        bullet.isDead = true;
        
        // Incrementar combo
        this.combo++;
        this.comboTimer = 5000;
        
        // Efecto de partículas
        if (this.particleSystem) {
            this.particleSystem.addEmitter(bullet.x, bullet.y, 'explosion', 5);
        }
        
        // Sonido
        if (this.audioManager) {
            this.audioManager.playSound('hit', 0.5);
        }
        
        // Verificar si el objetivo murió
        if (target.isDead) {
            this.handleTargetDestroyed(target);
        }
    }
    
    // Método para manejar objetivo destruido
    handleTargetDestroyed(target) {
        // Puntos según tipo
        let points = 0;
        if (target instanceof Enemy) {
            points = 10 * this.level;
            this.enemiesDestroyed++;
        } else if (target instanceof Boss) {
            points = 100 * this.level;
            this.currentBoss = null;
            
            // Efecto especial de muerte del jefe
            if (this.particleSystem) {
                this.particleSystem.addEmitter(target.x + target.width / 2, target.y + target.height / 2, 'bossDeath', 50);
            }
            
            // Sonido especial
            if (this.audioManager) {
                this.audioManager.playSound('bossDeath', 1.0);
            }
        }
        
        // Aplicar puntos
        this.score += points;
        
        // Bonus de combo
        if (this.combo > 1) {
            const comboBonus = Math.floor(this.combo * 0.5) * points;
            this.score += comboBonus;
        }
        
        // Verificar logros
        if (this.achievementSystem) {
            this.achievementSystem.checkAchievements(this);
        }
        
        // Verificar cambio de nivel
        if (this.score >= this.level * 1000) {
            this.nextLevel();
        }
    }
    
    // Método para dibujar información del combo
    drawComboInfo() {
        if (this.combo > 1) {
            const ctx = this.ctx;
            ctx.save();
            
            // Fondo
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(10, 80, 120, 40);
            
            // Borde
            ctx.strokeStyle = '#ffff00';
            ctx.lineWidth = 2;
            ctx.strokeRect(10, 80, 120, 40);
            
            // Texto del combo
            ctx.fillStyle = '#ffff00';
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(`COMBO x${this.combo}`, 70, 100);
            
            // Barra de progreso del combo
            const progress = this.comboTimer / 5000;
            ctx.fillStyle = '#00ff00';
            ctx.fillRect(15, 110, 110 * progress, 5);
            
            ctx.restore();
        }
    }
    
    // Método para dibujar indicador de dificultad
    drawDifficultyIndicator() {
        const ctx = this.ctx;
        ctx.save();
        
        // Fondo
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(10, 130, 120, 30);
        
        // Borde
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = 2;
        ctx.strokeRect(10, 130, 120, 30);
        
        // Texto
        ctx.fillStyle = '#ff0000';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`DIFICULTAD x${this.difficultyMultiplier.toFixed(1)}`, 70, 150);
        
        ctx.restore();
    }
    
    // Método para dibujar UI del juego
    drawUI() {
        const ctx = this.ctx;
        ctx.save();
        
        // Fondo del panel de información
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(10, 10, 200, 70);
        
        // Borde
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.strokeRect(10, 10, 200, 70);
        
        // Texto de información
        ctx.fillStyle = '#ffffff';
        ctx.font = '14px Arial';
        ctx.textAlign = 'left';
        
        ctx.fillText(`PUNTOS: ${this.score}`, 20, 30);
        ctx.fillText(`NIVEL: ${this.level}`, 20, 45);
        ctx.fillText(`VIDAS: ${this.lives}`, 20, 60);
        
        // Información del jugador
        if (this.player) {
            // Salud
            const healthPercent = this.player.health / this.player.maxHealth;
            ctx.fillStyle = '#ff0000';
            ctx.fillRect(250, 20, 100, 10);
            ctx.fillStyle = '#00ff00';
            ctx.fillRect(250, 20, 100 * healthPercent, 10);
            
            // Escudo
            const shieldPercent = this.player.shield / 100;
            ctx.fillStyle = '#0000ff';
            ctx.fillRect(250, 35, 100, 10);
            ctx.fillStyle = '#00ffff';
            ctx.fillRect(250, 35, 100 * shieldPercent, 10);
            
            // Arma actual
            ctx.fillStyle = '#ffffff';
            ctx.fillText(`ARMA: ${this.player.currentWeapon}`, 250, 55);
            
            // Arma especial
            if (this.player.specialWeapon) {
                ctx.fillText(`ESPECIAL: ${this.player.specialWeapon} (${this.player.specialWeaponAmmo})`, 250, 70);
            }
        }
        
        // Tiempo de supervivencia
        const minutes = Math.floor(this.survivalTime / 60000);
        const seconds = Math.floor((this.survivalTime % 60000) / 1000);
        ctx.fillText(`TIEMPO: ${minutes}:${seconds.toString().padStart(2, '0')}`, 400, 30);
        
        // Desafío diario
        if (this.dailyChallenge && !this.dailyChallengeCompleted) {
            ctx.fillStyle = '#ffff00';
            ctx.fillText(`DESAFÍO: ${this.dailyChallenge.description}`, 400, 50);
        }
        
        ctx.restore();
    }
    
    // Método para disparar arma especial
    shootSpecialWeapon(weaponType) {
        if (!this.player || this.player.specialWeaponAmmo <= 0) return;
        
        const centerX = this.player.x + this.player.width / 2;
        const centerY = this.player.y;
        
        switch (weaponType) {
            case 'plasma':
                // Bala de plasma que explota al impactar
                const plasmaBullet = new Bullet(centerX, centerY, 0, -8, 2, 'plasma');
                this.bullets.push(plasmaBullet);
                break;
                
            case 'missile':
                // Misil que busca enemigos
                const missileBullet = new Bullet(centerX, centerY, 0, -6, 3, 'missile');
                this.bullets.push(missileBullet);
                break;
                
            case 'laserBeam':
                // Láser continuo
                const laserBullet = new Bullet(centerX, centerY, 0, -10, 4, 'laserBeam');
                this.bullets.push(laserBullet);
                break;
        }
        
        // Sonido de arma especial
        if (this.audioManager) {
            this.audioManager.playSound('specialWeapon', 0.8);
        }
        
        // Partículas de power-up
        if (this.particleSystem) {
            this.particleSystem.addEmitter(centerX, centerY, 'powerup', 10);
        }
    }
    
    // Método para generar power-ups
    spawnPowerUp() {
        const x = Math.random() * (this.canvas.width - 20);
        const y = -20;
        
        // Tipos de power-ups disponibles
        const powerUpTypes = [
            'weapon', 'speed', 'life', 'shield', 'specialWeapon', 
            'dashUpgrade', 'health', 'timeFreeze'
        ];
        
        // Probabilidad de power-up especial
        let type;
        if (Math.random() < this.specialPowerUpChance) {
            type = 'specialWeapon';
        } else {
            type = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
        }
        
        let powerUp;
        if (type === 'specialWeapon') {
            powerUp = new SpecialPowerUp(x, y, type);
        } else {
            powerUp = new PowerUp(x, y, type);
        }
        
        this.powerUps.push(powerUp);
    }
    
    // Método para limpiar objetos muertos
    cleanupDeadObjects() {
        // Limpiar balas muertas
        this.bullets = this.bullets.filter(bullet => !bullet.isDead);
        this.enemyBullets = this.enemyBullets.filter(bullet => !bullet.isDead);
        
        // Limpiar enemigos muertos
        this.enemies = this.enemies.filter(enemy => !enemy.isDead);
        
        // Limpiar jefes muertos
        this.bosses = this.bosses.filter(boss => !boss.isDead);
        
        // Limpiar power-ups muertos
        this.powerUps = this.powerUps.filter(powerUp => !powerUp.isDead);
        
        // Limpiar partículas muertas
        if (this.particleSystem) {
            this.particleSystem.cleanup();
        }
        
        // Limpiar efectos especiales muertos
        this.laserBeams = this.laserBeams.filter(laser => !laser.isDead);
        this.earthquakeWaves = this.earthquakeWaves.filter(wave => !wave.isDead);
    }
    
    // Método para verificar si el juego debe continuar
    checkGameState() {
        // Verificar si el jugador murió
        if (this.player && this.player.isDead) {
            this.lives--;
            
            if (this.lives <= 0) {
                this.gameOver();
            } else {
                this.respawnPlayer();
            }
        }
        
        // Verificar si se debe cambiar de nivel
        if (this.score >= this.level * 1000) {
            this.nextLevel();
        }
        
        // Verificar si se debe spawnear un jefe
        if (!this.currentBoss && this.bossSpawnTimer <= 0) {
            this.spawnBoss();
            this.bossSpawnTimer = this.bossSpawnInterval;
        }
    }
    
    // Método para respawnear al jugador
    respawnPlayer() {
        if (!this.player) return;
        
        // Resetear posición
        this.player.x = this.canvas.width / 2 - this.player.width / 2;
        this.player.y = this.canvas.height - this.player.height - 20;
        
        // Resetear estado
        this.player.health = this.player.maxHealth;
        this.player.shield = 100;
        this.player.isDead = false;
        this.player.flashTimer = 0;
        
        // Efecto visual
        if (this.particleSystem) {
            this.particleSystem.addEmitter(this.player.x + this.player.width / 2, this.player.y + this.player.height / 2, 'powerup', 20);
        }
        
        // Sonido
        if (this.audioManager) {
            this.audioManager.playSound('respawn', 0.8);
        }
    }
    
    // Método para manejar entrada del teclado
    handleKeyDown(e) {
        if (!this.player) return;
        
        const key = e.key.toLowerCase();
        
        switch (key) {
            case ' ':
                e.preventDefault();
                if (this.gameState === 'playing') {
                    this.shoot();
                }
                break;
            case 'p':
                if (this.gameState === 'playing') {
                    this.togglePause();
                }
                break;
            case 'q':
                if (this.gameState === 'playing') {
                    this.player.useSpecialWeapon();
                }
                break;
            case 'shift':
                if (this.gameState === 'playing') {
                    this.player.dash();
                }
                break;
        }
        
        // Actualizar teclas presionadas
        this.player.keys[key] = true;
    }
    
    // Método para manejar liberación de teclas
    handleKeyUp(e) {
        if (!this.player) return;
        
        const key = e.key.toLowerCase();
        this.player.keys[key] = false;
    }
    
    // Método para manejar movimiento del mouse
    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouseX = e.clientX - rect.left;
        this.mouseY = e.clientY - rect.top;
    }
    
    // Método para manejar clic del mouse
    handleMouseClick(e) {
        if (this.gameState === 'playing') {
            this.shoot();
        }
    }
}

// Player class
class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 40;
        this.speed = 5;
        this.health = 3;
        this.maxHealth = 3;
        this.isFlashing = false;
        this.flashTimer = 0;
        this.flashDuration = 1000;
        
        // Sistema de escudo
        this.shield = 100;
        this.maxShield = 100;
        this.shieldRegenRate = 10; // por segundo
        this.shieldRegenDelay = 3000; // 3 segundos después del daño
        this.lastDamageTime = 0;
        
        // Sistema de armas especiales
        this.specialWeapon = null;
        this.specialWeaponAmmo = 0;
        this.specialWeaponCooldown = 0;
        this.specialWeaponMaxCooldown = 1000;
        
        // Sistema de dash
        this.dashCooldown = 0;
        this.dashMaxCooldown = 2000;
        this.dashSpeed = 15;
        this.dashDuration = 200;
        this.isDashing = false;
        this.dashTimer = 0;
        
        // Arma actual
        this.currentWeapon = 'basic';
        this.weaponCooldown = 0;
        this.weaponMaxCooldown = 200;
    }
    
    update(deltaTime, keys, mouse, canvas) {
        // Actualizar timers
        if (this.isFlashing) {
            this.flashTimer += deltaTime;
            if (this.flashTimer >= this.flashDuration) {
                this.isFlashing = false;
                this.flashTimer = 0;
            }
        }
        
        // Actualizar cooldown del dash
        if (this.dashCooldown > 0) {
            this.dashCooldown -= deltaTime;
        }
        
        // Actualizar cooldown del arma especial
        if (this.specialWeaponCooldown > 0) {
            this.specialWeaponCooldown -= deltaTime;
        }
        
        // Regeneración del escudo
        if (Date.now() - this.lastDamageTime > this.shieldRegenDelay && this.shield < this.maxShield) {
            this.shield += this.shieldRegenRate;
            if (this.shield > this.maxShield) {
                this.shield = this.maxShield;
            }
        }
        
        // Actualizar dash
        if (this.isDashing) {
            this.dashTimer += deltaTime;
            if (this.dashTimer >= this.dashDuration) {
                this.isDashing = false;
                this.dashTimer = 0;
            }
        }
        
        // Movimiento del jugador
        let currentSpeed = this.isDashing ? this.dashSpeed : this.speed;
        
        if (keys['ArrowLeft'] || keys['a'] || keys['A']) {
            this.x -= currentSpeed;
        }
        if (keys['ArrowRight'] || keys['d'] || keys['D']) {
            this.x += currentSpeed;
        }
        if (keys['ArrowUp'] || keys['w'] || keys['W']) {
            this.y -= currentSpeed;
        }
        if (keys['ArrowDown'] || keys['s'] || keys['S']) {
            this.y += currentSpeed;
        }
        
        // Dash con Shift
        if ((keys['Shift'] || keys[' ']) && this.dashCooldown <= 0 && !this.isDashing) {
            this.isDashing = true;
            this.dashCooldown = this.dashMaxCooldown;
            this.dashTimer = 0;
        }
        
        // Mantener al jugador dentro del canvas
        this.x = Math.max(0, Math.min(canvas.width - this.width, this.x));
        this.y = Math.max(0, Math.min(canvas.height - this.height, this.y));
        
        // Seguir el mouse para apuntar
        this.aimAt(mouse.x, mouse.y);
    }
    
    draw(ctx) {
        ctx.save();
        
        // Efecto de dash
        if (this.isDashing) {
            ctx.globalAlpha = 0.7;
            ctx.shadowColor = '#00ffff';
            ctx.shadowBlur = 20;
        }
        
        // Efecto de parpadeo
        if (this.isFlashing && Math.floor(this.flashTimer / 100) % 2 === 0) {
            ctx.globalAlpha = 0.5;
        }
        
        // Dibujar escudo
        if (this.shield > 0) {
            ctx.beginPath();
            ctx.arc(this.x + this.width / 2, this.y + this.height / 2, 
                   this.width / 2 + 5, 0, Math.PI * 2);
            ctx.strokeStyle = '#00ffff';
            ctx.lineWidth = 3;
            ctx.globalAlpha = this.shield / this.maxShield;
            ctx.stroke();
        }
        
        // Dibujar jugador
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Indicador de arma especial
        if (this.specialWeapon !== 'none' && this.specialWeaponAmmo > 0) {
            ctx.fillStyle = '#ff00ff';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(`${this.specialWeapon.toUpperCase()}`, 
                        this.x + this.width / 2, this.y - 10);
        }
        
        // Indicador de dash
        if (this.dashCooldown > 0) {
            const cooldownPercent = this.dashCooldown / this.dashMaxCooldown;
            ctx.fillStyle = '#ffff00';
            ctx.fillRect(this.x, this.y - 20, this.width * cooldownPercent, 3);
        }
        
        ctx.restore();
    }
    
    aimAt(mouseX, mouseY) {
        // Calcular ángulo hacia el mouse
        const dx = mouseX - (this.x + this.width / 2);
        const dy = mouseY - (this.y + this.height / 2);
        this.angle = Math.atan2(dy, dx);
    }
    
    takeDamage(damage) {
        // Aplicar daño al escudo primero
        if (this.shield > 0) {
            const shieldDamage = Math.min(this.shield, damage);
            this.shield -= shieldDamage;
            damage -= shieldDamage;
        }
        
        // Si queda daño, aplicarlo a la salud
        if (damage > 0) {
            this.health -= damage;
        }
        
        // Activar parpadeo
        this.flashTimer = this.flashDuration;
        this.lastDamageTime = Date.now();
        
        // Sonido de daño
        if (window.game && window.game.audioManager) {
            window.game.audioManager.playSound('hit', 0.7);
        }
        
        // Verificar si el jugador murió
        if (this.health <= 0) {
            this.isDead = true;
        }
    }
    
    useSpecialWeapon() {
        if (!this.specialWeapon || this.specialWeaponAmmo <= 0) return;
        
        // Usar munición
        this.specialWeaponAmmo--;
        
        // Disparar arma especial
        if (window.game) {
            window.game.shootSpecialWeapon(this.specialWeapon);
        }
        
        // Si se acabó la munición, quitar el arma
        if (this.specialWeaponAmmo <= 0) {
            this.specialWeapon = null;
        }
    }
    
    dash() {
        if (this.dashCooldown > 0) return;
        
        // Realizar dash
        const dashDistance = 100;
        const dashDuration = 200;
        
        // Calcular dirección del dash
        const mouseX = window.game ? window.game.mouseX : 400;
        const mouseY = window.game ? window.game.mouseY : 300;
        const dx = mouseX - (this.x + this.width / 2);
        const dy = mouseY - (this.y + this.height / 2);
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0) {
            const dashX = (dx / distance) * dashDistance;
            const dashY = (dy / distance) * dashDistance;
            
            // Aplicar dash
            this.x += dashX;
            this.y += dashY;
            
            // Mantener en pantalla
            this.x = Math.max(0, Math.min(800 - this.width, this.x));
            this.y = Math.max(0, Math.min(600 - this.height, this.y));
            
            // Efecto visual
            if (window.game && window.game.particleSystem) {
                window.game.particleSystem.addEmitter(this.x + this.width / 2, this.y + this.height / 2, 'engine', 10);
            }
            
            // Sonido
            if (window.game && window.game.audioManager) {
                window.game.audioManager.playSound('dash', 0.8);
            }
        }
        
        // Activar cooldown
        this.dashCooldown = this.dashMaxCooldown;
    }
    
    update(deltaTime, keys) {
        // Movimiento del jugador
        if (keys.ArrowLeft || keys.a) {
            this.x -= this.speed;
        }
        if (keys.ArrowRight || keys.d) {
            this.x += this.speed;
        }
        if (keys.ArrowUp || keys.w) {
            this.y -= this.speed;
        }
        if (keys.ArrowDown || keys.s) {
            this.y += this.speed;
        }
        
        // Mantener en pantalla
        this.x = Math.max(0, Math.min(800 - this.width, this.x));
        this.y = Math.max(0, Math.min(600 - this.height, this.y));
        
        // Apuntar hacia el mouse
        if (window.game) {
            const mouseX = window.game.mouseX;
            const mouseY = window.game.mouseY;
            const dx = mouseX - (this.x + this.width / 2);
            const dy = mouseY - (this.y + this.height / 2);
            this.angle = Math.atan2(dy, dx);
        }
        
        // Actualizar cooldowns
        if (this.weaponCooldown > 0) {
            this.weaponCooldown -= deltaTime;
        }
        if (this.dashCooldown > 0) {
            this.dashCooldown -= deltaTime;
        }
        if (this.specialWeaponCooldown > 0) {
            this.specialWeaponCooldown -= deltaTime;
        }
        
        // Regeneración del escudo
        if (this.shield < 100 && Date.now() - this.lastDamageTime > 3000) {
            this.shield = Math.min(100, this.shield + this.shieldRegenRate * (deltaTime / 1000));
        }
        
        // Efecto de parpadeo
        if (this.flashTimer > 0) {
            this.flashTimer -= deltaTime;
        }
        
        // Partículas del motor
        if (window.game && window.game.particleSystem && Math.random() < 0.3) {
            window.game.particleSystem.addEmitter(
                this.x + this.width / 2,
                this.y + this.height,
                'engine',
                1
            );
        }
    }
    
    draw(ctx) {
        ctx.save();
        
        // Efecto de parpadeo
        if (this.flashTimer > 0) {
            ctx.globalAlpha = 0.5;
        }
        
        // Dibujar nave del jugador
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.angle);
        
        // Cuerpo principal
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        
        // Detalles
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(-this.width / 2 + 2, -this.height / 2 + 2, this.width - 4, this.height - 4);
        
        // Motor
        ctx.fillStyle = '#ffaa00';
        ctx.fillRect(-this.width / 2 + 5, this.height / 2, 4, 8);
        ctx.fillRect(this.width / 2 - 9, this.height / 2, 4, 8);
        
        // Arma
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(-2, -this.height / 2 - 5, 4, 10);
        
        ctx.restore();
        
        // Dibujar barra de salud
        this.drawHealthBar(ctx);
        
        // Dibujar barra de escudo
        this.drawShieldBar(ctx);
    }
    
    drawHealthBar(ctx) {
        const barWidth = this.width;
        const barHeight = 6;
        const barX = this.x;
        const barY = this.y - 15;
        
        // Fondo
        ctx.fillStyle = '#333333';
        ctx.fillRect(barX, barY, barWidth, barHeight);
        
        // Salud
        const healthPercent = this.health / this.maxHealth;
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);
        
        // Borde
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.strokeRect(barX, barY, barWidth, barHeight);
    }
    
    drawShieldBar(ctx) {
        const barWidth = this.width;
        const barHeight = 4;
        const barX = this.x;
        const barY = this.y - 8;
        
        // Fondo
        ctx.fillStyle = '#333333';
        ctx.fillRect(barX, barY, barWidth, barHeight);
        
        // Escudo
        const shieldPercent = this.shield / 100;
        ctx.fillStyle = '#0000ff';
        ctx.fillRect(barX, barY, barWidth * shieldPercent, barHeight);
        
        // Borde
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.strokeRect(barX, barY, barWidth, barHeight);
    }
}

// Enemy class
class Enemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 30;
        this.speed = 2 + Math.random() * 2;
        this.health = 2;
        this.maxHealth = 2;
        this.damage = 1;
        this.isDead = false;
        this.flashTimer = 0;
        this.flashDuration = 200;
        
        // Movimiento
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = this.speed;
        
        // Patrón de disparo
        this.shootTimer = 0;
        this.shootInterval = 2000 + Math.random() * 2000;
    }
    
    update(deltaTime) {
        // Movimiento
        this.x += this.vx;
        this.y += this.vy;
        
        // Mantener en pantalla
        if (this.x < 0 || this.x > 800 - this.width) {
            this.vx *= -1;
        }
        
        // Disparar
        this.shootTimer += deltaTime;
        if (this.shootTimer >= this.shootInterval) {
            this.shoot();
            this.shootTimer = 0;
        }
        
        // Efecto de parpadeo
        if (this.flashTimer > 0) {
            this.flashTimer -= deltaTime;
        }
    }
    
    shoot() {
        if (window.game) {
            const bullet = new BossBullet(
                this.x + this.width / 2,
                this.y + this.height,
                0,
                4,
                1,
                'enemy'
            );
            window.game.enemyBullets.push(bullet);
        }
    }
    
    takeDamage(damage) {
        this.health -= damage;
        this.flashTimer = this.flashDuration;
        
        if (this.health <= 0) {
            this.isDead = true;
        }
    }
    
    draw(ctx) {
        ctx.save();
        
        // Efecto de parpadeo
        if (this.flashTimer > 0) {
            ctx.globalAlpha = 0.5;
        }
        
        // Color basado en salud
        const healthPercent = this.health / this.maxHealth;
        if (healthPercent > 0.6) {
            ctx.fillStyle = '#ff0000';
        } else if (healthPercent > 0.3) {
            ctx.fillStyle = '#ff6600';
        } else {
            ctx.fillStyle = '#ffaa00';
        }
        
        // Dibujar enemigo
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Barra de salud
        if (this.health < this.maxHealth) {
            const barWidth = this.width;
            const barHeight = 4;
            const barX = this.x;
            const barY = this.y - 8;
            
            // Fondo
            ctx.fillStyle = '#333333';
            ctx.fillRect(barX, barY, barWidth, barHeight);
            
            // Salud
            ctx.fillStyle = '#00ff00';
            ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);
        }
        
        ctx.restore();
    }
}

// Bullet class
class Bullet {
    constructor(x, y, vx, vy, damage = 1, type = 'basic') {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.width = 4;
        this.height = 8;
        this.damage = damage;
        this.type = type;
        this.isDead = false;
        this.lifetime = 3000; // 3 segundos
        this.age = 0;
        
        // Propiedades especiales según el tipo
        this.setupBulletType();
    }
    
    setupBulletType() {
        switch (this.type) {
            case 'basic':
                this.width = 4;
                this.height = 10;
                this.damage = 1;
                this.lifetime = 2000;
                break;
            case 'plasma':
                this.width = 6;
                this.height = 6;
                this.damage = 3;
                this.lifetime = 3000;
                this.seeking = true;
                break;
            case 'missile':
                this.width = 8;
                this.height = 8;
                this.damage = 2;
                this.lifetime = 4000;
                this.seeking = true;
                break;
            case 'laserBeam':
                this.width = 4;
                this.height = 20;
                this.damage = 4;
                this.lifetime = 1500;
                break;
            default:
                this.width = 4;
                this.height = 10;
                this.damage = 1;
                this.lifetime = 2000;
        }
    }
    
    seekTarget() {
        if (!this.seeking || !window.game) return;
        
        // Buscar el enemigo más cercano
        let closestEnemy = null;
        let closestDistance = Infinity;
        
        // Buscar en enemigos normales
        for (const enemy of window.game.enemies) {
            if (enemy.isDead) continue;
            
            const dx = enemy.x + enemy.width / 2 - this.x;
            const dy = enemy.y + enemy.height / 2 - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < closestDistance) {
                closestDistance = distance;
                closestEnemy = enemy;
            }
        }
        
        // Buscar en jefes
        for (const boss of window.game.bosses) {
            if (boss.isDead) continue;
            
            const dx = boss.x + boss.width / 2 - this.x;
            const dy = boss.y + boss.height / 2 - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < closestDistance) {
                closestDistance = distance;
                closestEnemy = boss;
            }
        }
        
        // Si se encontró un objetivo, ajustar dirección gradualmente
        if (closestEnemy && closestDistance < 200) {
            const targetX = closestEnemy.x + closestEnemy.width / 2;
            const targetY = closestEnemy.y + closestEnemy.height / 2;
            
            const dx = targetX - this.x;
            const dy = targetY - this.y;
            const targetAngle = Math.atan2(dy, dx);
            
            // Ajustar dirección gradualmente
            const currentAngle = Math.atan2(this.vy, this.vx);
            let newAngle = currentAngle;
            
            if (Math.abs(targetAngle - currentAngle) > 0.1) {
                if (targetAngle > currentAngle) {
                    newAngle = currentAngle + 0.1;
                } else {
                    newAngle = currentAngle - 0.1;
                }
            }
            
            // Aplicar nueva dirección
            const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
            this.vx = Math.cos(newAngle) * speed;
            this.vy = Math.sin(newAngle) * speed;
            
            // Limitar velocidad máxima
            const maxSpeed = 8;
            if (speed > maxSpeed) {
                this.vx = (this.vx / speed) * maxSpeed;
                this.vy = (this.vy / speed) * maxSpeed;
            }
        }
    }
    
    update(deltaTime) {
        // Movimiento
        this.x += this.vx;
        this.y += this.vy;
        
        // Búsqueda de objetivo (para misiles y plasma)
        this.seekTarget();
        
        // Actualizar tiempo de vida
        this.age += deltaTime;
        if (this.age >= this.lifetime) {
            this.isDead = true;
        }
        
        // Verificar si está fuera de pantalla
        if (this.y < -this.height || this.y > 600 + this.height || 
            this.x < -this.width || this.x > 800 + this.width) {
            this.isDead = true;
        }
    }
    
    draw(ctx) {
        ctx.save();
        
        // Color basado en tipo
        switch (this.type) {
            case 'basic':
                ctx.fillStyle = '#ffff00';
                break;
            case 'plasma':
                ctx.fillStyle = '#ff00ff';
                break;
            case 'missile':
                ctx.fillStyle = '#ff8800';
                break;
            case 'laserBeam':
                ctx.fillStyle = '#00ffff';
                break;
            default:
                ctx.fillStyle = '#ffffff';
        }
        
        // Dibujar bala
        ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        
        // Efecto especial para balas especiales
        if (this.type === 'plasma' || this.type === 'missile') {
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1;
            ctx.strokeRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        }
        
        ctx.restore();
    }
}

// PowerUp class
class PowerUp {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 20;
        this.type = type;
        this.speed = 2;
        this.isDead = false;
        this.pulseTimer = 0;
        this.pulseSpeed = 0.01;
    }
    
    update(deltaTime) {
        this.y += this.speed;
        this.pulseTimer += deltaTime * this.pulseSpeed;
        
        if (this.y > 600) {
            this.isDead = true;
        }
    }
    
    draw(ctx) {
        ctx.save();
        
        // Efecto de pulso
        const pulse = Math.sin(this.pulseTimer) * 0.2 + 0.8;
        ctx.globalAlpha = pulse;
        
        // Color basado en tipo
        switch (this.type) {
            case 'weapon':
                ctx.fillStyle = '#ff00ff';
                break;
            case 'speed':
                ctx.fillStyle = '#00ffff';
                break;
            case 'life':
                ctx.fillStyle = '#ff0000';
                break;
            case 'shield':
                ctx.fillStyle = '#0000ff';
                break;
            case 'specialWeapon':
                ctx.fillStyle = '#ffff00';
                break;
            case 'dashUpgrade':
                ctx.fillStyle = '#ff8800';
                break;
            case 'health':
                ctx.fillStyle = '#00ff00';
                break;
            case 'timeFreeze':
                ctx.fillStyle = '#0088ff';
                break;
            default:
                ctx.fillStyle = '#ffffff';
        }
        
        // Dibujar power-up
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Borde
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        
        // Símbolo
        ctx.fillStyle = '#000000';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        let symbol = '?';
        switch (this.type) {
            case 'weapon': symbol = '⚔️'; break;
            case 'speed': symbol = '⚡'; break;
            case 'life': symbol = '❤️'; break;
            case 'shield': symbol = '🛡️'; break;
            case 'specialWeapon': symbol = '🔫'; break;
            case 'dashUpgrade': symbol = '💨'; break;
            case 'health': symbol = '💊'; break;
            case 'timeFreeze': symbol = '❄️'; break;
        }
        
        ctx.fillText(symbol, this.x + this.width / 2, this.y + this.height / 2);
        
        ctx.restore();
    }
}

// SpecialPowerUp class (extends PowerUp)
class SpecialPowerUp extends PowerUp {
    constructor(x, y, type) {
        super(x, y, type);
        this.width = 25;
        this.height = 25;
        this.glowTimer = 0;
        this.glowSpeed = 0.02;
        this.rarity = 'special';
    }
    
    update(deltaTime) {
        super.update(deltaTime);
        this.glowTimer += deltaTime * this.glowSpeed;
    }
    
    draw(ctx) {
        ctx.save();
        
        // Efecto de brillo especial
        const glow = Math.sin(this.glowTimer) * 0.3 + 0.7;
        ctx.globalAlpha = glow;
        
        // Brillo exterior
        const gradient = ctx.createRadialGradient(
            this.x + this.width / 2, this.y + this.height / 2, 0,
            this.x + this.width / 2, this.y + this.height / 2, this.width
        );
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
        gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(this.x - 5, this.y - 5, this.width + 10, this.height + 10);
        
        // Dibujar power-up base
        super.draw(ctx);
        
        // Borde especial
        ctx.strokeStyle = '#ffff00';
        ctx.lineWidth = 3;
        ctx.strokeRect(this.x - 2, this.y - 2, this.width + 4, this.height + 4);
        
        ctx.restore();
    }
}

// Particle class
class Particle {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.isDead = false;
        this.age = 0;
        this.lifetime = 1000;
        
        // Propiedades específicas del tipo
        this.setupParticleType();
    }
    
    setupParticleType() {
        switch (this.type) {
            case 'explosion':
                this.vx = (Math.random() - 0.5) * 8;
                this.vy = (Math.random() - 0.5) * 8;
                this.size = Math.random() * 4 + 2;
                this.color = '#ff6600';
                this.lifetime = 800;
                break;
            case 'powerup':
                this.vx = (Math.random() - 0.5) * 3;
                this.vy = (Math.random() - 0.5) * 3;
                this.size = Math.random() * 3 + 1;
                this.color = '#00ffff';
                this.lifetime = 1200;
                break;
            case 'engine':
                this.vx = (Math.random() - 0.5) * 2;
                this.vy = Math.random() * 2 + 1;
                this.size = Math.random() * 2 + 1;
                this.color = '#ffaa00';
                this.lifetime = 600;
                break;
            case 'bossDeath':
                this.vx = (Math.random() - 0.5) * 10;
                this.vy = (Math.random() - 0.5) * 10;
                this.size = Math.random() * 6 + 3;
                this.color = '#ff0000';
                this.lifetime = 1500;
                break;
            case 'ice':
                this.vx = (Math.random() - 0.5) * 1;
                this.vy = Math.random() * 1 + 0.5;
                this.size = Math.random() * 2 + 1;
                this.color = '#00ffff';
                this.lifetime = 2000;
                break;
            case 'levelUp':
                this.vx = (Math.random() - 0.5) * 4;
                this.vy = (Math.random() - 0.5) * 4;
                this.size = Math.random() * 3 + 2;
                this.color = '#ffff00';
                this.lifetime = 1000;
                break;
            default:
                this.vx = (Math.random() - 0.5) * 2;
                this.vy = (Math.random() - 0.5) * 2;
                this.size = Math.random() * 2 + 1;
                this.color = '#ffffff';
                this.lifetime = 1000;
        }
    }
    
    update(deltaTime) {
        this.x += this.vx;
        this.y += this.vy;
        this.age += deltaTime;
        
        // Desaceleración
        this.vx *= 0.98;
        this.vy *= 0.98;
        
        // Verificar si debe morir
        if (this.age >= this.lifetime) {
            this.isDead = true;
        }
    }
    
    draw(ctx) {
        ctx.save();
        
        // Transparencia basada en edad
        const alpha = 1 - (this.age / this.lifetime);
        ctx.globalAlpha = alpha;
        
        // Color
        ctx.fillStyle = this.color;
        
        // Dibujar partícula
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
}

// Star class
class Star {
    constructor() {
        this.x = Math.random() * 800;
        this.y = Math.random() * 600;
        this.size = Math.random() * 2 + 1;
        this.speed = Math.random() * 0.5 + 0.1;
        this.brightness = Math.random() * 0.5 + 0.5;
    }
    
    update(deltaTime) {
        this.y += this.speed;
        if (this.y > 600) {
            this.y = -10;
            this.x = Math.random() * 800;
        }
    }
    
    draw(ctx) {
        ctx.save();
        ctx.fillStyle = `rgba(255, 255, 255, ${this.brightness})`;
        ctx.fillRect(this.x, this.y, this.size, this.size);
        ctx.restore();
    }
}

// Advanced Systems
class AudioManager {
    constructor() {
        this.sounds = {};
        this.music = {};
        this.isMuted = false;
    }

    async init() {
        // Cargar sonidos
        this.sounds['shoot'] = new Audio('assets/sounds/shoot.mp3');
        this.sounds['explosion'] = new Audio('assets/sounds/explosion.mp3');
        this.sounds['hit'] = new Audio('assets/sounds/hit.mp3');
        this.sounds['powerup'] = new Audio('assets/sounds/powerup.mp3');
        this.sounds['gameover'] = new Audio('assets/sounds/gameover.mp3');
        this.sounds['levelup'] = new Audio('assets/sounds/levelup.mp3');
        this.sounds['menu'] = new Audio('assets/sounds/menu.mp3');
        this.sounds['background'] = new Audio('assets/sounds/background.mp3');

        // Configurar sonidos
        this.sounds.forEach(sound => {
            sound.volume = 0.5;
            sound.load();
        });

        // Configurar música
        this.music['background'] = new Audio('assets/sounds/background.mp3');
        this.music['background'].loop = true;
        this.music['background'].volume = 0.3;
        this.music['background'].load();
    }

    playSound(name, volume = 1) {
        if (this.isMuted) return;
        const sound = this.sounds[name];
        if (sound) {
            sound.volume = volume;
            sound.currentTime = 0; // Reproducir desde el principio
            sound.play();
        }
    }

    playMusic(name, loop = true) {
        if (this.isMuted) return;
        const music = this.music[name];
        if (music) {
            music.loop = loop;
            music.currentTime = 0;
            music.play();
        }
    }

    stopMusic() {
        Object.values(this.music).forEach(music => music.pause());
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        Object.values(this.music).forEach(music => music.volume = this.isMuted ? 0 : 0.3);
        Object.values(this.sounds).forEach(sound => sound.volume = this.isMuted ? 0 : 0.5);
    }
}

class ParticleSystem {
    constructor() {
        this.emitters = [];
        this.particles = [];
        this.maxParticles = 1000; // Limite de partículas en el sistema
    }

    update(deltaTime) {
        // Actualizar partículas existentes
        this.particles = this.particles.filter(p => !p.isDead);

        // Actualizar emisores
        this.emitters = this.emitters.filter(e => e.isActive);

        // Generar nuevas partículas
        this.emitters.forEach(e => {
            e.update(deltaTime);
            if (e.shouldEmit) {
                for (let i = 0; i < e.emissionRate; i++) {
                    this.particles.push(e.emit());
                }
            }
        });

        // Limitar el número de partículas
        if (this.particles.length > this.maxParticles) {
            this.particles.splice(0, this.particles.length - this.maxParticles);
        }
    }

    draw(ctx) {
        this.particles.forEach(p => p.draw(ctx));
        this.emitters.forEach(e => e.draw(ctx));
    }

    addEmitter(x, y, type, emissionRate = 1) {
        const emitter = new Emitter(x, y, type, emissionRate);
        this.emitters.push(emitter);
    }
}

class Emitter {
    constructor(x, y, type, emissionRate = 1) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.emissionRate = emissionRate;
        this.shouldEmit = true;
        this.lastEmitTime = 0;
        this.interval = 1000 / emissionRate; // Intervalo de emisión
        this.isActive = true;
    }

    update(deltaTime) {
        this.lastEmitTime += deltaTime;
        if (this.lastEmitTime >= this.interval) {
            this.lastEmitTime = 0;
            this.shouldEmit = true;
        } else {
            this.shouldEmit = false;
        }
    }

    emit() {
        const particle = new Particle(this.x, this.y, this.type);
        return particle;
    }

    draw(ctx) {
        // Dibujar emisor (opcional, por ejemplo, un punto)
        ctx.fillStyle = '#fff';
        ctx.fillRect(this.x - 1, this.y - 1, 2, 2);
    }
}

class AchievementSystem {
    constructor() {
        this.stats = {
            totalGames: 0,
            totalScore: 0,
            totalTime: 0,
            totalEnemiesDestroyed: 0,
            totalPowerUpsCollected: 0,
            totalShotsFired: 0,
            totalShotsHit: 0,
            highestScore: 0,
            highestLevel: 0,
            longestSurvival: 0,
            totalBossesDefeated: 0
        };
        this.achievements = [
            { name: '¡Iniciado!', description: 'Jugar tu primer juego', condition: () => this.stats.totalGames > 0 },
            { name: '¡Vencedor!', description: 'Ganar un juego', condition: () => this.stats.totalGames > 0 },
            { name: '¡Conquistador!', description: 'Destruir 100 enemigos', condition: () => this.stats.totalEnemiesDestroyed >= 100 },
            { name: '¡Invencible!', description: 'Sobrevivir 10 minutos', condition: () => this.stats.longestSurvival >= 600000 },
            { name: '¡Maestro del Destino!', description: 'Defender 10 jefes', condition: () => this.stats.totalBossesDefeated >= 10 },
            { name: '¡El Rey de los Jefes!', description: 'Defender 50 jefes', condition: () => this.stats.totalBossesDefeated >= 50 },
            { name: '¡El Gran Maestro!', description: 'Ganar 10 juegos', condition: () => this.stats.totalGames >= 10 },
            { name: '¡El Gran Vencedor!', description: 'Ganar 50 juegos', condition: () => this.stats.totalGames >= 50 },
            { name: '¡El Gran Conquistador!', description: 'Recolectar 100 power-ups', condition: () => this.stats.totalPowerUpsCollected >= 100 },
            { name: '¡El Gran Destructor!', description: 'Destruir 1000 enemigos', condition: () => this.stats.totalEnemiesDestroyed >= 1000 },
            { name: '¡El Gran Maestro de la Guerra!', description: 'Ganar 100 juegos', condition: () => this.stats.totalGames >= 100 },
            { name: '¡El Gran Maestro Supremo!', description: 'Ganar 500 juegos', condition: () => this.stats.totalGames >= 500 },
            { name: '¡El Gran Maestro del Universo!', description: 'Ganar 1000 juegos', condition: () => this.stats.totalGames >= 1000 },
            { name: '¡El Gran Maestro del Tiempo!', description: 'Sobrevivir 1 hora', condition: () => this.stats.longestSurvival >= 3600000 },
            { name: '¡El Gran Maestro del Espacio!', description: 'Ganar 10000 juegos', condition: () => this.stats.totalGames >= 10000 },
            { name: '¡El Gran Maestro del Universo Supremo!', description: 'Ganar 50000 juegos', condition: () => this.stats.totalGames >= 50000 },
            { name: '¡El Gran Maestro del Tiempo Supremo!', description: 'Sobrevivir 10 horas', condition: () => this.stats.longestSurvival >= 36000000 },
            { name: '¡El Gran Maestro del Espacio Supremo!', description: 'Ganar 100000 juegos', condition: () => this.stats.totalGames >= 100000 },
            { name: '¡El Gran Maestro del Universo Infinito!', description: 'Ganar 1000000 juegos', condition: () => this.stats.totalGames >= 1000000 }
        ];
        this.notifications = [];
    }

    incrementStat(name) {
        if (this.stats.hasOwnProperty(name)) {
            this.stats[name]++;
        }
    }

    updateStat(name, value) {
        if (this.stats.hasOwnProperty(name)) {
            this.stats[name] = value;
        }
    }

    checkAchievements() {
        // Logros existentes
        if (this.score >= 10000 && !this.unlocked.includes('score10k')) {
            this.unlockAchievement('score10k', 'Puntuación Alta', 'Alcanza 10,000 puntos', 100);
        }
        
        if (this.score >= 50000 && !this.unlocked.includes('score50k')) {
            this.unlockAchievement('score50k', 'Puntuación Épica', 'Alcanza 50,000 puntos', 200);
        }
        
        if (this.level >= 5 && !this.unlocked.includes('level5')) {
            this.unlockAchievement('level5', 'Sobreviviente', 'Llega al nivel 5', 150);
        }
        
        if (this.level >= 10 && !this.unlocked.includes('level10')) {
            this.unlockAchievement('level10', 'Veterano', 'Llega al nivel 10', 300);
        }
        
        if (this.enemiesDestroyed >= 100 && !this.unlocked.includes('enemies100')) {
            this.unlockAchievement('enemies100', 'Destructor', 'Destruye 100 enemigos', 100);
        }
        
        if (this.enemiesDestroyed >= 500 && !this.unlocked.includes('enemies500')) {
            this.unlockAchievement('enemies500', 'Exterminador', 'Destruye 500 enemigos', 200);
        }
        
        if (this.powerUpsCollected >= 20 && !this.unlocked.includes('powerups20')) {
            this.unlockAchievement('powerups20', 'Coleccionista', 'Recoge 20 power-ups', 100);
        }
        
        if (this.powerUpsCollected >= 50 && !this.unlocked.includes('powerups50')) {
            this.unlockAchievement('powerups50', 'Acumulador', 'Recoge 50 power-ups', 200);
        }
        
        // Nuevos logros del sistema de combo
        if (this.combo >= 10 && !this.unlocked.includes('combo10')) {
            this.unlockAchievement('combo10', 'Combo Maestro', 'Alcanza un combo de 10', 150);
        }
        
        if (this.combo >= 25 && !this.unlocked.includes('combo25')) {
            this.unlockAchievement('combo25', 'Combo Legendario', 'Alcanza un combo de 25', 300);
        }
        
        if (this.maxCombo >= 50 && !this.unlocked.includes('maxCombo50')) {
            this.unlockAchievement('maxCombo50', 'Combo Supremo', 'Alcanza un combo máximo de 50', 500);
        }
        
        // Logros de armas especiales
        if (this.player && this.player.specialWeapon !== 'none' && !this.unlocked.includes('specialWeapon')) {
            this.unlockAchievement('specialWeapon', 'Arsenal Avanzado', 'Usa un arma especial', 100);
        }
        
        if (this.player && this.player.specialWeaponAmmo >= 10 && !this.unlocked.includes('specialAmmo10')) {
            this.unlockAchievement('specialAmmo10', 'Munición Especial', 'Acumula 10 municiones especiales', 150);
        }
        
        // Logros de escudo
        if (this.player && this.player.shield >= this.player.maxShield && !this.unlocked.includes('fullShield')) {
            this.unlockAchievement('fullShield', 'Escudo Completo', 'Llena completamente tu escudo', 100);
        }
        
        // Logros de dash
        if (this.player && this.player.dashMaxCooldown <= 800 && !this.unlocked.includes('dashMaster')) {
            this.unlockAchievement('dashMaster', 'Maestro del Dash', 'Reduce el cooldown del dash a 800ms', 200);
        }
        
        // Logros de supervivencia
        if (this.survivalTime >= 300000 && !this.unlocked.includes('survive5min')) { // 5 minutos
            this.unlockAchievement('survive5min', 'Sobreviviente', 'Sobrevive 5 minutos', 200);
        }
        
        if (this.survivalTime >= 600000 && !this.unlocked.includes('survive10min')) { // 10 minutos
            this.unlockAchievement('survive10min', 'Sobreviviente Épico', 'Sobrevive 10 minutos', 400);
        }
        
        // Logros de dificultad
        if (this.difficultyMultiplier >= 2.0 && !this.unlocked.includes('difficulty2x')) {
            this.unlockAchievement('difficulty2x', 'Dificultad Extrema', 'Alcanza 2x de dificultad', 300);
        }
        
        if (this.difficultyMultiplier >= 3.0 && !this.unlocked.includes('difficulty3x')) {
            this.unlockAchievement('difficulty3x', 'Dificultad Legendaria', 'Alcanza 3x de dificultad', 500);
        }
        
        // Logros de precisión
        if (this.shotsFired > 0) {
            const accuracy = this.shotsHit / this.shotsFired;
            if (accuracy >= 0.8 && !this.unlocked.includes('accuracy80')) {
                this.unlockAchievement('accuracy80', 'Tirador Preciso', 'Alcanza 80% de precisión', 200);
            }
            if (accuracy >= 0.9 && !this.unlocked.includes('accuracy90')) {
                this.unlockAchievement('accuracy90', 'Tirador Perfecto', 'Alcanza 90% de precisión', 400);
            }
        }
        
        // Logros de daño
        if (this.totalDamageDealt >= 1000 && !this.unlocked.includes('damage1000')) {
            this.unlockAchievement('damage1000', 'Daño Masivo', 'Inflige 1000 puntos de daño', 200);
        }
        
        if (this.totalDamageDealt >= 5000 && !this.unlocked.includes('damage5000')) {
            this.unlockAchievement('damage5000', 'Destructor Total', 'Inflige 5000 puntos de daño', 400);
        }
    }

    unlockAchievement(achievement) {
        if (!this.isAchievementUnlocked(achievement.name)) {
            this.notifications.push({
                type: 'achievement',
                message: achievement.name,
                description: achievement.description
            });
            console.log(`¡Logro desbloqueado: ${achievement.name}!`);
        }
    }

    isAchievementUnlocked(name) {
        return this.achievements.some(achievement => achievement.name === name);
    }

    drawNotifications(ctx) {
        this.notifications.forEach((notification, index) => {
            const y = 20 + index * 30;
            ctx.fillStyle = '#fff';
            ctx.font = '18px Arial';
            ctx.textAlign = 'left';
            ctx.fillText(notification.message, 10, y);
            ctx.font = '14px Arial';
            ctx.fillText(notification.description, 10, y + 20);
            ctx.fillStyle = '#000';
            ctx.fillRect(0, y - 5, ctx.canvas.width, 30);
            ctx.fillStyle = '#fff';
        });
        this.notifications = this.notifications.filter(n => n.time > 0); // Eliminar notificaciones viejas
    }
}

// Enhanced Boss System with Special Attacks
class Boss {
    constructor(type, level) {
        this.type = type;
        this.level = level;
        this.phase = 1;
        this.maxPhases = 3;
        this.health = this.getMaxHealth();
        this.maxHealth = this.health;
        this.x = 400;
        this.y = -100;
        this.targetY = 100;
        this.width = 120;
        this.height = 120;
        this.speed = 2;
        this.attackTimer = 0;
        this.attackInterval = 1000;
        this.bulletTimer = 0;
        this.bulletInterval = 500;
        this.movementPattern = 0;
        this.movementTimer = 0;
        this.specialAttackTimer = 0;
        this.specialAttackInterval = 5000;
        this.isFlashing = false;
        this.flashTimer = 0;
        this.bullets = [];
        this.bulletsPerWave = 3;
        
        this.setupBossType();
    }
    
    setupBossType() {
        switch (this.type) {
            case 'destroyer':
                this.name = 'Destructor Omega';
                this.color = '#ff0000';
                this.secondaryColor = '#ff6666';
                this.attackPattern = 'spiral';
                this.specialAbility = 'laserBeam';
                break;
            case 'phantom':
                this.name = 'Fantasma Espectral';
                this.color = '#8000ff';
                this.secondaryColor = '#c080ff';
                this.attackPattern = 'teleport';
                this.specialAbility = 'shadowClones';
                break;
            case 'titan':
                this.name = 'Titán Colosal';
                this.color = '#ff8000';
                this.secondaryColor = '#ffb366';
                this.attackPattern = 'wave';
                this.specialAbility = 'earthquake';
                break;
            case 'cyber':
                this.name = 'Cíber Dominador';
                this.color = '#00ffff';
                this.secondaryColor = '#80ffff';
                this.attackPattern = 'grid';
                this.specialAbility = 'virusSpread';
                break;
        }
    }
    
    getMaxHealth() {
        const baseHealth = {
            'destroyer': 50,
            'phantom': 40,
            'titan': 80,
            'cyber': 60
        };
        return (baseHealth[this.type] || 50) * this.level;
    }
    
    update(deltaTime, player, playerBullets) {
        // Movimiento de entrada
        if (this.y < this.targetY) {
            this.y += this.speed;
        }
        
        // Patrones de movimiento
        this.updateMovement(deltaTime);
        
        // Ataques
        this.updateAttacks(deltaTime, player);
        
        // Colisiones con balas del jugador
        this.checkBulletCollisions(playerBullets);
        
        // Cambio de fase
        this.checkPhaseChange();
        
        // Actualizar balas del jefe
        this.bullets.forEach((bullet, index) => {
            bullet.update(deltaTime);
            if (bullet.life <= 0 || bullet.y > 600 || bullet.y < 0 || bullet.x < 0 || bullet.x > 800) {
                this.bullets.splice(index, 1);
            }
        });
        
        // Efecto de parpadeo
        if (this.isFlashing) {
            this.flashTimer += deltaTime;
            if (this.flashTimer > 200) {
                this.isFlashing = false;
                this.flashTimer = 0;
            }
        }
    }
    
    updateMovement(deltaTime) {
        this.movementTimer += deltaTime;
        
        switch (this.attackPattern) {
            case 'spiral':
                if (this.movementTimer > 2000) {
                    this.movementPattern = (this.movementPattern + 1) % 4;
                    this.movementTimer = 0;
                }
                this.updateSpiralMovement();
                break;
            case 'teleport':
                if (this.movementTimer > 3000) {
                    this.teleport();
                    this.movementTimer = 0;
                }
                break;
            case 'wave':
                this.updateWaveMovement(deltaTime);
                break;
            case 'grid':
                if (this.movementTimer > 2500) {
                    this.moveToGridPosition();
                    this.movementTimer = 0;
                }
                break;
        }
    }
    
    updateSpiralMovement() {
        const centerX = 400;
        const centerY = 100;
        const radius = 100;
        const angle = (this.movementPattern * Math.PI) / 2;
        
        this.x = centerX + Math.cos(angle) * radius;
        this.y = centerY + Math.sin(angle) * radius;
    }
    
    teleport() {
        this.x = Math.random() * (800 - this.width);
        this.y = Math.random() * 200 + 50;
    }
    
    updateWaveMovement(deltaTime) {
        this.x = 400 + Math.sin(this.movementTimer * 0.001) * 150;
    }
    
    moveToGridPosition() {
        const gridPositions = [
            {x: 100, y: 100}, {x: 400, y: 100}, {x: 700, y: 100},
            {x: 100, y: 200}, {x: 400, y: 200}, {x: 700, y: 200}
        ];
        const target = gridPositions[Math.floor(Math.random() * gridPositions.length)];
        this.x = target.x;
        this.y = target.y;
    }
    
    updateAttacks(deltaTime, player) {
        this.attackTimer += deltaTime;
        this.bulletTimer += deltaTime;
        this.specialAttackTimer += deltaTime;
        
        // Ataque básico
        if (this.attackTimer > this.attackInterval) {
            this.basicAttack(player);
            this.attackTimer = 0;
        }
        
        // Disparos continuos
        if (this.bulletTimer > this.bulletInterval) {
            this.continuousAttack(player);
            this.bulletTimer = 0;
        }
        
        // Ataque especial
        if (this.specialAttackTimer > this.specialAttackInterval) {
            this.specialAttack(player);
            this.specialAttackTimer = 0;
        }
    }
    
    basicAttack(player) {
        if (!player) return;
        
        const angle = Math.atan2(player.y - this.y, player.x - this.x);
        const bullet = new BossBullet(
            this.x + this.width / 2,
            this.y + this.height,
            Math.cos(angle) * 3,
            Math.sin(angle) * 3,
            'normal'
        );
        this.bullets.push(bullet);
    }
    
    continuousAttack(player) {
        switch (this.attackPattern) {
            case 'spiral':
                this.createSpiralBullets();
                break;
            case 'teleport':
                this.createTeleportBullets();
                break;
            case 'wave':
                this.createWaveBullets();
                break;
            case 'grid':
                this.createGridBullets();
                break;
        }
    }
    
    createSpiralBullets() {
        for (let i = 0; i < 8; i++) {
            const angle = (i * Math.PI) / 4;
            const bullet = new BossBullet(
                this.x + this.width / 2,
                this.y + this.height,
                Math.cos(angle) * 2,
                Math.sin(angle) * 2,
                'spiral'
            );
            this.bullets.push(bullet);
        }
    }
    
    createTeleportBullets() {
        for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3;
            const bullet = new BossBullet(
                this.x + this.width / 2,
                this.y + this.height,
                Math.cos(angle) * 2.5,
                Math.sin(angle) * 2.5,
                'teleport'
            );
            this.bullets.push(bullet);
        }
    }
    
    createWaveBullets() {
        for (let i = 0; i < 5; i++) {
            const bullet = new BossBullet(
                this.x + this.width / 2,
                this.y + this.height,
                (i - 2) * 1.5,
                3,
                'wave'
            );
            this.bullets.push(bullet);
        }
    }
    
    createGridBullets() {
        for (let i = 0; i < 4; i++) {
            const bullet = new BossBullet(
                this.x + this.width / 2,
                this.y + this.height,
                (i - 1.5) * 2,
                2.5,
                'grid'
            );
            this.bullets.push(bullet);
        }
    }
    
    specialAttack(player) {
        if (!player) return;
        
        switch (this.specialAbility) {
            case 'laserBeam':
                this.laserBeamAttack();
                break;
            case 'shadowClones':
                this.shadowClonesAttack();
                break;
            case 'earthquake':
                this.earthquakeAttack();
                break;
            case 'virusSpread':
                this.virusSpreadAttack();
                break;
        }
    }
    
    laserBeamAttack() {
        const laserBeam = new LaserBeam(this.x + this.width / 2, this.y);
        game.laserBeams.push(laserBeam);
    }
    
    shadowClonesAttack() {
        for (let i = 0; i < 3; i++) {
            const clone = new BossClone(
                this.x + (i - 1) * 100,
                this.y + 50,
                this.type,
                this.level
            );
            game.bossClones.push(clone);
        }
    }
    
    earthquakeAttack() {
        const earthquake = new EarthquakeWave(this.x + this.width / 2, this.y + this.height);
        game.earthquakeWaves.push(earthquake);
    }
    
    virusSpreadAttack() {
        for (let i = 0; i < 5; i++) {
            const angle = (i * Math.PI) / 2.5;
            const bullet = new VirusBullet(
                this.x + this.width / 2,
                this.y + this.height,
                angle
            );
            game.bossBullets.push(bullet);
        }
    }
    
    checkBulletCollisions(bullets) {
        bullets.forEach(bullet => {
            if (this.checkCollision(bullet, this)) {
                this.takeDamage(bullet.damage || 1);
                bullet.life = 0;
            }
        });
    }
    
    checkCollision(obj1, obj2) {
        return obj1.x < obj2.x + obj2.width &&
               obj1.x + obj1.width > obj2.x &&
               obj1.y < obj2.y + obj2.height &&
               obj1.y + obj1.height > obj2.y;
    }
    
    takeDamage(damage) {
        this.health -= damage;
        this.isFlashing = true;
        this.flashTimer = 0;
        
        // Efecto de partículas
        if (game.particleSystem) {
            game.particleSystem.addEmitter(this.x + this.width / 2, this.y + this.height / 2, 'explosion', 15);
        }
        
        if (this.health <= 0) {
            this.die();
        }
    }
    
    checkPhaseChange() {
        const healthPercentage = this.health / this.maxHealth;
        
        if (healthPercentage <= 0.66 && this.phase === 1) {
            this.changePhase(2);
        } else if (healthPercentage <= 0.33 && this.phase === 2) {
            this.changePhase(3);
        }
    }
    
    changePhase(newPhase) {
        this.phase = newPhase;
        this.attackInterval = Math.max(200, this.attackInterval - 200);
        this.bulletInterval = Math.max(100, this.bulletInterval - 100);
        this.specialAttackInterval = Math.max(1000, this.specialAttackInterval - 1000);
        
        // Efecto visual de cambio de fase
        this.phaseChangeEffect();
        
        // Sonido de cambio de fase
        if (game.audioManager) {
            game.audioManager.playSound('levelup', 0.8);
        }
    }
    
    phaseChangeEffect() {
        // Crear explosión de partículas
        if (game.particleSystem) {
            game.particleSystem.addEmitter(this.x + this.width / 2, this.y + this.height / 2, 'explosion', 30);
        }
    }
    
    die() {
        this.isDead = true;
        
        // Efecto de muerte
        this.createDeathEffect();
        
        // Recompensas
        this.giveRewards();
        
        // Power-up especial
        if (Math.random() < 0.3) {
            this.dropSpecialPowerUp();
        }
    }
    
    createDeathEffect() {
        // Explosión masiva
        if (game.particleSystem) {
            game.particleSystem.addEmitter(this.x + this.width / 2, this.y + this.height / 2, 'explosion', 50);
        }
        
        // Sonido de muerte
        if (game.audioManager) {
            game.audioManager.playSound('explosion', 1.0);
        }
    }
    
    giveRewards() {
        game.score += this.level * 1000;
        game.achievementSystem.incrementStat('totalBossesDefeated');
    }
    
    dropSpecialPowerUp() {
        const powerUp = new SpecialPowerUp(
            this.x + this.width / 2,
            this.y + this.height,
            'boss'
        );
        game.powerUps.push(powerUp);
    }
    
    draw(ctx) {
        if (this.isFlashing && this.flashTimer < 100) {
            ctx.globalAlpha = 0.5;
        }
        
        switch (this.type) {
            case 'destroyer':
                this.drawDestroyer(ctx);
                break;
            case 'phantom':
                this.drawPhantom(ctx);
                break;
            case 'titan':
                this.drawTitan(ctx);
                break;
            case 'cyber':
                this.drawCyber(ctx);
                break;
        }
        
        // Dibujar balas del jefe
        this.bullets.forEach(bullet => bullet.draw(ctx));
        
        // Dibujar barra de vida
        this.drawHealthBar(ctx);
        
        // Dibujar nombre del jefe
        this.drawBossName(ctx);
        
        ctx.globalAlpha = 1;
    }
    
    drawDestroyer(ctx) {
        // Cuerpo principal
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Detalles
        ctx.fillStyle = this.secondaryColor;
        ctx.fillRect(this.x + 10, this.y + 10, this.width - 20, this.height - 20);
        
        // Cañones
        ctx.fillStyle = '#000000';
        ctx.fillRect(this.x + 20, this.y - 10, 10, 20);
        ctx.fillRect(this.x + this.width - 30, this.y - 10, 10, 20);
    }
    
    drawPhantom(ctx) {
        // Cuerpo fantasma
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Aura
        ctx.strokeStyle = this.secondaryColor;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2 + 10, 0, Math.PI * 2);
        ctx.stroke();
    }
    
    drawTitan(ctx) {
        // Cuerpo masivo
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Escudo
        ctx.strokeStyle = this.secondaryColor;
        ctx.lineWidth = 5;
        ctx.strokeRect(this.x - 5, this.y - 5, this.width + 10, this.height + 10);
        
        // Placas de armadura
        ctx.fillStyle = this.secondaryColor;
        ctx.fillRect(this.x + 15, this.y + 15, 20, 20);
        ctx.fillRect(this.x + this.width - 35, this.y + 15, 20, 20);
    }
    
    drawCyber(ctx) {
        // Cuerpo cibernético
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Circuitos
        ctx.strokeStyle = this.secondaryColor;
        ctx.lineWidth = 2;
        for (let i = 0; i < 5; i++) {
            ctx.beginPath();
            ctx.moveTo(this.x + 10, this.y + 15 + i * 20);
            ctx.lineTo(this.x + this.width - 10, this.y + 15 + i * 20);
            ctx.stroke();
        }
    }
    
    drawHealthBar(ctx) {
        const barWidth = 120;
        const barHeight = 10;
        const barX = this.x + (this.width - barWidth) / 2;
        const barY = this.y - 20;
        
        // Fondo
        ctx.fillStyle = '#333333';
        ctx.fillRect(barX, barY, barWidth, barHeight);
        
        // Vida
        const healthPercentage = this.health / this.maxHealth;
        ctx.fillStyle = healthPercentage > 0.5 ? '#00ff00' : healthPercentage > 0.25 ? '#ffff00' : '#ff0000';
        ctx.fillRect(barX, barY, barWidth * healthPercentage, barHeight);
        
        // Borde
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.strokeRect(barX, barY, barWidth, barHeight);
    }
    
    drawBossName(ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(this.name, this.x + this.width / 2, this.y - 30);
        ctx.fillText(`Fase ${this.phase}`, this.x + this.width / 2, this.y - 10);
    }
    
    getTypeName() {
        const names = {
            'destroyer': 'Destructor',
            'phantom': 'Fantasma',
            'titan': 'Titan',
            'cyber': 'Cyber'
        };
        return names[this.type] || 'Jefe Desconocido';
    }
}

// Special Effects
class LaserBeam {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 600;
        this.life = 2000;
        this.maxLife = this.life;
        this.damage = 5;
        this.isDead = false;
    }
    
    update(deltaTime) {
        this.life -= deltaTime;
        if (this.life <= 0) {
            this.isDead = true;
        }
    }
    
    draw(ctx) {
        const alpha = this.life / this.maxLife;
        
        ctx.save();
        ctx.globalAlpha = alpha;
        
        // Láser principal
        const gradient = ctx.createLinearGradient(this.x, 0, this.x + this.width, 0);
        gradient.addColorStop(0, '#ff0000');
        gradient.addColorStop(0.5, '#ffffff');
        gradient.addColorStop(1, '#ff0000');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(this.x, 0, this.width, this.height);
        
        // Aura del láser
        ctx.strokeStyle = '#ff6666';
        ctx.lineWidth = 3;
        ctx.globalAlpha = alpha * 0.5;
        ctx.strokeRect(this.x - 2, 0, this.width + 4, this.height);
        
        ctx.restore();
    }
}

class EarthquakeWave {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 0;
        this.maxRadius = 300;
        this.speed = 5;
        this.life = 1000;
        this.maxLife = this.life;
        this.isDead = false;
        this.damage = 3;
    }
    
    update(deltaTime) {
        this.radius += this.speed;
        this.life -= deltaTime;
        
        if (this.radius >= this.maxRadius || this.life <= 0) {
            this.isDead = true;
        }
    }
    
    draw(ctx) {
        const alpha = this.life / this.maxLife;
        
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = '#ff8000';
        ctx.lineWidth = 3;
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.restore();
    }
}

class BossBullet {
    constructor(x, y, vx, vy, type = 'normal') {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.type = type;
        this.width = 8;
        this.height = 8;
        this.life = 5000;
        this.maxLife = this.life;
        this.damage = 1;
        this.isDead = false;
    }
    
    update(deltaTime) {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= deltaTime;
        
        if (this.life <= 0) {
            this.isDead = true;
        }
    }
    
    draw(ctx) {
        const alpha = this.life / this.maxLife;
        ctx.globalAlpha = alpha;
        
        ctx.fillStyle = this.getColor();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.width / 2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.globalAlpha = 1;
    }
    
    getColor() {
        const colors = {
            'normal': '#ff0000',
            'spiral': '#ff6600',
            'teleport': '#8000ff',
            'wave': '#ff0080',
            'grid': '#00ffff'
        };
        return colors[this.type] || '#ff0000';
    }
}

class VirusBullet extends BossBullet {
    constructor(x, y, direction) {
        super(x, y, Math.cos(direction) * 2, Math.sin(direction) * 2, 'virus');
        this.direction = direction;
        this.splitCount = 0;
        this.maxSplits = 2;
        this.splitTimer = 0;
        this.splitInterval = 1000;
    }
    
    update(deltaTime) {
        super.update(deltaTime);
        
        this.splitTimer += deltaTime;
        
        if (this.splitTimer > this.splitInterval && this.splitCount < this.maxSplits) {
            this.split();
            this.splitTimer = 0;
        }
    }
    
    split() {
        for (let i = 0; i < 2; i++) {
            const newDirection = this.direction + (Math.PI / 4) * (i === 0 ? 1 : -1);
            const virus = new VirusBullet(this.x, this.y, newDirection);
            virus.splitCount = this.splitCount + 1;
            game.bossBullets.push(virus);
        }
    }
    
    draw(ctx) {
        ctx.save();
        
        // Cuerpo del virus
        ctx.fillStyle = '#00ff00';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.width/2, 0, Math.PI * 2);
        ctx.fill();
        
        // Picos del virus
        ctx.strokeStyle = '#008000';
        ctx.lineWidth = 2;
        for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3;
            const spikeX = this.x + Math.cos(angle) * (this.width/2 + 5);
            const spikeY = this.y + Math.sin(angle) * (this.height/2 + 5);
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(spikeX, spikeY);
            ctx.stroke();
        }
        
        ctx.restore();
    }
}

// Boss Clone class (for the final boss)
class BossClone {
    constructor(x, y, type, level) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.level = level;
        this.health = 100 + level * 20;
        this.maxHealth = this.health;
        this.name = this.getTypeName();
        this.isDead = false;
        this.shootTimer = 0;
        this.shootInterval = 1000;
        this.bullets = [];
        this.bulletsPerWave = 5 + level * 2;
        this.currentWave = 0;
        this.waveInterval = 2000;
        this.isBoss = true;
        this.isFlashing = false;
        
        // Dimensiones
        this.width = 80;
        this.height = 60;
    }

    update(deltaTime) {
        if (this.isDead) return;

        this.shootTimer += deltaTime;
        if (this.shootTimer > this.shootInterval) {
            this.shoot();
            this.shootTimer = 0;
        }

        // Actualizar balas del jefe
        this.bullets.forEach((bullet, index) => {
            bullet.update(deltaTime);
            if (bullet.life <= 0 || bullet.y > 600 || bullet.y < 0 || bullet.x < 0 || bullet.x > 800) {
                this.bullets.splice(index, 1);
            }
        });

        // Avanzar de fase
        if (this.bullets.length === 0 && this.currentWave === 0) {
            this.phase = 2;
            this.shootInterval = 500;
            this.waveInterval = 1000;
            this.bulletsPerWave = 10 + this.level * 3;
            this.health = this.maxHealth * 1.5;
            this.currentWave = 1;
        } else if (this.bullets.length === 0 && this.currentWave === 1) {
            this.phase = 3;
            this.shootInterval = 300;
            this.waveInterval = 800;
            this.bulletsPerWave = 15 + this.level * 4;
            this.health = this.maxHealth * 2;
            this.currentWave = 2;
        }

        // Mover el jefe
        if (this.type === 'destroyer') {
            this.y += 0.5;
        } else if (this.type === 'phantom') {
            this.y += 0.8;
        } else if (this.type === 'titan') {
            this.y += 0.3;
        } else if (this.type === 'cyber') {
            this.y += 1.0;
        }

        // Verificar colisiones con el jugador
        // This part needs to be implemented based on how the final boss interacts with the player
        // For now, it's a placeholder
        // if (player && this.checkCollision(player, this)) {
        //     this.isDead = true;
        //     return;
        // }

        // Verificar colisiones con balas del jugador
        // This part needs to be implemented based on how the final boss interacts with player bullets
        // For now, it's a placeholder
        // playerBullets.forEach(bullet => {
        //     if (this.checkCollision(bullet, this)) {
        //         this.health -= bullet.damage;
        //         this.isFlashing = true;
        //         setTimeout(() => {
        //             this.isFlashing = false;
        //         }, 200);
        //         bullet.life = 0; // Destruir la bala
        //     }
        // });

        // Verificar si el jefe está muerto
        if (this.health <= 0) {
            this.isDead = true;
            return;
        }
    }

    shoot() {
        if (this.bullets.length >= this.bulletsPerWave) return;

        const bulletType = this.type === 'destroyer' ? 'laser' : 'normal';
        const bullet = new BossBullet(this.x + this.width / 2, this.y + this.height, 0, 2, bulletType);
        
        if (window.game && window.game.enemyBullets) {
            window.game.enemyBullets.push(bullet);
        }
    }

    draw(ctx) {
        ctx.fillStyle = '#ff0000'; // Color rojo para los jefes
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 2, this.y);
        ctx.lineTo(this.x, this.y + this.height);
        ctx.lineTo(this.x + this.width, this.y + this.height);
        ctx.closePath();
        ctx.fill();

        // Dibujar escudo si el jefe tiene uno
        if (this.type === 'titan' || this.type === 'cyber') {
            ctx.fillStyle = '#00ff00'; // Verde para el escudo
            ctx.beginPath();
            ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, 0, Math.PI * 2);
            ctx.fill();
        }

        // Dibujar balas del jefe
        this.bullets.forEach(bullet => bullet.draw(ctx));
    }

    checkCollision(obj1, obj2) {
        return obj1.x < obj2.x + obj2.width &&
               obj1.x + obj1.width > obj2.x &&
               obj1.y < obj2.y + obj2.height &&
               obj1.y + obj1.height > obj2.y;
    }

    getTypeName() {
        const names = {
            'destroyer': 'Destructor',
            'phantom': 'Fantasma',
            'titan': 'Titan',
            'cyber': 'Cyber'
        };
        return names[this.type] || 'Jefe Desconocido';
    }
}

// Special Effects (e.g., flashing, damage indicator)
class SpecialEffect {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.isDead = false;
        this.life = 100; // Duración del efecto
        this.maxLife = 100;
        this.width = 10;
        this.height = 10;

        if (type === 'flashing') {
            this.color = '#ff0000'; // Rojo para el efecto de parpadeo
        } else if (type === 'damage') {
            this.color = '#ff0000'; // Rojo para el efecto de daño
        }
    }

    update(deltaTime) {
        this.life -= 2;
        if (this.life <= 0) {
            this.isDead = true;
        }
    }

    draw(ctx) {
        const alpha = this.life / this.maxLife;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - 5, this.y - 5, 10, 10); // Un pequeño rectángulo para el efecto
        ctx.globalAlpha = 1;
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.game = new SpaceDefender();
});