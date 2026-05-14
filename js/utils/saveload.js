// ==================== SAVE/LOAD SYSTEM ====================

const SaveLoad = {
    SAVE_KEY: 'lifeSkillsGameState',
    
    saveGame() {
        try {
            const saveData = {
                player: GameState.player,
                needs: GameState.needs,
                skills: GameState.skills,
                time: GameState.time,
                daily: GameState.daily,
                school: GameState.school,
                work: GameState.work,
                finance: GameState.finance,
                housing: GameState.housing,
                fridge: GameState.fridge,
                stats: GameState.stats,
                achievements: GameState.achievements,
                inventory: GameState.inventory,
                version: '1.0',
                savedAt: new Date().toISOString()
            };
            
            localStorage.setItem(this.SAVE_KEY, JSON.stringify(saveData));
            console.log('💾 Game saved successfully');
            return true;
        } catch (error) {
            console.error('Failed to save game:', error);
            return false;
        }
    },
    
    loadGame() {
        try {
            const savedData = localStorage.getItem(this.SAVE_KEY);
            if (!savedData) {
                console.log('No save data found');
                return false;
            }
            
            const saveData = JSON.parse(savedData);
            
            // Restore game state
            Object.assign(GameState.player, saveData.player);
            Object.assign(GameState.needs, saveData.needs);
            Object.assign(GameState.skills, saveData.skills);
            Object.assign(GameState.time, saveData.time);
            Object.assign(GameState.daily, saveData.daily);
            Object.assign(GameState.school, saveData.school);
            Object.assign(GameState.work, saveData.work);
            Object.assign(GameState.finance, saveData.finance);
            Object.assign(GameState.housing, saveData.housing);
            GameState.fridge = saveData.fridge || [];
            Object.assign(GameState.stats, saveData.stats);
            GameState.achievements = saveData.achievements || [];
            GameState.inventory = saveData.inventory || [];
            
            console.log('📂 Game loaded successfully');
            return true;
        } catch (error) {
            console.error('Failed to load game:', error);
            return false;
        }
    },
    
    deleteSave() {
        try {
            localStorage.removeItem(this.SAVE_KEY);
            console.log('🗑️ Save deleted');
            return true;
        } catch (error) {
            console.error('Failed to delete save:', error);
            return false;
        }
    }
};

// Make globally available
window.SaveLoad = SaveLoad;

console.log('✅ saveload.js loaded');
