// ==================== INTERACTIVE LAUNDRY SORTING GAME ====================

window.LaundryMinigame = {
    start() {
        console.log('🧺 Starting laundry sorting game');
        this.showSortingGame();
    },
    
    showSortingGame() {
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.id = 'laundryGame';
        overlay.style.display = 'flex';
        overlay.style.zIndex = '2000';
        
        const clothes = [
            { name: 'White Shirt', color: 'whites', emoji: '👕', bg: '#ffffff' },
            { name: 'Blue Jeans', color: 'darks', emoji: '👖', bg: '#1976d2' },
            { name: 'Red Sweater', color: 'colors', emoji: '🧥', bg: '#e53935' },
            { name: 'White Socks', color: 'whites', emoji: '🧦', bg: '#f5f5f5' },
            { name: 'Black Pants', color: 'darks', emoji: '👖', bg: '#212121' },
            { name: 'Yellow Shirt', color: 'colors', emoji: '👕', bg: '#fdd835' },
            { name: 'White Towel', color: 'whites', emoji: '🧴', bg: '#fafafa' },
            { name: 'Purple Dress', color: 'colors', emoji: '👗', bg: '#9c27b0' },
            { name: 'Black Jacket', color: 'darks', emoji: '🧥', bg: '#000000' },
            { name: 'Pink Socks', color: 'colors', emoji: '🧦', bg: '#e91e63' },
            { name: 'Navy Shirt', color: 'darks', emoji: '👕', bg: '#0d47a1' },
            { name: 'White Sheets', color: 'whites', emoji: '🛏️', bg: '#ffffff' }
        ];
        
        let html = `
            <div class="modal-content" style="max-width: 1000px;">
                <div style="text-align: center; padding-bottom: 20px; border-bottom: 3px solid #3498db;">
                    <h2 style="margin: 0; font-size: 32px;">🧺 Sort the Laundry</h2>
                    <p style="color: #7f8c8d; margin: 10px 0 0 0;">Drag each item to the correct basket!</p>
                </div>
                
                <div style="margin: 30px 0; display: flex; gap: 20px;">
                    <!-- Unsorted Pile -->
                    <div style="flex: 1;">
                        <h3 style="text-align: center; color: #2c3e50; margin-bottom: 15px;">Unsorted Laundry</h3>
                        <div id="unsortedPile" style="
                            background: #ecf0f1;
                            border-radius: 15px;
                            padding: 20px;
                            min-height: 400px;
                            display: flex;
                            flex-direction: column;
                            gap: 10px;
                        ">
                            ${clothes.map((item, i) => `
                                <div class="laundry-item" draggable="true" data-item="${i}" data-color="${item.color}" style="
                                    background: ${item.bg};
                                    color: ${['#ffffff', '#f5f5f5', '#fafafa'].includes(item.bg) ? '#333' : '#fff'};
                                    padding: 15px;
                                    border-radius: 10px;
                                    cursor: move;
                                    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                                    display: flex;
                                    align-items: center;
                                    gap: 10px;
                                    font-weight: bold;
                                    border: 2px solid rgba(0,0,0,0.1);
                                ">
                                    <span style="font-size: 24px;">${item.emoji}</span>
                                    <span>${item.name}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <!-- Sorting Baskets -->
                    <div style="flex: 1; display: flex; flex-direction: column; gap: 15px;">
                        <div class="basket" data-basket="whites" style="
                            background: linear-gradient(135deg, #ffffff, #f5f5f5);
                            border: 3px dashed #bdbdbd;
                            border-radius: 15px;
                            padding: 20px;
                            min-height: 120px;
                            text-align: center;
                        ">
                            <h4 style="color: #333; margin-bottom: 10px;">⚪ WHITES</h4>
                            <div class="basket-items"></div>
                        </div>
                        
                        <div class="basket" data-basket="darks" style="
                            background: linear-gradient(135deg, #424242, #212121);
                            border: 3px dashed #757575;
                            border-radius: 15px;
                            padding: 20px;
                            min-height: 120px;
                            text-align: center;
                        ">
                            <h4 style="color: #fff; margin-bottom: 10px;">⚫ DARKS</h4>
                            <div class="basket-items"></div>
                        </div>
                        
                        <div class="basket" data-basket="colors" style="
                            background: linear-gradient(135deg, #ff6b6b, #4ecdc4, #ffe66d, #a8e6cf);
                            border: 3px dashed #333;
                            border-radius: 15px;
                            padding: 20px;
                            min-height: 120px;
                            text-align: center;
                        ">
                            <h4 style="color: #333; margin-bottom: 10px;">🌈 COLORS</h4>
                            <div class="basket-items"></div>
                        </div>
                    </div>
                </div>
                
                <div style="text-align: center; margin: 20px 0;">
                    <div style="font-size: 18px; font-weight: bold;">
                        Sorted: <span id="laundryProgress">0</span> / ${clothes.length}
                    </div>
                </div>
            </div>
        `;
        
        overlay.innerHTML = html;
        document.body.appendChild(overlay);
        
        // Drag and drop logic
        let sortedCount = 0;
        const totalItems = clothes.length;
        
        const items = document.querySelectorAll('.laundry-item');
        items.forEach(item => {
            item.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('itemId', e.target.dataset.item);
                e.dataTransfer.setData('color', e.target.dataset.color);
            });
        });
        
        const baskets = document.querySelectorAll('.basket');
        baskets.forEach(basket => {
            basket.addEventListener('dragover', (e) => {
                e.preventDefault();
                basket.style.borderColor = '#2196f3';
                basket.style.transform = 'scale(1.02)';
            });
            
            basket.addEventListener('dragleave', (e) => {
                basket.style.borderColor = '';
                basket.style.transform = 'scale(1)';
            });
            
            basket.addEventListener('drop', (e) => {
                e.preventDefault();
                basket.style.borderColor = '';
                basket.style.transform = 'scale(1)';
                
                const itemId = e.dataTransfer.getData('itemId');
                const correctColor = e.dataTransfer.getData('color');
                const basketColor = basket.dataset.basket;
                
                if (correctColor === basketColor) {
                    // Correct!
                    const item = document.querySelector(`[data-item="${itemId}"]`);
                    item.remove();
                    
                    sortedCount++;
                    document.getElementById('laundryProgress').textContent = sortedCount;
                    
                    UI.showNotification('✅ Correct!', 'success');
                    
                    if (sortedCount === totalItems) {
                        setTimeout(() => {
                            this.complete();
                        }, 500);
                    }
                } else {
                    UI.showNotification('❌ Wrong basket! Try again.', 'error');
                }
            });
        });
    },
    
    complete() {
        GameState.addMoney(12, 'laundry');
        GameState.addSkill('laundry', 10);
        GameState.completeChore('laundry');
        GameState.clearBusy();
        GameState.stats.choresCompleted++;
        
        UI.showNotification('✅ Laundry sorted perfectly! +$12, +10 laundry skill', 'success');
        
        const overlay = document.getElementById('laundryGame');
        if (overlay) overlay.remove();
        
        loadHome();
        UI.updateStats();
    }
};

console.log('✅ laundry.js loaded - Interactive LaundryMinigame ready');
