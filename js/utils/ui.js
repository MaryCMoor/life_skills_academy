// ==================== UI UTILITIES ====================

const Utils = {
    // HTML escaping to prevent XSS
    escapeHtml(text) {
        if (typeof text !== 'string') {
            return String(text);
        }
        
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },
    
    // Sanitize input
    sanitizeInput(input, maxLength = 100) {
        if (typeof input !== 'string') {
            return '';
        }
        
        return input
            .trim()
            .slice(0, maxLength)
            .replace(/[<>]/g, ''); // Remove angle brackets
    }
};

const UI = {
    // Notification System
    showNotification(message, type = 'info', duration = 3000) {
        // Sanitize message
        const safeMessage = Utils.escapeHtml(message);
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message; // Use textContent for safety
        
        Object.assign(notification.style, {
            position: 'fixed',
            top: '80px',
            right: '20px',
            background: this.getNotificationColor(type),
            color: 'white',
            padding: '15px 25px',
            borderRadius: '10px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            zIndex: '2000',
            animation: 'slideIn 0.3s ease-out',
            maxWidth: '300px',
            fontWeight: '500',
            pointerEvents: 'auto'
        });
        
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
        const updates = {
            playerName: Utils.escapeHtml(GameState.player.name),
            playerAge: GameState.player.age,
            cash: Math.floor(GameState.money.cash),
            bank: Math.floor(GameState.money.bank),
            gpa: GameState.school.gpa
        };
        
        Object.entries(updates).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        });
    },
    
    // Show modal
    showModal(title, content, buttons = []) {
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay active';
        overlay.style.display = 'flex';
        overlay.style.zIndex = '1000';
        
        const modal = document.createElement('div');
        modal.className = 'modal-content';
        
        const modalTitle = document.createElement('h2');
        modalTitle.textContent = title;
        modal.appendChild(modalTitle);
        
        const modalBody = document.createElement('div');
        modalBody.className = 'modal-body';
        modalBody.innerHTML = content; // Content should be pre-sanitized
        modal.appendChild(modalBody);
        
        if (buttons.length > 0) {
            const modalActions = document.createElement('div');
            modalActions.className = 'modal-actions';
            modalActions.style.cssText = 'display: flex; gap: 10px; justify-content: center; margin-top: 20px;';
            
            buttons.forEach(btn => {
                const button = document.createElement('button');
                button.className = `btn ${btn.class || 'btn-primary'}`;
                button.textContent = btn.text;
                button.onclick = () => {
                    if (typeof btn.action === 'function') {
                        btn.action();
                    }
                    this.closeModal(overlay);
                };
                modalActions.appendChild(button);
            });
            
            modal.appendChild(modalActions);
        }
        
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
        
        return overlay;
    },
    
    // Close modal
    closeModal(modal) {
        if (modal && modal.parentNode) {
            modal.parentNode.removeChild(modal);
        }
    },
    
    // Confirm dialog
    confirm(message) {
        return window.confirm(message);
    },
    
    // Prompt dialog with sanitization
    prompt(message, defaultValue = '') {
        const result = window.prompt(message, defaultValue);
        return result ? Utils.sanitizeInput(result) : null;
    },
    
    // Format currency
    formatMoney(amount) {
        if (typeof amount !== 'number' || !isFinite(amount)) {
            return '$0.00';
        }
        return '$' + amount.toFixed(2);
    },
    
    // Format time
    formatTime(minutes) {
        if (typeof minutes !== 'number' || !isFinite(minutes)) {
            return '0h 0m';
        }
        const hours = Math.floor(minutes / 60);
        const mins = Math.floor(minutes % 60);
        return `${hours}h ${mins}m`;
    },
    
    // Create progress bar
    createProgressBar(current, max, label = '') {
        const safeLabel = Utils.escapeHtml(label);
        const percentage = Math.min(100, Math.max(0, (current / max) * 100));
        
        return `
            <div class="progress-container">
                ${safeLabel ? `<div class="progress-label">${safeLabel}</div>` : ''}
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${percentage.toFixed(1)}%">
                        ${percentage.toFixed(0)}%
                    </div>
                </div>
            </div>
        `;
    }
};

// Add CSS animations
if (!document.getElementById('ui-animations')) {
    const style = document.createElement('style');
    style.id = 'ui-animations';
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
    `;
    document.head.appendChild(style);
}

console.log('✅ ui.js loaded');
