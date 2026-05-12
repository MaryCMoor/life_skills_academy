// ==================== CHORE MINIGAMES (FIXED) ====================

window.ChoreMinigames = {
    currentChore: null,
    currentStep: 0,
    steps: null,
    onComplete: null,
    
    start(choreId) {
        console.log('🧹 Starting chore minigame:', choreId);
        this.currentChore = choreId;
        this.currentStep = 0;
        
        const minigames = {
            'bed': () => this.makeBedGame(),
            'dishes': () => this.dishesGame(),
            'vacuum': () => this.vacuumGame(),
            'trash': () => this.trashGame()
        };
        
        if (minigames[choreId]) {
            minigames[choreId]();
        } else {
            // Default simple completion
            const chore = GameState.daily.chores.find(c => c.id === choreId);
            if (chore && typeof completeChoreSimple === 'function') {
                completeChoreSimple(chore);
            } else {
                console.log('Completing chore directly');
                GameState.completeChore(choreId);
                GameState.addMoney(chore.reward, 'chore');
                GameState.addSkill(chore.skill, 5);
                GameState.clearBusy();
                UI.showNotification(`✅ ${chore.name} complete!`, 'success');
                loadHome();
            }
        }
    },
    
    makeBedGame() {
        const steps = [
            { instruction: 'Remove all pillows and blankets', tip: 'Start with a clear mattress' },
            { instruction: 'Put on the fitted sheet', tip: 'Make sure corners are tucked' },
            { instruction: 'Add the flat sheet', tip: 'Smooth out any wrinkles' },
            { instruction: 'Place the blanket on top', tip: 'Center it on the bed' },
            { instruction: 'Arrange the pillows', tip: 'Fluff them first!' },
            { instruction: 'Final check', tip: 'Everything should look neat and smooth' }
        ];
        
        this.showTutorial('Making Your Bed', '🛏️', steps, () => {
            const chore = GameState.daily.chores.find(c => c.id === 'bed');
            if (chore) {
                this.completeChore(chore);
            }
        });
    },
    
    dishesGame() {
        const steps = [
            { instruction: 'Scrape off food scraps into trash', tip: 'Don\'t let food go down the drain' },
            { instruction: 'Fill sink with hot soapy water', tip: 'Use dish soap, not hand soap' },
            { instruction: 'Wash dishes from cleanest to dirtiest', tip: 'Glasses first, then plates, then pots' },
            { instruction: 'Rinse each dish with clean water', tip: 'Remove all soap residue' },
            { instruction: 'Place dishes in drying rack', tip: 'Let air dry when possible' },
            { instruction: 'Wipe down sink and counters', tip: 'Leave the kitchen clean!' }
        ];
        
        this.showTutorial('Washing Dishes', '🍽️', steps, () => {
            const chore = GameState.daily.chores.find(c => c.id === 'dishes');
            if (chore) {
                this.completeChore(chore);
            }
        });
    },
    
    vacuumGame() {
        const steps = [
            { instruction: 'Pick up large items from the floor', tip: 'Clear the area first' },
            { instruction: 'Check vacuum bag or canister', tip: 'Empty if more than half full' },
            { instruction: 'Plug in vacuum and start from corner', tip: 'Work toward the outlet' },
            { instruction: 'Use slow, overlapping strokes', tip: 'Going too fast misses dirt' },
            { instruction: 'Move furniture and vacuum underneath', tip: 'Don\'t forget under beds!' },
            { instruction: 'Empty vacuum and wrap cord', tip: 'Store properly for next time' }
        ];
        
        this.showTutorial('Vacuuming', '🧹', steps, () => {
            const chore = GameState.daily.chores.find(c => c.id === 'vacuum');
            if (chore) {
                this.completeChore(chore);
            }
        });
    },
    
    trashGame() {
        const steps = [
            { instruction: 'Tie up the trash bag', tip: 'Make a secure knot' },
            { instruction: 'Take bag to outdoor trash bin', tip: 'Carry it away from your body' },
            { instruction: 'Place in bin and close lid', tip: 'Keep animals out' },
            { instruction: 'Put new bag in trash can', tip: 'Tuck edges over the rim' }
        ];
        
        this.showTutorial('Taking Out Trash', '🗑️', steps, () => {
            const chore = GameState.daily.chores.find(c => c.id === 'trash');
            if (chore) {
                this.completeChore(chore);
            }
        });
    },
    
    showTutorial(title, icon, steps, onComplete) {
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.id = 'choreMinigame';
        overlay.style.display = 'flex';
        overlay.style.zIndex = '2000';
        
        let html = `
            <div class="modal-content" style="max-width: 800px;">
                <div style="text-align: center; padding-bottom: 20px; border-bottom: 3px solid #3498db;">
                    <h2 style="margin: 0; font-size: 32px;">${icon} ${title}</h2>
                    <p style="color: #7f8c8d; margin: 10px 0 0 0;">Follow each step carefully</p>
                </div>
                
                <div style="margin: 30px 0;">
                    ${steps.map((step, i) => `
                        <div class="tutorial-step ${i === 0 ? 'active' : ''}" id="step-${i}" style="
                            background: ${i === 0 ? '#e8f5e9' : '#f8f9fa'};
                            border-radius: 12px;
                            padding: 20px;
                            margin-bottom: 15px;
                            border-left: 5px solid ${i === 0 ? '#27ae60' : '#3498db'};
                            transition: all 0.3s;
                        ">
                            <div style="display: flex; align-items: start;">
                                <span style="
                                    display: inline-block;
                                    background: ${i === 0 ? '#27ae60' : '#3498db'};
                                    color: white;
                                    width: 30px;
                                    height: 30px;
                                    border-radius: 50%;
                                    text-align: center;
                                    line-height: 30px;
                                    font-weight: bold;
                                    margin-right: 15px;
                                    flex-shrink: 0;
                                ">${i + 1}</span>
                                <div style="flex: 1;">
                                    <div style="font-size: 18px; font-weight: bold; color: #2c3e50; margin-bottom: 8px;">
                                        ${step.instruction}
                                    </div>
                                    <div style="font-size: 14px; color: #7f8c8d; padding: 10px; background: rgba(52,152,219,0.1); border-radius: 6px;">
                                        💡 ${step.tip}
                                    </div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div style="text-align: center; margin: 20px 0;">
                    <div style="font-size: 18px; font-weight: bold; margin-bottom: 15px;">
                        Step <span id="currentStep">1</span> of ${steps.length}
                    </div>
                    <div class="progress-bar" style="height: 30px;">
                        <div class="progress-fill" style="width: ${(1/steps.length)*100}%; transition: width 0.3s;">
                            ${Math.round((1/steps.length)*100)}%
                        </div>
                    </div>
                </div>
                
                <div style="display: flex; gap: 15px; justify-content: center; margin-top: 30px;">
                    <button class="btn btn-success btn-large" onclick="ChoreMinigames.nextStep()">
                        ✅ Next Step
                    </button>
                    <button class="btn btn-secondary" onclick="ChoreMinigames.skipTutorial()">
                        Skip Tutorial
                    </button>
                </div>
            </div>
        `;
        
        overlay.innerHTML = html;
        document.body.appendChild(overlay);
        
        this.steps = steps;
        this.onComplete = onComplete;
    },
    
    nextStep() {
        if (this.currentStep < this.steps.length) {
            // Mark current as completed
            const currentStepEl = document.getElementById(`step-${this.currentStep}`);
            if (currentStepEl) {
                currentStepEl.style.opacity = '0.6';
                currentStepEl.style.background = '#f8f9fa';
                currentStepEl.style.borderLeftColor = '#95a5a6';
            }
            
            this.currentStep++;
            
            // Update progress
            document.getElementById('currentStep').textContent = this.currentStep + 1;
            const progressBar = document.querySelector('.progress-fill');
            if (progressBar) {
                const percent = ((this.currentStep + 1) / this.steps.length) * 100;
                progressBar.style.width = percent + '%';
                progressBar.textContent = Math.round(percent) + '%';
            }
            
            if (this.currentStep < this.steps.length) {
                // Show next step
                const nextStepEl = document.getElementById(`step-${this.currentStep}`);
                if (nextStepEl) {
                    nextStepEl.style.background = '#e8f5e9';
                    nextStepEl.style.borderLeftColor = '#27ae60';
                }
            } else {
                // All done!
                this.completeTutorial();
            }
        }
    },
    
    completeTutorial() {
        UI.showNotification('✅ Tutorial completed!', 'success');
        this.closeTutorial();
        
        if (this.onComplete) {
            this.onComplete();
        }
    },
    
    completeChore(chore) {
        GameState.completeChore(chore.id);
        GameState.addMoney(chore.reward, 'chore');
        GameState.addSkill(chore.skill, 5);
        GameState.clearBusy();
        GameState.stats.choresCompleted++;
        
        UI.showNotification(`✅ ${chore.name} complete! +$${chore.reward}`, 'success');
        
        // Achievements
        if (GameState.stats.choresCompleted === 10) {
            GameState.addAchievement('Chore Warrior', 'Complete 10 chores', '🧹');
        }
        if (GameState.stats.choresCompleted === 50) {
            GameState.addAchievement('Domestic Expert', 'Complete 50 chores', '🏆');
        }
        
        loadHome();
        UI.updateStats();
    },
    
    skipTutorial() {
        if (confirm('Skip this tutorial? You\'ll still complete the chore.')) {
            this.closeTutorial();
            if (this.onComplete) {
                this.onComplete();
            }
        }
    },
    
    closeTutorial() {
        const overlay = document.getElementById('choreMinigame');
        if (overlay) {
            overlay.remove();
        }
        this.currentChore = null;
        this.currentStep = 0;
        this.steps = null;
        this.onComplete = null;
    }
};

console.log('✅ chores.js loaded - ChoreMinigames ready');
