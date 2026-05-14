// ==================== UI UTILITIES ====================

const UI = {
    /**
     * Update all stats in the top bar
     */
    updateStats() {
        // Time
        const hour = String(GameState.time.hour).padStart(2, '0');
        const minute = String(GameState.time.minute).padStart(2, '0');
        document.getElementById('statTime').textContent = `${hour}:${minute}`;
        
        // Day
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayName = days[GameState.time.day];
        document.getElementById('statDay').textContent = dayName;
        
        // Money
        document.getElementById('statMoney').textContent = `$${GameState.money.toFixed(2)}`;
        
        // Needs
        this.updateNeedStat('Energy', GameState.needs.energy);
        this.updateNeedStat('Hunger', GameState.needs.hunger);
        this.updateNeedStat('Health', GameState.needs.health);
        this.updateNeedStat('Happiness', GameState.needs.happiness);
        this.updateNeedStat('Stress', GameState.needs.stress);
        
        // Update current activity status
        const activityElement = document.getElementById('currentActivity');
        const activityNameElement = document.getElementById('activityName');
        const activityTimeElement = document.getElementById('activityTime');
        const activityIconElement = document.querySelector('#currentActivity .activity-icon');
        
        if (GameState.busyWith) {
            // Show activity status
            activityElement.classList.add('active');
            
            // Set activity name
            activityNameElement.textContent = GameState.busyWith;
            
            // Set icon based on activity type
            const activityIcons = {
                'homework': '📚',
                'working': '💼',
                'sleeping': '😴',
                'studying': '📖',
                'eating': '🍽️',
                'exercising': '💪',
                'cooking': '🍳',
                'chore': '🧹',
                'dishes': '🍽️',
                'laundry': '🧺',
                'vacuum': '🧹',
                'bed': '🛏️',
                'trash': '🗑️',
                'default': '⏳'
            };
            
            let icon = activityIcons.default;
            const activityLower = GameState.busyWith.toLowerCase();
            
            for (const [key, emoji] of Object.entries(activityIcons)) {
                if (activityLower.includes(key)) {
                    icon = emoji;
                    break;
                }
            }
            
            activityIconElement.textContent = icon;
            
            // Show time remaining
            if (GameState.busyUntil) {
                const minutesLeft = GameState.busyUntil;
                if (minutesLeft > 60) {
                    const hours = Math.floor(minutesLeft / 60);
                    const mins = minutesLeft % 60;
                    activityTimeElement.textContent = `Time: ${hours}h ${mins > 0 ? mins + 'm' : ''}`;
                } else {
                    activityTimeElement.textContent = `Time: ${minutesLeft} minutes`;
                }
            } else {
                activityTimeElement.textContent = '';
            }
        } else {
            // Hide activity status when not busy
            activityElement.classList.remove('active');
        }
    },
    
    /**
     * Update a single need stat with value and progress bar
     */
    updateNeedStat(name, value) {
        const roundedValue = Math.round(value);
        document.getElementById(`stat${name}`).textContent = roundedValue;
        
        const bar = document.getElementById(`bar${name}`);
        if (bar) {
            bar.style.width = `${roundedValue}%`;
            
            // Update color class based on value
            bar.classList.remove('low', 'medium', 'high');
            
            // For stress, inverted logic (low stress is good)
            if (name === 'Stress') {
                if (value > 70) {
                    bar.classList.add('low'); // Red
                } else if (value > 40) {
                    bar.classList.add('medium'); // Yellow
                } else {
                    bar.classList.add('high'); // Green
                }
            } else {
                // For other needs (higher is better)
                if (value < 30) {
                    bar.classList.add('low'); // Red
                } else if (value < 60) {
                    bar.classList.add('medium'); // Yellow
                } else {
                    bar.classList.add('high'); // Green
                }
            }
        }
    },
    
    /**
     * Show a notification message
     */
    showNotification(message, type = 'info', duration = 3000) {
        const container = document.getElementById('notificationContainer');
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        container.appendChild(notification);
        
        // Trigger animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Remove after duration
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                container.removeChild(notification);
            }, 300);
        }, duration);
    },
    
    /**
     * Show a modal dialog
     */
    showModal(title, content) {
        document.getElementById('modalTitle').textContent = title;
        document.getElementById('modalBody').innerHTML = content;
        document.getElementById('modalContainer').classList.remove('hidden');
    },
    
    /**
     * Close the modal dialog
     */
    closeModal() {
        document.getElementById('modalContainer').classList.add('hidden');
    },
    
    /**
     * Show a confirmation dialog
     */
    confirm(title, message, onConfirm, onCancel) {
        const content = `
            <p>${message}</p>
            <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px;">
                <button class="btn btn-secondary" onclick="UI.closeModal(); ${onCancel ? '(' + onCancel + ')()' : ''}">Cancel</button>
                <button class="btn btn-primary" onclick="UI.closeModal(); (${onConfirm})()">Confirm</button>
            </div>
        `;
        this.showModal(title, content);
    },
    
    /**
     * Format time as HH:MM
     */
    formatTime(hour, minute) {
        return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    },
    
    /**
     * Get day name from day number
     */
    getDayName(dayNum) {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[dayNum];
    },
    
    /**
     * Format money with dollar sign
     */
    formatMoney(amount) {
        return `$${amount.toFixed(2)}`;
    },
    
    /**
     * Get color for a need value
     */
    getNeedColor(value, inverted = false) {
        if (inverted) {
            // For stress (lower is better)
            if (value > 70) return '#e74c3c';
            if (value > 40) return '#f39c12';
            return '#27ae60';
        } else {
            // For other needs (higher is better)
            if (value < 30) return '#e74c3c';
            if (value < 60) return '#f39c12';
            return '#27ae60';
        }
    },
    
    /**
     * Create a progress bar HTML
     */
    createProgressBar(value, max = 100, label = '') {
        const percentage = (value / max) * 100;
        const color = this.getNeedColor(percentage);
        
        return `
            <div class="progress-bar-container">
                ${label ? `<div class="progress-label">${label}</div>` : ''}
                <div class="progress-bar-bg">
                    <div class="progress-bar-fill" style="width: ${percentage}%; background-color: ${color};"></div>
                </div>
                <div class="progress-value">${Math.round(value)}/${max}</div>
            </div>
        `;
    },
    
    /**
     * Show a loading indicator
     */
    showLoading(message = 'Loading...') {
        const content = `
            <div style="text-align: center; padding: 20px;">
                <div class="spinner"></div>
                <p style="margin-top: 20px;">${message}</p>
            </div>
        `;
        this.showModal('Loading', content);
    },
    
    /**
     * Hide loading indicator
     */
    hideLoading() {
        this.closeModal();
    },
    
    /**
     * Animate a number change
     */
    animateNumber(elementId, from, to, duration = 500) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        const startTime = performance.now();
        const difference = to - from;
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const current = from + (difference * progress);
            element.textContent = Math.round(current);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    },
    
    /**
     * Flash an element to draw attention
     */
    flashElement(elementId, color = '#f39c12', duration = 500) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        const originalBackground = element.style.backgroundColor;
        element.style.backgroundColor = color;
        element.style.transition = `background-color ${duration}ms`;
        
        setTimeout(() => {
            element.style.backgroundColor = originalBackground;
        }, duration);
    },
    
    /**
     * Shake an element (for errors or warnings)
     */
    shakeElement(elementId) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        element.classList.add('shake');
        setTimeout(() => {
            element.classList.remove('shake');
        }, 500);
    },
    
    /**
     * Show a tooltip
     */
    showTooltip(text, x, y) {
        let tooltip = document.getElementById('customTooltip');
        
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.id = 'customTooltip';
            tooltip.className = 'custom-tooltip';
            document.body.appendChild(tooltip);
        }
        
        tooltip.textContent = text;
        tooltip.style.left = x + 'px';
        tooltip.style.top = y + 'px';
        tooltip.classList.add('show');
    },
    
    /**
     * Hide tooltip
     */
    hideTooltip() {
        const tooltip = document.getElementById('customTooltip');
        if (tooltip) {
            tooltip.classList.remove('show');
        }
    }
};

console.log('✅ ui.js loaded');
