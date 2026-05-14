// ==================== UTILITY FUNCTIONS ====================

const Utils = {
    /**
     * Escape HTML to prevent XSS
     */
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
    
    /**
     * Format currency
     */
    formatMoney(amount) {
        return `$${amount.toFixed(2)}`;
    },
    
    /**
     * Format time as HH:MM
     */
    formatTime(hour, minute) {
        return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    },
    
    /**
     * Get random integer between min and max (inclusive)
     */
    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    
    /**
     * Get random element from array
     */
    randomChoice(array) {
        return array[Math.floor(Math.random() * array.length)];
    },
    
    /**
     * Shuffle array
     */
    shuffle(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    },
    
    /**
     * Clamp value between min and max
     */
    clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    },
    
    /**
     * Linear interpolation
     */
    lerp(start, end, t) {
        return start + (end - start) * t;
    },
    
    /**
     * Get day name from number
     */
    getDayName(dayNum) {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[dayNum];
    },
    
    /**
     * Get month name from number
     */
    getMonthName(monthNum) {
        const months = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];
        return months[monthNum - 1];
    },
    
    /**
     * Format date as string
     */
    formatDate(month, date, year) {
        return `${this.getMonthName(month)} ${date}, ${year}`;
    },
    
    /**
     * Check if weekday
     */
    isWeekday(dayNum) {
        return dayNum >= 1 && dayNum <= 5;
    },
    
    /**
     * Check if weekend
     */
    isWeekend(dayNum) {
        return dayNum === 0 || dayNum === 6;
    },
    
    /**
     * Get ordinal suffix for numbers (1st, 2nd, 3rd, etc.)
     */
    getOrdinal(num) {
        const s = ['th', 'st', 'nd', 'rd'];
        const v = num % 100;
        return num + (s[(v - 20) % 10] || s[v] || s[0]);
    },
    
    /**
     * Deep clone object
     */
    deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    },
    
    /**
     * Capitalize first letter
     */
    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    },
    
    /**
     * Generate UUID
     */
    generateId() {
        return 'xxxx-xxxx-xxxx-xxxx'.replace(/x/g, () => {
            return Math.floor(Math.random() * 16).toString(16);
        });
    },
    
    /**
     * Calculate percentage
     */
    percentage(value, max) {
        return Math.round((value / max) * 100);
    },
    
    /**
     * Format large numbers with commas
     */
    formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
    
    /**
     * Get color based on value (for progress bars, etc.)
     */
    getColor(value, inverted = false) {
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
     * Play sound effect (if audio is implemented)
     */
    playSound(soundName) {
        // Placeholder for future audio implementation
        console.log(`🔊 Sound: ${soundName}`);
    },
    
    /**
     * Vibrate device (mobile)
     */
    vibrate(duration = 100) {
        if ('vibrate' in navigator) {
            navigator.vibrate(duration);
        }
    },
    
    /**
     * Check if mobile device
     */
    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },
    
    /**
     * Get browser name
     */
    getBrowser() {
        const userAgent = navigator.userAgent;
        if (userAgent.includes('Firefox')) return 'Firefox';
        if (userAgent.includes('Chrome')) return 'Chrome';
        if (userAgent.includes('Safari')) return 'Safari';
        if (userAgent.includes('Edge')) return 'Edge';
        return 'Unknown';
    },
    
    /**
     * Store data in localStorage
     */
    saveToStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Failed to save to localStorage:', error);
            return false;
        }
    },
    
    /**
     * Load data from localStorage
     */
    loadFromStorage(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Failed to load from localStorage:', error);
            return null;
        }
    },
    
    /**
     * Remove data from localStorage
     */
    removeFromStorage(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Failed to remove from localStorage:', error);
            return false;
        }
    },
    
    /**
     * Wait for milliseconds (async)
     */
    async wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },
    
    /**
     * Debounce function
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    /**
     * Throttle function
     */
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};

console.log('✅ utils.js loaded');
