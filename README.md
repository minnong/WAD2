# ShareLah - Tool Rental Marketplace

ShareLah is a peer-to-peer tool rental marketplace that allows users to rent out their unused tools and rent tools from others in their community. Built with modern web technologies for a seamless sharing economy experience.

## 🌟 Features

### Core Functionality
- **User Authentication** - Secure Firebase-based authentication system
- **Tool Listings** - Create, browse, and manage tool rental listings
- **Rental Management** - Complete rental workflow from request to completion
- **Real-time Chat** - Communication between renters and tool owners
- **Favorites System** - Save and organize preferred listings
- **User Profiles** - Comprehensive user profiles with ratings and reviews
- **Review System** - Rate and review rental experiences

### User Experience
- **Interactive Dashboard** - Personalized home page with earnings and statistics
- **Advanced Search & Filtering** - Find tools by category, location, price, and availability
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **Dark/Light Theme** - Theme switching with user preference persistence
- **Smooth Animations** - Liquid glass navigation and modern UI animations

### Categories Supported
- 🔨 Construction & Hardware
- 🌿 Gardening & Landscaping
- 📱 Electronics & Gadgets
- 👨‍🍳 Kitchen & Cooking
- 💪 Fitness & Sports
- 📸 Photography & Video
- 🎵 Music & Audio
- 👶 Baby & Kids
- 🎮 Gaming & Entertainment
- 🎨 Arts & Crafts
- 💼 Office & Business
- 🔧 Automotive & Tools

## 🛠️ Technology Stack

### Frontend
- **React 19** - Modern React with latest features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **Lucide React** - Beautiful, customizable icons
- **Three.js** - 3D graphics and animations

### Backend & Services
- **Firebase** - Authentication, Firestore database, and hosting
- **Context API** - State management for auth, listings, rentals, and favorites

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
node --version
npm --version
```

## 🚀 Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd WAD2
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Firebase Configuration**:
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
   - Enable Authentication (Email/Password)
   - Create a Firestore database
   - Add your Firebase config to the project

## 🏃‍♂️ Running the Project

### Development Mode
Start the development server with hot reloading:
```bash
npm run dev
```
Application will be available at `http://localhost:5173`

### Production Build
Build the project for production:
```bash
npm run build
```
Built files will be generated in the `dist` folder.

### Preview Production Build
Preview the production build locally:
```bash
npm run preview
```

### Code Quality
Run ESLint to check for code quality issues:
```bash
npm run lint
```

## 📁 Project Structure

```
WAD2/
├── public/                 # Static assets
│   ├── favicon.png        # App favicon
│   └── vite.svg          # Vite logo
├── src/
│   ├── assets/           # Images, icons, and media files
│   ├── components/       # React components
│   │   ├── ui/          # Reusable UI components
│   │   ├── AuthPage.tsx  # Authentication page
│   │   ├── HomePage.tsx  # Main dashboard
│   │   ├── BrowsePage.tsx # Tool browsing and search
│   │   ├── ListItemPage.tsx # Create new listings
│   │   ├── ListingDetailPage.tsx # Individual listing view
│   │   ├── MyRentalsPage.tsx # Rental management
│   │   ├── FavoritesPage.tsx # User favorites
│   │   ├── ChatPage.tsx  # Messaging system
│   │   ├── ProfilePage.tsx # User profile management
│   │   └── ...          # Other components
│   ├── contexts/        # React Context providers
│   │   ├── AuthContext.tsx # Authentication state
│   │   ├── ThemeContext.tsx # Theme management
│   │   ├── ListingsContext.tsx # Listings state
│   │   ├── RentalsContext.tsx # Rental management
│   │   └── FavoritesContext.tsx # Favorites state
│   ├── services/        # External service integrations
│   ├── App.tsx         # Main application component
│   ├── main.tsx       # Application entry point
│   └── App.css        # Global styles
├── index.html          # HTML template
├── package.json        # Dependencies and scripts
├── tailwind.config.js  # Tailwind CSS configuration
├── vite.config.ts     # Vite configuration
└── tsconfig.json      # TypeScript configuration
```

## 🎯 Key Pages & Routes

### Public Routes
- `/` - Landing page with auto-redirect for authenticated users
- `/auth` - Login and registration

### Protected Routes (Requires Authentication)
- `/home` - Dashboard with personalized content and statistics
- `/browse` - Browse and search available tools
- `/list-item` - Create new tool listings
- `/listing/:id` - View individual listing details
- `/my-rentals` - Manage rental requests and active rentals
- `/favorites` - View saved favorite listings
- `/chat` - Real-time messaging with other users
- `/profile` - User profile and settings
- `/profile/:email` - View other user profiles
- `/settings` - Account settings and preferences

## 🔐 Authentication & Security

- Firebase Authentication for secure user management
- Protected routes with authentication guards
- Session persistence across browser sessions
- Secure user data handling with Firestore security rules

## 🎨 UI/UX Features

- **Liquid Glass Navigation** - Modern glassmorphism design
- **Responsive Layout** - Works seamlessly on all device sizes
- **Dark/Light Mode** - User preference-based theme switching
- **Smooth Animations** - Enhanced user experience with subtle animations
- **Interactive Elements** - Hover effects and micro-interactions

## 🤝 Contributing

1. Create a new branch for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes following the existing code style

3. Run code quality checks:
   ```bash
   npm run lint
   ```

4. Test your changes:
   ```bash
   npm run dev
   ```

5. Build to ensure no compilation errors:
   ```bash
   npm run build
   ```

6. Commit your changes and submit a pull request

## 📝 License

This project is part of a Web Application Development course (WAD2) assignment.

## 🆘 Support

For issues and questions related to this project, please refer to the course materials or contact the development team.
