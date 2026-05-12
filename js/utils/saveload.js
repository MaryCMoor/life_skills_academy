// ==================== SAVE/LOAD SYSTEM ====================

const SaveLoad = {
    SAVE_KEY: 'lifeSkillsAcademy_save',
    AUTO_SAVE_INTERVAL: 120000, // 2 minutes
    autoSaveTimer: null,
    
    // Start auto-save
    startAutoSave() {
        if (this.autoSaveTimer) {
            clearInterval(this.autoSaveTimer);
        }
        
        this.autoSaveTimer = setInterval(() => {
            this.saveGame(true);
        }, this.AUTO_SAVE_INTERVAL);
        
        console.log('💾 Auto-save enabled (every 2 minutes)');
    },
    
    // Save game to localStorage
    saveGame(isAutoSave = false) {
        try {
            const saveData = {
                version: GameState.version,
                timestamp: new Date().toISOString(),
                data: {
                    player: GameState.player,
                    time: GameState.time,
                    money: GameState.money,
                    school: GameState.school,
                    work: GameState.work,
                    skills: GameState.skills,
                    daily: GameState.daily,
                    adult: GameState.adult,
                    phone: GameState.phone,
                    entertainment: GameState.entertainment,
                    currentActivity: GameState.currentActivity,
                    stats: GameState.stats,
                    achievements: GameState.achievements
                }
            };
            
            localStorage.setItem(this.SAVE_KEY, JSON.stringify(saveData));
            
            if (!isAutoSave) {
                console.log('💾 Game saved successfully');
                if (typeof UI !== 'undefined') {
                    UI.showNotification('💾 Game saved!', 'success');
                }
            } else {
                console.log('💾 Auto-save complete');
            }
            
            return true;
        } catch (error) {
            console.error('❌ Save failed:', error);
            if (typeof UI !== 'undefined') {
                UI.showNotification('❌ Save failed!', 'error');
            }
            return false;
        }
    },
    
    // Load game from localStorage
    loadGame() {
        try {
            const savedData = localStorage.getItem(this.SAVE_KEY);
            
            if (!savedData) {
                console.log('📁 No saved game found');
                return false;
            }
            
            const saveData = JSON.parse(savedData);
            
            // Check version compatibility
            if (saveData.version !== GameState.version) {
                console.warn('⚠️ Save file version mismatch. Attempting to load anyway...');
            }
            
            // Restore game state
            Object.assign(GameState.player, saveData.data.player);
            Object.assign(GameState.time, saveData.data.time);
            Object.assign(GameState.money, saveData.data.money);
            Object.assign(GameState.school, saveData.data.school);
            Object.assign(GameState.work, saveData.data.work);
            Object.assign(GameState.skills, saveData.data.skills);
            Object.assign(GameState.daily, saveData.data.daily);
            Object.assign(GameState.adult, saveData.data.adult);
            Object.assign(GameState.phone, saveData.data.phone);
            Object.assign(GameState.entertainment, saveData.data.entertainment);
            GameState.currentActivity = saveData.data.currentActivity;
            Object.assign(GameState.stats, saveData.data.stats);
            GameState.achievements = saveData.data.achievements || [];
            
            console.log(`💾 Game loaded from ${saveData.timestamp}`);
            
            if (typeof UI !== 'undefined') {
                UI.showNotification('📁 Game loaded!', 'success');
            }
            
            // Start auto-save
            this.startAutoSave();
            
            return true;
        } catch (error) {
            console.error('❌ Load failed:', error);
            if (typeof UI !== 'undefined') {
                UI.showNotification('❌ Load failed!', 'error');
            }
            return false;
        }
    },
    
    // Delete saved game
    deleteSave() {
        try {
            localStorage.removeItem(this.SAVE_KEY);
            console.log('🗑️ Save deleted');
            if (typeof UI !== 'undefined') {
                UI.showNotification('🗑️ Save deleted', 'info');
            }
            return true;
        } catch (error) {
            console.error('❌ Delete failed:', error);
            return false;
        }
    },
    
    // Check if save exists
    hasSave() {
        return localStorage.getItem(this.SAVE_KEY) !== null;
    },
    
    // Get save info
    getSaveInfo() {
        try {
            const savedData = localStorage.getItem(this.SAVE_KEY);
            if (!savedData) return null;
            
            const saveData = JSON.parse(savedData);
            return {
                version: saveData.version,
                timestamp: saveData.timestamp,
                playerName: saveData.data.player.name,
                playerAge: saveData.data.player.age,
                daysPlayed: saveData.data.stats.daysPlayed,
                money: saveData.data.money.cash
            };
        } catch (error) {
            console.error('❌ Failed to get save info:', error);
            return null;
        }
    },
    
    // Export save as JSON file
    exportSave() {
        try {
            const savedData = localStorage.getItem(this.SAVE_KEY);
            if (!savedData) {
                alert('No save data to export!');
                return;
            }
            
            const blob = new Blob([savedData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `life_skills_academy_save_${new Date().toISOString().slice(0,10)}.json`;
            a.click();
            URL.revokeObjectURL(url);
            
            console.log('📤 Save exported');
            if (typeof UI !== 'undefined') {
                UI.showNotification('📤 Save exported!', 'success');
            }
        } catch (error) {
            console.error('❌ Export failed:', error);
            alert('Export failed: ' + error.message);
        }
    },
    
    // Import save from JSON file
    importSave(fileInput) {
        const file = fileInput.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const saveData = JSON.parse(e.target.result);
                localStorage.setItem(this.SAVE_KEY, e.target.result);
                
                console.log('📥 Save imported');
                if (typeof UI !== 'undefined') {
                    UI.showNotification('📥 Save imported! Reloading...', 'success');
                }
                
                setTimeout(() => location.reload(), 1000);
            } catch (error) {
                console.error('❌ Import failed:', error);
                alert('Import failed: Invalid save file');
            }
        };
        reader.readAsText(file);
    }
};

// Make SaveLoad available globally
window.SaveLoad = SaveLoad;

console.log('✅ saveload.js loaded - SaveLoad ready');
