// ==================== POST OFFICE LOCATION ====================

function loadPostOffice() {
    document.getElementById('locationTitle').textContent = '📮 Post Office';
    
    const content = `
        <div class="tabs">
            <div class="tab active" onclick="showPostTab('services')">Services</div>
            <div class="tab" onclick="showPostTab('mail')">My Mail</div>
        </div>
        
        <div id="post-services" class="tab-content active">
            ${renderServices()}
        </div>
        
        <div id="post-mail" class="tab-content">
            ${renderMail()}
        </div>
    `;
    
    document.getElementById('locationContent').innerHTML = content;
}

function showPostTab(tab) {
    document.querySelectorAll('#locationContent .tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('#locationContent .tab-content').forEach(t => t.classList.remove('active'));
    
    event.target.classList.add('active');
    document.getElementById(`post-${tab}`).classList.add('active');
}

function renderServices() {
    let html = '<h3>📮 Post Office Services</h3>';
    
    html += '<div class="content-grid">';
    
    // Check Writing Tutorial
    html += `
        <div class="card">
            <div class="card-title">✍️ Learn to Write Checks</div>
            <div class="card-content">
                <p>Learn how to properly fill out a check for payments.</p>
                <p><strong>Skill gained:</strong> Budgeting +10</p>
                <button class="btn btn-primary" onclick="startCheckWriting()">
                    📝 Start Tutorial
                </button>
            </div>
        </div>
    `;
    
    // Tax Filing Service
    if (GameState.taxes.w2Forms && GameState.taxes.w2Forms.length > 0 && !GameState.taxes.filedThisYear) {
        html += `
            <div class="card">
                <div class="card-title">📝 File Taxes</div>
                <div class="card-content">
                    <p>Tax season is here! We can help you file your tax return.</p>
                    <p><strong>W-2 forms available: ${GameState.taxes.w2Forms.length}</strong></p>
                    ${GameState.taxes.owedTaxes > 0 ? 
                        `<div class="alert alert-warning">⚠️ You owe $${GameState.taxes.owedTaxes.toFixed(2)} in taxes!</div>` : 
                        ''
                    }
                    <button class="btn btn-primary" onclick="TaxSystem.showTaxFilingMinigame()">
                        📝 File Tax Return
                    </button>
                </div>
            </div>
        `;
    }
    
    // Pay Owed Taxes
    if (GameState.taxes.owedTaxes > 0) {
        html += `
            <div class="card">
                <div class="card-title">💳 Pay Taxes</div>
                <div class="card-content">
                    <p>Amount owed: <strong style="color: #e74c3c;">$${GameState.taxes.owedTaxes.toFixed(2)}</strong></p>
                    <button class="btn btn-danger" onclick="TaxSystem.payTaxes(); loadPostOffice();">
                        💳 Pay Now
                    </button>
                </div>
            </div>
        `;
    }
    
    // General services
    html += `
        <div class="card">
            <div class="card-title">📬 Mail a Letter</div>
            <div class="card-content">
                <p>Send letters and packages to friends and family.</p>
                <p><strong>Cost:</strong> $0.60 (stamp)</p>
                <button class="btn btn-primary" onclick="mailLetter()">
                    Send Letter
                </button>
            </div>
        </div>
        
        <div class="card">
            <div class="card-title">📦 Ship a Package</div>
            <div class="card-content">
                <p>Ship packages anywhere in the country.</p>
                <p><strong>Cost:</strong> $8.00</p>
                <button class="btn btn-primary" onclick="shipPackage()">
                    Ship Package
                </button>
            </div>
        </div>
    `;
    
    html += '</div>';
    
    return html;
}

function renderMail() {
    let html = '<h3>📬 Your Mailbox</h3>';
    
    // Show W2 forms
    if (GameState.taxes.w2Forms && GameState.taxes.w2Forms.length > 0) {
        html += '<h4>📄 Tax Documents</h4>';
        html += '<div class="checklist">';
        
        GameState.taxes.w2Forms.forEach((w2, index) => {
            html += `
                <div class="checklist-item">
                    <div class="checklist-icon">📄</div>
                    <div class="checklist-text">
                        <strong>W-2 Form (${w2.year})</strong>
                        <div class="desc">From: ${Utils.escapeHtml(w2.employer)}</div>
                        <div class="desc">Wages: $${w2.wages.toFixed(2)}</div>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
    }
    
    // Show refund status
    if (GameState.taxes.refundsOwed > 0) {
        html += `
            <div class="alert alert-success mt-20">
                💰 Tax refund of $${GameState.taxes.refundsOwed.toFixed(2)} is being processed!
            </div>
        `;
    }
    
    if (GameState.taxes.w2Forms.length === 0) {
        html += `
            <div class="alert alert-info">
                Your mailbox is empty. Work a job to receive tax documents at year-end!
            </div>
        `;
    }
    
    return html;
}

function startCheckWriting() {
    if (typeof CheckWritingMinigame !== 'undefined') {
        CheckWritingMinigame.start();
    } else {
        UI.showNotification('Check writing tutorial not available', 'error');
    }
}

function mailLetter() {
    const cost = 0.60;
    
    if (GameState.spendMoney(cost, 'postage')) {
        UI.showNotification('✅ Letter mailed!', 'success');
        GameState.addSkill('communication', 2);
        UI.updateStats();
    }
}

function shipPackage() {
    const cost = 8.00;
    
    if (GameState.spendMoney(cost, 'shipping')) {
        UI.showNotification('✅ Package shipped!', 'success');
        GameState.addSkill('responsibility', 3);
        UI.updateStats();
    }
}

console.log('✅ postoffice.js loaded');
