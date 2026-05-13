// ==================== SAVE/LOAD SYSTEM ====================

const SaveSystem = {
    SAVE_KEY: 'lifeSkillsAcademy_v2',
    AUTO_SAVE_INTERVAL: 120000, // 2 minutes
    autoSaveTimer: null,
    lastSaveTime: null,
    
    init() {
        console.log('💾 Initializing save system...');
        
        try {
            // Test localStorage availability
            if (!this.isLocalStorageAvailable()) {
                console.warn('localStorage not available');
                UI.showNotification('Auto-save disabled: localStorage not available', 'warning');
                return false;
            }
            
            // Start auto-save
            this.startAutoSave();
            
            // Save before closing
            window.addEventListener('beforeunload', (e) => {
                this.save(true);
            });
            
            console.log('✓ Save system initialized');
            return true;
            
        } catch (error) {
            console.error('Failed to initialize save system:', error);
            return false;
        }
    },
    
    isLocalStorageAvailable() {
        try {
            const test = '__localStorage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    },
    
    startAutoSave() {
        this.stopAutoSave(); // Clear any existing timer
        
        this.autoSaveTimer = setInterval(() => {
            if (!GameState.time.paused) {
                this.save(true); // Silent save
            }
        }, this.AUTO_SAVE_INTERVAL);
        
        console.log('✓ Auto-save enabled (every 2 minutes)');
    },
    
    stopAutoSave() {
        if (this.autoSaveTimer) {
            clearInterval(this.autoSaveTimer);
            this.autoSaveTimer = null;
        }
    },
    
    save(silent = false) {
        try {
            if (!this.isLocalStorageAvailable()) {
                if (!silent) {
                    UI.showNotification('Cannot save: localStorage unavailable', 'error');
                }
                return false;
            }
            
            const saveData = {
                version: '2.0.0',
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
                    inventory: GameState.inventory,
                    tutorials: GameState.tutorials,
                    achievements: GameState.achievements,
                    stats: GameState.stats
                }
            };
            
            const jsonString = JSON.stringify(saveData);
            
            // Check size (localStorage typically has 5-10MB limit)
            const sizeInBytes = new Blob([jsonString]).size;
            const sizeInKB = (sizeInBytes / 1024).toFixed(2);
            
            if (sizeInBytes > 5000000) { // 5MB warning
                console.warn(`Save data is large: ${sizeInKB}KB`);
            }
            
            localStorage.setItem(this.SAVE_KEY, jsonString);
            this.lastSaveTime = new Date();
            
            if (!silent) {
                console.log(`💾 Game saved (${sizeInKB}KB)`);
                UI.showNotification('Game saved!', 'success', 2000);
            }
            
            return true;
            
        } catch (e) {
            console.error('Save failed:', e);
            
            if (e.name === 'QuotaExceededError') {
                UI.showNotification('Save failed: Storage quota exceeded', 'error');
            } else {
                UI.showNotification('Failed to save game!', 'error');
            }
            
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
            if (!saveData.version) {
                console.warn('Save data has no version');
                if (!confirm('Save data format is old. Loading may cause issues. Continue?')) {
                    return false;
                }
            }
            
            // Validate save data structure
            if (!saveData.state || !saveData.state.player) {
                throw new Error('Invalid save data structure');
            }
            
            // Restore state with fallbacks
            this.restoreState(saveData.state);
            
            console.log('✓ Game loaded from:', saveData.timestamp);
            UI.showNotification('Game loaded!', 'success');
            
            return true;
            
        } catch (e) {
            console.error('Load failed:', e);
            UI.showNotification('Failed to load game! Save may be corrupted.', 'error');
            
            // Offer to delete corrupted save
            if (confirm('Save data appears corrupted. Delete it and start fresh?')) {
                this.deleteSave();
            }
            
            return false;
        }
    },
    
    restoreState(state) {
        // Helper to safely merge objects
        const safeMerge = (target, source) => {
            if (!source) return;
            Object.keys(target).forEach(key => {
                if (source.hasOwnProperty(key)) {
                    if (typeof target[key] === 'object' && !Array.isArray(target[key]) && target[key] !== null) {
                        safeMerge(target[key], source[key]);
                    } else {
                        target[key] = source[key];
                    }
                }
            });
        };
        
        // Restore each section
        safeMerge(GameState.player, state.player);
        safeMerge(GameState.time, state.time);
        safeMerge(GameState.money, state.money);
        safeMerge(GameState.school, state.school);
        safeMerge(GameState.work, state.work);
        safeMerge(GameState.skills, state.skills);
        safeMerge(GameState.daily, state.daily);
        safeMerge(GameState.adult, state.adult);
        safeMerge(GameState.stats, state.stats);
        safeMerge(GameState.tutorials, state.tutorials);
        
        // Arrays need direct assignment
        GameState.inventory = state.inventory || [];
        GameState.achievements = state.achievements || [];
        
        // Recalculate derived values
        GameState.calculateGPA();
    },
    
    getSaveInfo() {
        try {
            const saved = localStorage.getItem(this.SAVE_KEY);
            if (!saved) return null;
            
            const saveData = JSON.parse(saved);
            
            if (!saveData.state) return null;
            
            const totalMoney = (saveData.state.money?.cash || 0) + (saveData.state.money?.bank || 0);
            
            return {
                playerName: saveData.state.player?.name || 'Unknown',
                age: saveData.state.player?.age || 14,
                grade: saveData.state.player?.grade || 9,
                money: totalMoney,
                timestamp: new Date(saveData.timestamp),
                daysPlayed: saveData.state.stats?.daysPlayed || 0,
                version: saveData.version || 'unknown'
            };
            
        } catch (e) {
            console.error('Failed to get save info:', e);
            return null;
        }
    },
    
    hasSaveData() {
        try {
            const saved = localStorage.getItem(this.SAVE_KEY);
            return saved !== null && saved.length > 0;
        } catch (e) {
            return false;
        }
    },
    
    deleteSave() {
        try {
            if (!confirm('Delete save data? This cannot be undone!')) {
                return false;
            }
            
            localStorage.removeItem(this.SAVE_KEY);
            console.log('✓ Save deleted');
            UI.showNotification('Save deleted', 'info');
            
            return true;
            
        } catch (e) {
            console.error('Failed to delete save:', e);
            UI.showNotification('Failed to delete save', 'error');
            return false;
        }
    },
    
    exportSave() {
        try {
            const saveData = localStorage.getItem(this.SAVE_KEY);
            if (!saveData) {
                UI.showNotification('No save data to export!', 'error');
                return false;
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
            return true;
            
        } catch (e) {
            console.error('Export failed:', e);
            UI.showNotification('Failed to export save!', 'error');
            return false;
        }
    },
    
    importSave(file) {
        if (!file) {
            UI.showNotification('No file selected', 'error');
            return;
        }
        
        const reader = new FileReader();
        
        reader.onload = (e) => {
            try {
                const content = e.target.result;
                const saveData = JSON.parse(content);
                
                // Validate save data
                if (!saveData.version || !saveData.state || !saveData.state.player) {
                    throw new Error('Invalid save file format');
                }
                
                // Confirm overwrite
                if (this.hasSaveData()) {
                    if (!confirm('This will overwrite your current save. Continue?')) {
                        return;
                    }
                }
                
                localStorage.setItem(this.SAVE_KEY, content);
                UI.showNotification('Save imported! Reloading...', 'success');
                
                setTimeout(() => {
                    location.reload();
                }, 1500);
                
            } catch (error) {
                console.error('Import failed:', error);
                UI.showNotification('Invalid save file!', 'error');
            }
        };
        
        reader.onerror = () => {
            UI.showNotification('Failed to read file!', 'error');
        };
        
        reader.readAsText(file);
    }
};

console.log('✅ saveload.js loaded');
