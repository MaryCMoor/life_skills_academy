// ==================== HOME LOCATION ====================

function loadHome() {
    document.getElementById('locationTitle').textContent = '🏠 Home';
    
    const content = `
        <div class="tabs">
            <div class="tab active" onclick="showHomeTab('chores')">Chores</div>
            <div class="tab" onclick="showHomeTab('cooking')">Cooking</div>
            <div class="tab" onclick="showHomeTab('fridge')">Fridge (${GameState.fridge.length})</div>
            <div class="tab" onclick="showHomeTab('sleep')">Rest</div>
        </div>
        
        <div id="home-chores" class="tab-content active">
            ${renderChores()}
        </div>
        
        <div id="home-cooking" class="tab-content">
            ${renderCooking()}
        </div>
        
        <div id="home-fridge" class="tab-content">
            ${renderFridge()}
        </div>
        
        <div id="home-sleep" class="tab-content">
            ${renderSleep()}
        </div>
    `;
    
    document.getElementById('locationContent').innerHTML = content;
}

function showHomeTab(tab) {
    document.querySelectorAll('#locationContent .tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('#locationContent .tab-content').forEach(t => t.classList.remove('active'));
    
    event.target.classList.add('active');
    document.getElementById(`home-${tab}`).classList.add('active');
}

function renderChores() {
    let html = '<h3>🧹 Daily Chores</h3>';
    html += '<p>Complete chores to earn money and build life skills!</p>';
    
    html += '<div class="checklist">';
    
    GameState.daily.chores.forEach(chore => {
        const choreConfig = {
            'bed': { 
                icon: '🛏️', 
                desc: 'Make your bed neatly - interactive minigame!',
                time: '2 minutes',
                hasMinigame: true
            },
            'dishes': { 
                icon: '🍽️', 
                desc: 'Wash dirty dishes - click to scrub them clean!',
                time: '3 minutes',
                hasMinigame: true
            },
            'vacuum': { 
                icon: '🧹', 
                desc: 'Vacuum the floors - use WASD to move around!',
                time: '5 minutes',
                hasMinigame: true
            },
            'trash': { 
                icon: '🗑️', 
                desc: 'Take out the trash',
                time: '1 minute',
                hasMinigame: true
            },
            'laundry': { 
                icon: '🧺', 
                desc: 'Do the laundry - realistic simulation! Sort, wash, and dry clothes.',
                time: '10 minutes',
                hasMinigame: true
            }
        };
        
        const config = choreConfig[chore.id] || { icon: '✓', desc: chore.name, time: '5 minutes', hasMinigame: false };
        
        html += `
            <div class="checklist-item ${chore.done ? 'completed' : ''}">
                <div class="checklist-icon">${chore.done ? '✅' : config.icon}</div>
                <div class="checklist-text">
                    <strong>${Utils.escapeHtml(chore.name)}</strong>
                    <div class="desc">${config.desc}</div>
                    <div class="desc">
                        💰 Reward: $${chore.reward} | 
                        📈 Skill: ${Utils.escapeHtml(chore.skill)} | 
                        ⏱️ Time: ${config.time}
                    </div>
                </div>
                ${!chore.done ? 
                    `<button class="btn btn-success" onclick="doChore('${chore.id}', ${config.hasMinigame})">
                        ${config.hasMinigame ? '🎮 Start' : 'Do It'}
                    </button>` :
                    '<span style="color: #27ae60; font-weight: bold;">Done ✓</span>'
                }
            </div>
        `;
    });
    
    html += '</div>';
    
    const completedChores = GameState.daily.chores.filter(c => c.done).length;
    const totalChores = GameState.daily.chores.length;
    
    if (completedChores === totalChores) {
        html += `
            <div class="alert alert-success mt-20">
                🎉 <strong>All chores complete!</strong> Great job! Your parents are proud of you.
            </div>
        `;
    } else {
        html += `
            <div class="info-box mt-20">
                <h4>💡 Chore Tips:</h4>
                <ul>
                    <li>Complete chores daily to build good habits</li>
                    <li>Some chores have interactive minigames 🎮</li>
                    <li>Earn money and improve your skills</li>
                    <li>Chores reset every day at midnight</li>
                </ul>
            </div>
        `;
    }
    
    return html;
}

function renderCooking() {
    let html = '<h3>🍳 Cooking</h3>';
    html += '<p>Learn to cook meals and improve your cooking skills!</p>';
    
    const recipes = [
        { 
            id: 'scrambled-eggs', 
            name: 'Scrambled Eggs', 
            difficulty: 'Easy', 
            time: '10 min',
            skill: 5,
            ingredients: ['2 eggs', 'butter', 'salt', 'pepper'],
            icon: '🍳'
        },
        { 
            id: 'pasta', 
            name: 'Spaghetti', 
            difficulty: 'Easy', 
            time: '15 min',
            skill: 8,
            ingredients: ['pasta', 'tomato sauce', 'water', 'salt'],
            icon: '🍝'
        },
        { 
            id: 'sandwich', 
            name: 'Sandwich', 
            difficulty: 'Very Easy', 
            time: '5 min',
            skill: 3,
            ingredients: ['bread', 'cheese', 'lettuce', 'tomato'],
            icon: '🥪'
        },
        { 
            id: 'pancakes', 
            name: 'Pancakes', 
            difficulty: 'Medium', 
            time: '20 min',
            skill: 12,
            ingredients: ['flour', 'eggs', 'milk', 'butter', 'syrup'],
            icon: '🥞'
        }
    ];
    
    html += '<div class="content-grid">';
    
    recipes.forEach(recipe => {
        const canCook = GameState.skills.cooking >= (recipe.skill - 5);
        
        html += `
            <div class="card">
                <div class="card-title">${recipe.icon} ${Utils.escapeHtml(recipe.name)}</div>
                <div class="card-content">
                    <div class="info-row">
                        <span class="info-label">Difficulty:</span>
                        <span class="info-value">${recipe.difficulty}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Time:</span>
                        <span class="info-value">${recipe.time}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Skill Gain:</span>
                        <span class="info-value">+${recipe.skill} cooking</span>
                    </div>
                    
                    <h4 style="margin-top: 15px;">Ingredients:</h4>
                    <ul style="margin: 5px 0; padding-left: 20px;">
                        ${recipe.ingredients.map(ing => `<li>${Utils.escapeHtml(ing)}</li>`).join('')}
                    </ul>
                    
                    ${canCook ?
                        `<button class="btn btn-primary mt-10" onclick="startCooking('${recipe.id}')">
                            🎮 Start Cooking
                        </button>` :
                        `<button class="btn mt-10" disabled>
                            Need ${recipe.skill - 5} cooking skill
                        </button>`
                    }
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    
    return html;
}

function renderFridge() {
    let html = '<h3>🧊 Fridge</h3>';
    
    if (GameState.fridge.length === 0) {
        html += `
            <div class="alert alert-info">
                Your fridge is empty! Cook some meals to store them here.
            </div>
            
            <div class="info-box">
                <strong>💡 How the Fridge Works:</strong>
                <ul>
                    <li>Cooked meals are automatically stored in the fridge</li>
                    <li>Meals stay fresh for 3 days</li>
                    <li>After 3 days, they expire and are thrown out</li>
                    <li>Eat stored meals anytime for instant hunger restoration</li>
                    <li>No need to cook every day - meal prep in advance!</li>
                </ul>
            </div>
        `;
        return html;
    }
    
    html += `<p>Stored meals (automatically added when you cook):</p>`;
    html += '<div class="content-grid">';
    
    GameState.fridge.forEach((meal, index) => {
        const daysLeft = GameState.getDaysUntilExpiry(meal.expiryDate);
        const freshness = daysLeft >= 2 ? 'fresh' : daysLeft >= 1 ? 'ok' : 'expiring-soon';
        const freshnessColor = daysLeft >= 2 ? '#27ae60' : daysLeft >= 1 ? '#f39c12' : '#e74c3c';
        const freshnessText = daysLeft >= 2 ? '✅ Fresh' : daysLeft >= 1 ? '⚠️ Eat Soon' : '🚨 Expiring!';
        
        html += `
            <div class="card" style="border-left: 5px solid ${freshnessColor};">
                <div class="card-title">${Utils.escapeHtml(meal.name)}</div>
                <div class="card-content">
                    <div style="font-size: 64px; text-align: center; margin: 15px 0;">🍽️</div>
                    
                    <div class="info-row">
                        <span class="info-label">Freshness:</span>
                        <span class="info-value" style="color: ${freshnessColor}; font-weight: bold;">
                            ${freshnessText}
                        </span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Days Left:</span>
                        <span class="info-value">${daysLeft} day${daysLeft !== 1 ? 's' : ''}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Hunger Restored:</span>
                        <span class="info-value">+${meal.nutrition.hunger}</span>
                    </div>
                    
                    <h4 style="margin-top: 15px; font-size: 14px;">Nutrition:</h4>
                    <div style="font-size: 12px; color: #7f8c8d;">
                        <div>🔥 ${meal.nutrition.calories} cal</div>
                        <div>🥩 ${meal.nutrition.protein}g protein</div>
                        <div>🍞 ${meal.nutrition.carbs}g carbs</div>
                        <div>🥑 ${meal.nutrition.fats}g fats</div>
                        <div>🍊 ${meal.nutrition.vitamins}% vitamins</div>
                    </div>
                    
                    ${daysLeft >= 0 ?
                        `<button class="btn btn-success mt-15" onclick="eatFromFridge(${meal.id})" style="width: 100%;">
                            🍴 Eat This Meal
                        </button>` :
                        '<button class="btn" disabled style="width: 100%;">❌ Expired</button>'
                    }
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    
    html += `
        <div class="info-box mt-20">
            <strong>💡 Meal Storage Tips:</strong>
            <ul>
                <li>Cook multiple meals to save time later</li>
                <li>Eat meals before they expire to avoid waste</li>
                <li>Red/yellow indicators mean eat soon</li>
                <li>Expired meals are automatically thrown out</li>
                <li>Each meal provides full nutrition when eaten</li>
            </ul>
        </div>
    `;
    
    return html;
}

function eatFromFridge(mealId) {
    if (GameState.eatMeal(mealId)) {
        loadHome();
        UI.updateStats();
    }
}

function renderSleep() {
    let html = '<h3>😴 Rest & Sleep</h3>';
    html += '<p>Rest to restore your energy and reduce stress.</p>';
    
    const sleepOptions = [
        { name: 'Quick Nap', hours: 1, energy: 20, stress: 5, icon: '💤' },
        { name: 'Short Sleep', hours: 4, energy: 50, stress: 15, icon: '😴' },
        { name: 'Full Night Sleep', hours: 8, energy: 100, stress: 40, icon: '🌙' }
    ];
    
    html += '<div class="content-grid">';
    
    sleepOptions.forEach(option => {
        const canSleep = GameState.needs.energy < 100;
        
        html += `
            <div class="card">
                <div class="card-title">${option.icon} ${option.name}</div>
                <div class="card-content">
                    <div class="info-row">
                        <span class="info-label">Duration:</span>
                        <span class="info-value">${option.hours} hour${option.hours > 1 ? 's' : ''}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Energy Restored:</span>
                        <span class="info-value">+${option.energy}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Stress Reduced:</span>
                        <span class="info-value" style="color: #27ae60;">-${option.stress}</span>
                    </div>
                    
                    ${canSleep ?
                        `<button class="btn btn-primary" onclick="goToSleep(${option.hours}, ${option.energy}, ${option.stress})">
                            Sleep
                        </button>` :
                        '<button class="btn" disabled>Already Well Rested</button>'
                    }
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    
    html += `
        <div class="info-box mt-20">
            <h4>💡 Sleep Tips:</h4>
            <ul>
                <li>Sleep restores your energy levels</li>
                <li><strong>Sleep is the best way to reduce stress!</strong></li>
                <li>Getting enough sleep improves school performance</li>
                <li>A full night's sleep (8 hours) is healthiest</li>
                <li>Time advances while you sleep</li>
                <li>If stressed, prioritize sleep over other activities</li>
            </ul>
        </div>
    `;
    
    return html;
}

// ==================== CHORE FUNCTIONS ====================

function doChore(choreId, hasMinigame) {
    if (GameState.isBusy()) {
        UI.showNotification('You are already busy with something!', 'warning');
        return;
    }
    
    const chore = GameState.daily.chores.find(c => c.id === choreId);
    if (!chore) {
        console.error('Chore not found:', choreId);
        return;
    }
    
    if (chore.done) {
        UI.showNotification('You already completed this chore today!', 'info');
        return;
    }
    
    // Launch appropriate minigame
    if (hasMinigame) {
        switch(choreId) {
            case 'bed':
            case 'dishes':
            case 'vacuum':
            case 'trash':
                if (typeof ChoreMinigames !== 'undefined') {
                    ChoreMinigames.start(choreId);
                } else {
                    console.error('ChoreMinigames not loaded');
                    completeChoreSimple(choreId);
                }
                break;
                
            case 'laundry':
                if (typeof LaundryMinigame !== 'undefined') {
                    LaundryMinigame.start();
                } else {
                    console.error('LaundryMinigame not loaded');
                    completeChoreSimple(choreId);
                }
                break;
                
            default:
                completeChoreSimple(choreId);
        }
    } else {
        completeChoreSimple(choreId);
    }
}

function completeChoreSimple(choreId) {
    const chore = GameState.daily.chores.find(c => c.id === choreId);
    if (!chore) return;
    
    GameState.setBusy(chore.name, 5);
    
    setTimeout(() => {
        GameState.completeChore(choreId);
        GameState.addMoney(chore.reward, 'chore');
        GameState.addSkill(chore.skill, 5);
        GameState.clearBusy();
        GameState.stats.choresCompleted++;
        
        // Small stress reduction from accomplishing tasks
        GameState.needs.stress = Math.max(0, GameState.needs.stress - 2);
        
        UI.showNotification(`✅ ${chore.name} complete! +$${chore.reward}`, 'success');
        
        loadHome();
        UI.updateStats();
    }, 5000);
}

// ==================== COOKING FUNCTIONS ====================

function startCooking(recipeId) {
    if (GameState.isBusy()) {
        UI.showNotification('You are already busy with something!', 'warning');
        return;
    }
    
    if (typeof CookingMinigame !== 'undefined') {
        CookingMinigame.start(recipeId);
    } else {
        console.error('CookingMinigame not loaded');
        UI.showNotification('Cooking minigame not available', 'error');
    }
}

// ==================== SLEEP FUNCTIONS ====================

function goToSleep(hours, energyRestore, stressReduction) {
    if (GameState.isBusy()) {
        UI.showNotification('You are already busy with something!', 'warning');
        return;
    }
    
    GameState.setBusy('sleeping', hours * 3);
    UI.showNotification(`😴 Sleeping for ${hours} hour${hours > 1 ? 's' : ''}...`, 'info');
    
    setTimeout(() => {
        // Advance time
        for (let i = 0; i < hours; i++) {
            if (typeof TimeManager !== 'undefined') {
                TimeManager.advanceTime(60); // Advance by 60 minutes
            }
        }
        
        // Restore energy
        GameState.needs.energy = Math.min(100, GameState.needs.energy + energyRestore);
        
        // Sleep reduces stress significantly
        GameState.needs.stress = Math.max(0, GameState.needs.stress - stressReduction);
        
        GameState.clearBusy();
        
        let message = `😊 You feel refreshed! Energy: ${GameState.needs.energy}`;
        if (stressReduction > 0) {
            message += `, Stress: ${Math.round(GameState.needs.stress)}`;
        }
        
        UI.showNotification(message, 'success');
        
        loadHome();
        UI.updateStats();
    }, hours * 3000);
}

console.log('✅ home.js loaded');
