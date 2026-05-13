// ADD THIS SECTION to renderServices() function in postoffice.js:

    // Tax Filing Service
    if (GameState.taxes.w2Forms && GameState.taxes.w2Forms.length > 0 && !GameState.taxes.filedThisYear) {
        html += `
            <div class="card">
                <div class="card-title">📝 File Taxes</div>
                <div class="card-content">
                    <p>Tax season is here! We can help you file your tax return.</p>
                    <p><strong>W-2 forms available: ${GameState.taxes.w2Forms.length}</strong></p>
                    ${GameState.taxes.owedTaxes > 0 ? 
                        `<div class="alert alert-warning">⚠️ You owe $${GameState.taxes.owedTaxes.toFixed(2)} in taxes!</div>` : 
                        ''
                    }
                    <button class="btn btn-primary" onclick="TaxSystem.showTaxFilingMinigame()">
                        📝 File Tax Return
                    </button>
                </div>
            </div>
        `;
    }
    
    // Pay Owed Taxes
    if (GameState.taxes.owedTaxes > 0) {
        html += `
            <div class="card">
                <div class="card-title">💳 Pay Taxes</div>
                <div class="card-content">
                    <p>Amount owed: <strong style="color: #e74c3c;">$${GameState.taxes.owedTaxes.toFixed(2)}</strong></p>
                    <button class="btn btn-danger" onclick="TaxSystem.payTaxes(); loadPostOffice();">
                        💳 Pay Now
                    </button>
                </div>
            </div>
        `;
    }
