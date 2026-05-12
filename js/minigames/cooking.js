// ==================== COOKING MINIGAME (FIXED) ====================

window.CookingMinigame = {
    currentStep: 0,
    totalSteps: 0,
    recipe: null,
    
    recipes: {
        sandwich: {
            name: '🥪 Classic Sandwich',
            time: 10,
            skill: 3,
            ingredients: ['2 slices bread', 'Deli meat', 'Cheese', 'Lettuce', 'Tomato', 'Condiments'],
            steps: [
                { text: 'Wash your hands thoroughly', safety: 'Always start cooking with clean hands!' },
                { text: 'Lay out 2 slices of bread on clean surface' },
                { text: 'Add condiments to one or both slices', tip: 'Mayo, mustard, or both!' },
                { text: 'Layer meat, cheese, lettuce, and tomato', tip: 'Build from bottom up' },
                { text: 'Place second slice on top and cut in half', tip: 'Diagonal cut looks fancy!' },
                { text: 'Clean up your workspace', tip: 'Put ingredients away' }
            ]
        },
        eggs: {
            name: '🍳 Scrambled Eggs',
            time: 15,
            skill: 5,
            ingredients: ['3 eggs', '2 tbsp milk', '1 tbsp butter', 'Salt & pepper'],
            steps: [
                { text: 'Wash hands and gather ingredients', safety: 'Always wash hands before cooking!' },
                { text: 'Crack eggs into bowl and whisk with milk', tip: 'Mix until no streaks remain' },
                { text: 'Heat pan on medium, add butter', safety: 'Never leave stove unattended!' },
                { text: 'Pour eggs into pan when butter melts', tip: 'Pan should sizzle gently' },
                { text: 'Stir gently with spatula until fluffy', tip: 'Don\'t overcook - remove while slightly wet' },
                { text: 'Remove from heat, season with salt & pepper' },
                { text: 'Turn off stove and clean up', safety: 'Always turn off burners!' }
            ]
        },
        pasta: {
            name: '🍝 Simple Pasta',
            time: 30,
            skill: 8,
            ingredients: ['8 oz pasta', 'Water', 'Salt', '1 jar pasta sauce', 'Parmesan cheese'],
            steps: [
                { text: 'Wash hands and read full recipe first', safety: 'Always read entire recipe before starting!' },
                { text: 'Fill large pot with water and bring to boil', safety: 'Use oven mitts - steam is hot!' },
                { text: 'Add salt and pasta to boiling water', safety: 'Stand back when adding pasta to avoid splashes' },
                { text: 'Cook 8-10 minutes, stirring occasionally', tip: 'Test doneness by tasting one piece' },
                { text: 'Heat sauce in separate pan on low', tip: 'Stir occasionally to prevent burning' },
                { text: 'Drain pasta in colander', safety: 'Pour away from you to avoid steam burns!' },
                { text: 'Mix pasta with sauce and serve', tip: 'Add pasta water if too thick' },
                { text: 'Turn off all burners and clean up', safety: 'Check all knobs are in OFF position!' }
            ]
        },
        salad: {
            name: '🥗 Fresh Salad',
            time: 15,
            skill: 3,
            ingredients: ['Lettuce', 'Cucumber', 'Tomatoes', 'Carrots', 'Dressing'],
            steps: [
                { text: 'Wash hands thoroughly', safety: 'Clean hands prevent contamination!' },
                { text: 'Rinse all vegetables under cold water', tip: 'Even pre-washed greens need rinsing!' },
                { text: 'Tear lettuce into bite-sized pieces', tip: 'Don\'t use knife on lettuce - tears better' },
                { text: 'Slice cucumber, tomatoes, and carrots', safety: 'Use cutting board, curl fingers away from blade' },
                { text: 'Combine vegetables in large bowl', tip: 'Toss gently to mix' },
                { text: 'Add dressing just before serving', tip: 'Adding too early makes salad soggy' },
                { text: 'Clean cutting board and knives immediately', tip: 'Prevents cross-contamination' }
            ]
        },
        soup: {
            name: '🍲 Easy Soup',
            time: 20,
            skill: 4,
            ingredients: ['1 can soup', '1 can water or milk', 'Crackers (optional)'],
            steps: [
                { text: 'Wash hands and read soup label', safety: 'Check instructions on can' },
                { text: 'Open can with can opener carefully', safety: 'Watch for sharp edges!' },
                { text: 'Pour soup into pot', tip: 'Use medium-sized pot' },
                { text: 'Add water or milk as directed on label', tip: 'Usually one can full' },
                { text: 'Heat on medium, stirring often', safety: 'Don\'t leave stove unattended!' },
                { text: 'When hot throughout, remove from heat', tip: 'Test temperature carefully before serving' },
                { text: 'Pour into bowl and serve with crackers', safety: 'Use oven mitt - pot is hot!' },
                { text: 'Turn off stove and clean up', safety: 'Always check burner is OFF!' }
            ]
        }
    },
    
    start(recipeId) {
        console.log('👨‍🍳 Starting cooking minigame:', recipeId);
        const recipe = this.recipes[recipeId];
        if (!recipe) {
            UI.showNotification('❌ Recipe not found!', 'error');
            return;
        }
        
        this.showRecipe(recipe);
    },
    
    showRecipe(recipe) {
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.id = 'cookingMinigame';
        overlay.style.display = 'flex';
        overlay.style.zIndex = '2000';
        
        let html = `
            <div class="modal-content" style="max-width: 900px; max-height: 90vh; overflow-y: auto;">
                <div style="text-align: center; padding-bottom: 20px; border-bottom: 3px solid #3498db;">
                    <h2 style="margin: 0; font-size: 32px;">${recipe.name}</h2>
                    <p style="color: #7f8c8d; margin: 10px 0 0 0;">Time: ${recipe.time} minutes • Skill: +${recipe.skill}</p>
                </div>
                
                <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
                    <h3 style="color: #2c3e50; margin-bottom: 15px;">📋 Ingredients</h3>
                    <ul style="list-style: none; padding: 0; margin: 0;">
                        ${recipe.ingredients.map(ing => `
                            <li style="padding: 8px 0; border-bottom: 1px solid #ecf0f1;">✓ ${ing}</li>
                        `).join('')}
                    </ul>
                </div>
                
                <div style="margin: 30px 0;">
                    <h3 style="color: #2c3e50; margin-bottom: 20px;">👨‍🍳 Cooking Steps</h3>
                    ${recipe.steps.map((step, i) => `
                        <div class="cooking-step ${i === 0 ? 'active' : ''}" id="cook-step-${i}" style="
                            background: ${i === 0 ? '#e8f5e9' : 'white'};
                            padding: 20px;
                            border-radius: 10px;
                            margin-bottom: 15px;
                            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
                            border: ${i === 0 ? '3px solid #27ae60' : '1px solid #ecf0f1'};
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
                                    font-size: 18px;
                                ">${i + 1}</span>
                                <div style="flex: 1;">
                                    <div style="font-size: 18px; font-weight: bold; color: #2c3e50; margin-bottom: 10px;">
                                        ${step.text}
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
                        Step <span id="currentCookStep">1</span> of ${recipe.steps.length}
                    </div>
                    <div class="progress-bar" style="height: 30px;">
                        <div class="progress-fill" style="width: ${(1/recipe.steps.length)*100}%; transition: width 0.3s;">
                            ${Math.round((1/recipe.steps.length)*100)}%
                        </div>
                    </div>
                </div>
                
                <div style="display: flex; gap: 15px; justify-content: center; margin-top: 30px;">
                    <button class="btn btn-success btn-large" onclick="CookingMinigame.nextStep()">
                        ✅ Next Step
                    </button>
                    <button class="btn btn-secondary" onclick="CookingMinigame.close()">
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
    
    nextStep() {
        if (this.currentStep < this.totalSteps) {
            // Mark current as completed
            const currentStepEl = document.getElementById(`cook-step-${this.currentStep}`);
            if (currentStepEl) {
                currentStepEl.style.opacity = '0.6';
                currentStepEl.style.background = 'white';
                currentStepEl.style.border = '1px solid #ecf0f1';
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
                    nextStepEl.style.background = '#e8f5e9';
                    nextStepEl.style.border = '3px solid #27ae60';
                    nextStepEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            } else {
                // Cooking complete!
                this.complete();
            }
        }
    },
    
    complete() {
        const reward = 10;
        const skill = this.recipe.skill;
        
        GameState.addMoney(reward, 'cooking');
        GameState.addSkill('cooking', skill);
        GameState.clearBusy();
        
        UI.showNotification(`✅ ${this.recipe.name} complete! +$${reward}, +${skill} cooking skill`, 'success');
        
        // Achievement check
        if (GameState.skills.cooking >= 50) {
            GameState.addAchievement('Home Chef', 'Reach cooking skill level 50', '👨‍🍳');
        }
        if (GameState.skills.cooking >= 100) {
            GameState.addAchievement('Master Chef', 'Max out cooking skill', '🌟');
        }
        
        this.close();
        loadHome();
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

console.log('✅ cooking.js loaded - CookingMinigame ready');
