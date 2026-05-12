// ==================== CHECK WRITING MINIGAME (FIXED) ====================

window.CheckWritingMinigame = {
    payee: '',
    amount: 0,
    
    start: function(payee, amount) {
        console.log('✍️ Starting check writing minigame:', payee, amount);
        this.payee = payee;
        this.amount = amount;
        this.showCheckForm();
    },
    
    showCheckForm: function() {
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.id = 'checkWritingMinigame';
        overlay.style.display = 'flex';
        overlay.style.zIndex = '2000';
        
        const today = new Date();
        const dateStr = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear();
        
        let html = '<div class="modal-content" style="max-width: 800px;">';
        html += '<div style="text-align: center; padding-bottom: 20px; border-bottom: 3px solid #3498db;">';
        html += '<h2 style="margin: 0; font-size: 32px;">✍️ Write a Check</h2>';
        html += '<p style="color: #7f8c8d; margin: 10px 0 0 0;">Fill out all fields correctly</p>';
        html += '</div>';
        
        html += '<div style="background: linear-gradient(135deg, #e8f5e9, #c8e6c9); border: 3px solid #4caf50; border-radius: 10px; padding: 30px; margin: 30px 0; font-family: \'Courier New\', monospace;">';
        html += '<div style="display: flex; justify-content: space-between; margin-bottom: 20px;">';
        html += '<div style="font-weight: bold;">YOUR NAME<br/>' + GameState.player.name + '</div>';
        html += '<div style="text-align: right;"><label style="font-size: 12px; color: #666; display: block;">DATE</label>';
        html += '<input type="text" id="checkDate" value="' + dateStr + '" style="width: 150px; padding: 8px; border: none; border-bottom: 2px solid #333; background: transparent; font-family: \'Courier New\', monospace;" /></div>';
        html += '</div>';
        
        html += '<div style="margin-bottom: 20px;"><label style="font-size: 12px; color: #666; display: block;">PAY TO THE ORDER OF</label>';
        html += '<input type="text" id="checkPayee" value="' + this.payee + '" style="width: 100%; padding: 10px; border: none; border-bottom: 2px solid #333; background: transparent; font-family: \'Courier New\', monospace; font-size: 16px;" /></div>';
        
        html += '<div style="display: flex; gap: 20px; margin-bottom: 20px;"><div style="flex: 1;"><label style="font-size: 12px; color: #666; display: block;">AMOUNT (NUMERIC)</label>';
        html += '<div style="display: flex; align-items: center;"><span style="font-size: 20px; font-weight: bold; margin-right: 5px;">$</span>';
        html += '<input type="number" id="checkAmountNum" value="' + this.amount + '" step="0.01" style="flex: 1; padding: 10px; border: none; border-bottom: 2px solid #333; background: transparent; font-family: \'Courier New\', monospace; font-size: 18px; font-weight: bold;" /></div></div></div>';
        
        html += '<div style="margin-bottom: 20px;"><label style="font-size: 12px; color: #666; display: block;">AMOUNT (IN WORDS)</label>';
        html += '<input type="text" id="checkAmountWords" placeholder="e.g., Twenty-five and 50/100 dollars" style="width: 100%; padding: 10px; border: none; border-bottom: 2px solid #333; background: transparent; font-family: \'Courier New\', monospace; font-size: 16px;" />';
        html += '<button class="btn btn-small" onclick="CheckWritingMinigame.fillWords()" style="margin-top: 10px;">💡 Auto-fill words</button></div>';
        
        html += '<div style="margin-bottom: 20px;"><label style="font-size: 12px; color: #666; display: block;">MEMO (OPTIONAL)</label>';
        html += '<input type="text" id="checkMemo" placeholder="What\'s this check for?" style="width: 100%; padding: 10px; border: none; border-bottom: 2px solid #333; background: transparent; font-family: \'Courier New\', monospace; font-size: 14px;" /></div>';
        
        html += '<div style="border-top: 2px solid #333; padding-top: 20px;"><label style="font-size: 12px; color: #666; display: block;">SIGNATURE</label>';
        html += '<input type="text" id="checkSignature" placeholder="Sign your name" style="width: 100%; padding: 10px; border: none; border-bottom: 2px solid #333; background: transparent; font-family: \'Brush Script MT\', cursive; font-size: 24px;" /></div>';
        html += '</div>';
        
        html += '<div style="background: #fff3cd; border: 2px solid #ffc107; border-radius: 8px; padding: 15px; margin-bottom: 20px;">';
        html += '<strong>💡 Check Writing Tips:</strong><ul style="margin: 10px 0 0 20px;">';
        html += '<li>Write amounts carefully - no erasures allowed!</li>';
        html += '<li>Write amount in words to prevent fraud</li>';
        html += '<li>Always sign your checks</li>';
        html += '<li>Use a pen, never pencil</li>';
        html += '<li>Keep a record of checks you write</li></ul></div>';
        
        html += '<div style="display: flex; gap: 15px; justify-content: center;">';
        html += '<button class="btn btn-success btn-large" onclick="CheckWritingMinigame.validate()">✅ Submit Check</button>';
        html += '<button class="btn btn-secondary" onclick="CheckWritingMinigame.close()">Cancel</button>';
        html += '</div></div>';
        
        overlay.innerHTML = html;
        document.body.appendChild(overlay);
    },
    
    fillWords: function() {
        const amount = parseFloat(document.getElementById('checkAmountNum').value);
        if (isNaN(amount)) {
            UI.showNotification('❌ Enter a valid amount first!', 'error');
            return;
        }
        
        const words = this.numberToWords(amount);
        document.getElementById('checkAmountWords').value = words;
        UI.showNotification('✅ Amount converted to words!', 'success');
    },
    
    numberToWords: function(amount) {
        const dollars = Math.floor(amount);
        const cents = Math.round((amount - dollars) * 100);
        
        const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
        const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
        const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
        
        function convertLessThanThousand(n) {
            if (n === 0) return '';
            if (n < 10) return ones[n];
            if (n < 20) return teens[n - 10];
            if (n < 100) {
                return tens[Math.floor(n / 10)] + (n % 10 > 0 ? '-' + ones[n % 10] : '');
            }
            return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 > 0 ? ' ' + convertLessThanThousand(n % 100) : '');
        }
        
        let dollarWords = '';
        if (dollars === 0) {
            dollarWords = 'Zero';
        } else if (dollars < 1000) {
            dollarWords = convertLessThanThousand(dollars);
        } else {
            const thousands = Math.floor(dollars / 1000);
            const remainder = dollars % 1000;
            dollarWords = convertLessThanThousand(thousands) + ' Thousand';
            if (remainder > 0) {
                dollarWords += ' ' + convertLessThanThousand(remainder);
            }
        }
        
        return dollarWords + ' and ' + cents.toString().padStart(2, '0') + '/100 dollars';
    },
    
    validate: function() {
        const date = document.getElementById('checkDate').value.trim();
        const payee = document.getElementById('checkPayee').value.trim();
        const amountNum = document.getElementById('checkAmountNum').value;
        const amountWords = document.getElementById('checkAmountWords').value.trim();
        const signature = document.getElementById('checkSignature').value.trim();
        
        if (!date) {
            UI.showNotification('❌ Date is required!', 'error');
            return;
        }
        if (!payee) {
            UI.showNotification('❌ Payee name is required!', 'error');
            return;
        }
        if (!amountNum || parseFloat(amountNum) <= 0) {
            UI.showNotification('❌ Valid amount is required!', 'error');
            return;
        }
        if (!amountWords) {
            UI.showNotification('❌ Amount in words is required!', 'error');
            return;
        }
        if (!signature) {
            UI.showNotification('❌ Signature is required!', 'error');
            return;
        }
        
        this.complete();
    },
    
    complete: function() {
        GameState.addSkill('checkWriting', 10);
        GameState.spendMoney(this.amount, this.payee);
        
        UI.showNotification('✅ Check written successfully! -$' + this.amount.toFixed(2) + ', +10 check writing skill', 'success');
        
        if (GameState.skills.checkWriting >= 50) {
            GameState.addAchievement('Check Pro', 'Master check writing', '✍️');
        }
        
        this.close();
        UI.updateStats();
    },
    
    close: function() {
        const overlay = document.getElementById('checkWritingMinigame');
        if (overlay) {
            overlay.remove();
        }
        this.payee = '';
        this.amount = 0;
    }
};

console.log('✅ checkwriting.js loaded - CheckWritingMinigame ready');
