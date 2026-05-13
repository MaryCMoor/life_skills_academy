// ==================== POST OFFICE LOCATION ====================

function loadPostOffice() {
    document.getElementById('locationTitle').textContent = '📮 Post Office';
    
    const content = `
        <div class="tabs">
            <div class="tab active" onclick="showPostTab('mail')">Mail</div>
            <div class="tab" onclick="showPostTab('bills')">Bills</div>
            <div class="tab" onclick="showPostTab('packages')">Packages</div>
        </div>
        
        <div id="post-mail" class="tab-content active">
            ${renderMail()}
        </div>
        
        <div id="post-bills" class="tab-content">
            ${renderBills()}
        </div>
        
        <div id="post-packages" class="tab-content">
            ${renderPackages()}
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

function renderMail() {
    let html = '<h3>📬 Your Mail</h3>';
    
    const mailItems = [
        { type: 'info', icon: '📄', subject: 'Welcome to Life Skills Academy!', message: 'Check here for important documents, bills, and packages.' }
    ];
    
    // School report
    if (GameState.school.gpa) {
        mailItems.push({ 
            type: 'school', 
            icon: '🎓', 
            subject: 'School Report Card', 
            message: `Your current GPA is ${GameState.school.gpa}. Keep up the good work!` 
        });
    }
    
    // Birthday mail
    if (GameState.player.birthday && 
        GameState.time.month === GameState.player.birthday.month && 
        GameState.time.date === GameState.player.birthday.day) {
        mailItems.unshift({ 
            type: 'birthday', 
            icon: '🎂', 
            subject: 'Happy Birthday!', 
            message: `Happy ${GameState.player.age}th Birthday, ${GameState.player.name}! Here's $50 from grandma!` 
        });
    }
    
    if (mailItems.length === 0) {
        html += '<div class="alert alert-info">📭 No new mail</div>';
        return html;
    }
    
    html += '<div class="checklist">';
    
    mailItems.forEach((mail, index) => {
        html += `
            <div class="checklist-item">
                <div class="checklist-icon">${mail.icon}</div>
                <div class="checklist-text">
                    <strong>${Utils.escapeHtml(mail.subject)}</strong>
                    <div class="desc">${Utils.escapeHtml(mail.message)}</div>
                </div>
                <button class="btn btn-primary" onclick="readMail(${index})">Read</button>
            </div>
        `;
    });
    
    html += '</div>';
    return html;
}

function readMail(index) {
    UI.showNotification('✅ Mail read', 'success');
}

function renderBills() {
    let html = '<h3>💰 Bills</h3>';
    
    if (GameState.player.age < GameState.ADULT_AGE) {
        html += `
            <div class="alert alert-info">
                ℹ️ You don't have any bills yet. Your parents pay for everything!
                <br><br>
                When you turn 18, you'll need to manage bills like:
                <ul class="mt-20">
                    <li>🏠 Rent (if you have an apartment)</li>
                    <li>⚡ Electricity</li>
                    <li>💧 Water</li>
                    <li>📱 Phone (if you have one)</li>
                </ul>
            </div>
        `;
        return html;
    }
    
    const bills = GameState.adult.bills || [];
    
    if (bills.length === 0) {
        html += '<div class="alert alert-success">✅ No bills due!</div>';
        return html;
    }
    
    html += '<div class="checklist">';
    
    bills.forEach((bill, index) => {
        const overdue = GameState.time.date > bill.dueDate;
        const dueSoon = bill.dueDate - GameState.time.date <= 3 && bill.dueDate - GameState.time.date > 0;
        
        html += `
            <div class="checklist-item ${bill.paid ? 'completed' : ''}">
                <div class="checklist-icon">${bill.paid ? '✅' : overdue ? '🚨' : dueSoon ? '⚠️' : '📄'}</div>
                <div class="checklist-text">
                    <strong>${Utils.escapeHtml(bill.name)}</strong>
                    <div class="desc">Amount: $${bill.amount.toFixed(2)}</div>
                    <div class="desc">Due: Day ${bill.dueDate} ${overdue ? '(OVERDUE!)' : dueSoon ? '(Soon!)' : ''}</div>
                </div>
                ${!bill.paid ? 
                    `<button class="btn ${overdue ? 'btn-danger' : 'btn-success'}" onclick="payBill(${index})">
                        Pay Bill
                    </button>` : 
                    '<span style="color: #27ae60; font-weight: bold;">PAID ✓</span>'
                }
            </div>
        `;
    });
    
    html += '</div>';
    
    // Total outstanding
    const unpaid = bills.filter(b => !b.paid);
    if (unpaid.length > 0) {
        const total = unpaid.reduce((sum, b) => sum + b.amount, 0);
        html += `
            <div class="alert alert-warning mt-20">
                💰 Total outstanding: $${total.toFixed(2)}
                <br>Your cash: $${GameState.money.cash.toFixed(2)}
            </div>
        `;
    }
    
    return html;
}

function payBill(index) {
    const bill = GameState.adult.bills[index];
    
    if (!bill) {
        UI.showNotification('❌ Bill not found!', 'error');
        return;
    }
    
    if (bill.paid) {
        UI.showNotification('✅ Bill already paid!', 'info');
        return;
    }
    
    if (GameState.money.cash < bill.amount) {
        UI.showNotification('❌ Not enough cash! Go to the bank to withdraw.', 'error');
        return;
    }
    
    if (GameState.spendMoney(bill.amount, bill.name)) {
        bill.paid = true;
        UI.showNotification(`✅ Paid ${bill.name}: $${bill.amount.toFixed(2)}`, 'success');
        GameState.addSkill('budgeting', 5);
        
        // Check if all bills paid
        if (GameState.adult.bills.every(b => b.paid)) {
            UI.showNotification('🎉 All bills paid for the month!', 'success');
            GameState.addAchievement('Responsible Adult', 'Pay all bills on time', '💰');
        }
        
        loadPostOffice();
        UI.updateStats();
    }
}

function renderPackages() {
    return `
        <h3>📦 Packages</h3>
        <div class="alert alert-info">
            📦 No packages at this time.
        </div>
        
        <div class="info-box">
            <h4>💡 About Packages:</h4>
            <p>When you order items online, they'll arrive here. Always check tracking numbers and delivery dates!</p>
        </div>
    `;
}

console.log('✅ postoffice.js loaded');
