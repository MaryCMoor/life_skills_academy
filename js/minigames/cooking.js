complete(money, skill) {
    GameState.addMoney(money, 'cooking');
    GameState.addSkill('cooking', skill);
    GameState.clearBusy();
    
    if (this.mistakes.length === 0) {
        GameState.addAchievement('Perfect Chef', 'Cook a recipe perfectly', '👨‍🍳');
    }
    
    if (GameState.skills.cooking >= 50) {
        GameState.addAchievement('Home Chef', 'Reach 50 cooking skill', '🍳');
    }
    
    // NEW: Add meal to fridge
    const mealNutrition = {
        calories: 500,
        protein: 20,
        carbs: 60,
        fats: 15,
        vitamins: 30,
        hunger: 40
    };
    
    GameState.addMealToFridge(this.currentRecipe.name, mealNutrition);
    GameState.stats.mealsCooked++;
    
    UI.showNotification(`✅ Cooking complete! +$${money}, +${skill} cooking skill`, 'success');
    UI.showNotification(`🧊 ${this.currentRecipe.name} added to fridge (expires in 3 days)`, 'info', 5000);
    
    this.close();
    
    if (typeof loadHome === 'function') {
        loadHome();
    }
    UI.updateStats();
},
