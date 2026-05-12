// ==================== SAVE/LOAD SYSTEM ====================

const SaveSystem = {
    SAVE_KEY: 'lifeSkillsAcademy',
    AUTO_SAVE_INTERVAL: 120000, // 2 minutes
    autoSaveTimer: null,
    
    init() {
        // Start auto-save
        this.startAutoSave();
        
        // Save before closing
        window.addEventListener('beforeunload', () => {
            this.save();
        });
        
        console.log('✓ Save system initialized');
    },
    
    startAutoSave() {
        this.autoSaveTimer = setInterval(() => {
            if (!GameState.time.paused) {
                this.save(true); // Silent save
            }
        }, this.AUTO_SAVE_INTERVAL);
    },
    
    stopAutoSave() {
        if (this.autoSaveTimer) {
            clearInterval(this.autoSaveTimer);
            this.autoSaveTimer = null;
        }
    },
    
    save(silent = false) {
        try {
            const saveData = {
                version: '1.0.0',
                timestamp: new Date().toISOString(),
                state: {
                    player: GameState.player,
                    time: GameState.time,
                    money: GameState.money,
                    school: GameState.school,
                    work: GameState.work,
                    skills: GameState.skills,
                    daily: GameState.daily,
                    adult: GameState.adult,
                    tutorials: GameState.tutorials,
                    inventory: GameState.inventory,
                    achievements: GameState.achievements,
                    stats: GameState.stats
                }
            };
            
            localStorage.setItem(this.SAVE_KEY, JSON.stringify(saveData));
            
            if (!silent) {
                console.log('✓ Game saved');
                UI.showNotification('Game saved!', 'success', 2000);
            }
            
            return true;
        } catch (e) {
            console.error('Save failed:', e);
            UI.showNotification('Failed to save game!', 'error');
            return false;
        }
    },
    
    load() {
        try {
            const saved = localStorage.getItem(this.SAVE_KEY);
            
            if (!saved) {
                console.log('No save data found');
                return false;
            }
            
            const saveData = JSON.parse(saved);
            
            // Version check
            if (saveData.version !== '1.0.0') {
                console.warn('Save version mismatch');
            }
            
            // Restore state
            Object.assign(GameState.player, saveData.state.player);
            Object.assign(GameState.time, saveData.state.time);
            Object.assign(GameState.money, saveData.state.money);
            Object.assign(GameState.school, saveData.state.school);
            Object.assign(GameState.work, saveData.state.work);
            Object.assign(GameState.skills, saveData.state.skills);
            Object.assign(GameState.daily, saveData.state.daily);
            Object.assign(GameState.adult, saveData.state.adult);
            Object.assign(GameState.tutorials, saveData.state.tutorials);
            GameState.inventory = saveData.state.inventory || [];
            GameState.achievements = saveData.state.achievements || [];
            Object.assign(GameState.stats, saveData.state.stats);
            
            console.log('✓ Game loaded from:', saveData.timestamp);
            UI.showNotification('Game loaded!', 'success');
            
            return true;
            
        } catch (e) {
            console.error('Load failed:', e);
            UI.showNotification('Failed to load game!', 'error');
            return false;
        }
    },
    
    getSaveInfo() {
        try {
            const saved = localStorage.getItem(this.SAVE_KEY);
            if (!saved) return null;
            
            const saveData = JSON.parse(saved);
            return {
                playerName: saveData.state.player.name,
                age: saveData.state.player.age,
                grade: saveData.state.player.grade,
                money: saveData.state.money.cash + saveData.state.money.bank,
                timestamp: new Date(saveData.timestamp),
                daysPlayed: saveData.state.stats.daysPlayed
            };
        } catch (e) {
            console.error('Failed to get save info:', e);
            return null;
        }
    },
    
    hasSaveData() {
        return localStorage.getItem(this.SAVE_KEY) !== null;
    },
    
    deleteSave() {
        if (UI.confirm('Are you sure you want to delete your save? This cannot be undone!')) {
            localStorage.removeItem(this.SAVE_KEY);
            console.log('✓ Save deleted');
            UI.showNotification('Save deleted', 'info');
            return true;
        }
        return false;
    },
    
    exportSave() {
        try {
            const saveData = localStorage.getItem(this.SAVE_KEY);
            if (!saveData) {
                UI.showNotification('No save data to export!', 'error');
                return;
            }
            
            // Create download
            const blob = new Blob([saveData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `life-skills-save-${Date.now()}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            UI.showNotification('Save exported!', 'success');
        } catch (e) {
            console.error('Export failed:', e);
            UI.showNotification('Failed to export save!', 'error');
        }
    },
    
    importSave(file) {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            try {
                const saveData = JSON.parse(e.target.result);
                
                // Validate save data
                if (!saveData.version || !saveData.state) {
                    throw new Error('Invalid save file');
                }
                
                localStorage.setItem(this.SAVE_KEY, e.target.result);
                UI.showNotification('Save imported! Reloading...', 'success');
                
                setTimeout(() => {
                    location.reload();
                }, 1500);
                
            } catch (error) {
                console.error('Import failed:', error);
                UI.showNotification('Invalid save file!', 'error');
            }
        };
        
        reader.readAsText(file);
    }
};
