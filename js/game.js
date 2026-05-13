// ==================== GAME INITIALIZATION & CORE FUNCTIONS ====================

let currentView = '3d'; // '3d' or 'location'

function initializeGame() {
    console.log('🎮 Initializing Life Skills Academy...');
    
    // Initialize time system
    if (typeof TimeManager !== 'undefined') {
        TimeManager.start();
    }
    
    // Initialize financial systems
    if (typeof TaxSystem !== 'undefined') {
        TaxSystem.init();
    }
    
    if (typeof StockMarket !== 'undefined') {
        StockMarket.init();
    }
    
    // Initialize 3D city
    if (typeof City3D !== 'undefined') {
        City3D.init();
    }
    
    // Update UI
    if (typeof UI !== 'undefined') {
        UI.updateStats();
    }
    
    // Show welcome message
    setTimeout(() => {
        UI.showNotification('Welcome to Life Skills Academy! 🎓', 'info', 3000);
    }, 500);
    
    console.log('✅ Game initialized successfully!');
}

// Toggle between 3D city view and location detail view
function toggleView() {
    const city3dContainer = document.getElementById('city3d-container');
    const locationView = document.getElementById('locationView');
    
    if (currentView === '3d') {
        // Switch to location view
        city3dContainer.style.display = 'none';
        locationView.style.display = 'block';
        currentView = 'location';
        
        if (typeof City3D !== 'undefined') {
            City3D.pauseRendering();
        }
    } else {
        // Switch to 3D view
        city3dContainer.style.display = 'block';
        locationView.style.display = 'none';
        currentView = '3d';
        
        if (typeof City3D !== 'undefined') {
            City3D.resumeRendering();
        }
    }
}

// Load a specific location
function loadLocation(locationName) {
    GameState.status.currentLocation = locationName;
    
    // Switch to location view if not already
    if (currentView === '3d') {
        toggleView();
    }
    
    // Location loading is handled by individual location files
    // (loadHome, loadSchool, etc.)
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // ESC to toggle view
    if (e.key === 'Escape') {
        toggleView();
    }
    
    // S to save
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        if (typeof SaveSystem !== 'undefined') {
            SaveSystem.save();
        }
    }
    
    // L to load
    if (e.ctrlKey && e.key === 'l') {
        e.preventDefault();
        if (typeof SaveSystem !== 'undefined') {
            SaveSystem.load();
        }
    }
});

// Handle page unload
window.addEventListener('beforeunload', () => {
    if (typeof City3D !== 'undefined') {
        City3D.destroy();
    }
});

// Start the game when page loads
window.addEventListener('DOMContentLoaded', () => {
    initializeGame();
});

console.log('✅ game.js loaded');
