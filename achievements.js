// Space Defender - Sistema de Logros y Estadísticas
class AchievementSystem {
    constructor() {
        this.achievements = {};
        this.stats = {};
        this.unlockedAchievements = new Set();
        this.achievementNotifications = [];
        
        this.init();
    }
    
    init() {
        this.loadAchievements();
        this.loadStats();
        this.loadUnlockedAchievements();
    }
    
    loadAchievements() {
        this.achievements = {
            // Logros de supervivencia
            'survivor_1': {
                id: 'survivor_1',
                name: 'Sobreviviente Novato',
                description: 'Sobrevive 1 minuto en un solo juego',
                icon: '⏱️',
                points: 10,
                category: 'survival',
                requirement: { type: 'survival_time', value: 60000 }
            },
            'survivor_2': {
                id: 'survivor_2',
                name: 'Sobreviviente Experto',
                description: 'Sobrevive 5 minutos en un solo juego',
                icon: '⏰',
                points: 25,
                category: 'survival',
                requirement: { type: 'survival_time', value: 300000 }
            },
            'survivor_3': {
                id: 'survivor_3',
                name: 'Sobreviviente Legendario',
                description: 'Sobrevive 10 minutos en un solo juego',
                icon: '👑',
                points: 50,
                category: 'survival',
                requirement: { type: 'survival_time', value: 600000 }
            },
            
            // Logros de puntuación
            'scorer_1': {
                id: 'scorer_1',
                name: 'Puntuador Básico',
                description: 'Alcanza 10,000 puntos',
                icon: '🎯',
                points: 15,
                category: 'scoring',
                requirement: { type: 'score', value: 10000 }
            },
            'scorer_2': {
                id: 'scorer_2',
                name: 'Puntuador Avanzado',
                description: 'Alcanza 50,000 puntos',
                icon: '🏆',
                points: 35,
                category: 'scoring',
                requirement: { type: 'score', value: 50000 }
            },
            'scorer_3': {
                id: 'scorer_3',
                name: 'Puntuador Maestro',
                description: 'Alcanza 100,000 puntos',
                icon: '💎',
                points: 75,
                category: 'scoring',
                requirement: { type: 'score', value: 100000 }
            },
            
            // Logros de enemigos
            'destroyer_1': {
                id: 'destroyer_1',
                name: 'Destructor de Hordas',
                description: 'Destruye 100 enemigos',
                icon: '💥',
                points: 20,
                category: 'combat',
                requirement: { type: 'enemies_destroyed', value: 100 }
            },
            'destroyer_2': {
                id: 'destroyer_2',
                name: 'Exterminador',
                description: 'Destruye 500 enemigos',
                icon: '🔥',
                points: 45,
                category: 'combat',
                requirement: { type: 'enemies_destroyed', value: 500 }
            },
            'destroyer_3': {
                id: 'destroyer_3',
                name: 'Genocida Espacial',
                description: 'Destruye 1,000 enemigos',
                icon: '☠️',
                points: 100,
                category: 'combat',
                requirement: { type: 'enemies_destroyed', value: 1000 }
            },
            
            // Logros de jefes
            'boss_slayer_1': {
                id: 'boss_slayer_1',
                name: 'Cazador de Jefes',
                description: 'Derrota a 5 jefes',
                icon: '⚔️',
                points: 30,
                category: 'bosses',
                requirement: { type: 'bosses_defeated', value: 5 }
            },
            'boss_slayer_2': {
                id: 'boss_slayer_2',
                name: 'Exterminador de Jefes',
                description: 'Derrota a 20 jefes',
                icon: '🗡️',
                points: 60,
                category: 'bosses',
                requirement: { type: 'bosses_defeated', value: 20 }
            },
            'boss_slayer_3': {
                id: 'boss_slayer_3',
                name: 'Leyenda de Jefes',
                description: 'Derrota a 50 jefes',
                icon: '👹',
                points: 150,
                category: 'bosses',
                requirement: { type: 'bosses_defeated', value: 50 }
            },
            
            // Logros de niveles
            'leveler_1': {
                id: 'leveler_1',
                name: 'Navegante Espacial',
                description: 'Alcanza el nivel 10',
                icon: '🚀',
                points: 25,
                category: 'progression',
                requirement: { type: 'level', value: 10 }
            },
            'leveler_2': {
                id: 'leveler_2',
                name: 'Explorador Galáctico',
                description: 'Alcanza el nivel 25',
                icon: '🌌',
                points: 50,
                category: 'progression',
                requirement: { type: 'level', value: 25 }
            },
            'leveler_3': {
                id: 'leveler_3',
                name: 'Conquistador del Cosmos',
                description: 'Alcanza el nivel 50',
                icon: '🌠',
                points: 100,
                category: 'progression',
                requirement: { type: 'level', value: 50 }
            },
            
            // Logros de precisión
            'sharpshooter_1': {
                id: 'sharpshooter_1',
                name: 'Tirador Preciso',
                description: 'Alcanza 80% de precisión',
                icon: '🎯',
                points: 20,
                category: 'accuracy',
                requirement: { type: 'accuracy', value: 80 }
            },
            'sharpshooter_2': {
                id: 'sharpshooter_2',
                name: 'Tirador Experto',
                description: 'Alcanza 90% de precisión',
                icon: '🎯',
                points: 40,
                category: 'accuracy',
                requirement: { type: 'accuracy', value: 90 }
            },
            'sharpshooter_3': {
                id: 'sharpshooter_3',
                name: 'Tirador Legendario',
                description: 'Alcanza 95% de precisión',
                icon: '🎯',
                points: 75,
                category: 'accuracy',
                requirement: { type: 'accuracy', value: 95 }
            },
            
            // Logros especiales
            'speedrunner': {
                id: 'speedrunner',
                name: 'Velocista Espacial',
                description: 'Completa 5 niveles en menos de 2 minutos',
                icon: '⚡',
                points: 50,
                category: 'special',
                requirement: { type: 'speedrun', value: 120000 }
            },
            'pacifist': {
                id: 'pacifist',
                name: 'Pacifista Espacial',
                description: 'Sobrevive 2 minutos sin disparar',
                icon: '🕊️',
                points: 75,
                category: 'special',
                requirement: { type: 'pacifist_time', value: 120000 }
            },
            'collector': {
                id: 'collector',
                name: 'Coleccionista',
                description: 'Recoge 50 power-ups en un solo juego',
                icon: '📦',
                points: 60,
                category: 'special',
                requirement: { type: 'powerups_collected', value: 50 }
            }
        };
    }
    
