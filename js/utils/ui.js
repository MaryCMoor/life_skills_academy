// ==================== UI UTILITIES ====================

const UI = {
    // Notification System
    showNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 2000;
            animation: slideIn 0.3s ease-out;
            max-width: 300px;
            font-weight: 500;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, duration);
    },
    
    getNotificationColor(type) {
        const colors = {
            success: '#27ae60',
            error: '#e74c3c',
            warning: '#f39c12',
            info: '#3498db'
        };
        return colors[type] || colors.info;
    },
    
    // Update stats display
    updateStats() {
        const elements = {
            playerName: GameState.player.name,
            playerAge: GameState.player.age,
            cash: Math.floor(GameState.money.cash),
            bank: Math.floor(GameState.money.bank),
            gpa: GameState.school.gpa
        };
        
        Object.keys(elements).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                element.textContent = elements[key];
            }
        });
    },
    
    // Show modal
    showModal(title, content, buttons = []) {
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay active';
        overlay.innerHTML = `
            <div class="modal-content">
                <h2>${title}</h2>
                <div class="modal-body">${content}</div>
                <div class="modal-actions">
                    ${buttons.map(btn => `
                        <button class="btn ${btn.class || 'btn-primary'}" 
                                onclick="${btn.action}">${btn.text}</button>
                    `).join('')}
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        return overlay;
    },
    
    // Close modal
    closeModal(modal) {
        if (modal && modal.parentNode) {
            modal.parentNode.removeChild(modal);
        }
    },
    
    // Show tutorial
    showTutorial(tutorialData) {
        const overlay = document.getElementById('tutorialOverlay');
        if (!overlay) return;
        
        const title = document.getElementById('tutorialTitle');
        const body = document.getElementById('tutorialBody');
        
        if (title) title.textContent = tutorialData.title;
        if (body) body.innerHTML = tutorialData.content;
        
        overlay.classList.remove('hidden');
    },
    
    // Hide tutorial
    hideTutorial() {
        const overlay = document.getElementById('tutorialOverlay');
        if (overlay) {
            overlay.classList.add('hidden');
        }
    },
    
    // Confirm dialog
    confirm(message) {
        return window.confirm(message);
    },
    
    // Prompt dialog
    prompt(message, defaultValue = '') {
        return window.prompt(message, defaultValue);
    },
    
    // Show loading
    showLoading(message = 'Loading...') {
        const loader = document.createElement('div');
        loader.id = 'loader';
        loader.className = 'loading-screen';
        loader.innerHTML = `
            <div class="loading-spinner"></div>
            <div class="loading-text">${message}</div>
        `;
        document.body.appendChild(loader);
    },
    
    // Hide loading
    hideLoading() {
        const loader = document.getElementById('loader');
        if (loader) {
            loader.parentNode.removeChild(loader);
        }
    },
    
    // Format currency
    formatMoney(amount) {
        return '$' + amount.toFixed(2);
    },
    
    // Format time
    formatTime(minutes) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    },
    
    // Create progress bar
    createProgressBar(current, max, label = '') {
        const percentage = Math.min(100, (current / max) * 100);
        return `
            <div class="progress-container">
                ${label ? `<div class="progress-label">${label}</div>` : ''}
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${percentage}%">
                        ${percentage.toFixed(0)}%
                    </div>
                </div>
            </div>
        `;
    },
    
    // Show achievement
    showAchievement(achievement) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-content">
                <div class="achievement-title">🏆 Achievement Unlocked!</div>
                <div class="achievement-name">${achievement.name}</div>
            </div>
        `;
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: linear-gradient(135deg, #f39c12, #e67e22);
            color: white;
            padding: 20px;
            border-radius: 15px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.3);
            z-index: 2000;
            animation: achievementPop 0.5s ease-out;
            display: flex;
            gap: 15px;
            align-items: center;
            max-width: 350px;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }
};

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    @keyframes achievementPop {
        0% {
            transform: scale(0) rotate(-180deg);
            opacity: 0;
        }
        50% {
            transform: scale(1.1) rotate(10deg);
        }
        100% {
            transform: scale(1) rotate(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);
