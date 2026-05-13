// ==================== TAX SYSTEM ====================

const TaxSystem = {
    TAX_DEADLINE: { month: 4, date: 15 },
    STANDARD_DEDUCTION: 13850,
    
    TAX_BRACKETS: [
        { max: 11000, rate: 0.10 },
        { max: 44725, rate: 0.12 },
        { max: 95375, rate: 0.22 },
        { max: Infinity, rate: 0.24 }
    ],
    
    init() {
        console.log('💼 Tax system initialized');
    },
    
    isTaxSeason() {
        return GameState.time.month >= 1 && GameState.time.month <= 4;
    },
    
    isOverdue() {
        if (GameState.time.year > GameState.taxes.lastFiledYear) {
            if (GameState.time.month > 4 || 
                (GameState.time.month === 4 && GameState.time.date > 15)) {
                return true;
            }
        }
        return false;
    },
    
    generateW2() {
        if (!GameState.work.currentJob) return null;
        
        const job = GameState.work.currentJob;
        const yearIncome = GameState.stats.hoursWorked * job.wage;
        
        const w2 = {
            year: GameState.time.year,
            employer: job.title,
            wages: yearIncome,
            federalTaxWithheld: yearIncome * 0.15,
            socialSecurity: yearIncome * 0.062,
            medicare: yearIncome * 0.0145,
            generatedDate: new Date().toISOString()
        };
        
        GameState.taxes.w2Forms.push(w2);
        GameState.taxes.yearlyIncome = yearIncome;
        
        console.log(`📄 W2 generated for ${job.title}: $${yearIncome.toFixed(2)}`);
        return w2;
    },
    
    calculateTaxes(income) {
        const taxableIncome = Math.max(0, income - this.STANDARD_DEDUCTION);
        let totalTax = 0;
        let remainingIncome = taxableIncome;
        
        for (let i = 0; i < this.TAX_BRACKETS.length; i++) {
            const bracket = this.TAX_BRACKETS[i];
            const prevMax = i > 0 ? this.TAX_BRACKETS[i - 1].max : 0;
            const taxableInBracket = Math.min(remainingIncome, bracket.max - prevMax);
            
            if (taxableInBracket > 0) {
                totalTax += taxableInBracket * bracket.rate;
                remainingIncome -= taxableInBracket;
            }
            
            if (remainingIncome <= 0) break;
        }
        
        return Math.round(totalTax * 100) / 100;
    },
    
    fileTaxes(formData) {
        const income = formData.wages || 0;
        const withheld = formData.federalTaxWithheld || 0;
        
        const taxOwed = this.calculateTaxes(income);
        const refundOrOwed = withheld - taxOwed;
        
        const filing = {
            year: GameState.time.year - 1,
            income: income,
            taxOwed: taxOwed,
            withheld: withheld,
            refundOrOwed: refundOrOwed,
            filedDate: new Date().toISOString()
        };
        
        GameState.taxes.taxHistory.push(filing);
        GameState.taxes.filedThisYear = true;
        GameState.taxes.lastFiledYear = GameState.time.year;
        
        if (refundOrOwed > 0) {
            GameState.taxes.refundsOwed = refundOrOwed;
            UI.showNotification(`🎉 Tax refund: $${refundOrOwed.toFixed(2)}!`, 'success');
            
            setTimeout(() => {
                GameState.addMoney(refundOrOwed, 'tax refund');
                GameState.taxes.refundsOwed = 0;
                UI.showNotification('💰 Tax refund deposited!', 'success');
                UI.updateStats();
            }, 3000);
        } else if (refundOrOwed < 0) {
            const owed = Math.abs(refundOrOwed);
            GameState.taxes.owedTaxes = owed;
            UI.showNotification(`⚠️ You owe $${owed.toFixed(2)} in taxes!`, 'warning');
        } else {
            UI.showNotification('✅ Taxes filed! No refund or payment needed.', 'success');
        }
        
        return filing;
    },
    
    payTaxes() {
        const owed = GameState.taxes.owedTaxes;
        
        if (owed <= 0) {
            UI.showNotification('✅ No taxes owed!', 'info');
            return;
        }
        
        if (GameState.money.cash < owed) {
            UI.showNotification('❌ Not enough cash to pay taxes!', 'error');
            return;
        }
        
        if (GameState.spendMoney(owed, 'taxes')) {
            GameState.taxes.owedTaxes = 0;
            UI.showNotification('✅ Taxes paid!', 'success');
            GameState.addSkill('budgeting', 10);
            return true;
        }
        
        return false;
    },
    
    showTaxFilingMinigame() {
        if (!GameState.taxes.w2Forms || GameState.taxes.w2Forms.length === 0) {
            UI.showNotification('❌ No W2 forms available!', 'error');
            return;
        }
        
        const latestW2 = GameState.taxes.w2Forms[GameState.taxes.w2Forms.length - 1];
        
        const overlay = document.createElement('div');
        overlay.className = 'minigame-overlay active';
        overlay.id = 'taxFilingGame';
        
        let html = `
            <div class="minigame-container" style="max-width: 900px;">
                <div class="minigame-header">
                    <div class="minigame-title">📝 File Your Taxes</div>
                    <div class="minigame-subtitle">Form 1040-EZ (Simple Tax Return)</div>
                </div>
                
                <div style="margin: 30px 0;">
                    <div class="card" style="background: #e8f5e9; border: 2px solid #4caf50;">
                        <div class="card-title">📄 Your W-2 Form (${latestW2.year})</div>
                        <div class="card-content">
                            <div class="info-row">
                                <span class="info-label">Employer:</span>
                                <span class="info-value">${Utils.escapeHtml(latestW2.employer)}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Wages, tips, compensation:</span>
                                <span class="info-value">$${latestW2.wages.toFixed(2)}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Federal tax withheld:</span>
                                <span class="info-value">$${latestW2.federalTaxWithheld.toFixed(2)}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Social Security wages:</span>
                                <span class="info-value">$${latestW2.socialSecurity.toFixed(2)}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Medicare wages:</span>
                                <span class="info-value">$${latestW2.medicare.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="card mt-20">
                        <div class="card-title">Form 1040-EZ</div>
                        <div class="card-content">
                            <div class="form-group">
                                <label>1. Total wages (from W-2 box 1):</label>
                                <input type="number" id="tax-wages" step="0.01" placeholder="Enter wages from W-2">
                            </div>
                            
                            <div class="form-group">
                                <label>2. Taxable interest (enter 0 if none):</label>
                                <input type="number" id="tax-interest" value="0" step="0.01">
                            </div>
                            
                            <div class="form-group">
                                <label>3. Adjusted gross income (line 1 + line 2):</label>
                                <input type="number" id="tax-agi" readonly placeholder="Auto-calculated">
                            </div>
                            
                            <div class="alert alert-info">
                                💡 <strong>Standard Deduction:</strong> $${this.STANDARD_DEDUCTION.toLocaleString()}
                                <br>This amount is automatically subtracted from your income.
                            </div>
                            
                            <div class="form-group">
                                <label>4. Taxable income (line 3 minus standard deduction):</label>
                                <input type="number" id="tax-taxable" readonly placeholder="Auto-calculated">
                            </div>
                            
                            <div class="form-group">
                                <label>5. Federal tax withheld (from W-2 box 2):</label>
                                <input type="number" id="tax-withheld" step="0.01" placeholder="Enter federal tax withheld">
                            </div>
                            
                            <div class="form-group">
                                <label>6. Tax owed on taxable income:</label>
                                <input type="number" id="tax-owed" readonly placeholder="Auto-calculated">
                            </div>
                            
                            <div class="form-group">
                                <label>7. Refund or Amount You Owe:</label>
                                <input type="number" id="tax-refund" readonly placeholder="Auto-calculated" style="font-weight: bold; font-size: 18px;">
                            </div>
                        </div>
                    </div>
                    
                    <div class="info-box mt-20">
                        <h4>📚 Tax Filing Tips:</h4>
                        <ul>
                            <li>Copy numbers exactly from your W-2 form</li>
                            <li>The standard deduction reduces your taxable income</li>
                            <li>If withheld > owed, you get a refund</li>
                            <li>If withheld < owed, you must pay</li>
                            <li>File by April 15 to avoid penalties</li>
                        </ul>
                    </div>
                </div>
                
                <div class="minigame-actions">
                    <button class="btn btn-success btn-large" onclick="TaxSystem.submitTaxReturn()">
                        📤 Submit Tax Return
                    </button>
                    <button class="btn-skip" onclick="TaxSystem.closeTaxGame()">Cancel</button>
                </div>
            </div>
        `;
        
        overlay.innerHTML = html;
        document.body.appendChild(overlay);
        
        this.setupTaxCalculations();
    },
    
    setupTaxCalculations() {
        const wagesInput = document.getElementById('tax-wages');
        const interestInput = document.getElementById('tax-interest');
        const agiInput = document.getElementById('tax-agi');
        const taxableInput = document.getElementById('tax-taxable');
        const withheldInput = document.getElementById('tax-withheld');
        const owedInput = document.getElementById('tax-owed');
        const refundInput = document.getElementById('tax-refund');
        
        const calculate = () => {
            const wages = parseFloat(wagesInput.value) || 0;
            const interest = parseFloat(interestInput.value) || 0;
            const withheld = parseFloat(withheldInput.value) || 0;
            
            const agi = wages + interest;
            const taxable = Math.max(0, agi - this.STANDARD_DEDUCTION);
            const owed = this.calculateTaxes(agi);
            const refund = withheld - owed;
            
            agiInput.value = agi.toFixed(2);
            taxableInput.value = taxable.toFixed(2);
            owedInput.value = owed.toFixed(2);
            refundInput.value = refund.toFixed(2);
            
            if (refund > 0) {
                refundInput.style.color = '#27ae60';
                refundInput.value = '+$' + refund.toFixed(2) + ' REFUND';
            } else if (refund < 0) {
                refundInput.style.color = '#e74c3c';
                refundInput.value = '-$' + Math.abs(refund).toFixed(2) + ' OWED';
            } else {
                refundInput.style.color = '#7f8c8d';
                refundInput.value = '$0.00';
            }
        };
        
        wagesInput.addEventListener('input', calculate);
        interestInput.addEventListener('input', calculate);
        withheldInput.addEventListener('input', calculate);
    },
    
    submitTaxReturn() {
        const wages = parseFloat(document.getElementById('tax-wages').value) || 0;
        const withheld = parseFloat(document.getElementById('tax-withheld').value) || 0;
        
        if (wages <= 0) {
            UI.showNotification('❌ Please enter your wages!', 'error');
            return;
        }
        
        const latestW2 = GameState.taxes.w2Forms[GameState.taxes.w2Forms.length - 1];
        
        const wagesCorrect = Math.abs(wages - latestW2.wages) < 1;
        const withheldCorrect = Math.abs(withheld - latestW2.federalTaxWithheld) < 1;
        
        if (!wagesCorrect || !withheldCorrect) {
            UI.showNotification('❌ Numbers don\'t match your W-2! Check your entries.', 'error');
            return;
        }
        
        this.fileTaxes({ wages, federalTaxWithheld: withheld });
        this.closeTaxGame();
        
        GameState.addAchievement('Tax Filer', 'Successfully file your first tax return', '📝');
        GameState.addSkill('budgeting', 15);
        
        UI.showNotification('✅ Tax return filed successfully!', 'success');
    },
    
    closeTaxGame() {
        const overlay = document.getElementById('taxFilingGame');
        if (overlay && overlay.parentNode) {
            overlay.parentNode.removeChild(overlay);
        }
    }
};

console.log('✅ taxes.js loaded');
