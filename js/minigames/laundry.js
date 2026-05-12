// ==================== LAUNDRY MINIGAME (UPDATED) ====================

window.LaundryMinigame = {
    currentPhase: 0,
    sortedCorrectly: false,
    
    phases: [
        {
            name: 'Sorting',
            instruction: 'Sort clothes by color to prevent bleeding',
            action: 'Sort Clothes'
        },
        {
            name: 'Washing',
            instruction: 'Select correct water temperature and detergent',
            action: 'Start Wash Cycle'
        },
        {
            name: 'Drying',
            instruction: 'Choose appropriate dryer settings',
            action: 'Start Dryer'
        },
        {
            name: 'Folding',
            instruction: 'Fold clothes neatly to prevent wrinkles',
            action: 'Fold Clothes'
        }
    ],
    
    start() {
        this.currentPhase = 0;
        this.sortedCorrectly = false;
        this.showPhase();
    },
    
    showPhase() {
        const phase = this.phases[this.currentPhase];
        
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.id = 'laundryModal';
        
        let content = '';
        
        if (this.currentPhase === 0) {
            content = this.renderSorting();
        } else if (this.currentPhase === 1) {
            content = this.renderWashing();
        } else if (this.currentPhase === 2) {
            content = this.renderDrying();
        } else if (this.currentPhase === 3) {
            content = this.renderFolding();
        }
        
        modal.innerHTML = `
            <div class="modal-content laundry-minigame">
                <div class="minigame-header">
                    <h2>🧺 Laundry Time</h2>
                    <div class="step-counter">Phase ${this.currentPhase + 1} of ${this.phases.length}</div>
                </div>
                
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${((this.currentPhase + 1) / this.phases.length) * 100}%"></div>
                </div>
                
                <div class="laundry-content">
                    <h3>${phase.name}</h3>
                    <p class="instruction-text">${phase.instruction}</p>
                    ${content}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    },
    
    renderSorting() {
        return `
            <div class="sorting-game">
                <div class="clothes-pile">
                    <div class="cloth-item" draggable="true" data-color="white">👕 White Shirt</div>
                    <div class="cloth-item" draggable="true" data-color="dark">🧥 Dark Jeans</div>
                    <div class="cloth-item" draggable="true" data-color="white">🩳 White Socks</div>
                    <div class="cloth-item" draggable="true" data-color="dark">👔 Black Pants</div>
                    <div class="cloth-item" draggable="true" data-color="color">🎽 Red Shirt</div>
                </div>
                
                <div class="sorting-bins">
                    <div class="bin" data-bin="white">
                        <div class="bin-label">Whites</div>
                        <div class="bin-contents"></div>
                    </div>
                    <div class="bin" data-bin="dark">
                        <div class="bin-label">Darks</div>
                        <div class="bin-contents"></div>
                    </div>
                    <div class="bin" data-bin="color">
                        <div class="bin-label">Colors</div>
                        <div class="bin-contents"></div>
                    </div>
                </div>
                
                <div class="info-box mt-20">
                    <p><strong>💡 Tip:</strong> Sort whites, darks, and colors separately to prevent color bleeding!</p>
                </div>
                
                <button class="btn btn-primary mt-20" onclick="LaundryMinigame.checkSorting()">
                    ✅ Check My Sorting
                </button>
            </div>
        `;
    },
    
    checkSorting() {
        // Simple version - just advance to next phase
        this.sortedCorrectly = true;
        UI.showNotification('✅ Clothes sorted correctly!', 'success');
        this.nextPhase();
    },
    
    renderWashing() {
        return `
            <div class="washing-controls">
                <div class="control-panel">
                    <div class="control-group">
                        <label>Water Temperature:</label>
                        <select id="waterTemp" class="form-control">
                            <option value="">Select...</option>
                            <option value="cold">❄️ Cold (Best for colors)</option>
                            <option value="warm">🌡️ Warm (General use)</option>
                            <option value="hot">🔥 Hot (Whites/Sanitize)</option>
                        </select>
                    </div>
                    
                    <div class="control-group mt-20">
                        <label>Detergent Amount:</label>
                        <select id="detergent" class="form-control">
                            <option value="">Select...</option>
                            <option value="small">Small Load</option>
                            <option value="medium">Medium Load</option>
                            <option value="large">Large Load</option>
                        </select>
                    </div>
                    
                    <div class="control-group mt-20">
                        <label>Cycle Type:</label>
                        <select id="cycle" class="form-control">
                            <option value="">Select...</option>
                            <option value="normal">Normal</option>
                            <option value="delicate">Delicate</option>
                            <option value="heavy">Heavy Duty</option>
                        </select>
                    </div>
                </div>
                
                <div class="info-box mt-20">
                    <p><strong>💡 Tips:</strong></p>
                    <ul>
                        <li>Cold water saves energy and protects colors</li>
                        <li>Don't overload the machine</li>
                        <li>Use recommended detergent amount</li>
                    </ul>
                </div>
                
                <button class="btn btn-success btn-large mt-20" onclick="LaundryMinigame.startWash()">
                    🌀 Start Washing Machine
                </button>
            </div>
        `;
    },
    
    startWash() {
        const temp = document.getElementById('waterTemp').value;
        const detergent = document.getElementById('detergent').value;
        const cycle = document.getElementById('cycle').value;
        
        if (!temp || !detergent || !cycle) {
            UI.showNotification('⚠️ Please select all settings!', 'warning');
            return;
        }
        
        UI.showNotification('🌀 Washing... This will take a few seconds', 'info');
        
        setTimeout(() => {
            UI.showNotification('✅ Wash cycle complete!', 'success');
            this.nextPhase();
        }, 2000);
    },
    
    renderDrying() {
        return `
            <div class="drying-controls">
                <div class="control-panel">
                    <div class="control-group">
                        <label>Drying Method:</label>
                        <select id="dryMethod" class="form-control">
                            <option value="">Select...</option>
                            <option value="machine">🌀 Machine Dry</option>
                            <option value="air">🌬️ Air Dry (Hang)</option>
                        </select>
                    </div>
                    
                    <div class="control-group mt-20" id="heatSettings" style="display:none;">
                        <label>Heat Level:</label>
                        <select id="heatLevel" class="form-control">
                            <option value="low">Low Heat</option>
                            <option value="medium">Medium Heat</option>
                            <option value="high">High Heat</option>
                        </select>
                    </div>
                </div>
                
                <div class="info-box mt-20">
                    <p><strong>💡 Drying Tips:</strong></p>
                    <ul>
                        <li>Check care labels on clothes</li>
                        <li>Air drying saves energy and is gentler</li>
                        <li>Remove clothes promptly to prevent wrinkles</li>
                        <li>Clean lint trap before each use</li>
                    </ul>
                </div>
                
                <button class="btn btn-success btn-large mt-20" onclick="LaundryMinigame.startDry()">
                    Start Drying
                </button>
            </div>
            
            <script>
                document.getElementById('dryMethod').addEventListener('change', function() {
                    document.getElementById('heatSettings').style.display = 
                        this.value === 'machine' ? 'block' : 'none';
                });
            </script>
        `;
    },
    
    startDry() {
        const method = document.getElementById('dryMethod').value;
        
        if (!method) {
            UI.showNotification('⚠️ Please select a drying method!', 'warning');
            return;
        }
        
        if (method === 'machine') {
            const heat = document.getElementById('heatLevel').value;
            if (!heat) {
                UI.showNotification('⚠️ Please select heat level!', 'warning');
                return;
            }
        }
        
        UI.showNotification('Drying clothes...', 'info');
        
        setTimeout(() => {
            UI.showNotification('✅ Clothes are dry!', 'success');
            this.nextPhase();
        }, 2000);
    },
    
    renderFolding() {
        return `
            <div class="folding-game">
                <div class="folding-demo">
                    <h4>How to Fold a Shirt:</h4>
                    <ol>
                        <li>Lay shirt flat, face down</li>
                        <li>Fold one side to the middle</li>
                        <li>Fold sleeve back</li>
                        <li>Repeat on other side</li>
                        <li>Fold bottom up to collar</li>
                        <li>Fold in half again</li>
                    </ol>
                </div>
                
                <div class="info-box mt-20">
                    <p><strong>💡 Folding Tips:</strong></p>
                    <ul>
                        <li>Fold while slightly warm for fewer wrinkles</li>
                        <li>Store folded clothes vertically to see everything</li>
                        <li>Hang delicate items instead of folding</li>
                        <li>Match socks and fold them together</li>
                    </ul>
                </div>
                
                <div class="clothes-to-fold mt-20">
                    <div class="fold-item">👕 5 Shirts</div>
                    <div class="fold-item">👖 3 Pants</div>
                    <div class="fold-item">🧦 6 Socks</div>
                    <div class="fold-item">🩳 4 Underwear</div>
                </div>
                
                <button class="btn btn-success btn-large mt-20" onclick="LaundryMinigame.finishFolding()">
                    ✅ Finish Folding
                </button>
            </div>
        `;
    },
    
    finishFolding() {
        UI.showNotification('✅ All clothes folded and put away!', 'success');
        this.complete();
    },
    
    nextPhase() {
        this.currentPhase++;
        document.getElementById('laundryModal').remove();
        this.showPhase();
    },
    
    complete() {
        document.getElementById('laundryModal').remove();
        
        // Find laundry chore
        const chore = GameState.daily.chores.find(c => c.id === 'laundry');
        
        if (chore && !GameState.daily.completedToday.includes('laundry')) {
            GameState.completeChore('laundry');
            GameState.addMoney(chore.reward, 'chore');
            GameState.addSkill('laundry', 10);
            UI.showNotification(`✅ Laundry complete! +$${chore.reward}`, 'success');
        } else {
            GameState.addSkill('laundry', 10);
            UI.showNotification('✅ Laundry practice complete!', 'success');
        }
        
        GameState.clearBusy();
        
        if (GameState.skills.laundry >= 50) {
            GameState.addAchievement('Laundry Master', 'Reach 50 laundry skill', '🧺');
        }
        
        loadHome();
        UI.updateStats();
    }
};
