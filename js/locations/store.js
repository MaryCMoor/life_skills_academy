// ==================== STORE LOCATION ====================

function loadStore() {
    document.getElementById('locationTitle').textContent = '🏪 Store';
    
    const content = `
        <h3>🛒 Shopping</h3>
        <div class="alert alert-info">
            💵 Your cash: $${GameState.money.cash.toFixed(2)}
        </div>
        
        ${renderStoreItems()}
    `;
    
    document.getElementById('locationContent').innerHTML = content;
}

function renderStoreItems() {
    const items = [
        { id: 'groceries', name: '🛒 Groceries (Weekly)', price: 50, desc: 'Essential food for the week', category: 'food' },
        { id: 'snacks', name: '🍿 Snacks', price: 10, desc: 'Quick energy boost', category: 'food' },
        { id: 'notebook', name: '📓 Notebook', price: 5, desc: 'For school notes', category: 'school' },
        { id: 'backpack', name: '🎒 Backpack', price: 35, desc: 'Carry your supplies', category: 'school' },
        { id: 'clothing', name: '👕 Clothing', price: 25, desc: 'Fresh outfit', category: 'personal' },
        { id: 'toiletries', name: '🧴 Toiletries', price: 15, desc: 'Hygiene essentials', category: 'personal' },
        { id: 'phone', name: '📱 Smartphone', price: 200, desc: 'Stay connected', category: 'electronics' },
        { id: 'laptop', name: '💻 Laptop', price: 500, desc: 'For school and work', category: 'electronics' }
    ];
    
    let html = '';
    
    // Adult grocery warning
    if (GameState.player.age >= GameState.ADULT_AGE && GameState.adult.groceries < 20) {
        html += '<div class="alert alert-danger">⚠️ You need groceries! You\'re running low on food!</div>';
    }
    
    html += '<div class="shop-grid">';
    
    items.forEach(item => {
        const owned = GameState.inventory.find(i => i.id === item.id);
        const canAfford = GameState.money.cash >= item.price;
        
        html += `
            <div class="shop-item">
                <div class="item-icon">${item.name.split(' ')[0]}</div>
                <div class="item-name">${Utils.escapeHtml(item.name)}</div>
                <div class="item-desc">${Utils.escapeHtml(item.desc)}</div>
                <div class="item-price">$${item.price}</div>
                ${owned ? 
                    '<button class="btn" disabled>✅ Owned</button>' :
                    canAfford ?
                        `<button class="btn btn-success" onclick="buyItem('${item.id}', ${item.price}, '${Utils.escapeHtml(item.name)}')">Buy</button>` :
                        '<button class="btn" disabled>💰 Can\'t Afford</button>'
                }
            </div>
        `;
    });
    
    html += '</div>';
    
    return html;
}

function buyItem(itemId, price, itemName) {
    if (GameState.money.cash < price) {
        UI.showNotification('❌ Not enough cash!', 'error');
        return;
    }
    
    if (GameState.spendMoney(price, itemName)) {
        GameState.inventory.push({
            id: itemId,
            name: itemName,
            purchaseDate: new Date().toISOString()
        });
        
        // Special handling
        if (itemId === 'groceries') {
            GameState.adult.groceries = 100;
            UI.showNotification('✅ Groceries purchased! Stocked for the week.', 'success');
        } else {
            UI.showNotification(`✅ Purchased ${itemName}!`, 'success');
        }
        
        // Achievement
        if (GameState.inventory.length === 5) {
            GameState.addAchievement('Smart Shopper', 'Buy 5 different items', '🛍️');
        }
        
        loadStore();
        UI.updateStats();
    }
}

console.log('✅ store.js loaded');
