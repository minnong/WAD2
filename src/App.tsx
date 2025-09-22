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
import UserSettingsPage from './components/UserSettingsPage'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ListingsProvider>
          <RentalsProvider>
            <Router>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/browse" element={<BrowsePage />} />
                <Route path="/list-item" element={<ListItemPage />} />
                <Route path="/listing/:id" element={<ListingDetailPage />} />
                <Route path="/my-rentals" element={<MyRentalsPage />} />
                <Route path="/favorites" element={<FavoritesPage />} />
                <Route path="/chat" element={<ChatPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/settings" element={<UserSettingsPage />} />
              </Routes>
            </Router>
          </RentalsProvider>
        </ListingsProvider>
      </ThemeProvider>
    </AuthProvider>
  )
}