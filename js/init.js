// ==================== GAME INITIALIZATION ====================

/**
 * Start the game with character creation
 */
function startGame() {
    const nameInput = document.getElementById('playerName');
    const ageSelect = document.getElementById('playerAge');
    
    const playerName = nameInput.value.trim();
    const playerAge = parseInt(ageSelect.value);
    
    if (!playerName) {
        UI.showNotification('❌ Please enter your name!', 'error');
        nameInput.focus();
        return;
    }
    
    // Initialize game state
    GameState.player.name = playerName;
    GameState.player.age = playerAge;
    GameState.player.grade = playerAge - 6;
    
    // Set initial time
    GameState.time.day = 1; // Monday
    GameState.time.hour = 7;
    GameState.time.minute = 0;
    
    // Initialize stats
    GameState.needs = {
        energy: 100,
        hunger: 80,
        health: 100,
        happiness: 75,
        stress: 20
    };
    
    GameState.money.cash = 50;
    
    // Show success message
    UI.showNotification(`🎉 Welcome, ${playerName}!`, 'success');
    
    // Transition to city view
    setTimeout(() => {
        document.getElementById('startScreen').classList.add('hidden');
        document.getElementById('cityContainer').classList.remove('hidden');
        
        // Initialize 3D city
        try {
            City3D.init();
            UI.updateStats();
            
            // Start time updates
            if (typeof TimeManager !== 'undefined') {
                TimeManager.init();
            }
            
            // Show tutorial notification
            setTimeout(() => {
                UI.showNotification('🏙️ Click on buildings to visit them!', 'info', 5000);
            }, 1000);
            
        } catch (error) {
            console.error('Failed to initialize 3D city:', error);
            UI.showNotification('⚠️ 3D view failed to load. Please refresh.', 'error');
        }
    }, 500);
}

/**
 * Back to city from location
 */
function backToCity() {
    document.getElementById('cityContainer').classList.remove('hidden');
    document.getElementById('locationScreen').classList.add('hidden');
    if (City3D.hideTooltip) City3D.hideTooltip();
    if (City3D.resumeRendering) City3D.resumeRendering();
}

/**
 * Check for saved game on page load
 */
window.addEventListener('DOMContentLoaded', () => {
    console.log('🎮 Life Skills Academy initializing...');
    
    // Check for saved game
    const hasSavedGame = localStorage.getItem('lifeSkillsGameState');
    
    if (hasSavedGame) {
        const startScreen = document.getElementById('startScreen');
        const welcomeBox = startScreen.querySelector('.welcome-box');
        
        const continueButton = document.createElement('button');
        continueButton.className = 'btn btn-success btn-large';
        continueButton.style.marginTop = '20px';
        continueButton.textContent = '📂 Continue Last Game';
        continueButton.onclick = loadGame;
        
        const startButton = welcomeBox.querySelector('button');
        if (startButton) {
            startButton.textContent = '🆕 New Game';
            startButton.parentNode.insertBefore(continueButton, startButton);
        }
    }
    
    console.log('✅ Game ready!');
});

/**
 * Load saved game
 */
function loadGame() {
    const saved = localStorage.getItem('lifeSkillsGameState');
    
    if (!saved) {
        UI.showNotification('❌ No saved game found!', 'error');
        return;
    }
    
    try {
        const saveData = JSON.parse(saved);
        GameState.loadSaveData(saveData);
        
        UI.showNotification('📂 Game loaded!', 'success');
        
        // Transition to city
        document.getElementById('startScreen').classList.add('hidden');
        document.getElementById('cityContainer').classList.remove('hidden');
        
        City3D.init();
        if (typeof TimeManager !== 'undefined') {
            TimeManager.init();
        }
        UI.updateStats();
        
    } catch (error) {
        console.error('Failed to load game:', error);
        UI.showNotification('❌ Failed to load game!', 'error');
    }
}

/**
 * Save game
 */
function saveGame() {
    try {
        const saveData = GameState.getSaveData();
        localStorage.setItem('lifeSkillsGameState', JSON.stringify(saveData));
        UI.showNotification('💾 Game saved!', 'success');
    } catch (error) {
        console.error('Failed to save:', error);
        UI.showNotification('❌ Failed to save game!', 'error');
    }
}

/**
 * Reset game
 */
function resetGame() {
    if (!confirm('Are you sure you want to reset your game? All progress will be lost!')) {
        return;
    }
    localStorage.removeItem('lifeSkillsGameState');
    location.reload();
}

// Auto-save every 2 minutes
setInterval(() => {
    if (GameState.player.name) {
        GameState.save = function() {
            try {
                const saveData = this.getSaveData();
                localStorage.setItem('lifeSkillsGameState', JSON.stringify(saveData));
                console.log('💾 Auto-saved');
            } catch (error) {
                console.error('Auto-save failed:', error);
            }
        };
        GameState.save();
    }
}, 120000);

// Save before page unload
window.addEventListener('beforeunload', () => {
    if (GameState.player.name && GameState.save) {
        GameState.save();
    }
});

console.log('✅ init.js loaded');
