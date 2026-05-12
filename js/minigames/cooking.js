// ==================== COOKING MINIGAME ====================

const CookingMinigame = {
    recipes: {
        sandwich: {
            name: '🥪 Classic Sandwich',
            time: 10,
            ingredients: ['2 slices bread', 'Deli meat', 'Cheese', 'Lettuce', 'Tomato', 'Condiments'],
            steps: [
                { text: 'Wash your hands thoroughly', safety: true },
                { text: 'Lay out 2 slices of bread on clean surface' },
                { text: 'Add condiments to one or both slices' },
                { text: 'Layer meat, cheese, lettuce, and tomato' },
                { text: 'Place second slice on top and cut in half' },
                { text: 'Clean up your workspace' }
            ]
        },
        eggs: {
            name: '🍳 Scrambled Eggs',
            time: 15,
            ingredients: ['3 eggs', '2 tbsp milk', '1 tbsp butter', 'Salt & pepper'],
            steps: [
                { text: 'Wash hands and gather ingredients', safety: true },
                { text: 'Crack eggs into bowl and whisk with milk', tip: 'Mix until no streaks remain' },
                { text: 'Heat pan on medium, add butter', safety: 'Never leave stove unattended' },
                { text: 'Pour eggs into pan when butter melts' },
                { text: 'Stir gently with spatula until fluffy', tip: 'Don\'t overcook!' },
                { text: 'Remove from heat, season with salt & pepper' },
                { text: 'Turn off stove and clean up', safety: true }
            ]
        },
        pasta: {
            name: '🍝 Simple Pasta',
            time: 30,
            ingredients: ['8 oz pasta', 'Water', 'Salt', '1 jar pasta sauce', 'Parmesan cheese'],
            steps: [
                { text: 'Wash hands and read full recipe first', safety: true },
                { text: 'Fill large pot with water and bring to boil', safety: 'Use oven mitts, steam is hot!' },
                { text: 'Add salt and pasta to boiling water', safety: 'Stand back when adding pasta' },
                { text: 'Cook 8-10 minutes, stirring occasionally', tip: 'Test doneness by tasting' },
                { text: 'Heat sauce in separate pan on low' },
                { text: 'Drain pasta in colander', safety: 'Pour away from you!' },
                { text: 'Mix pasta with sauce and serve' },
                { text: 'Turn off all burners and clean up', safety: true }
            ]
        },
        salad: {
            name: '🥗 Fresh Salad',
            time: 15,
            ingredients: ['Lettuce', 'Cucumber', 'Tomatoes', 'Carrots', 'Dressing'],
            steps: [
                { text: 'Wash hands thoroughly', safety: true },
                { text: 'Rinse all vegetables under cold water', tip: 'Even pre-washed greens!' },
                { text: 'Tear lettuce into bite-sized pieces' },
                { text: 'Slice cucumber, tomatoes, and carrots', safety: 'Use cutting board, curl fingers' },
                { text: 'Combine vegetables in large bowl' },
                { text: 'Add dressing just before serving', tip: 'Too early makes salad soggy' },
                { text: 'Clean cutting board and knives' }
            ]
        },
        soup: {
            name: '🍲 Easy Soup',
            time: 45,
            ingredients: ['1 can soup', '1 can water or milk', 'Crackers (optional)'],
            steps: [
                { text: 'Wash hands and read soup label', safety: true },
                { text: 'Open can with can opener carefully', safety: 'Sharp edges!' },
                { text: 'Pour soup into pot' },
                { text: 'Add water or milk as directed' },
                { text: 'Heat on medium, stirring often', safety: 'Don\'t leave stove unattended' },
                { text: 'When hot throughout, remove from heat', tip: 'Test temperature carefully' },
                { text: 'Pour into bowl and serve with crackers' },
                { text: 'Turn off stove and clean up', safety: true }
            ]
        }
    },
    
    start(recipeId) {
        const recipe = this.recipes[recipeId];
        if (!recipe) {
            UI.showNotification('❌ Recipe not found!', 'error');
            return;
        }
        
        this.showRecipe(recipe);
    },
    
    showRecipe(recipe) {
        const overlay = document.createElement('div');
        overlay.className = 'minigame-overlay active';
        overlay.id = 'cookingMinigame';
        
        let html = `
            <div class="minigame-container">
                <div class="minigame-header">
                    <div class="minigame-title">${recipe.name}</div>
                    <div class="minigame-subtitle">Time: ${recipe.time} minutes</div>
                </div>
                
                <div class="cooking-game">
                    <div class="ingredients-list">
                        <h3>📋 Ingredients</h3>
                        <ul>
                            ${recipe.ingredients.map(ing => `<li>${ing}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="tutorial-steps" id="cookingSteps">
                        <h3>👨‍🍳 Steps</h3>
                        ${recipe.steps.map((step, i) => `
                            <div class="cooking-step ${i === 0 ? 'active' : ''}" id="cook-step-${i}">
                                <div class="step-number">${i + 1}</div>
                                <div>
                                    <div class="step-instruction">${step.text}</div>
                                    ${step.tip ? `<div class="step-tip">💡 ${step.tip}</div>` : ''}
                                    ${step.safety ? `<div class="step-safety">⚠️ Safety: ${typeof step.safety === 'string' ? step.safety : 'Important safety step'}</div>` : ''}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="minigame-progress">
                    <div class="progress-text">Step <span id="currentCookStep">1</span> of ${recipe.steps.length}</div>
                    ${UI.createProgressBar(1, recipe.steps.length)}
                </div>
                
                <div class="minigame-actions">
                    <button class="btn-complete" id="nextCookBtn" onclick="CookingMinigame.nextStep(${recipe.steps.length})">
                        Next Step
                    </button>
                    <button class="btn-skip" onclick="CookingMinigame.close()">
                        Cancel
                    </button>
                </div>
            </div>
        `;
        
        overlay.innerHTML = html;
        document.body.appendChild(overlay);
        
        this.currentStep = 0;
        this.totalSteps = recipe.steps.length;
        this.recipe = recipe;
    },
    
    nextStep(totalSteps) {
        if (this.currentStep < this.totalSteps) {
            // Mark current as completed
            const currentStepEl = document.getElementById(`cook-step-${this.currentStep}`);
            if (currentStepEl) {
                currentStepEl.classList.remove('active');
                currentStepEl.style.opacity = '0.6';
            }
            
            this.currentStep++;
            
            // Update progress
            document.getElementById('currentCookStep').textContent = this.currentStep + 1;
            const progressBar = document.querySelector('.progress-fill');
            if (progressBar) {
                const percent = ((this.currentStep + 1) / this.totalSteps) * 100;
                progressBar.style.width = percent + '%';
                progressBar.textContent = Math.round(percent) + '%';
            }
            
            if (this.currentStep < this.totalSteps) {
                // Show next step
                const nextStepEl = document.getElementById(`cook-step-${this.currentStep}`);
                if (nextStepEl) {
                    nextStepEl.classList.add('active');
                    nextStepEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            } else {
                // Cooking complete!
                this.complete();
            }
        }
    },
    
    complete() {
        GameState.addMoney(10, 'cooking');
        GameState.addSkill('cooking', 5);
        
        UI.showNotification(`✅ ${this.recipe.name} complete! +$10, +5 cooking skill`, 'success');
        
        // Achievement check
        if (GameState.skills.cooking >= 50) {
            GameState.addAchievement('Home Chef', 'Reach cooking skill level 50', '👨‍🍳');
        }
        
        this.close();
        UI.updateStats();
    },
    
    close() {
        const overlay = document.getElementById('cookingMinigame');
        if (overlay) {
            overlay.remove();
        }
        this.currentStep = 0;
        this.totalSteps = 0;
        this.recipe = null;
    }
};
