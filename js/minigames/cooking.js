// ==================== INTERACTIVE COOKING SIMULATION ====================

window.CookingMinigame = {
    currentRecipe: null,
    currentStep: 0,
    gameState: {},
    mistakes: [],
    
    recipes: {
        'scrambled-eggs': {
            name: '🍳 Scrambled Eggs',
            difficulty: 'Easy',
            time: 10,
            skill: 5,
            ingredients: ['3 eggs', '2 tbsp milk', '1 tbsp butter', 'Salt & pepper'],
            steps: [
                { type: 'crack', data: { eggs: 3 } },
                { type: 'whisk', data: { duration: 5 } },
                { type: 'cook', data: { duration: 8 } }
            ]
        },
        'pasta': {
            name: '🍝 Spaghetti',
            difficulty: 'Easy',
            time: 15,
            skill: 8,
            ingredients: ['8 oz pasta', 'Water', 'Salt', '1 jar sauce'],
            steps: [
                { type: 'boil', data: { waitTime: 5 } },
                { type: 'cook', data: { duration: 5 } },
                { type: 'serve', data: {} }
            ]
        },
        'sandwich': {
            name: '🥪 Sandwich',
            difficulty: 'Very Easy',
            time: 5,
            skill: 3,
            ingredients: ['2 slices bread', 'Deli meat', 'Cheese', 'Lettuce', 'Tomato'],
            steps: [
                { type: 'layer', data: {} }
            ]
        },
        'pancakes': {
            name: '🥞 Pancakes',
            difficulty: 'Medium',
            time: 20,
            skill: 12,
            ingredients: ['1 cup flour', '2 eggs', '1 cup milk', 'Butter', 'Syrup'],
            steps: [
                { type: 'mix', data: { duration: 5 } },
                { type: 'cook', data: { duration: 8 } },
                { type: 'serve', data: {} }
            ]
        }
    },
    
    start(recipeId) {
        console.log('👨‍🍳 Starting cooking:', recipeId);
        
        const recipe = this.recipes[recipeId];
        if (!recipe) {
            UI.showNotification('❌ Recipe not found!', 'error');
            return;
        }
        
        this.currentRecipe = recipe;
        this.currentStep = 0;
        this.mistakes = [];
        this.gameState = {};
        
        this.showRecipeIntro();
    },
    
    showRecipeIntro() {
        const recipe = this.currentRecipe;
        
        const overlay = document.createElement('div');
        overlay.className = 'minigame-overlay active';
        overlay.id = 'cookingGame';
        
        overlay.innerHTML = `
            <div class="minigame-container" style="max-width: 800px;">
                <div class="minigame-header">
                    <div class="minigame-title">${recipe.name}</div>
                    <div class="minigame-subtitle">
                        Difficulty: ${recipe.difficulty} • Time: ${recipe.time} min • Skill: +${recipe.skill}
                    </div>
                </div>
                
                <div style="margin: 30px 0;">
                    <div class="card">
                        <div class="card-title">📋 Ingredients</div>
                        <div class="card-content">
                            <ul style="list-style: none; padding: 0;">
                                ${recipe.ingredients.map(ing => `
                                    <li style="padding: 8px 0; border-bottom: 1px solid #ecf0f1;">
                                        ✓ ${ing}
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                    </div>
                    
                    <div class="info-box mt-20">
                        <strong>🎮 Interactive Cooking!</strong>
                        <p>Follow each step carefully. Click buttons, drag items, and watch timers!</p>
                    </div>
                </div>
                
                <div class="minigame-actions">
                    <button class="btn btn-success btn-large" onclick="CookingMinigame.startCooking()">
                        👨‍🍳 Start Cooking!
                    </button>
                    <button class="btn-skip" onclick="CookingMinigame.close()">Cancel</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
    },
    
    startCooking() {
        this.currentStep = 0;
        this.nextStep();
    },
    
    nextStep() {
        const step = this.currentRecipe.steps[this.currentStep];
        
        if (!step) {
            this.showResults();
            return;
        }
        
        const handlers = {
            'crack': () => this.showCrackEggsStep(step.data),
            'whisk': () => this.showWhiskStep(step.data),
            'cook': () => this.simpleTimerStep('🍳 Cooking', 'Stirring...', step.data.duration || 10),
            'layer': () => this.simpleTimerStep('🥪 Assembling', 'Layering ingredients...', 5),
            'mix': () => this.simpleTimerStep('🥄 Mixing', 'Combining ingredients...', step.data.duration || 5),
            'boil': () => this.simpleTimerStep('💧 Boiling Water', 'Waiting for water to boil...', step.data.waitTime || 10),
            'serve': () => this.simpleTimerStep('🍽️ Serving', 'Plating the dish...', 2)
        };
        
        const handler = handlers[step.type];
        if (handler) {
            handler();
        } else {
            console.error('Unknown step type:', step.type);
            this.currentStep++;
            this.nextStep();
        }
    },
    
    showCrackEggsStep(data) {
        const overlay = document.getElementById('cookingGame');
        if (overlay) overlay.remove();
        
        const newOverlay = document.createElement('div');
        newOverlay.className = 'minigame-overlay active';
        newOverlay.id = 'cookingGame';
        
        const totalEggs = data.eggs || 3;
        
        newOverlay.innerHTML = `
            <div class="minigame-container" style="max-width: 900px;">
                <div class="minigame-header">
                    <div class="minigame-title">🥚 Crack the Eggs</div>
                    <div class="minigame-subtitle">Click each egg to crack it into the bowl</div>
                </div>
                
                <div style="margin: 30px 0;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <div style="font-size: 120px; margin-bottom: 20px;">🥣</div>
                        <div style="font-size: 18px; font-weight: bold;">
                            Eggs Cracked: <span id="eggCount">0</span> / ${totalEggs}
                        </div>
                    </div>
                    
                    <div style="display: flex; justify-content: center; gap: 30px; flex-wrap: wrap;">
                        ${Array(totalEggs).fill(0).map((_, i) => `
                            <div class="egg-item" data-egg="${i}" onclick="CookingMinigame.crackEgg(${i})" style="
                                font-size: 120px;
                                cursor: pointer;
                                transition: all 0.2s;
                            " onmouseover="this.style.transform='scale(1.1)'" 
                               onmouseout="this.style.transform='scale(1)'">
                                🥚
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(newOverlay);
        
        this.gameState.crackedEggs = 0;
        this.gameState.totalEggs = totalEggs;
    },
    
    crackEgg(eggId) {
        const egg = document.querySelector(`[data-egg="${eggId}"]`);
        if (!egg) return;
        
        egg.textContent = '💥';
        egg.style.opacity = '0';
        
        this.gameState.crackedEggs++;
        document.getElementById('eggCount').textContent = this.gameState.crackedEggs;
        
        UI.showNotification('✓ Egg cracked!', 'success', 1000);
        
        if (this.gameState.crackedEggs >= this.gameState.totalEggs) {
            setTimeout(() => {
                this.currentStep++;
                this.nextStep();
            }, 800);
        }
    },
    
    showWhiskStep(data) {
        const overlay = document.getElementById('cookingGame');
        if (overlay) overlay.remove();
        
        const newOverlay = document.createElement('div');
        newOverlay.className = 'minigame-overlay active';
        newOverlay.id = 'cookingGame';
        
        newOverlay.innerHTML = `
            <div class="minigame-container" style="max-width: 900px;">
                <div class="minigame-header">
                    <div class="minigame-title">🥄 Whisk the Eggs</div>
                    <div class="minigame-subtitle">Move your mouse in circles over the bowl!</div>
                </div>
                
                <div style="margin: 30px 0;">
                    <div style="text-align: center;">
                        <div id="whiskArea" style="
                            width: 400px;
                            height: 400px;
                            background: linear-gradient(135deg, #ffd89b, #19547b);
                            border-radius: 50%;
                            margin: 0 auto;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 80px;
                            cursor: pointer;
                        " onmouseenter="CookingMinigame.startWhisking(event)">
                            🍜
                        </div>
                        <div style="font-size: 18px; font-weight: bold; margin-top: 20px;">
                            Whisking Progress: <span id="whiskPercent">0</span>%
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(newOverlay);
        
        this.gameState.whiskProgress = 0;
        this.gameState.lastX = 0;
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
    
    simpleTimerStep(title, message, duration) {
        const overlay = document.getElementById('cookingGame');
        if (overlay) overlay.remove();
        
        const newOverlay = document.createElement('div');
        newOverlay.className = 'minigame-overlay active';
        newOverlay.id = 'cookingGame';
        
        newOverlay.innerHTML = `
            <div class="minigame-container">
                <div class="minigame-header">
                    <div class="minigame-title">${title}</div>
                    <div class="minigame-subtitle">${message}</div>
                </div>
                <div style="margin: 50px 0; text-align: center;">
                    <div style="font-size: 64px; font-weight: bold;" id="timerDisplay">${duration}</div>
                    <div style="margin-top: 10px; color: #7f8c8d;">seconds remaining</div>
                </div>
            </div>
        `;
        
        document.body.appendChild(newOverlay);
        
        let elapsed = 0;
        const interval = setInterval(() => {
            elapsed++;
            const remaining = duration - elapsed;
            const display = document.getElementById('timerDisplay');
            if (display) display.textContent = remaining;
            
            if (elapsed >= duration) {
                clearInterval(interval);
                this.currentStep++;
                this.nextStep();
            }
        }, 1000);
    },
    
    showResults() {
        const overlay = document.getElementById('cookingGame');
        if (overlay) overlay.remove();
        
        const recipe = this.currentRecipe;
        let skillPoints = Math.max(2, recipe.skill - this.mistakes.length * 2);
        let moneyReward = Math.max(5, recipe.skill * 3 - this.mistakes.length * 3);
        
        const perfect = this.mistakes.length === 0;
        if (perfect) moneyReward += 15;
        
        const newOverlay = document.createElement('div');
        newOverlay.className = 'minigame-overlay active';
        newOverlay.id = 'cookingGame';
        
        newOverlay.innerHTML = `
            <div class="minigame-container">
                <div class="minigame-header">
                    <div class="minigame-title">${perfect ? '🎉 Perfect!' : '✅ Complete!'} ${recipe.name}</div>
                </div>
                
                <div style="margin: 30px 0; text-align: center;">
                    <div style="font-size: 80px; margin: 20px 0;">🍳</div>
                    
                    ${perfect ? 
                        '<div class="alert alert-success"><strong>Perfect Recipe!</strong> No mistakes! Bonus: +$15</div>' :
                        `<div class="alert alert-warning">Mistakes: ${this.mistakes.length}</div>`
                    }
                    
                    <div style="font-size: 32px; margin: 20px 0; color: #27ae60;">+$${moneyReward}</div>
                    <div style="font-size: 24px; margin: 10px 0; color: #3498db;">+${skillPoints} Cooking Skill</div>
                </div>
                
                <button class="btn btn-success btn-large" onclick="CookingMinigame.complete(${moneyReward}, ${skillPoints})" style="width: 100%; font-size: 18px;">
                    ✅ Finish Cooking
                </button>
            </div>
        `;
        
        document.body.appendChild(newOverlay);
    },
    
    complete(money, skill) {
        GameState.addMoney(money, 'cooking');
        GameState.addSkill('cooking', skill);
        GameState.clearBusy();
        
        if (this.mistakes.length === 0) {
            GameState.addAchievement('Perfect Chef', 'Cook a recipe perfectly', '👨‍🍳');
        }
        
        if (GameState.skills.cooking >= 50) {
            GameState.addAchievement('Home Chef', 'Reach 50 cooking skill', '🍳');
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
