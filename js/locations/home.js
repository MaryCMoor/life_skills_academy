// ==================== HOME LOCATION ====================

function loadHome() {
    console.log('🏠 Loading home...');
    
    if (GameState.isBusy()) {
        const content = `
            <div class="location-container">
                <h2>🏠 Home</h2>
                <div class="info-box">
                    <p>⏰ You're currently busy with: <strong>${GameState.currentActivity}</strong></p>
                    <p>You'll be free at ${GameState.time.busyUntil.hour}:${GameState.time.busyUntil.minute.toString().padStart(2, '0')}</p>
                </div>
            </div>
        `;
        document.getElementById('locationContent').innerHTML = content;
        return;
    }
    
    const isUnderage = GameState.player.age < 18;
    
    let content = `
        <div class="location-container">
            <h2>🏠 Home - ${isUnderage ? "Parent's House" : "Your Apartment"}</h2>
            <p class="location-description">
                ${isUnderage ? 
                    "You're living with your parents. Help out with chores and responsibilities!" : 
                    "Your own place. You're responsible for everything now."}
            </p>
    `;
    
    // CHORES SECTION
    if (isUnderage) {
        const availableChores = GameState.daily.chores.filter(c => !c.completed);
        const completedChores = GameState.daily.chores.filter(c => c.completed);
        
        content += `
            <div class="section">
                <h3>🧹 Daily Chores (${completedChores.length}/${GameState.daily.chores.length} done)</h3>
                <div class="button-grid">
        `;
        
        if (availableChores.length > 0) {
            availableChores.forEach(chore => {
                content += `
                    <button class="btn btn-primary" onclick="doChore('${chore.id}')">
                        ${chore.name}
                        <div class="btn-subtitle">⏱️ ${chore.time}min • 💰 $${chore.reward}</div>
                    </button>
                `;
            });
        } else {
            content += `<p style="color: #27ae60; font-weight: bold;">✅ All chores complete for today!</p>`;
        }
        
        content += `
                </div>
            </div>
        `;
    }
    
    // COOKING SECTION
    content += `
        <div class="section">
            <h3>🍳 Cooking</h3>
            <p>Practice cooking to improve your skills!</p>
            <div class="button-grid">
                <button class="btn btn-primary" onclick="cookRecipe('sandwich')">
                    🥪 Make Sandwich
                    <div class="btn-subtitle">⏱️ 10min • Skill +3</div>
                </button>
                <button class="btn btn-primary" onclick="cookRecipe('eggs')">
                    🍳 Scrambled Eggs
                    <div class="btn-subtitle">⏱️ 15min • Skill +5</div>
                </button>
                <button class="btn btn-primary" onclick="cookRecipe('pasta')">
                    🍝 Simple Pasta
                    <div class="btn-subtitle">⏱️ 30min • Skill +8</div>
                </button>
                <button class="btn btn-primary" onclick="cookRecipe('salad')">
                    🥗 Fresh Salad
                    <div class="btn-subtitle">⏱️ 15min • Skill +3</div>
                </button>
                <button class="btn btn-primary" onclick="cookRecipe('soup')">
                    🍲 Easy Soup
                    <div class="btn-subtitle">⏱️ 20min • Skill +4</div>
                </button>
            </div>
        </div>
    `;
    
    // LAUNDRY SECTION
    content += `
        <div class="section">
            <h3>🧺 Laundry</h3>
            <button class="btn btn-primary btn-large" onclick="doLaundry()">
                Do Laundry
                <div class="btn-subtitle">⏱️ 90min • 💰 $12 • Skill +10</div>
            </button>
        </div>
    `;
    
    // SLEEP SECTION
    content += `
        <div class="section">
            <h3>😴 Sleep</h3>
            <button class="btn btn-primary btn-large" onclick="goToSleep()">
                Go to Sleep (Advance to Next Day)
            </button>
        </div>
    `;
    
    // ADULT-ONLY FEATURES
    if (!isUnderage) {
        content += `
            <div class="section">
                <h3>🏠 Apartment Management</h3>
                <div class="info-box">
                    <p><strong>Rent:</strong> $${GameState.adult.rent}/month (Due: Day 1)</p>
                    <p><strong>Utilities:</strong> $${GameState.adult.utilities}/month</p>
                </div>
                <div class="button-grid">
                    <button class="btn btn-secondary" onclick="payRent()">
                        💰 Pay Rent ($${GameState.adult.rent})
                    </button>
                    <button class="btn btn-secondary" onclick="payUtilities()">
                        💡 Pay Utilities ($${GameState.adult.utilities})
                    </button>
                </div>
            </div>
        `;
    }
    
    content += `</div>`;
    document.getElementById('locationContent').innerHTML = content;
}

