# 🎮 Life Skills Academy - Complete User Guide

## 📖 Game Overview

**Life Skills Academy** is an educational life simulation game designed to teach real-world skills through interactive gameplay. Players manage a student character navigating daily life, balancing school, household responsibilities, nutrition, and personal well-being.

**Target Audience:** Teens and young adults learning essential life skills  
**Platform:** Browser-based (desktop)  
**Genre:** Educational Life Simulation  
**Technology:** Vanilla JavaScript + Three.js (no frameworks required)

---

## 🎯 Game Objectives

- **Survive and Thrive:** Maintain your needs (hunger, energy, hygiene, happiness, health)
- **Learn Life Skills:** Master cooking, cleaning, budgeting, and time management
- **Excel Academically:** Attend school, complete homework, and maintain a good GPA
- **Build Independence:** Cook meals, complete chores, and earn money
- **Unlock Achievements:** Complete challenges to earn badges and rewards

---

## 🕹️ How to Play

### Starting the Game
1. Create your character (name, age, grade)
2. You start at home with $100 and basic supplies
3. The game begins on Day 1 at 7:00 AM

### Controls & Navigation
- **Click locations** in the city to travel (Home, School, Store, Park, Gym, etc.)
- **Click your name** at the top to view detailed stats and improvement tips
- **Click activities** within locations to perform them (cook, study, exercise, etc.)
- **Time flows automatically** - watch the clock in the top right
- **Menu button** opens settings, save, and quit options

---

## ⏰ Time System

### How Time Works
- **Real-time flow:** 1 real second = 1 game minute (adjustable speed)
- **Time pauses** during minigames (cooking, chores)
- **Time advances** after completing activities (e.g., cooking eggs takes 10 minutes)
- **Daily schedule:** 
  - 7:00 AM - Wake up
  - 8:00 AM - 3:00 PM - School (weekdays)
  - 3:00 PM - 10:00 PM - Free time
  - 10:00 PM+ - Sleep recommended

### Day/Night Cycle
- **Weekdays:** School is mandatory (8 AM - 3 PM)
- **Weekends:** Free time all day
- **Sleep:** Rest to restore energy (7-9 hours recommended)

---

## 💪 Needs System

### Five Core Needs (0-100%)

| Need | What It Does | How to Restore | Warning Signs |
|------|-------------|----------------|---------------|
| **🍔 Hunger** | Determines if you're fed | Eat meals or snacks | <30% = Low energy, can't focus |
| **⚡ Energy** | Required for activities | Sleep 7-9 hours | <30% = Sluggish, poor performance |
| **🚿 Hygiene** | Cleanliness & health | Shower daily, do chores | <30% = Health decreases |
| **😊 Happiness** | Mood & motivation | Complete tasks, socialize, eat tasty food | <30% = Depression risk |
| **❤️ Health** | Overall well-being | Eat balanced meals, exercise, maintain all needs | <30% = Get sick, miss school |

### Automatic Decay
- **Hunger:** Decreases ~5% per hour
- **Energy:** Decreases ~3% per hour (faster during activities)
- **Hygiene:** Decreases ~2% per hour
- **Happiness:** Stable if needs are met, drops if neglected
- **Health:** Drops if other needs stay low for extended periods

---

## 🍳 Cooking & Nutrition System

### How to Cook
1. Go to **Home** location
2. Click **"Kitchen"** or **"Cook a Meal"**
3. Browse **20+ recipes** by category (Breakfast, Lunch, Dinner, Snacks)
4. Click a recipe to see:
   - Cook time (minutes)
   - Ingredients needed
   - Nutritional info (calories, protein, carbs, fats, vitamins)
   - Difficulty level
5. Click **"Start Cooking"** to play the minigame
6. Complete cooking challenges (crack eggs, whisk, slice, flip, etc.)
7. **Time advances** by cook time after completion
8. **Nutrition applied** to your daily totals

