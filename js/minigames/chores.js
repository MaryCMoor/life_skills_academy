// ==================== INTERACTIVE CHORE MINIGAMES ====================

window.ChoreMinigames = {
    currentChore: null,
    
    start(choreId) {
        console.log('🎮 Starting interactive chore:', choreId);
        this.currentChore = choreId;
        
        const games = {
            'bed': () => this.bedGame(),
            'dishes': () => this.dishesGame(),
            'vacuum': () => this.vacuumGame(),
            'trash': () => this.trashGame()
        };
        
        if (games[choreId]) {
            games[choreId]();
        } else {
            this.completeSimple(choreId);
        }
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
                    <div class="minigame-subtitle">Drag items onto the bed in the correct order</div>
                </div>
                
                <div style="margin: 30px 0;">
                    <div id="bedArea" style="
                        position: relative;
                        width: 600px;
                        height: 400px;
                        background: linear-gradient(135deg, #8b7355, #6f5643);
                        border-radius: 15px;
                        border: 5px solid #4a3728;
                        margin: 0 auto 30px;
                        overflow: hidden;
                    ">
                        <div style="
                            position: absolute;
                            bottom: 20px;
                            left: 50px;
                            right: 50px;
                            height: 300px;
                            background: linear-gradient(135deg, #d4a574, #c4956d);
                            border-radius: 10px;
                            border: 3px solid #8b6f47;
                        "></div>
                    </div>
                    
                    <div style="text-align: center; margin-bottom: 20px;">
                        <h3 style="color: #2c3e50;">Items to Place (drag in order):</h3>
                        <div style="font-size: 14px; color: #7f8c8d;">Sheet → Blanket → Pillow</div>
                    </div>
                    
                    <div id="bedItems" style="
                        display: flex;
                        justify-content: center;
                        gap: 20px;
                        flex-wrap: wrap;
                    ">
                        <div class="bed-item" draggable="true" data-item="sheet" style="
                            width: 120px;
                            height: 80px;
                            background: linear-gradient(135deg, #64b5f6, #42a5f5);
                            border-radius: 10px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            cursor: move;
                            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                            font-size: 14px;
                            font-weight: bold;
                            color: white;
                        ">Sheet</div>
                        
                        <div class="bed-item" draggable="true" data-item="blanket" style="
                            width: 120px;
                            height: 80px;
                            background: linear-gradient(135deg, #ef5350, #e53935);
                            border-radius: 10px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            cursor: move;
                            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                            font-size: 14px;
                            font-weight: bold;
                            color: white;
                        ">Blanket</div>
                        
                        <div class="bed-item" draggable="true" data-item="pillow" style="
                            width: 100px;
                            height: 60px;
                            background: linear-gradient(135deg, #ffa726, #fb8c00);
                            border-radius: 30px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            cursor: move;
                            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                            font-size: 14px;
                            font-weight: bold;
                            color: white;
                        ">Pillow</div>
                    </div>
                </div>
                
                <div style="text-align: center; margin: 20px 0;">
                    <div style="font-size: 18px; font-weight: bold;">
                        Items Placed: <span id="bedProgress">0</span> / 3
                    </div>
                </div>
                
                <div class="minigame-actions">
                    <button class="btn-skip" onclick="ChoreMinigames.close()">Skip</button>
                </div>
            </div>
        `;
        
        overlay.innerHTML = html;
        document.body.appendChild(overlay);
        
        this.setupBedDragDrop();
    },
    
    setupBedDragDrop() {
        let placedItems = [];
        const correctOrder = ['sheet', 'blanket', 'pillow'];
        
        const bedArea = document.getElementById('bedArea');
        const items = document.querySelectorAll('.bed-item');
        
        items.forEach(item => {
            item.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', e.target.dataset.item);
            });
        });
        
        bedArea.addEventListener('dragover', (e) => {
            e.preventDefault();
        });
        
        bedArea.addEventListener('drop', (e) => {
            e.preventDefault();
            const itemName = e.dataTransfer.getData('text/plain');
            
            if (placedItems.includes(itemName)) {
                UI.showNotification('❌ Already placed that item!', 'error');
                return;
            }
            
            if (correctOrder.indexOf(itemName) !== placedItems.length) {
                UI.showNotification('❌ Wrong order! Check the sequence.', 'error');
                return;
            }
            
            placedItems.push(itemName);
            document.getElementById('bedProgress').textContent = placedItems.length;
            
            document.querySelector(`[data-item="${itemName}"]`).style.display = 'none';
            
            const itemDiv = document.createElement('div');
            const backgrounds = {
                sheet: 'linear-gradient(135deg, #64b5f6, #42a5f5)',
                blanket: 'linear-gradient(135deg, #ef5350, #e53935)',
                pillow: 'linear-gradient(135deg, #ffa726, #fb8c00)'
            };
            
            itemDiv.style.cssText = `
                position: absolute;
                bottom: ${20 + placedItems.length * 30}px;
                left: 50px;
                right: 50px;
                height: ${itemName === 'pillow' ? '60px' : '50px'};
                background: ${backgrounds[itemName]};
                border-radius: ${itemName === 'pillow' ? '30px' : '10px'};
                box-shadow: 0 4px 8px rgba(0,0,0,0.3);
                animation: placeItem 0.3s;
                z-index: ${placedItems.length};
            `;
            bedArea.appendChild(itemDiv);
            
            UI.showNotification(`✅ ${itemName} placed!`, 'success');
            
            if (placedItems.length === 3) {
                setTimeout(() => {
                    this.completeBedGame();
                }, 800);
            }
        });
    },
    
    completeBedGame() {
        UI.showNotification('✅ Bed made perfectly!', 'success');
        this.completeChore('bed');
    },
    
    // ==================== DISHES WASHING GAME ====================
    dishesGame() {
        const overlay = document.createElement('div');
        overlay.className = 'minigame-overlay active';
        overlay.id = 'dishesGame';
        
        const totalDishes = 8;
        
        let html = `
            <div class="minigame-container">
                <div class="minigame-header">
                    <div class="minigame-title">🍽️ Wash the Dishes</div>
                    <div class="minigame-subtitle">Click each dirty dish 5 times to scrub it clean!</div>
                </div>
                
                <div style="margin: 30px 0;">
                    <div id="sinkArea" style="
                        background: linear-gradient(135deg, #78909c, #607d8b);
                        border-radius: 20px;
                        padding: 30px;
                        display: grid;
                        grid-template-columns: repeat(4, 1fr);
                        gap: 20px;
                    ">
                        ${Array(totalDishes).fill(0).map((_, i) => `
                            <div class="dish" data-dish="${i}" data-clicks="0" style="
                                aspect-ratio: 1;
                                border-radius: 50%;
                                background: linear-gradient(135deg, #6d4c41, #5d4037);
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                font-size: 48px;
                                cursor: pointer;
                                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                                transition: all 0.2s;
                                position: relative;
                            " onclick="ChoreMinigames.scrubDish(${i})">
                                🍽️
                                <div style="
                                    position: absolute;
                                    top: 0;
                                    left: 0;
                                    right: 0;
                                    bottom: 0;
                                    background: rgba(139, 76, 65, 0.8);
                                    border-radius: 50%;
                                    pointer-events: none;
                                " class="dirt-layer"></div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div style="text-align: center; margin: 20px 0;">
                    <div style="font-size: 18px; font-weight: bold;">
                        Dishes Cleaned: <span id="dishProgress">0</span> / ${totalDishes}
                    </div>
                    <div class="progress-bar" style="height: 30px; margin-top: 10px;">
                        <div class="progress-fill" style="width: 0%; transition: width 0.3s;">0%</div>
                    </div>
                </div>
                
                <div class="minigame-actions">
                    <button class="btn-skip" onclick="ChoreMinigames.close()">Skip</button>
                </div>
            </div>
        `;
        
        overlay.innerHTML = html;
        document.body.appendChild(overlay);
        
        this.dishData = { cleanedDishes: 0, totalDishes };
    },
    
    scrubDish(dishId) {
        const dish = document.querySelector(`[data-dish="${dishId}"]`);
        if (!dish) return;
        
        let clicks = parseInt(dish.dataset.clicks);
        clicks++;
        dish.dataset.clicks = clicks;
        
        const dirtLayer = dish.querySelector('.dirt-layer');
        
        if (clicks < 5) {
            dirtLayer.style.opacity = 1 - (clicks * 0.2);
            dish.style.transform = 'scale(1.1)';
            setTimeout(() => dish.style.transform = 'scale(1)', 100);
        } else {
            dish.style.background = 'linear-gradient(135deg, #eceff1, #cfd8dc)';
            dish.style.pointerEvents = 'none';
            dirtLayer.remove();
            
            this.dishData.cleanedDishes++;
            document.getElementById('dishProgress').textContent = this.dishData.cleanedDishes;
            
            const percent = (this.dishData.cleanedDishes / this.dishData.totalDishes) * 100;
            const progressFill = document.querySelector('.progress-fill');
            progressFill.style.width = percent + '%';
            progressFill.textContent = Math.round(percent) + '%';
            
            UI.showNotification('✨ Dish cleaned!', 'success');
            
            if (this.dishData.cleanedDishes === this.dishData.totalDishes) {
                setTimeout(() => {
                    this.completeDishesGame();
                }, 500);
            }
        }
    },
    
    completeDishesGame() {
        UI.showNotification('✅ All dishes washed!', 'success');
        this.completeChore('dishes');
    },
    
    // ==================== VACUUM GAME ====================
    vacuumGame() {
        const overlay = document.createElement('div');
        overlay.className = 'minigame-overlay active';
        overlay.id = 'vacuumGame';
        
        const totalDirt = 15;
        
        let html = `
            <div class="minigame-container">
                <div class="minigame-header">
                    <div class="minigame-title">🧹 Vacuum the Floor</div>
                    <div class="minigame-subtitle">Use arrow keys or WASD to move the vacuum!</div>
                </div>
                
                <div style="margin: 30px 0;">
                    <div id="floorArea" style="
                        position: relative;
                        width: 700px;
                        height: 500px;
                        background: linear-gradient(135deg, #d4a574, #c4956d);
                        border-radius: 15px;
                        border: 5px solid #8b6f47;
                        margin: 0 auto;
                        overflow: hidden;
                    ">
                    </div>
                </div>
                
                <div style="text-align: center; margin: 20px 0;">
                    <div style="font-size: 18px; font-weight: bold;">
                        Dirt Cleaned: <span id="vacuumProgress">0</span> / ${totalDirt}
                    </div>
                    <div class="progress-bar" style="height: 30px; margin-top: 10px;">
                        <div class="progress-fill" style="width: 0%; transition: width 0.3s;">0%</div>
                    </div>
                </div>
                
                <div class="minigame-actions">
                    <button class="btn-skip" onclick="ChoreMinigames.close()">Skip</button>
                </div>
            </div>
        `;
        
        overlay.innerHTML = html;
        document.body.appendChild(overlay);
        
        this.setupVacuumGame(totalDirt);
    },
    
    setupVacuumGame(totalDirt) {
        const floorArea = document.getElementById('floorArea');
        const dirtSpots = [];
        
        // Create dirt spots
        for (let i = 0; i < totalDirt; i++) {
            const dirt = document.createElement('div');
            dirt.className = 'dirt-spot';
            dirt.dataset.dirtId = i;
            dirt.style.cssText = `
                position: absolute;
                width: 40px;
                height: 40px;
                background: radial-gradient(circle, #3e2723, #4e342e);
                border-radius: 50%;
                opacity: 0.8;
                left: ${Math.random() * 640 + 20}px;
                top: ${Math.random() * 440 + 20}px;
                transition: opacity 0.3s, transform 0.3s;
            `;
            floorArea.appendChild(dirt);
            dirtSpots.push({ element: dirt, cleaned: false });
        }
        
        // Create vacuum
        const vacuum = document.createElement('div');
        vacuum.id = 'vacuum';
        vacuum.style.cssText = `
            position: absolute;
            width: 60px;
            height: 80px;
            background: linear-gradient(135deg, #e53935, #c62828);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 36px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            left: 320px;
            top: 210px;
            transition: all 0.1s;
        `;
        vacuum.textContent = '🧹';
        floorArea.appendChild(vacuum);
        
        let x = 320, y = 210;
        const speed = 15;
        
        this.vacuumData = { cleanedDirt: 0, totalDirt, dirtSpots };
        
        const handleKeyDown = (e) => {
            if (!document.getElementById('vacuumGame')) {
                document.removeEventListener('keydown', handleKeyDown);
                return;
            }
            
            const key = e.key.toLowerCase();
            if (['arrowup', 'w'].includes(key)) y = Math.max(0, y - speed);
            if (['arrowdown', 's'].includes(key)) y = Math.min(420, y + speed);
            if (['arrowleft', 'a'].includes(key)) x = Math.max(0, x - speed);
            if (['arrowright', 'd'].includes(key)) x = Math.min(640, x + speed);
            
            vacuum.style.left = x + 'px';
            vacuum.style.top = y + 'px';
            
            this.checkVacuumCollision(x, y);
        };
        
        document.addEventListener('keydown', handleKeyDown);
    },
    
    checkVacuumCollision(vacX, vacY) {
        this.vacuumData.dirtSpots.forEach((spot) => {
            if (spot.cleaned) return;
            
            const dirtRect = spot.element.getBoundingClientRect();
            const vacRect = document.getElementById('vacuum').getBoundingClientRect();
            
            const collision = !(
                dirtRect.right < vacRect.left ||
                dirtRect.left > vacRect.right ||
                dirtRect.bottom < vacRect.top ||
                dirtRect.top > vacRect.bottom
            );
            
            if (collision) {
                spot.cleaned = true;
                spot.element.style.opacity = '0';
                spot.element.style.transform = 'scale(0)';
                
                this.vacuumData.cleanedDirt++;
                document.getElementById('vacuumProgress').textContent = this.vacuumData.cleanedDirt;
                
                const percent = (this.vacuumData.cleanedDirt / this.vacuumData.totalDirt) * 100;
                const progressFill = document.querySelector('.progress-fill');
                progressFill.style.width = percent + '%';
                progressFill.textContent = Math.round(percent) + '%';
                
                if (this.vacuumData.cleanedDirt === this.vacuumData.totalDirt) {
                    setTimeout(() => {
                        this.completeVacuumGame();
                    }, 500);
                }
            }
        });
    },
    
    completeVacuumGame() {
        UI.showNotification('✅ Floor vacuumed!', 'success');
        this.completeChore('vacuum');
    },
    
    // ==================== COMPLETION ====================
    completeChore(choreId) {
        const chore = GameState.daily.chores.find(c => c.id === choreId);
        if (!chore) return;
        
        GameState.completeChore(choreId);
        GameState.addMoney(chore.reward, 'chore');
        GameState.addSkill(chore.skill, 5);
        GameState.clearBusy();
        GameState.stats.choresCompleted++;
        
        UI.showNotification(`✅ ${chore.name} complete! +$${chore.reward}`, 'success');
        
        this.close();
        
        if (typeof loadHome === 'function') {
            loadHome();
        }
        UI.updateStats();
    },
    
    completeSimple(choreId) {
        this.completeChore(choreId);
    },
    
    close() {
        const overlays = document.querySelectorAll('.minigame-overlay');
        overlays.forEach(overlay => {
            if (overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
        });
    }
};

console.log('✅ chores.js loaded');
