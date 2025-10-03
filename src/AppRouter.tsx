import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SplashScreen from './pages/SplashScreen';
import Onboarding from './pages/Onboarding';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import PostAd from './pages/PostAd';
import PostAdForm from './pages/PostAdForm';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import Search from './pages/Search';
import CategoryPage from './pages/CategoryPage';
import AllListings from './pages/AllListings';
import TrendingPage from './pages/TrendingPage';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import Settings from './pages/Settings';
import EditProfile from './pages/EditProfile';
import { useAuth } from './contexts/AuthContext';
import ChatList from './pages/ChatList';
export function AppRouter() {
  const {
    isGuest
  } = useAuth();
  // Check if user is authenticated or in guest mode
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  // Define routes that are accessible to guests
  const guestAccessibleRoutes = ['/home', '/search', '/product', '/category', '/all-listings', '/trending'];
  // Check if the current path is accessible to guests
  const isGuestAccessible = (path: string) => {
    return guestAccessibleRoutes.some(route => path.startsWith(route));
  };
  // Route guard component
  const ProtectedRoute = ({
    element,
    path
  }: {
    element: JSX.Element;
    path: string;
  }) => {
    if (isAuthenticated) {
      // If in guest mode, restrict access to non-guest routes
      if (isGuest && !isGuestAccessible(path)) {
        return <Navigate to="/login" state={{
          from: path,
          message: 'Please sign in to access this feature'
        }} />;
      }
      return element;
    }
    return <Navigate to="/login" />;
  };
  return <BrowserRouter>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/onboarding" element={<Onboarding />} />
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        {/* Protected Routes */}
        <Route path="/home" element={<ProtectedRoute element={<Home />} path="/home" />} />
        <Route path="/search" element={<ProtectedRoute element={<Search />} path="/search" />} />
        <Route path="/product/:id" element={<ProtectedRoute element={<ProductDetail />} path="/product/:id" />} />
        <Route path="/post-ad" element={<ProtectedRoute element={<PostAd />} path="/post-ad" />} />
        <Route path="/post-ad/:categoryId" element={<ProtectedRoute element={<PostAdForm />} path="/post-ad/:categoryId" />} />
        <Route path="/chat" element={<ProtectedRoute element={<Chat />} path="/chat" />} />
        <Route path="/chat-list" element={<ProtectedRoute element={<ChatList />} path="/chat-list" />} />
        <Route path="/profile" element={<ProtectedRoute element={<Profile />} path="/profile" />} />
        <Route path="/category/:id" element={<ProtectedRoute element={<CategoryPage />} path="/category/:id" />} />
        <Route path="/all-listings" element={<ProtectedRoute element={<AllListings />} path="/all-listings" />} />
        <Route path="/trending" element={<ProtectedRoute element={<TrendingPage />} path="/trending" />} />
        <Route path="/settings" element={<ProtectedRoute element={<Settings />} path="/settings" />} />
        <Route path="/edit-profile" element={<ProtectedRoute element={<EditProfile />} path="/edit-profile" />} />
      </Routes>
    </BrowserRouter>;
}