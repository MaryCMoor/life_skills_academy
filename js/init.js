// ==================== INITIALIZATION ====================

function startGame() {
    console.log('🎮 startGame() called');
    
    const nameInput = document.getElementById('playerName');
    const ageSelect = document.getElementById('playerAge');
    
    // FIXED: Add null checks
    if (!nameInput || !ageSelect) {
        console.error('❌ Form elements not found');
        alert('Error: Form elements not found. Please refresh the page.');
        return;
    }
    
    const playerName = nameInput.value.trim();
    const playerAge = parseInt(ageSelect.value);
    
    console.log('Player Name:', playerName);
    console.log('Player Age:', playerAge);
    
    // FIXED: Add validation
    if (!playerName) {
        if (typeof UI !== 'undefined') {
            UI.showNotification('❌ Please enter your name!', 'error');
        } else {
            alert('Please enter your name!');
        }
        nameInput.focus();
        return;
    }
    
    // Check if GameState exists
    if (typeof GameState === 'undefined') {
        console.error('❌ GameState not loaded!');
        alert('Error: Game not loaded properly. Please refresh the page.');
        return;
    }
    
    // Initialize game state
    GameState.player.name = playerName;
    GameState.player.age = playerAge;
    GameState.player.grade = playerAge <= 10 ? 'Elementary' : 
                             playerAge <= 13 ? 'Middle School' : 
                             'High School';
    
    console.log('✅ GameState initialized:', GameState.player);
    
    // Hide start screen
    const startScreen = document.getElementById('startScreen');
    const gameContainer = document.getElementById('gameContainer');
    
    if (!startScreen || !gameContainer) {
        console.error('❌ Screen elements not found');
        alert('Error: Game screens not found. Please refresh the page.');
        return;
    }
    
    startScreen.style.display = 'none';
    gameContainer.style.display = 'flex';
    
    console.log('✅ Screens switched');
    
    // Start time manager
    if (typeof TimeManager !== 'undefined' && typeof TimeManager.start === 'function') {
        console.log('⏰ Starting TimeManager...');
        TimeManager.start();
    } else {
        console.warn('⚠️ TimeManager not available');
    }
    
    // Update UI
    if (typeof UI !== 'undefined' && typeof UI.updateStats === 'function') {
        console.log('📊 Updating stats...');
        UI.updateStats();
    } else {
        console.warn('⚠️ UI.updateStats not available');
    }
    
    // Try to load city 3D
    console.log('🏙️ Attempting to load city...');
    console.log('THREE available?', typeof THREE !== 'undefined');
    console.log('loadCity3D available?', typeof loadCity3D !== 'undefined');
    console.log('City3D available?', typeof City3D !== 'undefined');
    
    try {
        if (typeof THREE === 'undefined') {
            throw new Error('Three.js not loaded');
        }
        
        if (typeof loadCity3D === 'function') {
            console.log('✅ Calling loadCity3D()');
            loadCity3D();
        } else if (typeof City3D !== 'undefined' && typeof City3D.init === 'function') {
            console.log('✅ Calling City3D.init()');
            City3D.init();
        } else {
            throw new Error('City3D functions not available');
        }
    } catch (error) {
        console.error('❌ Error loading city:', error);
        console.log('📱 Loading fallback (Home)...');
        
        // Fallback to home screen if 3D doesn't work
        if (typeof loadHome === 'function') {
            document.getElementById('cityContainer').classList.add('hidden');
            document.getElementById('locationScreen').classList.remove('hidden');
            loadHome();
        } else {
            alert('Error loading game. Please check console and refresh the page.');
        }
    }
    
    // Show welcome message
    if (typeof UI !== 'undefined') {
        UI.showNotification(`🎮 Welcome to Life Skills Academy, ${playerName}!`, 'success', 5000);
    }
    
    console.log('🎮 Game started!');
}

function loadGame() {
    console.log('📂 loadGame() called');
    
    if (typeof SaveLoad !== 'undefined' && SaveLoad.loadGame) {
        const success = SaveLoad.loadGame();
        if (success) {
            console.log('✅ Save loaded successfully');
            
            // Game loaded, now show the game
            document.getElementById('startScreen').style.display = 'none';
            document.getElementById('gameContainer').style.display = 'flex';
            
            // Load city view
            try {
                if (typeof loadCity3D === 'function') {
                    loadCity3D();
                } else if (typeof City3D !== 'undefined' && typeof City3D.init === 'function') {
                    City3D.init();
                } else {
                    // Fallback to home
                    document.getElementById('cityContainer').classList.add('hidden');
                    document.getElementById('locationScreen').classList.remove('hidden');
                    loadHome();
                }
            } catch (error) {
                console.error('Error loading city:', error);
                document.getElementById('cityContainer').classList.add('hidden');
                document.getElementById('locationScreen').classList.remove('hidden');
                loadHome();
            }
            
            // Start time manager if not already running
            if (typeof TimeManager !== 'undefined' && typeof TimeManager.start === 'function') {
                TimeManager.start();
            }
            
            if (typeof UI !== 'undefined') {
                UI.updateStats();
            }
        } else {
            console.error('❌ Failed to load save');
        }
    } else {
        console.error('SaveLoad not available');
        if (typeof UI !== 'undefined') {
            UI.showNotification('❌ Unable to load game', 'error');
        }
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
    console.log('Current URL:', window.location.href);
    
    // Check if all scripts loaded
    console.log('Script load status:');
    console.log('  - Utils:', typeof Utils !== 'undefined');
    console.log('  - UI:', typeof UI !== 'undefined');
    console.log('  - GameState:', typeof GameState !== 'undefined');
    console.log('  - TimeManager:', typeof TimeManager !== 'undefined');
    console.log('  - THREE.js:', typeof THREE !== 'undefined');
    console.log('  - City3D:', typeof City3D !== 'undefined');
    console.log('  - loadHome:', typeof loadHome !== 'undefined');
    console.log('  - loadSchool:', typeof loadSchool !== 'undefined');
    
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
        alert('Game failed to load properly. Missing: ' + missingModules.join(', ') + '\n\nPlease refresh the page.');
        return;
    }
    
    // Check for saved game
    const hasSavedGame = localStorage.getItem('lifeSkillsGameState');
    console.log('Has saved game?', !!hasSavedGame);
    
    if (hasSavedGame) {
        const startScreen = document.getElementById('startScreen');
        if (!startScreen) {
            console.error('❌ Start screen not found');
            return;
        }
        
        const welcomeBox = startScreen.querySelector('.welcome-box');
        if (!welcomeBox) {
            console.error('❌ Welcome box not found');
            return;
        }
        
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