    loadStats() {
        const savedStats = localStorage.getItem('spaceDefender_stats');
        if (savedStats) {
            this.stats = JSON.parse(savedStats);
        } else {
            this.stats = {
                totalGames: 0,
                totalScore: 0,
                totalTime: 0,
                totalEnemiesDestroyed: 0,
                totalBossesDefeated: 0,
                totalPowerUpsCollected: 0,
                totalShotsFired: 0,
                totalShotsHit: 0,
                highestLevel: 0,
                highestScore: 0,
                longestSurvival: 0,
                fastestLevel: 999999,
                pacifistTime: 0,
                powerUpsInOneGame: 0
            };
        }
    }
    
    loadUnlockedAchievements() {
        const savedAchievements = localStorage.getItem('spaceDefender_achievements');
        if (savedAchievements) {
            this.unlockedAchievements = new Set(JSON.parse(savedAchievements));
        }
    }
    
    saveStats() {
        localStorage.setItem('spaceDefender_stats', JSON.stringify(this.stats));
    }
    
    saveUnlockedAchievements() {
        localStorage.setItem('spaceDefender_achievements', JSON.stringify(Array.from(this.unlockedAchievements)));
    }
    
    updateStat(statName, value) {
        if (this.stats.hasOwnProperty(statName)) {
            this.stats[statName] = value;
        }
        this.saveStats();
        this.checkAchievements();
    }
    
