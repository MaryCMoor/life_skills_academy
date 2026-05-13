// ==================== CHORE MINIGAMES ====================
// All household chores with interactive minigames

const ChoreMinigames = {
    currentChore: null,
    
    // Start a chore minigame
    start(choreType) {
        this.currentChore = choreType;
        
        switch(choreType) {
            case 'bed':
                this.bedGame();
                break;
            case 'dishes':
                this.dishesGame();
                break;
            case 'vacuum':
                this.vacuumGame();
                break;
            case 'trash':
                this.trashGame();
                break;
            case 'laundry':
                this.laundryGame();
                break;
            default:
                console.error('Unknown chore type:', choreType);
        }
    },
    
    // Complete chore and give rewards
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
        
        // Advance time by chore duration
        if (typeof TimeManager !== 'undefined' && TimeManager.advanceTime) {
            TimeManager.advanceTime(chore.duration);
        }
        
        // Give rewards - FIXED
        GameState.money.cash += chore.reward;
        GameState.updateNeeds({ 
            energy: chore.energy, 
            hygiene: 5, 
            happiness: 10 
        });
        
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
        
        // Record chore completion
        GameState.completeChore(choreType);
        if (!GameState.stats.choresCompleted) GameState.stats.choresCompleted = 0;
        GameState.stats.choresCompleted++;
        
        // Show success message
        UI.showNotification(
            `✅ ${chore.name} complete! +$${chore.reward}, +10 Happiness`,
            'success'
        );
        
        // Achievement check
        if (GameState.stats.choresCompleted >= 10) {
            GameState.addAchievement('Clean Freak', 'Complete 10 chores', '🧹');
        }
        
        this.close();
    },
    
    // Close minigame
    close() {
        const overlay = document.querySelector('.minigame-overlay');
        if (overlay) {
            overlay.remove();
        }
        this.currentChore = null;
    },
    
    // ==================== BED MAKING GAME ====================
    bedGame() {
        const overlay = document.createElement('div');
        overlay.className = 'minigame-overlay active';
        overlay.id = 'bedGame';
        
        let html = `
            <div class="minigame-container">
                <div class="minigame-header">
                    <div class="minigame-title">🛏️ Make the Bed</div>
                    <div class="minigame-subtitle">Drag items onto the bed in order: Sheet → Blanket → Pillow</div>
                </div>
                
                <div style="margin: 30px 0;">
                    <div style="text-align: center; margin-bottom: 25px;">
                        <h2 style="color: #2c3e50; margin-bottom: 10px;">📦 Drag These Items (In Order):</h2>
                    </div>
                    
                    <div id="bedItems" style="
                        display: flex;
                        justify-content: center;
                        gap: 40px;
                        flex-wrap: wrap;
                        margin-bottom: 40px;
                        padding: 30px;
                        background: rgba(255, 255, 255, 0.8);
                        border-radius: 20px;
                        border: 3px dashed #3498db;
                        min-height: 160px;
                    ">
                        <div class="bed-item" draggable="true" data-item="sheet" 
                             style="width: 120px; height: 120px; background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%); 
                             border-radius: 15px; display: flex; flex-direction: column; align-items: center; 
                             justify-content: center; cursor: grab; border: 3px solid #3498db; box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                             font-weight: bold; font-size: 16px; color: #2c3e50;">
                            <div style="font-size: 50px; margin-bottom: 5px;">🟦</div>
                            <div>Sheet</div>
                        </div>
                        
                        <div class="bed-item" draggable="true" data-item="blanket"
                             style="width: 120px; height: 120px; background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%); 
                             border-radius: 15px; display: flex; flex-direction: column; align-items: center; 
                             justify-content: center; cursor: grab; border: 3px solid #e67e22; box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                             font-weight: bold; font-size: 16px; color: #2c3e50;">
                            <div style="font-size: 50px; margin-bottom: 5px;">🟧</div>
                            <div>Blanket</div>
                        </div>
                        
                        <div class="bed-item" draggable="true" data-item="pillow"
                             style="width: 120px; height: 120px; background: linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%); 
                             border-radius: 15px; display: flex; flex-direction: column; align-items: center; 
                             justify-content: center; cursor: grab; border: 3px solid #9b59b6; box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                             font-weight: bold; font-size: 16px; color: #2c3e50;">
                            <div style="font-size: 50px; margin-bottom: 5px;">🟪</div>
                            <div>Pillow</div>
                        </div>
                    </div>
                    
                    <div style="text-align: center; margin-bottom: 20px;">
                        <h2 style="color: #2c3e50;">👇 Drop Items Here:</h2>
                    </div>
                    
                    <div id="bedTarget" style="
                        width: 500px;
                        height: 300px;
                        margin: 0 auto;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        border: 5px dashed #2c3e50;
                        border-radius: 20px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 80px;
                        position: relative;
                        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                    ">
                        🛏️
                        <div id="bedLayers" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></div>
                    </div>
                </div>
                
                <div class="minigame-actions">
                    <button class="btn btn-danger" onclick="ChoreMinigames.close()">Cancel</button>
                </div>
            </div>
        `;
        
        overlay.innerHTML = html;
        document.body.appendChild(overlay);
        
        // Setup drag and drop
        let itemsPlaced = [];
        const correctOrder = ['sheet', 'blanket', 'pillow'];
        
        const items = overlay.querySelectorAll('.bed-item');
        const target = overlay.querySelector('#bedTarget');
        const layers = overlay.querySelector('#bedLayers');
        
        items.forEach(item => {
            item.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', item.dataset.item);
                item.style.opacity = '0.5';
            });
            
            item.addEventListener('dragend', (e) => {
                item.style.opacity = '1';
            });
        });
        
        target.addEventListener('dragover', (e) => {
            e.preventDefault();
            target.style.borderColor = '#27ae60';
            target.style.transform = 'scale(1.05)';
        });
        
        target.addEventListener('dragleave', () => {
            target.style.borderColor = '#2c3e50';
            target.style.transform = 'scale(1)';
        });
        
        target.addEventListener('drop', (e) => {
            e.preventDefault();
            target.style.borderColor = '#2c3e50';
            target.style.transform = 'scale(1)';
            
            const itemType = e.dataTransfer.getData('text/plain');
            const expectedItem = correctOrder[itemsPlaced.length];
            
            if (itemType === expectedItem) {
                itemsPlaced.push(itemType);
                
                // Visual feedback
                const layer = document.createElement('div');
                layer.style.cssText = `
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    opacity: 0.7;
                    z-index: ${itemsPlaced.length};
                    border-radius: 15px;
                `;
                
                const colors = {
                    sheet: 'rgba(168, 237, 234, 0.8)',
                    blanket: 'rgba(252, 182, 159, 0.8)',
                    pillow: 'rgba(251, 194, 235, 0.8)'
                };
                
                layer.style.background = colors[itemType];
                layers.appendChild(layer);
                
                // Remove item from available items
                const draggedItem = Array.from(items).find(i => i.dataset.item === itemType);
                if (draggedItem) {
                    draggedItem.style.display = 'none';
                }
                
                UI.showNotification(`✅ ${itemType.charAt(0).toUpperCase() + itemType.slice(1)} placed!`, 'success', 1500);
                
                // Check if complete
                if (itemsPlaced.length === 3) {
                    setTimeout(() => {
                        ChoreMinigames.complete('bed');
                    }, 500);
                }
            } else {
                UI.showNotification(`❌ Wrong order! Place ${expectedItem} next.`, 'error', 2000);
            }
        });
    },
    
    // ==================== DISH WASHING GAME ====================
    dishesGame() {
        const overlay = document.createElement('div');
        overlay.className = 'minigame-overlay active';
        overlay.id = 'dishesGame';
        
        let dishesClean = 0;
        const totalDishes = 5;
        
        let html = `
            <div class="minigame-container">
                <div class="minigame-header">
                    <div class="minigame-title">🍽️ Wash the Dishes</div>
                    <div class="minigame-subtitle">Click and hold on dirty dishes to scrub them clean!</div>
                </div>
                
                <div style="margin: 30px 0; text-align: center;">
                    <div style="font-size: 24px; font-weight: bold; color: #2c3e50; margin-bottom: 20px;">
                        Clean: <span id="dishCount">0</span> / ${totalDishes}
                    </div>
                    
                    <div id="dishRack" style="display: flex; justify-content: center; gap: 20px; flex-wrap: wrap;">
                        ${Array(totalDishes).fill(0).map((_, i) => `
                            <div class="dirty-dish" data-dish="${i}" style="
                                width: 100px;
                                height: 100px;
                                background: linear-gradient(135deg, #8B4513 0%, #654321 100%);
                                border-radius: 50%;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                font-size: 50px;
                                cursor: pointer;
                                border: 3px solid #654321;
                                position: relative;
                                user-select: none;
                                box-shadow: 0 4px 8px rgba(0,0,0,0.3);
                            ">
                                <div class="dish-progress" style="
                                    position: absolute;
                                    bottom: -5px;
                                    left: 50%;
                                    transform: translateX(-50%);
                                    width: 0%;
                                    height: 5px;
                                    background: #27ae60;
                                    border-radius: 5px;
                                    transition: width 0.1s;
                                "></div>
                                🍽️
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="minigame-actions">
                    <button class="btn btn-danger" onclick="ChoreMinigames.close()">Cancel</button>
                </div>
            </div>
        `;
        
        overlay.innerHTML = html;
        document.body.appendChild(overlay);
        
        // Setup dish cleaning
        const dishes = overlay.querySelectorAll('.dirty-dish');
        const dishCount = overlay.querySelector('#dishCount');
        
        dishes.forEach(dish => {
            let cleanProgress = 0;
            let intervalId = null;
            
            const startCleaning = () => {
                if (cleanProgress >= 100) return;
                
                intervalId = setInterval(() => {
                    cleanProgress += 5;
                    const progressBar = dish.querySelector('.dish-progress');
                    progressBar.style.width = cleanProgress + '%';
                    
                    // Gradually lighten the dish
                    const brownLevel = Math.floor(139 - (cleanProgress * 0.5));
                    dish.style.background = `linear-gradient(135deg, rgb(${brownLevel}, ${Math.floor(brownLevel * 0.5)}, ${Math.floor(brownLevel * 0.15)}) 0%, rgb(255, 255, 255) 100%)`;
                    
                    if (cleanProgress >= 100) {
                        stopCleaning();
                        dish.style.background = 'linear-gradient(135deg, #e3f2fd 0%, #90caf9 100%)';
                        dish.style.borderColor = '#2196f3';
                        dish.style.cursor = 'default';
                        dish.textContent = '✨';
                        dishesClean++;
                        dishCount.textContent = dishesClean;
                        
                        UI.showNotification('✅ Dish clean!', 'success', 1000);
                        
                        if (dishesClean === totalDishes) {
                            setTimeout(() => {
                                ChoreMinigames.complete('dishes');
                            }, 500);
                        }
                    }
                }, 100);
            };
            
            const stopCleaning = () => {
                if (intervalId) {
                    clearInterval(intervalId);
                    intervalId = null;
                }
            };
            
            dish.addEventListener('mousedown', startCleaning);
            dish.addEventListener('mouseup', stopCleaning);
            dish.addEventListener('mouseleave', stopCleaning);
            dish.addEventListener('touchstart', startCleaning);
            dish.addEventListener('touchend', stopCleaning);
        });
    },
    
    // ==================== VACUUM GAME ====================
    vacuumGame() {
        const overlay = document.createElement('div');
        overlay.className = 'minigame-overlay active';
        overlay.id = 'vacuumGame';
        
        let dirtCleaned = 0;
        const totalDirt = 20;
        
        let html = `
            <div class="minigame-container">
                <div class="minigame-header">
                    <div class="minigame-title">🧹 Vacuum the Floor</div>
                    <div class="minigame-subtitle">Move your mouse/finger over the dirt to vacuum it up!</div>
                </div>
                
                <div style="margin: 30px 0; text-align: center;">
                    <div style="font-size: 24px; font-weight: bold; color: #2c3e50; margin-bottom: 20px;">
                        Cleaned: <span id="dirtCount">0</span> / ${totalDirt}
                    </div>
                    
                    <div id="floor" style="
                        width: 600px;
                        height: 400px;
                        margin: 0 auto;
                        background: linear-gradient(135deg, #d4a574 0%, #c9965d 100%);
                        border: 5px solid #8B4513;
                        border-radius: 10px;
                        position: relative;
                        overflow: hidden;
                        cursor: crosshair;
                        box-shadow: inset 0 0 20px rgba(0,0,0,0.3);
                    ">
                        <div id="vacuum" style="
                            position: absolute;
                            width: 40px;
                            height: 40px;
                            font-size: 30px;
                            pointer-events: none;
                            z-index: 100;
                            transform: translate(-50%, -50%);
                        ">🧹</div>
                    </div>
                </div>
                
                <div class="minigame-actions">
                    <button class="btn btn-danger" onclick="ChoreMinigames.close()">Cancel</button>
                </div>
            </div>
        `;
        
        overlay.innerHTML = html;
        document.body.appendChild(overlay);
        
        const floor = overlay.querySelector('#floor');
        const vacuum = overlay.querySelector('#vacuum');
        const dirtCount = overlay.querySelector('#dirtCount');
        
        // Create dirt spots
        for (let i = 0; i < totalDirt; i++) {
            const dirt = document.createElement('div');
            dirt.className = 'dirt-spot';
            dirt.style.cssText = `
                position: absolute;
                width: ${20 + Math.random() * 20}px;
                height: ${20 + Math.random() * 20}px;
                background: radial-gradient(circle, #654321 0%, transparent 70%);
                border-radius: 50%;
                left: ${Math.random() * 90}%;
                top: ${Math.random() * 90}%;
                pointer-events: none;
                opacity: 0.7;
            `;
            floor.appendChild(dirt);
        }
        
        // Move vacuum with mouse
        floor.addEventListener('mousemove', (e) => {
            const rect = floor.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            vacuum.style.left = x + 'px';
            vacuum.style.top = y + 'px';
            
            // Check collision with dirt
            const dirtSpots = floor.querySelectorAll('.dirt-spot');
            dirtSpots.forEach(spot => {
                const spotRect = spot.getBoundingClientRect();
                const spotX = spotRect.left + spotRect.width / 2 - rect.left;
                const spotY = spotRect.top + spotRect.height / 2 - rect.top;
                
                const distance = Math.sqrt(Math.pow(x - spotX, 2) + Math.pow(y - spotY, 2));
                
                if (distance < 30) {
                    spot.remove();
                    dirtCleaned++;
                    dirtCount.textContent = dirtCleaned;
                    
                    if (dirtCleaned === totalDirt) {
                        setTimeout(() => {
                            ChoreMinigames.complete('vacuum');
                        }, 500);
                    }
                }
            });
        });
        
        // Touch support
        floor.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const rect = floor.getBoundingClientRect();
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;
            
            vacuum.style.left = x + 'px';
            vacuum.style.top = y + 'px';
            
            const dirtSpots = floor.querySelectorAll('.dirt-spot');
            dirtSpots.forEach(spot => {
                const spotRect = spot.getBoundingClientRect();
                const spotX = spotRect.left + spotRect.width / 2 - rect.left;
                const spotY = spotRect.top + spotRect.height / 2 - rect.top;
                
                const distance = Math.sqrt(Math.pow(x - spotX, 2) + Math.pow(y - spotY, 2));
                
                if (distance < 30) {
                    spot.remove();
                    dirtCleaned++;
                    dirtCount.textContent = dirtCleaned;
                    
                    if (dirtCleaned === totalDirt) {
                        setTimeout(() => {
                            ChoreMinigames.complete('vacuum');
                        }, 500);
                    }
                }
            });
        });
    },
    
    // ==================== TRASH GAME ====================
    trashGame() {
        const overlay = document.createElement('div');
        overlay.className = 'minigame-overlay active';
        overlay.id = 'trashGame';
        
        let html = `
            <div class="minigame-container">
                <div class="minigame-header">
                    <div class="minigame-title">🗑️ Take Out the Trash</div>
                    <div class="minigame-subtitle">Drag the trash bag to the outdoor bin!</div>
                </div>
                
                <div style="margin: 50px 0;">
                    <div style="display: flex; justify-content: space-around; align-items: center;">
                        <div style="text-align: center;">
                            <div style="font-size: 20px; margin-bottom: 10px; font-weight: bold;">🏠 Inside</div>
                            <div id="trashBag" draggable="true" style="
                                width: 100px;
                                height: 120px;
                                background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
                                border-radius: 10px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                font-size: 60px;
                                cursor: grab;
                                border: 3px solid #1a252f;
                                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                            ">🗑️</div>
                        </div>
                        
                        <div style="font-size: 80px; color: #95a5a6;">
                            ➡️
                        </div>
                        
                        <div style="text-align: center;">
                            <div style="font-size: 20px; margin-bottom: 10px; font-weight: bold;">🏡 Outside</div>
                            <div id="trashBin" style="
                                width: 150px;
                                height: 180px;
                                background: linear-gradient(135deg, #27ae60 0%, #229954 100%);
                                border-radius: 15px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                font-size: 80px;
                                border: 5px dashed #1e8449;
                                box-shadow: 0 8px 20px rgba(0,0,0,0.3);
                            ">♻️</div>
                        </div>
                    </div>
                </div>
                
                <div class="minigame-actions">
                    <button class="btn btn-danger" onclick="ChoreMinigames.close()">Cancel</button>
                </div>
            </div>
        `;
        
        overlay.innerHTML = html;
        document.body.appendChild(overlay);
        
        const trashBag = overlay.querySelector('#trashBag');
        const trashBin = overlay.querySelector('#trashBin');
        
        trashBag.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', 'trash');
            trashBag.style.opacity = '0.5';
        });
        
        trashBag.addEventListener('dragend', () => {
            trashBag.style.opacity = '1';
        });
        
        trashBin.addEventListener('dragover', (e) => {
            e.preventDefault();
            trashBin.style.borderColor = '#f39c12';
            trashBin.style.transform = 'scale(1.1)';
        });
        
        trashBin.addEventListener('dragleave', () => {
            trashBin.style.borderColor = '#1e8449';
            trashBin.style.transform = 'scale(1)';
        });
        
        trashBin.addEventListener('drop', (e) => {
            e.preventDefault();
            trashBin.style.borderColor = '#1e8449';
            trashBin.style.transform = 'scale(1)';
            
            if (e.dataTransfer.getData('text/plain') === 'trash') {
                trashBag.style.display = 'none';
                trashBin.textContent = '✅';
                UI.showNotification('✅ Trash taken out!', 'success');
                
                setTimeout(() => {
                    ChoreMinigames.complete('trash');
                }, 800);
            }
        });
    },
    
    // ==================== LAUNDRY GAME ====================
    laundryGame() {
        UI.showNotification('💡 Use the Laundry Minigame from the Activities menu for a full experience!', 'info', 3000);
        
        // Simple quick version for chore list
        setTimeout(() => {
            ChoreMinigames.complete('laundry');
        }, 2000);
    }
};

console.log('✅ chores.js loaded');
