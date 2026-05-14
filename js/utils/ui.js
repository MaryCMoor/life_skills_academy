// ==================== UI UTILITIES ====================

const Utils = {
    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return String(text).replace(/[&<>"']/g, m => map[m]);
    },
    
    formatMoney(amount) {
        return '$' + amount.toFixed(2);
    },
    
    formatTime(hour, minute) {
        const period = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        const displayMinute = minute.toString().padStart(2, '0');
        return `${displayHour}:${displayMinute} ${period}`;
    },
    
    formatDate(day, month, year) {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${monthNames[month]} ${day}, ${year}`;
    },
    
    getDayOfWeek(day) {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[day % 7];
    }
};

const UI = {
    notificationQueue: [],
    isShowingNotification: false,
    
    showNotification(message, type = 'info', duration = 3000) {
        this.notificationQueue.push({ message, type, duration });
        
        if (!this.isShowingNotification) {
            this.processNotificationQueue();
        }
    },
    
    processNotificationQueue() {
        if (this.notificationQueue.length === 0) {
            this.isShowingNotification = false;
            return;
        }
        
        this.isShowingNotification = true;
        const { message, type, duration } = this.notificationQueue.shift();
        
        // Remove any existing notification
        const existing = document.getElementById('notification');
        if (existing) {
            existing.remove();
        }
        
        const notification = document.createElement('div');
        notification.id = 'notification';
        notification.className = `notification notification-${type}`;
        notification.innerHTML = message;
        
        document.body.appendChild(notification);
        
        // Trigger animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Hide and remove
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
                this.processNotificationQueue();
            }, 300);
        }, duration);
    },
    
    updateStats() {
        // Update top bar stats
        document.getElementById('statCash').textContent = Utils.formatMoney(GameState.player.cash);
        document.getElementById('statEnergy').textContent = Math.round(GameState.needs.energy);
        document.getElementById('statHunger').textContent = Math.round(GameState.needs.hunger);
        document.getElementById('statHappiness').textContent = Math.round(GameState.needs.happiness);
        document.getElementById('statStress').textContent = Math.round(GameState.needs.stress);
        
        // Update date/time
        const { day, month, year, hour, minute } = GameState.time;
        const dayOfWeek = Utils.getDayOfWeek(GameState.time.dayOfWeek);
        
        document.getElementById('gameDate').textContent = `${dayOfWeek}, ${Utils.formatDate(day, month, year)}`;
        document.getElementById('gameTime').textContent = Utils.formatTime(hour, minute);
        
        // Check critical needs
        if (GameState.needs.energy <= 10) {
            this.showNotification('⚠️ You\'re exhausted! Rest soon!', 'warning', 5000);
        }
        
        if (GameState.needs.hunger <= 10) {
            this.showNotification('⚠️ You\'re starving! Eat something!', 'warning', 5000);
        }
        
        if (GameState.needs.stress >= 90) {
            this.showNotification('😰 Your stress is critical! Sleep or relax!', 'error', 5000);
        }
        
        if (GameState.needs.happiness <= 10) {
            this.showNotification('😢 You\'re very unhappy. Do something fun!', 'warning', 5000);
        }
    },
    
    showModal(title, content, buttons = []) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        
        let buttonsHtml = '';
        if (buttons.length === 0) {
            buttonsHtml = '<button class="btn btn-primary" onclick="this.closest(\'.modal-overlay\').remove()">OK</button>';
        } else {
            buttonsHtml = buttons.map(btn => {
                return `<button class="btn ${btn.class || 'btn-primary'}" onclick="${btn.onclick}">${btn.text}</button>`;
            }).join('');
        }
        
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${title}</h2>
                    <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">✖</button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
                <div class="modal-footer">
                    ${buttonsHtml}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        return modal;
    },
    
    closeModal() {
        const modal = document.querySelector('.modal-overlay');
        if (modal) {
            modal.remove();
        }
    },
    
    showAchievement(achievement) {
        const achievementEl = document.createElement('div');
        achievementEl.className = 'achievement-popup';
        achievementEl.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-text">
                <div class="achievement-title">Achievement Unlocked!</div>
                <div class="achievement-name">${achievement.name}</div>
                <div class="achievement-description">${achievement.description}</div>
            </div>
        `;
        
        document.body.appendChild(achievementEl);
        
        setTimeout(() => {
            achievementEl.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            achievementEl.classList.remove('show');
            setTimeout(() => {
                achievementEl.remove();
            }, 500);
        }, 5000);
    }
};

// FIXED: Make globally available
window.Utils = Utils;
window.UI = UI;

console.log('✅ ui.js loaded');
