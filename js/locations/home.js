// ==================== HOME LOCATION (UPDATED) ====================

function loadHome() {
    document.getElementById('locationTitle').textContent = '🏠 Home';
    
    const content = `
        <div class="tabs">
            <div class="tab active" onclick="showHomeTab('chores')">Chores</div>
            <div class="tab" onclick="showHomeTab('cooking')">Cooking</div>
            <div class="tab" onclick="showHomeTab('laundry')">Laundry</div>
            <div class="tab" onclick="showHomeTab('sleep')">Sleep</div>
        </div>
        
        <div id="home-chores" class="tab-content active">
            ${renderChores()}
        </div>
        
        <div id="home-cooking" class="tab-content">
            ${renderCooking()}
        </div>
        
        <div id="home-laundry" class="tab-content">
            ${renderLaundry()}
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
    const chores = GameState.daily.chores;
    const isBusy = GameState.isBusy();
    
    if (chores.length === 0) {
        return '<div class="alert alert-success">✅ All chores completed for today!</div>';
    }
    
    let html = '<h3>Today\'s Chores</h3>';
    
    if (isBusy) {
        html += `<div class="alert alert-warning">⏳ You're currently: ${GameState.currentActivity}</div>`;
    }
    
    html += '<div class="checklist">';
    
    chores.forEach(chore => {
        const completed = GameState.daily.completedToday.includes(chore.id);
        html += `
            <div class="checklist-item ${completed ? 'completed' : ''}">
                <div class="checklist-icon">${completed ? '✅' : '⬜'}</div>
                <div class="checklist-text">
                    <strong>${chore.name}</strong>
                    <div class="desc">⏱️ Takes ${chore.time} minutes</div>
                    <div class="reward">💰 Reward: $${chore.reward} | 📈 +${chore.skill} skill</div>
                </div>
                ${!completed && !isBusy ? 
                    `<button class="btn btn-primary" onclick="doChore('${chore.id}')">Start</button>` : 
                    completed ? '<span style="color: #27ae60;">✓ Done</span>' : ''
                }
            </div>
        `;
    });
    
    html += '</div>';
    return html;
}

function doChore(choreId) {
    const chore = GameState.daily.chores.find(c => c.id === choreId);
    if (!chore) return;
    
    if (GameState.isBusy()) {
        UI.showNotification('⏳ You\'re already busy!', 'warning');
        return;
    }
    
    // Set busy for the duration
    const hours = Math.ceil(chore.time / 60);
    GameState.setBusy(hours, `Doing chore: ${chore.name}`);
    
    // Start minigame if available
    if (window.ChoreMinigames && ChoreMinigames[choreId]) {
        ChoreMinigames.start(choreId);
    } else {
        // Simple completion with time delay
        setTimeout(() => {
            completeChoreSimple(chore);
        }, hours * 1000); // Simulate time passing (1 sec = 1 game hour)
    }
}

function completeChoreSimple(chore) {
    if (GameState.completeChore(chore.id)) {
        GameState.addMoney(chore.reward, 'chore');
        GameState.addSkill(chore.skill, 5);
        GameState.clearBusy();
        
        UI.showNotification(`✅ ${chore.name} completed! +$${chore.reward}`, 'success');
        
        // Check for achievement
        if (GameState.stats.choresCompleted === 10) {
            GameState.addAchievement('Chore Warrior', 'Complete 10 chores', '🧹');
        }
        
        if (GameState.stats.choresCompleted === 50) {
            GameState.addAchievement('Domestic Expert', 'Complete 50 chores', '🏆');
        }
        
        loadHome();
        UI.updateStats();
    }
}

