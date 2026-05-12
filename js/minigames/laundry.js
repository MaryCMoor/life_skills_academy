// ==================== LAUNDRY MINIGAME ====================

const LaundryMinigame = {
    start() {
        const steps = [
            { 
                instruction: 'Sort clothes by color', 
                tip: 'Whites, lights, darks - separate them!',
                safety: 'Check pockets for items before washing'
            },
            { 
                instruction: 'Read care labels on clothing', 
                tip: 'Check water temperature and special instructions'
            },
            { 
                instruction: 'Load washer - don\'t overpack', 
                tip: 'Fill 3/4 full for best cleaning'
            },
            { 
                instruction: 'Add detergent', 
                tip: 'Follow the measuring lines on the cap',
                safety: 'Use correct amount - more ≠ cleaner!'
            },
            { 
                instruction: 'Select wash cycle and temperature', 
                tip: 'Cold water for colors, warm for whites'
            },
            { 
                instruction: 'Start washer and wait', 
                tip: 'Washing takes about 30-45 minutes'
            },
            { 
                instruction: 'Move clothes to dryer promptly', 
                tip: 'Don\'t leave wet clothes sitting',
                safety: 'Check lint trap before drying!'
            },
            { 
                instruction: 'Clean lint trap', 
                tip: 'Remove lint after every load',
                safety: 'Lint buildup is a fire hazard!'
            },
            { 
                instruction: 'Select dryer settings', 
                tip: 'Lower heat for delicates'
            },
            { 
                instruction: 'Start dryer', 
                tip: 'Drying takes 45-60 minutes'
            },
            { 
                instruction: 'Remove clothes promptly when done', 
                tip: 'Prevents wrinkles!'
            },
            { 
                instruction: 'Fold or hang clothes', 
                tip: 'Fold immediately for fewer wrinkles'
            },
            { 
                instruction: 'Put clothes away', 
                tip: 'Return to closet/drawers'
            }
        ];
        
        this.showTutorial(steps);
    },
    
    showTutorial(steps) {
        const overlay = document.createElement('div');
        overlay.className = 'minigame-overlay active';
        overlay.id = 'laundryMinigame';
        
        let html = `
            <div class="minigame-container">
                <div class="minigame-header">
                    <div class="minigame-title">🧺 Doing Laundry</div>
                    <div class="minigame-subtitle">Complete laundry cycle from start to finish</div>
                </div>
                
                <div class="tutorial-steps" id="laundrySteps">
                    ${steps.map((step, i) => `
                        <div class="tutorial-step ${i === 0 ? 'active' : ''}" id="laundry-step-${i}">
                            <span class="step-number">${i + 1}</span>
                            <div>
                                <div class="step-instruction">${step.instruction}</div>
                                ${step.tip ? `<div class="step-tip">💡 ${step.tip}</div>` : ''}
                                ${step.safety ? `<div class="step-safety">⚠️ ${step.safety}</div>` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="minigame-progress">
                    <div class="progress-text">Step <span id="currentLaundryStep">1</span> of ${steps.length}</div>
                    ${UI.createProgressBar(1, steps.length)}
                </div>
                
                <div class="minigame-actions">
                    <button class="btn-complete" onclick="LaundryMinigame.nextStep()">
                        Next Step
                    </button>
                    <button class="btn-skip" onclick="LaundryMinigame.skip()">
                        Skip Tutorial
                    </button>
                </div>
            </div>
        `;
        
        overlay.innerHTML = html;
        document.body.appendChild(overlay);
        
        this.currentStep = 0;
        this.steps = steps;
    },
    
    nextStep() {
        if (this.currentStep < this.steps.length) {
            // Mark current as completed
            const currentStepEl = document.getElementById(`laundry-step-${this.currentStep}`);
            if (currentStepEl) {
                currentStepEl.classList.remove('active');
                currentStepEl.classList.add('completed');
            }
            
            this.currentStep++;
            
            // Update progress
            document.getElementById('currentLaundryStep').textContent = this.currentStep + 1;
            const progressBar = document.querySelector('.progress-fill');
            if (progressBar) {
                const percent = ((this.currentStep + 1) / this.steps.length) * 100;
                progressBar.style.width = percent + '%';
                progressBar.textContent = Math.round(percent) + '%';
            }
            
            if (this.currentStep < this.steps.length) {
                // Show next step
                const nextStepEl = document.getElementById(`laundry-step-${this.currentStep}`);
                if (nextStepEl) {
                    nextStepEl.classList.add('active');
                }
            } else {
                // All done!
                this.complete();
            }
        }
    },
    
    complete() {
        GameState.addMoney(12, 'laundry');
        GameState.addSkill('laundry', 10);
        
        UI.showNotification('✅ Laundry complete! +$12, +10 laundry skill', 'success');
        
        // Complete the chore
        const chore = GameState.daily.chores.find(c => c.id === 'laundry');
        if (chore) {
            GameState.completeChore('laundry');
        }
        
        // Achievement check
        if (GameState.skills.laundry >= 50) {
            GameState.addAchievement('Laundry Pro', 'Master laundry skills', '🧺');
        }
        
        this.close();
        loadHome();
        UI.updateStats();
    },
    
    skip() {
        if (confirm('Skip this tutorial? You\'ll still complete the chore.')) {
            this.complete();
        }
    },
    
    close() {
        const overlay = document.getElementById('laundryMinigame');
        if (overlay) {
            overlay.remove();
        }
        this.currentStep = 0;
        this.steps = null;
    }
};