    incrementStat(statName, amount = 1) {
        if (this.stats.hasOwnProperty(statName)) {
            this.stats[statName] += amount;
        }
        this.saveStats();
        this.checkAchievements();
    }
    
    checkAchievements() {
        Object.values(this.achievements).forEach(achievement => {
            if (!this.unlockedAchievements.has(achievement.id)) {
                if (this.isAchievementUnlocked(achievement)) {
                    this.unlockAchievement(achievement);
                }
            }
        });
    }
    
    isAchievementUnlocked(achievement) {
        const requirement = achievement.requirement;
        
        switch (requirement.type) {
            case 'survival_time':
                return this.stats.longestSurvival >= requirement.value;
            case 'score':
                return this.stats.highestScore >= requirement.value;
            case 'enemies_destroyed':
                return this.stats.totalEnemiesDestroyed >= requirement.value;
            case 'bosses_defeated':
                return this.stats.totalBossesDefeated >= requirement.value;
            case 'level':
                return this.stats.highestLevel >= requirement.value;
            case 'accuracy':
                const accuracy = this.stats.totalShotsHit / Math.max(this.stats.totalShotsFired, 1) * 100;
                return accuracy >= requirement.value;
            case 'speedrun':
                return this.stats.fastestLevel <= requirement.value;
            case 'pacifist_time':
                return this.stats.pacifistTime >= requirement.value;
            case 'powerups_collected':
                return this.stats.powerUpsInOneGame >= requirement.value;
            default:
                return false;
        }
    }
    
    unlockAchievement(achievement) {
        this.unlockedAchievements.add(achievement.id);
        this.saveUnlockedAchievements();
        
        // Mostrar notificación
        this.showAchievementNotification(achievement);
        
        // Sonido de logro
        if (game.audioManager) {
            game.audioManager.playSound('levelup', 1.0);
        }
        
        // Efecto visual
        this.createAchievementEffect();
        
        console.log(`🎉 ¡Logro desbloqueado: ${achievement.name}!`);
    }
    
    showAchievementNotification(achievement) {
        const notification = {
            id: Date.now(),
            achievement: achievement,
            timestamp: Date.now(),
            isVisible: true
        };
        
        this.achievementNotifications.push(notification);
        
        // Auto-ocultar después de 5 segundos
        setTimeout(() => {
            notification.isVisible = false;
        }, 5000);
    }
    
    createAchievementEffect() {
        // Crear partículas de celebración
        if (game.particleSystem) {
            game.particleSystem.addEmitter(400, 300, 'powerup', 30);
        }
    }
    
    getTotalPoints() {
        let total = 0;
        this.unlockedAchievements.forEach(achievementId => {
            const achievement = this.achievements[achievementId];
            if (achievement) {
                total += achievement.points;
            }
        });
        return total;
    }
    
    getAchievementProgress(achievementId) {
        const achievement = this.achievements[achievementId];
        if (!achievement) return 0;
        
        const requirement = achievement.requirement;
        let current = 0;
        
        switch (requirement.type) {
            case 'survival_time':
                current = this.stats.longestSurvival;
                break;
            case 'score':
                current = this.stats.highestScore;
                break;
            case 'enemies_destroyed':
                current = this.stats.totalEnemiesDestroyed;
                break;
            case 'bosses_defeated':
                current = this.stats.totalBossesDefeated;
                break;
            case 'level':
                current = this.stats.highestLevel;
                break;
            case 'accuracy':
                current = this.stats.totalShotsHit / Math.max(this.stats.totalShotsFired, 1) * 100;
                break;
            case 'speedrun':
                current = this.stats.fastestLevel;
                break;
            case 'pacifist_time':
                current = this.stats.pacifistTime;
                break;
            case 'powerups_collected':
                current = this.stats.powerUpsInOneGame;
                break;
        }
        
        return Math.min(100, (current / requirement.value) * 100);
    }
    
    getCategoryProgress(category) {
        const categoryAchievements = Object.values(this.achievements).filter(a => a.category === category);
        const unlocked = categoryAchievements.filter(a => this.unlockedAchievements.has(a.id));
        return (unlocked.length / categoryAchievements.length) * 100;
    }
    
