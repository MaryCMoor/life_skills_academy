// ==================== REALISTIC LAUNDRY SIMULATION MINIGAME ====================

window.LaundryMinigame = {
    currentStep: 0,
    clothes: [],
    selectedClothes: [],
    washSettings: {
        temperature: null,
        detergent: null,
        softener: false,
        dryMethod: null
    },
    mistakes: [],
    
    start() {
        console.log('🧺 Starting realistic laundry simulation');
        this.currentStep = 0;
        this.mistakes = [];
        this.generateClothes();
        this.showStep1_Sorting();
    },
    
    // Generate random clothes with care labels
    generateClothes() {
        const clothingItems = [
            // Whites - delicate
            { 
                id: 1, name: 'White Cotton T-Shirt', color: 'white', fabric: 'cotton',
                emoji: '👕', bgColor: '#ffffff', textColor: '#333',
                careLabel: { temp: 'cold', bleach: 'ok', tumbleDry: 'low', ironTemp: 'medium' },
                ruinConditions: { hotWater: 'shrink', wrongColor: 'stained' }
            },
            { 
                id: 2, name: 'White Dress Shirt', color: 'white', fabric: 'cotton',
                emoji: '👔', bgColor: '#f9f9f9', textColor: '#333',
                careLabel: { temp: 'warm', bleach: 'ok', tumbleDry: 'low', ironTemp: 'high' },
                ruinConditions: { hotWater: 'shrink', wrongColor: 'stained' }
            },
            { 
                id: 3, name: 'White Socks', color: 'white', fabric: 'cotton-blend',
                emoji: '🧦', bgColor: '#fafafa', textColor: '#333',
                careLabel: { temp: 'hot', bleach: 'ok', tumbleDry: 'high', ironTemp: 'low' },
                ruinConditions: { wrongColor: 'stained' }
            },
            
            // Darks - need cold water
            { 
                id: 4, name: 'Black Jeans', color: 'dark', fabric: 'denim',
                emoji: '👖', bgColor: '#212121', textColor: '#fff',
                careLabel: { temp: 'cold', bleach: 'no', tumbleDry: 'low', ironTemp: 'medium' },
                ruinConditions: { hotWater: 'fade', warmWater: 'fade-slight', tumbleDry: 'shrink' }
            },
            { 
                id: 5, name: 'Navy Blue Hoodie', color: 'dark', fabric: 'cotton',
                emoji: '🧥', bgColor: '#1a237e', textColor: '#fff',
                careLabel: { temp: 'cold', bleach: 'no', tumbleDry: 'low', ironTemp: 'low' },
                ruinConditions: { hotWater: 'shrink', bleach: 'discolored' }
            },
            { 
                id: 6, name: 'Black Dress Pants', color: 'dark', fabric: 'polyester',
                emoji: '👔', bgColor: '#000000', textColor: '#fff',
                careLabel: { temp: 'cold', bleach: 'no', tumbleDry: 'no', ironTemp: 'low' },
                ruinConditions: { hotWater: 'melted', tumbleDry: 'melted' }
            },
            
            // Colors - prone to bleeding
            { 
                id: 7, name: 'Red Cotton Shirt', color: 'color', fabric: 'cotton',
                emoji: '👕', bgColor: '#d32f2f', textColor: '#fff',
                careLabel: { temp: 'cold', bleach: 'no', tumbleDry: 'medium', ironTemp: 'high' },
                ruinConditions: { hotWater: 'bleed', wrongColor: 'bleed-others' }
            },
            { 
                id: 8, name: 'Bright Yellow Tank Top', color: 'color', fabric: 'cotton',
                emoji: '👚', bgColor: '#fdd835', textColor: '#333',
                careLabel: { temp: 'cold', bleach: 'no', tumbleDry: 'low', ironTemp: 'medium' },
                ruinConditions: { hotWater: 'fade', bleach: 'ruined' }
            },
            { 
                id: 9, name: 'Purple Dress', color: 'color', fabric: 'silk',
                emoji: '👗', bgColor: '#7b1fa2', textColor: '#fff',
                careLabel: { temp: 'cold', bleach: 'no', tumbleDry: 'no', ironTemp: 'no' },
                ruinConditions: { hotWater: 'ruined', tumbleDry: 'ruined', roughDetergent: 'damaged' }
            },
            { 
                id: 10, name: 'Green Sweatpants', color: 'color', fabric: 'cotton',
                emoji: '🩳', bgColor: '#388e3c', textColor: '#fff',
                careLabel: { temp: 'warm', bleach: 'no', tumbleDry: 'medium', ironTemp: 'low' },
                ruinConditions: { hotWater: 'shrink' }
            },
            
            // Delicates
            { 
                id: 11, name: 'Wool Sweater', color: 'color', fabric: 'wool',
                emoji: '🧶', bgColor: '#8d6e63', textColor: '#fff',
                careLabel: { temp: 'cold', bleach: 'no', tumbleDry: 'no', ironTemp: 'no', handWash: true },
                ruinConditions: { hotWater: 'felted', warmWater: 'shrunk-badly', tumbleDry: 'ruined', roughDetergent: 'damaged' }
            },
            { 
                id: 12, name: 'Lace Blouse', color: 'white', fabric: 'lace',
                emoji: '👚', bgColor: '#fffaf0', textColor: '#333',
                careLabel: { temp: 'cold', bleach: 'no', tumbleDry: 'no', ironTemp: 'no', handWash: true },
                ruinConditions: { hotWater: 'torn', tumbleDry: 'torn', roughDetergent: 'torn' }
            }
        ];
        
        this.clothes = clothingItems;
    },
    
    // ==================== STEP 1: SORTING ====================
    showStep1_Sorting() {
        const overlay = document.createElement('div');
        overlay.className = 'minigame-overlay active';
        overlay.id = 'laundryGame';
        
        let html = `
            <div class="minigame-container" style="max-width: 1100px;">
                <div class="minigame-header">
                    <div class="minigame-title">🧺 Laundry Simulation - Step 1: Sort Clothes</div>
                    <div class="minigame-subtitle">Click on each item to read its care label, then sort by color</div>
                    <div style="margin-top: 10px;">
                        <div class="progress-bar" style="height: 8px;">
                            <div class="progress-fill" style="width: 25%; background: #4caf50;"></div>
                        </div>
                        <small>Step 1 of 4</small>
                    </div>
                </div>
                
                <div style="margin: 20px 0;">
                    <h3 style="text-align: center; color: #2c3e50;">Unsorted Laundry Pile</h3>
                    <div id="unsortedPile" style="
                        background: #ecf0f1;
                        border-radius: 15px;
                        padding: 20px;
                        min-height: 200px;
                        display: grid;
                        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
                        gap: 15px;
                        margin-bottom: 30px;
                    ">
                        ${this.clothes.map(item => `
                            <div class="laundry-item" data-item="${item.id}" style="
                                background: ${item.bgColor};
                                color: ${item.textColor};
                                padding: 15px;
                                border-radius: 10px;
                                cursor: pointer;
                                box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                                display: flex;
                                flex-direction: column;
                                align-items: center;
                                gap: 8px;
                                font-weight: bold;
                                border: 3px solid transparent;
                                transition: all 0.2s;
                                position: relative;
                            " onclick="LaundryMinigame.inspectClothing(${item.id})">
                                <span style="font-size: 48px;">${item.emoji}</span>
                                <span style="text-align: center; font-size: 12px;">${Utils.escapeHtml(item.name)}</span>
                                <span style="font-size: 10px; opacity: 0.8;">Click to inspect</span>
                            </div>
                        `).join('')}
                    </div>
                    
                    <h3 style="text-align: center; color: #2c3e50; margin-bottom: 15px;">Sorting Bins</h3>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;">
                        <div class="sort-bin" data-bin="whites" style="
                            background: linear-gradient(135deg, #ffffff, #f5f5f5);
                            border: 3px dashed #bdbdbd;
                            border-radius: 15px;
                            padding: 20px;
                            min-height: 150px;
                            text-align: center;
                        " ondrop="LaundryMinigame.dropClothing(event, 'whites')" 
                           ondragover="event.preventDefault(); event.currentTarget.style.borderColor='#2196f3';"
                           ondragleave="event.currentTarget.style.borderColor='#bdbdbd';">
                            <h4 style="color: #333; margin-bottom: 10px;">⚪ WHITES</h4>
                            <small style="color: #666;">White & light colors only</small>
                            <div class="bin-contents" style="margin-top: 15px; display: flex; flex-wrap: wrap; gap: 5px; justify-content: center;">
                            </div>
                        </div>
                        
                        <div class="sort-bin" data-bin="darks" style="
                            background: linear-gradient(135deg, #424242, #212121);
                            border: 3px dashed #757575;
                            border-radius: 15px;
                            padding: 20px;
                            min-height: 150px;
                            text-align: center;
                        " ondrop="LaundryMinigame.dropClothing(event, 'darks')" 
                           ondragover="event.preventDefault(); event.currentTarget.style.borderColor='#2196f3';"
                           ondragleave="event.currentTarget.style.borderColor='#757575';">
                            <h4 style="color: #fff; margin-bottom: 10px;">⚫ DARKS</h4>
                            <small style="color: #bbb;">Black, navy, dark colors</small>
                            <div class="bin-contents" style="margin-top: 15px; display: flex; flex-wrap: wrap; gap: 5px; justify-content: center;">
                            </div>
                        </div>
                        
                        <div class="sort-bin" data-bin="colors" style="
                            background: linear-gradient(135deg, #ff6b6b, #4ecdc4, #ffe66d, #a8e6cf);
                            border: 3px dashed #333;
                            border-radius: 15px;
                            padding: 20px;
                            min-height: 150px;
                            text-align: center;
                        " ondrop="LaundryMinigame.dropClothing(event, 'colors')" 
                           ondragover="event.preventDefault(); event.currentTarget.style.borderColor='#2196f3';"
                           ondragleave="event.currentTarget.style.borderColor='#333';">
                            <h4 style="color: #333; margin-bottom: 10px;">🌈 COLORS</h4>
                            <small style="color: #333;">Bright colors, reds, etc.</small>
                            <div class="bin-contents" style="margin-top: 15px; display: flex; flex-wrap: wrap; gap: 5px; justify-content: center;">
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="info-box" style="margin: 20px 0;">
                    <strong>💡 Sorting Tips:</strong>
                    <ul style="margin: 10px 0; padding-left: 20px;">
                        <li>Click items to read care labels before sorting</li>
                        <li>Whites wash separately to avoid staining</li>
                        <li>Dark colors can bleed - keep separate</li>
                        <li>Bright colors (red, yellow) need special care</li>
                        <li>Check fabric types for special instructions</li>
                    </ul>
                </div>
                
                <div class="minigame-actions">
                    <button class="btn btn-success btn-large" onclick="LaundryMinigame.validateSorting()" style="font-size: 18px; padding: 15px 30px;">
                        ✓ Done Sorting - Continue
                    </button>
                    <button class="btn-skip" onclick="LaundryMinigame.close()">Skip Minigame</button>
                </div>
            </div>
        `;
        
        overlay.innerHTML = html;
        document.body.appendChild(overlay);
    },
    
    inspectClothing(itemId) {
        const item = this.clothes.find(c => c.id === itemId);
        if (!item) return;
        
        // Show care label modal
        const modal = document.createElement('div');
        modal.className = 'minigame-overlay active';
        modal.id = 'careLabelModal';
        modal.style.background = 'rgba(0,0,0,0.8)';
        
        const careIcons = {
            cold: '❄️ Cold (30°C)',
            warm: '🌡️ Warm (40°C)',
            hot: '🔥 Hot (60°C)',
            low: '🔅 Low heat',
            medium: '🔆 Medium heat',
            high: '☀️ High heat',
            no: '❌ Do not',
            ok: '✓ Safe'
        };
        
        modal.innerHTML = `
            <div class="minigame-container" style="max-width: 500px; background: white; border-radius: 15px;">
                <div class="minigame-header" style="background: ${item.bgColor}; color: ${item.textColor}; border-radius: 15px 15px 0 0;">
                    <div style="font-size: 64px; margin-bottom: 10px;">${item.emoji}</div>
                    <div class="minigame-title">${Utils.escapeHtml(item.name)}</div>
                    <div class="minigame-subtitle">Fabric: ${Utils.escapeHtml(item.fabric)}</div>
                </div>
                
                <div style="padding: 30px;">
                    <div style="background: #fffef7; border: 2px solid #333; border-radius: 10px; padding: 20px; margin-bottom: 20px;">
                        <h3 style="text-align: center; margin-bottom: 15px; border-bottom: 2px solid #333; padding-bottom: 10px;">
                            🏷️ CARE LABEL
                        </h3>
                        
                        <div style="display: grid; gap: 15px;">
                            <div class="care-instruction">
                                <strong>Water Temperature:</strong>
                                <div style="font-size: 24px; margin-top: 5px;">
                                    ${careIcons[item.careLabel.temp]}
                                </div>
                            </div>
                            
                            <div class="care-instruction">
                                <strong>Bleach:</strong>
                                <div style="font-size: 24px; margin-top: 5px;">
                                    ${item.careLabel.bleach === 'ok' ? '✓ Safe to bleach' : '❌ Do not bleach'}
                                </div>
                            </div>
                            
                            <div class="care-instruction">
                                <strong>Tumble Dry:</strong>
                                <div style="font-size: 24px; margin-top: 5px;">
                                    ${item.careLabel.tumbleDry === 'no' ? '❌ Do not tumble dry' : careIcons[item.careLabel.tumbleDry]}
                                </div>
                            </div>
                            
                            <div class="care-instruction">
                                <strong>Iron:</strong>
                                <div style="font-size: 24px; margin-top: 5px;">
                                    ${item.careLabel.ironTemp === 'no' ? '❌ Do not iron' : careIcons[item.careLabel.ironTemp]}
                                </div>
                            </div>
                            
                            ${item.careLabel.handWash ? `
                                <div class="care-instruction" style="background: #fff3cd; padding: 10px; border-radius: 5px;">
                                    <strong style="color: #856404;">⚠️ HAND WASH ONLY</strong>
                                    <div>This is a delicate item!</div>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                    
                    <div class="alert alert-info">
                        <strong>💡 Remember:</strong> Follow these instructions carefully to avoid damaging the garment!
                    </div>
                    
                    <button class="btn btn-primary btn-large" onclick="document.getElementById('careLabelModal').remove()" style="width: 100%; font-size: 18px;">
                        Got it! Close Label
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Make the item draggable after inspection
        const itemElement = document.querySelector(`[data-item="${itemId}"]`);
        if (itemElement) {
            itemElement.draggable = true;
            itemElement.style.borderColor = '#4caf50';
            itemElement.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('itemId', itemId);
            });
        }
    },
    
    dropClothing(event, binType) {
        event.preventDefault();
        event.currentTarget.style.borderColor = binType === 'whites' ? '#bdbdbd' : binType === 'darks' ? '#757575' : '#333';
        
        const itemId = parseInt(event.dataTransfer.getData('itemId'));
        const item = this.clothes.find(c => c.id === itemId);
        
        if (!item) return;
        
        // Remove from unsorted pile
        const itemElement = document.querySelector(`[data-item="${itemId}"]`);
        if (itemElement && itemElement.parentNode.id === 'unsortedPile') {
            itemElement.remove();
            
            // Add to bin
            const bin = event.currentTarget.querySelector('.bin-contents');
            const badge = document.createElement('span');
            badge.style.cssText = 'font-size: 32px; opacity: 0; animation: fadeIn 0.3s forwards;';
            badge.textContent = item.emoji;
            badge.dataset.itemId = itemId;
            badge.dataset.correctBin = item.color;
            badge.dataset.currentBin = binType;
            bin.appendChild(badge);
        }
    },
    
    validateSorting() {
        const bins = document.querySelectorAll('.bin-contents');
        let allSorted = true;
        let mistakes = [];
        
        bins.forEach(bin => {
            const badges = bin.querySelectorAll('[data-item-id]');
            badges.forEach(badge => {
                const correctBin = badge.dataset.correctBin;
                const currentBin = badge.dataset.currentBin;
                const itemId = parseInt(badge.dataset.itemId);
                const item = this.clothes.find(c => c.id === itemId);
                
                if (correctBin !== currentBin) {
                    mistakes.push({
                        item: item.name,
                        wrongBin: currentBin,
                        rightBin: correctBin,
                        consequence: 'wrong-sort'
                    });
                }
            });
        });
        
        // Check if anything is still unsorted
        const unsortedCount = document.querySelectorAll('#unsortedPile .laundry-item').length;
        if (unsortedCount > 0) {
            UI.showNotification(`❌ You still have ${unsortedCount} items to sort!`, 'error');
            return;
        }
        
        if (mistakes.length > 0) {
            this.mistakes.push(...mistakes);
            UI.showNotification(`⚠️ ${mistakes.length} sorting mistakes detected! This may cause problems later.`, 'warning');
        } else {
            UI.showNotification('✅ Perfect sorting!', 'success');
        }
        
        // Select a load to wash (choose the bin with most items)
        this.selectLoadToWash();
    },
    
    selectLoadToWash() {
        document.getElementById('laundryGame').remove();
        
        const overlay = document.createElement('div');
        overlay.className = 'minigame-overlay active';
        overlay.id = 'laundryGame';
        
        overlay.innerHTML = `
            <div class="minigame-container" style="max-width: 800px;">
                <div class="minigame-header">
                    <div class="minigame-title">🧺 Select a Load to Wash</div>
                    <div class="minigame-subtitle">Choose which sorted pile you want to wash first</div>
                    <div style="margin-top: 10px;">
                        <div class="progress-bar" style="height: 8px;">
                            <div class="progress-fill" style="width: 40%; background: #4caf50;"></div>
                        </div>
                        <small>Step 1.5 of 4</small>
                    </div>
                </div>
                
                <div style="margin: 30px 0; display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;">
                    <div class="card hoverable" onclick="LaundryMinigame.chooseLoad('whites')" style="cursor: pointer;">
                        <div class="card-title">⚪ Whites Load</div>
                        <div class="card-content" style="text-align: center;">
                            <div style="font-size: 48px; margin: 20px 0;">🤍</div>
                            <button class="btn btn-primary">Wash Whites</button>
                        </div>
                    </div>
                    
                    <div class="card hoverable" onclick="LaundryMinigame.chooseLoad('darks')" style="cursor: pointer;">
                        <div class="card-title">⚫ Darks Load</div>
                        <div class="card-content" style="text-align: center;">
                            <div style="font-size: 48px; margin: 20px 0;">🖤</div>
                            <button class="btn btn-primary">Wash Darks</button>
                        </div>
                    </div>
                    
                    <div class="card hoverable" onclick="LaundryMinigame.chooseLoad('colors')" style="cursor: pointer;">
                        <div class="card-title">🌈 Colors Load</div>
                        <div class="card-content" style="text-align: center;">
                            <div style="font-size: 48px; margin: 20px 0;">❤️💛💚</div>
                            <button class="btn btn-primary">Wash Colors</button>
                        </div>
                    </div>
                </div>
                
                <div class="info-box">
                    <strong>💡 Tip:</strong> In real life, you'd wash all three loads, but for this game we'll focus on one load to complete the full process!
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
    },
    
    chooseLoad(loadType) {
        this.selectedLoad = loadType;
        
        // Filter clothes that belong to this load
        const colorMap = { 'whites': 'white', 'darks': 'dark', 'colors': 'color' };
        this.selectedClothes = this.clothes.filter(c => c.color === colorMap[loadType]);
        
        this.showStep2_WashSettings();
    },
    
    // ==================== STEP 2: WASH SETTINGS ====================
    showStep2_WashSettings() {
        document.getElementById('laundryGame').remove();
        
        const overlay = document.createElement('div');
        overlay.className = 'minigame-overlay active';
        overlay.id = 'laundryGame';
        
        const loadName = this.selectedLoad.charAt(0).toUpperCase() + this.selectedLoad.slice(1);
        
        overlay.innerHTML = `
            <div class="minigame-container" style="max-width: 900px;">
                <div class="minigame-header">
                    <div class="minigame-title">🌊 Step 2: Washing Machine Settings</div>
                    <div class="minigame-subtitle">Configure settings for your ${loadName} load</div>
                    <div style="margin-top: 10px;">
                        <div class="progress-bar" style="height: 8px;">
                            <div class="progress-fill" style="width: 50%; background: #4caf50;"></div>
                        </div>
                        <small>Step 2 of 4</small>
                    </div>
                </div>
                
                <div style="margin: 30px 0;">
                    <!-- Items in this load -->
                    <div class="alert alert-info">
                        <strong>Items in this load:</strong>
                        <div style="display: flex; gap: 10px; margin-top: 10px; flex-wrap: wrap;">
                            ${this.selectedClothes.map(item => `
                                <span style="font-size: 24px;" title="${Utils.escapeHtml(item.name)}">${item.emoji}</span>
                            `).join('')}
                        </div>
                    </div>
                    
                    <!-- Water Temperature -->
                    <div class="card">
                        <div class="card-title">🌡️ Water Temperature</div>
                        <div class="card-content">
                            <p style="margin-bottom: 15px;">Choose the water temperature for this load:</p>
                            
                            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px;">
                                <div class="option-card" onclick="LaundryMinigame.selectTemperature('cold')" data-option="cold">
                                    <div style="font-size: 48px;">❄️</div>
                                    <strong>Cold Water</strong>
                                    <small>Best for: Colors, darks, delicates</small>
                                    <small>Prevents: Shrinking, fading</small>
                                </div>
                                
                                <div class="option-card" onclick="LaundryMinigame.selectTemperature('warm')" data-option="warm">
                                    <div style="font-size: 48px;">🌡️</div>
                                    <strong>Warm Water</strong>
                                    <small>Best for: Lightly soiled items</small>
                                    <small>Caution: May shrink some fabrics</small>
                                </div>
                                
                                <div class="option-card" onclick="LaundryMinigame.selectTemperature('hot')" data-option="hot">
                                    <div style="font-size: 48px;">🔥</div>
                                    <strong>Hot Water</strong>
                                    <small>Best for: Whites, heavily soiled</small>
                                    <small>Caution: Can shrink/fade clothes</small>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Detergent -->
                    <div class="card mt-20">
                        <div class="card-title">🧴 Detergent Type</div>
                        <div class="card-content">
                            <p style="margin-bottom: 15px;">Choose your detergent:</p>
                            
                            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px;">
                                <div class="option-card" onclick="LaundryMinigame.selectDetergent('regular')" data-option="regular">
                                    <div style="font-size: 48px;">🧴</div>
                                    <strong>Regular Detergent</strong>
                                    <small>For everyday laundry</small>
                                    <small>Standard cleaning power</small>
                                </div>
                                
                                <div class="option-card" onclick="LaundryMinigame.selectDetergent('gentle')" data-option="gentle">
                                    <div style="font-size: 48px;">🌿</div>
                                    <strong>Gentle/Delicate</strong>
                                    <small>For delicates, wool, silk</small>
                                    <small>Mild, non-aggressive</small>
                                </div>
                                
                                <div class="option-card" onclick="LaundryMinigame.selectDetergent('heavy')" data-option="heavy">
                                    <div style="font-size: 48px;">💪</div>
                                    <strong>Heavy Duty</strong>
                                    <small>For tough stains</small>
                                    <small>Strong cleaning agents</small>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Fabric Softener -->
                    <div class="card mt-20">
                        <div class="card-title">✨ Fabric Softener</div>
                        <div class="card-content">
                            <p style="margin-bottom: 15px;">Add fabric softener? (Makes clothes soft and reduces static)</p>
                            
                            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
                                <div class="option-card" onclick="LaundryMinigame.selectSoftener(true)" data-option="softener-yes">
                                    <div style="font-size: 48px;">✅</div>
                                    <strong>Yes, Add Softener</strong>
                                    <small>Softer, fresher clothes</small>
                                </div>
                                
                                <div class="option-card" onclick="LaundryMinigame.selectSoftener(false)" data-option="softener-no">
                                    <div style="font-size: 48px;">❌</div>
                                    <strong>No Softener</strong>
                                    <small>Better for towels & athletic wear</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="minigame-actions">
                    <button class="btn btn-success btn-large" onclick="LaundryMinigame.startWashing()" id="startWashBtn" disabled style="font-size: 18px; padding: 15px 30px;">
                        🌊 Start Washing Machine
                    </button>
                    <button class="btn-skip" onclick="LaundryMinigame.close()">Skip Minigame</button>
                </div>
            </div>
            
            <style>
                .option-card {
                    background: white;
                    border: 3px solid #ddd;
                    border-radius: 10px;
                    padding: 20px;
                    text-align: center;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                
                .option-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                }
                
                .option-card.selected {
                    border-color: #4caf50;
                    background: #e8f5e9;
                    transform: scale(1.05);
                }
                
                .option-card strong {
                    display: block;
                    margin: 10px 0 5px;
                    font-size: 16px;
                }
                
                .option-card small {
                    display: block;
                    color: #666;
                    font-size: 12px;
                    margin-top: 3px;
                }
            </style>
        `;
        
        document.body.appendChild(overlay);
    },
    
    selectTemperature(temp) {
        this.washSettings.temperature = temp;
        document.querySelectorAll('[data-option^="cold"], [data-option^="warm"], [data-option^="hot"]').forEach(el => {
            el.classList.remove('selected');
        });
        document.querySelector(`[data-option="${temp}"]`).classList.add('selected');
        this.checkWashSettingsComplete();
    },
    
    selectDetergent(detergent) {
        this.washSettings.detergent = detergent;
        document.querySelectorAll('[data-option="regular"], [data-option="gentle"], [data-option="heavy"]').forEach(el => {
            el.classList.remove('selected');
        });
        document.querySelector(`[data-option="${detergent}"]`).classList.add('selected');
        this.checkWashSettingsComplete();
    },
    
    selectSoftener(useSoftener) {
        this.washSettings.softener = useSoftener;
        document.querySelectorAll('[data-option^="softener"]').forEach(el => {
            el.classList.remove('selected');
        });
        document.querySelector(`[data-option="softener-${useSoftener ? 'yes' : 'no'}"]`).classList.add('selected');
        this.checkWashSettingsComplete();
    },
    
    checkWashSettingsComplete() {
        const btn = document.getElementById('startWashBtn');
        if (this.washSettings.temperature && this.washSettings.detergent && this.washSettings.softener !== null) {
            btn.disabled = false;
        }
    },
    
    startWashing() {
        // Check for mistakes based on settings
        this.selectedClothes.forEach(item => {
            // Check temperature
            if (this.washSettings.temperature === 'hot' && item.ruinConditions.hotWater) {
                this.mistakes.push({
                    item: item.name,
                    issue: item.ruinConditions.hotWater,
                    reason: 'Used hot water when care label said cold/warm'
                });
            } else if (this.washSettings.temperature === 'warm' && item.ruinConditions.warmWater) {
                this.mistakes.push({
                    item: item.name,
                    issue: item.ruinConditions.warmWater,
                    reason: 'Used warm water when care label said cold'
                });
            }
            
            // Check detergent
            if (this.washSettings.detergent === 'heavy' && item.ruinConditions.roughDetergent) {
                this.mistakes.push({
                    item: item.name,
                    issue: item.ruinConditions.roughDetergent,
                    reason: 'Used heavy-duty detergent on delicate fabric'
                });
            }
        });
        
        this.showStep3_DryingSettings();
    },
    
    // ==================== STEP 3: DRYING ====================
    showStep3_DryingSettings() {
        document.getElementById('laundryGame').remove();
        
        const overlay = document.createElement('div');
        overlay.className = 'minigame-overlay active';
        overlay.id = 'laundryGame';
        
        overlay.innerHTML = `
            <div class="minigame-container" style="max-width: 900px;">
                <div class="minigame-header">
                    <div class="minigame-title">☀️ Step 3: Drying Method</div>
                    <div class="minigame-subtitle">The wash cycle is complete! Now choose how to dry your clothes</div>
                    <div style="margin-top: 10px;">
                        <div class="progress-bar" style="height: 8px;">
                            <div class="progress-fill" style="width: 75%; background: #4caf50;"></div>
                        </div>
                        <small>Step 3 of 4</small>
                    </div>
                </div>
                
                <div style="margin: 30px 0;">
                    <div class="alert alert-success">
                        🎵 <em>*Washing machine beeps*</em> - Wash cycle complete!
                    </div>
                    
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-top: 30px;">
                        <div class="card hoverable" style="cursor: pointer;" onclick="LaundryMinigame.selectDrying('hang')">
                            <div class="card-title">👔 Hang Dry</div>
                            <div class="card-content" style="text-align: center;">
                                <div style="font-size: 80px; margin: 20px 0;">🏖️</div>
                                <p><strong>Air dry on a rack or clothesline</strong></p>
                                <ul style="text-align: left; margin: 15px 0;">
                                    <li>✅ Gentlest method</li>
                                    <li>✅ Prevents shrinkage</li>
                                    <li>✅ Saves energy</li>
                                    <li>⏰ Takes longer (few hours)</li>
                                    <li>📋 Safe for all fabrics</li>
                                </ul>
                                <button class="btn btn-primary">Hang Dry</button>
                            </div>
                        </div>
                        
                        <div class="card hoverable" style="cursor: pointer;" onclick="LaundryMinigame.selectDrying('tumble')">
                            <div class="card-title">🌪️ Tumble Dry</div>
                            <div class="card-content" style="text-align: center;">
                                <div style="font-size: 80px; margin: 20px 0;">🔥</div>
                                <p><strong>Use the dryer machine</strong></p>
                                <p style="margin: 15px 0; color: #666;">If you choose this, you'll need to select heat level</p>
                                <ul style="text-align: left; margin: 15px 0;">
                                    <li>✅ Fast drying (30-60 min)</li>
                                    <li>✅ Clothes come out soft</li>
                                    <li>⚠️ Can shrink some items</li>
                                    <li>⚠️ May damage delicates</li>
                                    <li>❌ Not safe for all fabrics</li>
                                </ul>
                                <button class="btn btn-primary">Use Dryer</button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="info-box mt-20">
                        <strong>💡 Drying Tips:</strong>
                        <ul>
                            <li>Check each item's care label - some items must be hung dry</li>
                            <li>Wool, silk, and delicates usually can't go in the dryer</li>
                            <li>High heat can shrink cotton and damage elastic</li>
                            <li>When in doubt, hang dry or use low heat</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
    },
    
    selectDrying(method) {
        if (method === 'tumble') {
            this.showTumbleDrySettings();
        } else {
            this.washSettings.dryMethod = 'hang';
            this.finishLaundry();
        }
    },
    
    showTumbleDrySettings() {
        document.getElementById('laundryGame').remove();
        
        const overlay = document.createElement('div');
        overlay.className = 'minigame-overlay active';
        overlay.id = 'laundryGame';
        
        overlay.innerHTML = `
            <div class="minigame-container" style="max-width: 800px;">
                <div class="minigame-header">
                    <div class="minigame-title">🌪️ Dryer Heat Setting</div>
                    <div class="minigame-subtitle">Choose the heat level for the dryer</div>
                </div>
                
                <div style="margin: 30px 0;">
                    <div class="alert alert-warning">
                        ⚠️ <strong>Warning:</strong> Some items in your load may not be safe for the dryer! Review care labels carefully.
                    </div>
                    
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-top: 30px;">
                        <div class="option-card" onclick="LaundryMinigame.setDryerHeat('low')" data-option="low">
                            <div style="font-size: 48px;">🔅</div>
                            <strong>Low Heat</strong>
                            <small>Gentle drying</small>
                            <small>Safest for most items</small>
                        </div>
                        
                        <div class="option-card" onclick="LaundryMinigame.setDryerHeat('medium')" data-option="medium">
                            <div style="font-size: 48px;">🔆</div>
                            <strong>Medium Heat</strong>
                            <small>Standard drying</small>
                            <small>For regular clothes</small>
                        </div>
                        
                        <div class="option-card" onclick="LaundryMinigame.setDryerHeat('high')" data-option="high">
                            <div style="font-size: 48px;">☀️</div>
                            <strong>High Heat</strong>
                            <small>Fast drying</small>
                            <small>Risk of shrinkage</small>
                        </div>
                    </div>
                </div>
                
                <div class="minigame-actions">
                    <button class="btn btn-success btn-large" onclick="LaundryMinigame.finishLaundry()" id="finishBtn" disabled style="font-size: 18px; padding: 15px 30px;">
                        🌪️ Start Dryer
                    </button>
                    <button class="btn" onclick="LaundryMinigame.selectDrying('hang')">← Go Back (Hang Dry Instead)</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
    },
    
    setDryerHeat(heat) {
        this.washSettings.dryMethod = 'tumble-' + heat;
        
        document.querySelectorAll('[data-option]').forEach(el => el.classList.remove('selected'));
        document.querySelector(`[data-option="${heat}"]`).classList.add('selected');
        document.getElementById('finishBtn').disabled = false;
        
        // Check for dryer mistakes
        this.selectedClothes.forEach(item => {
            if (item.careLabel.tumbleDry === 'no') {
                this.mistakes.push({
                    item: item.name,
                    issue: 'ruined',
                    reason: 'Put in dryer when care label said "Do not tumble dry"'
                });
            } else if (heat === 'high' && item.ruinConditions.tumbleDry === 'shrink') {
                this.mistakes.push({
                    item: item.name,
                    issue: 'shrunk',
                    reason: 'Used high heat in dryer'
                });
            }
        });
    },
    
    // ==================== STEP 4: RESULTS ====================
    finishLaundry() {
        document.getElementById('laundryGame').remove();
        
        const overlay = document.createElement('div');
        overlay.className = 'minigame-overlay active';
        overlay.id = 'laundryGame';
        
        const perfectLaundry = this.mistakes.length === 0;
        const skillGain = perfectLaundry ? 20 : Math.max(5, 20 - this.mistakes.length * 3);
        const moneyEarned = perfectLaundry ? 15 : Math.max(5, 15 - this.mistakes.length * 2);
        
        let resultHTML = '';
        
        if (perfectLaundry) {
            resultHTML = `
                <div class="alert alert-success" style="font-size: 18px; text-align: center; padding: 30px;">
                    <div style="font-size: 80px; margin-bottom: 20px;">🎉</div>
                    <h2 style="color: #27ae60; margin-bottom: 15px;">PERFECT LAUNDRY!</h2>
                    <p>You followed all care instructions correctly!</p>
                    <p>All clothes are clean, undamaged, and properly cared for!</p>
                </div>
            `;
        } else {
            resultHTML = `
                <div class="alert alert-warning" style="font-size: 16px;">
                    <h3 style="color: #f39c12; margin-bottom: 15px;">⚠️ Laundry Issues Detected</h3>
                    <p>You made ${this.mistakes.length} mistake(s) during the laundry process:</p>
                </div>
                
                <div style="max-height: 300px; overflow-y: auto; margin: 20px 0;">
                    ${this.mistakes.map((mistake, i) => `
                        <div class="card" style="background: #fff3cd; border-left: 4px solid #f39c12; margin-bottom: 15px;">
                            <div class="card-content">
                                <strong style="color: #856404;">${i + 1}. ${Utils.escapeHtml(mistake.item)}</strong>
                                <div style="margin-top: 8px;">
                                    <div>❌ <strong>Issue:</strong> ${Utils.escapeHtml(mistake.issue)}</div>
                                    <div>💡 <strong>Reason:</strong> ${Utils.escapeHtml(mistake.reason)}</div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="info-box">
                    <strong>💡 Learning Point:</strong> Always read care labels carefully! Following instructions prevents damage and extends clothing life.
                </div>
            `;
        }
        
        overlay.innerHTML = `
            <div class="minigame-container" style="max-width: 800px;">
                <div class="minigame-header">
                    <div class="minigame-title">✅ Laundry Complete!</div>
                    <div class="minigame-subtitle">Your laundry journey is done</div>
                    <div style="margin-top: 10px;">
                        <div class="progress-bar" style="height: 8px;">
                            <div class="progress-fill" style="width: 100%; background: #4caf50;"></div>
                        </div>
                        <small>Complete!</small>
                    </div>
                </div>
                
                <div style="margin: 30px 0;">
                    ${resultHTML}
                    
                    <div class="stats-display" style="margin-top: 30px;">
                        <div class="stat-box">
                            <div class="icon">💵</div>
                            <div class="label">Money Earned</div>
                            <div class="value">+$${moneyEarned}</div>
                        </div>
                        <div class="stat-box">
                            <div class="icon">🧺</div>
                            <div class="label">Laundry Skill</div>
                            <div class="value">+${skillGain}</div>
                        </div>
                        <div class="stat-box">
                            <div class="icon">${perfectLaundry ? '✅' : '⚠️'}</div>
                            <div class="label">Mistakes Made</div>
                            <div class="value">${this.mistakes.length}</div>
                        </div>
                    </div>
                    
                    <div class="card mt-20" style="background: #e8f5e9;">
                        <div class="card-title">📚 What You Learned</div>
                        <div class="card-content">
                            <ul>
                                <li>✓ How to read clothing care labels</li>
                                <li>✓ Importance of sorting by color</li>
                                <li>✓ Choosing appropriate water temperature</li>
                                <li>✓ Selecting the right detergent</li>
                                <li>✓ Proper drying methods for different fabrics</li>
                                <li>✓ Consequences of not following instructions</li>
                            </ul>
                        </div>
                    </div>
                </div>
                
                <div class="minigame-actions">
                    <button class="btn btn-success btn-large" onclick="LaundryMinigame.complete(${moneyEarned}, ${skillGain})" style="font-size: 18px; padding: 15px 30px;">
                        ✓ Finish & Collect Rewards
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
    },
    
    complete(money, skill) {
        GameState.addMoney(money, 'laundry');
        GameState.addSkill('laundry', skill);
        GameState.completeChore('laundry');
        GameState.clearBusy();
        GameState.stats.choresCompleted++;
        
        if (this.mistakes.length === 0) {
            GameState.addAchievement('Laundry Pro', 'Complete laundry minigame perfectly', '🧺');
        }
        
        UI.showNotification(`✅ Laundry complete! +$${money}, +${skill} laundry skill`, 'success');
        
        this.close();
        
        if (typeof loadHome === 'function') {
            loadHome();
        }
        UI.updateStats();
    },
    
    close() {
        const overlay = document.getElementById('laundryGame');
        if (overlay && overlay.parentNode) {
            overlay.parentNode.removeChild(overlay);
        }
        const modal = document.getElementById('careLabelModal');
        if (modal && modal.parentNode) {
            modal.parentNode.removeChild(modal);
        }
    }
};

console.log('✅ laundry.js (Interactive Simulation) loaded');
