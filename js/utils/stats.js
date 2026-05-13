// ==================== PLAYER STATS PANEL ====================
// Shows detailed stats with improvement tips

const StatsPanel = {
    show() {
        const overlay = document.createElement('div');
        overlay.className = 'minigame-overlay active';
        overlay.id = 'statsPanel';
        
        const player = GameState;
        const needs = player.needs;
        
        let html = `
            <div class="minigame-container" style="max-width: 900px; max-height: 90vh; overflow-y: auto;">
                <div class="minigame-header">
                    <div class="minigame-title">📊 ${player.name}'s Stats</div>
                    <div class="minigame-subtitle">Click any stat to see improvement tips!</div>
                </div>
                
                <div style="padding: 20px;">
                    <!-- Personal Info -->
                    <div style="text-align: center; margin-bottom: 30px; padding: 20px; background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 15px; color: white;">
                        <div style="font-size: 60px; margin-bottom: 10px;">👤</div>
                        <div style="font-size: 28px; font-weight: bold; margin-bottom: 5px;">${player.name}</div>
                        <div style="font-size: 18px; opacity: 0.9;">Age: ${player.age} | Grade: ${player.grade}</div>
                        <div style="font-size: 22px; margin-top: 10px;">💰 Money: $${player.money.toFixed(2)}</div>
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
                            ${this.createStatCard('gpa', '🎓', 'GPA', player.calculateGPA ? player.calculateGPA() : 0,
                                player.calculateGPA && player.calculateGPA() < 2.0 ? 'critical' : 
                                player.calculateGPA && player.calculateGPA() < 3.0 ? 'warning' : 'good',
                                'Attend school regularly. Complete homework assignments. Study for tests. Higher GPA unlocks better opportunities.',
                                true, 4.0
                            )}
                            ${this.createStatCard('homework', '📝', 'Homework Done', 
                                player.homework ? Object.values(player.homework).filter(h => h.completed).length : 0,
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
                            ${this.createSkillCard('cooking', '👨‍🍳', 'Cooking', player.skills?.cooking || 0,
                                'Cook meals at home to improve. Higher cooking skill unlocks complex recipes and better meals.'
                            )}
                            ${this.createSkillCard('cleaning', '🧹', 'Cleaning', player.skills?.cleaning || 0,
                                'Complete chores to improve. Higher cleaning skill makes chores faster and more rewarding.'
                            )}
                            ${this.createSkillCard('social', '💬', 'Social', player.skills?.social || 0,
                                'Interact with friends and family. Higher social skill unlocks new relationships and opportunities.'
                            )}
                            ${this.createSkillCard('fitness', '💪', 'Fitness', player.skills?.fitness || 0,
                                'Exercise regularly. Higher fitness improves energy recovery and health maintenance.'
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
                                <div style="font-size: 30px; margin-bottom: 5px;">🍳</div>
                                <div style="font-size: 24px; font-weight: bold; color: #2c3e50;">${player.stats?.mealsCooked || 0}</div>
                                <div style="font-size: 14px; color: #7f8c8d;">Meals Cooked</div>
                            </div>
                            <div style="background: white; padding: 15px; border-radius: 10px; border: 2px solid #ddd; text-align: center;">
                                <div style="font-size: 30px; margin-bottom: 5px;">🧹</div>
                                <div style="font-size: 24px; font-weight: bold; color: #2c3e50;">${player.stats?.choresCompleted || 0}</div>
                                <div style="font-size: 14px; color: #7f8c8d;">Chores Done</div>
                            </div>
                            <div style="background: white; padding: 15px; border-radius: 10px; border: 2px solid #ddd; text-align: center;">
                                <div style="font-size: 30px; margin-bottom: 5px;">📚</div>
                                <div style="font-size: 24px; font-weight: bold; color: #2c3e50;">${player.stats?.homeworkCompleted || 0}</div>
                                <div style="font-size: 14px; color: #7f8c8d;">Homework Done</div>
                            </div>
                            <div style="background: white; padding: 15px; border-radius: 10px; border: 2px solid #ddd; text-align: center;">
                                <div style="font-size: 30px; margin-bottom: 5px;">🏆</div>
                                <div style="font-size: 24px; font-weight: bold; color: #2c3e50;">${player.achievements?.length || 0}</div>
                                <div style="font-size: 14px; color: #7f8c8d;">Achievements</div>
                            </div>
                            <div style="background: white; padding: 15px; border-radius: 10px; border: 2px solid #ddd; text-align: center;">
                                <div style="font-size: 30px; margin-bottom: 5px;">📅</div>
                                <div style="font-size: 24px; font-weight: bold; color: #2c3e50;">${player.time?.day || 1}</div>
                                <div style="font-size: 14px; color: #7f8c8d;">Days Played</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="minigame-actions">
                    <button class="btn-primary" onclick="StatsPanel.close()">Close</button>
                </div>
            </div>
        `;
        
        overlay.innerHTML = html;
        document.body.appendChild(overlay);
    },
    
    createStatCard(id, emoji, name, value, status, tips, isDecimal = false, maxValue = 100) {
        const displayValue = isDecimal ? value.toFixed(2) : Math.round(value);
        const percentage = (value / maxValue) * 100;
        
        const colors = {
            critical: { bg: '#fee', border: '#e74c3c', bar: '#e74c3c', text: '#c0392b' },
            warning: { bg: '#ffeaa7', border: '#f39c12', bar: '#f39c12', text: '#d68910' },
            good: { bg: '#d5f4e6', border: '#27ae60', bar: '#27ae60', text: '#1e8449' }
        };
        
        const color = colors[status];
        
        return `
            <div class="stat-card" data-stat="${id}" style="
                background: ${color.bg};
                border: 3px solid ${color.border};
                border-radius: 12px;
                padding: 15px;
                cursor: pointer;
                transition: all 0.3s;
                position: relative;
            " onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 8px 16px rgba(0,0,0,0.2)'" 
               onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'"
               onclick="StatsPanel.showTip('${name}', \`${tips}\`)">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
                    <div style="font-size: 35px;">${emoji}</div>
                    <div style="text-align: right;">
                        <div style="font-size: 24px; font-weight: bold; color: ${color.text};">${displayValue}${isDecimal ? '' : '%'}</div>
                        <div style="font-size: 12px; color: #7f8c8d;">${name}</div>
                    </div>
                </div>
                <div style="width: 100%; height: 8px; background: rgba(0,0,0,0.1); border-radius: 10px; overflow: hidden;">
                    <div style="width: ${Math.min(percentage, 100)}%; height: 100%; background: ${color.bar}; transition: width 0.3s;"></div>
                </div>
                <div style="position: absolute; top: 5px; right: 5px; font-size: 12px; color: ${color.text}; opacity: 0.7;">
                    ℹ️ Click for tips
                </div>
            </div>
        `;
    },
    
    createNutritionCard(id, emoji, name, current, target, unit, tips) {
        const percentage = (current / target) * 100;
        const status = percentage < 50 ? 'critical' : percentage < 80 ? 'warning' : 'good';
        
        const colors = {
            critical: { bg: '#fee', border: '#e74c3c', bar: '#e74c3c' },
            warning: { bg: '#ffeaa7', border: '#f39c12', bar: '#f39c12' },
            good: { bg: '#d5f4e6', border: '#27ae60', bar: '#27ae60' }
        };
        
        const color = colors[status];
        
        return `
            <div class="stat-card" data-stat="${id}" style="
                background: ${color.bg};
                border: 2px solid ${color.border};
                border-radius: 10px;
                padding: 12px;
                cursor: pointer;
                transition: all 0.3s;
            " onmouseover="this.style.transform='scale(1.05)'" 
               onmouseout="this.style.transform='scale(1)'"
               onclick="StatsPanel.showTip('${name}', \`${tips}\`)">
                <div style="font-size: 28px; text-align: center; margin-bottom: 5px;">${emoji}</div>
                <div style="font-size: 18px; font-weight: bold; text-align: center; color: #2c3e50;">${Math.round(current)}</div>
                <div style="font-size: 11px; text-align: center; color: #7f8c8d; margin-bottom: 5px;">${name} (${target}${unit})</div>
                <div style="width: 100%; height: 6px; background: rgba(0,0,0,0.1); border-radius: 10px; overflow: hidden;">
                    <div style="width: ${Math.min(percentage, 100)}%; height: 100%; background: ${color.bar};"></div>
                </div>
            </div>
        `;
    },
    
    createSkillCard(id, emoji, name, level, tips) {
        const percentage = (level / 100) * 100;
        
        return `
            <div class="stat-card" data-stat="${id}" style="
                background: linear-gradient(135deg, #fff, #f8f9fa);
                border: 2px solid #ddd;
                border-radius: 10px;
                padding: 15px;
                cursor: pointer;
                transition: all 0.3s;
            " onmouseover="this.style.borderColor='#3498db'; this.style.boxShadow='0 4px 12px rgba(52,152,219,0.3)'" 
               onmouseout="this.style.borderColor='#ddd'; this.style.boxShadow='none'"
               onclick="StatsPanel.showTip('${name}', \`${tips}\`)">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                    <div style="font-size: 32px;">${emoji}</div>
                    <div style="text-align: right;">
                        <div style="font-size: 22px; font-weight: bold; color: #3498db;">Lv ${level}</div>
                        <div style="font-size: 11px; color: #7f8c8d;">${name}</div>
                    </div>
                </div>
                <div style="width: 100%; height: 6px; background: #ecf0f1; border-radius: 10px; overflow: hidden;">
                    <div style="width: ${percentage}%; height: 100%; background: linear-gradient(90deg, #3498db, #2980b9);"></div>
                </div>
            </div>
        `;
    },
    
    showTip(statName, tipText) {
        const tipOverlay = document.createElement('div');
        tipOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10001;
            animation: fadeIn 0.3s;
        `;
        
        tipOverlay.innerHTML = `
            <div style="
                background: white;
                border-radius: 20px;
                padding: 30px;
                max-width: 500px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.3);
                animation: slideUp 0.3s;
            ">
                <h2 style="color: #2c3e50; margin-bottom: 15px; display: flex; align-items: center; gap: 10px;">
                    <span style="font-size: 40px;">💡</span>
                    <span>How to Improve: ${statName}</span>
                </h2>
                <p style="font-size: 16px; line-height: 1.6; color: #555; margin-bottom: 20px;">
                    ${tipText}
                </p>
                <button onclick="this.closest('div[style*=fixed]').remove()" style="
                    width: 100%;
                    padding: 12px;
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    color: white;
                    border: none;
                    border-radius: 10px;
                    font-size: 16px;
                    font-weight: bold;
                    cursor: pointer;
                    transition: all 0.3s;
                " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                    Got it! ✓
                </button>
            </div>
        `;
        
        document.body.appendChild(tipOverlay);
        
        // Close on background click
        tipOverlay.addEventListener('click', (e) => {
            if (e.target === tipOverlay) {
                tipOverlay.remove();
            }
        });
    },
    
    close() {
        const overlay = document.getElementById('statsPanel');
        if (overlay) {
            overlay.remove();
        }
    }
};
