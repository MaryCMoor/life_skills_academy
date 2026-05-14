// ==================== UTILITY FUNCTIONS ====================
const Utils = {
    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    },
    
    formatMoney(amount) {
        return `$${amount.toFixed(2)}`;
    },
    
    formatTime(hour, minute) {
        return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    },
    
    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    
    clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }
};

// ==================== UI MANAGER ====================
const UI = {
    updateStats() {
        if (!GameState) return;
        
        // Time
        const timeEl = document.getElementById('statTime');
        if (timeEl) {
            timeEl.textContent = Utils.formatTime(GameState.time.hour, GameState.time.minute);
        }
        
        // Day
        const dayEl = document.getElementById('statDay');
        if (dayEl) {
            const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            dayEl.textContent = `${days[GameState.time.day]} ${GameState.time.month}/${GameState.time.date}`;
        }
        
        // Money
        const moneyEl = document.getElementById('statMoney');
        if (moneyEl) {
            moneyEl.textContent = Utils.formatMoney(GameState.money.cash);
        }
        
        // Energy
        this.updateStatBar('Energy', GameState.needs.energy);
        
        // Hunger
        this.updateStatBar('Hunger', GameState.needs.hunger);
        
        // Health
        this.updateStatBar('Health', GameState.needs.health);
        
        // Happiness
        this.updateStatBar('Happiness', GameState.needs.happiness);
        
        // Stress
        this.updateStatBar('Stress', GameState.needs.stress);
    },
    
    updateStatBar(statName, value) {
        const statEl = document.getElementById('stat' + statName);
        const barEl = document.getElementById('bar' + statName);
        
        if (statEl) {
            statEl.textContent = Math.round(value);
        }
        
        if (barEl) {
            barEl.style.width = value + '%';
            
            // Color coding
            barEl.classList.remove('high', 'medium', 'low');
            if (statName === 'Stress') {
                // Stress: higher is worse
                if (value >= 70) barEl.classList.add('low');
                else if (value >= 40) barEl.classList.add('medium');
                else barEl.classList.add('high');
            } else {
                // Other stats: higher is better
                if (value >= 70) barEl.classList.add('high');
                else if (value >= 40) barEl.classList.add('medium');
                else barEl.classList.add('low');
            }
        }
    },
    
    showNotification(message, type = 'info', duration = 3000) {
        const container = document.getElementById('notificationContainer');
        if (!container) return;
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        container.appendChild(notification);
        
        // Trigger animation
        setTimeout(() => notification.classList.add('show'), 10);
        
        // Auto-remove
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, duration);
    },
    
    showModal(title, content) {
        const modal = document.getElementById('modalContainer');
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');
        
        if (!modal || !modalTitle || !modalBody) return;
        
        modalTitle.textContent = title;
        modalBody.innerHTML = content;
        modal.classList.remove('hidden');
    },
    
    closeModal() {
        const modal = document.getElementById('modalContainer');
        if (modal) {
            modal.classList.add('hidden');
        }
    },
    
    showLocation(locationName, contentHTML) {
        const cityContainer = document.getElementById('cityContainer');
        const locationScreen = document.getElementById('locationScreen');
        const locationTitle = document.getElementById('locationTitle');
        const locationContent = document.getElementById('locationContent');
        
        if (!cityContainer || !locationScreen || !locationTitle || !locationContent) return;
        
        cityContainer.classList.add('hidden');
        locationScreen.classList.remove('hidden');
        locationTitle.textContent = locationName;
        locationContent.innerHTML = contentHTML;
        
        GameState.status.currentLocation = locationName.toLowerCase();
    },
    
    updateActivityDisplay(activityName, timeRemaining) {
        const activityDiv = document.getElementById('currentActivity');
        const activityNameEl = document.getElementById('activityName');
        const activityTimeEl = document.getElementById('activityTime');
        
        if (!activityDiv || !activityNameEl || !activityTimeEl) return;
        
        if (activityName && timeRemaining) {
            activityDiv.style.display = 'flex';
            activityNameEl.textContent = activityName;
            activityTimeEl.textContent = timeRemaining;
        } else {
            activityDiv.style.display = 'none';
        }
    },
    
    clearActivityDisplay() {
        this.updateActivityDisplay(null, null);
    }
};

console.log('✅ ui.js loaded');
