// ==================== CHORE MINIGAMES ====================

const ChoreMinigames = {
    currentChore: null,
    currentStep: 0,
    
    start(choreId) {
        this.currentChore = choreId;
        this.currentStep = 0;
        
        const minigames = {
            'bed': this.makeBedGame,
            'dishes': this.dishesGame,
            'vacuum': this.vacuumGame,
            'trash': this.trashGame
        };
        
        if (minigames[choreId]) {
            minigames[choreId].call(this);
        } else {
            // Default simple completion
            const chore = GameState.daily.chores.find(c => c.id === choreId);
            if (chore) {
                completeChoreSimple(chore);
            }
        }
    },
    
    makeBedGame() {
        const steps = [
            { instruction: 'Remove all pillows and blankets', tip: 'Start with a clear mattress', done: false },
            { instruction: 'Put on the fitted sheet', tip: 'Make sure corners are tucked', done: false },
            { instruction: 'Add the flat sheet', tip: 'Smooth out any wrinkles', done: false },
            { instruction: 'Place the blanket on top', tip: 'Center it on the bed', done: false },
            { instruction: 'Arrange the pillows', tip: 'Fluff them first!', done: false },
            { instruction: 'Final check', tip: 'Everything should look neat and smooth', done: false }
        ];
        
        this.showTutorial('Making Your Bed', '🛏️', steps, () => {
            const chore = GameState.daily.chores.find(c => c.id === 'bed');
            if (chore) {
                completeChoreSimple(chore);
            }
        });
    },
    
    dishesGame() {
        const steps = [
            { instruction: 'Scrape off food scraps into trash', tip: 'Don\'t let food go down the drain', done: false },
            { instruction: 'Fill sink with hot soapy water', tip: 'Use dish soap, not hand soap', done: false },
            { instruction: 'Wash dishes from cleanest to dirtiest', tip: 'Glasses first, then plates, then pots', done: false },
            { instruction: 'Rinse each dish with clean water', tip: 'Remove all soap residue', done: false },
            { instruction: 'Place dishes in drying rack or dry with towel', tip: 'Let air dry when possible', done: false },
            { instruction: 'Wipe down sink and counters', tip: 'Leave the kitchen cleaner than you found it', done: false }
        ];
        
        this.showTutorial('Washing Dishes', '🍽️', steps, () => {
            const chore = GameState.daily.chores.find(c => c.id === 'dishes');
            if (chore) {
                completeChoreSimple(chore);
            }
        });
    },
    
    vacuumGame() {
        const steps = [
            { instruction: 'Pick up large items from the floor', tip: 'Toys, shoes, papers - clear the area first', done: false },
            { instruction: 'Check vacuum bag or canister', tip: 'Empty if more than half full', done: false },
            { instruction: 'Plug in vacuum and start from farthest corner', tip: 'Work your way toward the outlet', done: false },
            { instruction: 'Use slow, overlapping strokes', tip: 'Going too fast misses dirt', done: false },
            { instruction: 'Move furniture and vacuum underneath', tip: 'Don\'t forget under beds and couches', done: false },
            { instruction: 'Empty vacuum and wrap cord', tip: 'Store properly for next time', done: false }
        ];
        
        this.showTutorial('Vacuuming', '🧹', steps, () => {
            const chore = GameState.daily.chores.find(c => c.id === 'vacuum');
            if (chore) {
                completeChoreSimple(chore);
            }
        });
    },
    
    trashGame() {
        const steps = [
            { instruction: 'Tie up the trash bag', tip: 'Make a secure knot so nothing spills', done: false },
            { instruction: 'Take bag to outdoor trash bin', tip: 'Carry it away from your body', done: false },
            { instruction: 'Place in bin and close lid', tip: 'Make sure animals can\'t get in', done: false },
            { instruction: 'Put new bag in trash can', tip: 'Tuck edges over the rim', done: false }
        ];
        
        this.showTutorial('Taking Out Trash', '🗑️', steps, () => {
            const chore = GameState.daily.chores.find(c => c.id === 'trash');
            if (chore) {
                completeChoreSimple(chore);
            }
        });
    },
    
    showTutorial(title, icon, steps, onComplete) {
        const overlay = document.createElement('div');
        overlay.className = 'minigame-overlay active';
        overlay.id = 'choreMinigame';
        
        let html = `
            <div class="minigame-container">
                <div class="minigame-header">
                    <div class="minigame-title">${icon} ${title}</div>
                    <div class="minigame-subtitle">Follow each step carefully</div>
                </div>
                
                <div class="tutorial-steps" id="choreSteps">
                    ${steps.map((step, i) => `
                        <div class="tutorial-step ${i === 0 ? 'active' : ''}" id="step-${i}">
                            <span class="step-number">${i + 1}</span>
                            <div>
                                <div class="step-instruction">${step.instruction}</div>
                                <div class="step-tip">💡 ${step.tip}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="minigame-progress">
                    <div class="progress-text">Step <span id="currentStep">1</span> of ${steps.length}</div>
                    ${UI.createProgressBar(1, steps.length)}
                </div>
                
                <div class="minigame-actions">
                    <button class="btn-complete" id="nextStepBtn" onclick="ChoreMinigames.nextStep()">
                        Next Step
                    </button>
                    <button class="btn-skip" onclick="ChoreMinigames.skipTutorial()">
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
                currentStepEl.classList.remove('active');
                currentStepEl.classList.add('completed');
            }
            
            this.steps[this.currentStep].done = true;
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
                    nextStepEl.classList.add('active');
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