function renderCooking() {
    const recipes = [
        { id: 'sandwich', name: '🥪 Sandwich', time: 10, skill: 1, cost: 5 },
        { id: 'pasta', name: '🍝 Pasta', time: 30, skill: 3, cost: 8 },
        { id: 'eggs', name: '🍳 Scrambled Eggs', time: 15, skill: 2, cost: 6 },
        { id: 'salad', name: '🥗 Salad', time: 15, skill: 2, cost: 7 },
        { id: 'soup', name: '🍲 Soup', time: 45, skill: 4, cost: 10 }
    ];
    
    const isBusy = GameState.isBusy();
    
    let html = '<h3>🍳 Cooking</h3>';
    html += '<p>Cook meals to improve your cooking skill and restore energy!</p>';
    
    if (isBusy) {
        html += `<div class="alert alert-warning">⏳ You're currently: ${GameState.currentActivity}</div>`;
    }
    
    html += '<div class="content-grid">';
    
    recipes.forEach(recipe => {
        const canAfford = GameState.money.cash >= recipe.cost;
        html += `
            <div class="card">
                <div class="card-title">${recipe.name}</div>
                <div class="card-content">
                    <p>⏱️ Time: ${recipe.time} minutes</p>
                    <p>💰 Ingredients: $${recipe.cost}</p>
                    <p>📈 Skill gained: +${recipe.skill}</p>
                    ${!canAfford ? '<p class="alert alert-danger">Not enough cash!</p>' : ''}
                    <button class="btn btn-success mt-20" 
                            onclick="startCooking('${recipe.id}', ${recipe.time}, ${recipe.cost}, ${recipe.skill})" 
                            ${!canAfford || isBusy ? 'disabled' : ''}>
                        Cook
                    </button>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    return html;
}

function startCooking(recipeId, time, cost, skill) {
    if (GameState.isBusy()) {
        UI.showNotification('⏳ You\'re already busy!', 'warning');
        return;
    }
    
    if (!GameState.spendMoney(cost, 'ingredients')) {
        UI.showNotification('❌ Not enough cash!', 'error');
        return;
    }
    
    // Set busy for cooking duration
    const hours = Math.ceil(time / 60);
    GameState.setBusy(hours, `Cooking`);
    
    if (window.CookingMinigame) {
        CookingMinigame.start(recipeId);
    } else {
        // Auto-complete after time
        setTimeout(() => {
            GameState.addSkill('cooking', skill * 5);
            GameState.clearBusy();
            UI.showNotification(`🍳 Meal ready! +${skill * 5} cooking skill`, 'success');
            loadHome();
        }, hours * 1000);
    }
}

function renderLaundry() {
    const isBusy = GameState.isBusy();
    
    return `
        <h3>🧺 Laundry</h3>
        <div class="alert alert-info">
            Learn to sort, wash, dry, and fold clothes properly!
        </div>
        
        ${isBusy ? `<div class="alert alert-warning">⏳ You're currently: ${GameState.currentActivity}</div>` : ''}
        
        <div class="card">
            <div class="card-title">Do Laundry</div>
            <div class="card-content">
                <p>Complete the full laundry cycle:</p>
                <ol>
                    <li>Sort clothes by color</li>
                    <li>Wash with proper settings</li>
                    <li>Dry clothes</li>
                    <li>Fold and put away</li>
                </ol>
                <p><strong>⏱️ Time:</strong> 90 minutes (1.5 hours)</p>
                <p><strong>💰 Reward:</strong> $12 + Laundry skill</p>
                <button class="btn btn-primary mt-20" 
                        onclick="startLaundry()" 
                        ${isBusy ? 'disabled' : ''}>
                    Start Laundry
                </button>
            </div>
        </div>
    `;
}

function startLaundry() {
    if (GameState.isBusy()) {
        UI.showNotification('⏳ You\'re already busy!', 'warning');
        return;
    }
    
    // Set busy for 2 hours
    GameState.setBusy(2, 'Doing laundry');
    
    if (window.LaundryMinigame) {
        LaundryMinigame.start();
    } else {
        // Auto-complete
        setTimeout(() => {
            const chore = GameState.daily.chores.find(c => c.id === 'laundry');
            if (chore) {
                completeChoreSimple(chore);
            } else {
                GameState.addMoney(12, 'laundry');
                GameState.addSkill('laundry', 10);
                GameState.clearBusy();
                UI.showNotification('✅ Laundry complete!', 'success');
                loadHome();
            }
        }, 2000);
    }
}

function renderSleep() {
    const hour = GameState.time.hour;
    const canSleep = hour >= 20 || hour < 6;
    const isBusy = GameState.isBusy();
    
    return `
        <h3>😴 Sleep</h3>
        <div class="alert ${canSleep ? 'alert-info' : 'alert-warning'}">
            ${canSleep ? 
                '✅ Good time to sleep! (8:00 PM - 6:00 AM)' : 
                '⚠️ It\'s not bedtime yet. Try sleeping after 8:00 PM.'}
        </div>
        
        ${isBusy ? `<div class="alert alert-warning">⏳ Finish your current activity first!</div>` : ''}
        
        <div class="card">
            <div class="card-title">Go to Bed</div>
            <div class="card-content">
                <p>Sleeping will:</p>
                <ul>
                    <li>⏭️ Advance to the next day</li>
                    <li>⚡ Restore your energy</li>
                    <li>🔄 Reset daily tasks</li>
                    <li>📋 Generate new chores and homework</li>
                </ul>
                
                ${GameState.player.age < 18 ? 
                    '<p class="alert alert-warning"><strong>Note:</strong> Your parents expect you home by 10 PM on school nights!</p>' : 
                    ''}
                
                <button class="btn ${canSleep ? 'btn-primary' : 'btn-danger'}" 
                        onclick="goToSleep()" 
                        ${!canSleep || isBusy ? 'disabled' : ''}>
                    ${canSleep ? '😴 Go to Sleep' : '⏰ Too Early to Sleep'}
                </button>
            </div>
        </div>
    `;
}

function goToSleep() {
    const hour = GameState.time.hour;
    
    if (hour < 20 && hour >= 6) {
        UI.showNotification('⏰ It\'s too early to sleep!', 'warning');
        return;
    }
    
    if (GameState.isBusy()) {
        UI.showNotification('⏳ Finish your current activity first!', 'warning');
        return;
    }
    
    // Advance time to next day
    GameState.time.hour = 7;
    GameState.time.minute = 0;
    GameState.advanceDay();
    TimeManager.generateDailyTasks();
    
    UI.showNotification('☀️ Good morning! A new day begins.', 'success');
    
    // Check if it's a school day
    if (GameState.isWeekday() && GameState.player.age < 18) {
        setTimeout(() => {
            UI.showNotification('📚 Don\'t forget to go to school!', 'info');
        }, 2000);
    }
    
    loadHome();
    UI.updateStats();
}
