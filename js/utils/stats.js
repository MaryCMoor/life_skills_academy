// ==================== PLAYER STATS PANEL ====================
// Shows detailed stats with improvement tips

const StatsPanel = {
    show() {
        const overlay = document.createElement('div');
        overlay.className = 'minigame-overlay active';
        overlay.id = 'statsPanel';
        
        // FIXED: Use GameState directly
        const needs = GameState.needs;
        const totalMoney = GameState.money.cash + GameState.money.bank;
        
        let html = `
            <div class="minigame-container" style="max-width: 900px; max-height: 90vh; overflow-y: auto;">
                <div class="minigame-header">
                    <div class="minigame-title">📊 ${GameState.player.name}'s Stats</div>
                    <div class="minigame-subtitle">Click any stat to see improvement tips!</div>
                </div>
                
                <div style="padding: 20px;">
                    <!-- Personal Info -->
                    <div style="text-align: center; margin-bottom: 30px; padding: 20px; background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 15px; color: white;">
                        <div style="font-size: 60px; margin-bottom: 10px;">👤</div>
                        <div style="font-size: 28px; font-weight: bold; margin-bottom: 5px;">${GameState.player.name}</div>
                        <div style="font-size: 18px; opacity: 0.9;">Age: ${GameState.player.age} | Grade: ${GameState.player.grade}</div>
                        <div style="font-size: 22px; margin-top: 10px;">💰 Money: $${totalMoney.toFixed(2)}</div>
                    </div>
                    
                    <!-- Needs Section -->
                    <div style="margin-bottom: 25px;">
                        <h2 style="color: #2c3e50; margin-bottom: 15px; border-bottom: 3px solid #3498db; padding-bottom: 10px;">
                            🎯 Basic Needs
                        </h2>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                            ${this.createStatCard('hunger', '🍔', 'Hunger', needs.hunger, 
                                needs.hunger < 30 ? 'critical' : needs.hunger < 70 ? 'warning' : 'good',
                                'Eat meals or snacks to restore hunger. Cook nutritious meals at home or buy snacks from the store.'
                            )}
                            ${this.createStatCard('energy', '⚡', 'Energy', needs.energy,
                                needs.energy < 30 ? 'critical' : needs.energy < 70 ? 'warning' : 'good',
                                'Sleep 7-9 hours per night. Eat nutritious meals. Avoid overworking. Take breaks between activities.'
                            )}
                            ${this.createStatCard('hygiene', '🚿', 'Hygiene', needs.hygiene,
                                needs.hygiene < 30 ? 'critical' : needs.hygiene < 70 ? 'warning' : 'good',
                                'Take showers daily. Do chores to maintain cleanliness. Keep your living space tidy.'
                            )}
                            ${this.createStatCard('happiness', '😊', 'Happiness', needs.happiness,
                                needs.happiness < 30 ? 'critical' : needs.happiness < 70 ? 'warning' : 'good',
                                'Complete chores and tasks. Socialize with friends. Cook tasty meals. Achieve goals and unlock achievements.'
                            )}
                            ${this.createStatCard('health', '❤️', 'Health', needs.health,
                                needs.health < 30 ? 'critical' : needs.health < 70 ? 'warning' : 'good',
                                'Eat balanced meals with protein, vitamins, and healthy fats. Exercise regularly. Get enough sleep. Maintain all other needs above 50.'
                            )}
                        </div>
                    </div>
                    
                    <!-- Nutrition Section -->
                    <div style="margin-bottom: 25px;">
                        <h2 style="color: #2c3e50; margin-bottom: 15px; border-bottom: 3px solid #27ae60; padding-bottom: 10px;">
                            🥗 Daily Nutrition (Recommended Daily Values)
                        </h2>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px;">
                            ${this.createNutritionCard('calories', '🔥', 'Calories', needs.calories, 2000, 'kcal',
                                'Target: 2000 kcal/day. Eat regular meals. Each meal provides calories for energy throughout the day.'
                            )}
                            ${this.createNutritionCard('protein', '🥩', 'Protein', needs.protein, 50, 'g',
                                'Target: 50g/day. Eat eggs, meat, fish, beans, and dairy. Protein builds and repairs muscles.'
                            )}
                            ${this.createNutritionCard('carbs', '🍞', 'Carbs', needs.carbs, 250, 'g',
                                'Target: 250g/day. Eat bread, pasta, rice, and grains. Carbs provide quick energy.'
                            )}
                            ${this.createNutritionCard('fats', '🥑', 'Fats', needs.fats, 70, 'g',
                                'Target: 70g/day. Eat nuts, avocado, oils, and fish. Healthy fats support brain function.'
                            )}
                            ${this.createNutritionCard('vitamins', '🍊', 'Vitamins', needs.vitamins, 100, '%',
                                'Target: 100%/day. Eat fruits, vegetables, and fortified foods. Vitamins boost immunity and health.'
                            )}
                        </div>
                    </div>
                    
                    <!-- Academic Section -->
                    <div style="margin-bottom: 25px;">
                        <h2 style="color: #2c3e50; margin-bottom: 15px; border-bottom: 3px solid #e74c3c; padding-bottom: 10px;">
                            📚 Academic Performance
                        </h2>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                            ${this.createStatCard('gpa', '🎓', 'GPA', GameState.school.gpa,
                                GameState.school.gpa < 2.0 ? 'critical' : 
                                GameState.school.gpa < 3.0 ? 'warning' : 'good',
                                'Attend school regularly. Complete homework assignments. Study for tests. Higher GPA unlocks better opportunities.',
                                true, 4.0
                            )}
                            ${this.createStatCard('homework', '📝', 'Homework Done', 
                                GameState.stats.homeworkCompleted || 0,
                                'good',
                                'Complete homework assignments on time. Each completed assignment improves your grades and skills.',
                                false
                            )}
                        </div>
                    </div>
                    
                    <!-- Skills Section -->
                    <div style="margin-bottom: 25px;">
                        <h2 style="color: #2c3e50; margin-bottom: 15px; border-bottom: 3px solid #f39c12; padding-bottom: 10px;">
                            🎯 Life Skills
                        </h2>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                            ${this.createSkillCard('cooking', '👨‍🍳', 'Cooking', GameState.skills.cooking || 0,
                                'Cook meals at home to improve. Higher cooking skill unlocks complex recipes and better meals.'
                            )}
                            ${this.createSkillCard('cleaning', '🧹', 'Cleaning', GameState.skills.cleaning || 0,
                                'Complete chores to improve. Higher cleaning skill makes chores faster and more rewarding.'
                            )}
                            ${this.createSkillCard('budgeting', '💰', 'Budgeting', GameState.skills.budgeting || 0,
                                'Manage your money wisely. Higher budgeting skill helps you save money and make better financial decisions.'
                            )}
                            ${this.createSkillCard('timeManagement', '⏰', 'Time Management', GameState.skills.timeManagement || 0,
                                'Complete tasks efficiently. Higher time management unlocks better scheduling and productivity.'
                            )}
                            ${this.createSkillCard('communication', '💬', 'Communication', GameState.skills.communication || 0,
                                'Interact with others effectively. Higher communication skill helps in jobs and relationships.'
                            )}
                            ${this.createSkillCard('organization', '📋', 'Organization', GameState.skills.organization || 0,
                                'Keep things tidy and planned. Higher organization skill improves efficiency in all activities.'
                            )}
                        </div>
                    </div>
                    
                    <!-- Statistics Section -->
                    <div style="margin-bottom: 25px;">
                        <h2 style="color: #2c3e50; margin-bottom: 15px; border-bottom: 3px solid #9b59b6; padding-bottom: 10px;">
                            📈 Lifetime Statistics
                        </h2>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px;">
                            <div style="background: white; padding: 15px; border-radius: 10px; border: 2px solid #ddd; text-align: center;">
                                <div style="font-size: 30px; margin-bottom: 5px;">💵</div>
                                <div style="font-size: 20px; font-weight: bold; color: #27ae60;">$${(GameState.stats.moneyEarned || 0).toFixed(2)}</div>
                                <div style="font-size: 14px; color: #7f8c8d;">Total Earned</div>
                            </div>
                            <div style="background: white; padding: 15px; border-radius: 10px; border: 2px solid #ddd; text-align: center;">
                                <div style="font-size: 30px; margin-bottom: 5px;">💸</div>
                                <div style="font-size: 20px; font-weight: bold; color: #e74c3c;">$${(GameState.stats.moneySpent || 0).toFixed(2)}</div>
                                <div style="font-size: 14px; color: #7f8c8d;">Total Spent</div>
                            </div>
                            <div style="background: white; padding: 15px; border-radius: 10px; border: 2px solid #ddd; text-align: center;">
                                <div style="font-size: 30px; margin-bottom: 5px;">🍳</div>
                                <div style="font-size: 24px; font-weight: bold; color: #2c3e50;">${GameState.stats.mealsCooked || 0}</div>
                                <div style="font-size: 14px; color: #7f8c8d;">Meals Cooked</div>
                            </div>
                            <div style="background: white; padding: 15px; border-radius: 10px; border: 2px solid #ddd; text-align: center;">
                                <div style="font-size: 30px; margin-bottom: 5px;">🧹</div>
                                <div style="font-size: 24px; font-weight: bold; color: #2c3e50;">${GameState.stats.choresCompleted || 0}</div>
                                <div style="font-size: 14px; color: #7f8c8d;">Chores Done</div>
                            </div>
                            <div style="background: white; padding: 15px; border-radius: 10px; border: 2px solid #ddd; text-align: center;">
                                <div style="font-size: 30px; margin-bottom: 5px;">📚</div>
                                <div style="font-size: 24px; font-weight: bold; color: #2c3e50;">${GameState.stats.homeworkCompleted || 0}</div>
                                <div style="font-size: 14px; color: #7f8c8d;">Homework Done</div>
                            </div>
                            <div style="background: white; padding: 15px; border-radius: 10px; border: 2px solid #ddd; text-align: center;">
                                <div style="font-size: 30px; margin-bottom: 5px;">⏱️</div>
                                <div style="font-size: 24px; font-weight: bold; color: #2c3e50;">${GameState.stats.hoursWorked || 0}</div>
                                <div style="font-size: 14px; color: #7f8c8d;">Hours Worked</div>
                            </div>
                            <div style="background: white; padding: 15px; border-radius: 10px; border: 2px solid #ddd; text-align: center;">
                                <div style="font-size: 30px; margin-bottom: 5px;">🏆</div>
                                <div style="font-size: 24px; font-weight: bold; color: #2c3e50;">${GameState.achievements.length || 0}</div>
                                <div style="font-size: 14px; color: #7f8c8d;">Achievements</div>
                            </div>
                            <div style="background: white; padding: 15px; border-radius: 10px; border: 2px solid #ddd; text-align: center;">
                                <div style="font-size: 30px; margin-bottom: 5px;">📅</div>
                                <div style="font-size: 24px; font-weight: bold; color: #2c3e50;">${GameState.stats.daysPlayed || 0}</div>
                                <div style="font-size: 14px; color: #7f8c8d;">Days Played</div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Money Breakdown -->
                    <div style="margin-bottom: 25px;">
                        <h2 style="color: #2c3e50; margin-bottom: 15px; border-bottom: 3px solid #27ae60; padding-bottom: 10px;">
                            💰 Financial Overview
                        </h2>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                            <div style="background: white; padding: 20px; border-radius: 10px; border: 2px solid #27ae60;">
                                <div style="font-size: 14px; color: #7f8c8d; margin-bottom: 5px;">💵 Cash on Hand</div>
                                <div style="font-size: 28px; font-weight: bold; color: #27ae60;">$${GameState.money.cash.toFixed(2)}</div>
                            </div>
                            <div style="background: white; padding: 20px; border-radius: 10px; border: 2px solid #3498db;">
                                <div style="font-size: 14px; color: #7f8c8d; margin-bottom: 5px;">🏦 Bank Account</div>
                                <div style="font-size: 28px; font-weight: bold; color: #3498db;">$${GameState.money.bank.toFixed(2)}</div>
                            </div>
                            <div style="background: white; padding: 20px; border-radius: 10px; border: 2px solid #e74c3c;">
                                <div style="font-size: 14px; color: #7f8c8d; margin-bottom: 5px;">💳 Debt</div>
                                <div style="font-size: 28px; font-weight: bold; color: #e74c3c;">$${GameState.money.debt.toFixed(2)}</div>
                            </div>
                            <div style="background: white; padding: 20px; border-radius: 10px; border: 2px solid #9b59b6;">
                                <div style="font-size: 14px; color: #7f8c8d; margin-bottom: 5px;">💎 Net Worth</div>
                                <div style="font-size: 28px; font-weight: bold; color: #9b59b6;">$${(totalMoney - GameState.money.debt).toFixed(2)}</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="minigame-actions">
                    <button class="btn btn-primary btn-large" onclick="StatsPanel.close()">Close</button>
                </div>
            </div>
        `;
        
        overlay.innerHTML = html;
        document.body.appendChild(overlay);
    },
    
    // Create stat card with clickable tooltip
    createStatCard(id, emoji, label, value, status, tip, isDecimal = false, maxValue = 100) {
        const percentage = Math.min(100, (value / maxValue) * 100);
        const displayValue = isDecimal ? value.toFixed(1) : Math.round(value);
        
        const colors = {
            critical: '#e74c3c',
            warning: '#f39c12',
            good: '#27ae60'
        };
        
        const color = colors[status] || colors.good;
        
        return `
            <div class="stat-card" 
                 style="background: white; padding: 15px; border-radius: 10px; border: 3px solid ${color}; cursor: pointer; transition: transform 0.2s;"
                 onclick="StatsPanel.showTip('${label}', '${tip}')"
                 onmouseover="this.style.transform='scale(1.05)'"
                 onmouseout="this.style.transform='scale(1)'">
                <div style="text-align: center; margin-bottom: 10px;">
                    <div style="font-size: 40px;">${emoji}</div>
                    <div style="font-size: 16px; font-weight: bold; color: #2c3e50; margin-top: 5px;">${label}</div>
                </div>
                <div style="background: #ecf0f1; border-radius: 10px; height: 20px; overflow: hidden; margin-bottom: 10px;">
                    <div style="background: ${color}; height: 100%; width: ${percentage}%; transition: width 0.3s;"></div>
                </div>
                <div style="text-align: center;">
                    <span style="font-size: 24px; font-weight: bold; color: ${color};">${displayValue}</span>
                    <span style="font-size: 16px; color: #7f8c8d;">/${maxValue}</span>
                </div>
            </div>
        `;
    },
    
    // Create nutrition card
    createNutritionCard(id, emoji, label, current, target, unit, tip) {
        const percentage = Math.min(100, (current / target) * 100);
        const color = percentage < 50 ? '#e74c3c' : percentage < 80 ? '#f39c12' : '#27ae60';
        
        return `
            <div class="nutrition-card" 
                 style="background: white; padding: 15px; border-radius: 10px; border: 2px solid #ddd; cursor: pointer;"
                 onclick="StatsPanel.showTip('${label}', '${tip}')"
                 onmouseover="this.style.borderColor='${color}'"
                 onmouseout="this.style.borderColor='#ddd'">
                <div style="text-align: center;">
                    <div style="font-size: 30px; margin-bottom: 5px;">${emoji}</div>
                    <div style="font-size: 14px; font-weight: bold; color: #2c3e50;">${label}</div>
                    <div style="font-size: 20px; font-weight: bold; color: ${color}; margin: 10px 0;">
                        ${Math.round(current)} <span style="font-size: 14px; color: #7f8c8d;">/ ${target}</span>
                    </div>
                    <div style="background: #ecf0f1; border-radius: 10px; height: 8px; overflow: hidden;">
                        <div style="background: ${color}; height: 100%; width: ${percentage}%;"></div>
                    </div>
                    <div style="font-size: 12px; color: #7f8c8d; margin-top: 5px;">${Math.round(percentage)}%</div>
                </div>
            </div>
        `;
    },
    
    // Create skill card
    createSkillCard(id, emoji, label, value, tip) {
        const level = Math.floor(value / 20);
        const levelNames = ['Novice', 'Beginner', 'Intermediate', 'Advanced', 'Expert', 'Master'];
        const levelName = levelNames[level] || 'Novice';
        const percentage = Math.min(100, value);
        
        const color = value < 20 ? '#e74c3c' : 
                      value < 40 ? '#f39c12' : 
                      value < 60 ? '#f1c40f' : 
                      value < 80 ? '#3498db' : '#27ae60';
        
        return `
            <div class="skill-card" 
                 style="background: white; padding: 15px; border-radius: 10px; border: 2px solid ${color}; cursor: pointer;"
                 onclick="StatsPanel.showTip('${label}', '${tip}')"
                 onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 5px 15px rgba(0,0,0,0.2)'"
                 onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'"
                 style="transition: all 0.2s;">
                <div style="text-align: center;">
                    <div style="font-size: 40px; margin-bottom: 5px;">${emoji}</div>
                    <div style="font-size: 16px; font-weight: bold; color: #2c3e50; margin-bottom: 5px;">${label}</div>
                    <div style="font-size: 14px; color: ${color}; font-weight: bold; margin-bottom: 10px;">${levelName}</div>
                    <div style="background: #ecf0f1; border-radius: 10px; height: 12px; overflow: hidden; margin-bottom: 5px;">
                        <div style="background: ${color}; height: 100%; width: ${percentage}%; transition: width 0.3s;"></div>
                    </div>
                    <div style="font-size: 18px; font-weight: bold; color: ${color};">${Math.round(value)}/100</div>
                </div>
            </div>
        `;
    },
    
    // Show improvement tip
    showTip(title, message) {
        UI.showModal(
            `💡 ${title} Tips`,
            `<div style="font-size: 16px; line-height: 1.6; color: #2c3e50;">${message}</div>`,
            [{ text: 'Got it!', class: 'btn-primary' }]
        );
    },
    
    // Close panel
    close() {
        const panel = document.getElementById('statsPanel');
        if (panel) {
            panel.remove();
        }
    }
};

console.log('✅ stats.js loaded');
