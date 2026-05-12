// ==================== COOKING MINIGAME (UPDATED) ====================

window.CookingMinigame = {
    currentRecipe: null,
    currentStep: 0,
    
    recipes: {
        sandwich: {
            name: '🥪 Sandwich',
            steps: [
                { instruction: 'Wash your hands', safetyTip: 'Always wash hands before cooking!' },
                { instruction: 'Get two slices of bread', safetyTip: 'Check expiration date' },
                { instruction: 'Add your favorite fillings', safetyTip: 'Use clean utensils' },
                { instruction: 'Put the slices together', safetyTip: 'Cut carefully with a knife' }
            ],
            ingredients: ['Bread', 'Cheese', 'Lettuce', 'Tomato'],
            time: 10,
            skill: 1
        },
        pasta: {
            name: '🍝 Pasta',
            steps: [
                { instruction: 'Fill a large pot with water', safetyTip: 'Use pot holders for hot pots' },
                { instruction: 'Bring water to a boil on stove', safetyTip: 'Keep pot handles turned inward' },
                { instruction: 'Add pasta to boiling water', safetyTip: 'Stir gently to prevent sticking' },
                { instruction: 'Cook for 8-10 minutes', safetyTip: 'Set a timer' },
                { instruction: 'Drain pasta using colander', safetyTip: 'Hot water! Use oven mitts' },
                { instruction: 'Add sauce and serve', safetyTip: 'Let cool slightly before eating' }
            ],
            ingredients: ['Pasta', 'Water', 'Sauce', 'Salt'],
            time: 30,
            skill: 3
        },
        eggs: {
            name: '🍳 Scrambled Eggs',
            steps: [
                { instruction: 'Crack 2-3 eggs into a bowl', safetyTip: 'Watch for shell pieces' },
                { instruction: 'Whisk eggs with a fork', safetyTip: 'Mix until uniform color' },
                { instruction: 'Heat pan on medium heat', safetyTip: 'Never leave stove unattended' },
                { instruction: 'Add butter to pan', safetyTip: 'Butter should sizzle, not smoke' },
                { instruction: 'Pour eggs into pan', safetyTip: 'Use oven mitts for hot handles' },
                { instruction: 'Stir constantly until cooked', safetyTip: 'Cook until no liquid remains' }
            ],
            ingredients: ['Eggs', 'Butter', 'Salt', 'Pepper'],
            time: 15,
            skill: 2
        },
        salad: {
            name: '🥗 Fresh Salad',
            steps: [
                { instruction: 'Wash all vegetables thoroughly', safetyTip: 'Clean produce prevents illness' },
                { instruction: 'Chop lettuce into pieces', safetyTip: 'Cut away from your body' },
                { instruction: 'Dice tomatoes and cucumbers', safetyTip: 'Use a cutting board' },
                { instruction: 'Mix vegetables in large bowl', safetyTip: 'Use clean utensils' },
                { instruction: 'Add dressing and toss', safetyTip: 'Start with small amount of dressing' }
            ],
            ingredients: ['Lettuce', 'Tomato', 'Cucumber', 'Dressing'],
            time: 15,
            skill: 2
        },
        soup: {
            name: '🍲 Vegetable Soup',
            steps: [
                { instruction: 'Chop vegetables into small pieces', safetyTip: 'Keep fingers away from blade' },
                { instruction: 'Heat pot on medium heat', safetyTip: 'Use back burners when possible' },
                { instruction: 'Add oil and vegetables', safetyTip: 'Watch for oil splatter' },
                { instruction: 'Sauté for 5 minutes', safetyTip: 'Stir frequently' },
                { instruction: 'Add broth and bring to boil', safetyTip: 'Reduce heat once boiling' },
                { instruction: 'Simmer for 20 minutes', safetyTip: 'Keep lid slightly open' },
                { instruction: 'Season and serve', safetyTip: 'Let cool before tasting' }
            ],
            ingredients: ['Carrots', 'Celery', 'Onion', 'Broth', 'Spices'],
            time: 45,
            skill: 4
        }
    },
    
    start(recipeId) {
        this.currentRecipe = this.recipes[recipeId];
        this.currentStep = 0;
        
        if (!this.currentRecipe) {
            console.error('Recipe not found:', recipeId);
            return;
        }
        
        this.showStep();
    },
    
    showStep() {
        const recipe = this.currentRecipe;
        const step = recipe.steps[this.currentStep];
        
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.id = 'cookingModal';
        
        modal.innerHTML = `
            <div class="modal-content cooking-minigame">
                <div class="minigame-header">
                    <h2>${recipe.name}</h2>
                    <div class="step-counter">Step ${this.currentStep + 1} of ${recipe.steps.length}</div>
                </div>
                
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${((this.currentStep + 1) / recipe.steps.length) * 100}%"></div>
                </div>
                
                <div class="cooking-content">
                    <div class="cooking-instruction">
                        <div class="instruction-icon">👨‍🍳</div>
                        <h3>What to do:</h3>
                        <p class="instruction-text">${step.instruction}</p>
                    </div>
                    
                    <div class="safety-tip">
                        <div class="tip-icon">⚠️</div>
                        <h4>Safety Tip:</h4>
                        <p>${step.safetyTip}</p>
                    </div>
                    
                    ${this.currentStep === 0 ? `
                        <div class="ingredients-list">
                            <h4>📋 Ingredients Needed:</h4>
                            <ul>
                                ${recipe.ingredients.map(ing => `<li>✓ ${ing}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                </div>
                
                <div class="minigame-actions">
                    ${this.currentStep < recipe.steps.length - 1 ?
                        '<button class="btn btn-primary btn-large" onclick="CookingMinigame.nextStep()">✅ Done - Next Step</button>' :
                        '<button class="btn btn-success btn-large" onclick="CookingMinigame.complete()">🎉 Finish Cooking!</button>'
                    }
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    },
    
    nextStep() {
        this.currentStep++;
        document.getElementById('cookingModal').remove();
        this.showStep();
    },
    
    complete() {
        const recipe = this.currentRecipe;
        
        // Award money and skill
        GameState.addSkill('cooking', recipe.skill * 5);
        GameState.clearBusy();
        
        document.getElementById('cookingModal').remove();
        
        UI.showNotification(`🍳 ${recipe.name} completed! +${recipe.skill * 5} cooking skill`, 'success');
        
        // Achievements
        if (GameState.skills.cooking >= 50) {
            GameState.addAchievement('Home Chef', 'Reach 50 cooking skill', '👨‍🍳');
        }
        
        loadHome();
        UI.updateStats();
    }
};
