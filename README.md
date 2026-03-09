# Logbook.io 🚗

> A modern, full-stack vehicle expense tracking application built with Next.js 16 and Supabase.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61dafb?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ecf8e?logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwind-css)

## ✨ Features

- **🚗 Vehicle Management** — Add, edit, and track multiple vehicles with customizable details (make, model, year, plate number, mileage)
- **📊 Expense Tracking** — Log expenses across 6 categories: Fuel, Service, Insurance, Tuning, Travel, and Events
- **📈 Analytics Dashboard** — Visualize spending with pie charts, total expenses, and per-vehicle breakdowns
- **🌍 Localization Support** — Multi-currency, multi-unit (mi/km, gal/l), and date format preferences for 15+ countries
- **🏠 Default Vehicle** — Mark a primary vehicle for quick expense entry
- **🌙 Dark Mode** — System-aware light/dark theme toggle
- **📱 PWA Ready** — Installable Progressive Web App for mobile devices
- **🔐 Secure Authentication** — Google OAuth via Supabase with Row Level Security (RLS)

## 🏗️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 16 (App Router, Server Components) |
| **Language** | TypeScript |
| **Backend/DB** | Supabase (PostgreSQL + Auth) |
| **UI Library** | React 19 + Radix UI primitives |
| **Styling** | Tailwind CSS v4 + shadcn/ui |
| **Charts** | Recharts |
| **Icons** | Lucide React |
| **Testing** | Vitest + React Testing Library |
| **Theme** | next-themes |

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ 
- pnpm, yarn, or npm
- A [Supabase](https://supabase.com) project

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/logbook.io.git
   cd logbook.io
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   yarn install
   # or
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

4. **Set up the database**
   
   - Go to your Supabase project dashboard
   - Navigate to **SQL Editor**
   - Run the contents of `supabase-schema.sql`
   - For incremental updates, run migration files from `/migrations` folder

5. **Configure Google OAuth in Supabase**
   
   - In Supabase Dashboard, go to **Authentication** → **Providers**
   - Enable **Google** and add your OAuth credentials
   - Set the redirect URL to: `http://localhost:3000/auth/callback` (or your production URL)

6. **Start the development server**
   ```bash
   pnpm run dev
   ```

7. **Open the app**

   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Schema

### Tables

| Table | Description |
|-------|-------------|
| `profiles` | User profiles (auto-created on signup) |
| `vehicles` | User vehicles with localization overrides |
| `records` | Expense/event records linked to vehicles |

### Key Features

- **Row Level Security (RLS)** — Users can only access their own data
- **Automatic profile creation** — Trigger on user signup
- **Single default vehicle** — Enforced via database trigger
- **Optimized indexes** — For user_id, date, and category queries

## 📖 Usage Guide

### Adding a Vehicle

1. Navigate to **Cars** page
2. Click **+ Add Vehicle** (or use the + FAB button)
3. Fill in vehicle details:
   - Make, Model, Year
   - Plate Number
   - Current Mileage
   - Optional: Mark as Default Vehicle
4. Click **Add Vehicle**

### Recording an Expense

1. Click the **+ FAB** button (floating action button)
2. Select the vehicle (default vehicle pre-selected if set)
3. Choose a category (Fuel, Service, etc.)
4. Enter title, date, cost, and mileage
5. Optional: Add description or mark as event
6. Click **Add Record**

> 💡 Vehicle mileage auto-updates if the record's mileage is higher than current.

### Viewing Analytics

Navigate to **Analytics** to see:
- **Total Expenses** — Sum of all recorded expenses
- **Expenses by Category** — Pie chart breakdown
- **Recent Records** — Last 10 expense entries

### Configuring Settings

1. Go to **Profile** → **Settings** tab
2. Set your defaults:
   - Country (auto-fills currency, units, date format)
   - Currency (13 options with symbols)
   - Distance Unit (mi/km)
   - Volume Unit (gal/l)
   - Date Format (3 formats)
3. Click **Save Settings**

## 🧪 Running Tests

```bash
# Run tests in watch mode
pnpm test

# Run tests once
pnpm test:run
```

## 📦 Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm run dev` | Start development server |
| `pnpm run build` | Build for production |
| `pnpm run start` | Start production server |
| `pnpm run lint` | Run ESLint |
| `pnpm test` | Run tests in watch mode |
| `pnpm test:run` | Run tests once |

## 🌍 Supported Countries & Localization

Logbook.io supports 15+ countries with automatic currency, unit, and date format presets:

| Country | Currency | Distance | Volume | Date Format |
|---------|----------|----------|--------|-------------|
| United States | USD | mi | gal | MM/DD/YYYY |
| Canada | CAD | km | l | MM/DD/YYYY |
| United Kingdom | GBP | mi | gal | DD/MM/YYYY |
| Germany | EUR | km | l | DD/MM/YYYY |
| France | EUR | km | l | DD/MM/YYYY |
| Australia | AUD | km | l | DD/MM/YYYY |
| Japan | JPY | km | l | YYYY-MM-DD |
| ...and more | | | | |

## 🔐 Security

- **Row Level Security (RLS)** enabled on all tables
- **Server-side session validation** via Supabase SSR
- **Protected routes** via Next.js middleware
- **User-scoped queries** — all data filtered by authenticated user ID

## 🚀 Deployment

### Deploy on Vercel

The easiest way to deploy is using the [Vercel Platform](https://vercel.com/new):

1. Push your code to a Git repository
2. Import your project in Vercel
3. Add environment variables in Vercel settings
4. Deploy!

### Environment Variables for Production

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

### Post-Deployment

1. Update Google OAuth redirect URL in Supabase to your production domain
2. Run `supabase-schema.sql` in your production Supabase instance
3. Apply any migrations from `/migrations` folder

## 📝 Migration History

| Version | Date | Feature |
|---------|------|---------|
| 001 | 2026-02-28 | User Settings & Vehicle Localization |
| 002 | 2026-02-28 | Default Vehicle Feature |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org) — The React Framework
- [Supabase](https://supabase.com) — Open Source Firebase Alternative
- [shadcn/ui](https://ui.shadcn.com) — Beautiful UI components
- [Radix UI](https://radix-ui.com) — Accessible UI primitives
- [Recharts](https://recharts.org) — Composable charting library

---

**Built with ❤️ using Next.js and Supabase**
