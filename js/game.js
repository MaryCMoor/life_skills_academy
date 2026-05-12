// ==================== MAIN GAME CONTROLLER (FIXED) ====================

console.log('🎮 Loading game.js...');

// Wait for all content to load
window.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM loaded, initializing game...');
    
    try {
        // Check if core modules exist
        if (typeof GameState === 'undefined') {
            throw new Error('❌ GameState not found - state.js failed to load');
        }
        if (typeof City3D === 'undefined') {
            throw new Error('❌ City3D not found - city3d.js failed to load');
        }
        if (typeof TimeManager === 'undefined') {
            throw new Error('❌ TimeManager not found - time.js failed to load');
        }
        if (typeof UI === 'undefined') {
            throw new Error('❌ UI not found - ui.js failed to load');
        }
        
        console.log('✅ All core modules loaded');
        
        // Initialize game state
        GameState.init();
        console.log('✅ GameState initialized');
        
        // Try to load saved game
        // Try to load saved game
        const loaded = SaveLoad.loadGame();
        if (!loaded) {
            console.log('📝 No saved game, showing character creation...');
            showCharacterCreation();
            // Start auto-save even for new games
            SaveLoad.startAutoSave();
        } else {
            console.log('✅ Saved game loaded');
            // Auto-save is started in loadGame()
        }

        // Initialize 3D city
        City3D.init();
        console.log('✅ City3D initialized');
        
        // Start time system
        TimeManager.start();
        console.log('✅ TimeManager started');
        
        // Update display
        UI.updateStats();
        console.log('✅ UI updated');
        
        // Show game (hide loading)
        const topBar = document.getElementById('topBar');
        const loadingText = document.getElementById('gameTime');
        if (topBar) {
            topBar.style.display = 'flex';
            if (loadingText && loadingText.textContent === 'Loading...') {
                // TimeManager will update this
                console.log('✅ Waiting for TimeManager to update time display...');
            }
        }
        
        // Welcome message
        setTimeout(() => {
            UI.showNotification(`🎮 Welcome ${GameState.player.name}!`, 'success');
        }, 1000);
        
        console.log('🎉 Game loaded successfully!');
        
    } catch (error) {
        console.error('❌ INITIALIZATION ERROR:', error);
        alert('Game failed to initialize!\n\n' + error.message + '\n\nCheck console (F12) for details.');
        document.body.innerHTML = `
            <div style="padding: 50px; text-align: center; font-family: Arial;">
                <h1 style="color: red;">❌ Game Error</h1>
                <p style="font-size: 1.2em;">${error.message}</p>
                <button onclick="location.reload()" style="padding: 15px 30px; font-size: 1.1em;">
                    🔄 Reload
                </button>
            </div>
        `;
    }
});

// Character creation modal
function showCharacterCreation() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.style.zIndex = '10000';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 600px;">
            <h2 style="margin-top: 0;">🎮 Create Your Character</h2>
            <div style="padding: 20px;">
                <label style="display: block; margin-bottom: 10px;">
                    <strong>Name:</strong><br>
                    <input type="text" id="playerName" value="Player" style="width: 100%; padding: 10px; font-size: 1.1em;">
                </label>
                
                <label style="display: block; margin: 20px 0 10px 0;">
                    <strong>Gender:</strong><br>
                    <select id="playerGender" style="width: 100%; padding: 10px; font-size: 1.1em;">
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </label>
                
                <label style="display: block; margin: 20px 0 10px 0;">
                    <strong>Starting Age:</strong><br>
                    <select id="playerAge" style="width: 100%; padding: 10px; font-size: 1.1em;">
                        <option value="14">14 (Grade 9)</option>
                        <option value="15">15 (Grade 10)</option>
                        <option value="16">16 (Grade 11)</option>
                        <option value="17">17 (Grade 12)</option>
                    </select>
                </label>
                
                <div style="background: #e3f2fd; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <strong>📚 Note:</strong> You'll start as a high school student. 
                    Complete chores, go to school, and prepare for adulthood!
                </div>
                
                <button onclick="startGame()" style="width: 100%; padding: 15px; font-size: 1.2em; background: #3498db; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    🎮 Start Game
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

// Start game after character creation
window.startGame = function() {
    const name = document.getElementById('playerName').value.trim() || 'Player';
    const gender = document.getElementById('playerGender').value;
    const age = parseInt(document.getElementById('playerAge').value);
    
    GameState.player.name = name;
    GameState.player.gender = gender;
    GameState.player.age = age;
    GameState.player.grade = age - 5;
    
    // Remove modal
    document.querySelector('.modal-overlay').remove();
    
    // Save game
    SaveLoad.saveGame();
    
    // Show notifications
    UI.showNotification(`Welcome, ${name}! 🎉`, 'success');
    setTimeout(() => {
        UI.showNotification('Click on buildings to explore! 🏙️', 'info', 5000);
    }, 2000);
};

// Global functions for UI
window.closeLocation = function() {
    document.getElementById('locationScreen').style.display = 'none';
    document.getElementById('cityContainer').style.display = 'block';
};

window.showMenu = function() {
    UI.showModal('Menu', `
        <div style="text-align: center; padding: 20px;">
            <h3>Life Skills Academy</h3>
            <p>Version 2.0.0</p>
            <hr>
            <button class="btn btn-primary" onclick="UI.closeModal()">Close</button>
            <button class="btn btn-danger" onclick="if(confirm('Reset game?')){localStorage.clear(); location.reload();}">
                Reset Game
            </button>
        </div>
    `);
};

console.log('✅ game.js loaded');
