// ==================== CHECK WRITING MINIGAME (FIXED) ====================

window.CheckWritingMinigame = {
    payee: '',
    amount: 0,
    
    start(payee, amount) {
        console.log('✍️ Starting check writing minigame:', payee, amount);
        this.payee = payee;
        this.amount = amount;
        this.showCheckForm();
    },
    
    showCheckForm() {
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.id = 'checkWritingMinigame';
        overlay.style.display = 'flex';
        overlay.style.zIndex = '2000';
        
        const today = new Date();
        const dateStr = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;
        
        let html = `
            <div class="modal-content" style="max-width: 800px;">
                <div style="text-align: center; padding-bottom: 20px; border-bottom: 3px solid #3498db;">
                    <h2 style="margin: 0; font-size: 32px;">✍️ Write a Check</h2>
                    <p style="color: #7f8c8d; margin: 10px 0 0 0;">Fill out all fields correctly</p>
                </div>
                
                <div style="background: linear-gradient(135deg, #e8f5e9, #c8e6c9); border: 3px solid #4caf50; border-radius: 10px; padding: 30px; margin: 30px 0; font-family: 'Courier New', monospace;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
                        <div style="font-weight: bold;">YOUR NAME<br/>${GameState.player.name}</div>
                        <div style="text-align: right;">
                            <label style="font-size: 12px; color: #666; display: block;">DATE</label>
                            <input type="text" id="checkDate" value="${dateStr}" style="
                                width: 150px;
                                padding: 8px;
                                border: none;
                                border-bottom: 2px solid #333;
                                background: transparent;
                                font-family: 'Courier New', monospace;
                            " />
                        </div>
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="font-size: 12px; color: #666; display: block;">PAY TO THE ORDER OF</label>
                        <input type="text" id="checkPayee" value="${this.payee}" style="
                            width: 100%;
                            padding: 10px;
                            border: none;
                            border-bottom: 2px solid #333;
                            background: transparent;
                            font-family: 'Courier New', monospace;
                            font-size: 16px;
                        " />
                    </div>
                    
                    <div style="display: flex; gap: 20px; margin-bottom: 20px;">
                        <div style="flex: 1;">
                            <label style="font-size: 12px; color: #666; display: block;">AMOUNT (NUMERIC)</label>
                            <div style="display: flex; align-items: center;">
                                <span style="font-size: 20px; font-weight: bold; margin-right: 5px;">$</span>
                                <input type="number" id="checkAmountNum" value="${this.amount}" step="0.01" style="
                                    flex: 1;
                                    padding: 10px;
                                    border: none;
                                    border-bottom: 2px solid #333;
                                    background: transparent;
                                    font-family: 'Courier New', monospace;
                                    font-size: 18px;
                                    font-weight: bold;
                                " />
                            </div>
                        </div>
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="font-size: 12px; color: #666; display: block;">AMOUNT (IN WORDS)</label>
                        <input type="text" id="checkAmountWords" placeholder="e.g., Twenty-five and 50/100 dollars" style="
                            width: 100%;
                            padding: 10px;
                            border: none;
                            border-bottom: 2px solid #333;
                            background: transparent;
                            font-family: 'Courier New', monospace;
                            font-size: 16px;
                        " />
                        <button class="btn btn-small" onclick="CheckWritingMinigame.fillWords()" style="margin-top: 10px;">
                            💡 Auto-fill words
                        </button>
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="font-size: 12px; color: #666; display: block;">MEMO (OPTIONAL)</label>
                        <input type="text" id="checkMemo" placeholder="What's this check for?" style="
                            width: 100%;
                            padding: 10px;
                            border: none;
                            border-bottom: 2px solid #333;
                            background: transparent;
                            font-family: 'Courier New', monospace;
                            font-size: 14px;
                        " />
                    </div>
                    
                    <div style="border-top: 2px solid #333; padding-top: 20px;">
                        <label style="font-size: 12px; color: #666; display: block;">SIGNATURE</label>
                        <input type="text" id="checkSignature" placeholder="Sign your name" style="
                            width: 100%;
                            padding: 10px;
                            border: none;
                            border-bottom: 2px solid #333;
                            background: transparent;
                            font-family: 'Brush Script MT', cursive;
                            font-size: 24px;
                        " />
                    </div>
                </div>
                
                <div style="background: #fff3cd; border: 2px solid #ffc107; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
                    <strong>💡 Check Writing Tips:</strong>
                    <ul style="margin: 10px 0 0 20px;">
                        <li>Write amounts carefully - no erasures allowed!</li>
                        <li>Write amount in words to prevent fraud</li>
                        <li>Always sign your checks</li>
                        <li>Use a pen, never pencil</li>
                        <li>Keep a record of checks you write</li>
                    </ul>
                </div>
                
                <div style="display: flex; gap: 15px; justify-content: center;">
                    <button class="btn btn-success btn-large" onclick="CheckWritingMinigame.validate()">
                        ✅ Submit Check
                    </button>
                    <button class="btn btn-secondary" onclick="CheckWritingMinigame.close()">
                        Cancel
                    </button>
                </div>
            </div>
        `;
        
        overlay.innerHTML = html;
        document.body.appendChild(overlay);
    },
    
    fillWords() {
        const amount = parseFloat(document.getElementById('checkAmountNum').value);
        if (isNaN(amount)) {
            UI.showNotification('❌ Enter a valid amount first!', 'error');
            return;
        }
        
        const words = this.numberToWords(amount);
        document.getElementById('checkAmountWords').value = words;
        UI.showNotification('✅ Amount converted to words!', 'success');
    },
    
    numberToWords(amount) {
        const dollars = Math.floor(amount);
        const cents = Math.round((amount - dollars) * 100);
        
        const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
        const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', '
