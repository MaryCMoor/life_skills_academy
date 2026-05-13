// ==================== INVESTMENT BROKER LOCATION ====================

function loadBroker() {
    document.getElementById('locationTitle').textContent = '📈 Investment Broker';
    
    if (GameState.player.age < 18) {
        const content = `
            <div class="alert alert-warning">
                ⚠️ You must be 18 years old to open an investment account.
            </div>
            
            <div class="card">
                <div class="card-title">Learn About Investing</div>
                <div class="card-content">
                    <p>Investing allows you to grow your wealth over time!</p>
                    <ul>
                        <li>📈 Stocks represent ownership in companies</li>
                        <li>💰 Stock prices go up and down</li>
                        <li>⏳ Long-term investing typically beats short-term trading</li>
                        <li>🎯 Diversification reduces risk</li>
                        <li>📊 Research before investing</li>
                    </ul>
                    <p class="mt-20"><strong>Come back when you turn 18!</strong></p>
                </div>
            </div>
        `;
        document.getElementById('locationContent').innerHTML = content;
        return;
    }
    
    const content = `
        <div class="tabs">
            <div class="tab active" onclick="showBrokerTab('account')">My Account</div>
            <div class="tab" onclick="showBrokerTab('market')">Stock Market</div>
            <div class="tab" onclick="showBrokerTab('portfolio')">My Portfolio</div>
            <div class="tab" onclick="showBrokerTab('learn')">Learn</div>
        </div>
        
        <div id="broker-account" class="tab-content active">
            ${renderBrokerAccount()}
        </div>
        
        <div id="broker-market" class="tab-content">
            ${renderStockMarket()}
        </div>
        
        <div id="broker-portfolio" class="tab-content">
            ${renderPortfolio()}
        </div>
        
        <div id="broker-learn" class="tab-content">
            ${renderInvestingEducation()}
        </div>
    `;
    
    document.getElementById('locationContent').innerHTML = content;
}

