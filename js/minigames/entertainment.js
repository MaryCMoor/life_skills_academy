// ==================== ENTERTAINMENT MINIGAMES ====================

window.EntertainmentGames = {
    
    startBowling() {
        const overlay = document.createElement('div');
        overlay.className = 'minigame-overlay active';
        overlay.id = 'bowlingGame';
        
        let frame = 1;
        let roll = 1;
        let score = 0;
        let pinsStanding = 10;
        
        const html = `
            <div class="minigame-container">
                <div class="minigame-header">
                    <div class="minigame-title">🎳 Bowling Game</div>
                    <div class="minigame-subtitle">Frame <span id="currentFrame">1</span>/10 - Roll <span id="currentRoll">1</span></div>
                </div>
                
                <div class="bowling-lane">
                    <div class="pins-display" id="pinsDisplay">
                        ${this.renderPins(10)}
                    </div>
                    
                    <div class="score-display">
                        <h3>Score: <span id="bowlingScore">0</span></h3>
                        <p>Pins Standing: <span id="pinsStanding">10</span></p>
                    </div>
                    
                    <div class="power-meter">
                        <h4>Power</h4>
                        <div class="power-bar">
                            <div class="power-fill" id="powerFill"></div>
                        </div>
                    </div>
                    
                    <button class="btn btn-primary btn-large mt-20" id="rollBtn" onclick="EntertainmentGames.rollBall()">
                        🎳 Roll Ball
                    </button>
                </div>
                
                <div class="minigame-actions mt-20">
                    <button class="btn-skip" onclick="EntertainmentGames.endBowling()">
                        Finish Game
                    </button>
                </div>
            </div>
        `;
        
        overlay.innerHTML = html;
        document.body.appendChild(overlay);
        
        this.bowlingState = { frame, roll, score, pinsStanding };
        this.animatePowerMeter();
    },
    
    renderPins(count) {
        let html = '<div class="pins-container">';
        for (let i = 0; i < 10; i++) {
            html += `<div class="pin ${i < count ? 'standing' : 'knocked'}" id="pin-${i}">🎳</div>`;
        }
        html += '</div>';
        return html;
    },
    
    animatePowerMeter() {
        if (!this.bowlingState) return;
        
        const powerFill = document.getElementById('powerFill');
        if (!powerFill) return;
        
        let power = 0;
        let direction = 1;
        
        this.powerInterval = setInterval(() => {
            power += direction * 2;
            if (power >= 100 || power <= 0) direction *= -1;
            powerFill.style.width = power + '%';
            this.currentPower = power;
        }, 20);
    },
    
    rollBall() {
        if (!this.bowlingState) return;
        
        clearInterval(this.powerInterval);
        
        const power = this.currentPower || Math.random() * 100;
        const accuracy = Math.random();
        
        // Calculate pins knocked down
        let pinsKnocked = 0;
        if (power > 80 && accuracy > 0.7) {
            pinsKnocked = this.bowlingState.pinsStanding; // Strike!
        } else if (power > 60 && accuracy > 0.5) {
            pinsKnocked = Math.floor(this.bowlingState.pinsStanding * (0.6 + Math.random() * 0.3));
        } else {
            pinsKnocked = Math.floor(this.bowlingState.pinsStanding * (0.2 + Math.random() * 0.4));
        }
        
        pinsKnocked = Math.min(pinsKnocked, this.bowlingState.pinsStanding);
        
        this.bowlingState.score += pinsKnocked;
        this.bowlingState.pinsStanding -= pinsKnocked;
        
        // Update display
        document.getElementById('bowlingScore').textContent = this.bowlingState.score;
        document.getElementById('pinsStanding').textContent = this.bowlingState.pinsStanding;
        document.getElementById('pinsDisplay').innerHTML = this.renderPins(this.bowlingState.pinsStanding);
        
        // Check for strike
        if (pinsKnocked === 10 && this.bowlingState.roll === 1) {
            UI.showNotification('🎳 STRIKE! Amazing!', 'success');
            this.nextFrame();
        } else if (this.bowlingState.pinsStanding === 0 && this.bowlingState.roll === 2) {
            UI.showNotification('🎳 SPARE! Nice job!', 'success');
            this.nextFrame();
        } else if (this.bowlingState.roll === 2) {
            this.nextFrame();
        } else {
            this.bowlingState.roll = 2;
            document.getElementById('currentRoll').textContent = '2';
            setTimeout(() => this.animatePowerMeter(), 1000);
        }
    },
    
    nextFrame() {
        this.bowlingState.frame++;
        this.bowlingState.roll = 1;
        this.bowlingState.pinsStanding = 10;
        
        if (this.bowlingState.frame > 10) {
            this.endBowling();
            return;
        }
        
        document.getElementById('currentFrame').textContent = this.bowlingState.frame;
        document.getElementById('currentRoll').textContent = '1';
        document.getElementById('pinsStanding').textContent = '10';
        document.getElementById('pinsDisplay').innerHTML = this.renderPins(10);
        
        setTimeout(() => this.animatePowerMeter(), 1500);
    },
    
    endBowling() {
        clearInterval(this.powerInterval);
        
        const finalScore = this.bowlingState ? this.bowlingState.score : 0;
        
        GameState.addSkill('bowling', 10);
        GameState.entertainment.socialEnergy = Math.min(100, GameState.entertainment.socialEnergy + 15);
        GameState.clearBusy();
        
        UI.showNotification(`🎳 Game Over! Score: ${finalScore}`, 'success');
        
        if (finalScore >= 200) {
            GameState.addAchievement('Bowling Pro', 'Score 200+ in bowling', '🎳');
        }
        
        const overlay = document.getElementById('bowlingGame');
        if (overlay) overlay.remove();
        
        this.bowlingState = null;
        UI.updateStats();
    },
    
    startSkating() {
        const overlay = document.createElement('div');
        overlay.className = 'minigame-overlay active';
        overlay.id = 'skatingGame';
        
        const html = `
            <div class="minigame-container">
                <div class="minigame-header">
                    <div class="minigame-title">⛸️ Skating Rink</div>
                    <div class="minigame-subtitle">Glide around and have fun!</div>
                </div>
                
                <div class="skating-rink">
                    <div class="rink-display">
                        <div class="skater" id="skater">🧑‍🦽</div>
                        <div class="obstacle" id="obstacle1">⚠️</div>
                        <div class="obstacle" id="obstacle2">⚠️</div>
                    </div>
                    
                    <div class="skating-controls">
                        <h4>Use Arrow Keys to Move!</h4>
                        <p>Avoid obstacles and collect stars ⭐</p>
                        <div class="skating-score">
                            <span>Stars: <strong id="starsCollected">0</strong></span>
                            <span>Time: <strong id="skatingTime">120</strong>s</span>
                        </div>
                    </div>
                </div>
                
                <div class="minigame-actions mt-20">
                    <button class="btn-skip" onclick="EntertainmentGames.endSkating()">
                        Finish Skating
                    </button>
                </div>
            </div>
        `;
        
        overlay.innerHTML = html;
        document.body.appendChild(overlay);
        
        this.skatingState = {
            stars: 0,
            time: 120,
            position: { x: 50, y: 50 }
        };
        
        this.startSkatingGame();
    },
    
    startSkatingGame() {
        let timeLeft = 120;
        
        this.skatingTimer = setInterval(() => {
            timeLeft--;
            document.getElementById('skatingTime').textContent = timeLeft;
            
            if (timeLeft <= 0) {
                this.endSkating();
            }
        }, 1000);
        
        // Keyboard controls
        this.skatingKeyHandler = (e) => {
            const skater = document.getElementById('skater');
            if (!skater) return;
            
            const step = 10;
            let newX = this.skatingState.position.x;
            let newY = this.skatingState.position.y;
            
            if (e.key === 'ArrowLeft') newX -= step;
            if (e.key === 'ArrowRight') newX += step;
            if (e.key === 'ArrowUp') newY -= step;
            if (e.key === 'ArrowDown') newY += step;
            
            // Bounds checking
            newX = Math.max(0, Math.min(100, newX));
            newY = Math.max(0, Math.min(100, newY));
            
            this.skatingState.position = { x: newX, y: newY };
            skater.style.left = newX + '%';
            skater.style.top = newY + '%';
        };
        
        document.addEventListener('keydown', this.skatingKeyHandler);
    },
    
    endSkating() {
        clearInterval(this.skatingTimer);
        document.removeEventListener('keydown', this.skatingKeyHandler);
        
        const stars = this.skatingState ? this.skatingState.stars : 0;
        
        GameState.addSkill('skating', 10);
        GameState.entertainment.socialEnergy = Math.min(100, GameState.entertainment.socialEnergy + 20);
        GameState.clearBusy();
        
        UI.showNotification(`⛸️ Great skating! Collected ${stars} stars!`, 'success');
        
        const overlay = document.getElementById('skatingGame');
        if (overlay) overlay.remove();
        
        this.skatingState = null;
        UI.updateStats();
    },
    
    startArcade(gameType) {
        const overlay = document.createElement('div');
        overlay.className = 'minigame-overlay active';
        overlay.id = 'arcadeGame';
        
        const games = {
            shooter: { name: 'Target Shooter', icon: '🎯', desc: 'Hit the targets!' },
            basketball: { name: 'Hoop Shooter', icon: '🏀', desc: 'Make as many baskets as you can!' },
            racing: { name: 'Speed Racer', icon: '🏎️', desc: 'Race to the finish!' }
        };
        
        const game = games[gameType] || games.shooter;
        
        const html = `
            <div class="minigame-container">
                <div class="minigame-header">
                    <div class="minigame-title">${game.icon} ${game.name}</div>
                    <div class="minigame-subtitle">${game.desc}</div>
                </div>
                
                <div class="arcade-game">
                    <div class="game-screen">
                        <div class="target" id="target" style="left: 50%; top: 50%;">${game.icon}</div>
                    </div>
                    
                    <div class="game-stats">
                        <h3>Score: <span id="arcadeScore">0</span></h3>
                        <h3>Time: <span id="arcadeTime">30</span>s</h3>
                        <h3>Tickets: <span id="arcadeTickets">0</span></h3>
                    </div>
                    
                    <button class="btn btn-primary btn-large" onclick="EntertainmentGames.clickTarget()">
                        ${game.icon} Click Target!
                    </button>
                </div>
                
                <div class="minigame-actions mt-20">
                    <button class="btn-skip" onclick="EntertainmentGames.endArcade()">
                        Cash Out Tickets
                    </button>
                </div>
            </div>
        `;
        
        overlay.innerHTML = html;
        document.body.appendChild(overlay);
        
        this.arcadeState = {
            score: 0,
            time: 30,
            tickets: 0
        };
        
        this.startArcadeTimer();
        this.moveTarget();
    },
    
    startArcadeTimer() {
        this.arcadeTimer = setInterval(() => {
            this.arcadeState.time--;
            document.getElementById('arcadeTime').textContent = this.arcadeState.time;
            
            if (this.arcadeState.time <= 0) {
                this.endArcade();
            }
        }, 1000);
    },
    
    moveTarget() {
        const target = document.getElementById('target');
        if (!target) return;
        
        const randomX = Math.random() * 80 + 10;
        const randomY = Math.random() * 80 + 10;
        
        target.style.left = randomX + '%';
        target.style.top = randomY + '%';
    },
    
    clickTarget() {
        if (!this.arcadeState) return;
        
        this.arcadeState.score += 10;
        this.arcadeState.tickets += 2;
        
        document.getElementById('arcadeScore').textContent = this.arcadeState.score;
        document.getElementById('arcadeTickets').textContent = this.arcadeState.tickets;
        
        this.moveTarget();
        
        UI.showNotification('+10 points! +2 tickets!', 'success', 1000);
    },
    
    endArcade() {
        clearInterval(this.arcadeTimer);
        
        const tickets = this.arcadeState ? this.arcadeState.tickets : 0;
        const score = this.arcadeState ? this.arcadeState.score : 0;
        
        GameState.entertainment.socialEnergy = Math.min(100, GameState.entertainment.socialEnergy + 10);
        
        UI.showNotification(`🎮 Game Over! Score: ${score}, Tickets: ${tickets}`, 'success');
        
        const overlay = document.getElementById('arcadeGame');
        if (overlay) overlay.remove();
        
        this.arcadeState = null;
        UI.updateStats();
    }
};
