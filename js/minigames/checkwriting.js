// ==================== CHECK WRITING MINIGAME (UPDATED) ====================

window.CheckWritingMinigame = {
    currentPayee: '',
    currentAmount: 0,
    
    start(payee, amount) {
        this.currentPayee = payee;
        this.currentAmount = amount;
        this.show();
    },
    
    show() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.id = 'checkModal';
        
        const date = new Date();
        const dateStr = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
        
        modal.innerHTML = `
            <div class="modal-content check-writing-minigame">
                <div class="minigame-header">
                    <h2>✍️ Write a Check</h2>
                    <button class="close-btn" onclick="CheckWritingMinigame.cancel()">×</button>
                </div>
                
                <div class="check-instructions">
                    <h3>How to Write a Check:</h3>
                    <ol>
                        <li>Write the date in the top right</li>
                        <li>Write the payee name on "Pay to the order of"</li>
                        <li>Write the amount in numbers in the box</li>
                        <li>Write the amount in words on the line</li>
                        <li>Write what the check is for in the memo</li>
                        <li>Sign your name at the bottom right</li>
                    </ol>
                </div>
                
                <div class="check-display">
                    <div class="check">
                        <div class="check-header">
                            <div class="check-number">Check #${Math.floor(Math.random() * 1000) + 1000}</div>
                            <div class="check-date">
                                <label>Date:</label>
                                <input type="text" id="checkDate" value="${dateStr}" readonly>
                            </div>
                        </div>
                        
                        <div class="check-payee">
                            <label>Pay to the order of:</label>
                            <input type="text" id="checkPayee" placeholder="Enter payee name">
                        </div>
                        
                        <div class="check-amount-box">
                            <label>$</label>
                            <input type="text" id="checkAmountNum" placeholder="0.00">
                        </div>
                        
                        <div class="check-amount-words">
                            <input type="text" id="checkAmountWords" placeholder="Amount in words">
                            <span class="dollars-label">Dollars</span>
                        </div>
                        
                        <div class="check-memo">
                            <label>Memo:</label>
                            <input type="text" id="checkMemo" placeholder="What is this for?">
                        </div>
                        
                        <div class="check-signature">
                            <label>Signature:</label>
                            <input type="text" id="checkSignature" placeholder="Sign your name">
                        </div>
                        
                        <div class="check-routing">
                            <span>⑈ 123456789 ⑈ 987654321 ⑈ ${Math.floor(Math.random() * 1000) + 1000}</span>
                        </div>
                    </div>
                </div>
                
                <div class="check-help">
                    <div class="help-box">
                        <strong>Expected:</strong><br>
                        Payee: ${this.currentPayee}<br>
                        Amount: $${this.currentAmount.toFixed(2)}<br>
                        Amount in words: ${this.numberToWords(this.currentAmount)}
                    </div>
                </div>
                
                <div class="minigame-actions">
                    <button class="btn btn-danger" onclick="CheckWritingMinigame.cancel()">Cancel</button>
                    <button class="btn btn-success" onclick="CheckWritingMinigame.validate()">✅ Submit Check</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    },
    
    validate() {
        const payee = document.getElementById('checkPayee').value.trim();
        const amountNum = document.getElementById('checkAmountNum').value.trim();
        const amountWords = document.getElementById('checkAmountWords').value.trim().toLowerCase();
        const memo = document.getElementById('checkMemo').value.trim();
        const signature = document.getElementById('checkSignature').value.trim();
        
        const errors = [];
        
        // Validate payee
        if (payee.toLowerCase() !== this.currentPayee.toLowerCase()) {
            errors.push('❌ Payee name doesn\'t match');
        }
        
        // Validate numeric amount
        const numAmount = parseFloat(amountNum);
        if (isNaN(numAmount) || Math.abs(numAmount - this.currentAmount) > 0.01) {
            errors.push('❌ Numeric amount is incorrect');
        }
        
        // Validate written amount
        const expectedWords = this.numberToWords(this.currentAmount).toLowerCase();
        if (!amountWords.includes(expectedWords.split(' ')[0])) {
            errors.push('❌ Written amount doesn\'t match');
        }
        
        // Validate memo
        if (!memo) {
            errors.push('⚠️ Memo is recommended but not required');
        }
        
        // Validate signature
        if (!signature) {
            errors.push('❌ Signature is required');
        }
        
        if (errors.length > 0) {
            UI.showNotification(errors.join('\n'), 'error');
            return;
        }
        
        this.complete();
    },
    
    complete() {
        document.getElementById('checkModal').remove();
        
        GameState.addSkill('checkWriting', 10);
        
        UI.showNotification('✅ Check written correctly!', 'success');
        
        if (GameState.skills.checkWriting >= 50) {
            GameState.addAchievement('Banking Pro', 'Reach 50 check writing skill', '✍️');
        }
        
        // Call payment completion if from post office
        if (window.completePayment) {
            window.completePayment(this.currentPayee, this.currentAmount);
        }
    },
    
    cancel() {
        document.getElementById('checkModal').remove();
        UI.showNotification('Check writing cancelled', 'info');
    },
    
    numberToWords(num) {
        if (num === 0) return 'Zero';
        
        const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
        const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
        const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
        
        const dollars = Math.floor(num);
        const cents = Math.round((num - dollars) * 100);
        
        let result = '';
        
        if (dollars >= 100) {
            result += ones[Math.floor(dollars / 100)] + ' Hundred ';
            const remainder = dollars % 100;
            if (remainder > 0) {
                if (remainder < 10) {
                    result += ones[remainder];
                } else if (remainder < 20) {
                    result += teens[remainder - 10];
                } else {
                    result += tens[Math.floor(remainder / 10)];
                    if (remainder % 10 > 0) {
                        result += ' ' + ones[remainder % 10];
                    }
                }
            }
        } else if (dollars >= 20) {
            result += tens[Math.floor(dollars / 10)];
            if (dollars % 10 > 0) {
                result += ' ' + ones[dollars % 10];
            }
        } else if (dollars >= 10) {
            result += teens[dollars - 10];
        } else {
            result += ones[dollars];
        }
        
        result += ' and ' + cents.toString().padStart(2, '0') + '/100';
        
        return result.trim();
    }
};
