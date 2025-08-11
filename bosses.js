// Space Defender - Sistema de Jefes de Nivel
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
    
    update(deltaTime, player, bullets) {
        // Movimiento de entrada
        if (this.y < this.targetY) {
            this.y += this.speed;
        }
        
        // Patrones de movimiento
        this.updateMovement(deltaTime);
        
        // Ataques
        this.updateAttacks(deltaTime, player);
        
        // Colisiones con balas del jugador
        this.checkBulletCollisions(bullets);
        
        // Cambio de fase
        this.checkPhaseChange();
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
                if (this.movementTimer > 1500) {
                    this.teleport();
                    this.movementTimer = 0;
                }
                break;
            case 'wave':
                this.updateWaveMovement(deltaTime);
                break;
            case 'grid':
                if (this.movementTimer > 3000) {
                    this.moveToGridPosition();
                    this.movementTimer = 0;
                }
                break;
        }
    }
    
    updateSpiralMovement() {
        const centerX = 400;
        const centerY = 150;
        const radius = 100;
        const angle = (this.movementPattern * Math.PI) / 2;
        
        this.x = centerX + Math.cos(angle) * radius;
        this.y = centerY + Math.sin(angle) * radius;
    }
    
    teleport() {
        this.x = Math.random() * (800 - this.width);
        this.y = Math.random() * (300 - this.height) + 50;
    }
    
    updateWaveMovement(deltaTime) {
        const time = Date.now() * 0.001;
        this.x = 400 + Math.sin(time * 2) * 150;
    }
    
    moveToGridPosition() {
        const gridPositions = [
            {x: 200, y: 100}, {x: 400, y: 100}, {x: 600, y: 100},
            {x: 200, y: 200}, {x: 400, y: 200}, {x: 600, y: 200}
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
        // Crear balas en patrón específico
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
            const angle = (i * Math.PI * 2) / 8;
            const speed = 3;
            const bullet = new BossBullet(
                this.x + this.width / 2,
                this.y + this.height / 2,
                Math.cos(angle) * speed,
                Math.sin(angle) * speed,
                'spiral'
            );
            game.bossBullets.push(bullet);
        }
    }
    
    createTeleportBullets() {
        for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI * 2) / 6;
            const speed = 4;
            const bullet = new BossBullet(
                this.x + this.width / 2,
                this.y + this.height / 2,
                Math.cos(angle) * speed,
                Math.sin(angle) * speed,
                'teleport'
            );
            game.bossBullets.push(bullet);
        }
    }
    
    createWaveBullets() {
        for (let i = 0; i < 5; i++) {
            const x = this.x + (i * this.width / 4);
            const bullet = new BossBullet(x, this.y + this.height, 0, 4, 'wave');
            game.bossBullets.push(bullet);
        }
    }
    
    createGridBullets() {
        const positions = [200, 400, 600];
        positions.forEach(x => {
            const bullet = new BossBullet(x, this.y + this.height, 0, 3, 'grid');
            game.bossBullets.push(bullet);
        });
    }
    
    continuousAttack(player) {
        // Disparos continuos hacia el jugador
        if (player) {
            const dx = player.x - this.x;
            const dy = player.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 0) {
                const speed = 3;
                const bullet = new BossBullet(
                    this.x + this.width / 2,
                    this.y + this.height / 2,
                    (dx / distance) * speed,
                    (dy / distance) * speed,
                    'tracking'
                );
                game.bossBullets.push(bullet);
            }
        }
    }
    
    specialAttack(player) {
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
        // Crear un rayo láser devastador
        const laser = new LaserBeam(this.x + this.width / 2, this.y + this.height);
        game.specialEffects.push(laser);
    }
    
    shadowClonesAttack() {
        // Crear clones del jefe
        for (let i = 0; i < 3; i++) {
            const clone = new BossClone(this.x + Math.random() * 100, this.y + Math.random() * 100, this);
            game.bossClones.push(clone);
        }
    }
    
    earthquakeAttack() {
        // Crear ondas sísmicas
        for (let i = 0; i < 5; i++) {
            const wave = new EarthquakeWave(this.x + this.width / 2, this.y + this.height);
            game.specialEffects.push(wave);
        }
    }
    
    virusSpreadAttack() {
        // Disparar virus que se multiplican
        for (let i = 0; i < 4; i++) {
            const virus = new VirusBullet(this.x + this.width / 2, this.y + this.height, i * Math.PI / 2);
            game.bossBullets.push(virus);
        }
    }
    
    checkBulletCollisions(bullets) {
        bullets.forEach((bullet, index) => {
            if (this.checkCollision(bullet, this)) {
                bullets.splice(index, 1);
                this.takeDamage(bullet.damage);
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
        
        // Efecto visual de daño
        this.flashRed();
        
        // Sonido de daño
        if (game.audioManager) {
            game.audioManager.playSound('hit', 0.8);
        }
        
        if (this.health <= 0) {
            this.die();
        }
    }
    
    flashRed() {
        this.isFlashing = true;
        setTimeout(() => {
            this.isFlashing = false;
        }, 100);
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
        this.attackInterval = Math.max(200, this.attackInterval * 0.7);
        this.bulletInterval = Math.max(200, this.bulletInterval * 0.8);
        
        // Efecto visual de cambio de fase
        this.phaseChangeEffect();
        
        // Sonido de cambio de fase
        if (game.audioManager) {
            game.audioManager.playSound('levelup', 1.0);
        }
    }
    
    phaseChangeEffect() {
        // Crear partículas de cambio de fase
        for (let i = 0; i < 20; i++) {
            const particle = new Particle(
                this.x + this.width / 2,
                this.y + this.height / 2,
                'phasechange'
            );
            game.particles.push(particle);
        }
    }
    
    die() {
        // Efecto de muerte épico
        this.createDeathEffect();
        
        // Recompensas
        this.giveRewards();
        
        // Marcar como derrotado
        this.isDead = true;
    }
    
    createDeathEffect() {
        // Explosión masiva
        for (let i = 0; i < 50; i++) {
            const particle = new Particle(
                this.x + this.width / 2,
                this.y + this.height / 2,
                'bossdeath'
            );
            game.particles.push(particle);
        }
        
        // Sonido de explosión
        if (game.audioManager) {
            game.audioManager.playSound('explosion', 1.0);
        }
    }
    
    giveRewards() {
        // Puntos extra por derrotar al jefe
        game.score += this.level * 1000;
        
        // Power-up especial
        this.dropSpecialPowerUp();
    }
    
    dropSpecialPowerUp() {
        const powerUp = new SpecialPowerUp(
            this.x + this.width / 2,
            this.y + this.height / 2,
            'boss'
        );
        game.powerUps.push(powerUp);
    }
    
    draw(ctx) {
        if (this.isFlashing) {
            ctx.fillStyle = '#ffffff';
        } else {
            ctx.fillStyle = this.color;
        }
        
        // Dibujar jefe según su tipo
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
        
        // Barra de vida
        this.drawHealthBar(ctx);
        
        // Nombre del jefe
        this.drawBossName(ctx);
    }
    
    drawDestroyer(ctx) {
        // Cuerpo principal
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Detalles
        ctx.fillStyle = this.secondaryColor;
        ctx.fillRect(this.x + 20, this.y + 20, this.width - 40, this.height - 40);
        
        // Cañones
        ctx.fillStyle = '#000000';
        ctx.fillRect(this.x + 10, this.y - 20, 20, 20);
        ctx.fillRect(this.x + this.width - 30, this.y - 20, 20, 20);
    }
    
    drawPhantom(ctx) {
        // Cuerpo fantasmagórico
        ctx.fillStyle = this.color;
        ctx.globalAlpha = 0.8;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.globalAlpha = 1.0;
        
        // Aura
        ctx.strokeStyle = this.secondaryColor;
        ctx.lineWidth = 3;
        ctx.strokeRect(this.x - 5, this.y - 5, this.width + 10, this.height + 10);
    }
    
    drawTitan(ctx) {
        // Cuerpo masivo
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Armadura
        ctx.fillStyle = this.secondaryColor;
        ctx.fillRect(this.x + 15, this.y + 15, this.width - 30, this.height - 30);
        
        // Escudo
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = 5;
        ctx.strokeRect(this.x - 10, this.y - 10, this.width + 20, this.height + 20);
    }
    
    drawCyber(ctx) {
        // Cuerpo cibernético
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Circuitos
        ctx.strokeStyle = this.secondaryColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y + this.height / 2);
        ctx.lineTo(this.x + this.width, this.y + this.height / 2);
        ctx.moveTo(this.x + this.width / 2, this.y);
        ctx.lineTo(this.x + this.width / 2, this.y + this.height);
        ctx.stroke();
    }
    
    drawHealthBar(ctx) {
        const barWidth = 200;
        const barHeight = 20;
        const barX = this.x + (this.width - barWidth) / 2;
        const barY = this.y - 40;
        
        // Fondo
        ctx.fillStyle = '#333333';
        ctx.fillRect(barX, barY, barWidth, barHeight);
        
        // Vida
        const healthPercentage = this.health / this.maxHealth;
        ctx.fillStyle = healthPercentage > 0.5 ? '#00ff00' : healthPercentage > 0.25 ? '#ffff00' : '#ff0000';
        ctx.fillRect(barX, barY, barWidth * healthPercentage, barHeight);
        
        // Borde
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.strokeRect(barX, barY, barWidth, barHeight);
    }
    
    drawBossName(ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px Orbitron';
        ctx.textAlign = 'center';
        ctx.fillText(this.name, this.x + this.width / 2, this.y - 50);
        ctx.fillText(`Fase ${this.phase}`, this.x + this.width / 2, this.y - 30);
    }
}

// Clases auxiliares para ataques especiales
class BossBullet {
    constructor(x, y, vx, vy, type) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.type = type;
        this.width = 8;
        this.height = 8;
        this.damage = 2;
        this.life = 100;
        this.maxLife = 100;
    }
    
    update(deltaTime) {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= 1;
    }
    
    draw(ctx) {
        ctx.fillStyle = this.getColor();
        ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
    }
    
    getColor() {
        const colors = {
            'spiral': '#ff0000',
            'teleport': '#8000ff',
            'wave': '#ff8000',
            'grid': '#00ffff',
            'tracking': '#ff0080'
        };
        return colors[this.type] || '#ff0000';
    }
}

// Exportar para uso global
window.Boss = Boss;
window.BossBullet = BossBullet;