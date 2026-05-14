// ==================== INITIALIZATION ====================

function startGame() {
    const nameInput = document.getElementById('playerName');
    const ageSelect = document.getElementById('playerAge');
    
    // FIXED: Add null checks
    if (!nameInput || !ageSelect) {
        console.error('Form elements not found');
        return;
    }
    
    const playerName = nameInput.value.trim();
    const playerAge = parseInt(ageSelect.value);
    
    // FIXED: Add validation
    if (!playerName) {
        UI.showNotification('❌ Please enter your name!', 'error');
        nameInput.focus();
        return;
    }
    
    // Initialize game state
    GameState.player.name = playerName;
    GameState.player.age = playerAge;
    GameState.player.grade = playerAge <= 10 ? 'Elementary' : 
                             playerAge <= 13 ? 'Middle School' : 
                             'High School';
    
    // Hide start screen
    document.getElementById('startScreen').style.display = 'none';
    
    // Show main game
    document.getElementById('gameContainer').style.display = 'flex';
    
    // Load city view
    loadCity3D();
    
    // Start time manager
    TimeManager.start();
    
    // Update UI
    UI.updateStats();
    
    UI.showNotification(`🎮 Welcome to Life Skills Academy, ${playerName}!`, 'success', 5000);
    
    console.log('🎮 Game started!', GameState.player);
}

function loadGame() {
    if (typeof SaveLoad !== 'undefined' && SaveLoad.loadGame) {
        SaveLoad.loadGame();
    } else {
        console.error('SaveLoad not available');
        UI.showNotification('❌ Unable to load game', 'error');
    }
}

function saveGame() {
    if (typeof SaveLoad !== 'undefined' && SaveLoad.saveGame) {
        SaveLoad.saveGame();
        UI.showNotification('💾 Game saved!', 'success');
    } else {
        console.error('SaveLoad not available');
        UI.showNotification('❌ Unable to save game', 'error');
    }
}

function quitGame() {
    const confirmed = confirm('Are you sure you want to quit? Make sure to save your progress!');
    if (confirmed) {
        location.reload();
    }
}

// FIXED: Improved initialization order
window.addEventListener('DOMContentLoaded', () => {
    console.log('🎮 Life Skills Academy initializing...');
    
    // Verify Utils loaded
    if (typeof Utils === 'undefined') {
        console.error('❌ Utils not loaded!');
        return;
    }
    
    // Check for saved game
    const hasSavedGame = localStorage.getItem('lifeSkillsGameState');
    
    if (hasSavedGame) {
        const startScreen = document.getElementById('startScreen');
        if (!startScreen) return;
        
        const welcomeBox = startScreen.querySelector('.welcome-box');
        if (!welcomeBox) return;
        
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

// Handle window before unload
window.addEventListener('beforeunload', (e) => {
    if (GameState && GameState.player && GameState.player.name) {
        e.preventDefault();
        e.returnValue = 'You have unsaved progress. Are you sure you want to leave?';
        return e.returnValue;
    }
});

console.log('✅ init.js loaded');
