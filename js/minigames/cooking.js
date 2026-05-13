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
                { type: 'heat', data: { target: 'medium' } },
                { type: 'cook', data: { duration: 8, stirRequired: true } },
                { type: 'season', data: {} }
            ]
        },
        'pasta': {
            name: '🍝 Spaghetti',
            difficulty: 'Easy',
            time: 15,
            skill: 8,
            ingredients: ['8 oz pasta', 'Water', 'Salt', '1 jar sauce'],
            steps: [
                { type: 'boil', data: { waitTime: 10 } },
                { type: 'addpasta', data: { duration: 10 } },
                { type: 'drain', data: {} },
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
                { type: 'layer', data: { ingredients: ['bread', 'meat', 'cheese', 'lettuce', 'tomato', 'bread'] } }
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
                { type: 'heat', data: { target: 'medium' } },
                { type: 'pour', data: {} },
                { type: 'flip', data: { timing: 8 } },
                { type: 'serve', data: {} }
            ]
        }
    },
    
    start(recipeId) {
        console.log('👨‍🍳 Starting interactive cooking:', recipeId);
        
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
    
    // ==================== INTRO SCREEN ====================
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
                                        ✓ ${Utils.escapeHtml(ing)}
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                    </div>
                    
                    <div class="alert alert-warning mt-20">
                        <strong>⚠️ Safety First!</strong>
                        <ul style="margin: 10px 0 0 20px;">
                            <li>Always wash your hands before cooking</li>
                            <li>Be careful with hot surfaces and sharp knives</li>
                            <li>Never leave the stove unattended</li>
                            <li>Turn off all burners when done</li>
                        </ul>
                    </div>
                    
                    <div class="info-box mt-20">
                        <strong>🎮 How to Play:</strong>
                        <p>This is an interactive cooking simulation! You'll need to:</p>
                        <ul>
                            <li>Click to crack eggs and perform actions</li>
                            <li>Control heat and timing carefully</li>
                            <li>Watch for visual cues</li>
                            <li>Make decisions that affect the outcome</li>
                        </ul>
                        <p><strong>Mistakes will affect your final score!</strong></p>
                    </div>
                </div>
                
                <div class="minigame-actions">
                    <button class="btn btn-success btn-large" onclick="CookingMinigame.startCooking()" style="font-size: 18px; padding: 15px 40px;">
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
        
        // Route to appropriate step handler
        const handlers = {
            'crack': () => this.showCrackEggsStep(step.data),
            'whisk': () => this.showWhiskStep(step.data),
            'heat': () => this.showHeatStep(step.data),
            'cook': () => this.showCookStep(step.data),
            'season': () => this.showSeasonStep(step.data),
            'layer': () => this.showLayerStep(step.data),
            'mix': () => this.showMixStep(step.data),
            'pour': () => this.showPourStep(step.data),
            'flip': () => this.showFlipStep(step.data),
            'boil': () => this.showBoilStep(step.data),
            'addpasta': () => this.showAddPastaStep(step.data),
            'drain': () => this.showDrainStep(step.data),
            'serve': () => this.showServeStep(step.data)
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
    
    // ==================== CRACK EGGS STEP ====================
    showCrackEggsStep(data) {
        document.getElementById('cookingGame').remove();
        
        const overlay = document.createElement('div');
        overlay.className = 'minigame-overlay active';
        overlay.id = 'cookingGame';
        
        const totalEggs = data.eggs || 3;
        
        overlay.innerHTML = `
            <div class="minigame-container" style="max-width: 900px;">
                <div class="minigame-header">
                    <div class="minigame-title">🥚 Crack the Eggs</div>
                    <div class="minigame-subtitle">Click each egg to crack it into the bowl</div>
                    <div style="margin-top: 10px;">
                        <div class="progress-bar" style="height: 8px;">
                            <div class="progress-fill" id="eggProgress" style="width: 0%; background: #4caf50;"></div>
                        </div>
                        <small>Step ${this.currentStep + 1} of ${this.currentRecipe.steps.length}</small>
                    </div>
                </div>
                
                <div style="margin: 30px 0;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <div style="font-size: 120px; margin-bottom: 20px;" id="bowlArea">🥣</div>
                        <div style="font-size: 18px; font-weight: bold; color: #2c3e50;">
                            Eggs Cracked: <span id="eggCount">0</span> / ${totalEggs}
                        </div>
                    </div>
                    
                    <div style="display: flex; justify-content: center; gap: 30px; flex-wrap: wrap;" id="eggsContainer">
                        ${Array(totalEggs).fill(0).map((_, i) => `
                            <div class="egg-item" data-egg="${i}" onclick="CookingMinigame.crackEgg(${i})" style="
                                font-size: 120px;
                                cursor: pointer;
                                transition: all 0.2s;
                                filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));
                            " onmouseover="this.style.transform='scale(1.1) rotate(5deg)'" 
                               onmouseout="this.style.transform='scale(1) rotate(0deg)'">
                                🥚
                            </div>
                        `).join('')}
                    </div>
                    
                    <div class="info-box mt-20">
                        <strong>💡 Tip:</strong> Click each egg to crack it. Be gentle - cracking too fast might get shells in the bowl!
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        this.gameState.crackedEggs = 0;
        this.gameState.totalEggs = totalEggs;
    },
    
    crackEgg(eggId) {
        const egg = document.querySelector(`[data-egg="${eggId}"]`);
        if (!egg) return;
        
        // Animate cracking
        egg.style.transform = 'scale(1.3)';
        egg.textContent = '💥';
        
        setTimeout(() => {
            egg.style.opacity = '0';
            egg.style.transform = 'scale(0)';
            
            this.gameState.crackedEggs++;
            document.getElementById('eggCount').textContent = this.gameState.crackedEggs;
            
            const progress = (this.gameState.crackedEggs / this.gameState.totalEggs) * 100;
            document.getElementById('eggProgress').style.width = progress + '%';
            
            // Add to bowl
            const bowl = document.getElementById('bowlArea');
            if (this.gameState.crackedEggs === 1) {
                bowl.textContent = '🍜';
            }
            
            UI.showNotification('✓ Egg cracked!', 'success', 1000);
            
            if (this.gameState.crackedEggs >= this.gameState.totalEggs) {
                setTimeout(() => {
                    this.currentStep++;
                    this.nextStep();
                }, 800);
            }
        }, 200);
    },
    
    // ==================== WHISK STEP ====================
    showWhiskStep(data) {
        document.getElementById('cookingGame').remove();
        
        const overlay = document.createElement('div');
        overlay.className = 'minigame-overlay active';
        overlay.id = 'cookingGame';
        
        overlay.innerHTML = `
            <div class="minigame-container" style="max-width: 900px;">
                <div class="minigame-header">
                    <div class="minigame-title">🥄 Whisk the Eggs</div>
                    <div class="minigame-subtitle">Click and drag in circular motions to whisk!</div>
                    <div style="margin-top: 10px;">
                        <div class="progress-bar" style="height: 8px;">
                            <div class="progress-fill" id="whiskProgress" style="width: ${(this.currentStep / this.currentRecipe.steps.length) * 100}%; background: #4caf50;"></div>
                        </div>
                        <small>Step ${this.currentStep + 1} of ${this.currentRecipe.steps.length}</small>
                    </div>
                </div>
                
                <div style="margin: 30px 0;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <div id="whiskArea" style="
                            position: relative;
                            width: 400px;
                            height: 400px;
                            background: linear-gradient(135deg, #ffd89b, #19547b);
                            border-radius: 50%;
                            margin: 0 auto;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 80px;
                            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
                            cursor: pointer;
                            transition: transform 0.1s;
                        " onmousedown="CookingMinigame.startWhisking(event)">
                            🍜
                        </div>
                        <div style="font-size: 18px; font-weight: bold; color: #2c3e50; margin-top: 20px;">
                            Whisking Progress: <span id="whiskPercent">0</span>%
                        </div>
                    </div>
                    
                    <div class="info-box">
                        <strong>💡 Tip:</strong> Move your mouse in circles over the bowl to whisk. Keep whisking until the eggs are well-mixed!
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        this.gameState.whiskProgress = 0;
        this.gameState.last
