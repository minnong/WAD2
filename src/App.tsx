import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
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

export default function App() {
  return (
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
  )
}