// ==================== MAIN GAME CONTROLLER ====================

let gameInitialized = false;

function startGame() {
    const name = document.getElementById('nameInput').value.trim();
    const gender = document.getElementById('genderInput').value;
    
    if (!name) {
        alert('Please enter your name!');
        return;
    }
    
    // Set player info
    GameState.player.name = name;
    GameState.player.gender = gender;
    
    // Hide onboarding
    document.getElementById('onboarding').classList.remove('active');
    
    // Initialize game
    initializeGame();
}

function initializeGame() {
    if (gameInitialized) return;
    
    console.log('🎮 Initializing Life Skills Academy...');
    
    // Try to load saved game
    const hasSave = SaveSystem.hasSaveData();
    if (hasSave) {
        const loadSave = confirm('Found existing save game. Load it?');
        if (loadSave) {
            SaveSystem.load();
        }
    }
    
    // Initialize systems
    SaveSystem.init();
    City3D.init();
    TimeManager.start();
    
    // Generate first day's tasks
    TimeManager.generateDailyTasks();
    
    // Calculate initial GPA
    GameState.calculateGPA();
    
    // Update UI
    UI.updateStats();
    
    // Show welcome message
    setTimeout(() => {
        UI.showNotification(`Welcome, ${GameState.player.name}! Your life journey begins.`, 'success', 5000);
    }, 500);
    
    // First time tutorial
    if (!GameState.tutorials.shown.welcome) {
        setTimeout(() => {
            showWelcomeTutorial();
            GameState.tutorials.shown.welcome = true;
        }, 2000);
    }
    
    gameInitialized = true;
    console.log('✓ Game initialized successfully');
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
            
            <p class="text-center mt-20"><strong>Good luck on your journey! 🌟</strong></p>
        </div>
    `;
    
    UI.showModal('🎓 How to Play', content, [
        { text: 'Got it!', class: 'btn-primary', action: 'closeWelcomeTutorial()' }
    ]);
}

function closeWelcomeTutorial() {
    const modals = document.querySelectorAll('.modal-overlay');
    modals.forEach(m => m.remove());
}

// Time control functions
function setSpeed(speed) {
    TimeManager.setSpeed(speed);
}

function togglePause() {
    TimeManager.togglePause();
}

// Update stats periodically
setInterval(() => {
    UI.updateStats();
}, 5000);

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Spacebar = pause
    if (e.code === 'Space' && !e.target.matches('input, textarea')) {
        e.preventDefault();
        togglePause();
    }
    
    // 1, 2, 3 = speed controls
    if (e.code === 'Digit1') setSpeed(1);
    if (e.code === 'Digit2') setSpeed(3);
    if (e.code === 'Digit3') setSpeed(10);
    
    // ESC = back to city
    if (e.code === 'Escape') {
        const locationScreen = document.getElementById('locationScreen');
        if (!locationScreen.classList.contains('hidden')) {
            backToCity();
        }
    }
});

// Debug commands (remove in production)
window.debugAddMoney = (amount) => {
    GameState.addMoney(amount, 'debug');
    UI.updateStats();
    console.log(`Added $${amount}`);
};

window.debugSetAge = (age) => {
    GameState.player.age = age;
    UI.updateStats();
    console.log(`Age set to ${age}`);
};

window.debugSkipTime = (hours) => {
    for (let i = 0; i < hours * 60; i++) {
        TimeManager.tick();
    }
    console.log(`Skipped ${hours} hours`);
};

console.log('🎮 Life Skills Academy loaded');
console.log('Debug commands: debugAddMoney(amount), debugSetAge(age), debugSkipTime(hours)');
