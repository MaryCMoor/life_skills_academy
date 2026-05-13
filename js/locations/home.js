// ==================== HOME LOCATION ====================

function loadHome() {
    document.getElementById('locationTitle').textContent = '🏠 Home';
    
    const content = `
        <div class="tabs">
            <div class="tab active" onclick="showHomeTab('chores')">Chores</div>
            <div class="tab" onclick="showHomeTab('cook')">Cook</div>
            <div class="tab" onclick="showHomeTab('sleep')">Sleep</div>
        </div>
        
        <div id="home-chores" class="tab-content active">
            ${renderChores()}
        </div>
        
        <div id="home-cook" class="tab-content">
            ${renderCooking()}
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
    if (GameState.player.age >= 18) {
        return `
            <div class="alert alert-info">
                ℹ️ You're an adult now! No assigned chores, but you're responsible for keeping your place clean.
            </div>
        `;
    }
    
    const chores = GameState.daily.chores;
    
    if (!chores || chores.length === 0) {
        return `
            <div class="alert alert-success">
                ✅ No chores for today! Enjoy your free time!
            </div>
        `;
    }
    
    let html = '<h3>📋 Today\'s Chores</h3>';
    html += '<div class="checklist">';
    
    chores.forEach((chore, index) => {
        const canDo = !GameState.isBusy() && !chore.done;
        
        html += `
            <div class="checklist-item ${chore.done ? 'completed' : ''}">
                <div class="checklist-icon">${chore.done ? '✅' : '⬜'}</div>
                <div class="checklist-text">
                    <strong>${Utils.escapeHtml(chore.name)}</strong>
                    <div class="desc">Time: ${chore.time} minutes</div>
                    <div class="reward">Reward: $${chore.reward}</div>
                </div>
                ${chore.done ? 
                    '<span style="color: #27ae60; font-weight: bold;">DONE ✓</span>' :
                    canDo ?
                        `<button class="btn btn-success" onclick="doChore(${index})">Start</button>` :
                        '<button class="btn" disabled>Busy</button>'
                }
            </div>
        `;
    });
    
    html += '</div>';
    
    const allDone = chores.every(c => c.done);
    if (allDone && chores.length > 0) {
        html += `
            <div class="alert alert-success mt-20">
                🎉 All chores complete! Great job!
            </div>
        `;
    }
    
    return html;
}

function renderCooking() {
    let html = '<h3>👨‍🍳 Cooking</h3>';
    
    const recipes = [
        { id: 'sandwich', name: '🥪 Sandwich', time: 10, skill: 'Basic' },
        { id: 'eggs', name: '🍳 Scrambled Eggs', time: 15, skill: 'Basic' },
        { id: 'soup', name: '🍲 Canned Soup', time: 20, skill: 'Basic' },
        { id: 'salad', name: '🥗 Fresh Salad', time: 15, skill: 'Basic' },
        { id: 'pasta', name: '🍝 Pasta', time: 30, skill: 'Intermediate' }
    ];
    
    html += '<div class="shop-grid">';
    
    recipes.forEach(recipe => {
        const canCook = !GameState.isBusy();
        
        html += `
            <div class="shop-item">
                <div class="item-icon">${recipe.name.split(' ')[0]}</div>
                <div class="item-name">${Utils.escapeHtml(recipe.name)}</div>
                <div class="item-desc">Time: ${recipe.time} min</div>
                <div class="item-desc">Level: ${recipe.skill}</div>
                ${canCook ?
                    `<button class="btn btn-primary" onclick="startCooking('${recipe.id}')">Cook</button>` :
                    '<button class="btn" disabled>Busy</button>'
                }
            </div>
        `;
    });
    
    html += '</div>';
    
    html += `
        <div class="info-box mt-20">
            <h4>💡 Cooking Tips:</h4>
            <ul>
                <li>Always wash your hands first</li>
                <li>Read the entire recipe before starting</li>
                <li>Never leave the stove unattended</li>
                <li>Clean up as you go</li>
            </ul>
        </div>
    `;
    
    return html;
}

function renderSleep() {
    const hour = GameState.time.hour;
    const canSleep = hour >= 20 || hour < 6;
    
    return `
        <h3>😴 Sleep</h3>
        
        <div class="card">
            <div class="card-title">Rest and Recharge</div>
            <div class="card-content">
                <p>Sleep is important for your health and performance!</p>
                
                <div class="stats-display mt-20">
                    <div class="stat-box">
                        <div class="icon">⏰</div>
                        <div class="label">Current Time</div>
                        <div class="value">${hour > 12 ? hour - 12 : hour}:${GameState.time.minute.toString().padStart(2, '0')} ${hour >= 12 ? 'PM' : 'AM'}</div>
                    </div>
                    <div class="stat-box">
                        <div class="icon">😴</div>
                        <div class="label">Best Sleep Time</div>
                        <div class="value">8:00 PM - 6:00 AM</div>
                    </div>
                </div>
                
                <div class="mt-20">
                    ${canSleep ?
                        '<button class="btn btn-primary btn-large" onclick="goToSleep()">💤 Go to Sleep</button>' :
                        '<div class="alert alert-warning">⏰ It\'s too early to sleep! Try again after 8:00 PM.</div>'
                    }
                </div>
            </div>
        </div>
        
        <div class="info-box mt-20">
            <h4>💡 Sleep Benefits:</h4>
            <ul>
                <li>Restores energy</li>
                <li>Improves focus at school</li>
                <li>Helps you perform better at work</li>
                <li>Essential for good health</li>
            </ul>
        </div>
    `;
}

function doChore(index) {
    const chore = GameState.daily.chores[index];
    
    if (!chore || chore.done) {
        UI.showNotification('❌ Chore not available!', 'error');
        return;
    }
    
    if (GameState.isBusy()) {
        UI.showNotification('⏳ You\'re busy with something else!', 'warning');
        return;
    }
    
    // Start interactive minigame
    if (window.ChoreMinigames) {
        ChoreMinigames.start(chore.id);
    } else {
        // Fallback: simple completion
        GameState.setBusy(chore.time / 60, chore.name);
        setTimeout(() => {
            GameState.completeChore(chore.id);
            GameState.addMoney(chore.reward, 'chore');
            GameState.addSkill(chore.skill, 5);
            GameState.clearBusy();
            UI.showNotification(`✅ ${chore.name} complete! +$${chore.reward}`, 'success');
            loadHome();
            UI.updateStats();
        }, 1000);
    }
}

function startCooking(recipeId) {
    if (GameState.isBusy()) {
        UI.showNotification('⏳ You\'re busy with something else!', 'warning');
        return;
    }
    
    if (window.CookingMinigame) {
        CookingMinigame.start(recipeId);
    } else {
        UI.showNotification('👨‍🍳 Cooking minigame loading...', 'info');
    }
}

function goToSleep() {
    const hour = GameState.time.hour;
    
    if (hour < 20 && hour >= 6) {
        UI.showNotification('⏰ It\'s too early to sleep!', 'warning');
        return;
    }
    
    // Sleep until 7 AM
    GameState.time.hour = 7;
    GameState.time.minute = 0;
    GameState.advanceDay();
    
    UI.showNotification('😴 You slept well! Good morning!', 'success');
    
    TimeManager.updateDisplay();
    loadHome();
    UI.updateStats();
}
