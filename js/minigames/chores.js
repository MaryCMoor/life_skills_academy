// ==================== CHORE MINIGAMES ====================

const ChoreMinigames = {
    currentChore: null,
    gameData: {},
    
    start(choreType) {
        this.currentChore = choreType;
        this.gameData = {};
        
        const overlay = document.createElement('div');
        overlay.id = 'choreMinigameOverlay';
        overlay.className = 'minigame-overlay';
        
        switch(choreType) {
            case 'bed':
                overlay.innerHTML = this.renderBedMinigame();
                break;
            case 'dishes':
                overlay.innerHTML = this.renderDishesMinigame();
                break;
            case 'vacuum':
                overlay.innerHTML = this.renderVacuumMinigame();
                break;
            case 'trash':
                overlay.innerHTML = this.renderTrashMinigame();
                break;
            default:
                console.error('Unknown chore type:', choreType);
                return;
        }
        
        document.body.appendChild(overlay);
        
        // Initialize game logic after DOM is ready
        setTimeout(() => {
            this.initGame(choreType);
        }, 100);
    },
    
    close() {
        const overlay = document.getElementById('choreMinigameOverlay');
        if (overlay) {
            overlay.remove();
        }
        this.currentChore = null;
        this.gameData = {};
    },
    
    complete(choreType) {
        const chores = {
            bed: { name: 'Making the Bed', duration: 2, reward: 5, energy: -2 },
            dishes: { name: 'Washing Dishes', duration: 5, reward: 10, energy: -5 },
            vacuum: { name: 'Vacuuming', duration: 10, reward: 15, energy: -10 },
            trash: { name: 'Taking Out Trash', duration: 2, reward: 5, energy: -3 },
            laundry: { name: 'Doing Laundry', duration: 15, reward: 20, energy: -15 }
        };
        
        const chore = chores[choreType];
        if (!chore) return;
        
        // Advance time
        if (typeof TimeManager !== 'undefined' && TimeManager.advanceTime) {
            TimeManager.advanceTime(chore.duration);
        }
        
        // FIXED: Use proper GameState.addMoney method
        GameState.addMoney(chore.reward, `chore: ${chore.name}`);
        GameState.needs.energy = Math.max(0, GameState.needs.energy + chore.energy);
        GameState.needs.hygiene = Math.min(100, GameState.needs.hygiene + 5);
        GameState.needs.happiness = Math.min(100, GameState.needs.happiness + 10);
        
        // Add skill
        const skillMap = {
            bed: 'organization',
            dishes: 'cleaning',
            vacuum: 'cleaning',
            trash: 'responsibility',
            laundry: 'laundry'
        };
        
        const skill = skillMap[choreType];
        if (skill) {
            GameState.addSkill(skill, 5);
        }
        
        // Record completion
        GameState.completeChore(choreType);
        if (!GameState.stats.choresCompleted) GameState.stats.choresCompleted = 0;
        GameState.stats.choresCompleted++;
        
        UI.showNotification(
            `✅ ${chore.name} complete! +$${chore.reward}, +10 Happiness`,
            'success'
        );
        
        if (GameState.stats.choresCompleted >= 10) {
            GameState.addAchievement('Clean Freak', 'Complete 10 chores', '🧹');
        }
        
        this.close();
        
        if (typeof UI !== 'undefined') {
            UI.updateStats();
        }
        
        if (typeof loadHome === 'function') {
            loadHome();
        }
    },
    
    // ==================== BED MAKING MINIGAME ====================
    
    renderBedMinigame() {
        return `
            <div class="minigame-container">
                <div class="minigame-header">
                    <h2>🛏️ Make Your Bed</h2>
                    <button class="minigame-close" onclick="ChoreMinigames.close()">✖</button>
                </div>
                
                <div class="minigame-content">
                    <p>Click the items in the correct order to make your bed!</p>
                    
                    <div id="bedProgress" style="margin: 20px 0;">
                        <div class="progress-bar">
                            <div class="progress-fill" id="bedProgressFill" style="width: 0%;"></div>
                        </div>
                        <p id="bedStep">Step 1: Straighten the sheets</p>
                    </div>
                    
                    <div id="bedGame" style="position: relative; width: 100%; height: 300px; background: #ecf0f1; border-radius: 10px; overflow: hidden;">
                        <!-- Bed items will be added here -->
                    </div>
                    
                    <div style="margin-top: 20px; text-align: center;">
                        <button class="btn btn-secondary" onclick="ChoreMinigames.close()">Cancel</button>
                    </div>
                </div>
            </div>
        `;
    },
    
    initGame(choreType) {
        if (choreType === 'bed') {
            this.initBedGame();
        } else if (choreType === 'dishes') {
            this.initDishesGame();
        } else if (choreType === 'vacuum') {
            this.initVacuumGame();
        } else if (choreType === 'trash') {
            this.initTrashGame();
        }
    },
    
    initBedGame() {
        this.gameData.currentStep = 0;
        this.gameData.steps = [
            { id: 'sheets', name: 'Straighten the sheets', icon: '📄', color: '#ecf0f1' },
            { id: 'blanket', name: 'Add the blanket', icon: '🟦', color: '#3498db' },
            { id: 'pillow', name: 'Fluff the pillow', icon: '◻️', color: '#95a5a6' },
            { id: 'finish', name: 'Smooth everything', icon: '✨', color: '#2ecc71' }
        ];
        
        const bedGame = document.getElementById('bedGame');
        if (!bedGame) return;
        
        this.gameData.steps.forEach(step => {
            const item = document.createElement('div');
            item.className = 'bed-item';
            item.style.cssText = `
                position: absolute;
                width: 200px;
                height: 100px;
                background: ${step.color};
                border: 3px solid #2c3e50;
                border-radius: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 48px;
                cursor: pointer;
                transition: all 0.3s;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
            `;
            item.textContent = step.icon;
            item.dataset.stepId = step.id;
            item.onclick = () => this.handleBedClick(step.id);
            bedGame.appendChild(item);
        });
        
        this.updateBedDisplay();
    },
    
    handleBedClick(stepId) {
        const currentStep = this.gameData.steps[this.gameData.currentStep];
        
        if (stepId === currentStep.id) {
            this.gameData.currentStep++;
            
            if (this.gameData.currentStep >= this.gameData.steps.length) {
                this.complete('bed');
            } else {
                this.updateBedDisplay();
            }
        } else {
            UI.showNotification('❌ Wrong order! Try again.', 'error');
        }
    },
    
    updateBedDisplay() {
        const progress = (this.gameData.currentStep / this.gameData.steps.length) * 100;
        const progressFill = document.getElementById('bedProgressFill');
        const stepText = document.getElementById('bedStep');
        
        if (progressFill) {
            progressFill.style.width = progress + '%';
        }
        
        if (stepText && this.gameData.currentStep < this.gameData.steps.length) {
            const currentStep = this.gameData.steps[this.gameData.currentStep];
            stepText.textContent = `Step ${this.gameData.currentStep + 1}: ${currentStep.name}`;
        }
        
        // Hide completed items
        const bedGame = document.getElementById('bedGame');
        if (bedGame) {
            const items = bedGame.querySelectorAll('.bed-item');
            items.forEach(item => {
                const stepId = item.dataset.stepId;
                const stepIndex = this.gameData.steps.findIndex(s => s.id === stepId);
                
                if (stepIndex < this.gameData.currentStep) {
                    item.style.opacity = '0.3';
                    item.style.pointerEvents = 'none';
                } else if (stepIndex === this.gameData.currentStep) {
                    item.style.transform = 'translate(-50%, -50%) scale(1.1)';
                    item.style.boxShadow = '0 0 20px rgba(52, 152, 219, 0.8)';
                } else {
                    item.style.opacity = '0.5';
                    item.style.pointerEvents = 'none';
                }
            });
        }
    },
    
    // ==================== DISHES MINIGAME ====================
    
    renderDishesMinigame() {
        return `
            <div class="minigame-container">
                <div class="minigame-header">
                    <h2>🍽️ Wash the Dishes</h2>
                    <button class="minigame-close" onclick="ChoreMinigames.close()">✖</button>
                </div>
                
                <div class="minigame-content">
                    <p>Click the dirty dishes to wash them clean!</p>
                    
                    <div id="dishProgress" style="margin: 20px 0;">
                        <div class="progress-bar">
                            <div class="progress-fill" id="dishProgressFill" style="width: 0%;"></div>
                        </div>
                        <p id="dishCount">0 / 10 dishes cleaned</p>
                    </div>
                    
                    <div id="dishGame" style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; margin: 20px 0;">
                        <!-- Dishes will be added here -->
                    </div>
                    
                    <div style="margin-top: 20px; text-align: center;">
                        <button class="btn btn-secondary" onclick="ChoreMinigames.close()">Cancel</button>
                    </div>
                </div>
            </div>
        `;
    },
    
    initDishesGame() {
        this.gameData.totalDishes = 10;
        this.gameData.cleanedDishes = 0;
        
        const dishGame = document.getElementById('dishGame');
        if (!dishGame) return;
        
        const dishIcons = ['🍽️', '🥄', '🍴', '🥣', '🍵'];
        
        for (let i = 0; i < this.gameData.totalDishes; i++) {
            const dish = document.createElement('div');
            dish.className = 'dish-item dirty';
            dish.style.cssText = `
                background: #95a5a6;
                padding: 20px;
                border-radius: 10px;
                text-align: center;
                font-size: 32px;
                cursor: pointer;
                transition: all 0.3s;
                border: 3px solid #7f8c8d;
            `;
            dish.textContent = dishIcons[i % dishIcons.length];
            dish.onclick = () => this.handleDishClick(dish, i);
            dishGame.appendChild(dish);
        }
    },
    
    handleDishClick(dishElement, dishId) {
        if (dishElement.classList.contains('clean')) {
            return;
        }
        
        dishElement.classList.remove('dirty');
        dishElement.classList.add('clean');
        dishElement.style.background = '#2ecc71';
        dishElement.style.borderColor = '#27ae60';
        dishElement.style.cursor = 'default';
        
        this.gameData.cleanedDishes++;
        
        const progress = (this.gameData.cleanedDishes / this.gameData.totalDishes) * 100;
        const progressFill = document.getElementById('dishProgressFill');
        const countText = document.getElementById('dishCount');
        
        if (progressFill) {
            progressFill.style.width = progress + '%';
        }
        
        if (countText) {
            countText.textContent = `${this.gameData.cleanedDishes} / ${this.gameData.totalDishes} dishes cleaned`;
        }
        
        if (this.gameData.cleanedDishes >= this.gameData.totalDishes) {
            setTimeout(() => {
                this.complete('dishes');
            }, 500);
        }
    },
    
    // ==================== VACUUM MINIGAME ====================
    
    renderVacuumMinigame() {
        return `
            <div class="minigame-container">
                <div class="minigame-header">
                    <h2>🧹 Vacuum the Floor</h2>
                    <button class="minigame-close" onclick="ChoreMinigames.close()">✖</button>
                </div>
                
                <div class="minigame-content">
                    <p>Use WASD or Arrow Keys to move and clean all the dirt!</p>
                    
                    <div id="vacuumProgress" style="margin: 20px 0;">
                        <div class="progress-bar">
                            <div class="progress-fill" id="vacuumProgressFill" style="width: 0%;"></div>
                        </div>
                        <p id="vacuumCount">0 / 15 dirt spots cleaned</p>
                    </div>
                    
                    <div id="vacuumGame" style="position: relative; width: 100%; height: 400px; background: #ecf0f1; border-radius: 10px; overflow: hidden; border: 3px solid #2c3e50;">
                        <!-- Game will be rendered here -->
                    </div>
                    
                    <div style="margin-top: 20px; text-align: center;">
                        <p style="color: #7f8c8d;">Use WASD or Arrow Keys to move</p>
                        <button class="btn btn-secondary" onclick="ChoreMinigames.close()">Cancel</button>
                    </div>
                </div>
            </div>
        `;
    },
    
    initVacuumGame() {
        this.gameData.totalDirt = 15;
        this.gameData.cleanedDirt = 0;
        this.gameData.playerX = 50;
        this.gameData.playerY = 50;
        this.gameData.dirtSpots = [];
        
        const vacuumGame = document.getElementById('vacuumGame');
        if (!vacuumGame) return;
        
        // Create player
        const player = document.createElement('div');
        player.id = 'vacuumPlayer';
        player.style.cssText = `
            position: absolute;
            width: 40px;
            height: 40px;
            background: #3498db;
            border-radius: 50%;
            left: ${this.gameData.playerX}px;
            top: ${this.gameData.playerY}px;
            transition: all 0.1s;
            z-index: 10;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
        `;
        player.textContent = '🧹';
        vacuumGame.appendChild(player);
        
        // Create dirt spots
        for (let i = 0; i < this.gameData.totalDirt; i++) {
            const dirt = document.createElement('div');
            const x = Math.random() * (vacuumGame.offsetWidth - 30);
            const y = Math.random() * (vacuumGame.offsetHeight - 30);
            
            dirt.className = 'dirt-spot';
            dirt.style.cssText = `
                position: absolute;
                width: 20px;
                height: 20px;
                background: #8b4513;
                border-radius: 50%;
                left: ${x}px;
                top: ${y}px;
            `;
            
            this.gameData.dirtSpots.push({ element: dirt, x, y, cleaned: false });
            vacuumGame.appendChild(dirt);
        }
        
        // Add keyboard controls
        this.gameData.keyHandler = (e) => this.handleVacuumKeys(e);
        document.addEventListener('keydown', this.gameData.keyHandler);
    },
    
    handleVacuumKeys(e) {
        const key = e.key.toLowerCase();
        const speed = 20;
        
        if (['w', 'a', 's', 'd', 'arrowup', 'arrowleft', 'arrowdown', 'arrowright'].includes(key)) {
            e.preventDefault();
            
            const vacuumGame = document.getElementById('vacuumGame');
            const player = document.getElementById('vacuumPlayer');
            if (!vacuumGame || !player) return;
            
            const maxX = vacuumGame.offsetWidth - 40;
            const maxY = vacuumGame.offsetHeight - 40;
            
            if (key === 'w' || key === 'arrowup') {
                this.gameData.playerY = Math.max(0, this.gameData.playerY - speed);
            } else if (key === 's' || key === 'arrowdown') {
                this.gameData.playerY = Math.min(maxY, this.gameData.playerY + speed);
            } else if (key === 'a' || key === 'arrowleft') {
                this.gameData.playerX = Math.max(0, this.gameData.playerX - speed);
            } else if (key === 'd' || key === 'arrowright') {
                this.gameData.playerX = Math.min(maxX, this.gameData.playerX + speed);
            }
            
            player.style.left = this.gameData.playerX + 'px';
            player.style.top = this.gameData.playerY + 'px';
            
            this.checkVacuumCollisions();
        }
    },
    
    checkVacuumCollisions() {
        this.gameData.dirtSpots.forEach(dirt => {
            if (dirt.cleaned) return;
            
            const dx = this.gameData.playerX - dirt.x;
            const dy = this.gameData.playerY - dirt.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 30) {
                dirt.cleaned = true;
                dirt.element.remove();
                this.gameData.cleanedDirt++;
                
                const progress = (this.gameData.cleanedDirt / this.gameData.totalDirt) * 100;
                const progressFill = document.getElementById('vacuumProgressFill');
                const countText = document.getElementById('vacuumCount');
                
                if (progressFill) {
                    progressFill.style.width = progress + '%';
                }
                
                if (countText) {
                    countText.textContent = `${this.gameData.cleanedDirt} / ${this.gameData.totalDirt} dirt spots cleaned`;
                }
                
                if (this.gameData.cleanedDirt >= this.gameData.totalDirt) {
                    document.removeEventListener('keydown', this.gameData.keyHandler);
                    setTimeout(() => {
                        this.complete('vacuum');
                    }, 500);
                }
            }
        });
    },
    
    // ==================== TRASH MINIGAME ====================
    
    renderTrashMinigame() {
        return `
            <div class="minigame-container">
                <div class="minigame-header">
                    <h2>🗑️ Take Out the Trash</h2>
                    <button class="minigame-close" onclick="ChoreMinigames.close()">✖</button>
                </div>
                
                <div class="minigame-content">
                    <p>Drag the trash bag to the outdoor bin!</p>
                    
                    <div id="trashGame" style="position: relative; width: 100%; height: 400px; background: linear-gradient(180deg, #ecf0f1 0%, #bdc3c7 100%); border-radius: 10px; overflow: hidden; border: 3px solid #2c3e50;">
                        <div id="trashBag" style="position: absolute; left: 50px; top: 50px; cursor: move; font-size: 64px;">🗑️</div>
                        <div id="trashBin" style="position: absolute; right: 50px; bottom: 50px; font-size: 80px;">🚮</div>
                        <div style="position: absolute; bottom: 10px; left: 10px; color: #7f8c8d; font-size: 14px;">
                            ← Drag the trash bag to the bin →
                        </div>
                    </div>
                    
                    <div style="margin-top: 20px; text-align: center;">
                        <button class="btn btn-secondary" onclick="ChoreMinigames.close()">Cancel</button>
                    </div>
                </div>
            </div>
        `;
    },
    
    initTrashGame() {
        const trashBag = document.getElementById('trashBag');
        const trashBin = document.getElementById('trashBin');
        const trashGame = document.getElementById('trashGame');
        
        if (!trashBag || !trashBin || !trashGame) return;
        
        let isDragging = false;
        let offsetX = 0;
        let offsetY = 0;
        
        trashBag.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - trashBag.offsetLeft;
            offsetY = e.clientY - trashBag.offsetTop;
            trashBag.style.cursor = 'grabbing';
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            const gameRect = trashGame.getBoundingClientRect();
            let x = e.clientX - gameRect.left - offsetX;
            let y = e.clientY - gameRect.top - offsetY;
            
            x = Math.max(0, Math.min(x, trashGame.offsetWidth - 64));
            y = Math.max(0, Math.min(y, trashGame.offsetHeight - 64));
            
            trashBag.style.left = x + 'px';
            trashBag.style.top = y + 'px';
            
            // Check collision with bin
            const bagRect = trashBag.getBoundingClientRect();
            const binRect = trashBin.getBoundingClientRect();
            
            if (this.checkCollision(bagRect, binRect)) {
                isDragging = false;
                trashBag.style.display = 'none';
                UI.showNotification('🎉 Trash taken out!', 'success');
                setTimeout(() => {
                    this.complete('trash');
                }, 500);
            }
        });
        
        document.addEventListener('mouseup', () => {
            isDragging = false;
            trashBag.style.cursor = 'move';
        });
    },
    
    checkCollision(rect1, rect2) {
        return !(rect1.right < rect2.left || 
                rect1.left > rect2.right || 
                rect1.bottom < rect2.top || 
                rect1.top > rect2.bottom);
    }
};

console.log('✅ chores.js loaded');
