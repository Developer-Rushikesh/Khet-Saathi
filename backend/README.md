# 🌾 Khet Sathi (खेत साथी) — Django REST Backend

> **Production-Grade Farmer Digital Record Book & Data-Grounded AI Assistant Backend API**

---

## 📌 Project Overview

**Khet Sathi Backend** is built using **Python, Django 5.0, Django REST Framework, and JWT Authentication**. It provides a secure, relational database backend for farmers to manage multi-farm operations, crop lifecycles, activity timeline tracking with worker/labor cost calculations, reminder scheduling via Celery/Redis, expense analytics, and a database-grounded AI Assistant.

---

## 🚀 Key Features

1. **JWT Authentication & Role Isolation**:
   - Phone/Email authentication, registration, password management.
   - Strict ownership isolation: Farmers can only access their own farms, crops, activities, reminders, and financial records.
   - Admin oversight role for system analytics and broadcasts.

2. **Farm & Crop Management**:
   - Full CRUD for multi-farm acreage tracking (Acres/Hectares).
   - Crop lifecycle management (variety, season, sowing date, expected harvest date, status).

3. **Activity Timeline & Labor Cost Engine**:
   - Track Sowing, Irrigation, Spray, Fertilizer, Pest/Disease, Weeding, Harvest, and Other activities.
   - **Worker Cost Tracking**: Records worker count (`person_count`), daily wage rate (`cost_per_person`), automatically calculates labor cost & total activity cost, and syncs linked crop expenses automatically.

4. **Celery & Redis Scheduled Reminders**:
   - Automated background worker task to detect due/overdue reminders and push in-app notifications to farmers.
   - Statuses: `PENDING`, `COMPLETED`, `SNOOZED`, `CANCELLED`.

5. **Expense & Revenue Financial Reports**:
   - Automated calculation of crop-wise expenses, category breakdowns, harvest revenues, and net profit margins.

6. **Data-Grounded AI Assistant**:
   - `POST /api/ai/chat/`: Queries user database records (no hallucinated dates or fake history).
   - `POST /api/ai/parse-activity/`: Parses natural language sentences (e.g. *"Aaj subah soybean ko paani diya"*) into structured draft activity JSON for farmer confirmation.

7. **OpenAPI / Swagger Documentation**:
   - Auto-generated Swagger UI (`/api/docs/`) and Redoc (`/api/redoc/`).

---

## 🛠️ Tech Stack

- **Framework**: Django 5.0 + Django REST Framework 3.14
- **Auth**: SimpleJWT (JSON Web Tokens)
- **Database**: PostgreSQL (with automatic SQLite fallback for rapid dev/testing)
- **Background Tasks**: Celery 5.3 + Redis
- **CORS**: `django-cors-headers`
- **Documentation**: `drf-spectacular` (OpenAPI 3.0)

---

## 📂 Project Structure

```
backend/
├── manage.py
├── requirements.txt
├── .env.example
├── .env
├── README.md
├── config/
│   ├── settings.py          # Central Django configuration
│   ├── urls.py              # Root API URL router & Swagger endpoints
│   ├── celery.py            # Celery background task setup
│   ├── wsgi.py
│   └── asgi.py
└── apps/
    ├── accounts/            # Custom User model, JWT Auth, Register, Login, Profile, Unit Tests
    ├── farms/               # Farm CRUD & ownership checks
    ├── crops/               # Crop lifecycle management
    ├── activities/          # Activity logger with labor/worker cost engine
    ├── reminders/           # Scheduled reminders & Celery tasks
    ├── expenses/            # Expense breakdown & receipt uploads
    ├── notifications/       # User notification system
    ├── ai_assistant/        # Grounded RAG AI engine & NLP activity parser
    └── reports/             # Aggregated dashboard analytics & financial summaries
```

---

## ⚙️ Installation & Setup Guide

### 1. Prerequisites
- Python 3.10+ installed
- Redis server running (optional, required for Celery background tasks)

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Key environment variables in `.env`:
```env
SECRET_KEY=django-insecure-khet-saathi-production-secret-key-2026
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# Set USE_SQLITE_FALLBACK=False to connect to local PostgreSQL
USE_SQLITE_FALLBACK=True
DB_ENGINE=django.db.backends.postgresql
DB_NAME=khetsaathi_db
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
```

---

## 🗄️ Database Migrations & Seed Demo Data

### 1. Apply Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### 2. Seed Initial Demo Data
Run the built-in management command to seed demo farmer, farms, crops, activities, reminders, expenses, and admin accounts:
```bash
python manage.py seed_demo_data
```

**Seed Credentials Created**:
- **Farmer User**: `ramesh@example.com` / `password123`
- **Admin User**: `admin@example.com` / `adminpassword123`

---

## 🚀 Running the Server & Celery Worker

### 1. Start Django REST API Server
```bash
python manage.py runserver 8000
```
API Root: [http://127.0.0.1:8000/api/](http://127.0.0.1:8000/api/)  
Swagger UI: [http://127.0.0.1:8000/api/docs/](http://127.0.0.1:8000/api/docs/)  
Django Admin: [http://127.0.0.1:8000/admin/](http://127.0.0.1:8000/admin/)

### 2. Start Celery Background Worker (Optional)
```bash
celery -A config worker --loglevel=info
```

---

## 🧪 Running Automated Unit Tests

Run the backend test suite:
```bash
python manage.py test apps/accounts
```

---

## 📑 Core API Endpoints

### 🔑 Authentication (`/api/auth/`)
- `POST /api/auth/register/` — Register new farmer
- `POST /api/auth/login/` — Login & receive JWT access + refresh tokens
- `POST /api/auth/refresh/` — Refresh access token
- `GET /api/auth/profile/` — Fetch current user profile

### 🏡 Farms & Crops (`/api/farms/`, `/api/crops/`)
- `GET, POST /api/farms/` — List / Create user farms
- `GET, POST /api/crops/` — List / Create user crops (`?farm={id}&status=active`)

### 🚜 Activities (`/api/activities/`)
- `GET, POST /api/activities/` — List / Create activity records with labor tracking fields (`person_count`, `cost_per_person`, `material_cost`, `income`).
- Filters: `?crop={id}&activity_type=SPRAY&date_from=2026-06-01&date_to=2026-10-30`

### ⏰ Reminders (`/api/reminders/`)
- `GET /api/reminders/?filter=today` — Filter by `today`, `upcoming`, `overdue`, `completed`
- `PATCH /api/reminders/{id}/mark-completed/` — Mark reminder completed
- `PATCH /api/reminders/{id}/snooze/` — Snooze reminder by 2 days

### 🤖 AI Assistant (`/api/ai/`)
- `POST /api/ai/chat/` — Grounded RAG AI chat endpoint
- `POST /api/ai/parse-activity/` — Parses natural language text into structured activity draft

### 📊 Reports (`/api/reports/`)
- `GET /api/reports/dashboard/` — Aggregated dashboard statistics
- `GET /api/reports/crop/{id}/` — Detailed crop financials
- `GET /api/reports/expenses/` — Category & crop expense analytics
