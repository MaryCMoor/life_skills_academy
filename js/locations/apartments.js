// ==================== APARTMENTS LOCATION ====================

function loadApartments() {
    document.getElementById('locationTitle').textContent = '🏢 Apartments';
    
    if (GameState.player.age < GameState.ADULT_AGE) {
        const content = `
            <div class="alert alert-warning">
                ⚠️ You must be 18 years old to rent an apartment.
            </div>
            
            <div class="card">
                <div class="card-title">Coming Soon!</div>
                <div class="card-content">
                    <p>When you turn 18, you can:</p>
                    <ul>
                        <li>🏠 Rent your own apartment</li>
                        <li>💰 Pay monthly rent</li>
                        <li>⚡ Manage utilities</li>
                        <li>🛒 Buy your own groceries</li>
                        <li>🧹 Handle all household tasks</li>
                    </ul>
                    <p class="mt-20"><strong>Prepare by saving money and building good credit!</strong></p>
                </div>
            </div>
        `;
        document.getElementById('locationContent').innerHTML = content;
        return;
    }
    
    const content = `
        <div class="tabs">
            <div class="tab active" onclick="showApartmentTab('browse')">Browse Apartments</div>
            <div class="tab" onclick="showApartmentTab('current')">My Apartment</div>
        </div>
        
        <div id="apt-browse" class="tab-content active">
            ${renderApartmentBrowse()}
        </div>
        
        <div id="apt-current" class="tab-content">
            ${renderCurrentApartment()}
        </div>
    `;
    
    document.getElementById('locationContent').innerHTML = content;
}

