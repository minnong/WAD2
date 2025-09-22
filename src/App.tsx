import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { ListingsProvider } from './contexts/ListingsContext'
import { RentalsProvider } from './contexts/RentalsContext'
import LandingPage from './components/LandingPage'
import AuthPage from './components/AuthPage'
import HomePage from './components/HomePage'
import BrowsePage from './components/BrowsePage'
import ListItemPage from './components/ListItemPage'
import ListingDetailPage from './components/ListingDetailPage'
import MyRentalsPage from './components/MyRentalsPage'
import FavoritesPage from './components/FavoritesPage'
import ChatPage from './components/ChatPage'
import ProfilePage from './components/ProfilePage'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ListingsProvider>
          <RentalsProvider>
            <Router>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/auth" element={<AuthPage />} />

                {/* Protected routes - require authentication */}
                <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
                <Route path="/browse" element={<ProtectedRoute><BrowsePage /></ProtectedRoute>} />
                <Route path="/list-item" element={<ProtectedRoute><ListItemPage /></ProtectedRoute>} />
                <Route path="/listing/:id" element={<ProtectedRoute><ListingDetailPage /></ProtectedRoute>} />
                <Route path="/my-rentals" element={<ProtectedRoute><MyRentalsPage /></ProtectedRoute>} />
                <Route path="/favorites" element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>} />
                <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

                {/* Catch all route - redirect to landing page */}
                <Route path="*" element={<LandingPage />} />
              </Routes>
            </Router>
          </RentalsProvider>
        </ListingsProvider>
      </ThemeProvider>
    </AuthProvider>
  )
}