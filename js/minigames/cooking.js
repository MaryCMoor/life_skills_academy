// ==================== INTERACTIVE COOKING MAMA STYLE MINIGAME ====================

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
                { type: 'whisk', data: { target: 100 } },
                { type: 'heat', data: { targetTemp: 'medium' } },
                { type: 'stir', data: { duration: 8 } },
                { type: 'plate', data: {} }
            ]
        },
        'pasta': {
            name: '🍝 Spaghetti',
            difficulty: 'Easy',
            time: 15,
            skill: 8,
            ingredients: ['8 oz pasta', 'Water', 'Salt', '1 jar sauce'],
            steps: [
                { type: 'boil', data: { duration: 5 } },
                { type: 'pour', data: { item: 'pasta' } },
                { type: 'stir', data: { duration: 3 } },
                { type: 'drain', data: {} },
                { type: 'pour', data: { item: 'sauce' } },
                { type: 'plate', data: {} }
            ]
        },
        'sandwich': {
            name: '🥪 Sandwich',
            difficulty: 'Very Easy',
            time: 5,
            skill: 3,
            ingredients: ['2 slices bread', 'Deli meat', 'Cheese', 'Lettuce', 'Tomato'],
            steps: [
                { type: 'slice', data: { item: 'tomato', slices: 4 } },
                { type: 'stack', data: { layers: 5 } },
                { type: 'cut', data: { diagonal: true } },
                { type: 'plate', data: {} }
            ]
        },
        'pancakes': {
            name: '🥞 Pancakes',
            difficulty: 'Medium',
            time: 20,
            skill: 12,
            ingredients: ['1 cup flour', '2 eggs', '1 cup milk', 'Butter', 'Syrup'],
            steps: [
                { type: 'crack', data: { eggs: 2 } },
                { type: 'whisk', data: { target: 100 } },
                { type: 'pour', data: { item: 'batter' } },
                { type: 'heat', data: { targetTemp: 'medium' } },
                { type: 'flip', data: { timing: 3 } },
                { type: 'plate', data: {} }
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
                        Difficulty: ${recipe.difficulty} • Skill: +${recipe.skill}
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
                        <strong>🎮 Cooking Mama Style!</strong>
                        <p>Perform each action carefully - chop, stir, flip, and more!</p>
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
            'slice': () => this.showSliceStep(step.data),
            'chop': () => this.showChopStep(step.data),
            'stir': () => this.showStirStep(step.data),
            'heat': () => this.showHeatStep(step.data),
            'flip': () => this.showFlipStep(step.data),
            'pour': () => this.showPourStep(step.data),
            'boil': () => this.showBoilStep(step.data),
            'drain': () => this.showDrainStep(step.data),
            'stack': () => this.showStackStep(step.data),
            'cut': () => this.showCutStep(step.data),
            'plate': () => this.showPlateStep(step.data)
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
    
    // ==================== CRACK EGGS ====================
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
                    <div class="minigame-subtitle">Click each egg at the right moment when the line is in the green zone!</div>
                </div>
                
                <div style="margin: 30px 0;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <div style="font-size: 120px; margin-bottom: 20px;">🥣</div>
                        <div style="font-size: 18px; font-weight: bold;">
                            Eggs Cracked: <span id="eggCount">0</span> / ${totalEggs}
                        </div>
                    </div>
                    
                    <div id="crackMeter" style="
                        position: relative;
                        width: 400px;
                        height: 80px;
                        background: linear-gradient(to right, #e74c3c 0%, #e74c3c 20%, #27ae60 20%, #27ae60 80%, #e74c3c 80%, #e74c3c 100%);
                        margin: 30px auto;
                        border-radius: 10px;
                        border: 3px solid #333;
                    ">
                        <div id="crackIndicator" style="
                            position: absolute;
                            width: 10px;
                            height: 100%;
                            background: #fff;
                            box-shadow: 0 0 10px rgba(0,0,0,0.5);
                            left: 0;
                            transition: left 0.1s linear;
                        "></div>
                    </div>
                    
                    <div style="text-align: center; margin-top: 30px;">
                        <button class="btn btn-large" onclick="CookingMinigame.crackEgg()" style="
                            font-size: 24px;
                            padding: 20px 60px;
                            background: #3498db;
                            color: white;
                            border: none;
                            border-radius: 15px;
                            cursor: pointer;
                        ">🔨 CRACK!</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(newOverlay);
        
        this.gameState.crackedEggs = 0;
        this.gameState.totalEggs = totalEggs;
        this.gameState.indicatorPosition = 0;
        this.gameState.indicatorDirection = 1;
        
        // Animate indicator
        this.gameState.crackInterval = setInterval(() => {
            this.gameState.indicatorPosition += this.gameState.indicatorDirection * 2;
            
            if (this.gameState.indicatorPosition >= 100) {
                this.gameState.indicatorPosition = 100;
                this.gameState.indicatorDirection = -1;
            } else if (this.gameState.indicatorPosition <= 0) {
                this.gameState.indicatorPosition = 0;
                this.gameState.indicatorDirection = 1;
            }
            
            const indicator = document.getElementById('crackIndicator');
            if (indicator) {
                indicator.style.left = this.gameState.indicatorPosition + '%';
            }
        }, 20);
    },
    
    crackEgg() {
        const position = this.gameState.indicatorPosition;
        
        // Check if in green zone (20-80%)
        if (position >= 20 && position <= 80) {
            UI.showNotification('✅ Perfect crack!', 'success', 1000);
            this.gameState.crackedEggs++;
        } else {
            UI.showNotification('❌ Missed! Shell in the bowl!', 'error', 1000);
            this.mistakes.push({ step: 'crack', reason: 'Bad timing' });
            this.gameState.crackedEggs++;
        }
        
        document.getElementById('eggCount').textContent = this.gameState.crackedEggs;
        
        if (this.gameState.crackedEggs >= this.gameState.totalEggs) {
            clearInterval(this.gameState.crackInterval);
            setTimeout(() => {
                this.currentStep++;
                this.nextStep();
            }, 1000);
        }
    },
    
    // ==================== WHISK/STIR ====================
    showWhiskStep(data) {
        const overlay = document.getElementById('cookingGame');
        if (overlay) overlay.remove();
        
        const newOverlay = document.createElement('div');
        newOverlay.className = 'minigame-overlay active';
        newOverlay.id = 'cookingGame';
        
        newOverlay.innerHTML = `
            <div class="minigame-container" style="max-width: 900px;">
                <div class="minigame-header">
                    <div class="minigame-title">🥄 Whisk the Mixture</div>
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
                            position: relative;
                            overflow: hidden;
                        ">
                            <div id="whiskCursor" style="
                                position: absolute;
                                width: 40px;
                                height: 40px;
                                background: rgba(255,255,255,0.5);
                                border-radius: 50%;
                                pointer-events: none;
                                display: none;
                            "></div>
                            🍜
                        </div>
                        <div style="font-size: 18px; font-weight: bold; margin-top: 20px;">
                            Whisking Progress: <span id="whiskPercent">0</span>%
                        </div>
                        <div class="progress-bar" style="height: 30px; margin-top: 10px; max-width: 400px; margin-left: auto; margin-right: auto;">
                            <div class="progress-fill" style="width: 0%; transition: width 0.1s;">0%</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(newOverlay);
        
        this.gameState.whiskProgress = 0;
        this.gameState.lastX = 0;
        this.gameState.lastY = 0;
        this.setupWhisking();
    },
    
    setupWhisking() {
        const whiskArea = document.getElementById('whiskArea');
        const cursor = document.getElementById('whiskCursor');
        
        whiskArea.addEventListener('mouseenter', () => {
            cursor.style.display = 'block';
        });
        
        whiskArea.addEventListener('mouseleave', () => {
            cursor.style.display = 'none';
        });
        
        whiskArea.addEventListener('mousemove', (e) => {
            const rect = whiskArea.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            cursor.style.left = (x - 20) + 'px';
            cursor.style.top = (y - 20) + 'px';
            
            if (this.gameState.lastX && this.gameState.lastY) {
                const dx = x - this.gameState.lastX;
                const dy = y - this.gameState.lastY;
                const movement = Math.sqrt(dx * dx + dy * dy);
                
                if (movement > 3) {
                    this.gameState.whiskProgress += movement * 0.2;
                    this.gameState.whiskProgress = Math.min(100, this.gameState.whiskProgress);
                    
                    const progress = Math.floor(this.gameState.whiskProgress);
                    document.getElementById('whiskPercent').textContent = progress;
                    
                    const progressFill = document.querySelector('#cookingGame .progress-fill');
                    if (progressFill) {
                        progressFill.style.width = progress + '%';
                        progressFill.textContent = progress + '%';
                    }
                    
                    if (this.gameState.whiskProgress >= 100) {
                        whiskArea.removeEventListener('mousemove', arguments.callee);
                        UI.showNotification('✅ Perfect mix!', 'success');
                        setTimeout(() => {
                            this.currentStep++;
                            this.nextStep();
                        }, 1000);
                    }
                }
            }
            
            this.gameState.lastX = x;
            this.gameState.lastY = y;
        });
    },
    
    // ==================== SLICE/CHOP ====================
    showSliceStep(data) {
        const overlay = document.getElementById('cookingGame');
        if (overlay) overlay.remove();
        
        const newOverlay = document.createElement('div');
        newOverlay.className = 'minigame-overlay active';
        newOverlay.id = 'cookingGame';
        
        const item = data.item || 'vegetable';
        const targetSlices = data.slices || 4;
        
        newOverlay.innerHTML = `
            <div class="minigame-container" style="max-width: 900px;">
                <div class="minigame-header">
                    <div class="minigame-title">🔪 Slice the ${item}</div>
                    <div class="minigame-subtitle">Click to slice! Make ${targetSlices} even cuts!</div>
                </div>
                
                <div style="margin: 30px 0; text-align: center;">
                    <div id="sliceArea" style="
                        width: 400px;
                        height: 200px;
                        background: #e74c3c;
                        margin: 0 auto;
                        border-radius: 50%;
                        position: relative;
                        cursor: crosshair;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 80px;
                    " onclick="CookingMinigame.makeSlice()">
                        🍅
                    </div>
                    
                    <div style="font-size: 18px; font-weight: bold; margin-top: 20px;">
                        Slices Made: <span id="sliceCount">0</span> / ${targetSlices}
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(newOverlay);
        
        this.gameState.slices = 0;
        this.gameState.targetSlices = targetSlices;
    },
    
    makeSlice() {
        this.gameState.slices++;
        document.getElementById('sliceCount').textContent = this.gameState.slices;
        
        const sliceArea = document.getElementById('sliceArea');
        
        // Add slice line animation
        const sliceLine = document.createElement('div');
        sliceLine.style.cssText = `
            position: absolute;
            width: 100%;
            height: 3px;
            background: white;
            top: ${(this.gameState.slices / (this.gameState.targetSlices + 1)) * 100}%;
            box-shadow: 0 0 10px white;
            animation: sliceFlash 0.5s;
        `;
        sliceArea.appendChild(sliceLine);
        
        UI.showNotification('✂️ Slice!', 'success', 500);
        
        if (this.gameState.slices >= this.gameState.targetSlices) {
            sliceArea.style.pointerEvents = 'none';
            setTimeout(() => {
                this.currentStep++;
                this.nextStep();
            }, 1000);
        }
    },
    
    // ==================== STIR ====================
    showStirStep(data) {
        this.showWhiskStep(data); // Similar to whisk
    },
    
    // ==================== HEAT CONTROL ====================
    showHeatStep(data) {
        const overlay = document.getElementById('cookingGame');
        if (overlay) overlay.remove();
        
        const newOverlay = document.createElement('div');
        newOverlay.className = 'minigame-overlay active';
        newOverlay.id = 'cookingGame';
        
        const targetTemp = data.targetTemp || 'medium';
        
        newOverlay.innerHTML = `
            <div class="minigame-container" style="max-width: 900px;">
                <div class="minigame-header">
                    <div class="minigame-title">🔥 Set the Heat</div>
                    <div class="minigame-subtitle">Adjust to ${targetTemp} heat!</div>
                </div>
                
                <div style="margin: 30px 0; text-align: center;">
                    <div style="font-size: 100px; margin-bottom: 30px;" id="stoveDisplay">🔥</div>
                    
                    <div style="margin: 30px 0;">
                        <div style="font-size: 24px; font-weight: bold; margin-bottom: 15px;">
                            Current: <span id="currentHeat" style="color: #e74c3c;">OFF</span>
                        </div>
                        
                        <input type="range" id="heatSlider" min="0" max="100" value="0" style="
                            width: 400px;
                            height: 20px;
                            -webkit-appearance: none;
                            background: linear-gradient(to right, #3498db, #f39c12, #e74c3c);
                            border-radius: 10px;
                            outline: none;
                        " oninput="CookingMinigame.updateHeat(this.value)">
                        
                        <div style="display: flex; justify-content: space-between; width: 400px; margin: 10px auto; font-size: 12px; color: #7f8c8d;">
                            <span>OFF</span>
                            <span>LOW</span>
                            <span>MEDIUM</span>
                            <span>HIGH</span>
                        </div>
                    </div>
                    
                    <button class="btn btn-success btn-large" id="confirmHeat" disabled onclick="CookingMinigame.confirmHeat()" style="margin-top: 20px;">
                        ✓ Confirm Heat
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(newOverlay);
        
        this.gameState.targetTemp = targetTemp;
        this.gameState.currentHeatValue = 0;
    },
    
    updateHeat(value) {
        this.gameState.currentHeatValue = parseInt(value);
        const display = document.getElementById('currentHeat');
        const stove = document.getElementById('stoveDisplay');
        const btn = document.getElementById('confirmHeat');
        
        let heatLevel = 'OFF';
        let color = '#95a5a6';
        
        if (value > 70) {
            heatLevel = 'HIGH';
            color = '#e74c3c';
            stove.textContent = '🔥🔥🔥';
        } else if (value > 40) {
            heatLevel = 'MEDIUM';
            color = '#f39c12';
            stove.textContent = '🔥🔥';
        } else if (value > 10) {
            heatLevel = 'LOW';
            color = '#3498db';
            stove.textContent = '🔥';
        } else {
            heatLevel = 'OFF';
            stove.textContent = '⚫';
        }
        
        display.textContent = heatLevel;
        display.style.color = color;
        
        // Enable button if close to target
        const target = this.gameState.targetTemp.toUpperCase();
        btn.disabled = (heatLevel !== target);
    },
    
    confirmHeat() {
        UI.showNotification('✅ Perfect temperature!', 'success');
        setTimeout(() => {
            this.currentStep++;
            this.nextStep();
        }, 1000);
    },
    
    // ==================== FLIP ====================
    showFlipStep(data) {
        const overlay = document.getElementById('cookingGame');
        if (overlay) overlay.remove();
        
        const newOverlay = document.createElement('div');
        newOverlay.className = 'minigame-overlay active';
        newOverlay.id = 'cookingGame';
        
        newOverlay.innerHTML = `
            <div class="minigame-container" style="max-width: 900px;">
                <div class="minigame-header">
                    <div class="minigame-title">🥞 Flip It!</div>
                    <div class="minigame-subtitle">Press SPACE at the right moment!</div>
                </div>
                
                <div style="margin: 30px 0; text-align: center;">
                    <div id="flipItem" style="
                        font-size: 150px;
                        margin: 50px 0;
                        transform: rotate(0deg);
                        transition: transform 0.8s;
                    ">🥞</div>
                    
                    <div style="font-size: 20px; color: #7f8c8d; margin-top: 30px;">
                        Press <kbd style="background: #3498db; color: white; padding: 10px 20px; border-radius: 5px; font-size: 18px;">SPACE</kbd> to flip!
                    </div>
                    
                    <div style="margin-top: 30px;">
                        <div class="progress-bar" style="height: 30px; max-width: 400px; margin: 0 auto;">
                            <div class="progress-fill" id="flipProgress" style="width: 0%; transition: width 0.1s; background: #f39c12;">0%</div>
                        </div>
                        <div style="margin-top: 10px; font-size: 14px; color: #7f8c8d;">Doneness: <span id="flipPercent">0</span>%</div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(newOverlay);
        
        this.gameState.flipProgress = 0;
        this.gameState.flipped = false;
        
        // Progress increases over time
        this.gameState.flipInterval = setInterval(() => {
            if (!this.gameState.flipped) {
                this.gameState.flipProgress += 2;
                
                const progress = Math.min(100, this.gameState.flipProgress);
                const progressBar = document.getElementById('flipProgress');
                const progressText = document.getElementById('flipPercent');
                
                if (progressBar) progressBar.style.width = progress + '%';
                if (progressText) progressText.textContent = progress;
                
                // Change color based on doneness
                if (progress > 80) {
                    if (progressBar) progressBar.style.background = '#e74c3c';
                } else if (progress > 40) {
                    if (progressBar) progressBar.style.background = '#f39c12';
                } else {
                    if (progressBar) progressBar.style.background = '#3498db';
                }
                
                if (progress >= 100) {
                    clearInterval(this.gameState.flipInterval);
                    UI.showNotification('❌ Burned!', 'error');
                    this.mistakes.push({ step: 'flip', reason: 'Burned' });
                    setTimeout(() => {
                        this.currentStep++;
                        this.nextStep();
                    }, 1500);
                }
            }
        }, 100);
        
        // Listen for spacebar
        this.gameState.flipHandler = (e) => {
            if (e.code === 'Space' && !this.gameState.flipped) {
                e.preventDefault();
                this.performFlip();
            }
        };
        
        document.addEventListener('keydown', this.gameState.flipHandler);
    },
    
    performFlip() {
        this.gameState.flipped = true;
        clearInterval(this.gameState.flipInterval);
        document.removeEventListener('keydown', this.gameState.flipHandler);
        
        const flipItem = document.getElementById('flipItem');
        flipItem.style.transform = 'rotate(360deg) scale(1.2)';
        
        const progress = this.gameState.flipProgress;
        
        if (progress >= 40 && progress <= 70) {
            UI.showNotification('✅ Perfect flip!', 'success');
        } else if (progress < 40) {
            UI.showNotification('⚠️ A bit undercooked!', 'warning');
            this.mistakes.push({ step: 'flip', reason: 'Undercooked' });
        } else {
            UI.showNotification('⚠️ Slightly overdone!', 'warning');
            this.mistakes.push({ step: 'flip', reason: 'Overdone' });
        }
        
        setTimeout(() => {
            this.currentStep++;
            this.nextStep();
        }, 1500);
    },
    
    // ==================== POUR ====================
    showPourStep(data) {
        const overlay = document.getElementById('cookingGame');
        if (overlay) overlay.remove();
        
        const newOverlay = document.createElement('div');
        newOverlay.className = 'minigame-overlay active';
        newOverlay.id = 'cookingGame';
        
        const item = data.item || 'liquid';
        
        newOverlay.innerHTML = `
            <div class="minigame-container" style="max-width: 900px;">
                <div class="minigame-header">
                    <div class="minigame-title">🫗 Pour ${item}</div>
                    <div class="minigame-subtitle">Hold the mouse button to pour - stop at the line!</div>
                </div>
                
                <div style="margin: 30px 0; text-align: center;">
                    <div style="position: relative; width: 200px; height: 400px; margin: 0 auto;">
                        <div style="
                            position: absolute;
                            bottom: 0;
                            left: 0;
                            right: 0;
                            border: 5px solid #333;
                            border-radius: 0 0 20px 20px;
                            height: 350px;
                            background: linear-gradient(to top, rgba(52,152,219,0.2), transparent);
                        ">
                            <div id="liquidLevel" style="
                                position: absolute;
                                bottom: 0;
                                left: 0;
                                right: 0;
                                background: linear-gradient(to top, #3498db, #5dade2);
                                height: 0%;
                                transition: height 0.1s linear;
                                border-radius: 0 0 15px 15px;
                            "></div>
                            
                            <div style="
                                position: absolute;
                                top: 50%;
                                left: -30px;
                                right: -30px;
                                height: 3px;
                                background: #27ae60;
                                border: 2px dashed #27ae60;
                            "></div>
                            
                            <div style="
                                position: absolute;
                                top: 50%;
                                right: -80px;
                                transform: translateY(-50%);
                                background: #27ae60;
                                color: white;
                                padding: 5px 10px;
                                border-radius: 5px;
                                font-size: 12px;
                            ">← STOP HERE</div>
                        </div>
                        
                        <div id="bottle" style="
                            position: absolute;
                            top: -60px;
                            left: 50%;
                            transform: translateX(-50%);
                            font-size: 80px;
                        ">🍶</div>
                    </div>
                    
                    <div style="margin-top: 30px;">
                        <button class="btn btn-large" id="pourBtn" 
                            onmousedown="CookingMinigame.startPour()" 
                            onmouseup="CookingMinigame.stopPour()"
                            ontouchstart="CookingMinigame.startPour()"
                            ontouchend="CookingMinigame.stopPour()"
                            style="font-size: 18px; padding: 15px 40px;">
                            🫗 Hold to Pour
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(newOverlay);
        
        this.gameState.pourLevel = 0;
        this.gameState.pouring = false;
        this.gameState.pourComplete = false;
    },
    
    startPour() {
        if (this.gameState.pourComplete) return;
        
        this.gameState.pouring = true;
        
        this.gameState.pourInterval = setInterval(() => {
            if (this.gameState.pouring && !this.gameState.pourComplete) {
                this.gameState.pourLevel += 1;
                
                const liquidLevel = document.getElementById('liquidLevel');
                if (liquidLevel) {
                    liquidLevel.style.height = Math.min(100, this.gameState.pourLevel) + '%';
                }
                
                // Check if overflowed
                if (this.gameState.pourLevel > 55) {
                    this.stopPour();
                    this.gameState.pourComplete = true;
                    UI.showNotification('❌ Overfilled!', 'error');
                    this.mistakes.push({ step: 'pour', reason: 'Overfilled' });
                    
                    setTimeout(() => {
                        this.currentStep++;
                        this.nextStep();
                    }, 1500);
                }
            }
        }, 50);
    },
    
    stopPour() {
        this.gameState.pouring = false;
        clearInterval(this.gameState.pourInterval);
        
        if (this.gameState.pourComplete) return;
        
        // Check if in range (45-55%)
        if (this.gameState.pourLevel >= 45 && this.gameState.pourLevel <= 55) {
            this.gameState.pourComplete = true;
            UI.showNotification('✅ Perfect amount!', 'success');
            
            setTimeout(() => {
                this.currentStep++;
                this.nextStep();
            }, 1000);
        } else if (this.gameState.pourLevel < 45) {
            UI.showNotification('⚠️ Keep pouring!', 'warning');
        }
    },
    
    // ==================== SIMPLE STEPS ====================
    showBoilStep(data) {
        const duration = data.duration || 5;
        this.simpleTimerStep('💧 Boiling Water', 'Waiting for water to boil...', duration);
    },
    
    showDrainStep(data) {
        this.simpleTimerStep('🍝 Draining', 'Draining the water...', 2);
    },
    
    showStackStep(data) {
        this.simpleTimerStep('🥪 Stacking', 'Layering ingredients...', 3);
    },
    
    showCutStep(data) {
        this.simpleTimerStep('🔪 Cutting', 'Cutting in half...', 2);
    },
    
    showPlateStep(data) {
        this.simpleTimerStep('🍽️ Plating', 'Arranging on plate...', 2);
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
    
    // ==================== RESULTS ====================
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
        // Cleanup intervals and event listeners
        if (this.gameState.crackInterval) clearInterval(this.gameState.crackInterval);
        if (this.gameState.flipInterval) clearInterval(this.gameState.flipInterval);
        if (this.gameState.pourInterval) clearInterval(this.gameState.pourInterval);
        if (this.gameState.flipHandler) document.removeEventListener('keydown', this.gameState.flipHandler);
        
        const overlay = document.getElementById('cookingGame');
        if (overlay && overlay.parentNode) {
            overlay.parentNode.removeChild(overlay);
        }
        GameState.clearBusy();
    }
};

// Add CSS for animations
if (!document.getElementById('cooking-animations')) {
    const style = document.createElement('style');
    style.id = 'cooking-animations';
    style.textContent = `
        @keyframes sliceFlash {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.3; }
        }
        
        @keyframes placeItem {
            0% { transform: scale(1.2); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
        }
        
        input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 30px;
            height: 30px;
            background: white;
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        }
        
        kbd {
            font-family: monospace;
        }
    `;
    document.head.appendChild(style);
}

console.log('✅ cooking.js loaded - Interactive Cooking Mama ready');
