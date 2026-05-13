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
        
        // Give rewards
        GameState.money += chore.reward;
        GameState.updateNeeds({ energy: chore.energy, hygiene: 5, happiness: 10 });
        
        // Record chore completion
        if (!GameState.stats.choresCompleted) GameState.stats.choresCompleted = 0;
        GameState.stats.choresCompleted++;
        
        // Show success message
        UI.showNotification(
            `✅ ${chore.name} complete! +$${chore.reward}, +10 Happiness`,
            'success'
        );
        
        // Achievement check
        if (GameState.stats.choresCompleted >= 10) {
            GameState.addAchievement('clean-freak', '🧹 Clean Freak', 'Complete 10 chores');
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
    
    // ==================== BED MAKING GAME (ENHANCED VISIBILITY) ====================
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
                        <div class="bed-item" draggable="true" data-item="sheet" data-order="1" style="
                            width: 180px;
                            height: 140px;
                            background: linear-gradient(135deg, #64b5f6, #42a5f5);
                            border-radius: 15px;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            cursor: grab;
                            box-shadow: 0 6px 15px rgba(0,0,0,0.3);
                            font-size: 18px;
                            font-weight: bold;
                            color: white;
                            border: 4px solid #1976d2;
                            transition: all 0.2s;
                            position: relative;
                        ">
                            <div style="
                                position: absolute;
                                top: -15px;
                                left: 50%;
                                transform: translateX(-50%);
                                background: #1976d2;
                                color: white;
                                padding: 5px 15px;
                                border-radius: 20px;
                                font-size: 14px;
                                font-weight: bold;
                            ">STEP 1</div>
                            <div style="font-size: 50px; margin-bottom: 10px;">📘</div>
                            <div style="font-size: 20px;">SHEET</div>
                            <div style="font-size: 13px; opacity: 0.95; margin-top: 5px;">(Blue - Drag First!)</div>
                        </div>
                        
                        <div class="bed-item" draggable="true" data-item="blanket" data-order="2" style="
                            width: 180px;
                            height: 140px;
                            background: linear-gradient(135deg, #ef5350, #e53935);
                            border-radius: 15px;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            cursor: grab;
                            box-shadow: 0 6px 15px rgba(0,0,0,0.3);
                            font-size: 18px;
                            font-weight: bold;
                            color: white;
                            border: 4px solid #c62828;
                            transition: all 0.2s;
                            position: relative;
                        ">
                            <div style="
                                position: absolute;
                                top: -15px;
                                left: 50%;
                                transform: translateX(-50%);
                                background: #c62828;
                                color: white;
                                padding: 5px 15px;
                                border-radius: 20px;
                                font-size: 14px;
                                font-weight: bold;
                            ">STEP 2</div>
                            <div style="font-size: 50px; margin-bottom: 10px;">🟥</div>
                            <div style="font-size: 20px;">BLANKET</div>
                            <div style="font-size: 13px; opacity: 0.95; margin-top: 5px;">(Red - Drag Second!)</div>
                        </div>
                        
                        <div class="bed-item" draggable="true" data-item="pillow" data-order="3" style="
                            width: 180px;
                            height: 140px;
                            background: linear-gradient(135deg, #ffa726, #fb8c00);
                            border-radius: 30px;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            cursor: grab;
                            box-shadow: 0 6px 15px rgba(0,0,0,0.3);
                            font-size: 18px;
                            font-weight: bold;
                            color: white;
                            border: 4px solid #f57c00;
                            transition: all 0.2s;
                            position: relative;
                        ">
                            <div style="
                                position: absolute;
                                top: -15px;
                                left: 50%;
                                transform: translateX(-50%);
                                background: #f57c00;
                                color: white;
                                padding: 5px 15px;
                                border-radius: 20px;
                                font-size: 14px;
                                font-weight: bold;
                            ">STEP 3</div>
                            <div style="font-size: 50px; margin-bottom: 10px;">🟧</div>
                            <div style="font-size: 20px;">PILLOW</div>
                            <div style="font-size: 13px; opacity: 0.95; margin-top: 5px;">(Orange - Drag Last!)</div>
                        </div>
                    </div>
                    
                    <div style="text-align: center; margin-bottom: 20px;">
                        <div style="font-size: 22px; font-weight: bold; color: #2c3e50; background: rgba(255,255,255,0.9); padding: 10px 20px; border-radius: 10px; display: inline-block;">
                            ✅ Items Placed: <span id="bedProgress" style="color: #27ae60;">0</span> / 3
                        </div>
                    </div>
                    
                    <div id="bedArea" style="
                        position: relative;
                        width: 600px;
                        height: 350px;
                        background: linear-gradient(135deg, #8b7355, #6f5643);
                        border-radius: 15px;
                        border: 5px solid #4a3728;
                        margin: 0 auto;
                        overflow: hidden;
                    ">
                        <div style="
                            position: absolute;
                            bottom: 20px;
                            left: 50px;
                            right: 50px;
                            height: 280px;
                            background: linear-gradient(135deg, #d4a574, #c4956d);
                            border-radius: 10px;
                            border: 3px solid #8b6f47;
                        "></div>
                        
                        <div style="
                            position: absolute;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                            font-size: 36px;
                            color: rgba(255,255,255,0.4);
                            pointer-events: none;
                            text-align: center;
                            font-weight: bold;
                            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
                        ">⬇️ DROP HERE ⬇️</div>
                    </div>
                </div>
                
                <div class="minigame-actions">
                    <button class="btn-skip" onclick="ChoreMinigames.close()">Skip Minigame</button>
                </div>
            </div>
        `;
        
        overlay.innerHTML = html;
        document.body.appendChild(overlay);
        
        this.setupBedDragDrop();
    },
    
    setupBedDragDrop() {
        const bedArea = document.getElementById('bedArea');
        const items = document.querySelectorAll('.bed-item');
        const progressSpan = document.getElementById('bedProgress');
        
        let placedItems = 0;
        let expectedOrder = 1;
        
        items.forEach(item => {
            item.addEventListener('dragstart', (e) => {
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/plain', item.dataset.item);
                item.style.opacity = '0.5';
            });
            
            item.addEventListener('dragend', (e) => {
                item.style.opacity = '1';
            });
        });
        
        bedArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            bedArea.style.background = 'linear-gradient(135deg, #a0907d, #8b7864)';
        });
        
        bedArea.addEventListener('dragleave', (e) => {
            bedArea.style.background = 'linear-gradient(135deg, #8b7355, #6f5643)';
        });
        
        bedArea.addEventListener('drop', (e) => {
            e.preventDefault();
            bedArea.style.background = 'linear-gradient(135deg, #8b7355, #6f5643)';
            
            const itemType = e.dataTransfer.getData('text/plain');
            const draggedItem = document.querySelector(`[data-item="${itemType}"]`);
            
            if (!draggedItem) return;
            
            const itemOrder = parseInt(draggedItem.dataset.order);
            
            if (itemOrder === expectedOrder) {
                // Correct order!
                draggedItem.style.display = 'none';
                placedItems++;
                expectedOrder++;
                progressSpan.textContent = placedItems;
                
                // Add visual layer to bed
                const layer = document.createElement('div');
                layer.style.cssText = `
                    position: absolute;
                    bottom: ${20 + (placedItems - 1) * 30}px;
                    left: 50px;
                    right: 50px;
                    height: ${itemType === 'pillow' ? '60px' : '40px'};
                    background: ${itemType === 'sheet' ? 'linear-gradient(135deg, #90caf9, #64b5f6)' : 
                                 itemType === 'blanket' ? 'linear-gradient(135deg, #ef5350, #e53935)' : 
                                 'linear-gradient(135deg, #ffa726, #fb8c00)'};
                    border-radius: ${itemType === 'pillow' ? '30px' : '5px'};
                    border: 2px solid rgba(255,255,255,0.3);
                    animation: placeItem 0.3s ease-out;
                    top: ${itemType === 'pillow' ? '30px' : 'auto'};
                    bottom: ${itemType === 'pillow' ? 'auto' : (20 + (placedItems - 1) * 30) + 'px'};
                `;
                bedArea.appendChild(layer);
                
                if (placedItems === 3) {
                    setTimeout(() => {
                        this.complete('bed');
                    }, 800);
                }
            } else {
                // Wrong order!
                UI.showNotification('❌ Wrong order! Place items in the correct sequence.', 'error', 2000);
                draggedItem.style.animation = 'shake 0.5s';
                setTimeout(() => {
                    draggedItem.style.animation = '';
                }, 500);
            }
        });
    },
    
    // ==================== DISHES GAME ====================
    dishesGame() {
        const overlay = document.createElement('div');
        overlay.className = 'minigame-overlay active';
        overlay.id = 'dishesGame';
        
        let html = `
            <div class="minigame-container">
                <div class="minigame-header">
                    <div class="minigame-title">🍽️ Wash the Dishes</div>
                    <div class="minigame-subtitle">Click on the dirty dishes to wash them!</div>
                </div>
                
                <div style="margin: 30px 0;">
                    <div style="text-align: center; margin-bottom: 20px; font-size: 20px; font-weight: bold; color: #2c3e50;">
                        Clean Dishes: <span id="dishProgress">0</span> / 8
                    </div>
                    
                    <div id="dishArea" style="
                        display: grid;
                        grid-template-columns: repeat(4, 1fr);
                        gap: 20px;
                        max-width: 700px;
                        margin: 0 auto;
                        padding: 30px;
                        background: linear-gradient(135deg, #ecf0f1, #bdc3c7);
                        border-radius: 15px;
                    ">
                        <!-- Dishes will be generated here -->
                    </div>
                </div>
                
                <div class="minigame-actions">
                    <button class="btn-skip" onclick="ChoreMinigames.close()">Skip Minigame</button>
                </div>
            </div>
        `;
        
        overlay.innerHTML = html;
        document.body.appendChild(overlay);
        
        this.setupDishes();
    },
    
    setupDishes() {
        const dishArea = document.getElementById('dishArea');
        const progressSpan = document.getElementById('dishProgress');
        const dishes = ['🍽️', '🍴', '🥄', '🥣', '☕', '🍶', '🥛', '🍷'];
        
        let cleaned = 0;
        
        dishes.forEach((dish, index) => {
            const dishDiv = document.createElement('div');
            dishDiv.className = 'dirty-dish';
            dishDiv.dataset.index = index;
            dishDiv.style.cssText = `
                font-size: 60px;
                padding: 20px;
                background: linear-gradient(135deg, #8b7355, #6f5643);
                border-radius: 15px;
                cursor: pointer;
                transition: all 0.3s;
                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                text-align: center;
            `;
            dishDiv.innerHTML = dish;
            
            dishDiv.addEventListener('click', () => {
                if (dishDiv.classList.contains('clean')) return;
                
                dishDiv.classList.add('clean');
                dishDiv.style.background = 'linear-gradient(135deg, #a8dadc, #457b9d)';
                dishDiv.style.transform = 'scale(1.1)';
                dishDiv.style.boxShadow = '0 0 20px rgba(72, 187, 120, 0.6)';
                
                setTimeout(() => {
                    dishDiv.style.transform = 'scale(1)';
                }, 300);
                
                cleaned++;
                progressSpan.textContent = cleaned;
                
                if (cleaned === dishes.length) {
                    setTimeout(() => {
                        this.complete('dishes');
                    }, 500);
                }
            });
            
            dishDiv.addEventListener('mouseover', () => {
                if (!dishDiv.classList.contains('clean')) {
                    dishDiv.style.transform = 'scale(1.1)';
                }
            });
            
            dishDiv.addEventListener('mouseout', () => {
                if (!dishDiv.classList.contains('clean')) {
                    dishDiv.style.transform = 'scale(1)';
                }
            });
            
            dishArea.appendChild(dishDiv);
        });
    },
    
    // ==================== VACUUM GAME (FIXED COLLISION) ====================
    vacuumGame() {
        const overlay = document.createElement('div');
        overlay.className = 'minigame-overlay active';
        overlay.id = 'vacuumGame';
        
        let html = `
            <div class="minigame-container">
                <div class="minigame-header">
                    <div class="minigame-title">🧹 Vacuum the Floor</div>
                    <div class="minigame-subtitle">Move your mouse over the dirt to clean it!</div>
                </div>
                
                <div style="margin: 30px 0;">
                    <div style="text-align: center; margin-bottom: 20px; font-size: 20px; font-weight: bold; color: #2c3e50;">
                        Cleaned: <span id="vacuumProgress">0</span> / 15
                    </div>
                    
                    <div id="vacuumArea" style="
                        position: relative;
                        width: 700px;
                        height: 500px;
                        background: linear-gradient(135deg, #deb887, #d2b48c);
                        border-radius: 15px;
                        border: 5px solid #8b7355;
                        margin: 0 auto;
                        overflow: hidden;
                        cursor: none;
                    ">
                        <!-- Vacuum cursor -->
                        <div id="vacuum" style="
                            position: absolute;
                            width: 40px;
                            height: 40px;
                            background: radial-gradient(circle, #4a90e2, #357abd);
                            border-radius: 50%;
                            pointer-events: none;
                            transform: translate(-50%, -50%);
                            box-shadow: 0 0 20px rgba(74, 144, 226, 0.8);
                            z-index: 100;
                        "></div>
                    </div>
                </div>
                
                <div class="minigame-actions">
                    <button class="btn-skip" onclick="ChoreMinigames.close()">Skip Minigame</button>
                </div>
            </div>
        `;
        
        overlay.innerHTML = html;
        document.body.appendChild(overlay);
        
        this.setupVacuum();
    },
    
    setupVacuum() {
        const vacuumArea = document.getElementById('vacuumArea');
        const vacuum = document.getElementById('vacuum');
        const progressSpan = document.getElementById('vacuumProgress');
        
        let cleaned = 0;
        const totalDirt = 15;
        
        // Create dirt spots
        for (let i = 0; i < totalDirt; i++) {
            const dirt = document.createElement('div');
            dirt.className = 'dirt-spot';
            dirt.style.cssText = `
                position: absolute;
                width: 30px;
                height: 30px;
                background: radial-gradient(circle, #4a3728, #3a2718);
                border-radius: 50%;
                left: ${Math.random() * (700 - 50) + 25}px;
                top: ${Math.random() * (500 - 50) + 25}px;
            `;
            vacuumArea.appendChild(dirt);
        }
        
        // Track vacuum position
        vacuumArea.addEventListener('mousemove', (e) => {
            const rect = vacuumArea.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            vacuum.style.left = x + 'px';
            vacuum.style.top = y + 'px';
            
            // Check collision with dirt (FIXED)
            const dirtSpots = vacuumArea.querySelectorAll('.dirt-spot');
            dirtSpots.forEach(dirt => {
                const dirtRect = dirt.getBoundingClientRect();
                const dirtX = dirtRect.left - rect.left + dirtRect.width / 2;
                const dirtY = dirtRect.top - rect.top + dirtRect.height / 2;
                
                // Distance-based collision
                const distance = Math.sqrt(Math.pow(x - dirtX, 2) + Math.pow(y - dirtY, 2));
                
                if (distance < 35) { // 20 (vacuum radius) + 15 (dirt radius)
                    dirt.style.animation = 'suckUp 0.3s forwards';
                    setTimeout(() => {
                        dirt.remove();
                        cleaned++;
                        progressSpan.textContent = cleaned;
                        
                        if (cleaned === totalDirt) {
                            setTimeout(() => {
                                this.complete('vacuum');
                            }, 500);
                        }
                    }, 300);
                }
            });
        });
        
        vacuumArea.addEventListener('mouseleave', () => {
            vacuum.style.display = 'none';
        });
        
        vacuumArea.addEventListener('mouseenter', () => {
            vacuum.style.display = 'block';
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
                    <div class="minigame-subtitle">Drag the trash bags to the bin!</div>
                </div>
                
                <div style="margin: 30px 0;">
                    <div style="text-align: center; margin-bottom: 20px; font-size: 20px; font-weight: bold; color: #2c3e50;">
                        Bags Taken Out: <span id="trashProgress">0</span> / 3
                    </div>
                    
                    <div style="display: flex; justify-content: space-between; align-items: center; max-width: 800px; margin: 0 auto;">
                        <div id="trashBags" style="
                            display: flex;
                            flex-direction: column;
                            gap: 20px;
                        ">
                            <!-- Trash bags will be here -->
                        </div>
                        
                        <div id="trashBin" style="
                            width: 200px;
                            height: 250px;
                            background: linear-gradient(135deg, #34495e, #2c3e50);
                            border-radius: 15px 15px 5px 5px;
                            position: relative;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 80px;
                            border: 5px solid #1a252f;
                        ">
                            🗑️
                            <div style="
                                position: absolute;
                                top: -30px;
                                left: -20px;
                                right: -20px;
                                height: 30px;
                                background: #2c3e50;
                                border-radius: 15px 15px 0 0;
                                border: 5px solid #1a252f;
                            "></div>
                        </div>
                    </div>
                </div>
                
                <div class="minigame-actions">
                    <button class="btn-skip" onclick="ChoreMinigames.close()">Skip Minigame</button>
                </div>
            </div>
        `;
        
        overlay.innerHTML = html;
        document.body.appendChild(overlay);
        
        this.setupTrash();
    },
    
    setupTrash() {
        const trashBags = document.getElementById('trashBags');
        const trashBin = document.getElementById('trashBin');
        const progressSpan = document.getElementById('trashProgress');
        
        let disposed = 0;
        
        for (let i = 0; i < 3; i++) {
            const bag = document.createElement('div');
            bag.className = 'trash-bag';
            bag.draggable = true;
            bag.dataset.bag = i;
            bag.style.cssText = `
                width: 100px;
                height: 120px;
                background: linear-gradient(135deg, #2d3436, #636e72);
                border-radius: 10px 10px 50% 50%;
                cursor: move;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 40px;
                box-shadow: 0 4px 8px rgba(0,0,0,0.3);
                transition: transform 0.2s;
            `;
            bag.textContent = '🗑️';
            
            bag.addEventListener('dragstart', (e) => {
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/plain', bag.dataset.bag);
                bag.style.opacity = '0.5';
            });
            
            bag.addEventListener('dragend', () => {
                bag.style.opacity = '1';
            });
            
            bag.addEventListener('mouseover', () => {
                bag.style.transform = 'scale(1.05)';
            });
            
            bag.addEventListener('mouseout', () => {
                bag.style.transform = 'scale(1)';
            });
            
            trashBags.appendChild(bag);
        }
        
        trashBin.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            trashBin.style.transform = 'scale(1.05)';
            trashBin.style.background = 'linear-gradient(135deg, #48bb78, #38a169)';
        });
        
        trashBin.addEventListener('dragleave', () => {
            trashBin.style.transform = 'scale(1)';
            trashBin.style.background = 'linear-gradient(135deg, #34495e, #2c3e50)';
        });
        
        trashBin.addEventListener('drop', (e) => {
            e.preventDefault();
            trashBin.style.transform = 'scale(1)';
            trashBin.style.background = 'linear-gradient(135deg, #34495e, #2c3e50)';
            
            const bagIndex = e.dataTransfer.getData('text/plain');
            const bag = document.querySelector(`[data-bag="${bagIndex}"]`);
            
            if (bag) {
                bag.style.animation = 'throwAway 0.5s ease-in forwards';
                setTimeout(() => {
                    bag.remove();
                    disposed++;
                    progressSpan.textContent = disposed;
                    
                    if (disposed === 3) {
                        setTimeout(() => {
                            this.complete('trash');
                        }, 500);
                    }
                }, 500);
            }
        });
    },
    
    // ==================== REALISTIC LAUNDRY GAME ====================
    laundryGame() {
        const overlay = document.createElement('div');
        overlay.className = 'minigame-overlay active';
        overlay.id = 'laundryGame';
        
        // Define clothing items with care requirements
        const clothes = [
            { emoji: '👕', name: 'White T-Shirt', wash: 'warm', dry: 'dryer', color: 'white' },
            { emoji: '🩱', name: 'White Swimsuit', wash: 'cold', dry: 'hang', color: 'white' },
            { emoji: '🧦', name: 'White Socks', wash: 'warm', dry: 'dryer', color: 'white' },
            { emoji: '👔', name: 'White Dress Shirt', wash: 'cold', dry: 'hang', color: 'white' },
            { emoji: '👖', name: 'Blue Jeans', wash: 'cold', dry: 'dryer', color: 'color' },
            { emoji: '👗', name: 'Red Dress', wash: 'cold', dry: 'hang', color: 'color' },
            { emoji: '👘', name: 'Yellow Kimono', wash: 'cold', dry: 'hang', color: 'color' },
            { emoji: '🩳', name: 'Green Shorts', wash: 'warm', dry: 'dryer', color: 'color' },
            { emoji: '🧥', name: 'Pink Jacket', wash: 'cold', dry: 'hang', color: 'color' },
            { emoji: '🩴', name: 'Purple Shirt', wash: 'warm', dry: 'dryer', color: 'color' }
        ];
        
        // Shuffle clothes
        clothes.sort(() => Math.random() - 0.5);
        
        let html = `
            <div class="minigame-container" style="max-width: 1000px;">
                <div class="minigame-header">
                    <div class="minigame-title">🧺 Do the Laundry</div>
                    <div class="minigame-subtitle">Sort clothes by wash temperature, then by dry method!</div>
                </div>
                
                <div style="margin: 20px 0;">
                    <!-- Phase Indicator -->
                    <div style="text-align: center; margin-bottom: 20px;">
                        <div style="font-size: 20px; font-weight: bold; color: #2c3e50; background: #ecf0f1; padding: 10px 20px; border-radius: 10px; display: inline-block;">
                            <span id="laundryPhase">Phase 1: Sort by Wash Temperature</span>
                        </div>
                        <div style="margin-top: 10px; font-size: 16px; color: #7f8c8d;">
                            Sorted: <span id="laundryProgress">0</span> / 10
                        </div>
                    </div>
                    
                    <!-- Phase 1: Wash Sorting -->
                    <div id="washPhase" style="display: block;">
                        <div style="display: flex; justify-content: space-around; gap: 20px; margin-bottom: 20px;">
                            <!-- Cold Wash Bin -->
                            <div id="coldBin" data-wash="cold" style="
                                flex: 1;
                                min-height: 300px;
                                background: linear-gradient(135deg, #a8dadc, #457b9d);
                                border-radius: 15px;
                                border: 4px solid #1d3557;
                                padding: 20px;
                                display: flex;
                                flex-direction: column;
                                align-items: center;
                            ">
                                <div style="font-size: 50px; margin-bottom: 10px;">❄️</div>
                                <div style="font-size: 20px; font-weight: bold; color: white; margin-bottom: 10px;">COLD WASH</div>
                                <div style="font-size: 14px; color: white; opacity: 0.9; text-align: center; margin-bottom: 15px;">
                                    Delicates, bright colors, swimwear
                                </div>
                                <div class="clothes-container" data-bin="cold" style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center;">
                                    <!-- Sorted clothes appear here -->
                                </div>
                            </div>
                            
                            <!-- Warm Wash Bin -->
                            <div id="warmBin" data-wash="warm" style="
                                flex: 1;
                                min-height: 300px;
                                background: linear-gradient(135deg, #f4a261, #e76f51);
                                border-radius: 15px;
                                border: 4px solid #d62828;
                                padding: 20px;
                                display: flex;
                                flex-direction: column;
                                align-items: center;
                            ">
                                <div style="font-size: 50px; margin-bottom: 10px;">🔥</div>
                                <div style="font-size: 20px; font-weight: bold; color: white; margin-bottom: 10px;">WARM WASH</div>
                                <div style="font-size: 14px; color: white; opacity: 0.9; text-align: center; margin-bottom: 15px;">
                                    Whites, towels, heavily soiled items
                                </div>
                                <div class="clothes-container" data-bin="warm" style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center;">
                                    <!-- Sorted clothes appear here -->
                                </div>
                            </div>
                        </div>
                        
                        <!-- Unsorted Clothes Pile -->
                        <div style="text-align: center; margin-bottom: 15px;">
                            <div style="font-size: 18px; font-weight: bold; color: #2c3e50; background: rgba(255,255,255,0.8); padding: 8px 15px; border-radius: 8px; display: inline-block;">
                                🧺 Unsorted Clothes (Click to see care label, then drag)
                            </div>
                        </div>
                        <div id="clothesPile" style="
                            display: flex;
                            flex-wrap: wrap;
                            gap: 15px;
                            justify-content: center;
                            padding: 20px;
                            background: rgba(236, 240, 241, 0.5);
                            border-radius: 15px;
                            min-height: 150px;
                        ">
                            ${clothes.map((item, idx) => `
                                <div class="laundry-item" draggable="true" 
                                     data-index="${idx}"
                                     data-wash="${item.wash}"
                                     data-dry="${item.dry}"
                                     data-color="${item.color}"
                                     data-name="${item.name}"
                                     style="
                                        width: 90px;
                                        height: 110px;
                                        background: white;
                                        border-radius: 12px;
                                        border: 3px solid #95a5a6;
                                        display: flex;
                                        flex-direction: column;
                                        align-items: center;
                                        justify-content: center;
                                        cursor: grab;
                                        box-shadow: 0 3px 8px rgba(0,0,0,0.2);
                                        transition: all 0.2s;
                                        position: relative;
                                    ">
                                    <div style="font-size: 50px;">${item.emoji}</div>
                                    <div style="font-size: 11px; color: #7f8c8d; margin-top: 5px; text-align: center; padding: 0 5px;">${item.name}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <!-- Phase 2: Dry Sorting (Hidden initially) -->
                    <div id="dryPhase" style="display: none;">
                        <div style="text-align: center; margin-bottom: 20px;">
                            <div style="font-size: 16px; color: #27ae60; background: #d5f4e6; padding: 10px 20px; border-radius: 10px; display: inline-block;">
                                ✅ Washing Complete! Now sort by drying method.
                            </div>
                        </div>
                        
                        <div style="display: flex; justify-content: space-around; gap: 20px; margin-bottom: 20px;">
                            <!-- Hang Dry Bin -->
                            <div id="hangBin" data-dry="hang" style="
                                flex: 1;
                                min-height: 300px;
                                background: linear-gradient(135deg, #a8e6cf, #56ab91);
                                border-radius: 15px;
                                border: 4px solid #3d7068;
                                padding: 20px;
                                display: flex;
                                flex-direction: column;
                                align-items: center;
                            ">
                                <div style="font-size: 50px; margin-bottom: 10px;">🪝</div>
                                <div style="font-size: 20px; font-weight: bold; color: white; margin-bottom: 10px;">HANG DRY</div>
                                <div style="font-size: 14px; color: white; opacity: 0.9; text-align: center; margin-bottom: 15px;">
                                    Delicates, shrink-prone items
                                </div>
                                <div class="clothes-container" data-bin="hang" style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center;">
                                    <!-- Sorted clothes appear here -->
                                </div>
                            </div>
                            
                            <!-- Machine Dry Bin -->
                            <div id="dryerBin" data-dry="dryer" style="
                                flex: 1;
                                min-height: 300px;
                                background: linear-gradient(135deg, #ffd97d, #ee9b00);
                                border-radius: 15px;
                                border: 4px solid #ca6702;
                                padding: 20px;
                                display: flex;
                                flex-direction: column;
                                align-items: center;
                            ">
                                <div style="font-size: 50px; margin-bottom: 10px;">🌀</div>
                                <div style="font-size: 20px; font-weight: bold; color: white; margin-bottom: 10px;">MACHINE DRY</div>
                                <div style="font-size: 14px; color: white; opacity: 0.9; text-align: center; margin-bottom: 15px;">
                                    Sturdy fabrics, everyday clothes
                                </div>
                                <div class="clothes-container" data-bin="dryer" style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center;">
                                    <!-- Sorted clothes appear here -->
                                </div>
                            </div>
                        </div>
                        
                        <!-- Washed Clothes Pile -->
                        <div style="text-align: center; margin-bottom: 15px;">
                            <div style="font-size: 18px; font-weight: bold; color: #2c3e50; background: rgba(255,255,255,0.8); padding: 8px 15px; border-radius: 8px; display: inline-block;">
                                🧺 Clean Clothes (Click to see care label, then drag)
                            </div>
                        </div>
                        <div id="washedPile" style="
                            display: flex;
                            flex-wrap: wrap;
                            gap: 15px;
                            justify-content: center;
                            padding: 20px;
                            background: rgba(168, 218, 220, 0.3);
                            border-radius: 15px;
                            min-height: 150px;
                        ">
                            <!-- Washed clothes will appear here after phase 1 -->
                        </div>
                    </div>
                </div>
                
                <div class="minigame-actions">
                    <button class="btn-skip" onclick="ChoreMinigames.close()">Skip Minigame</button>
                </div>
            </div>
        `;
        
        overlay.innerHTML = html;
        document.body.appendChild(overlay);
        
        this.setupLaundry(clothes);
    },
    
    setupLaundry(clothes) {
        let currentPhase = 1; // 1 = wash sorting, 2 = dry sorting
        let washSorted = 0;
        let drySorted = 0;
        
        const progressSpan = document.getElementById('laundryProgress');
        const phaseSpan = document.getElementById('laundryPhase');
        
        // Setup drag and drop for all items
        const setupDragDrop = () => {
            const items = document.querySelectorAll('.laundry-item');
            
            items.forEach(item => {
                // Click to show care label
                item.addEventListener('click', () => {
                    const wash = item.dataset.wash;
                    const dry = item.dataset.dry;
                    const name = item.dataset.name;
                    
                    const washIcon = wash === 'cold' ? '❄️ Cold' : '🔥 Warm';
                    const dryIcon = dry === 'hang' ? '🪝 Hang Dry' : '🌀 Dryer';
                    
                    UI.showNotification(
                        `📋 ${name}<br>Wash: ${washIcon} | Dry: ${dryIcon}`,
                        'info',
                        3000
                    );
                });
                
                item.addEventListener('dragstart', (e) => {
                    e.dataTransfer.effectAllowed = 'move';
                    e.dataTransfer.setData('text/plain', item.dataset.index);
                    item.style.opacity = '0.5';
                    item.style.cursor = 'grabbing';
                });
                
                item.addEventListener('dragend', () => {
                    item.style.opacity = '1';
                    item.style.cursor = 'grab';
                });
                
                item.addEventListener('mouseover', () => {
                    item.style.transform = 'scale(1.05)';
                });
                
                item.addEventListener('mouseout', () => {
                    item.style.transform = 'scale(1)';
                });
            });
        };
        
        // Setup drop zones
        const setupDropZones = (phase) => {
            const bins = phase === 1 
                ? [document.getElementById('coldBin'), document.getElementById('warmBin')]
                : [document.getElementById('hangBin'), document.getElementById('dryerBin')];
            
            bins.forEach(bin => {
                bin.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'move';
                    bin.style.transform = 'scale(1.02)';
                });
                
                bin.addEventListener('dragleave', () => {
                    bin.style.transform = 'scale(1)';
                });
                
                bin.addEventListener('drop', (e) => {
                    e.preventDefault();
                    bin.style.transform = 'scale(1)';
                    
                    const itemIndex = e.dataTransfer.getData('text/plain');
                    const item = document.querySelector(`[data-index="${itemIndex}"]`);
                    
                    if (!item) return;
                    
                    const correctValue = phase === 1 ? item.dataset.wash : item.dataset.dry;
                    const binValue = phase === 1 ? bin.dataset.wash : bin.dataset.dry;
                    
                    if (correctValue === binValue) {
                        // Correct!
                        const container = bin.querySelector('.clothes-container');
                        item.style.animation = 'fadeOut 0.3s forwards';
                        
                        setTimeout(() => {
                            // Create smaller version in bin
                            const miniItem = document.createElement('div');
                            miniItem.style.cssText = `
                                font-size: 35px;
                                width: 50px;
                                height: 50px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                background: white;
                                border-radius: 8px;
                                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                            `;
                            miniItem.textContent = item.querySelector('div').textContent;
                            miniItem.dataset.index = itemIndex;
                            miniItem.dataset.wash = item.dataset.wash;
                            miniItem.dataset.dry = item.dataset.dry;
                            miniItem.dataset.name = item.dataset.name;
                            container.appendChild(miniItem);
                            
                            item.remove();
                            
                            if (phase === 1) {
                                washSorted++;
                                progressSpan.textContent = washSorted;
                                
                                if (washSorted === 10) {
                                    setTimeout(() => {
                                        this.startDryPhase(miniItem);
                                    }, 500);
                                }
                            } else {
                                drySorted++;
                                progressSpan.textContent = drySorted;
                                
                                if (drySorted === 10) {
                                    setTimeout(() => {
                                        this.complete('laundry');
                                    }, 500);
                                }
                            }
                        }, 300);
                    } else {
                        // Wrong!
                        UI.showNotification('❌ Wrong! Check the care label.', 'error', 2000);
                        item.style.animation = 'shake 0.5s';
                        setTimeout(() => {
                            item.style.animation = '';
                        }, 500);
                    }
                });
            });
        };
        
        setupDragDrop();
        setupDropZones(1);
        
        // Transition to drying phase
        this.startDryPhase = () => {
            currentPhase = 2;
            drySorted = 0;
            progressSpan.textContent = '0';
            phaseSpan.textContent = 'Phase 2: Sort by Drying Method';
            
            document.getElementById('washPhase').style.display = 'none';
            document.getElementById('dryPhase').style.display = 'block';
            
            // Move all clothes from bins to washed pile
            const washedPile = document.getElementById('washedPile');
            const allSortedClothes = document.querySelectorAll('.clothes-container div');
            
            allSortedClothes.forEach((miniItem, idx) => {
                const fullItem = document.createElement('div');
                fullItem.className = 'laundry-item';
                fullItem.draggable = true;
                fullItem.dataset.index = idx;
                fullItem.dataset.wash = miniItem.dataset.wash;
                fullItem.dataset.dry = miniItem.dataset.dry;
                fullItem.dataset.name = miniItem.dataset.name;
                fullItem.style.cssText = `
                    width: 90px;
                    height: 110px;
                    background: linear-gradient(135deg, #e3f2fd, #bbdefb);
                    border-radius: 12px;
                    border: 3px solid #64b5f6;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    cursor: grab;
                    box-shadow: 0 3px 8px rgba(0,0,0,0.2);
                    transition: all 0.2s;
                `;
                fullItem.innerHTML = `
                    <div style="font-size: 50px;">${miniItem.textContent}</div>
                    <div style="font-size: 11px; color: #1976d2; margin-top: 5px; text-align: center; padding: 0 5px; font-weight: bold;">✨ ${miniItem.dataset.name}</div>
                `;
                washedPile.appendChild(fullItem);
            });
            
            setupDragDrop();
            setupDropZones(2);
        };
    }
};
