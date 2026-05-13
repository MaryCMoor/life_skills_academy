X = 0;
        this.gameState.lastY = 0;
    },
    
    startWhisking(event) {
        const whiskArea = event.currentTarget;
        
        const onMove = (e) => {
            const rect = whiskArea.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            if (this.gameState.lastX && this.gameState.lastY) {
                const dx = x - this.gameState.lastX;
                const dy = y - this.gameState.lastY;
                const movement = Math.sqrt(dx * dx + dy * dy);
                
                if (movement > 5) {
                    this.gameState.whiskProgress += movement * 0.15;
                    this.gameState.whiskProgress = Math.min(100, this.gameState.whiskProgress);
                    
                    document.getElementById('whiskPercent').textContent = Math.floor(this.gameState.whiskProgress);
                    document.getElementById('whiskProgress').style.width = `${(this.gameState.whiskProgress / 100) * 100}%`;
                    
                    whiskArea.style.transform = `rotate(${Math.sin(Date.now() / 100) * 5}deg)`;
                    
                    if (this.gameState.whiskProgress >= 100) {
                        whiskArea.removeEventListener('mousemove', onMove);
                        setTimeout(() => {
                            this.currentStep++;
                            this.nextStep();
                        }, 500);
                    }
                }
            }
            
            this.gameState.lastX = x;
            this.gameState.lastY = y;
        };
        
        whiskArea.addEventListener('mousemove', onMove);
    },
    
    // ==================== HEAT STEP ====================
    showHeatStep(data) {
        document.getElementById('cookingGame').remove();
        
        const overlay = document.createElement('div');
        overlay.className = 'minigame-overlay active';
        overlay.id = 'cookingGame';
        
        overlay.innerHTML = `
            <div class="minigame-container">
                <div class="minigame-header">
                    <div class="minigame-title">🔥 Set Heat Level</div>
                    <div class="minigame-subtitle">Choose the correct heat for cooking</div>
                </div>
                
                <div style="margin: 30px 0; display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;">
                    <div class="option-card" onclick="CookingMinigame.selectHeat('low')" style="cursor: pointer; padding: 30px; text-align: center; border: 3px solid #ddd; border-radius: 10px;">
                        <div style="font-size: 64px;">🔵</div>
                        <strong>Low Heat</strong>
                    </div>
                    <div class="option-card" onclick="CookingMinigame.selectHeat('medium')" style="cursor: pointer; padding: 30px; text-align: center; border: 3px solid #ddd; border-radius: 10px;">
                        <div style="font-size: 64px;">🟡</div>
                        <strong>Medium Heat</strong>
                    </div>
                    <div class="option-card" onclick="CookingMinigame.selectHeat('high')" style="cursor: pointer; padding: 30px; text-align: center; border: 3px solid #ddd; border-radius: 10px;">
                        <div style="font-size: 64px;">🔴</div>
                        <strong>High Heat</strong>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        this.gameState.requiredHeat = data.target;
    },
    
    selectHeat(heat) {
        if (heat !== this.gameState.requiredHeat) {
            this.mistakes.push({ step: 'Heat', issue: `Used ${heat} instead of ${this.gameState.requiredHeat}` });
        }
        this.currentStep++;
        this.nextStep();
    },
    
    // ==================== SIMPLE STEPS ====================
    showCookStep(data) {
        this.simpleTimerStep('🍳 Cooking', 'Stir occasionally...', data.duration || 10);
    },
    
    showSeasonStep(data) {
        this.simpleTimerStep('🧂 Season', 'Adding salt and pepper...', 3);
    },
    
    showLayerStep(data) {
        this.simpleTimerStep('🥪 Assembling', 'Layering ingredients...', 5);
    },
    
    showMixStep(data) {
        this.simpleTimerStep('🥄 Mixing', 'Combining ingredients...', data.duration || 5);
    },
    
    showPourStep(data) {
        this.simpleTimerStep('🥞 Pouring', 'Pouring batter onto griddle...', 3);
    },
    
    showFlipStep(data) {
        this.simpleTimerStep('🔄 Flipping', 'Flip at the right time!', data.timing || 8);
    },
    
    showBoilStep(data) {
        this.simpleTimerStep('💧 Boiling Water', 'Waiting for water to boil...', data.waitTime || 10);
    },
    
    showAddPastaStep(data) {
        this.simpleTimerStep('🍝 Cooking Pasta', 'Cook until al dente...', data.duration || 10);
    },
    
    showDrainStep(data) {
        this.simpleTimerStep('🚰 Draining', 'Carefully drain hot water...', 3);
    },
    
    showServeStep(data) {
        this.simpleTimerStep('🍽️ Serving', 'Plating the dish...', 2);
    },
    
    simpleTimerStep(title, message, duration) {
        document.getElementById('cookingGame').remove();
        
        const overlay = document.createElement('div');
        overlay.className = 'minigame-overlay active';
        overlay.id = 'cookingGame';
        
        overlay.innerHTML = `
            <div class="minigame-container">
                <div class="minigame-header">
                    <div class="minigame-title">${title}</div>
                    <div class="minigame-subtitle">${message}</div>
                </div>
                <div style="margin: 50px 0; text-align: center;">
                    <div style="font-size: 48px; font-weight: bold;" id="timerDisplay">${duration}</div>
                    <div class="progress-bar" style="margin-top: 20px;">
                        <div class="progress-fill" id="timerProgress" style="width: 0%;"></div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        let elapsed = 0;
        const interval = setInterval(() => {
            elapsed++;
            const remaining = duration - elapsed;
            const progress = (elapsed / duration) * 100;
            
            document.getElementById('timerDisplay').textContent = remaining;
            document.getElementById('timerProgress').style.width = progress + '%';
            
            if (elapsed >= duration) {
                clearInterval(interval);
                this.currentStep++;
                this.nextStep();
            }
        }, 1000);
    },
    
    // ==================== RESULTS ====================
    showResults() {
        document.getElementById('cookingGame').remove();
        
        const recipe = this.currentRecipe;
        let skillPoints = recipe.skill;
        let moneyReward = recipe.skill * 3;
        
        // Deduct for mistakes
        skillPoints -= this.mistakes.length * 2;
        moneyReward -= this.mistakes.length * 3;
        
        skillPoints = Math.max(2, skillPoints);
        moneyReward = Math.max(5, moneyReward);
        
        const perfect = this.mistakes.length === 0;
        if (perfect) {
            moneyReward += 15;
        }
        
        const overlay = document.createElement('div');
        overlay.className = 'minigame-overlay active';
        overlay.id = 'cookingGame';
        
        overlay.innerHTML = `
            <div class="minigame-container">
                <div class="minigame-header">
                    <div class="minigame-title">${perfect ? '🎉 Perfect!' : '✅ Complete!'} ${recipe.name}</div>
                </div>
                
                <div style="margin: 30px 0;">
                    ${perfect ? 
                        '<div class="alert alert-success"><strong>Perfect Recipe!</strong> No mistakes made! Bonus: +$15</div>' :
                        `<div class="alert alert-warning">Mistakes: ${this.mistakes.length}</div>`
                    }
                    
                    <div class="stats-display" style="margin-top: 20px;">
                        <div class="stat-box">
                            <div class="icon">💵</div>
                            <div class="value">+$${moneyReward}</div>
                        </div>
                        <div class="stat-box">
                            <div class="icon">🍳</div>
                            <div class="value">+${skillPoints} skill</div>
                        </div>
                    </div>
                </div>
                
                <button class="btn btn-success btn-large" onclick="CookingMinigame.complete(${moneyReward}, ${skillPoints})">Finish</button>
            </div>
        `;
        
        document.body.appendChild(overlay);
    },
    
    complete(money, skill) {
        GameState.addMoney(money, 'cooking');
        GameState.addSkill('cooking', skill);
        GameState.clearBusy();
        
        if (this.mistakes.length === 0) {
            GameState.addAchievement('Perfect Chef', 'Cook a recipe with no mistakes', '👨‍🍳');
        }
        
        if (GameState.skills.cooking >= 50) {
            GameState.addAchievement('Home Chef', 'Reach 50 cooking skill', '🍳');
        }
        
        if (GameState.skills.cooking >= 100) {
            GameState.addAchievement('Master Chef', 'Reach 100 cooking skill', '⭐');
        }
        
        UI.showNotification(`✅ Cooking complete! +$${money}, +${skill} cooking skill`, 'success');
        
        this.close();
        
        if (typeof loadHome === 'function') {
            loadHome();
        }
        UI.updateStats();
    },
    
    close() {
        const overlay = document.getElementById('cookingGame');
        if (overlay && overlay.parentNode) {
            overlay.parentNode.removeChild(overlay);
        }
        GameState.clearBusy();
    }
};

console.log('✅ cooking.js loaded - Interactive Cooking ready');
