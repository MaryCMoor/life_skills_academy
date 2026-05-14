// ==================== STATS PANEL ====================
const StatsPanel = {
    show() {
        const needs = GameState.needs;
        const skills = GameState.skills;
        const money = GameState.money;
        const stats = GameState.stats;
        
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.onclick = (e) => {
            if (e.target === modal) this.close();
        };
        
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 900px; max-height: 90vh; overflow-y: auto;">
                <div class="modal-header">
                    <h2>📊 Player Statistics</h2>
                    <button class="btn-close" onclick="StatsPanel.close()">×</button>
                </div>
                
                <div class="modal-body">
                    <!-- Player Info -->
                    <section class="stats-section">
                        <h3>👤 Player Information</h3>
                        <div class="stats-grid">
                            ${this.createStatCard('name', '👤', 'Name', GameState.player.name, 'info', 'Your character name')}
                            ${this.createStatCard('age', '🎂', 'Age', GameState.player.age, 'info', 'Current age')}
                            ${this.createStatCard('grade', '📚', 'Grade', GameState.player.grade, 'info', 'Current grade level')}
                            ${this.createStatCard('gpa', '📊', 'GPA', GameState.school.gpa.toFixed(1), 'info', 'Grade point average')}
                        </div>
                    </section>
                    
                    <!-- Needs -->
                    <section class="stats-section">
                        <h3>💪 Basic Needs</h3>
                        <div class="stats-grid">
                            ${this.createStatCard('hunger', '🍔', 'Hunger', needs.hunger, 
                                needs.hunger < 30 ? 'critical' : needs.hunger < 70 ? 'warning' : 'good',
                                'Eat food regularly to maintain hunger. Low hunger affects health and happiness.'
                            )}
                            ${this.createStatCard('energy', '⚡', 'Energy', needs.energy,
                                needs.energy < 30 ? 'critical' : needs.energy < 70 ? 'warning' : 'good',
                                'Sleep restores energy. Low energy makes you less productive and affects mood.'
                            )}
                            ${this.createStatCard('hygiene', '🚿', 'Hygiene', needs.hygiene,
                                needs.hygiene < 30 ? 'critical' : needs.hygiene < 70 ? 'warning' : 'good',
                                'Shower daily to maintain hygiene. Low hygiene affects social interactions.'
                            )}
                            ${this.createStatCard('happiness', '😊', 'Happiness', needs.happiness,
                                needs.happiness < 30 ? 'critical' : needs.happiness < 70 ? 'warning' : 'good',
                                'Do activities you enjoy! Low happiness affects overall well-being.'
                            )}
                            ${this.createStatCard('health', '❤️', 'Health', needs.health,
                                needs.health < 30 ? 'critical' : needs.health < 70 ? 'warning' : 'good',
                                'Maintain health through good nutrition, sleep, and hygiene. Low health is dangerous.'
                            )}
                            ${this.createStatCard('stress', '😰', 'Stress', needs.stress,
                                needs.stress > 70 ? 'critical' : needs.stress > 40 ? 'warning' : 'good',
                                'Lower stress by sleeping, reducing commitments, and taking breaks. High stress damages health and grades. Balance is key!',
                                true
                            )}
                        </div>
                    </section>
                    
                    <!-- Nutrition -->
                    <section class="stats-section">
                        <h3>🍽️ Daily Nutrition</h3>
                        <div class="stats-grid">
                            ${this.createStatCard('calories', '🔥', 'Calories', needs.calories + ' cal', 'info', 'Target: 2000-2500 calories per day')}
                            ${this.createStatCard('protein', '🥩', 'Protein', needs.protein + 'g', 'info', 'Target: 50-60g per day')}
                            ${this.createStatCard('carbs', '🍞', 'Carbs', needs.carbs + 'g', 'info', 'Target: 200-300g per day')}
                            ${this.createStatCard('fats', '🥑', 'Fats', needs.fats + 'g', 'info', 'Target: 50-70g per day')}
                            ${this.createStatCard('vitamins', '🍊', 'Vitamins', needs.vitamins + '%', 'info', 'Target: 100% daily value')}
                        </div>
                    </section>
                    
                    <!-- Skills -->
                    <section class="stats-section">
                        <h3>📈 Life Skills</h3>
                        <div class="stats-grid">
                            ${this.createSkillCard('cooking', '🍳', 'Cooking', skills.cooking)}
                            ${this.createSkillCard('cleaning', '🧹', 'Cleaning', skills.cleaning)}
                            ${this.createSkillCard('budgeting', '💰', 'Budgeting', skills.budgeting)}
                            ${this.createSkillCard('timeManagement', '⏰', 'Time Management', skills.timeManagement)}
                            ${this.createSkillCard('communication', '💬', 'Communication', skills.communication)}
                            ${this.createSkillCard('organization', '📋', 'Organization', skills.organization)}
                            ${this.createSkillCard('responsibility', '✅', 'Responsibility', skills.responsibility)}
                            ${this.createSkillCard('laundry', '🧺', 'Laundry', skills.laundry)}
                        </div>
                    </section>
                    
                    <!-- Finances -->
                    <section class="stats-section">
                        <h3>💰 Finances</h3>
                        <div class="stats-grid">
                            ${this.createStatCard('cash', '💵', 'Cash', '$' + money.cash.toFixed(2), 'info', 'Money you have on hand')}
                            ${this.createStatCard('bank', '🏦', 'Bank', '$' + money.bank.toFixed(2), 'info', 'Money in savings account')}
                            ${this.createStatCard('debt', '💳', 'Debt', '$' + money.debt.toFixed(2), 
                                money.debt > 1000 ? 'critical' : money.debt > 0 ? 'warning' : 'good',
                                'Total debt owed'
                            )}
                            ${this.createStatCard('earned', '📈', 'Total Earned', '$' + stats.moneyEarned.toFixed(2), 'info', 'Lifetime earnings')}
                            ${this.createStatCard('spent', '📉', 'Total Spent', '$' + stats.moneySpent.toFixed(2), 'info', 'Lifetime spending')}
                        </div>
                    </section>
                    
                    <!-- Game Stats -->
                    <section class="stats-section">
                        <h3>🎮 Game Statistics</h3>
                        <div class="stats-grid">
                            ${this.createStatCard('days', '📅', 'Days Played', stats.daysPlayed, 'info', 'Total days in game')}
                            ${this.createStatCard('hours', '⏱️', 'Hours Worked', stats.hoursWorked, 'info', 'Total hours worked at jobs')}
                            ${this.createStatCard('homework', '📝', 'Homework Done', stats.homeworkCompleted, 'info', 'Homework assignments completed')}
                            ${this.createStatCard('chores', '🧹', 'Chores Done', stats.choresCompleted, 'info', 'Chores completed')}
                            ${this.createStatCard('meals', '🍳', 'Meals Cooked', stats.mealsCooked, 'info', 'Total meals cooked')}
                            ${this.createStatCard('fridge', '🧊', 'Meals in Fridge', GameState.fridge.length, 'info', 'Stored meals available')}
                        </div>
                    </section>
                    
                    <!-- Achievements -->
                    ${GameState.achievements.length > 0 ? `
                        <section class="stats-section">
                            <h3>🏆 Achievements (${GameState.achievements.length})</h3>
                            <div class="achievements-list">
                                ${GameState.achievements.map(ach => `
                                    <div class="achievement-item">
                                        <div class="achievement-icon">${ach.icon}</div>
                                        <div class="achievement-info">
                                            <div class="achievement-name">${ach.name}</div>
                                            <div class="achievement-desc">${ach.description}</div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </section>
                    ` : ''}
                </div>
                
                <div class="modal-footer">
                    <button class="btn btn-primary" onclick="StatsPanel.close()">Close</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    },
    
    createStatCard(id, icon, label, value, status = 'info', description = '', inverted = false, max = 100) {
        let color = '#3498db';
        
        if (status === 'critical') color = '#e74c3c';
        else if (status === 'warning') color = '#f39c12';
        else if (status === 'good') color = '#27ae60';
        
        // For inverted stats (like stress), reverse the color logic
        if (inverted && typeof value === 'number') {
            if (value > 70) color = '#e74c3c';
            else if (value > 40) color = '#f39c12';
            else color = '#27ae60';
        }
        
        const showBar = typeof value === 'number' && value <= max;
        const percentage = showBar ? (value / max) * 100 : 0;
        
        return `
            <div class="stat-card-detailed">
                <div class="stat-card-header">
                    <span class="stat-card-icon">${icon}</span>
                    <span class="stat-card-label">${label}</span>
                </div>
                <div class="stat-card-value" style="color: ${color};">
                    ${typeof value === 'number' ? Math.round(value) : value}
                </div>
                ${showBar ? `
                    <div class="stat-card-bar">
                        <div class="stat-card-bar-fill" style="width: ${percentage}%; background: ${color};"></div>
                    </div>
                ` : ''}
                <div class="stat-card-desc">${description}</div>
            </div>
        `;
    },
    
    createSkillCard(id, icon, label, value) {
        const percentage = (value / GameState.MAX_SKILL) * 100;
        let color = '#3498db';
        
        if (value >= 75) color = '#27ae60';
        else if (value >= 50) color = '#2ecc71';
        else if (value >= 25) color = '#f39c12';
        
        let rank = 'Beginner';
        if (value >= 75) rank = 'Expert';
        else if (value >= 50) rank = 'Proficient';
        else if (value >= 25) rank = 'Intermediate';
        
        return `
            <div class="stat-card-detailed">
                <div class="stat-card-header">
                    <span class="stat-card-icon">${icon}</span>
                    <span class="stat-card-label">${label}</span>
                </div>
                <div class="stat-card-value" style="color: ${color};">
                    ${Math.round(value)} / ${GameState.MAX_SKILL}
                </div>
                <div class="stat-card-bar">
                    <div class="stat-card-bar-fill" style="width: ${percentage}%; background: ${color};"></div>
                </div>
                <div class="stat-card-desc">${rank}</div>
            </div>
        `;
    },
    
    close() {
        const modal = document.querySelector('.modal-overlay');
        if (modal) {
            modal.remove();
        }
    },
    
    updateStats() {
        // This is called when stats need to be refreshed
        // Currently handled by TimeManager.updateUI()
    }
};

console.log('✅ stats.js loaded');