    drawNotifications(ctx) {
        const notifications = this.achievementNotifications.filter(n => n.isVisible);
        
        notifications.forEach((notification, index) => {
            const y = 100 + index * 80;
            this.drawAchievementNotification(ctx, notification, y);
        });
    }
    
    drawAchievementNotification(ctx, notification, y) {
        const achievement = notification.achievement;
        const width = 300;
        const height = 70;
        const x = 800 - width - 20;
        
        // Fondo
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(x, y, width, height);
        
        // Borde
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, width, height);
        
        // Icono
        ctx.font = '24px Arial';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(achievement.icon, x + 10, y + 25);
        
        // Título
        ctx.font = 'bold 14px Orbitron';
        ctx.fillStyle = '#00ff00';
        ctx.fillText(achievement.name, x + 50, y + 20);
        
        // Descripción
        ctx.font = '12px Orbitron';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(achievement.description, x + 50, y + 35);
        
        // Puntos
        ctx.font = 'bold 16px Orbitron';
        ctx.fillStyle = '#ffff00';
        ctx.fillText(`+${achievement.points} pts`, x + width - 60, y + 25);
    }
    
    drawStatsScreen(ctx) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        ctx.fillRect(0, 0, 800, 600);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px Orbitron';
        ctx.textAlign = 'center';
        ctx.fillText('ESTADÍSTICAS DEL JUGADOR', 400, 50);
        
        // Estadísticas principales
        const stats = [
            { label: 'Juegos Totales', value: this.stats.totalGames },
            { label: 'Puntuación Total', value: this.stats.totalScore.toLocaleString() },
            { label: 'Tiempo Total', value: this.formatTime(this.stats.totalTime) },
            { label: 'Enemigos Destruidos', value: this.stats.totalEnemiesDestroyed.toLocaleString() },
            { label: 'Jefes Derrotados', value: this.stats.totalBossesDefeated },
            { label: 'Power-ups Recolectados', value: this.stats.totalPowerUpsCollected.toLocaleString() },
            { label: 'Nivel Más Alto', value: this.stats.highestLevel },
            { label: 'Puntuación Más Alta', value: this.stats.highestScore.toLocaleString() },
            { label: 'Tiempo de Supervivencia', value: this.formatTime(this.stats.longestSurvival) },
            { label: 'Precisión', value: this.getAccuracy() + '%' }
        ];
        
        let y = 100;
        stats.forEach((stat, index) => {
            const x = index % 2 === 0 ? 150 : 450;
            if (index % 2 === 0) y += 40;
            
            ctx.fillStyle = '#ffffff';
            ctx.font = '16px Orbitron';
            ctx.textAlign = 'left';
            ctx.fillText(stat.label, x, y);
            
            ctx.fillStyle = '#00ff00';
            ctx.font = 'bold 16px Orbitron';
            ctx.fillText(stat.value.toString(), x + 200, y);
        });
        
        // Puntos totales de logros
        y += 60;
        ctx.fillStyle = '#ffff00';
        ctx.font = 'bold 20px Orbitron';
        ctx.textAlign = 'center';
        ctx.fillText(`Puntos Totales de Logros: ${this.getTotalPoints()}`, 400, y);
        
        // Botón de regreso
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(350, 500, 100, 40);
        ctx.fillStyle = '#000000';
        ctx.font = '16px Orbitron';
        ctx.textAlign = 'center';
        ctx.fillText('REGRESAR', 400, 525);
    }
    
    drawAchievementsScreen(ctx) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        ctx.fillRect(0, 0, 800, 600);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px Orbitron';
        ctx.textAlign = 'center';
        ctx.fillText('LOGROS Y CONQUISTAS', 400, 50);
        
        const categories = ['survival', 'scoring', 'combat', 'bosses', 'progression', 'accuracy', 'special'];
        const categoryNames = {
            'survival': 'Supervivencia',
            'scoring': 'Puntuación',
            'combat': 'Combate',
            'bosses': 'Jefes',
            'progression': 'Progresión',
            'accuracy': 'Precisión',
            'special': 'Especiales'
        };
        
        let y = 100;
        categories.forEach(category => {
            // Título de categoría
            ctx.fillStyle = '#00ff00';
            ctx.font = 'bold 18px Orbitron';
            ctx.textAlign = 'left';
            ctx.fillText(categoryNames[category], 50, y);
            
            // Progreso de categoría
            const progress = this.getCategoryProgress(category);
            ctx.fillStyle = '#666666';
            ctx.fillRect(200, y - 15, 100, 10);
            ctx.fillStyle = '#00ff00';
            ctx.fillRect(200, y - 15, progress, 10);
            ctx.fillStyle = '#ffffff';
            ctx.font = '12px Orbitron';
            ctx.fillText(`${Math.round(progress)}%`, 310, y - 5);
            
            y += 30;
            
            // Logros de la categoría
            const categoryAchievements = Object.values(this.achievements).filter(a => a.category === category);
            categoryAchievements.forEach(achievement => {
                const isUnlocked = this.unlockedAchievements.has(achievement.id);
                const progress = this.getAchievementProgress(achievement.id);
                
                // Icono y estado
                ctx.fillStyle = isUnlocked ? '#00ff00' : '#666666';
                ctx.font = '20px Arial';
                ctx.fillText(isUnlocked ? '✅' : '🔒', 50, y);
                
                // Nombre
                ctx.fillStyle = isUnlocked ? '#ffffff' : '#666666';
                ctx.font = '14px Orbitron';
                ctx.fillText(achievement.name, 80, y);
                
                // Descripción
                ctx.fillStyle = isUnlocked ? '#cccccc' : '#666666';
                ctx.font = '12px Orbitron';
                ctx.fillText(achievement.description, 80, y + 15);
                
                // Progreso
                if (!isUnlocked) {
                    ctx.fillStyle = '#333333';
                    ctx.fillRect(400, y - 10, 150, 8);
                    ctx.fillStyle = '#00ff00';
                    ctx.fillRect(400, y - 10, progress * 1.5, 8);
                    ctx.fillStyle = '#ffffff';
                    ctx.font = '10px Orbitron';
                    ctx.fillText(`${Math.round(progress)}%`, 560, y - 2);
                }
                
                // Puntos
                ctx.fillStyle = isUnlocked ? '#ffff00' : '#666666';
                ctx.font = 'bold 12px Orbitron';
                ctx.fillText(`${achievement.points} pts`, 600, y);
                
                y += 40;
            });
            
            y += 20;
        });
        
        // Botón de regreso
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(350, 550, 100, 40);
        ctx.fillStyle = '#000000';
        ctx.font = '16px Orbitron';
        ctx.textAlign = 'center';
        ctx.fillText('REGRESAR', 400, 575);
    }
    
    formatTime(milliseconds) {
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        
        if (hours > 0) {
            return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
        } else if (minutes > 0) {
            return `${minutes}m ${seconds % 60}s`;
        } else {
            return `${seconds}s`;
        }
    }
    
    getAccuracy() {
        if (this.stats.totalShotsFired === 0) return 0;
        return Math.round((this.stats.totalShotsHit / this.stats.totalShotsFired) * 100);
    }
    
    resetStats() {
        this.stats = {
            totalGames: 0,
            totalScore: 0,
            totalTime: 0,
            totalEnemiesDestroyed: 0,
            totalBossesDefeated: 0,
            totalPowerUpsCollected: 0,
            totalShotsFired: 0,
            totalShotsHit: 0,
            highestLevel: 0,
            highestScore: 0,
            longestSurvival: 0,
            fastestLevel: 999999,
            pacifistTime: 0,
            powerUpsInOneGame: 0
        };
        this.saveStats();
    }
    
    resetAchievements() {
        this.unlockedAchievements.clear();
        this.saveUnlockedAchievements();
    }
}

// Exportar para uso global
window.AchievementSystem = AchievementSystem;