function showApartmentTab(tab) {
    document.querySelectorAll('#locationContent .tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('#locationContent .tab-content').forEach(t => t.classList.remove('active'));
    
    event.target.classList.add('active');
    document.getElementById(`apt-${tab}`).classList.add('active');
}

function renderApartmentBrowse() {
    const apartments = [
        { 
            id: 'studio', 
            name: 'Studio Apartment', 
            rent: 600, 
            desc: 'Cozy studio with kitchenette',
            features: ['1 room', 'Small kitchen', 'Shared laundry']
        },
        { 
            id: '1br', 
            name: '1 Bedroom Apartment', 
            rent: 850, 
            desc: 'Spacious one bedroom',
            features: ['1 bedroom', 'Full kitchen', 'In-unit laundry', 'Parking spot']
        },
        { 
            id: '2br', 
            name: '2 Bedroom Apartment', 
            rent: 1200, 
            desc: 'Perfect for roommates',
            features: ['2 bedrooms', 'Large kitchen', 'In-unit laundry', '2 parking spots', 'Balcony']
        }
    ];
    
    let html = '<h3>🏠 Available Apartments</h3>';
    
    if (GameState.adult.apartment) {
        html += `
            <div class="alert alert-info">
                ℹ️ You already have an apartment. Move out first to rent a different one.
            </div>
        `;
    }
    
    html += '<div class="content-grid">';
    
    apartments.forEach(apt => {
        const totalCost = apt.rent * 2;
        const canAfford = GameState.money.cash >= totalCost;
        
        html += `
            <div class="card">
                <div class="card-title">${Utils.escapeHtml(apt.name)}</div>
                <div class="card-content">
                    <p>${Utils.escapeHtml(apt.desc)}</p>
                    <h4>Features:</h4>
                    <ul>
                        ${apt.features.map(f => `<li>${Utils.escapeHtml(f)}</li>`).join('')}
                    </ul>
                    <div class="mt-20">
                        <strong>Monthly Rent:</strong> $${apt.rent}
                    </div>
                    <div class="alert alert-warning mt-20">
                        💰 First month + deposit: $${totalCost}
                    </div>
                    ${GameState.adult.apartment ? 
                        '<button class="btn" disabled>Already Renting</button>' :
                        !canAfford ?
                            '<button class="btn" disabled>💰 Can\'t Afford</button>' :
                            `<button class="btn btn-primary" onclick="rentApartment('${apt.id}', '${Utils.escapeHtml(apt.name)}', ${apt.rent})">
                                Rent Apartment
                            </button>`
                    }
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    
    html += `
        <div class="info-box mt-20">
            <h4>💡 Renting Tips:</h4>
            <ul>
                <li><strong>Budget:</strong> Rent should be no more than 30% of your income</li>
                <li><strong>Deposit:</strong> Usually equal to one month's rent (refundable)</li>
                <li><strong>Bills:</strong> Don't forget utilities (electricity, water)</li>
                <li><strong>Groceries:</strong> You'll need to buy food weekly ($50/week)</li>
            </ul>
        </div>
    `;
    
    return html;
}

function rentApartment(id, name, rent) {
    const totalCost = rent * 2; // First month + deposit
    
    if (GameState.money.cash < totalCost) {
        UI.showNotification(`❌ Need $${totalCost} (first month + deposit). You have $${GameState.money.cash.toFixed(2)}`, 'error');
        return;
    }
    
    if (!confirm(`Rent ${name} for $${rent}/month?\n\nTotal due now: $${totalCost} (first month + deposit)`)) {
        return;
    }
    
    if (GameState.spendMoney(totalCost, 'apartment rental')) {
        GameState.adult.apartment = {
            id: id,
            name: name,
            rent: rent,
            moveInDate: new Date().toISOString()
        };
        
        GameState.adult.rent = rent;
        
        UI.showNotification(`🎉 Congratulations! You rented ${name}!`, 'success');
        UI.showNotification('💰 Remember: Rent is due on the 1st of each month!', 'warning', 5000);
        
        GameState.addAchievement('Independent Living', 'Rent your first apartment', '🏠');
        
        loadApartments();
        UI.updateStats();
    }
}

function renderCurrentApartment() {
    if (!GameState.adult.apartment) {
        return `
            <div class="alert alert-info">
                ℹ️ You don't have an apartment yet. Browse available apartments to rent one!
            </div>
            
            <div class="card">
                <div class="card-title">Living with Parents</div>
                <div class="card-content">
                    <p>You're currently living at home with your parents.</p>
                    <ul>
                        <li>✅ No rent to pay</li>
                        <li>✅ Parents provide groceries</li>
                        <li>✅ Utilities covered</li>
                    </ul>
                    <p class="mt-20">Consider getting a job and saving money before moving out!</p>
                </div>
            </div>
        `;
    }
    
    const apt = GameState.adult.apartment;
    const nextRent = GameState.adult.bills.find(b => b.name === 'Rent' && !b.paid);
    
    let html = '<h3>🏠 Your Apartment</h3>';
    
    html += `
        <div class="card">
            <div class="card-title">${Utils.escapeHtml(apt.name)}</div>
            <div class="card-content">
                <div class="info-row">
                    <span class="info-label">Monthly Rent:</span>
                    <span class="info-value">$${apt.rent}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Move-in Date:</span>
                    <span class="info-value">${new Date(apt.moveInDate).toLocaleDateString()}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Next Rent Due:</span>
                    <span class="info-value">${nextRent ? 'Day ' + nextRent.dueDate : 'Paid for this month'}</span>
                </div>
                
                <div class="mt-20">
                    <button class="btn btn-danger" onclick="moveOut()">📦 Move Out</button>
                </div>
            </div>
        </div>
    `;
    
    html += `
        <div class="stats-display mt-20">
            <div class="stat-box">
                <div class="icon">🛒</div>
                <div class="label">Groceries</div>
                <div class="value">${GameState.adult.groceries}%</div>
            </div>
            <div class="stat-box">
                <div class="icon">⚡</div>
                <div class="label">Electricity</div>
                <div class="value">OK</div>
            </div>
            <div class="stat-box">
                <div class="icon">💧</div>
                <div class="label">Water</div>
                <div class="value">OK</div>
            </div>
        </div>
    `;
    
    if (GameState.adult.groceries < 20) {
        html += `
            <div class="alert alert-danger mt-20">
                🛒 You're running low on groceries! Visit the store to buy more.
            </div>
        `;
    }
    
    return html;
}

function moveOut() {
    if (!confirm('Are you sure you want to move out? You\'ll lose your deposit if you break the lease early.')) {
        return;
    }
    
    GameState.adult.apartment = null;
    GameState.adult.rent = 0;
    GameState.adult.groceries = 100; // Back to parents providing
    
    UI.showNotification('📦 You moved out and are back home with your parents', 'info');
    loadApartments();
}

console.log('✅ apartments.js loaded');