function showBrokerTab(tab) {
    document.querySelectorAll('#locationContent .tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('#locationContent .tab-content').forEach(t => t.classList.remove('active'));
    
    event.target.classList.add('active');
    document.getElementById(`broker-${tab}`).classList.add('active');
}

function renderBrokerAccount() {
    const portfolioValue = StockMarket.getPortfolioValue();
    const totalValue = GameState.investments.cashForInvesting + portfolioValue;
    const totalReturns = portfolioValue + GameState.investments.cashForInvesting - GameState.investments.totalInvested;
    const returnPercent = GameState.investments.totalInvested > 0 ? 
        (totalReturns / GameState.investments.totalInvested) * 100 : 0;
    
    let html = '<h3>💼 Investment Account</h3>';
    
    html += `
        <div class="stats-display">
            <div class="stat-box">
                <div class="icon">💵</div>
                <div class="label">Cash Available</div>
                <div class="value">$${GameState.investments.cashForInvesting.toFixed(2)}</div>
            </div>
            <div class="stat-box">
                <div class="icon">📊</div>
                <div class="label">Portfolio Value</div>
                <div class="value">$${portfolioValue.toFixed(2)}</div>
            </div>
            <div class="stat-box">
                <div class="icon">💎</div>
                <div class="label">Total Account Value</div>
                <div class="value">$${totalValue.toFixed(2)}</div>
            </div>
            <div class="stat-box">
                <div class="icon">📈</div>
                <div class="label">Total Returns</div>
                <div class="value" style="color: ${totalReturns >= 0 ? '#27ae60' : '#e74c3c'}">
                    ${totalReturns >= 0 ? '+' : ''}$${totalReturns.toFixed(2)}
                    <br><small>(${returnPercent.toFixed(1)}%)</small>
                </div>
            </div>
        </div>
    `;
    
    html += `
        <div class="content-grid mt-20">
            <div class="card">
                <div class="card-title">💵 Transfer to Investments</div>
                <div class="card-content">
                    <p>Cash on hand: $${GameState.money.cash.toFixed(2)}</p>
                    <div class="form-group">
                        <label>Amount to transfer:</label>
                        <input type="number" id="transferIn" min="0" max="${GameState.money.cash}" step="0.01" placeholder="0.00">
                    </div>
                    <button class="btn btn-success" onclick="transferToInvestments()">Transfer In</button>
                </div>
            </div>
            
            <div class="card">
                <div class="card-title">💸 Transfer to Cash</div>
                <div class="card-content">
                    <p>Investment cash: $${GameState.investments.cashForInvesting.toFixed(2)}</p>
                    <div class="form-group">
                        <label>Amount to withdraw:</label>
                        <input type="number" id="transferOut" min="0" max="${GameState.investments.cashForInvesting}" step="0.01" placeholder="0.00">
                    </div>
                    <button class="btn btn-primary" onclick="transferFromInvestments()">Transfer Out</button>
                </div>
            </div>
        </div>
    `;
    
    html += `
        <div class="info-box mt-20">
            <h4>💡 Account Tips:</h4>
            <ul>
                <li>Transfer cash in before buying stocks</li>
                <li>Keep some cash for buying opportunities</li>
                <li>Don't invest money you need soon</li>
                <li>Check your portfolio regularly</li>
            </ul>
        </div>
    `;
    
    return html;
}

function renderStockMarket() {
    const prices = StockMarket.getCurrentPrices();
    const stocks = ['SPY', 'AAPL', 'TSLA', 'MSFT', 'AMZN'];
    
    let html = '<h3>📊 Stock Market</h3>';
    html += `<div class="alert alert-info">Cash available: $${GameState.investments.cashForInvesting.toFixed(2)}</div>`;
    
    html += '<div class="content-grid">';
    
    stocks.forEach(symbol => {
        const info = StockMarket.getStockInfo(symbol);
        const canAfford = GameState.investments.cashForInvesting >= info.price;
        const changeColor = info.change >= 0 ? '#27ae60' : '#e74c3c';
        const changeSymbol = info.change >= 0 ? '▲' : '▼';
        
        html += `
            <div class="card">
                <div class="card-title">${Utils.escapeHtml(info.symbol)}</div>
                <div class="card-content">
                    <p>${Utils.escapeHtml(info.name)}</p>
                    <div style="font-size: 32px; font-weight: bold; margin: 15px 0; color: #2c3e50;">
                        $${info.price.toFixed(2)}
                    </div>
                    <div style="color: ${changeColor}; font-weight: bold; margin-bottom: 15px;">
                        ${changeSymbol} $${Math.abs(info.change).toFixed(2)} (${Math.abs(info.changePercent).toFixed(2)}%)
                    </div>
                    
                    <div class="form-group">
                        <label>Shares to buy:</label>
                        <input type="number" id="shares-${symbol}" min="1" value="1" style="width: 100%;">
                    </div>
                    
                    <div style="margin-bottom: 10px; color: #7f8c8d; font-size: 14px;">
                        Total cost: $<span id="cost-${symbol}">${info.price.toFixed(2)}</span>
                    </div>
                    
                    ${canAfford ?
                        `<button class="btn btn-success" onclick="buyStock('${symbol}')">Buy</button>` :
                        '<button class="btn" disabled>💰 Need More Cash</button>'
                    }
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    
    setTimeout(() => {
        stocks.forEach(symbol => {
            const input = document.getElementById(`shares-${symbol}`);
            const cost = document.getElementById(`cost-${symbol}`);
            if (input && cost) {
                input.addEventListener('input', () => {
                    const info = StockMarket.getStockInfo(symbol);
                    const shares = parseInt(input.value) || 1;
                    cost.textContent = (info.price * shares).toFixed(2);
                });
            }
        });
    }, 100);
    
    return html;
}

function renderPortfolio() {
    const portfolio = GameState.investments.portfolio;
    
    let html = '<h3>💼 My Portfolio</h3>';
    
    if (portfolio.length === 0) {
        html += `
            <div class="alert alert-info">
                You don't own any stocks yet. Visit the Stock Market tab to buy!
            </div>
        `;
        return html;
    }
    
    html += '<table class="data-table"><thead><tr><th>Symbol</th><th>Shares</th><th>Buy Price</th><th>Current Price</th><th>Value</th><th>Gain/Loss</th><th>Action</th></tr></thead><tbody>';
    
    portfolio.forEach((holding, index) => {
        const info = StockMarket.getStockInfo(holding.symbol);
        const currentValue = info.price * holding.shares;
        const gainLoss = currentValue - holding.totalCost;
        const gainLossPercent = (gainLoss / holding.totalCost) * 100;
        const color = gainLoss >= 0 ? '#27ae60' : '#e74c3c';
        
        html += `
            <tr>
                <td><strong>${Utils.escapeHtml(holding.symbol)}</strong></td>
                <td>${holding.shares}</td>
                <td>$${holding.purchasePrice.toFixed(2)}</td>
                <td>$${info.price.toFixed(2)}</td>
                <td>$${currentValue.toFixed(2)}</td>
                <td style="color: ${color}; font-weight: bold;">
                    ${gainLoss >= 0 ? '+' : ''}$${gainLoss.toFixed(2)}
                    <br><small>(${gainLossPercent.toFixed(1)}%)</small>
                </td>
                <td>
                    <button class="btn btn-danger" onclick="sellStock(${index})">Sell</button>
                </td>
            </tr>
        `;
    });
    
    html += '</tbody></table>';
    
    return html;
}

function renderInvestingEducation() {
    return `
        <h3>📚 Learn About Investing</h3>
        
        <div class="card">
            <div class="card-title">What Are Stocks?</div>
            <div class="card-content">
                <p>Stocks represent ownership in a company. When you buy a stock, you own a small piece of that company!</p>
                <ul>
                    <li><strong>Share Price:</strong> The cost of one share</li>
                    <li><strong>Market Value:</strong> Current share price × shares owned</li>
                    <li><strong>Dividends:</strong> Some companies pay shareholders</li>
                    <li><strong>Capital Gains:</strong> Profit when you sell for more than you paid</li>
                </ul>
            </div>
        </div>
        
        <div class="card mt-20">
            <div class="card-title">Investment Strategies</div>
            <div class="card-content">
                <ul>
                    <li><strong>Buy and Hold:</strong> Invest for the long term (years)</li>
                    <li><strong>Diversification:</strong> Don't put all eggs in one basket</li>
                    <li><strong>Dollar-Cost Averaging:</strong> Invest same amount regularly</li>
                    <li><strong>Research:</strong> Understand what you're buying</li>
                    <li><strong>Risk Tolerance:</strong> Only invest what you can afford to lose</li>
                </ul>
            </div>
        </div>
        
        <div class="card mt-20">
            <div class="card-title">Understanding ETFs</div>
            <div class="card-content">
                <p><strong>SPY</strong> is an ETF (Exchange-Traded Fund) that tracks the S&P 500.</p>
                <ul>
                    <li>Owns shares of 500 large US companies</li>
                    <li>Instant diversification</li>
                    <li>Lower risk than individual stocks</li>
                    <li>Great for beginners</li>
                </ul>
            </div>
        </div>
        
        <div class="alert alert-warning mt-20">
            ⚠️ <strong>Important:</strong> Stock prices in this game use real historical data, but past performance doesn't guarantee future results!
        </div>
    `;
}

function transferToInvestments() {
    const input = document.getElementById('transferIn');
    if (!input) return;
    
    const amount = parseFloat(input.value);
    if (isNaN(amount) || amount <= 0) {
        UI.showNotification('❌ Invalid amount!', 'error');
        return;
    }
    
    if (StockMarket.transferToInvestments(amount)) {
        loadBroker();
        UI.updateStats();
    }
}

function transferFromInvestments() {
    const input = document.getElementById('transferOut');
    if (!input) return;
    
    const amount = parseFloat(input.value);
    if (isNaN(amount) || amount <= 0) {
        UI.showNotification('❌ Invalid amount!', 'error');
        return;
    }
    
    if (StockMarket.transferFromInvestments(amount)) {
        loadBroker();
        UI.updateStats();
    }
}

function buyStock(symbol) {
    const input = document.getElementById(`shares-${symbol}`);
    if (!input) return;
    
    const shares = parseInt(input.value);
    if (isNaN(shares) || shares <= 0) {
        UI.showNotification('❌ Invalid number of shares!', 'error');
        return;
    }
    
    if (StockMarket.buyStock(symbol, shares)) {
        loadBroker();
        UI.updateStats();
    }
}

function sellStock(index) {
    const holding = GameState.investments.portfolio[index];
    if (!holding) return;
    
    if (!confirm(`Sell all ${holding.shares} shares of ${holding.symbol}?`)) {
        return;
    }
    
    if (StockMarket.sellStock(index)) {
        loadBroker();
        UI.updateStats();
    }
}

console.log('✅ broker.js loaded');
