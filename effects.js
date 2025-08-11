// Space Defender - Sistema de Efectos Visuales Avanzados
class ParticleSystem {
    constructor() {
        this.particles = [];
        this.emitters = [];
        this.maxParticles = 1000;
    }
    
    addEmitter(x, y, type, count = 10) {
        const emitter = new ParticleEmitter(x, y, type, count);
        this.emitters.push(emitter);
    }
    
    update(deltaTime) {
        // Actualizar emisores
        this.emitters.forEach((emitter, index) => {
            emitter.update(deltaTime);
            if (emitter.isDead) {
                this.emitters.splice(index, 1);
            }
        });
        
        // Actualizar partículas
        this.particles.forEach((particle, index) => {
            particle.update(deltaTime);
            if (particle.isDead) {
                this.particles.splice(index, 1);
            }
        });
        
        // Limpiar partículas excesivas
        if (this.particles.length > this.maxParticles) {
            this.particles.splice(0, this.particles.length - this.maxParticles);
        }
    }
    
    draw(ctx) {
        // Ordenar partículas por profundidad (Z-order)
        this.particles.sort((a, b) => a.z - b.z);
        
        this.particles.forEach(particle => {
            particle.draw(ctx);
        });
    }
}

class ParticleEmitter {
    constructor(x, y, type, count) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.count = count;
        this.emitted = 0;
        this.emissionRate = 50; // partículas por segundo
        this.emissionTimer = 0;
        this.isDead = false;
        
        this.setupEmitterType();
    }
    
    setupEmitterType() {
        switch (this.type) {
            case 'explosion':
                this.life = 1000;
                this.emissionRate = 100;
                break;
            case 'engine':
                this.life = -1; // Infinito
                this.emissionRate = 20;
                break;
            case 'laser':
                this.life = 500;
                this.emissionRate = 200;
                break;
            case 'powerup':
                this.life = 800;
                this.emissionRate = 30;
                break;
            case 'bossdeath':
                this.life = 2000;
                this.emissionRate = 150;
                break;
        }
    }
    
    update(deltaTime) {
        this.emissionTimer += deltaTime;
        
        // Emitir partículas
        if (this.emissionTimer > (1000 / this.emissionRate)) {
            this.emitParticle();
            this.emissionTimer = 0;
            this.emitted++;
        }
        
        // Verificar si debe morir
        if (this.life > 0) {
            this.life -= deltaTime;
            if (this.life <= 0) {
                this.isDead = true;
            }
        }
        
        // Verificar límite de partículas
        if (this.emitted >= this.count) {
            this.isDead = true;
        }
    }
    
    emitParticle() {
        const particle = new Particle(this.x, this.y, this.type);
        game.particleSystem.particles.push(particle);
    }
}

class Particle {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.vx = (Math.random() - 0.5) * 4;
        this.vy = (Math.random() - 0.5) * 4;
        this.vz = (Math.random() - 0.5) * 2;
        this.z = Math.random() * 100;
        this.life = 1000 + Math.random() * 1000;
        this.maxLife = this.life;
        this.size = Math.random() * 4 + 2;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.2;
        this.gravity = 0.1;
        this.friction = 0.98;
        this.isDead = false;
        