### Nutrition Tracking
| Nutrient | Daily Target | Found In | Benefits |
|----------|-------------|----------|----------|
| **🔥 Calories** | 2000 kcal | All foods | Energy for daily activities |
| **🥩 Protein** | 50g | Eggs, meat, fish, beans | Muscle repair, growth |
| **🍞 Carbs** | 250g | Bread, pasta, rice | Quick energy |
| **🥑 Fats** | 70g | Nuts, oils, avocado | Brain function, vitamin absorption |
| **🍊 Vitamins** | 100% | Fruits, vegetables | Immune system, health boost |

### Quick Snacks vs. Cooking
- **Store Snacks:** Instant hunger relief, costs money ($2-10), less nutritious
- **Home Cooking:** Takes time, uses ingredients, teaches skills, more nutritious, often healthier

### Sample Recipes
- **Breakfast:** Scrambled Eggs (10 min), Pancakes (15 min), Oatmeal (5 min)
- **Lunch:** Sandwiches (5 min), Salads (10 min), Pasta (20 min)
- **Dinner:** Grilled Chicken (25 min), Baked Fish (30 min), Stir Fry (20 min)
- **Snacks:** Fruit Smoothie (5 min), Toast (3 min)

---

## 🧹 Chores System

### Available Chores
Each chore has a **fun minigame** and rewards you with money and happiness!

| Chore | Duration | Reward | Minigame | What You Learn |
|-------|----------|--------|----------|----------------|
| **🛏️ Make Bed** | 2 min | $5 | Drag items in order (Sheet → Blanket → Pillow) | Organization, sequencing |
| **🍽️ Wash Dishes** | 5 min | $10 | Click dirty dishes to clean them | Responsibility |
| **🧹 Vacuum** | 10 min | $15 | Move mouse over dirt to clean | Attention to detail |
| **🗑️ Take Out Trash** | 2 min | $5 | Drag trash bags to bin | Daily maintenance |
| **👕 Do Laundry** | 15 min | $20 | Sort by wash temp (cold/warm) then dry method (hang/dryer) | Reading care labels, fabric care |

### Laundry Game (Most Complex!)
**Phase 1: Washing**
- Click clothes to see care label
- Sort into **Cold Wash** (❄️ delicates, bright colors) or **Warm Wash** (🔥 whites, heavily soiled)

**Phase 2: Drying**
- Sort clean clothes into **Hang Dry** (🪝 shrink-prone items) or **Machine Dry** (🌀 sturdy fabrics)
- Learn real laundry care skills!

### Benefits of Chores
- ✅ Earn money ($5-20 per chore)
- ✅ Increase happiness (+10)
- ✅ Improve hygiene (+5)
- ✅ Build cleaning skill
- ✅ Unlock "Clean Freak" achievement (10 chores)

---

## 📚 School & Academics

### School Schedule
- **Time:** 8:00 AM - 3:00 PM (Monday-Friday)
- **Attendance:** Automatic if you're awake and at home before 8 AM
- **Missing School:** Lowers GPA, may trigger warnings

### Homework System
- Assigned automatically after school
- View homework in your stats or at home
- Complete homework to improve grades
- **Tip:** Do homework before bed to maintain GPA

### GPA (Grade Point Average)
- **Scale:** 0.0 - 4.0
- **4.0** = Straight A's (Perfect!)
- **3.0-3.9** = Good student
- **2.0-2.9** = Average
- **Below 2.0** = Struggling (need to improve)

### How to Improve Grades
1. **Never miss school** (attendance matters!)
2. **Complete all homework** before deadlines
3. **Study regularly** (coming in future updates)
4. **Maintain high energy** (eat well, sleep enough)
5. **Keep stress low** (balance work and fun)

---

## 💰 Money Management

### Earning Money
- **Chores:** $5-20 per chore (main income source for students)
- **Part-time Jobs:** (Coming in future updates)
- **Allowance:** (Coming in future updates)

### Spending Money
- **Store Snacks:** $2-10 (instant hunger relief)
- **Ingredients:** Prices vary (for cooking at home)
- **Clothing & Items:** (Coming in future updates)

