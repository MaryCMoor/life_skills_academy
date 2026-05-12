// ==================== PHONE LOCATION ====================

function loadPhone() {
    document.getElementById('locationTitle').textContent = '📱 Cell Phone';
    
    if (!GameState.phone.hasPhone) {
        const content = `
            <h3>📱 Get Your First Cell Phone!</h3>
            
            <div class="alert alert-info">
                A cell phone helps you stay organized and manage your life!
            </div>
            
            <div class="content-grid">
                <div class="card">
                    <div class="card-title">📱 Basic Phone</div>
                    <div class="card-content">
                        <p><strong>Cost:</strong> $200</p>
                        <p><strong>Monthly Plan:</strong> $30/month</p>
                        <h4>Includes:</h4>
                        <ul>
                            <li>📞 Calls & texts</li>
                            <li>📱 Social media</li>
                            <li>💰 Banking app</li>
                            <li>💼 Job search app</li>
                        </ul>
                        <button class="btn btn-primary mt-20" onclick="buyPhone('basic', 200, 30)">
                            Buy Basic Phone
                        </button>
                    </div>
                </div>
                
                <div class="card">
                    <div class="card-title">📱 Premium Phone</div>
                    <div class="card-content">
                        <p><strong>Cost:</strong> $500</p>
                        <p><strong>Monthly Plan:</strong> $50/month</p>
                        <h4>Includes:</h4>
                        <ul>
                            <li>📞 Unlimited calls & texts</li>
                            <li>📱 All basic apps</li>
                            <li>📚 School portal</li>
                            <li>🎮 Entertainment apps</li>
                            <li>📊 Life management tools</li>
                        </ul>
                        <button class="btn btn-success mt-20" onclick="buyPhone('premium', 500, 50)">
                            Buy Premium Phone
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('locationContent').innerHTML = content;
        return;
    }
    
    // Has phone - show apps
    const content = `
        <div class="tabs">
            <div class="tab active" onclick="showPhoneTab('home')">📱 Home</div>
            <div class="tab" onclick="showPhoneTab('banking')">💰 Banking</div>
            <div class="tab" onclick="showPhoneTab('jobs')">💼 Jobs</div>
            <div class="tab" onclick="showPhoneTab('school')">📚 School</div>
            <div class="tab" onclick="showPhoneTab('settings')">⚙️ Settings</div>
        </div>
        
        <div id="phone-home" class="tab-content active">
            ${renderPhoneHome()}
        </div>
        
        <div id="phone-banking" class="tab-content">
            ${renderPhoneBanking()}
        </div>
        
        <div id="phone-jobs" class="tab-content">
            ${renderPhoneJobs()}
        </div>
        
        <div id="phone-school" class="tab-content">
            ${renderPhoneSchool()}
        </div>
        
        <div id="phone-settings" class="tab-content">
            ${renderPhoneSettings()}
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

function buyPhone(model, cost, monthlyBill) {
    if (GameState.money.cash < cost) {
        UI.showNotification('❌ Not enough cash!', 'error');
        return;
    }
    
    if (GameState.spendMoney(cost, `${model} phone`)) {
        GameState.phone.hasPhone = true;
        GameState.phone.model = model;
        GameState.phone.plan = model;
        GameState.phone.monthlyBill = monthlyBill;
        GameState.phone.lastBillDate = {
            month: GameState.time.month,
            year: GameState.time.year
        };
        
        // Enable apps based on plan
        GameState.phone.apps.banking = true;
        GameState.phone.apps.jobSearch = true;
        
        if (model === 'premium') {
            GameState.phone.apps.schoolPortal = true;
        }
        
        GameState.player.hasPhone = true;
        GameState.player.phoneNumber = '555-' + Math.floor(Math.random() * 9000 + 1000);
        
        UI.showNotification(`📱 Phone purchased! Number: ${GameState.player.phoneNumber}`, 'success');
        UI.showNotification(`💰 Monthly bill: $${monthlyBill}/month`, 'info', 5000);
        
        GameState.addAchievement('Connected', 'Get your first cell phone', '📱');
        
        loadPhone();
        UI.updateStats();
    }
}

function renderPhoneHome() {
    const nextBill = GameState.phone.monthlyBill;
    
    return `
        <h3>📱 Your Phone</h3>
        
        <div class="card">
            <div class="card-title">Phone Info</div>
            <div class="card-content">
                <div class="info-row">
                    <span class="info-label">Model:</span>
                    <span class="info-value">${GameState.phone.model} Phone</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Number:</span>
                    <span class="info-value">${GameState.player.phoneNumber}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Monthly Bill:</span>
                    <span class="info-value">$${nextBill}/month</span>
                </div>
            </div>
        </div>
        
        <h3 class="mt-20">📱 Your Apps</h3>
        
        <div class="content-grid">
            <div class="card">
                <div class="card-title">💰 Banking App</div>
                <div class="card-content">
                    <p>Quick access to your accounts</p>
                    <p><strong>Cash:</strong> $${GameState.money.cash.toFixed(2)}</p>
                    <p><strong>Bank:</strong> $${GameState.money.bank.toFixed(2)}</p>
                </div>
            </div>
            
            <div class="card">
                <div class="card-title">💼 Job Search</div>
                <div class="card-content">
                    <p>Find and apply for jobs on the go</p>
                    ${GameState.work.currentJob ? 
                        `<p><strong>Current:</strong> ${GameState.work.currentJob.title}</p>` :
                        '<p>No current job</p>'
                    }
                </div>
            </div>
            
            ${GameState.phone.apps.schoolPortal ? `
                <div class="card">
                    <div class="card-title">📚 School Portal</div>
                    <div class="card-content">
                        <p>Check grades and assignments</p>
                        <p><strong>GPA:</strong> ${GameState.school.gpa}</p>
                        <p><strong>Homework:</strong> ${GameState.school.homework.filter(h => !h.done).length} pending</p>
                    </div>
                </div>
            ` : ''}
            
            <div class="card">
                <div class="card-title">📱 Social Media</div>
                <div class="card-content">
                    <p>Stay connected with friends</p>
                    <p><strong>Friends:</strong> ${GameState.entertainment.friendships}</p>
                </div>
            </div>
        </div>
    `;
}

function renderPhoneBanking() {
    return `
        <h3>💰 Mobile Banking</h3>
        
        <div class="card">
            <div class="card-title">Account Summary</div>
            <div class="card-content">
                <div class="stats-display">
                    <div class="stat-box">
                        <div class="icon">💵</div>
                        <div class="label">Cash</div>
                        <div class="value">$${GameState.money.cash.toFixed(2)}</div>
                    </div>
                    <div class="stat-box">
                        <div class="icon">🏦</div>
                        <div class="label">Bank</div>
                        <div class="value">$${GameState.money.bank.toFixed(2)}</div>
                    </div>
                    <div class="stat-box">
                        <div class="icon">💎</div>
                        <div class="label">Total</div>
                        <div class="value">$${(GameState.money.cash + GameState.money.bank).toFixed(2)}</div>
                    </div>
                </div>
                
                <div class="mt-20">
                    <p><em>💡 Visit the bank for full banking services</em></p>
                </div>
            </div>
        </div>
        
        ${GameState.money.creditCard ? `
            <div class="card mt-20">
                <div class="card-title">💳 Credit Card</div>
                <div class="card-content">
                    <div class="info-row">
                        <span class="info-label">Balance:</span>
                        <span class="info-value" style="color: ${GameState.money.creditBalance > 0 ? '#e74c3c' : '#27ae60'}">
                            $${GameState.money.creditBalance.toFixed(2)}
                        </span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Limit:</span>
                        <span class="info-value">$${GameState.money.creditLimit}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Available:</span>
                        <span class="info-value">$${(GameState.money.creditLimit - GameState.money.creditBalance).toFixed(2)}</span>
                    </div>
                </div>
            </div>
        ` : ''}
    `;
}

function renderPhoneJobs() {
    return `
        <h3>💼 Job Search App</h3>
        
        ${GameState.work.currentJob ? `
            <div class="card">
                <div class="card-title">Your Current Job</div>
                <div class="card-content">
                    <div class="info-row">
                        <span class="info-label">Position:</span>
                        <span class="info-value">${GameState.work.currentJob.title}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Wage:</span>
                        <span class="info-value">$${GameState.work.currentJob.wage}/hour</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Warnings:</span>
                        <span class="info-value">${GameState.work.warnings}/3</span>
                    </div>
                </div>
            </div>
        ` : `
            <div class="alert alert-info">
                You don't have a job yet. Visit the Job Center to apply!
            </div>
        `}
        
        <div class="info-box mt-20">
            <h4>💡 Job Search Tips:</h4>
            <ul>
                <li>Make sure you have a resume</li>
                <li>Check your GPA - some jobs require it</li>
                <li>Be punctual - 3 lates = fired!</li>
                <li>Build experience for better jobs</li>
            </ul>
        </div>
    `;
}

function renderPhoneSchool() {
    if (!GameState.phone.apps.schoolPortal) {
        return `
            <div class="alert alert-warning">
                📱 School Portal is only available on Premium Phone plan.
            </div>
        `;
    }
    
    return `
        <h3>📚 School Portal</h3>
        
        <div class="card">
            <div class="card-title">Academic Overview</div>
            <div class="card-content">
                <div class="stats-display">
                    <div class="stat-box">
                        <div class="icon">📊</div>
                        <div class="label">GPA</div>
                        <div class="value">${GameState.school.gpa}</div>
                    </div>
                    <div class="stat-box">
                        <div class="icon">📝</div>
                        <div class="label">Homework</div>
                        <div class="value">${GameState.school.homework.filter(h => !h.done).length}</div>
                    </div>
                    <div class="stat-box">
                        <div class="icon">⏰</div>
                        <div class="label">Tardies</div>
                        <div class="value">${GameState.school.tardies}</div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="card mt-20">
            <div class="card-title">Current Grades</div>
            <div class="card-content">
                ${Object.keys(GameState.school.grades).map(subject => `
                    <div class="info-row">
                        <span class="info-label">${subject}:</span>
                        <span class="info-value">${GameState.school.grades[subject]}%</span>
                    </div>
                `).join('')}
            </div>
        </div>
        
        ${GameState.school.homework.filter(h => !h.done).length > 0 ? `
            <div class="card mt-20">
                <div class="card-title">Pending Homework</div>
                <div class="card-content">
                    <ul>
                        ${GameState.school.homework.filter(h => !h.done).map(hw => `
                            <li>${hw.subject}: ${hw.description}</li>
                        `).join('')}
                    </ul>
                </div>
            </div>
        ` : ''}
    `;
}

function renderPhoneSettings() {
    return `
        <h3>⚙️ Phone Settings</h3>
        
        <div class="card">
            <div class="card-title">Plan Details</div>
            <div class="card-content">
                <div class="info-row">
                    <span class="info-label">Plan:</span>
                    <span class="info-value">${GameState.phone.plan} Plan</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Monthly Cost:</span>
                    <span class="info-value">$${GameState.phone.monthlyBill}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Phone Number:</span>
                    <span class="info-value">${GameState.player.phoneNumber}</span>
                </div>
            </div>
        </div>
        
        <div class="info-box mt-20">
            <h4>💡 About Your Phone Bill:</h4>
            <ul>
                <li>Your phone bill is due monthly</li>
                <li>Bill appears in Post Office with other bills</li>
                <li>Late payment may result in service suspension</li>
                <li>Keep up with payments to maintain service</li>
            </ul>
        </div>
    `;
}
