// ==================== COOKING MINIGAME ====================
const CookingMinigame = {
    active: false,
    canvas: null,
    ctx: null,
    currentRecipe: null,
    currentStep: 0,
    timer: 0,
    maxTime: 30,
    ingredients: [],
    mistakes: [],
    
    recipes: {
        'scrambled-eggs': {
            id: 'scrambled-eggs',
            name: 'Scrambled Eggs',
            steps: [
                { action: 'crack', text: 'Crack the eggs', time: 10 },
                { action: 'whisk', text: 'Whisk the eggs', time: 8 },
                { action: 'cook', text: 'Cook in pan', time: 12 }
            ],
            reward: 15,
            skill: 5
        },
        'pasta': {
            id: 'pasta',
            name: 'Spaghetti',
            steps: [
                { action: 'boil', text: 'Boil water', time: 15 },
                { action: 'add-pasta', text: 'Add pasta', time: 10 },
                { action: 'drain', text: 'Drain pasta', time: 8 },
                { action: 'sauce', text: 'Add sauce', time: 7 }
            ],
            reward: 20,
            skill: 8
        },
        'sandwich': {
            id: 'sandwich',
            name: 'Sandwich',
            steps: [
                { action: 'bread', text: 'Get bread slices', time: 5 },
                { action: 'layer', text: 'Add ingredients', time: 10 },
                { action: 'cut', text: 'Cut in half', time: 5 }
            ],
            reward: 10,
            skill: 3
        },
        'pancakes': {
            id: 'pancakes',
            name: 'Pancakes',
            steps: [
                { action: 'mix', text: 'Mix batter', time: 12 },
                { action: 'pour', text: 'Pour onto griddle', time: 8 },
                { action: 'flip', text: 'Flip pancake', time: 5 },
                { action: 'stack', text: 'Stack and serve', time: 5 }
            ],
            reward: 25,
            skill: 12
        }
    },
    
    start(recipeId) {
        if (!this.recipes[recipeId]) {
            console.error('Recipe not found:', recipeId);
            return;
        }
        
        this.currentRecipe = this.recipes[recipeId];
        this.currentStep = 0;
        this.mistakes = [];
        this.active = true;
        
        GameState.setBusy(`cooking ${this.currentRecipe.name}`, 30);
        
        this.createCanvas();
        this.render();
    },
    
    createCanvas() {
        const overlay = document.createElement('div');
        overlay.id = 'cookingOverlay';
        overlay.className = 'minigame-overlay';
        
        overlay.innerHTML = `
            <div class="minigame-container">
                <div class="minigame-header">
                    <h2>🍳 Cooking: ${this.currentRecipe.name}</h2>
                    <button class="btn-close" onclick="CookingMinigame.cancel()">×</button>
                </div>
                
                <div class="minigame-body">
                    <div class="cooking-progress">
                        <div class="progress-bar">
                            <div id="cookingProgressBar" class="progress-fill" style="width: 0%;"></div>
                        </div>
                        <div id="cookingStepText" class="step-text">Step 1 of ${this.currentRecipe.steps.length}</div>
                    </div>
                    
                    <canvas id="cookingCanvas" width="600" height="400"></canvas>
                    
                    <div class="cooking-controls">
                        <div id="cookingInstruction" class="instruction-text">
                            Click to start cooking!
                        </div>
                        <button id="cookingActionBtn" class="btn btn-primary btn-large" onclick="CookingMinigame.performAction()">
                            Start Cooking
                        </button>
                        <div id="cookingTimer" class="timer-display">Time: 0s</div>
                    </div>
                    
                    <div id="cookingFeedback" class="feedback-text"></div>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        this.canvas = document.getElementById('cookingCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.startStep();
    },
    
    render() {
        if (!this.active || !this.ctx) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw kitchen background
        this.ctx.fillStyle = '#f5deb3';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw stove
        this.ctx.fillStyle = '#2c3e50';
        this.ctx.fillRect(150, 200, 300, 150);
        
        // Draw current step visualization
        const step = this.currentRecipe.steps[this.currentStep];
        
        this.ctx.font = 'bold 24px Arial';
        this.ctx.fillStyle = '#2c3e50';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(step.text, this.canvas.width / 2, 100);
        
        // Draw cooking item based on action
        this.drawCookingAction(step.action);
        
        requestAnimationFrame(() => this.render());
    },
    
    drawCookingAction(action) {
        const centerX = this.canvas.width / 2;
        const centerY = 275;
        
        switch(action) {
            case 'crack':
                // Draw eggs
                this.ctx.fillStyle = '#fff';
                this.ctx.beginPath();
                this.ctx.ellipse(centerX - 30, centerY, 25, 30, 0, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.beginPath();
                this.ctx.ellipse(centerX + 30, centerY, 25, 30, 0, 0, Math.PI * 2);
                this.ctx.fill();
                break;
                
            case 'whisk':
                // Draw bowl with whisk
                this.ctx.fillStyle = '#e74c3c';
                this.ctx.beginPath();
                this.ctx.arc(centerX, centerY, 50, 0, Math.PI * 2);
                this.ctx.fill();
                break;
                
            case 'cook':
            case 'boil':
                // Draw pan with fire
                this.ctx.fillStyle = '#34495e';
                this.ctx.fillRect(centerX - 60, centerY - 20, 120, 40);
                
                // Fire
                this.ctx.fillStyle = '#e74c3c';
                this.ctx.beginPath();
                this.ctx.moveTo(centerX, centerY + 40);
                this.ctx.lineTo(centerX - 20, centerY + 60);
                this.ctx.lineTo(centerX + 20, centerY + 60);
                this.ctx.fill();
                break;
                
            case 'add-pasta':
                // Draw pasta box
                this.ctx.fillStyle = '#f39c12';
                this.ctx.fillRect(centerX - 40, centerY - 50, 80, 100);
                break;
                
            case 'drain':
                // Draw colander
                this.ctx.strokeStyle = '#7f8c8d';
                this.ctx.lineWidth = 3;
                this.ctx.beginPath();
                this.ctx.arc(centerX, centerY, 50, 0, Math.PI);
                this.ctx.stroke();
                break;
                
            case 'sauce':
                // Draw sauce jar
                this.ctx.fillStyle = '#c0392b';
                this.ctx.fillRect(centerX - 30, centerY - 40, 60, 80);
                break;
                
            case 'bread':
                // Draw bread slices
                this.ctx.fillStyle = '#d2691e';
                this.ctx.fillRect(centerX - 50, centerY - 30, 40, 60);
                this.ctx.fillRect(centerX + 10, centerY - 30, 40, 60);
                break;
                
            case 'layer':
                // Draw ingredients
                this.ctx.fillStyle = '#27ae60';
                this.ctx.fillRect(centerX - 40, centerY - 20, 80, 10);
                this.ctx.fillStyle = '#e74c3c';
                this.ctx.fillRect(centerX - 40, centerY - 10, 80, 10);
                this.ctx.fillStyle = '#f1c40f';
                this.ctx.fillRect(centerX - 40, centerY, 80, 10);
                break;
                
            case 'cut':
                // Draw knife
                this.ctx.fillStyle = '#95a5a6';
                this.ctx.fillRect(centerX - 10, centerY - 40, 20, 80);
                break;
                
            case 'mix':
                // Draw mixing bowl
                this.ctx.fillStyle = '#ecf0f1';
                this.ctx.beginPath();
                this.ctx.arc(centerX, centerY, 60, 0, Math.PI * 2);
                this.ctx.fill();
                break;
                
            case 'pour':
                // Draw pouring motion
                this.ctx.fillStyle = '#f1c40f';
                this.ctx.beginPath();
                this.ctx.moveTo(centerX - 30, centerY - 40);
                this.ctx.lineTo(centerX - 20, centerY + 20);
                this.ctx.lineTo(centerX - 40, centerY + 20);
                this.ctx.fill();
                break;
                
            case 'flip':
                // Draw spatula
                this.ctx.fillStyle = '#34495e';
                this.ctx.fillRect(centerX - 5, centerY - 60, 10, 80);
                this.ctx.fillRect(centerX - 30, centerY - 65, 60, 10);
                break;
                
            case 'stack':
                // Draw stacked pancakes
                for (let i = 0; i < 3; i++) {
                    this.ctx.fillStyle = '#f39c12';
                    this.ctx.beginPath();
                    this.ctx.ellipse(centerX, centerY - (i * 15), 50, 10, 0, 0, Math.PI * 2);
                    this.ctx.fill();
                }
                break;
        }
    },
    
    startStep() {
        if (this.currentStep >= this.currentRecipe.steps.length) {
            this.complete(this.currentRecipe.reward, this.currentRecipe.skill);
            return;
        }
        
        const step = this.currentRecipe.steps[this.currentStep];
        this.timer = 0;
        this.maxTime = step.time;
        
        document.getElementById('cookingInstruction').textContent = step.text;
        document.getElementById('cookingActionBtn').textContent = step.text;
        document.getElementById('cookingStepText').textContent = `Step ${this.currentStep + 1} of ${this.currentRecipe.steps.length}`;
        
        const progress = ((this.currentStep) / this.currentRecipe.steps.length) * 100;
        document.getElementById('cookingProgressBar').style.width = progress + '%';
        
        this.updateTimer();
    },
    
    updateTimer() {
        if (!this.active) return;
        
        this.timer++;
        document.getElementById('cookingTimer').textContent = `Time: ${this.timer}s / ${this.maxTime}s`;
        
        if (this.timer >= this.maxTime) {
            this.mistakes.push('Too slow on step ' + (this.currentStep + 1));
            this.showFeedback('⏰ Too slow! Food might be overcooked!', 'warning');
            setTimeout(() => this.nextStep(), 1000);
        } else {
            setTimeout(() => this.updateTimer(), 1000);
        }
    },
    
    performAction() {
        if (!this.active) return;
        
        const step = this.currentRecipe.steps[this.currentStep];
        
        // Check timing
        const perfectTime = step.time * 0.7;
        if (this.timer < perfectTime * 0.5) {
            this.mistakes.push('Too fast on step ' + (this.currentStep + 1));
            this.showFeedback('⚡ Too fast! Be careful!', 'warning');
        } else if (this.timer <= perfectTime) {
            this.showFeedback('✨ Perfect timing!', 'success');
        } else {
            this.showFeedback('✅ Good!', 'info');
        }
        
        setTimeout(() => this.nextStep(), 500);
    },
    
    nextStep() {
        this.currentStep++;
        
        if (this.currentStep >= this.currentRecipe.steps.length) {
            setTimeout(() => this.complete(this.currentRecipe.reward, this.currentRecipe.skill), 1000);
        } else {
            this.startStep();
        }
    },
    
    showFeedback(message, type) {
        const feedback = document.getElementById('cookingFeedback');
        feedback.textContent = message;
        feedback.className = 'feedback-text feedback-' + type;
        
        setTimeout(() => {
            feedback.textContent = '';
            feedback.className = 'feedback-text';
        }, 2000);
    },
    
    complete(money, skill) {
        GameState.addMoney(money, 'cooking');
        GameState.addSkill('cooking', skill);
        GameState.clearBusy();
        
        if (this.mistakes.length === 0) {
            GameState.addAchievement('Perfect Chef', 'Cook a recipe perfectly', '👨‍🍳');
        }
        
        if (GameState.skills.cooking >= 50) {
            GameState.addAchievement('Home Chef', 'Reach 50 cooking skill', '🍳');
        }
        
        // ADD MEAL TO FRIDGE WITH NUTRITION VALUES
        const nutritionValues = {
            'scrambled-eggs': {
                calories: 300,
                protein: 18,
                carbs: 2,
                fats: 20,
                vitamins: 15,
                hunger: 30
            },
            'pasta': {
                calories: 600,
                protein: 15,
                carbs: 90,
                fats: 10,
                vitamins: 20,
                hunger: 50
            },
            'sandwich': {
                calories: 400,
                protein: 25,
                carbs: 45,
                fats: 15,
                vitamins: 30,
                hunger: 40
            },
            'pancakes': {
                calories: 550,
                protein: 12,
                carbs: 80,
                fats: 18,
                vitamins: 10,
                hunger: 45
            }
        };
        
        const mealNutrition = nutritionValues[this.currentRecipe.id] || {
            calories: 500,
            protein: 20,
            carbs: 60,
            fats: 15,
            vitamins: 25,
            hunger: 40
        };
        
        GameState.addMealToFridge(this.currentRecipe.name, mealNutrition);
        GameState.stats.mealsCooked++;
        
        UI.showNotification(`✅ Cooking complete! +$${money}, +${skill} cooking skill`, 'success');
        UI.showNotification(`🧊 ${this.currentRecipe.name} added to fridge (expires in 3 days)`, 'info', 5000);
        
        this.close();
        
        if (typeof loadHome === 'function') {
            loadHome();
        }
        UI.updateStats();
    },
    
    cancel() {
        if (confirm('Are you sure you want to quit cooking?')) {
            GameState.clearBusy();
            this.close();
            if (typeof loadHome === 'function') {
                loadHome();
            }
        }
    },
    
    close() {
        this.active = false;
        const overlay = document.getElementById('cookingOverlay');
        if (overlay) {
            overlay.remove();
        }
    }
};

console.log('✅ cooking.js loaded');