### Budgeting Tips
- **Cook at home** instead of buying snacks (cheaper, healthier)
- **Do chores regularly** to maintain steady income
- **Save for big purchases** (plan ahead)
- **Track spending** in your stats panel

---

## 🏆 Skills & Progression

### Life Skills (Level 0-100)

**👨‍🍳 Cooking**
- Increases with each meal cooked
- Higher level = unlock complex recipes
- Improves meal quality and speed

**🧹 Cleaning**
- Increases with each chore completed
- Higher level = faster chores, better rewards
- Unlocks efficiency bonuses

**💬 Social**
- Increases through interactions
- Higher level = better relationships
- Unlocks social opportunities

**💪 Fitness**
- Increases through exercise
- Higher level = better energy recovery
- Improves health maintenance

---

## 🎯 Stats Panel (Click Your Name!)

### What You'll See
1. **Personal Info:** Name, age, grade, money
2. **Basic Needs:** Hunger, energy, hygiene, happiness, health (with color-coded warnings)
3. **Daily Nutrition:** Calories, protein, carbs, fats, vitamins vs. targets
4. **Academic Performance:** GPA, homework completion
5. **Life Skills:** Cooking, cleaning, social, fitness levels
6. **Lifetime Statistics:** Total meals cooked, chores done, achievements earned

### How to Use It
- **Click any stat** to see improvement tips
- **Color coding:**
  - 🟢 Green = Good (70-100%)
  - 🟡 Yellow = Warning (30-69%)
  - 🔴 Red = Critical (<30%)
- **Progress bars** show where you stand
- **Tips explain** exactly how to improve each stat

---

## 🎮 Locations & Activities

### 🏠 Home
- **Kitchen:** Cook meals, eat snacks
- **Bedroom:** Sleep, do homework
- **Bathroom:** Shower (restore hygiene)
- **Living Room:** Do chores, relax

### 🏫 School
- Attend classes (weekdays 8 AM - 3 PM)
- Complete homework
- Socialize with classmates

### 🏪 Store
- Buy snacks for instant hunger relief
- Buy ingredients for cooking
- Browse items and supplies

### 🏞️ Park (Coming Soon)
- Exercise (improve fitness)
- Socialize (meet friends)
- Relax (restore happiness)

### 💪 Gym (Coming Soon)
- Work out (improve fitness & health)
- Take classes
- Build strength

---

## 🏅 Achievements System

Unlock achievements by completing challenges!

### Available Achievements
- **🍳 Master Chef:** Cook 50 meals
- **🧹 Clean Freak:** Complete 10 chores
- **📚 Honor Student:** Maintain 3.5+ GPA for 30 days
- **💰 Money Manager:** Save $500
- **⚡ Early Bird:** Wake up before 7 AM for 7 days straight
- **🏋️ Fitness Fanatic:** Exercise 30 times
- *...and many more!*

### Why Achievements Matter
- Track your progress
- Earn bragging rights
- Unlock special rewards (coming soon)
- Learn goal-setting skills

---

## 💡 Tips for Success

### Daily Routine (Recommended)
1. **7:00 AM** - Wake up, shower
2. **7:30 AM** - Eat nutritious breakfast (cook eggs, oatmeal)
3. **8:00 AM - 3:00 PM** - Attend school
4. **3:30 PM** - Do 1-2 chores (earn money)
5. **5:00 PM** - Complete homework
6. **6:00 PM** - Cook dinner (balanced meal)
7. **7:00 PM** - Free time (socialize, exercise, relax)
8. **9:00 PM** - Evening snack if needed
9. **10:00 PM** - Sleep (get 8-9 hours)

### Priority Management
**Always Keep Above 30%:**
- Hunger (eat regularly)
- Energy (sleep enough)
- Hygiene (shower daily)

**Check Daily:**
- Have you eaten 3 meals?
- Did you complete homework?
- Are you earning enough money?

### Common Mistakes to Avoid
❌ Skipping meals (hunger drops too low)
❌ Staying up too late (energy crashes)
❌ Ignoring chores (miss out on money & skills)
❌ Buying too many snacks (expensive, unhealthy)
❌ Missing school (GPA tanks)

