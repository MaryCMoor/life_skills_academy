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
    
    // ==================== BED MAKING GAME (FIXED LAYOUT) ====================
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
                    <div style="text-align: center; margin-bottom: 20px;">
                        <h3 style="color: #2c3e50;">Items to Place (drag in order):</h3>
                        <div style="font-size: 14px; color: #7f8c8d; margin-top: 5px;">1. Sheet (blue) → 2. Blanket (red) → 3. Pillow (orange)</div>
                    </div>
                    
                    <div id="bedItems" style="
                        display: flex;
                        justify-content: center;
                        gap: 30px;
                        flex-wrap: wrap;
                        margin-bottom: 30px;
                        padding: 20px;
                        background: rgba(236, 240, 241, 0.5);
                        border-radius: 15px;
                    ">
                        <div class="bed-item" draggable="true" data-item="sheet" data-order="1" style="
                            width: 150px;
                            height: 100px;
                            background: linear-gradient(135deg, #64b5f6, #42a5f5);
                            border-radius: 10px;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            cursor: move;
                            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                            font-size: 16px;
                            font-weight: bold;
                            color: white;
                            border: 3px solid #2196f3;
                            transition: all 0.2s;
                        " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                            <div style="font-size: 40px; margin-bottom: 8px;">📘</div>
                            <div>Sheet</div>
                            <div style="font-size: 12px; opacity: 0.9;">(Drag me first!)</div>
                        </div>
                        
                        <div class="bed-item" draggable="true" data-item="blanket" data-order="2" style="
                            width: 150px;
                            height: 100px;
                            background: linear-gradient(135deg, #ef5350, #e53935);
                            border-radius: 10px;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            cursor: move;
                            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                            font-size: 16px;
                            font-weight: bold;
                            color: white;
                            border: 3px solid #c62828;
                            transition: all 0.2s;
                        " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                            <div style="font-size: 40px; margin-bottom: 8px;">🟥</div>
                            <div>Blanket</div>
                            <div style="font-size: 12px; opacity: 0.9;">(Drag me second!)</div>
                        </div>
                        
                        <div class="bed-item" draggable="true" data-item="pillow" data-order="3" style="
                            width: 150px;
                            height: 100px;
                            background: linear-gradient(135deg, #ffa726, #fb8c00);
                            border-radius: 30px;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            cursor: move;
                            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                            font-size: 16px;
                            font-weight: bold;
                            color: white;
                            border: 3px solid #f57c00;
                            transition: all 0.2s;
                        " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                            <div style="font-size: 40px; margin-bottom: 8px;">🟧</div>
                            <div>Pillow</div>
                            <div style="font-size: 12px; opacity: 0.9;">(Drag me last!)</div>
                        </div>
                    </div>
                    
                    <div style="text-align: center; margin-bottom: 15px;">
                        <div style="font-size: 18px; font-weight: bold; color: #2c3e50;">
                            Items Placed: <span id="bedProgress">0</span> / 3
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
                            font-size: 48px;
                            color: rgba(255,255,255,0.3);
                            pointer-events: none;
                            text-align: center;
                        ">⬇️<br>Drop items here<br>⬇️</div>
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
    
    // ==================== LAUNDRY GAME ====================
    laundryGame() {
        const overlay = document.createElement('div');
        overlay.className = 'minigame-overlay active';
        overlay.id = 'laundryGame';
        
        let html = `
            <div class="minigame-container">
                <div class="minigame-header">
                    <div class="minigame-title">👕 Do the Laundry</div>
                    <div class="minigame-subtitle">Sort clothes by color: Whites and Colors!</div>
                </div>
                
                <div style="margin: 30px 0;">
                    <div style="text-align: center; margin-bottom: 20px; font-size: 20px; font-weight: bold; color: #2c3e50;">
                        Clothes Sorted: <span id="laundryProgress">0</span> / 10
                    </div>
                    
                    <div style="display: flex; justify-content: space-around; max-width: 900px; margin: 0 auto;">
                        <div id="whiteBin" data-color="white" style="
                            width: 200px;
                            height: 250px;
                            background: linear-gradient(135deg, #f7f7f7, #e0e0e0);
                            border-radius: 15px;
                            border: 5px solid #bdbdbd;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            padding: 20px;
                        ">
                            <div style="font-size: 50px; margin-bottom: 10px;">🤍</div>
                            <div style="font-size: 18px; font-weight: bold; color: #424242;">WHITES</div>
                        </div>
                        
                        <div id="clothesPile" style="
                            display: flex;
                            flex-wrap: wrap;
                            gap: 15px;
                            justify-content: center;
                            align-content: flex-start;
                            max-width: 300px;
                        ">
                            <!-- Clothes will be generated here -->
                        </div>
                        
                        <div id="colorBin" data-color="color" style="
                            width: 200px;
                            height: 250px;
                            background: linear-gradient(135deg, #ffd54f, #ffb300);
                            border-radius: 15px;
                            border: 5px solid #f57f17;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            padding: 20px;
                        ">
                            <div style="font-size: 50px; margin-bottom: 10px;">🌈</div>
                            <div style="font-size: 18px; font-weight: bold; color: #f57f17;">COLORS</div>
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
        
        this.setupLaundry();
    },
    
    setupLaundry() {
        const clothesPile = document.getElementById('clothesPile');
        const whiteBin = document.getElementById('whiteBin');
        const colorBin = document.getElementById('colorBin');
        const progressSpan = document.getElementById('laundryProgress');
        
        const clothes = [
            { emoji: '👕', color: 'white', bg: '#ffffff' },
            { emoji: '👔', color: 'white', bg: '#f5f5f5' },
            { emoji: '🩱', color: 'white', bg: '#eeeeee' },
            { emoji: '🧦', color: 'white', bg: '#fafafa' },
            { emoji: '👖', color: 'white', bg: '#f0f0f0' },
            { emoji: '👕', color: 'color', bg: '#ff6b6b' },
            { emoji: '👗', color: 'color', bg: '#4ecdc4' },
            { emoji: '👘', color: 'color', bg: '#ffe66d' },
            { emoji: '🩳', color: 'color', bg: '#a8e6cf' },
            { emoji: '🧥', color: 'color', bg: '#ff8b94' }
        ];
        
        let sorted = 0;
        
        // Shuffle clothes
        clothes.sort(() => Math.random() - 0.5);
        
        clothes.forEach((item, index) => {
            const cloth = document.createElement('div');
            cloth.className = 'laundry-item';
            cloth.draggable = true;
            cloth.dataset.color = item.color;
            cloth.dataset.index = index;
            cloth.style.cssText = `
                width: 80px;
                height: 80px;
                background: ${item.bg};
                border-radius: 10px;
                border: 3px solid #ccc;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 40px;
                cursor: move;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                transition: transform 0.2s;
            `;
            cloth.textContent = item.emoji;
            
            cloth.addEventListener('dragstart', (e) => {
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/plain', cloth.dataset.index);
                cloth.style.opacity = '0.5';
            });
            
            cloth.addEventListener('dragend', () => {
                cloth.style.opacity = '1';
            });
            
            clothesPile.appendChild(cloth);
        });
        
        [whiteBin, colorBin].forEach(bin => {
            bin.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                bin.style.transform = 'scale(1.05)';
            });
            
            bin.addEventListener('dragleave', () => {
                bin.style.transform = 'scale(1)';
            });
            
            bin.addEventListener('drop', (e) => {
                e.preventDefault();
                bin.style.transform = 'scale(1)';
                
                const clothIndex = e.dataTransfer.getData('text/plain');
                const cloth = document.querySelector(`[data-index="${clothIndex}"]`);
                
                if (!cloth) return;
                
                const clothColor = cloth.dataset.color;
                const binColor = bin.dataset.color;
                
                if (clothColor === binColor) {
                    // Correct bin!
                    cloth.style.animation = 'fadeOut 0.3s forwards';
                    setTimeout(() => {
                        cloth.remove();
                        sorted++;
                        progressSpan.textContent = sorted;
                        
                        if (sorted === 10) {
                            setTimeout(() => {
                                this.complete('laundry');
                            }, 500);
                        }
                    }, 300);
                } else {
                    // Wrong bin!
                    UI.showNotification('❌ Wrong bin! Sort by color.', 'error', 2000);
                    cloth.style.animation = 'shake 0.5s';
                    setTimeout(() => {
                        cloth.style.animation = '';
                    }, 500);
                }
            });
        });
    }
};
