// ==================== STOCK MARKET SYSTEM ====================

const StockMarket = {
    historicalData: {
        'SPY': [
            3225, 3380, 2954, 2912, 3044, 3100, 3271, 3500, 3363, 3269, 3621, 3756,
            3714, 3811, 3380, 2584, 2912, 3044, 3130, 3271, 3397, 3500, 3633, 3621,
            3700, 3811, 3943, 3973, 4132, 4204, 4298, 4396, 4307, 4359, 4567, 4766,
            4515, 4373, 4131, 3955, 4132, 3900, 3825, 4080, 3970, 3871, 3840, 3839
        ],
        'AAPL': [
            77, 81, 71, 73, 79, 87, 109, 115, 106, 108, 122, 132,
            127, 136, 113, 71, 77, 82, 91, 106, 115, 125, 135, 130,
            137, 122, 128, 132, 131, 134, 142, 152, 145, 149, 171, 182,
            164, 175, 155, 138, 146, 142, 140, 169, 174, 185, 193, 185
        ],
        'TSLA': [
            134, 163, 127, 139, 177, 215, 275, 442, 430, 429, 585, 705,
            880, 798, 700, 565, 572, 625, 680, 700, 735, 755, 793, 690,
            793, 838, 875, 877, 681, 701, 863, 900, 754, 775, 1100, 1200,
            1000, 1050, 880, 620, 750, 695, 625, 800, 850, 900, 875, 790
        ],
        'MSFT': [
            157, 185, 158, 174, 184, 196, 202, 215, 210, 202, 214, 222,
            212, 232, 188, 158, 187, 184, 198, 214, 224, 230, 280, 223,
            228, 232, 245, 252, 277, 287, 305, 330, 281, 298, 378, 380,
            338, 372, 296, 249, 280, 260, 243, 310, 330, 360, 370, 370
        ],
        'AMZN': [
            1870, 2095, 1880, 2375, 2436, 2758, 3164, 3500, 3185, 3036, 3168, 3256,
            3380, 3380, 2954, 2000, 2375, 2440, 2890, 3200, 3308, 3400, 3444, 3200,
            3285, 3206, 3223, 3245, 3390, 3508, 3630, 3773, 3327, 3372, 3700, 3800,
            3400, 3700, 3000, 2200, 2800, 2600, 2450, 3100, 3200, 3400, 3500, 3300
        ]
    },
    
    currentMonth: 0,
    
    init() {
        this.currentMonth = 0;
        console.log('📈 Stock market initialized');
    },
    
    getCurrentPrices() {
        const prices = {};
        for (const symbol in this.historicalData) {
            const data = this.historicalData[symbol];
            const index = Math.min(this.currentMonth, data.length - 1);
            prices[symbol] = data[index];
        }
        return prices;
    },
    
    advanceMarket() {
        this.currentMonth = Math.min(this.currentMonth + 1, 
            this.historicalData['SPY'].length - 1);
        console.log(`📊 Stock market advanced to month ${this.currentMonth}`);
    },
    
    getStockInfo(symbol) {
        const prices = this.getCurrentPrices();
        const price = prices[symbol] || 0;
        
        const names = {
            'SPY': 'S&P 500 ETF',
            'AAPL': 'Apple Inc.',
            'TSLA': 'Tesla Inc.',
            'MSFT': 'Microsoft Corp.',
            'AMZN': 'Amazon.com Inc.'
        };
        
        let change = 0;
        let changePercent = 0;
        if (this.currentMonth > 0) {
            const prevPrice = this.historicalData[symbol][this.currentMonth - 1];
            change = price - prevPrice;
            changePercent = (change / prevPrice) * 100;
        }
        
        return {
            symbol: symbol,
            name: names[symbol] || symbol,
            price: price,
            change: change,
            changePercent: changePercent
        };
    },
    
    buyStock(symbol, shares) {
        const stockInfo = this.getStockInfo(symbol);
        const totalCost = stockInfo.price * shares;
        
        if (GameState.investments.cashForInvesting < totalCost) {
            UI.showNotification('❌ Not enough cash in investment account!', 'error');
            return false;
        }
        
        GameState.investments.cashForInvesting -= totalCost;
        
        const purchase = {
            symbol: symbol,
            shares: shares,
            purchasePrice: stockInfo.price,
            purchaseDate: new Date().toISOString(),
            totalCost: totalCost
        };
        
        GameState.investments.portfolio.push(purchase);
        GameState.investments.totalInvested += totalCost;
        
        GameState.investments.transactions.push({
            type: 'BUY',
            symbol: symbol,
            shares: shares,
            price: stockInfo.price,
            total: totalCost,
            date: new Date().toISOString()
        });
        
        UI.showNotification(`✅ Bought ${shares} shares of ${symbol} at $${stockInfo.price.toFixed(2)}`, 'success');
        GameState.addSkill('timeManagement', 5);
        
        return true;
    },
    
    sellStock(portfolioIndex) {
        const holding = GameState.investments.portfolio[portfolioIndex];
        if (!holding) {
            UI.showNotification('❌ Invalid stock selection!', 'error');
            return false;
        }
        
        const stockInfo = this.getStockInfo(holding.symbol);
        const proceeds = stockInfo.price * holding.shares;
        const profit = proceeds - holding.totalCost;
        
        GameState.investments.cashForInvesting += proceeds;
        GameState.investments.totalReturns += profit;
        
        GameState.investments.transactions.push({
            type: 'SELL',
            symbol: holding.symbol,
            shares: holding.shares,
            price: stockInfo.price,
            total: proceeds,
            profit: profit,
            date: new Date().toISOString()
        });
        
        GameState.investments.portfolio.splice(portfolioIndex, 1);
        
        const profitText = profit >= 0 ? 
            `profit of $${profit.toFixed(2)} 🎉` : 
            `loss of $${Math.abs(profit).toFixed(2)} 📉`;
        
        UI.showNotification(`✅ Sold ${holding.shares} shares of ${holding.symbol} for ${profitText}`, 
            profit >= 0 ? 'success' : 'warning');
        
        if (profit >= 100) {
            GameState.addAchievement('Profit Taker', 'Make $100+ profit on a stock trade', '💰');
        }
        
        return true;
    },
    
    getPortfolioValue() {
        let total = 0;
        GameState.investments.portfolio.forEach(holding => {
            const stockInfo = this.getStockInfo(holding.symbol);
            total += stockInfo.price * holding.shares;
        });
        return total;
    },
    
    transferToInvestments(amount) {
        if (GameState.money.cash < amount) {
            UI.showNotification('❌ Not enough cash!', 'error');
            return false;
        }
        
        GameState.money.cash -= amount;
        GameState.investments.cashForInvesting += amount;
        
        UI.showNotification(`✅ Transferred $${amount.toFixed(2)} to investment account`, 'success');
        return true;
    },
    
    transferFromInvestments(amount) {
        if (GameState.investments.cashForInvesting < amount) {
            UI.showNotification('❌ Not enough in investment account!', 'error');
            return false;
        }
        
        GameState.investments.cashForInvesting -= amount;
        GameState.money.cash += amount;
        
        UI.showNotification(`✅ Transferred $${amount.toFixed(2)} to cash`, 'success');
        return true;
    }
};

console.log('✅ stocks.js loaded');
