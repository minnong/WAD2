# ShareLah - Tool Rental Marketplace

Website Link - https://share-lah.vercel.app

ShareLah is a peer-to-peer tool rental marketplace that allows users to rent out their unused tools and rent tools from others in their community. Built with modern web technologies for a seamless sharing economy experience.

## 🌟 Features

### Core Functionality
- **User Authentication** - Secure Firebase-based authentication system
- **Tool Listings** - Create, browse, and manage tool rental listings with image uploads
- **Rental Management** - Complete rental workflow from request to completion with owner/customer views
- **Email Notifications** - Automated email notifications for rental requests and updates
- **Real-time Updates** - Live updates for rental status and listing changes
- **Favorites System** - Save and organize preferred listings
- **User Profiles** - Comprehensive user profiles with ratings and reviews
- **Review System** - Rate and review rental experiences
- **Map Integration** - Google Maps integration for location-based browsing
- **AI Chat Support** - 24/7 Gemini AI-powered chatbot for user assistance

### User Experience
- **Interactive Dashboard** - Personalized home page with earnings and statistics
- **Advanced Search & Filtering** - Find tools by category, location, price, and availability
- **Mobile-Optimized Layouts** - 2-column grid layouts on mobile for better space utilization
- **Responsive Design** - Fully optimized for desktop, tablet, and mobile devices
- **Dark/Light Theme** - Theme switching with user preference persistence
- **Smooth Animations** - Liquid glass navigation and modern UI animations with glowing effects
- **Standardized UI** - Consistent button styling with rounded corners (rounded-xl)
- **Rental Pages** - Separate dashboard views for customer rentals and owner listings with clear visual distinction

### Categories Supported
- 🔨 Power Tools & Construction
- 🌿 Garden & Landscaping
- 📱 Electronics & Gadgets
- 👨‍🍳 Kitchen Appliances
- 💪 Sports & Fitness
- 📸 Photography & Video
- 🎵 Musical Instruments
- 👶 Baby & Kids
- 🎮 Gaming & Entertainment
- 🎨 Arts & Crafts
- 💼 Office & Business
- 🚗 Automotive Tools

## 🛠️ Technology Stack

### Frontend
- **ReactJS** - Modern React with latest features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **Lucide React** - Beautiful, customizable icons
- **Three.js** - 3D graphics and animations

### Backend & Services
- **Node.js & Express** - Email notification service
- **Firebase** - Authentication, Firestore database, and cloud storage
- **Context API** - State management for auth, listings, rentals, and favorites
- **Google Maps API** - Location services and map integration

### UI Components
- **Radix UI** - Accessible, unstyled UI primitives
- **Class Variance Authority** - CSS-in-JS utility for component variants
- **Tailwind Merge** - Intelligent Tailwind class merging

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18 or higher)
- **npm** (comes with Node.js)

Verify your installations:
```bash
node --version  # Should be v18.0.0 or higher
npm --version   # Should be 8.0.0 or higher
```

## 🚀 Quick Start Guide

### 1. Clone the Repository
```bash
git clone <repository-url>
cd WAD2
```

### 2. Install Dependencies

#### Frontend Dependencies
```bash
npm install
```

#### Backend Dependencies (Email Service)
```bash
cd server
npm install
cd ..
```

### 3. Environment Configuration

Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

Edit `.env` and add your configuration:
```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Google Maps API
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Backend URL (for email service)
VITE_BACKEND_URL=http://localhost:3001

# Gmail Configuration (for email notifications)
GMAIL_USER=your_email@gmail.com
GMAIL_APP_PASSWORD=your_gmail_app_password
```

### 4. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add project" and follow the setup wizard
3. Enable **Email/Password** authentication in **Authentication** > **Sign-in method**
4. Create a **Firestore Database** (start in test mode)
5. Enable **Cloud Storage** (start in test mode)
6. Get your Firebase configuration from **Project Settings** > **General** > **Your apps**
7. Copy the configuration values to your `.env` file

### 5. Google Maps API Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Enable **Maps JavaScript API** and **Geocoding API**
3. Create an API key in **Credentials**
4. Add the API key to your `.env` file as `VITE_GOOGLE_MAPS_API_KEY`

### 6. Gmail Setup (for Email Notifications)

