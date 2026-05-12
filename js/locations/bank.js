// ==================== BANK LOCATION ====================

function loadBank() {
    document.getElementById('locationTitle').textContent = '🏦 Bank';
    
    const content = `
        <div class="tabs">
            <div class="tab active" onclick="showBankTab('checking')">Checking Account</div>
            <div class="tab" onclick="showBankTab('credit')">Credit Card ${GameState.player.age >= 18 ? '' : '(18+)'}</div>
            <div class="tab" onclick="showBankTab('checks')">Write Check ${GameState.player.age >= 16 ? '' : '(16+)'}</div>
        </div>
        
        <div id="bank-checking" class="tab-content active">
            ${renderChecking()}
        </div>
        
        <div id="bank-credit" class="tab-content">
            ${renderCredit()}
        </div>
        
        <div id="bank-checks" class="tab-content">
            ${renderChecks()}
        </div>
    `;
    
    document.getElementById('locationContent').innerHTML = content;
}

function showBankTab(tab) {
    document.querySelectorAll('#locationContent .tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('#locationContent .tab-content').forEach(t => t.classList.remove('active'));
    
    event.target.classList.add('active');
    document.getElementById(`bank-${tab}`).classList.add('active');
}

function renderChecking() {
    let html = '<h3>💰 Checking Account</h3>';
    
    html += `
        <div class="stats-display">
            <div class="stat-box">
                <div class="icon">💵</div>
                <div class="label">Cash on Hand</div>
                <div class="value">$${GameState.money.cash.toFixed(2)}</div>
            </div>
            <div class="stat-box">
                <div class="icon">🏦</div>
                <div class="label">Bank Balance</div>
                <div class="value">$${GameState.money.bank.toFixed(2)}</div>
            </div>
            <div class="stat-box">
                <div class="icon">💎</div>
                <div class="label">Total Worth</div>
                <div class="value">$${(GameState.money.cash + GameState.money.bank).toFixed(2)}</div>
            </div>
        </div>
    `;
    
    html += `
        <div class="content-grid mt-20">
            <div class="card">
                <div class="card-title">💵 Deposit Cash</div>
                <div class="card-content">
                    <div class="form-group">
                        <label>Amount to deposit:</label>
                        <input type="number" id="depositAmount" min="0" max="${GameState.money.cash}" step="0.01" placeholder="0.00">
                    </div>
                    <button class="btn btn-success" onclick="deposit()">Deposit</button>
                </div>
            </div>
            
            <div class="card">
                <div class="card-title">💸 Withdraw Cash</div>
                <div class="card-content">
                    <div class="form-group">
                        <label>Amount to withdraw:</label>
                        <input type="number" id="withdrawAmount" min="0" max="${GameState.money.bank}" step="0.01" placeholder="0.00">
                    </div>
                    <button class="btn btn-primary" onclick="withdraw()">Withdraw</button>
                </div>
            </div>
        </div>
    `;
    
    html += `
        <div class="info-box mt-20">
            <h4>💡 Banking Tips:</h4>
            <ul>
                <li><strong>Save regularly:</strong> Put money in your bank account for safekeeping</li>
                <li><strong>Emergency fund:</strong> Try to save at least $500 for unexpected expenses</li>
                <li><strong>Track spending:</strong> Know where your money goes</li>
            </ul>
        </div>
    `;
    
    return html;
}

function deposit() {
    const amount = parseFloat(document.getElementById('depositAmount').value);
    
    if (isNaN(amount) || amount <= 0) {
        UI.showNotification('❌ Invalid amount!', 'error');
        return;
    }
    
    if (amount > GameState.money.cash) {
        UI.showNotification('❌ Not enough cash!', 'error');
        return;
    }
    
    GameState.money.cash -= amount;
    GameState.money.bank += amount;
    
    UI.showNotification(`✅ Deposited $${amount.toFixed(2)}!`, 'success');
    GameState.addSkill('budgeting', 2);
    
    loadBank();
    UI.updateStats();
}

function withdraw() {
    const amount = parseFloat(document.getElementById('withdrawAmount').value);
    
    if (isNaN(amount) || amount <= 0) {
        UI.showNotification('❌ Invalid amount!', 'error');
        return;
    }
    
    if (amount > GameState.money.bank) {
        UI.showNotification('❌ Insufficient funds!', 'error');
        return;
    }
    
    GameState.money.bank -= amount;
    GameState.money.cash += amount;
    
    UI.showNotification(`✅ Withdrew $${amount.toFixed(2)}!`, 'success');
    
    loadBank();
    UI.updateStats();
}

function renderCredit() {
    if (GameState.player.age < 18) {
        return `
            <div class="alert alert-warning">
                ⚠️ You must be 18 years old to apply for a credit card.
            </div>
        `;
    }
    
    let html = '<h3>💳 Credit Card</h3>';
    
    if (!GameState.money.creditCard) {
        html += `
            <div class="card">
                <div class="card-title">Apply for Credit Card</div>
                <div class="card-content">
                    <p><strong>Credit Limit:</strong> $500</p>
                    <p><strong>Interest Rate:</strong> 24% APR (2% monthly)</p>
                    <p class="alert alert-warning mt-20">
                        ⚠️ <strong>Warning:</strong> Credit cards charge interest on unpaid balances. 
                        Pay off your balance in full each month to avoid fees!
                    </p>
                    <button class="btn btn-primary" onclick="applyCreditCard()">Apply Now</button>
                </div>
            </div>
        `;
    } else {
        const available = GameState.money.creditLimit - GameState.money.creditBalance;
        
        html += `
            <div class="stats-display">
                <div class="stat-box">
                    <div class="icon">💳</div>
                    <div class="label">Credit Limit</div>
                    <div class="value">$${GameState.money.creditLimit}</div>
                </div>
                <div class="stat-box">
                    <div class="icon">📊</div>
                    <div class="label">Available Credit</div>
                    <div class="value">$${available.toFixed(2)}</div>
                </div>
                <div class="stat-box">
                    <div class="icon">💸</div>
                    <div class="label">Current Balance</div>
                    <div class="value" style="color: ${GameState.money.creditBalance > 0 ? '#e74c3c' : '#27ae60'}">
                        $${GameState.money.creditBalance.toFixed(2)}
                    </div>
                </div>
            </div>
        `;
        
        if (GameState.money.creditBalance > 0) {
            html += `
                <div class="card mt-20">
                    <div class="card-title">💰 Pay Balance</div>
                    <div class="card-content">
                        <div class="form-group">
                            <label>Payment amount:</label>
                            <input type="number" id="paymentAmount" min="0" max="${Math.min(GameState.money.cash, GameState.money.creditBalance)}" step="0.01" placeholder="0.00">
                        </div>
                        <button class="btn btn-success" onclick="payCreditCard()">Make Payment</button>
                    </div>
                </div>
            `;
        }
        
        html += `
            <div class="alert alert-danger mt-20">
                ⚠️ <strong>Interest charges:</strong> 2% per month on unpaid balance<br>
                Current monthly interest: $${(GameState.money.creditBalance * 0.02).toFixed(2)}
            </div>
        `;
    }
    
    return html;
}

function applyCreditCard() {
    GameState.money.creditCard = 'Basic Card';
    GameState.money.creditLimit = 500;
    GameState.money.creditBalance = 0;
    
    UI.showNotification('✅ Credit card approved!', 'success');
    UI.showNotification('⚠️ Remember: Pay your balance in full to avoid interest!', 'warning', 5000);
    
    loadBank();
}

function payCreditCard() {
    const amount = parseFloat(document.getElementById('paymentAmount').value);
    
    if (isNaN(amount) || amount <= 0) {
        UI.showNotification('❌ Invalid amount!', 'error');
        return;
    }
    
    if (amount > GameState.money.cash) {
        UI.showNotification('❌ Not enough cash!', 'error');
        return;
    }
    
    if (amount > GameState.money.creditBalance) {
        UI.showNotification('❌ Payment exceeds balance!', 'error');
        return;
    }
    
    GameState.money.cash -= amount;
    GameState.money.creditBalance -= amount;
    
    UI.showNotification(`✅ Paid $${amount.toFixed(2)} toward credit card!`, 'success');
    GameState.addSkill('creditManagement', 5);
    
    if (GameState.money.creditBalance === 0) {
        UI.showNotification('🎉 Credit card paid off!', 'success');
    }
    
    loadBank();
    UI.updateStats();
}

function renderChecks() {
    if (GameState.player.age < 16) {
        return `
            <div class="alert alert-warning">
                ⚠️ You must be 16 years old to write checks.
            </div>
        `;
    }
    
    return `
        <h3>✍️ Write a Check</h3>
        <p>Learn to write checks properly - an important life skill!</p>
        
        <button class="btn btn-primary btn-large" onclick="startCheckWriting()">
            ✍️ Practice Writing Checks
        </button>
        
        <div class="info-box mt-20">
            <h4>📝 Parts of a Check:</h4>
            <ul>
                <li><strong>Date:</strong> When the check is written</li>
                <li><strong>Pay to the Order of:</strong> Who receives the money</li>
                <li><strong>Amount (numeric):</strong> Dollar amount in numbers</li>
                <li><strong>Amount (written):</strong> Dollar amount in words</li>
                <li><strong>Memo:</strong> What the payment is for</li>
                <li><strong>Signature:</strong> Your signature to authorize payment</li>
            </ul>
        </div>
    `;
}

function startCheckWriting() {
    if (window.CheckWritingMinigame) {
        CheckWritingMinigame.start();
    } else {
        UI.showNotification('✍️ Check writing tutorial coming soon!', 'info');
    }
}
