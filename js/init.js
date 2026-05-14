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
    
    // FIXED: Check if loadCity3D exists before calling
    if (typeof loadCity3D === 'function') {
        loadCity3D();
    } else if (typeof City3D !== 'undefined' && typeof City3D.init === 'function') {
        City3D.init();
    } else {
        console.error('City3D not available, loading home instead');
        loadHome();
    }
    
    // Start time manager
    if (typeof TimeManager !== 'undefined' && typeof TimeManager.start === 'function') {
        TimeManager.start();
    }
    
    // Update UI
    UI.updateStats();
    
    UI.showNotification(`🎮 Welcome to Life Skills Academy, ${playerName}!`, 'success', 5000);
    
    console.log('🎮 Game started!', GameState.player);
}

function loadGame() {
    if (typeof SaveLoad !== 'undefined' && SaveLoad.loadGame) {
        const success = SaveLoad.loadGame();
        if (success) {
            // Game loaded, now show the game
            document.getElementById('startScreen').style.display = 'none';
            document.getElementById('gameContainer').style.display = 'flex';
            
            // Load city view
            if (typeof loadCity3D === 'function') {
                loadCity3D();
            } else if (typeof City3D !== 'undefined' && typeof City3D.init === 'function') {
                City3D.init();
            } else {
                loadHome();
            }
            
            // Start time manager if not already running
            if (typeof TimeManager !== 'undefined' && typeof TimeManager.start === 'function') {
                TimeManager.start();
            }
            
            UI.updateStats();
        }
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
    
    // Verify required modules loaded
    const requiredModules = {
        'Utils': typeof Utils !== 'undefined',
        'UI': typeof UI !== 'undefined',
        'GameState': typeof GameState !== 'undefined',
        'TimeManager': typeof TimeManager !== 'undefined'
    };
    
    const missingModules = Object.keys(requiredModules).filter(mod => !requiredModules[mod]);
    
    if (missingModules.length > 0) {
        console.error('❌ Missing required modules:', missingModules.join(', '));
        alert('Game failed to load properly. Please refresh the page.');
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
    console.log('Available functions:', {
        loadCity3D: typeof loadCity3D,
        City3D: typeof City3D,
        loadHome: typeof loadHome
    });
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
