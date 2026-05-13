// ==================== CHORE MINIGAMES ====================
// All household chores with interactive minigames

const ChoreMinigames = {
    currentChore: null,
    
    // Start a chore minigame
    start(choreType) {
        this.currentChore = choreType;
        
        switch(choreType) {
            case 'bed':
                this.bedGame();
                break;
            case 'dishes':
                this.dishesGame();
                break;
            case 'vacuum':
                this.vacuumGame();
                break;
            case 'trash':
                this.trashGame();
                break;
            case 'laundry':
                this.laundryGame();
                break;
            default:
                console.error('Unknown chore type:', choreType);
        }
    },
    
    // Complete chore and give rewards
    complete(choreType) {
        const chores = {
            bed: { name: 'Making the Bed', duration: 2, reward: 5, energy: -2 },
            dishes: { name: 'Washing Dishes', duration: 5, reward: 10, energy: -5 },
            vacuum: { name: 'Vacuuming', duration: 10, reward: 15, energy: -10 },
            trash: { name: 'Taking Out Trash', duration: 2, reward: 5, energy: -3 },
            laundry: { name: 'Doing Laundry', duration: 15, reward: 20, energy: -15 }
        };
        
        const chore = chores[choreType];
        if (!chore) return;
        
        // Advance time by chore duration
        if (typeof TimeManager !== 'undefined' && TimeManager.advanceTime) {
            TimeManager.advanceTime(chore.duration);
        }
        
        // Give rewards - FIXED
        GameState.money.cash += chore.reward;
        GameState.updateNeeds({ 
            energy: chore.energy, 
            hygiene: 5, 
            happiness: 10 
        });
        
        // Record chore completion
        GameState.completeChore(choreType);
        if (!GameState.stats.choresCompleted) GameState.stats.choresCompleted = 0;
        GameState.stats.choresCompleted++;
        
        // Show success message
        UI.showNotification(
            `✅ ${chore.name} complete! +$${chore.reward}, +10 Happiness`,
            'success'
        );
        
        // Achievement check
        if (GameState.stats.choresCompleted >= 10) {
            GameState.addAchievement('Clean Freak', 'Complete 10 chores', '🧹');
        }
        
        this.close();
    },
    
    // Close minigame
    close() {
        const overlay = document.querySelector('.minigame-overlay');
        if (overlay) {
            overlay.remove();
        }
        this.currentChore = null;
    },
    
    // ==================== BED MAKING GAME (ENHANCED VISIBILITY) ====================
    bedGame() {
        const overlay = document.createElement('div');
        overlay.className = 'minigame-overlay active';
        overlay.id = 'bedGame';
        
        let html = `
            <div class="minigame-container">
                <div class="minigame-header">
                    <div class="minigame-title">🛏️ Make the Bed</div>
                    <div class="minigame-subtitle">Drag items onto the bed in order: Sheet → Blanket → Pillow</div>
                </div>
                
                <div style="margin: 30px 0;">
                    <div style="text-align: center; margin-bottom: 25px;">
                        <h2 style="color: #2c3e50; margin-bottom: 10px;">📦 Drag These Items (In Order):</h2>
                    </div>
                    
                    <div id="bedItems" style="
                        display: flex;
                        justify-content: center;
                        gap: 40px;
                        flex-wrap: wrap;
                        margin-bottom: 40px;
                        padding: 30px;
                        background: rgba(255, 255, 255, 0.8);
                        border-radius: 20px;
                        border: 3px dashed #3498db;
                        min-height: 160px;
                    ">
