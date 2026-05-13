// ==================== MAIN GAME CONTROLLER ====================

let gameInitialized = false;

function startGame() {
    const nameInput = document.getElementById('nameInput');
    const genderInput = document.getElementById('genderInput');
    
    if (!nameInput || !genderInput) {
        console.error('Input elements not found');
        return;
    }
    
    const name = Utils.sanitizeInput(nameInput.value.trim(), 15);
    const gender = genderInput.value;
    
    if (!name || name.length < 2) {
        UI.showNotification('Please enter a valid name (at least 2 characters)!', 'error');
        return;
    }
    
    GameState.player.name = name;
    GameState.player.gender = gender;
    GameState.player.birthday = { month: 1, day: 1 };
    
    const onboarding = document.getElementById('onboarding');
    if (onboarding) {
        onboarding.classList.remove('active');
    }
    
    initializeGame();
}

function initializeGame() {
    if (gameInitialized) {
        console.warn('Game already initialized');
        return;
    }
    
    console.log('🎮 Initializing Life Skills Academy...');
    
    try {
        // Try to load saved game
        const hasSave = SaveSystem.hasSaveData();
        if (hasSave) {
            const saveInfo = SaveSystem.getSaveInfo();
            if (saveInfo && confirm(`Load existing save? (${saveInfo.playerName}, Age ${saveInfo.age})`)) {
                SaveSystem.load();
            }
        }
        
        // Initialize systems
        SaveSystem.init();
        City3D.init();
        TimeManager.start();
        
        // Generate daily content
        GameState.generateDailyChores();
        TimeManager.generateHomework();
        GameState.calculateGPA();
        
        // Update UI
        UI.updateStats();
        
        // Welcome message
        setTimeout(() => {
            UI.showNotification(`Welcome, ${GameState.player.name}!`, 'success', 5000);
        }, 500);
        
        // Tutorial
        if (!GameState.tutorials.shown.welcome) {
            setTimeout(() => {
                showWelcomeTutorial();
                GameState.tutorials.shown.welcome = true;
            }, 2000);
        }
        
        gameInitialized = true;
        console.log('✓ Game initialized successfully');
        
    } catch (error) {
        console.error('Failed to initialize game:', error);
        UI.showNotification('Failed to start game. Please refresh the page.', 'error');
    }
}

function showWelcomeTutorial() {
    const content = `
        <div class="info-box">
            <h3>Welcome to Life Skills Academy!</h3>
            <p><strong>Your Goal:</strong> Learn real-world skills to prepare for adulthood.</p>
            
            <h4>🏠 Click buildings to explore:</h4>
            <ul>
                <li><strong>Home:</strong> Do chores, cook meals, sleep</li>
                <li><strong>School:</strong> Attend classes, do homework</li>
                <li><strong>Bank:</strong> Manage money, open accounts</li>
                <li><strong>Store:</strong> Buy supplies</li>
                <li><strong>Job Center:</strong> Find work and earn money</li>
            </ul>
            
            <h4>⏰ Time System:</h4>
            <p>Time progresses automatically. Complete tasks before deadlines!</p>
            <ul>
                <li>School: Monday-Friday, 8:00 AM - 1:20 PM</li>
                <li>Don't be late! Tardies affect your record</li>
                <li>Complete homework to improve grades</li>
            </ul>
            
            <h4>🎂 Age Progression:</h4>
            <p>You start at age 14. When you turn 18, you'll need to:</p>
            <ul>
                <li>Pay rent if you move out</li>
                <li>Buy your own groceries</li>
                <li>Manage all bills independently</li>
            </ul>
            
            <p class="text-center mt-20"><strong>Good luck! 🌟</strong></p>
        </div>
    `;
    
    UI.showModal('🎓 How to Play', content, [
        { 
            text: 'Got it!', 
            class: 'btn-primary', 
            action: () => {} 
        }
    ]);
}

// Time control functions
function setSpeed(speed) {
    if (![1, 3, 10].includes(speed)) {
        console.error('Invalid speed:', speed);
        return;
    }
    TimeManager.setSpeed(speed);
}

function togglePause() {
    TimeManager.togglePause();
}

// Stats update interval
let statsUpdateInterval = null;

function startStatsUpdate() {
    if (statsUpdateInterval) {
        clearInterval(statsUpdateInterval);
    }
    statsUpdateInterval = setInterval(() => {
        UI.updateStats();
    }, 5000);
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Don't trigger if typing in input
    if (e.target.matches('input, textarea')) {
        return;
    }
    
    switch(e.code) {
        case 'Space':
            e.preventDefault();
            togglePause();
            break;
        case 'Digit1':
            setSpeed(1);
            break;
        case 'Digit2':
            setSpeed(3);
            break;
        case 'Digit3':
            setSpeed(10);
            break;
        case 'Escape':
            const locationScreen = document.getElementById('locationScreen');
            if (locationScreen && !locationScreen.classList.contains('hidden')) {
                backToCity();
            }
            break;
    }
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (statsUpdateInterval) {
        clearInterval(statsUpdateInterval);
    }
    if (City3D) {
        City3D.destroy();
    }
    if (TimeManager) {
        TimeManager.stop();
    }
    SaveSystem.save(true);
});

// Start stats updates when game starts
startStatsUpdate();

console.log('✅ game.js loaded');
