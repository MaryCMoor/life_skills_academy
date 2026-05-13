// ==================== JOB CENTER LOCATION ====================

function loadJobCenter() {
    document.getElementById('locationTitle').textContent = '💼 Job Center';
    
    const content = `
        <div class="tabs">
            <div class="tab active" onclick="showJobTab('browse')">Browse Jobs</div>
            <div class="tab" onclick="showJobTab('current')">Current Job</div>
            <div class="tab" onclick="showJobTab('applications')">My Applications</div>
        </div>
        
        <div id="job-browse" class="tab-content active">
            ${renderJobBrowse()}
        </div>
        
        <div id="job-current" class="tab-content">
            ${renderCurrentJob()}
        </div>
        
        <div id="job-applications" class="tab-content">
            ${renderApplications()}
        </div>
    `;
    
    document.getElementById('locationContent').innerHTML = content;
}

function showJobTab(tab) {
    document.querySelectorAll('#locationContent .tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('#locationContent .tab-content').forEach(t => t.classList.remove('active'));
    
    event.target.classList.add('active');
    document.getElementById(`job-${tab}`).classList.add('active');
}

function renderJobBrowse() {
    const age = GameState.player.age;
    
    const jobs = [
        { 
            id: 'paperboy', title: 'Paper Delivery', wage: 8, minAge: 12, hours: 10,
            desc: 'Deliver newspapers early morning', requirements: ['None'], icon: '📰'
        },
        { 
            id: 'babysitter', title: 'Babysitter', wage: 12, minAge: 13, hours: 15,
            desc: 'Watch children for families', requirements: ['Good communication'], icon: '👶'
        },
        { 
            id: 'grocery', title: 'Grocery Bagger', wage: 10, minAge: 14, hours: 20,
            desc: 'Bag groceries at supermarket', requirements: ['Customer service'], icon: '🛒'
        },
        { 
            id: 'cashier', title: 'Cashier', wage: 12, minAge: 16, hours: 25,
            desc: 'Handle cash register', requirements: ['Math skills', 'Age 16+'], icon: '💵'
        },
        { 
            id: 'restaurant', title: 'Server', wage: 15, minAge: 16, hours: 30,
            desc: 'Serve food at restaurant', requirements: ['Communication', 'Age 16+'], icon: '🍽️'
        },
        { 
            id: 'retail', title: 'Retail Sales', wage: 13, minAge: 16, hours: 30,
            desc: 'Help customers in store', requirements: ['Sales skills', 'Age 16+'], icon: '👔'
        }
    ];
    
    let html = '<h3>💼 Available Jobs</h3>';
    html += '<p>Find a job that matches your age and skills!</p>';
    
    html += '<div class="content-grid">';
    
    jobs.forEach(job => {
        const meetsAge = age >= job.minAge;
        const hasJob = GameState.work.currentJob !== null;
        
        html += `
            <div class="card">
                <div class="card-title">${job.icon} ${Utils.escapeHtml(job.title)}</div>
                <div class="card-content">
                    <p>${Utils.escapeHtml(job.desc)}</p>
                    
                    <div class="info-row">
                        <span class="info-label">Wage:</span>
                        <span class="info-value">$${job.wage}/hour</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Hours/week:</span>
                        <span class="info-value">${job.hours} hours</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Min Age:</span>
                        <span class="info-value">${job.minAge}+ ${meetsAge ? '✅' : '❌'}</span>
                    </div>
                    
                    <h4 style="margin-top: 15px;">Requirements:</h4>
                    <ul style="margin: 5px 0; padding-left: 20px;">
                        ${job.requirements.map(req => `<li>${Utils.escapeHtml(req)}</li>`).join('')}
                    </ul>
                    
                    ${!meetsAge ?
                        '<button class="btn" disabled>Too Young</button>' :
                        hasJob ?
                            '<button class="btn" disabled>Already Employed</button>' :
                            `<button class="btn btn-primary" onclick="applyForJob('${job.id}', '${Utils.escapeHtml(job.title)}', ${job.wage}, ${job.hours})">
                                Apply Now
                            </button>`
                    }
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    
    return html;
}

function renderCurrentJob() {
    const job = GameState.work.currentJob;
    
    if (!job) {
        return `
            <div class="alert alert-info">
                You don't have a job yet. Check the Browse Jobs tab to find work!
            </div>
            
            <div class="card">
                <div class="card-title">Why Get a Job?</div>
                <div class="card-content">
                    <ul>
                        <li>💵 Earn steady income</li>
                        <li>📈 Build work experience</li>
                        <li>🎯 Develop professional skills</li>
                        <li>👔 Learn responsibility</li>
                        <li>💼 Prepare for career</li>
                    </ul>
                </div>
            </div>
        `;
    }
    
    let html = '<h3>💼 Your Current Job</h3>';
    
    html += `
        <div class="card">
            <div class="card-title">${job.title}</div>
            <div class="card-content">
                <div class="stats-display">
                    <div class="stat-box">
                        <div class="icon">💵</div>
                        <div class="label">Hourly Wage</div>
                        <div class="value">$${job.wage}/hr</div>
                    </div>
                    <div class="stat-box">
                        <div class="icon">⏰</div>
                        <div class="label">Hours/Week</div>
                        <div class="value">${job.hours} hrs</div>
                    </div>
                    <div class="stat-box">
                        <div class="icon">📊</div>
                        <div class="label">Weekly Pay</div>
                        <div class="value">$${(job.wage * job.hours).toFixed(2)}</div>
                    </div>
                </div>
                
                <div class="mt-20">
                    <button class="btn btn-success btn-large" onclick="workShift()">
                        💼 Work a Shift
                    </button>
                    <button class="btn btn-danger" onclick="quitJob()">
                        Quit Job
                    </button>
                </div>
            </div>
        </div>
    `;
    
    return html;
}

function renderApplications() {
    let html = '<h3>📋 My Applications</h3>';
    
    if (GameState.work.applications.length === 0) {
        html += `
            <div class="alert alert-info">
                You haven't applied to any jobs yet.
            </div>
        `;
    } else {
        html += '<div class="checklist">';
        
        GameState.work.applications.forEach((app, index) => {
            html += `
                <div class="checklist-item">
                    <div class="checklist-icon">📄</div>
                    <div class="checklist-text">
                        <strong>${Utils.escapeHtml(app.title)}</strong>
                        <div class="desc">Status: ${Utils.escapeHtml(app.status)}</div>
                        <div class="desc">Applied: ${new Date(app.date).toLocaleDateString()}</div>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
    }
    
    return html;
}

function applyForJob(jobId, title, wage, hours) {
    if (!confirm(`Apply for ${title}?\n\nWage: $${wage}/hour\nHours: ${hours}/week`)) {
        return;
    }
    
    // Add to applications
    GameState.work.applications.push({
        id: jobId,
        title: title,
        status: 'Pending',
        date: new Date().toISOString()
    });
    
    // Auto-hire after a delay (simplified)
    setTimeout(() => {
        GameState.work.currentJob = {
            id: jobId,
            title: title,
            wage: wage,
            hours: hours,
            startDate: new Date().toISOString()
        };
        
        // Update application status
        const app = GameState.work.applications.find(a => a.id === jobId);
        if (app) app.status = 'Hired!';
        
        GameState.addAchievement('First Job', 'Get your first job', '💼');
        
        UI.showNotification(`🎉 Congratulations! You're hired at ${title}!`, 'success');
        
        loadJobCenter();
    }, 2000);
    
    UI.showNotification(`📋 Application submitted for ${title}!`, 'info');
    loadJobCenter();
}

function workShift() {
    if (GameState.isBusy()) {
        UI.showNotification('You are already busy!', 'warning');
        return;
    }
    
    const job = GameState.work.currentJob;
    if (!job) return;
    
    const shiftHours = 4; // 4 hour shift
    const earnings = job.wage * shiftHours;
    
    GameState.setBusy('working', shiftHours * 3);
    
    UI.showNotification(`💼 Working ${shiftHours} hour shift...`, 'info');
    
    setTimeout(() => {
        GameState.addMoney(earnings, job.title);
        GameState.stats.hoursWorked += shiftHours;
        GameState.addSkill('communication', 3);
        GameState.addSkill('timeManagement', 2);
        GameState.clearBusy();
        
        UI.showNotification(`✅ Shift complete! Earned $${earnings.toFixed(2)}`, 'success');
        
        loadJobCenter();
        UI.updateStats();
    }, shiftHours * 3000);
}

function quitJob() {
    if (!confirm('Are you sure you want to quit your job?')) {
        return;
    }
    
    GameState.work.jobHistory.push({
        ...GameState.work.currentJob,
        endDate: new Date().toISOString()
    });
    
    GameState.work.currentJob = null;
    
    UI.showNotification('You quit your job', 'info');
    loadJobCenter();
}

console.log('✅ jobcenter.js loaded');
