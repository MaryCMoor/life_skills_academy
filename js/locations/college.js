// ==================== COLLEGE LOCATION ====================

function loadCollege() {
    document.getElementById('locationTitle').textContent = '🎓 College';
    
    if (GameState.player.grade < 12) {
        const content = `
            <div class="alert alert-warning">
                ⚠️ College applications are only available in Grade 12 (Senior Year).
            </div>
            
            <div class="card">
                <div class="card-title">Prepare for College!</div>
                <div class="card-content">
                    <p>Start preparing now to increase your chances of admission:</p>
                    <ul>
                        <li>📚 Keep your GPA high (current: ${GameState.school.gpa})</li>
                        <li>🎯 Join extracurricular activities</li>
                        <li>💼 Build work experience</li>
                        <li>💰 Save money for tuition</li>
                        <li>📝 Complete all homework assignments</li>
                    </ul>
                    
                    <h4 class="mt-20">College Requirements:</h4>
                    <table class="data-table">
                        <thead>
                            <tr><th>College Type</th><th>Min GPA</th><th>Tuition</th></tr>
                        </thead>
                        <tbody>
                            <tr><td>Community College</td><td>2.0</td><td>$5,000</td></tr>
                            <tr><td>State University</td><td>3.0</td><td>$15,000</td></tr>
                            <tr><td>Private University</td><td>3.5</td><td>$35,000</td></tr>
                            <tr><td>Ivy League</td><td>3.8</td><td>$50,000</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        document.getElementById('locationContent').innerHTML = content;
        return;
    }
    
    const content = `
        <div class="tabs">
            <div class="tab active" onclick="showCollegeTab('apply')">Applications</div>
            <div class="tab" onclick="showCollegeTab('scholarships')">Scholarships</div>
            <div class="tab" onclick="showCollegeTab('info')">College Info</div>
        </div>
        
        <div id="college-apply" class="tab-content active">
            ${renderApplications()}
        </div>
        
        <div id="college-scholarships" class="tab-content">
            ${renderScholarships()}
        </div>
        
        <div id="college-info" class="tab-content">
            ${renderCollegeInfo()}
        </div>
    `;
    
    document.getElementById('locationContent').innerHTML = content;
}

function showCollegeTab(tab) {
    document.querySelectorAll('#locationContent .tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('#locationContent .tab-content').forEach(t => t.classList.remove('active'));
    
    event.target.classList.add('active');
    document.getElementById(`college-${tab}`).classList.add('active');
}

function renderApplications() {
    const colleges = [
        { 
            id: 'community', 
            name: 'Community College',
            minGPA: 2.0,
            tuition: 5000,
            appFee: 0,
            desc: 'Affordable two-year programs with flexible schedules',
            features: ['Open admission', 'Small class sizes', 'Transfer programs']
        },
        { 
            id: 'state', 
            name: 'State University',
            minGPA: 3.0,
            tuition: 15000,
            appFee: 50,
            desc: 'Quality education at reasonable cost',
            features: ['Bachelor\'s degrees', 'Research opportunities', 'Campus life']
        },
        { 
            id: 'private', 
            name: 'Private University',
            minGPA: 3.5,
            tuition: 35000,
            appFee: 75,
            desc: 'Prestigious education with strong alumni network',
            features: ['Small class sizes', 'Top professors', 'Great facilities']
        },
        { 
            id: 'ivy', 
            name: 'Ivy League',
            minGPA: 3.8,
            tuition: 50000,
            appFee: 100,
            desc: 'Elite institution with world-class education',
            features: ['Prestigious degree', 'Global recognition', 'Unlimited opportunities']
        }
    ];
    
    const currentGPA = parseFloat(GameState.school.gpa);
    
    let html = '<h3>📝 College Applications</h3>';
    html += `<div class="alert alert-info">Your GPA: ${currentGPA.toFixed(1)}</div>`;
    
    html += '<div class="content-grid">';
    
    colleges.forEach(college => {
        const meetsGPA = currentGPA >= college.minGPA;
        const canAffordApp = GameState.money.cash >= college.appFee;
        
        html += `
            <div class="card">
                <div class="card-title">${Utils.escapeHtml(college.name)}</div>
                <div class="card-content">
                    <p>${Utils.escapeHtml(college.desc)}</p>
                    
                    <div class="mt-20">
                        <strong>Requirements:</strong>
                        <div class="info-row">
                            <span class="info-label">Min GPA:</span>
                            <span class="info-value">${college.minGPA} ${meetsGPA ? '✅' : '❌'}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Application Fee:</span>
                            <span class="info-value">$${college.appFee}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Annual Tuition:</span>
                            <span class="info-value">$${college.tuition.toLocaleString()}</span>
                        </div>
                    </div>
                    
                    <h4 class="mt-20">Features:</h4>
                    <ul>
                        ${college.features.map(f => `<li>${Utils.escapeHtml(f)}</li>`).join('')}
                    </ul>
                    
                    ${!meetsGPA ? 
                        '<button class="btn" disabled>GPA Too Low</button>' :
                        !canAffordApp ?
                            '<button class="btn" disabled>Can\'t Afford App Fee</button>' :
                            `<button class="btn btn-primary" onclick="applyCollege('${college.id}', '${Utils.escapeHtml(college.name)}', ${college.appFee}, ${college.tuition})">
                                Apply ($${college.appFee})
                            </button>`
                    }
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    return html;
}

function applyCollege(id, name, fee, tuition) {
    if (!confirm(`Apply to ${name}?\n\nApplication Fee: $${fee}\nAnnual Tuition: $${tuition.toLocaleString()}`)) {
        return;
    }
    
    if (GameState.spendMoney(fee, 'college application')) {
        UI.showNotification(`✅ Applied to ${name}!`, 'success');
        UI.showNotification('📬 Check your mail in a few days for admission decision!', 'info', 5000);
        
        GameState.addAchievement('College Bound', 'Apply to college', '🎓');
        GameState.addSkill('timeManagement', 10);
        
        UI.updateStats();
    }
}

function renderScholarships() {
    const scholarships = [
        { name: 'Academic Excellence', amount: 5000, requirement: 'GPA 3.5+', eligible: parseFloat(GameState.school.gpa) >= 3.5 },
        { name: 'Community Service', amount: 2500, requirement: '3+ extracurriculars', eligible: GameState.school.extracurriculars.length >= 3 },
        { name: 'Work Experience', amount: 3000, requirement: 'Work history', eligible: GameState.work.jobHistory.length > 0 },
        { name: 'First Generation', amount: 4000, requirement: 'Automatic', eligible: true }
    ];
    
    let html = '<h3>💰 Scholarships</h3>';
    html += '<p>Scholarships can help pay for college! Here are some you may be eligible for:</p>';
    
    html += '<div class="checklist">';
    
    scholarships.forEach((scholarship, index) => {
        html += `
            <div class="checklist-item ${scholarship.eligible ? '' : 'completed'}">
                <div class="checklist-icon">${scholarship.eligible ? '✅' : '❌'}</div>
                <div class="checklist-text">
                    <strong>${Utils.escapeHtml(scholarship.name)}</strong>
                    <div class="desc">Award: $${scholarship.amount.toLocaleString()}</div>
                    <div class="desc">Requirement: ${Utils.escapeHtml(scholarship.requirement)}</div>
                </div>
                ${scholarship.eligible ? 
                    `<button class="btn btn-success" onclick="applyScholarship(${index}, '${Utils.escapeHtml(scholarship.name)}', ${scholarship.amount})">Apply</button>` :
                    '<span style="color: #95a5a6;">Not Eligible</span>'
                }
            </div>
        `;
    });
    
    html += '</div>';
    
    html += `
        <div class="info-box mt-20">
            <h4>💡 Scholarship Tips:</h4>
            <ul>
                <li>Apply to as many as possible</li>
                <li>Maintain high GPA</li>
                <li>Get involved in extracurriculars</li>
                <li>Build work experience</li>
                <li>Write strong application essays</li>
            </ul>
        </div>
    `;
    
    return html;
}

function applyScholarship(index, name, amount) {
    UI.showNotification(`✅ Applied for ${name} scholarship!`, 'success');
    
    setTimeout(() => {
        UI.showNotification('🎉 Congratulations! You won the scholarship!', 'success', 3000);
        GameState.addMoney(amount, 'scholarship');
        GameState.addAchievement('Scholarship Winner', 'Win a college scholarship', '🏆');
        
        setTimeout(() => {
            loadCollege();
            UI.updateStats();
        }, 500);
    }, 1000);
}

function renderCollegeInfo() {
    return `
        <h3>ℹ️ About College</h3>
        
        <div class="card">
            <div class="card-title">Why Go to College?</div>
            <div class="card-content">
                <ul>
                    <li>📈 Higher earning potential</li>
                    <li>🎯 More career opportunities</li>
                    <li>🧠 Develop critical thinking skills</li>
                    <li>🤝 Build professional network</li>
                    <li>📚 Pursue your passions</li>
                </ul>
            </div>
        </div>
        
        <div class="card mt-20">
            <div class="card-title">Types of Degrees</div>
            <div class="card-content">
                <ul>
                    <li><strong>Associate's (2 years):</strong> Technical skills, transfer to 4-year</li>
                    <li><strong>Bachelor's (4 years):</strong> Most common undergraduate degree</li>
                    <li><strong>Master's (2+ years):</strong> Advanced specialization</li>
                    <li><strong>Doctorate (4+ years):</strong> Research and teaching</li>
                </ul>
            </div>
        </div>
        
        <div class="card mt-20">
            <div class="card-title">Paying for College</div>
            <div class="card-content">
                <ul>
                    <li>💰 <strong>Savings:</strong> Money you've saved</li>
                    <li>🎓 <strong>Scholarships:</strong> Free money (doesn't need to be repaid)</li>
                    <li>💼 <strong>Work-study:</strong> Part-time campus jobs</li>
                    <li>📋 <strong>Grants:</strong> Need-based aid</li>
                    <li>💳 <strong>Student loans:</strong> Borrowed money (must be repaid with interest)</li>
                </ul>
            </div>
        </div>
        
        <div class="info-box mt-20">
            <h4>💡 College Success Tips:</h4>
            <ul>
                <li>Choose a major you're passionate about</li>
                <li>Attend classes and complete assignments</li>
                <li>Get involved on campus</li>
                <li>Build relationships with professors</li>
                <li>Plan for internships and career development</li>
                <li>Manage your time and money wisely</li>
            </ul>
        </div>
    `;
}

console.log('✅ college.js loaded');
