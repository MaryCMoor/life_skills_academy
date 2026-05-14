// ==================== GAME INITIALIZATION ====================

function startGame() {
    console.log('🎮 startGame() called');
    
    try {
        // Get player info
        const nameInput = document.getElementById('playerName');
        const ageInput = document.getElementById('playerAge');
        
        if (!nameInput || !ageInput) {
            console.error('Input elements not found');
            return;
        }
        
        const name = nameInput.value.trim();
        const age = parseInt(ageInput.value);
        
        console.log('Player Name:', name);
        console.log('Player Age:', age);
        
        if (!name) {
            alert('Please enter your name!');
            return;
        }
        
        if (isNaN(age) || age < 13 || age > 17) {
            alert('Please select a valid age!');
            return;
        }
        
        // Initialize GameState with player data
        GameState.player.name = name;
        GameState.player.age = age;
        GameState.player.cash = GameState.player.cash || 100; // Default starting cash
        
        // Set grade based on age
        const gradeMap = {
            13: 7,
            14: 8,
            15: 9,
            16: 10,
            17: 11
        };
        GameState.player.grade = gradeMap[age] || 10;
        
        console.log('✅ GameState initialized:', GameState.player);
        
        // Hide start screen
        const startScreen = document.getElementById('startScreen');
        const cityContainer = document.getElementById('cityContainer');
        
        if (startScreen) startScreen.classList.add('hidden');
        if (cityContainer) cityContainer.classList.remove('hidden');
        
        console.log('✅ Screens switched');
        
        // Start time manager
        console.log('⏰ Starting TimeManager...');
        if (typeof TimeManager !== 'undefined' && TimeManager.startDay) {
            TimeManager.startDay();
        }
        
        // Update UI
        console.log('📊 Updating stats...');
        if (typeof UI !== 'undefined' && UI.updateStats) {
            UI.updateStats();
        }
        
        // Show welcome message
        if (typeof UI !== 'undefined' && UI.showNotification) {
            UI.showNotification(`👋 Welcome, ${name}! Your life journey begins now!`, 'success', 5000);
        }
        
        // Load 3D city
        console.log('🏙️ Loading 3D city...');
        if (typeof THREE === 'undefined') {
            console.error('THREE.js not loaded, falling back to home');
            if (typeof loadHome === 'function') {
                document.getElementById('cityContainer').classList.add('hidden');
                document.getElementById('locationScreen').classList.remove('hidden');
                loadHome();
            }
        } else if (typeof loadCity3D === 'function') {
            loadCity3D();
        } else if (typeof City3D !== 'undefined' && City3D.init) {
            City3D.init();
        } else {
            console.error('City3D not available, falling back to home');
            if (typeof loadHome === 'function') {
                document.getElementById('cityContainer').classList.add('hidden');
                document.getElementById('locationScreen').classList.remove('hidden');
                loadHome();
            }
        }
        
    } catch (error) {
        console.error('Error starting game:', error);
        alert('Failed to start game. Check console for details.');
    }
}

// Auto-load saved game if available
function checkForSavedGame() {
    if (typeof SaveLoad === 'undefined') {
        console.log('SaveLoad not available');
        return false;
    }
    
    const savedData = localStorage.getItem(SaveLoad.SAVE_KEY);
    if (savedData) {
        console.log('Has saved game?', true);
        
        try {
            const data = JSON.parse(savedData);
            
            // Ensure cash property exists in old saves
            if (data.player && data.player.cash === undefined) {
                data.player.cash = 100; // Default starting cash for old saves
                console.log('⚠️ Added missing cash property to old save');
            }
            
            // Update the save with the fix
            localStorage.setItem(SaveLoad.SAVE_KEY, JSON.stringify(data));
            
            const shouldLoad = confirm('Found a saved game! Would you like to continue?');
            if (shouldLoad) {
                if (SaveLoad.loadGame()) {
                    // Ensure cash exists after loading
                    if (GameState.player.cash === undefined) {
                        GameState.player.cash = 100;
                    }
                    
                    // Hide start screen, show city
                    document.getElementById('startScreen').classList.add('hidden');
                    document.getElementById('cityContainer').classList.remove('hidden');
                    
                    // Start systems
                    if (typeof TimeManager !== 'undefined' && TimeManager.startDay) {
                        TimeManager.startDay();
                    }
                    
                    if (typeof UI !== 'undefined' && UI.updateStats) {
                        UI.updateStats();
                    }
                    
                    if (typeof UI !== 'undefined' && UI.showNotification) {
                        UI.showNotification(`👋 Welcome back, ${GameState.player.name}!`, 'success', 5000);
                    }
                    
                    // Load city
                    if (typeof loadCity3D === 'function') {
                        loadCity3D();
                    } else if (typeof City3D !== 'undefined' && City3D.init) {
                        City3D.init();
                    }
                    
                    return true;
                }
            }
        } catch (error) {
            console.error('Error loading saved game:', error);
            alert('Failed to load saved game. Starting fresh.');
            localStorage.removeItem(SaveLoad.SAVE_KEY);
        }
    }
    
    return false;
}

// Game initialization when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎮 Life Skills Academy initializing...');
    console.log('Current URL:', window.location.href);
    
    // Check if all dependencies are loaded
    console.log('Script load status:');
    console.log('  - Utils:', typeof Utils !== 'undefined');
    console.log('  - UI:', typeof UI !== 'undefined');
    console.log('  - GameState:', typeof GameState !== 'undefined');
    console.log('  - TimeManager:', typeof TimeManager !== 'undefined');
    console.log('  - THREE.js:', typeof THREE !== 'undefined');
    console.log('  - City3D:', typeof City3D !== 'undefined');
    console.log('  - loadHome:', typeof loadHome === 'function');
    console.log('  - loadSchool:', typeof loadSchool === 'function');
    
    // Ensure GameState has cash property
    if (typeof GameState !== 'undefined' && GameState.player) {
        if (GameState.player.cash === undefined) {
            GameState.player.cash = 100;
            console.log('✅ Initialized default cash property');
        }
    }
    
    // Check for critical dependencies
    if (typeof Utils === 'undefined') {
        console.error('❌ Utils not loaded');
        alert('Game failed to load properly. Please refresh the page.');
        return;
    }
    
    if (typeof UI === 'undefined') {
        console.error('❌ UI not loaded');
        alert('Game failed to load properly. Please refresh the page.');
        return;
    }
    
    if (typeof GameState === 'undefined') {
        console.error('❌ GameState not loaded');
        alert('Game failed to load properly. Please refresh the page.');
        return;
    }
    
    // Check for saved game
    if (!checkForSavedGame()) {
        // Show start screen
        const startScreen = document.getElementById('startScreen');
        if (startScreen) {
            startScreen.classList.remove('hidden');
        }
    }
    
    console.log('✅ Game ready!');
});

// Auto-save every 2 minutes
setInterval(function() {
    if (typeof SaveLoad !== 'undefined' && SaveLoad.saveGame && 
        typeof GameState !== 'undefined' && GameState.player && GameState.player.name) {
        SaveLoad.saveGame();
        console.log('💾 Auto-saved');
    }
}, 120000); // 2 minutes

console.log('✅ init.js loaded');
