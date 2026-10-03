# AI Khet Saathi (एआई खेत साथी)

> **Production-Style Farmer Digital Record Book & AI Assistant Frontend**

AI Khet Saathi is a responsive web application designed for farmers to maintain digital records of farming activities, crop timelines, expenses, reminders, and leverage an AI assistant for intelligent crop record analysis.

---

## 🌾 Key Features

- **Multi-Farm Management**: Manage multiple farms with village location, area (acres/hectares), notes, and field photos.
- **Crop Lifecycle Tracking**: Register crops, varieties, sowing dates, expected harvest dates, and total crop expenses.
- **Activity System & Timeline**: Record sowing, irrigation, spray, fertilizer, pest/disease, weeding, and harvest activities with per-activity expense/cost entry and harvest gain tracking.
- **Crop & Farm Profitability**: Automatic calculation of **Total Expenses**, **Harvest Revenue**, and **Net Profit** per crop and per farm.
- **Reminder System**: Track upcoming, today's, overdue, and completed reminders with one-click **Mark Done** and **Snooze 2 Days** actions.
- **Expense Analytics**: Detailed breakdown of input costs with visual Recharts (Category Pie Chart & Crop-wise Bar Chart) and smart receipt photo upload OCR.
- **AI Khet Saathi Assistant**: Intelligent chat assistant answering natural questions in English, Hindi, or Marathi (e.g. *"Last spray kab kiya?"*, *"Is month kya activities hui?"*, *"Soybean profit kitna hai?"*).
- **"Tell Khet Saathi" Natural Activity Logger**: Type or speak natural sentences (e.g. *"Aaj subah soybean ko paani diya"*) to auto-extract activity type, crop, date, and cost for quick confirmation.
- **Multi-Language Support (i18n)**: Switch seamlessly between **English**, **हिंदी (Hindi)**, and **मराठी (Marathi)**.
- **Admin Command Portal**: Dedicated system oversight dashboard (`/admin`) for tracking aggregate farmers, farms, crops, system activities, and broadcasting regional advisories.

---

## 🛠️ Technology Stack

- **Frontend Framework**: React 18 + Vite
- **Routing**: React Router DOM v6
- **Styling**: Tailwind CSS (Earthy agricultural theme)
- **Icons**: Lucide React
- **Charts**: Recharts
- **Mock Service Layer**: `src/api/mockApi.js` with simulated asynchronous API delays & `localStorage` persistence.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000/](http://localhost:3000/) in your browser.

### 3. Build Production Bundle
```bash
npm run build
```

---

## 📂 Project Structure

```
src/
├── api/
│   └── mockApi.js              # Full mock API layer with CRUD, cost tracking, & AI parser
├── components/
│   ├── ai/                     # VoiceTextLogger & AIChatBubble
│   ├── charts/                 # Recharts visualizations
│   ├── common/                 # Button, Card, Input, Modal, ConfirmModal, ImageUploader, etc.
│   ├── dashboard/              # StatsOverview, QuickActions, ProminentReminder
│   └── timeline/               # ActivityTimeline
├── context/
│   ├── AuthContext.jsx         # User profile & Farmer/Admin role switcher
│   ├── LanguageContext.jsx     # i18n locale manager (EN, HI, MR)
│   └── NotificationContext.jsx # Toast alerts & notifications
├── data/
│   └── translations.js         # Translation dictionary
├── pages/
│   ├── admin/                  # Admin Dashboard, Farmers, Farms, Crops, Activities, Reports
│   ├── auth/                   # Login, Register, Forgot Password
│   └── farmer/                 # All 21 Farmer screens & detail views
├── App.jsx                     # Route registry
└── main.jsx                    # Vite entry point
```

---

## 📄 License

MIT License © 2026 Developer-Rushikesh