// ==================== CHORE FUNCTIONS ====================

function doChore(choreId) {
    console.log('🧹 Starting chore:', choreId);
    
    const chore = GameState.daily.chores.find(c => c.id === choreId);
    if (!chore) {
        UI.showNotification('❌ Chore not found!', 'error');
        return;
    }
    
    if (chore.completed) {
        UI.showNotification('❌ Already completed this chore today!', 'error');
        return;
    }
    
    if (GameState.isBusy()) {
        UI.showNotification('❌ You\'re already busy!', 'error');
        return;
    }
    
    // Set busy and launch minigame
    GameState.setBusy(chore.time / 60, chore.name);
    
    // Launch the appropriate minigame
    if (window.ChoreMinigames) {
        console.log('✅ Launching ChoreMinigames for:', choreId);
        ChoreMinigames.start(choreId);
    } else {
        console.error('❌ ChoreMinigames not loaded!');
        UI.showNotification('❌ Minigame system not loaded!', 'error');
    }
}

// ==================== COOKING FUNCTIONS ====================

function cookRecipe(recipeId) {
    console.log('👨‍🍳 Cooking recipe:', recipeId);
    
    if (GameState.isBusy()) {
        UI.showNotification('❌ You\'re already busy!', 'error');
        return;
    }
    
    const recipes = {
        sandwich: { time: 10 },
        eggs: { time: 15 },
        pasta: { time: 30 },
        salad: { time: 15 },
        soup: { time: 20 }
    };
    
    const recipe = recipes[recipeId];
    if (!recipe) {
        UI.showNotification('❌ Recipe not found!', 'error');
        return;
    }
    
    // Set busy and launch cooking minigame
    GameState.setBusy(recipe.time / 60, `Cooking ${recipeId}`);
    
    if (window.CookingMinigame) {
        console.log('✅ Launching CookingMinigame for:', recipeId);
        CookingMinigame.start(recipeId);
    } else {
        console.error('❌ CookingMinigame not loaded!');
        UI.showNotification('❌ Cooking system not loaded!', 'error');
    }
}

// ==================== LAUNDRY FUNCTION ====================

function doLaundry() {
    console.log('🧺 Starting laundry');
    
    if (GameState.isBusy()) {
        UI.showNotification('❌ You\'re already busy!', 'error');
        return;
    }
    
    // Set busy and launch laundry minigame
    GameState.setBusy(1.5, 'Doing laundry');
    
    if (window.LaundryMinigame) {
        console.log('✅ Launching LaundryMinigame');
        LaundryMinigame.start();
    } else {
        console.error('❌ LaundryMinigame not loaded!');
        UI.showNotification('❌ Laundry system not loaded!', 'error');
    }
}

// ==================== SLEEP FUNCTION ====================

function goToSleep() {
    if (GameState.isBusy()) {
        UI.showNotification('❌ You\'re too busy to sleep right now!', 'error');
        return;
    }
    
    if (!confirm('Go to sleep and start a new day?')) {
        return;
    }
    
    // Advance day
    GameState.advanceDay();
    
    UI.showNotification('😴 Good morning! It\'s a new day.', 'success');
    loadHome();
    UI.updateStats();
}

// ==================== ADULT FUNCTIONS ====================

function payRent() {
    if (GameState.money.cash < GameState.adult.rent) {
        UI.showNotification('❌ Not enough cash! You need $' + GameState.adult.rent, 'error');
        return;
    }
    
    if (!confirm(`Pay rent of $${GameState.adult.rent}?`)) {
        return;
    }
    
    GameState.spendMoney(GameState.adult.rent, 'rent');
    UI.showNotification(`✅ Rent paid: -$${GameState.adult.rent}`, 'success');
    UI.updateStats();
    loadHome();
}

function payUtilities() {
    if (GameState.money.cash < GameState.adult.utilities) {
        UI.showNotification('❌ Not enough cash! You need $' + GameState.adult.utilities, 'error');
        return;
    }
    
    if (!confirm(`Pay utilities of $${GameState.adult.utilities}?`)) {
        return;
    }
    
    GameState.spendMoney(GameState.adult.utilities, 'utilities');
    UI.showNotification(`✅ Utilities paid: -$${GameState.adult.utilities}`, 'success');
    UI.updateStats();
    loadHome();
}

console.log('✅ home.js loaded');
