// ==================== PHONE STORE LOCATION ====================

function loadPhoneStore() {
    document.getElementById('locationTitle').textContent = '📱 Phone Store';
    
    const content = `
        <div class="tabs">
            <div class="tab active" onclick="showPhoneTab('buy')">Buy Phone</div>
            <div class="tab" onclick="showPhoneTab('myphone')">My Phone</div>
            <div class="tab" onclick="showPhoneTab('bills')">Bills</div>
        </div>
        
        <div id="phone-buy" class="tab-content active">
            ${renderBuyPhone()}
        </div>
        
        <div id="phone-myphone" class="tab-content">
            ${renderMyPhone()}
        </div>
        
        <div id="phone-bills" class="tab-content">
            ${renderPhoneBills()}
        </div>
    `;
    
    document.getElementById('locationContent').innerHTML = content;
}

function showPhoneTab(tab) {
    document.querySelectorAll('#locationContent .tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('#locationContent .tab-content').forEach(t => t.classList.remove('active'));
    
    event.target.classList.add('active');
    document.getElementById(`phone-${tab}`).classList.add('active');
}

function renderBuyPhone() {
    if (GameState.phone.hasPhone) {
        return `
            <div class="alert alert-success">
                ✅ You already have a phone!
            </div>
            <p>Check the "My Phone" tab to see your device and plan details.</p>
        `;
    }
    
    const phones = [
        {
            id: 'basic',
            name: 'Basic Phone',
            price: 200,
            monthlyBill: 30,
            features: ['📞 Calls & Texts', '💰 Banking App', '💼 Job Search App', '📱 Social Media'],
            description: 'Perfect starter phone with essential apps'
        },
        {
            id: 'premium',
            name: 'Premium Phone',
            price: 500,
            monthlyBill: 50,
            features: ['📞 Calls & Texts', '💰 Banking App', '💼 Job Search App', '📱 Social Media', '🎓 School Portal', '📊 Management Tools'],
            description: 'Advanced phone with all features including school integration'
        }
    ];
    
    let html = '<h3>📱 Available Phones</h3>';
    html += '<p>Having a phone unlocks apps that help you manage your life!</p>';
    
    html += '<div class="content-grid">';
    
    phones.forEach(phone => {
        const canAfford = GameState.money.cash >= phone.price;
        
        html += `
            <div class="card">
                <div class="card-title">${phone.name}</div>
                <div class="card-content">
                    <div class="price-tag">$${phone.price}</div>
                    <p>${phone.description}</p>
                    
                    <div class="phone-features">
                        <strong>Features:</strong>
                        <ul>
                            ${phone.features.map(f => `<li>${f}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="info-row mt-20">
                        <span class="info-label">Monthly Bill:</span>
                        <span class="info-value">$${phone.monthlyBill}/month</span>
                    </div>
                    
                    ${!canAfford ? '<p class="alert alert-danger">Not enough cash!</p>' : ''}
                    
                    <button class="btn btn-success btn-large mt-20" 
                            onclick="buyPhone('${phone.id}', '${phone.name}', ${phone.price}, ${phone.monthlyBill})"
                            ${!canAfford ? 'disabled' : ''}>
                        ${canAfford ? '🛒 Buy Now' : '❌ Cannot Afford'}
                    </button>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    
    return html;
}

function buyPhone(phoneId, phoneName, price, monthlyBill) {
    if (!GameState.spendMoney(price, 'phone purchase')) {
        UI.showNotification('❌ Not enough cash!', 'error');
        return;
    }
    
    // Generate phone number
    const phoneNumber = `555-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`;
    
    // Set up phone
    GameState.phone.hasPhone = true;
    GameState.phone.model = phoneName;
    GameState.phone.plan = phoneId;
    GameState.phone.monthlyBill = monthlyBill;
    GameState.phone.lastBillDate = `${GameState.time.month}/${GameState.time.date}/${GameState.time.year}`;
    GameState.player.phoneNumber = phoneNumber;
    
    // Enable apps based on plan
    GameState.phone.apps.banking = true;
    GameState.phone.apps.jobSearch = true;
    GameState.phone.apps.social = true;
    
    if (phoneId === 'premium') {
        GameState.phone.apps.schoolPortal = true;
    }
    
    UI.showNotification(`📱 Phone purchased! Your number: ${phoneNumber}`, 'success', 7000);
    UI.showNotification(`💳 Monthly bill of $${monthlyBill} will be charged on the 1st of each month`, 'info', 7000);
    
    GameState.addAchievement('Connected', 'Purchase your first phone', '📱');
    
    SaveLoad.saveGame();
    loadPhoneStore();
    UI.updateStats();
}

function renderMyPhone() {
    if (!GameState.phone.hasPhone) {
        return `
            <div class="alert alert-warning">
                ⚠️ You don't have a phone yet!
            </div>
            <p>Go to the "Buy Phone" tab to purchase one.</p>
        `;
    }
    
    let html = `
        <h3>📱 My Phone</h3>
        
        <div class="card">
            <div class="card-title">${GameState.phone.model}</div>
            <div class="card-content">
                <div class="info-row">
                    <span class="info-label">Phone Number:</span>
                    <span class="info-value">${GameState.player.phoneNumber}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Plan:</span>
                    <span class="info-value">${GameState.phone.plan === 'basic' ? 'Basic' : 'Premium'}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Monthly Bill:</span>
                    <span class="info-value">$${GameState.phone.monthlyBill}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Last Bill Date:</span>
                    <span class="info-value">${GameState.phone.lastBillDate}</span>
                </div>
            </div>
        </div>
        
        <h3 class="mt-20">📲 Installed Apps</h3>
        <div class="content-grid">
    `;
    
    // Banking App
    if (GameState.phone.apps.banking) {
        html += `
            <div class="card">
                <div class="card-title">💰 Banking</div>
                <div class="card-content">
                    <p>Quick account summary:</p>
                    <div class="info-row">
                        <span>Cash:</span>
                        <span>$${GameState.money.cash.toFixed(2)}</span>
                    </div>
                    <div class="info-row">
                        <span>Bank:</span>
                        <span>$${GameState.money.bank.toFixed(2)}</span>
                    </div>
                    ${GameState.money.creditCard ? `
                        <div class="info-row">
                            <span>Credit:</span>
                            <span>$${GameState.money.creditBalance}/$${GameState.money.creditLimit}</span>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }
    
    // Job Search App
    if (GameState.phone.apps.jobSearch) {
        html += `
            <div class="card">
                <div class="card-title">💼 Job Search</div>
                <div class="card-content">
                    ${GameState.work.currentJob ? 
                        `<p>✅ Current Job: ${GameState.work.currentJob.title}</p>
                         <p>Wage: $${GameState.work.currentJob.wage}/hour</p>` :
                        '<p>❌ No current job</p><p>Visit the Job Center to apply!</p>'
                    }
                </div>
            </div>
        `;
    }
    
    // School Portal App (Premium only)
    if (GameState.phone.apps.schoolPortal) {
        html += `
            <div class="card">
                <div class="card-title">🎓 School Portal</div>
                <div class="card-content">
                    <p>GPA: ${GameState.school.gpa}</p>
                    <p>Grade: ${GameState.player.grade}</p>
                    <p>Homework Due: ${GameState.school.homework.filter(h => !h.done).length}</p>
                    <p>Tardies: ${GameState.school.tardies}</p>
                </div>
            </div>
        `;
    }
    
    // Social Media App
    if (GameState.phone.apps.social) {
        html += `
            <div class="card">
                <div class="card-title">📱 Social Media</div>
                <div class="card-content">
                    <p>Social Energy: ${GameState.entertainment.socialEnergy}/100</p>
                    <p>Visit the Entertainment Center to hang out with friends!</p>
                </div>
            </div>
        `;
    }
    
    html += '</div>';
    
    return html;
}

function renderPhoneBills() {
    if (!GameState.phone.hasPhone) {
        return `
            <div class="alert alert-warning">
                ⚠️ You don't have a phone yet!
            </div>
        `;
    }
    
    let html = '<h3>📋 Phone Bill History</h3>';
    
    html += `
        <div class="card">
            <div class="card-title">Current Bill Information</div>
            <div class="card-content">
                <div class="info-row">
                    <span class="info-label">Monthly Cost:</span>
                    <span class="info-value">$${GameState.phone.monthlyBill}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Last Charged:</span>
                    <span class="info-value">${GameState.phone.lastBillDate}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Next Bill:</span>
                    <span class="info-value">1st of next month</span>
                </div>
            </div>
        </div>
        
        <div class="info-box mt-20">
            <h4>💡 Phone Bill Tips:</h4>
            <ul>
                <li>📅 Your phone bill is charged automatically on the 1st of each month</li>
                <li>💰 Make sure you have enough cash in your account</li>
                <li>⚠️ Missing payments can result in service suspension</li>
                <li>📱 Check the Post Office to see upcoming bills</li>
            </ul>
        </div>
    `;
    
    return html;
}

console.log('✅ phone.js loaded');