        this.setupParticleType();
    }
    
    setupParticleType() {
        switch (this.type) {
            case 'explosion':
                this.color = this.getRandomExplosionColor();
                this.gravity = 0.05;
                this.friction = 0.95;
                break;
            case 'engine':
                this.color = '#00ffff';
                this.vx = (Math.random() - 0.5) * 2;
                this.vy = Math.random() * 2 + 1;
                this.life = 500 + Math.random() * 500;
                break;
            case 'laser':
                this.color = '#ff00ff';
                this.vx = (Math.random() - 0.5) * 6;
                this.vy = (Math.random() - 0.5) * 6;
                this.life = 300 + Math.random() * 200;
                break;
            case 'powerup':
                this.color = this.getRandomPowerUpColor();
                this.gravity = -0.02;
                this.friction = 0.99;
                break;
            case 'bossdeath':
                this.color = this.getRandomBossDeathColor();
                this.gravity = 0.03;
                this.friction = 0.97;
                this.size = Math.random() * 8 + 4;
                break;
        }
    }
    
    getRandomExplosionColor() {
        const colors = ['#ff0000', '#ff8000', '#ffff00', '#ff4000', '#ff6000'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    getRandomPowerUpColor() {
        const colors = ['#00ff00', '#0080ff', '#ff00ff', '#ffff00', '#ff8000'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    getRandomBossDeathColor() {
        const colors = ['#ff0000', '#8000ff', '#ff0080', '#ff4000', '#800080'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    update(deltaTime) {
        // Aplicar física
        this.x += this.vx;
        this.y += this.vy;
        this.z += this.vz;
        
        // Aplicar gravedad
        this.vy += this.gravity;
        
        // Aplicar fricción
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.vz *= this.friction;
        
        // Rotación
        this.rotation += this.rotationSpeed;
        
        // Vida
        this.life -= deltaTime;
        if (this.life <= 0) {
            this.isDead = true;
        }
        
        // Efectos de borde
        if (this.x < 0 || this.x > 800 || this.y < 0 || this.y > 600) {
            this.isDead = true;
        }
    }
    
    draw(ctx) {
        const alpha = this.life / this.maxLife;
        const scale = 1 + (this.z / 100);
        
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.scale(scale, scale);
        
        // Dibujar partícula según su tipo
        switch (this.type) {
            case 'explosion':
                this.drawExplosionParticle(ctx);
                break;
            case 'engine':
                this.drawEngineParticle(ctx);
                break;
            case 'laser':
                this.drawLaserParticle(ctx);
                break;
            case 'powerup':
                this.drawPowerUpParticle(ctx);
                break;
            case 'bossdeath':
                this.drawBossDeathParticle(ctx);
                break;
        }
        
        ctx.restore();
    }
    
    drawExplosionParticle(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.size/2, -this.size/2, this.size, this.size);
        
        // Brillo
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = 0.5;
        ctx.fillRect(-this.size/4, -this.size/4, this.size/2, this.size/2);
    }
    
    drawEngineParticle(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(0, 0, this.size/2, 0, Math.PI * 2);
        ctx.fill();
        
        // Aura
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.stroke();
    }
    
    drawLaserParticle(ctx) {
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.size;
        ctx.beginPath();
        ctx.moveTo(-this.size, 0);
        ctx.lineTo(this.size, 0);
        ctx.stroke();
    }
    
    drawPowerUpParticle(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(0, -this.size/2);
        ctx.lineTo(this.size/2, this.size/2);
        ctx.lineTo(-this.size/2, this.size/2);
        ctx.closePath();
        ctx.fill();
    }
    
    drawBossDeathParticle(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(0, 0, this.size/2, 0, Math.PI * 2);
        ctx.fill();
        
        // Efecto de energía
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.6;
        for (let i = 0; i < 4; i++) {
            const angle = (i * Math.PI) / 2;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(angle) * this.size, Math.sin(angle) * this.size);
            ctx.stroke();
        }
    }
}

// Efectos especiales
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

class BossClone {
    constructor(x, y, originalBoss) {
        this.x = x;
        this.y = y;
        this.width = originalBoss.width * 0.7;
        this.height = originalBoss.height * 0.7;
        this.originalBoss = originalBoss;
        this.life = 5000;
        this.maxLife = this.life;
        this.isDead = false;
        this.attackTimer = 0;
        this.attackInterval = 2000;
    }
    
    update(deltaTime) {
        this.life -= deltaTime;
        this.attackTimer += deltaTime;
        
        if (this.life <= 0) {
            this.isDead = true;
        }
        
        // Ataque simple
        if (this.attackTimer > this.attackInterval) {
            this.attack();
            this.attackTimer = 0;
        }
    }
    
    attack() {
        // Crear balas simples
        for (let i = 0; i < 3; i++) {
            const angle = (i * Math.PI * 2) / 3;
            const speed = 2;
            const bullet = new BossBullet(
                this.x + this.width / 2,
                this.y + this.height / 2,
                Math.cos(angle) * speed,
                Math.sin(angle) * speed,
                'clone'
            );
            game.bossBullets.push(bullet);
        }
    }
    
    draw(ctx) {
        const alpha = this.life / this.maxLife;
        
        ctx.save();
        ctx.globalAlpha = alpha * 0.7;
        ctx.fillStyle = this.originalBoss.secondaryColor;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Borde fantasmagórico
        ctx.strokeStyle = this.originalBoss.color;
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        
        ctx.restore();
    }
}

class VirusBullet extends BossBullet {
    constructor(x, y, direction) {
        super(x, y, Math.cos(direction) * 2, Math.sin(direction) * 2, 'virus');
        this.direction = direction;
        this.splitTimer = 0;
        this.splitInterval = 2000;
        this.splitCount = 0;
        this.maxSplits = 2;
    }
    
    update(deltaTime) {
        super.update(deltaTime);
        
        this.splitTimer += deltaTime;
        
        // Dividirse en más virus
        if (this.splitTimer > this.splitInterval && this.splitCount < this.maxSplits) {
            this.split();
            this.splitCount++;
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

class SpecialPowerUp extends PowerUp {
    constructor(x, y, type) {
        super(x, y, type);
        this.isSpecial = true;
        this.pulseTimer = 0;
        this.pulseSpeed = 0.01;
    }
    
    update(deltaTime) {
        super.update(deltaTime);
        
        this.pulseTimer += deltaTime;
    }
    
    draw(ctx) {
        ctx.save();
        
        // Efecto de pulso
        const pulse = Math.sin(this.pulseTimer * this.pulseSpeed) * 0.3 + 0.7;
        ctx.globalAlpha = pulse;
        
        // Aura especial
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(this.x + this.width/2, this.y + this.height/2, this.width/2 + 10, 0, Math.PI * 2);
        ctx.stroke();
        
        // Dibujar power-up normal
        super.draw(ctx);
        
        ctx.restore();
    }
    
    apply(player) {
        // Efectos especiales según el tipo
        switch (this.type) {
            case 'boss':
                player.health = Math.min(player.maxHealth, player.health + 50);
                player.weaponLevel = Math.min(5, player.weaponLevel + 2);
                player.shield = Math.min(100, player.shield + 50);
                break;
        }
        
        // Efecto visual
        game.particleSystem.addEmitter(this.x, this.y, 'powerup', 20);
        
        // Sonido
        if (game.audioManager) {
            game.audioManager.playSound('powerup', 1.0);
        }
    }
}

// Exportar para uso global
window.ParticleSystem = ParticleSystem;
window.ParticleEmitter = ParticleEmitter;
window.Particle = Particle;
window.LaserBeam = LaserBeam;
window.EarthquakeWave = EarthquakeWave;
window.BossClone = BossClone;
window.VirusBullet = VirusBullet;
window.SpecialPowerUp = SpecialPowerUp;