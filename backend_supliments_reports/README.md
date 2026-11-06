# FitNova Backend (Supplements & Reports Service)

Production-level REST API backend built with **Python 3.13 / 3.14**, **Django 6**, **Django REST Framework (DRF)**, **SimpleJWT**, and **MySQL 8** (with SQLite fallback).

---

## 🏛️ Overall FitNova Database Models Architecture
Agar pure FitNova project ke saare models ki baat karein (Chahe MySQL tables ho ya MongoDB collections), pure platform ke liye ye models/collections required hote hain:

| Domain / App | Model / Collection Name | Purpose |
|---|---|---|
| **Accounts** | `User` | Authentication (email, password, roles, is_verified) |
| **Profile** | `UserProfile` | Height, current weight, target weight, activity level, fitness goal |
| **Workouts** | `Exercise` | Exercise library (chest, back, legs, instructions, GIF/video) |
| | `WorkoutPlan` | Routine templates (Push-Pull-Legs, Full Body, Upper-Lower) |
| | `WorkoutLog` / `WorkoutSet` | User's daily logged sets, reps, weight lifted, duration, calories burned |
| **Nutrition** | `FoodItem` | Nutrition database (calories, protein, carbs, fats, fiber per serving) |
| | `MealLog` / `MealEntry` | Daily user logs (Breakfast, Lunch, Dinner, Snack) |
| **Water** | `WaterDailyLog` | Water intake tracking (glasses / liters consumed vs daily goal) |
| **Progress** | `BodyMeasurementLog` | Body measurements (chest, waist, arms, hips) & BMI |
| | `ProgressPhoto` | Front, side, back physique pictures |
| **Supplements** ⭐ | `SupplementCategory` | Category taxonomy (Protein, Creatine, Pre-Workout, etc.) |
| *(Your module)* | `SupplementProduct` | Featured & marketplace supplement products |
| | `UserSupplementStack` | User's active stack (dosage, timing, start date, status) |
| | `SupplementReminder` | Scheduled intake alarms and notification times |
| | `SupplementDailyLog` | Daily intake tracking & streak calculations |
| | `SupplementGoal` | Progress towards supplement goals (Muscle Gain, Recovery) |
| | `SupplementWishlist` & `Cart` | Wishlist and cart persistence |
| | `SupplementArticle` | Educational guides & fitness tips |
| **Reports** ⭐ | `DailyHealthLog` | Daily unified snapshot (calories in/out, macros, water, weight, sleep, workouts) |
| *(Your module)* | `ReportGoal` | Target goal cards (Weight, Protein, Water, Workout targets) |
| | `ReportAreaOfImprovement` | Targeted action items (e.g. Increase Water Intake, Sleep Consistency) |
| | `ReportAIInsight` | AI generated summary banner & consistency analysis |
| | `RecentActivity` | Recent timeline activities |
| **AI Coach** | `AIChatHistory` | Conversations with AI Nutrition / Workout Coach |
| | `AIRecommendation` | Automated weekly plan adjustments |
| **Notifications** | `PushNotification` | System reminders and streak alerts |

---

## 🚀 Setup & Installation

### 1. Configure Environment (`.env`)
Backend directory ke andar `.env` file already create ho chuki hai.
Agar aapko MySQL 8 use karna hai to:
```env
DB_ENGINE=mysql
DB_NAME=fitnova_db
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_HOST=127.0.0.1
DB_PORT=3306
```
> **Note:** Agar MySQL database abhi ready nahi hai, to `.env` me `DB_ENGINE=sqlite` rakhein. Backend bina kisi configuration ke turant chalega!

### 2. Run Database Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### 3. Seed Initial Supplements & Content
Humne ek custom management command create kiya hai jo frontend ka saara sample data database me insert kar deta hai:
```bash
python manage.py seed_supplements
```

### 4. Run Test Suite
```bash
python manage.py test accounts.tests supplements.tests reports.tests
```

### 5. Start Server
```bash
python manage.py runserver 8000
```
Server `http://127.0.0.1:8000/` par run hoga.

---

## 📡 API Endpoints Reference

### 🔐 Authentication (`/api/auth/`)
- `POST /api/auth/register/` - Register new user
- `POST /api/auth/login/` - Login & obtain JWT Access + Refresh token
- `POST /api/auth/token/refresh/` - Refresh JWT token
- `GET/PUT /api/auth/me/` - Current user profile (Requires `Authorization: Bearer <token>`)

### 💊 Supplements (`/api/supplements/`)
- `GET /api/supplements/categories/` - List all supplement categories
- `GET /api/supplements/products/` - List featured products (supports `?category=protein` and `?search=whey`)
- `GET /api/supplements/products/{id}/` - Product details
- `GET /api/supplements/overview/` - High-level metrics (`activeCount`, `completedCount`, `streakDays`, `remindersCount`, `goals`)
- `GET/POST /api/supplements/stack/` - List and add to personal supplement stack
- `PUT/DELETE /api/supplements/stack/{id}/` - Update or remove from stack
- `GET/POST /api/supplements/reminders/` - List and add intake reminders
- `POST /api/supplements/reminders/{id}/toggle/` - Toggle reminder on/off
- `GET/POST /api/supplements/logs/` - Log daily supplement intake
- `GET/POST /api/supplements/goals/` - Manage supplement goals
- `GET/POST /api/supplements/wishlist/` - User wishlist items
- `GET/POST /api/supplements/cart/` - User cart items
- `GET /api/supplements/articles/` - Educational tips & articles

### 📊 Reports & Analytics (`/api/reports/`)
- `GET /api/reports/analytics/?period=7d` - **Main Analytics Endpoint**.
  Supports `?period=7d|30d|3m|1y` and returns:
  - `kpi_metrics`: Calories, Protein, Water, Workouts with % changes and sparklines
  - `calorie_intake_vs_burn`: Chart data
  - `macronutrient_distribution`: Carbs, Protein, Fats percentages and amounts
  - `weight_progress`: Current weight, comparison, and trend points
  - `body_composition`: Muscle %, Fat %, Water %
  - `top_performing_days`: Highest adherence days
  - `areas_for_improvement`: Actionable recommendations
  - `report_summary`: Daily averages
  - `report_goals`: Goal progress bars
  - `recent_activity`: Timeline
  - `ai_insight`: Performance headline & description
- `GET/POST /api/reports/logs/` - CRUD for daily health metrics
- `GET/POST /api/reports/goals/` - CRUD for user report goals
- `GET/POST /api/reports/improvements/` - Action items
- `GET/POST /api/reports/activities/` - Recent activity records

