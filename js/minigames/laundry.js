// ==================== LAUNDRY MINIGAME (FIXED) ====================

window.LaundryMinigame = {
    currentStep: 0,
    steps: null,
    
    start() {
        console.log('🧺 Starting laundry minigame');
        
        const steps = [
            { 
                instruction: 'Sort clothes by color', 
                tip: 'Whites, lights, darks - keep them separate!',
                safety: 'Check all pockets for items before washing'
            },
            { 
                instruction: 'Read care labels on clothing', 
                tip: 'Check water temperature and special care instructions'
            },
            { 
                instruction: 'Load washer - don\'t overpack', 
                tip: 'Fill only 3/4 full for best cleaning results'
            },
            { 
                instruction: 'Add detergent to dispenser', 
                tip: 'Follow the measuring lines on the cap',
                safety: 'More detergent does NOT mean cleaner clothes!'
            },
            { 
                instruction: 'Select wash cycle and temperature', 
                tip: 'Cold water for colors, warm for whites'
            },
            { 
                instruction: 'Start washer and set timer', 
                tip: 'Washing takes about 30-45 minutes'
            },
            { 
                instruction: 'Move wet clothes to dryer promptly', 
                tip: 'Don\'t leave wet clothes sitting - they\'ll smell!',
                safety: 'Check and clean lint trap before drying!'
            },
            { 
                instruction: 'Clean the lint trap thoroughly', 
                tip: 'Remove lint after every single load',
                safety: 'Lint buildup is a serious fire hazard!'
            },
            { 
                instruction: 'Select appropriate dryer settings', 
                tip: 'Lower heat for delicates, high for towels'
            },
            { 
                instruction: 'Start dryer and set timer', 
                tip: 'Drying takes 45-60 minutes'
            },
            { 
                instruction: 'Remove clothes promptly when done', 
                tip: 'Prevents wrinkles and makes folding easier!'
            },
            { 
                instruction: 'Fold or hang clothes immediately', 
                tip: 'Fold on flat surface for best results'
            },
            { 
                instruction: 'Put clothes away in closet/drawers', 
                tip: 'Complete the job - don\'t leave in basket!'
            }
        ];
        
        this.showTutorial(steps);
    },
    
    showTutorial(steps) {
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.id = 'laundryMinigame';
        overlay.style.display = 'flex';
        overlay.style.zIndex = '2000';
        
        let html = `
            <div class="modal-content" style="max-width: 900px; max-height: 90vh; overflow-y: auto;">
                <div style="text-align: center; padding-bottom: 20px; border-bottom: 3px solid #3498db;">
                    <h2 style="margin: 0; font-size: 32px;">🧺 Doing Laundry</h2>
                    <p style="color: #7f8c8d; margin: 10px 0 0 0;">Complete laundry cycle from start to finish</p>
                </div>
                
                <div style="margin: 30px 0;">
                    ${steps.map((step, i) => `
                        <div class="tutorial-step ${i === 0 ? 'active' : ''}" id="laundry-step-${i}" style="
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
                                    width: 35px;
                                    height: 35px;
                                    border-radius: 50%;
                                    text-align: center;
                                    line-height: 35px;
                                    font-weight: bold;
                                    margin-right: 15px;
                                    flex-shrink: 0;
                                ">${i + 1}</span>
                                <div style="flex: 1;">
                                    <div style="font-size: 18px; font-weight: bold; color: #2c3e50; margin-bottom: 10px;">
                                        ${step.instruction}
                                    </div>
                                    ${step.tip ? `
                                        <div style="font-size: 14px; color: #7f8c8d; padding: 10px; background: rgba(52,152,219,0.1); border-radius: 6px; margin-top: 8px;">
                                            💡 <strong>Tip:</strong> ${step.tip}
                                        </div>
                                    ` : ''}
                                    ${step.safety ? `
                                        <div style="font-size: 14px; color: #e74c3c; font-weight: bold; padding: 10px; background: rgba(231,76,60,0.1); border-radius: 6px; margin-top: 8px;">
                                            ⚠️ <strong>Safety:</strong> ${step.safety}
                                        </div>
                                    ` : ''}
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div style="text-align: center; margin: 20px 0;">
                    <div style="font-size: 18px; font-weight: bold; margin-bottom: 15px;">
                        Step <span id="currentLaundryStep">1</span> of ${steps.length}
                    </div>
                    <div class="progress-bar" style="height: 30px;">
                        <div class="progress-fill" style="width: ${(1/steps.length)*100}%; transition: width 0.3s;">
                            ${Math.round((1/steps.length)*100)}%
                        </div>
                    </div>
                </div>
                
                <div style="display: flex; gap: 15px; justify-content: center; margin-top: 30px;">
                    <button class="btn btn-success btn-large" onclick="LaundryMinigame.nextStep()">
                        ✅ Next Step
                    </button>
                    <button class="btn btn-secondary" onclick="LaundryMinigame.skip()">
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
                currentStepEl.style.opacity = '0.6';
                currentStepEl.style.background = '#f8f9fa';
                currentStepEl.style.borderLeftColor = '#95a5a6';
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
                    nextStepEl.style.background = '#e8f5e9';
                    nextStepEl.style.borderLeftColor = '#27ae60';
                }
            } else {
                // All done!
                this.complete();
            }
        }
    },
    
    complete() {
        const reward = 12;
        const skill = 10;
        
        GameState.addMoney(reward, 'laundry');
        GameState.addSkill('laundry', skill);
        GameState.completeChore('laundry');
        GameState.clearBusy();
        GameState.stats.choresCompleted++;
        
        UI.showNotification(`✅ Laundry complete! +$${reward}, +${skill} laundry skill`, 'success');
        
        // Achievement check
        if (GameState.skills.laundry >= 50) {
            GameState.addAchievement('Laundry Pro', 'Master laundry skills', '🧺');
        }
        if (GameState.skills.laundry >= 100) {
            GameState.addAchievement('Laundry Master', 'Max out laundry skill', '⭐');
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

console.log('✅ laundry.js loaded - LaundryMinigame ready');