### Pro Strategies
✅ **Batch cooking:** Make multiple meals in one session
✅ **Morning chores:** Do quick chores (bed, trash) before school
✅ **Balanced diet:** Track nutrition targets, aim for variety
✅ **Sleep schedule:** Go to bed same time every night
✅ **Weekend prep:** Do laundry, big chores on weekends

---

## 🎨 Game Features Summary

### ✅ Currently Implemented
- ✅ Real-time clock with day/night cycle
- ✅ Five-need system (hunger, energy, hygiene, happiness, health)
- ✅ Comprehensive nutrition tracking (calories, protein, carbs, fats, vitamins)
- ✅ 20+ cooking recipes with interactive minigames
- ✅ Five chore types with unique minigames
- ✅ Realistic laundry game (wash temp + dry method sorting)
- ✅ School attendance and GPA system
- ✅ Homework assignments
- ✅ Money earning through chores
- ✅ Detailed stats panel with improvement tips
- ✅ Achievements system
- ✅ Skills progression (cooking, cleaning, social, fitness)
- ✅ Save/load system (localStorage)
- ✅ Time advancement during activities

### 🚧 Coming Soon
- 🔜 Store shopping (buy ingredients, snacks, items)
- 🔜 Park & Gym locations
- 🔜 Exercise activities
- 🔜 Social interactions & relationships
- 🔜 Part-time jobs
- 🔜 Random events & challenges
- 🔜 Expanded cooking recipes (40+)
- 🔜 More achievements
- 🔜 Character customization
- 🔜 Multiple save slots

---

## 🐛 Troubleshooting

### Common Issues

**"Time isn't advancing!"**
- Check if you're in a minigame (time pauses during games)
- Check time speed setting (may be paused)

**"My needs are dropping too fast!"**
- This is intentional! Real life requires constant maintenance
- Set up a daily routine
- Check stats panel for improvement tips

**"I can't afford food!"**
- Do chores to earn money
- Cook at home instead of buying snacks
- Check pantry for free ingredients

**"My GPA is low!"**
- Never miss school
- Complete all homework on time
- Get enough sleep before school
- Keep energy high

**"Minigame is too hard!"**
- You can skip minigames (button at bottom)
- Practice makes perfect!
- Some games (like laundry) teach real skills

---

## 📚 Educational Value

### Real-World Skills Taught
1. **Time Management:** Balance school, chores, sleep
2. **Nutrition:** Learn daily requirements, read labels
3. **Cooking:** Follow recipes, understand techniques
4. **Budgeting:** Earn, save, and spend wisely
5. **Hygiene:** Daily routines, cleanliness importance
6. **Laundry Care:** Read labels, sort properly, prevent damage
7. **Responsibility:** Complete tasks, maintain standards
8. **Goal Setting:** Track achievements, plan ahead
9. **Self-Care:** Monitor needs, prevent burnout
10. **Decision Making:** Prioritize tasks, allocate resources

### Perfect For
- Teens preparing to live independently
- Young adults in college/first apartment
- Anyone wanting to learn life skills in a fun way
- Parents teaching responsibility to children
- Educators supplementing life skills curriculum

---

## 🎓 Quick Start Guide (TL;DR)

1. **Create character** → Start at home with $100
2. **Click your name** → View stats and tips
3. **Go to Kitchen** → Cook breakfast (learn cooking minigame)
4. **Do a chore** → Earn money, learn responsibility
5. **Go to School** (8 AM weekdays) → Maintain GPA
6. **Check stats regularly** → Keep all needs >30%
7. **Sleep before midnight** → Restore energy
8. **Repeat daily** → Build skills, earn achievements!

---

## 📞 Need Help?

- **Click your name** for detailed stats and tips
- **Click any stat** in the stats panel for improvement advice
- **Hover over items** to see tooltips
- **Watch the clock** to manage time
- **Check achievements** to see what goals to work toward

---

**Welcome to Life Skills Academy! Learn, grow, and master the art of independent living!** 🎓✨