1. Enable 2-Factor Authentication on your Google Account
2. Go to [App Passwords](https://myaccount.google.com/apppasswords)
3. Create an app password for "Mail"
4. Add the credentials to your `.env` file

## 🏃‍♂️ Running the Application

### Development Mode

Run **both** the frontend and backend servers in separate terminals:

#### Terminal 1 - Frontend
```bash
npm run dev
```
Frontend available at: `http://localhost:5173`

#### Terminal 2 - Backend
```bash
cd server
npm start
```
Backend available at: `http://localhost:3001`

### Production Build
```bash
npm run build
```
Built files will be in the `dist` folder.

## 📁 Project Structure

```
WAD2/
├── public/                      # Static assets and images
├── server/                      # Backend email notification service
│   ├── index.js                # Express server
│   ├── package.json            # Backend dependencies
│   └── requirements.txt        # Dependencies list
├── src/
│   ├── components/             # React page and UI components
│   │   ├── ui/                # Reusable UI components (button, card, etc.)
│   │   ├── AuthPage.tsx       # Login and registration
│   │   ├── HomePage.tsx       # Dashboard/home page
│   │   ├── LandingPage.tsx    # Public landing page
│   │   ├── BrowsePage.tsx     # Browse tools with map
│   │   ├── ListItemPage.tsx   # Create/edit listings
│   │   ├── ListingDetailPage.tsx # Listing details
│   │   ├── MyRentalsPage.tsx  # Rental management (customer & owner)
│   │   ├── FavoritesPage.tsx  # Saved listings
│   │   ├── ProfilePage.tsx    # User profile pages
│   │   ├── ChatPage.tsx       # Chat interface
│   │   ├── ChatBot.tsx        # AI chatbot component
│   │   ├── RentalCalendar.tsx # Calendar for rentals
│   │   ├── ReviewsSection.tsx # Reviews display
│   │   ├── LeaderboardPage.tsx # Leaderboard
│   │   ├── LiquidGlassNav.tsx # Navigation component
│   │   ├── LiquidEther.tsx    # Background animation
│   │   ├── ProtectedRoute.tsx # Route protection wrapper
│   │   ├── PrivacyPolicy.tsx  # Privacy policy page
│   │   ├── TermsOfService.tsx # Terms of service page
│   │   ├── CookiePolicy.tsx   # Cookie policy page
│   │   └── NotFoundPage.tsx   # 404 error page
│   ├── contexts/              # State management (Context API)
│   │   ├── AuthContext.tsx    # Authentication state
│   │   ├── ThemeContext.tsx   # Dark/Light theme state
│   │   ├── ListingsContext.tsx # Listings state management
│   │   ├── RentalsContext.tsx # Rentals state management
│   │   ├── ChatContext.tsx    # Chat state management
│   │   └── FavoritesContext.tsx # Favorites state management
│   ├── services/              # External services and APIs
│   │   ├── firebase.ts        # Firebase config and methods
│   │   ├── emailService.ts    # Email notification service
│   │   ├── gemini.ts          # Gemini AI chatbot service
│   │   └── userSettings.ts    # User settings service
│   ├── config/                # Configuration files
│   │   └── firebase.ts        # Firebase initialization
│   ├── hooks/                 # Custom React hooks
│   ├── utils/                 # Utility functions
│   ├── App.tsx                # Main app component
│   ├── App.css                # Global styles
│   └── main.tsx               # Entry point
├── .env.example               # Environment variables template
├── .env                       # Your environment variables (not committed)
├── tailwind.config.js         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
├── vite.config.ts             # Vite configuration
├── package.json               # Frontend dependencies
├── package-lock.json          # Dependency lock file
└── README.md                  # This file
```

## 🎯 Key Pages & Routes

### Public Routes
- `/` - Landing page
- `/auth` - Login and registration

### Protected Routes
- `/home` - Dashboard
- `/browse` - Browse tools with map
- `/list-item` - Create listings
- `/listing/:id` - Listing details
- `/my-rentals` - Rental management
- `/favorites` - Saved listings
- `/profile` - User profile
- `/profile/:email` - View other profiles

## 🤖 AI Declaration

This project utilized AI for the following purposes:
- Code Refactoring & Cleanup
- README creation & updates
- Generate commit messages

## 📝 License

This project is part of a Web Application Development course (WAD2) assignment at Singapore Management University.
