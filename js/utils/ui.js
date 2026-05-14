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
        // FIXED: Update to match HTML element IDs
        const moneyEl = document.getElementById('statMoney');
        const energyEl = document.getElementById('statEnergy');
        const hungerEl = document.getElementById('statHunger');
        const healthEl = document.getElementById('statHealth');
        const happinessEl = document.getElementById('statHappiness');
        const stressEl = document.getElementById('statStress');
        const timeEl = document.getElementById('statTime');
        const dayEl = document.getElementById('statDay');
        
        // Update values
        if (moneyEl) moneyEl.textContent = Utils.formatMoney(GameState.player.cash);
        if (energyEl) energyEl.textContent = Math.round(GameState.needs.energy);
        if (hungerEl) hungerEl.textContent = Math.round(GameState.needs.hunger);
        if (healthEl) healthEl.textContent = Math.round(GameState.needs.health);
        if (happinessEl) happinessEl.textContent = Math.round(GameState.needs.happiness);
        if (stressEl) stressEl.textContent = Math.round(GameState.needs.stress);
        
        // Update progress bars
        this.updateProgressBar('barEnergy', GameState.needs.energy);
        this.updateProgressBar('barHunger', GameState.needs.hunger);
        this.updateProgressBar('barHealth', GameState.needs.health);
        this.updateProgressBar('barHappiness', GameState.needs.happiness);
        this.updateProgressBar('barStress', GameState.needs.stress, true); // inverted for stress
        
        // Update date/time
        const { day, month, year, hour, minute, dayOfWeek } = GameState.time;
        const dayName = Utils.getDayOfWeek(dayOfWeek);
        
        if (timeEl) timeEl.textContent = Utils.formatTime(hour, minute);
        if (dayEl) dayEl.textContent = dayName;
        
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
    
    updateProgressBar(barId, value, inverted = false) {
        const bar = document.getElementById(barId);
        if (!bar) return;
        
        const percentage = Math.max(0, Math.min(100, value));
        bar.style.width = percentage + '%';
        
        // Update color based on value
        bar.classList.remove('high', 'medium', 'low');
        
        if (inverted) {
            // For stress - high is bad
            if (percentage >= 70) {
                bar.classList.add('low');
            } else if (percentage >= 40) {
                bar.classList.add('medium');
            } else {
                bar.classList.add('high');
            }
        } else {
            // For other stats - high is good
            if (percentage >= 70) {
                bar.classList.add('high');
            } else if (percentage >= 40) {
                bar.classList.add('medium');
            } else {
                bar.classList.add('low');
            }
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
    
    close
